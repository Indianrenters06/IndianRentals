const DEVELOPMENT_ORIGINS = ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3001', 'http://127.0.0.1:3001'];
function allowedOrigins(env = process.env) {
    const configured = ['FRONTEND_URL', 'ADMIN_URL', 'FRONTEND_URL_2', 'LOCAL_FRONTEND_URL', 'LOCAL_ADMIN_URL'].map(key => env[key]);
    configured.push(...(env.EXTRA_ORIGINS || '').split(','));
    if (env.NODE_ENV !== 'production') configured.push(...DEVELOPMENT_ORIGINS);
    return new Set(configured.filter(Boolean).map(value => {
        const url = new URL(value.trim());
        if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.pathname !== '/' || url.search || url.hash) throw new Error('Configure an exact HTTP(S) deployment origin');
        return url.origin;
    }));
}
function corsOptions(origins = allowedOrigins()) {
    return { origin: (origin, callback) => callback(null, !origin || origins.has(origin)), credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'] };
}
function cookieOriginGuard(origins = allowedOrigins()) {
    return (req, res, next) => {
        if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
        if (req.headers.origin && !origins.has(req.headers.origin)) return res.status(403).json({ message: 'Untrusted request origin' });
        if (!req.cookies?.jwt || req.headers.authorization?.startsWith('Bearer ')) return next();
        if (!origins.has(req.headers.origin)) return res.status(403).json({ message: 'Untrusted request origin' });
        next();
    };
}
// Never include query values, referrers, IPs, user agents or provider bodies.
function accessLog(tokens, req, res) {
    return `${req.method} ${String(req.path || '/').replace(/[\r\n]/g, '').slice(0, 250)} ${tokens.status(req, res)} ${tokens['response-time'](req, res)}ms`;
}
module.exports = { allowedOrigins, corsOptions, cookieOriginGuard, accessLog };
