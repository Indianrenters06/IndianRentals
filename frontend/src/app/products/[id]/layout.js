// Server component: dynamic SEO metadata + Product structured data for each
// product page. The actual page (page.js) remains a client component.
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE, API } from "@/config/site";

const stripHtml = (s = "") => s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

async function getProduct(id) {
    try {
        const res = await fetch(`${API}/api/products/${id}`, { next: { revalidate: 3600 } });
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }) {
    const { id } = await params;
    const product = await getProduct(id);
    if (!product) {
        return {
            title: "Product",
            description: `Rent premium tech and equipment from ${SITE_NAME}.`,
        };
    }
    const desc =
        stripHtml(product.description).slice(0, 160) ||
        `Rent ${product.name} from ${SITE_NAME} — flexible plans with doorstep delivery across India.`;
    const image = product.images?.[0] || DEFAULT_OG_IMAGE;
    return {
        title: product.name,
        description: desc,
        alternates: { canonical: `/products/${id}` },
        openGraph: {
            type: "website",
            title: `${product.name} | ${SITE_NAME}`,
            description: desc,
            url: `/products/${id}`,
            images: [{ url: image, alt: product.name }],
        },
        twitter: {
            card: "summary_large_image",
            title: product.name,
            description: desc,
            images: [image],
        },
    };
}

export default async function ProductLayout({ children, params }) {
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
            availability: product.isActive === false
                ? "https://schema.org/OutOfStock"
                : "https://schema.org/InStock",
            seller: { "@type": "Organization", name: SITE_NAME },
        },
    };

    return (
        <>
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            {children}
        </>
    );
}
