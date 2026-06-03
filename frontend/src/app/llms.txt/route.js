// Dynamic llms.txt — an LLM-friendly Markdown summary of the site, managed from
// the admin panel (Settings → SEO & robots.txt) and stored on the backend.
// See https://llmstxt.org for the proposed standard.
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const revalidate = 3600;

const FALLBACK = `# IndianRenters.com

> India's largest tech rental platform — rent laptops, MacBooks, servers, cameras, AV and office equipment.

## Key Pages
- [Products](https://indianrenters.com/products)
- [Categories](https://indianrenters.com/categories)`;

export async function GET() {
    let body = FALLBACK;
    try {
        const res = await fetch(`${API}/api/settings`, { next: { revalidate } });
        if (res.ok) {
            const data = await res.json();
            if (data?.llmsTxt && data.llmsTxt.trim()) body = data.llmsTxt;
        }
    } catch {
        // keep fallback
    }
    return new Response(body, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
    });
}
