// Dynamic sitemap.xml — Next.js serves this at /sitemap.xml.
// Lists static pages, category pages, and every product from the API.
import { SITE_URL, API } from "@/config/site";

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
    { path: "/about", priority: 0.5, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.5, changeFrequency: "monthly" },
    { path: "/rental-process", priority: 0.5, changeFrequency: "monthly" },
    { path: "/blog", priority: 0.6, changeFrequency: "weekly" },
    { path: "/faq", priority: 0.4, changeFrequency: "monthly" },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/refund-policy", priority: 0.3, changeFrequency: "yearly" },
];

async function getProducts() {
    try {
        const res = await fetch(`${API}/api/products?limit=2000`, { next: { revalidate } });
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : data.products || [];
    } catch {
        return [];
    }
}

export default async function sitemap() {
    const now = new Date();

    const staticEntries = STATIC_PATHS.map(({ path, priority, changeFrequency }) => ({
        url: `${SITE_URL}${path}`,
        lastModified: now,
        changeFrequency,
        priority,
    }));

    const products = await getProducts();
    const productEntries = products
        .filter((p) => p && p._id)
        .map((p) => ({
            url: `${SITE_URL}/products/${p._id}`,
            lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
            changeFrequency: "weekly",
            priority: 0.7,
        }));

    return [...staticEntries, ...productEntries];
}
