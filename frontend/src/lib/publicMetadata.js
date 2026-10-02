import { SITE_NAME, DEFAULT_OG_IMAGE, absoluteUrl } from '@/config/site';
import { plainText } from './seo.mjs';
export function publicMetadata({ title, description, path, image = DEFAULT_OG_IMAGE, type = 'website' }) {
    const cleanTitle = plainText(title).replace(/\s*\|\s*IndianRenters$/i, '');
    const fullTitle = cleanTitle.toLowerCase() === SITE_NAME.toLowerCase()
        ? `${SITE_NAME} — Rent Laptops, MacBooks, Cameras & Equipment`
        : `${cleanTitle} | ${SITE_NAME}`;
    let shareImage = DEFAULT_OG_IMAGE;
    try {
        const candidate = new URL(image, absoluteUrl('/'));
        if (['http:', 'https:'].includes(candidate.protocol)) shareImage = candidate.toString();
    } catch { /* Keep the trusted share-card fallback. */ }
    const desc = plainText(description).slice(0, 160);
    return {
        title: { absolute: fullTitle }, description: desc,
        alternates: { canonical: absoluteUrl(path) },
        openGraph: { type, siteName: SITE_NAME, title: fullTitle, description: desc,
            url: absoluteUrl(path), images: [{ url: shareImage, ...(shareImage === DEFAULT_OG_IMAGE ? { width: 1200, height: 630 } : {}), alt: cleanTitle }], locale: 'en_IN' },
        twitter: { card: 'summary_large_image', title: fullTitle, description: desc, images: [shareImage] },
    };
}
