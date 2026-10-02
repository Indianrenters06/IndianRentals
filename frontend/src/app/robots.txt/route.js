import { SITE_URL } from '@/config/site';
import { fetchPublicJson } from '@/lib/serverApi.mjs';
import { safeRobotsText } from '@/lib/seo.mjs';
export const revalidate = 3600;
export async function GET() {
    let settings;
    try { settings = await fetchPublicJson('/api/settings', { next: { revalidate } }); }
    catch { /* Safe fallback still includes private paths and the sitemap. */ }
    return new Response(safeRobotsText(settings?.robotsTxt, SITE_URL), {
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600, s-maxage=3600' },
    });
}
