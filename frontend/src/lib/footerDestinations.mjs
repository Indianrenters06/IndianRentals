// Missing/placeholder settings must not masquerade as working external actions.
export function socialDestination(value, platform) {
    try {
        const url = new URL(value);
        const domains = { facebook: ['facebook.com', 'www.facebook.com'], instagram: ['instagram.com', 'www.instagram.com'], linkedin: ['linkedin.com', 'www.linkedin.com'] };
        return url.protocol === 'https:' && domains[platform]?.includes(url.hostname) && url.pathname !== '/' && !url.username && !url.password ? url.href : null;
    } catch { return null; }
}
export function whatsappDestination(value) {
    const digits = String(value || '').replace(/\D/g, '');
    // The supplied configuration must contain a plausible business number;
    // the known seed/sample contacts are unavailable actions.
    if (!/^91[6-9]\d{9}$/.test(digits) || ['911234567890', '919999999999'].includes(digits)) return null;
    return `https://wa.me/${digits}`;
}
export function footerDestination(value) {
    if (typeof value !== 'string' || !value || value === '#' || value === '/b2b') return null;
    const aliases = { '/shipping-policy': '/shipping', '/ticket': '/contact', '/reviews': '/#customer-reviews', '/rental-policy': '/terms', '/delivery-policy': '/shipping' };
    if (value.startsWith('/') && !value.startsWith('//')) return aliases[value] || value;
    try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password ? url.href : null; } catch { return null; }
}
