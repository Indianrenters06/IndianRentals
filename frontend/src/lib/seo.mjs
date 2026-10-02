export const PRIVATE_PATHS = [
    '/login', '/register', '/cart', '/checkout', '/profile', '/order-confirmation',
    '/homepage-demo', '/contact-demo', '/figma-preview',
];
export const privateRobots = {
    index: false, follow: false,
    googleBot: { index: false, follow: false, noimageindex: true },
};
export function plainText(value = '') {
    return String(value).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}
// Crawl rules are per user-agent group: named AI groups do not inherit '*'.
export function safeRobotsText(value, siteUrl) {
    const lines = String(value || '').slice(0, 50000).split(/\r?\n/)
        .filter(line => !/^\s*sitemap\s*:/i.test(line));
    const groups = [];
    let group = [], rulesStarted = false;
    for (const line of lines) {
        if (/^\s*user-agent\s*:/i.test(line)) {
            if (rulesStarted) { groups.push(group); group = []; }
            rulesStarted = false;
        } else if (/^\s*(?:allow|disallow|crawl-delay)\s*:/i.test(line)) rulesStarted = true;
        group.push(line);
    }
    if (group.length) groups.push(group);
    if (!groups.some(g => g.some(line => /^\s*user-agent\s*:\s*\*\s*$/i.test(line)))) {
        groups.push(['User-agent: *', 'Allow: /']);
    }
    return groups.map(g => {
        if (!g.some(line => /^\s*user-agent\s*:/i.test(line))) return g.join('\n');
        // Remove explicit private-route Allow rules that would override a disallow.
        const safe = g.filter(line => !/^\s*allow\s*:/i.test(line) || !PRIVATE_PATHS.some(p => {
            const path = line.replace(/^\s*allow\s*:\s*/i, '').split('#')[0].trim();
            return path.startsWith(p);
        }));
        return [...safe, ...PRIVATE_PATHS.map(path => `Disallow: ${path}`)].join('\n');
    }).join('\n\n').trim() + `\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
}
export function validProductId(id) { return typeof id === 'string' && /^[0-9a-f]{24}$/i.test(id); }
