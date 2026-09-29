const legacyPaths = {
    '/store': '/products',
    '/categories/apple': '/category/apple',
    '/categories/gaming': '/products',
    '/categories/smart-devices': '/products',
};

export function resolveCmsHref(href, fallback = '/products') {
    if (typeof href !== 'string' || !href.trim()) return fallback;
    const value = href.trim();
    return legacyPaths[value] || value;
}
