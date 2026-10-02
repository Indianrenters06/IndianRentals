import { buildCsp } from './src/lib/csp.mjs';

// Enforcing baseline; the request proxy supplies per-response script nonces for HTML.
const securityHeaders = [
  { key: 'Content-Security-Policy', value: buildCsp({ admin: false, development: process.env.NODE_ENV !== 'production', env: process.env }) },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['127.0.0.1', ...(process.env.LAN_DEV_ORIGIN ? [process.env.LAN_DEV_ORIGIN] : [])],
  poweredByHeader: false,
  agentRules: false,
  turbopack: { root: process.cwd() },
  async redirects() {
    return [{ source: '/images/macbook-pro.png', destination: '/images/macbook-pro.jpg', permanent: true }];
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'store.storeimages.cdn-apple.com' },
      // Admin-uploaded images via backend (local dev + Render deploy)
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: '127.0.0.1' },
      { protocol: 'https', hostname: '*.onrender.com' },
      // Other common CDN/upload sources
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'cdn.jsdelivr.net' },
      { protocol: 'https', hostname: '*.amazonaws.com' },
    ],
  },
};

export default nextConfig;
