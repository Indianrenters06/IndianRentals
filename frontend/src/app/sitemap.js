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
    // Core pages
    { path: "/about", priority: 0.6, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
    { path: "/rental-process", priority: 0.5, changeFrequency: "monthly" },
    { path: "/blog", priority: 0.6, changeFrequency: "weekly" },
    { path: "/faq", priority: 0.5, changeFrequency: "monthly" },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/refund-policy", priority: 0.3, changeFrequency: "yearly" },
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
