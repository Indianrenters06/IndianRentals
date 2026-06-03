// Dynamic robots.txt — content is managed from the admin panel
// (Settings → SEO & robots.txt) and stored on the backend.
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Re-fetch at most once an hour so admin edits propagate without hammering the API.
export const revalidate = 3600;

// Safe fallback if the backend is unreachable: allow crawling, block private routes.
const FALLBACK = `User-agent: *
Allow: /
Disallow: /checkout
Disallow: /cart
Disallow: /profile`;

export async function GET() {
    let body = FALLBACK;
    try {
        const res = await fetch(`${API}/api/settings`, { next: { revalidate } });
        if (res.ok) {
            const data = await res.json();
            if (data?.robotsTxt && data.robotsTxt.trim()) body = data.robotsTxt;
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
