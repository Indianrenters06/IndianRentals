// Policy values are origins, never request/query strings or CMS content.
const PROVIDER_CONNECT = ['https://sdk.cashfree.com', 'https://api.cashfree.com', 'https://sandbox.cashfree.com', 'https://payments.cashfree.com', 'https://test.cashfree.com', 'https://accounts.google.com', 'https://oauth2.googleapis.com', 'https://www.googleapis.com', 'https://www.google-analytics.com', 'https://region1.google-analytics.com', 'https://www.googletagmanager.com'];
const PROVIDER_FRAMES = ['https://sdk.cashfree.com', 'https://payments.cashfree.com', 'https://test.cashfree.com', 'https://sandbox.cashfree.com', 'https://accounts.google.com'];
const IMAGE_ORIGINS = ['https://res.cloudinary.com', 'https://images.unsplash.com', 'https://upload.wikimedia.org', 'https://store.storeimages.cdn-apple.com', 'https://lh3.googleusercontent.com', 'https://avatars.githubusercontent.com', 'https://cdn.jsdelivr.net'];
const BASE_API = 'https://indianrentals-3ugl.onrender.com';

export function configuredOrigins(values, { development = false } = {}) {
    const origins = new Set();
    for (const value of values.filter(Boolean).flatMap(value => String(value).split(/[\s,]+/))) {
        if (!value || value.startsWith('/')) continue; // Same-origin API proxy.
        let url;
        try { url = new URL(value); } catch { throw new Error('Invalid CSP origin configuration'); }
        const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
        if (url.hostname.includes("*") || url.username || url.password || url.search || url.hash ||
            !(url.protocol === 'https:' || (url.protocol === 'http:' && (development || local)))) {
            throw new Error('CSP origins must use HTTPS (HTTP is allowed for local development)');
        }
        origins.add(url.origin);
    }
    return [...origins];
}

export function buildCsp({ nonce, admin = false, development = false, env = {} } = {}) {
    if (nonce && !/^[A-Za-z0-9+/_-]+={0,2}$/.test(nonce)) throw new Error('Invalid CSP nonce');
    const api = configuredOrigins([env.NEXT_PUBLIC_API_URL || BASE_API, env.API_URL, env.CSP_CONNECT_ORIGINS], { development });
    const image = configuredOrigins([env.CSP_IMG_ORIGINS], { development });
    const frames = configuredOrigins([env.CSP_FRAME_ORIGINS], { development });
    const scripts = nonce ? ["'self'", `'nonce-${nonce}'`, "'strict-dynamic'"] : ["'self'"];
    if (!admin) scripts.push('https://sdk.cashfree.com', 'https://accounts.google.com', 'https://www.googletagmanager.com');
    if (development) scripts.push("'unsafe-eval'"); // Next dev overlay only, never production.
    const directives = {
        'default-src': ["'self'"],
        'base-uri': ["'self'"],
        'object-src': ["'none'"],
        'frame-ancestors': [admin ? "'none'" : "'self'"],
        'script-src': scripts,
        'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', ...(admin ? ['https://cdn.jsdelivr.net'] : [])],
        'img-src': ["'self'", 'data:', 'blob:', ...IMAGE_ORIGINS, ...api, ...image],
        'font-src': ["'self'", 'data:', 'https://fonts.gstatic.com', ...(admin ? ['https://cdn.jsdelivr.net'] : [])],
        'connect-src': ["'self'", ...api, ...(!admin ? PROVIDER_CONNECT : []), ...(development ? ['ws:', 'wss:'] : [])],
        'frame-src': [...(!admin ? PROVIDER_FRAMES : []), ...frames],
        'media-src': ["'self'", 'blob:', 'https://res.cloudinary.com'],
        'form-action': ["'self'"],
    };
    return Object.entries(directives).map(([key, values]) => `${key} ${[...new Set(values.length ? values : ["'none'"])].join(' ')}`).join('; ') + ';';
}
