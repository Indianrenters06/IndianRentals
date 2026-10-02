import { buildCsp } from './src/lib/csp.mjs';

// Baseline security headers. The admin panel is never embedded anywhere,
// so framing is denied outright (blocks clickjacking of admin actions).
const securityHeaders = [
  { key: 'Content-Security-Policy', value: buildCsp({ admin: true, development: process.env.NODE_ENV !== 'production', env: process.env }) },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  agentRules: false,
  turbopack: { root: process.cwd() },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
