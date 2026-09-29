import { NextResponse } from 'next/server';

export function proxy(request) {
    const response = NextResponse.next();
    if (request.nextUrl.searchParams.has('cmsPreview')) {
        response.headers.set('X-Robots-Tag', 'noindex, nofollow');
        response.headers.set('Referrer-Policy', 'no-referrer');
        response.headers.set('Cache-Control', 'private, no-store');
    }
    return response;
}
