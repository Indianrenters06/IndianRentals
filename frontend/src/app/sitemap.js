// Dynamic sitemap.xml — Next.js serves this at /sitemap.xml.
// Lists static pages, category pages, and every product from the API.
import { SITE_URL } from "@/config/site";
import { fetchPublicJson } from '@/lib/serverApi.mjs';
import { validProductId } from '@/lib/seo.mjs';
import { categorySlug, subcategorySlug } from '@/lib/categoryRoutes';

export const revalidate = 3600; // refresh hourly

const STATIC_PATHS = [
    { path: "/", priority: 1.0, changeFrequency: "daily" },
    { path: "/products", priority: 0.9, changeFrequency: "daily" },
    { path: "/categories", priority: 0.8, changeFrequency: "weekly" },
    { path: "/category/apple", priority: 0.8, changeFrequency: "weekly" },
    { path: "/category/it-products", priority: 0.8, changeFrequency: "weekly" },
    { path: "/category/av-products", priority: 0.8, changeFrequency: "weekly" },
    { path: "/category/office-equipment", priority: 0.8, changeFrequency: "weekly" },
    { path: "/category/dslr", priority: 0.8, changeFrequency: "weekly" },
    // Core pages
    { path: "/about", priority: 0.6, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
    { path: "/rental-process", priority: 0.5, changeFrequency: "monthly" },
    { path: "/blog", priority: 0.6, changeFrequency: "weekly" },
    { path: "/faq", priority: 0.5, changeFrequency: "monthly" },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
    ...['careers', 'shipping', 'kyc-policy', 'return-policy', 'rules', 'delivery-charges', 'late-fee-rules', 'cancellation-rules', 'subscription-rules'].map(path => ({ path: `/${path}`, priority: 0.3, changeFrequency: 'monthly' })),
    ...['imac', 'ipad', 'iphone', 'mac-mini', 'mac-pro', 'mac-studio', 'macbook-air', 'macbook-pro', 'studio-display', 'xdr-display'].map(path => ({ path: `/category/apple/${path}`, priority: 0.6, changeFrequency: 'weekly' })),
    // Service pages
    { path: "/services", priority: 0.8, changeFrequency: "monthly" },
    { path: "/services/laptop-rental", priority: 0.9, changeFrequency: "monthly" },
    { path: "/services/macbook-rental", priority: 0.9, changeFrequency: "monthly" },
    { path: "/services/camera-rental", priority: 0.8, changeFrequency: "monthly" },
    { path: "/services/av-equipment-rental", priority: 0.8, changeFrequency: "monthly" },
    { path: "/services/server-rental", priority: 0.8, changeFrequency: "monthly" },
    { path: "/services/office-equipment-rental", priority: 0.7, changeFrequency: "monthly" },
    // Location pages
    { path: "/locations", priority: 0.8, changeFrequency: "monthly" },
    { path: "/locations/delhi", priority: 0.9, changeFrequency: "monthly" },
    { path: "/locations/mumbai", priority: 0.9, changeFrequency: "monthly" },
    { path: "/locations/bangalore", priority: 0.9, changeFrequency: "monthly" },
    { path: "/locations/hyderabad", priority: 0.8, changeFrequency: "monthly" },
    { path: "/locations/noida", priority: 0.8, changeFrequency: "monthly" },
    { path: "/locations/pune", priority: 0.8, changeFrequency: "monthly" },
    { path: "/locations/chennai", priority: 0.7, changeFrequency: "monthly" },
    { path: "/locations/kolkata", priority: 0.7, changeFrequency: "monthly" },
];

async function getProducts() {
    const products = [];
    // Respect the catalogue's bounded page size. Never request a giant limit.
    for (let page = 1; ; page++) {
        const data = await fetchPublicJson(`/api/products?page=${page}&limit=100`, { next: { revalidate } });
        if (!data) throw new Error('Catalogue sitemap data unavailable');
        const rows = Array.isArray(data) ? data : data.products;
        if (!Array.isArray(rows)) throw new Error('Invalid catalogue sitemap response');
        products.push(...rows);
        const pages = Number(data.pages || 1);
        if (!Number.isSafeInteger(pages) || pages < 1 || pages > 1000) throw new Error('Invalid catalogue page count');
        if (Array.isArray(data) || page >= pages) break;
        if (page >= 1000) throw new Error('Catalogue requires sitemap sharding');
    }
    return products;
}

export default async function sitemap() {
    // An unavailable API must not publish a deceptively incomplete sitemap.
    const [products, posts, categories] = await Promise.all([
        getProducts(),
        fetchPublicJson('/api/blog?status=published', { next: { revalidate } }),
        fetchPublicJson('/api/categories', { next: { revalidate } }),
    ]);
    if (!Array.isArray(posts) || !Array.isArray(categories)) throw new Error('Public sitemap content unavailable');
    const entries = STATIC_PATHS.map(({ path, priority, changeFrequency }) => ({
        url: `${SITE_URL}${path}`, changeFrequency, priority,
    }));
    for (const product of products.filter(p => validProductId(p?._id) && p.isActive !== false)) {
        entries.push({ url: `${SITE_URL}/products/${product._id}`, ...(product.updatedAt ? { lastModified: new Date(product.updatedAt) } : {}), changeFrequency: 'weekly', priority: 0.7 });
    }
    for (const post of posts.filter(p => p.status === 'published' && (p.slug || validProductId(p._id)))) {
        entries.push({ url: `${SITE_URL}/blog/${encodeURIComponent(post.slug || post._id)}`, ...(post.updatedAt ? { lastModified: new Date(post.updatedAt) } : {}), changeFrequency: 'monthly', priority: 0.6 });
    }
    for (const category of categories) {
        const slug = categorySlug(category);
        if (!slug || category.isActive === false) continue;
        entries.push({ url: `${SITE_URL}/category/${encodeURIComponent(slug)}`, changeFrequency: 'weekly', priority: 0.6 });
        for (const sub of category.subcategories || []) {
            const subSlug = subcategorySlug(sub);
            if (subSlug && sub.isActive !== false) entries.push({ url: `${SITE_URL}/category/${encodeURIComponent(slug)}/${encodeURIComponent(subSlug)}`, changeFrequency: 'weekly', priority: 0.5 });
        }
    }
    return [...new Map(entries.map(entry => [entry.url, entry])).values()];
}
