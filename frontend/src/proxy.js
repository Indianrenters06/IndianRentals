import { randomBytes } from 'node:crypto';
import { NextResponse } from 'next/server';
import { buildCsp } from './lib/csp.mjs';

export function proxy(request) {
    const nonce = randomBytes(18).toString('base64');
    const policy = buildCsp({ nonce, admin: false, development: process.env.NODE_ENV !== 'production', env: process.env });
    const requestHeaders = new Headers(request.headers);
    // Overwrite untrusted incoming values. Next reads CSP to nonce its framework scripts.
    requestHeaders.set('x-nonce', nonce);
    requestHeaders.set('Content-Security-Policy', policy);
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.headers.set('Content-Security-Policy', policy);
    // Request nonces must never be replayed from an HTML edge cache.
    response.headers.set('Cache-Control', 'private, no-store');
    if (request.nextUrl.searchParams.has('cmsPreview')) {
        response.headers.set('X-Robots-Tag', 'noindex, nofollow');
        response.headers.set('Referrer-Policy', 'no-referrer');
    }
    return response;
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|backend|share-image|robots.txt|sitemap.xml|favicon.ico).*)"],
};
