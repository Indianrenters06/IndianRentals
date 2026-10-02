import { headers } from 'next/headers';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import { fetchPublicJson } from '@/lib/serverApi.mjs';
import { publicMetadata } from '@/lib/publicMetadata';
import { validProductId } from '@/lib/seo.mjs';
// Server component: dynamic SEO metadata + Product structured data for each
// product page. The actual page (page.js) remains a client component.
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from "@/config/site";
import { serializeJsonLd } from "@/lib/serializeJsonLd.mjs";
import { isProductOutOfStock } from "@/lib/productAvailability";

const stripHtml = (s = "") => s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const getProduct = cache(async id => {
    if (!validProductId(id)) notFound();
    const product = await fetchPublicJson(`/api/products/${id}`, { cache: 'no-store' });
    if (!product) notFound();
    return product;
});

export async function generateMetadata({ params }) {
    const { id } = await params;
    const product = await getProduct(id);
    const desc = product.seoDescription || stripHtml(product.description).slice(0, 160) ||
        `Rent ${product.name} from ${SITE_NAME} — flexible plans with doorstep delivery across India.`;
    return {
        ...publicMetadata({ title: product.seoTitle || product.name, description: desc,
            path: `/products/${id}`, image: product.images?.[0] || DEFAULT_OG_IMAGE }),
        ...(product.seoKeywords ? { keywords: product.seoKeywords } : {}),
    };
}

export default async function ProductLayout({ children, params }) {
    const nonce = (await headers()).get('x-nonce') || undefined;
    const { id } = await params;
    const product = await getProduct(id);

    const jsonLd = product && {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: stripHtml(product.description).slice(0, 500),
        image: product.images?.length ? product.images : [DEFAULT_OG_IMAGE],
        sku: product._id,
        category: product.category,
        brand: { "@type": "Brand", name: product.brand || SITE_NAME },
        offers: {
            "@type": "Offer",
            url: `${SITE_URL}/products/${id}`,
            priceCurrency: "INR",
            price: product.rentalPrice,
            availability: product.isActive === false || isProductOutOfStock(product)
                ? "https://schema.org/OutOfStock"
                : "https://schema.org/InStock",
            seller: { "@type": "Organization", name: SITE_NAME },
        },
    };

    return (
        <>
            {jsonLd && (
                <script
                    nonce={nonce}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
                />
            )}
            {children}
        </>
    );
}
