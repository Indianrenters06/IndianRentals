import { resolveServerApi } from '@/lib/serverApi.mjs';
const REQUEST_HEADER_OMIT = ['host', 'referer', 'content-length', 'connection', 'accept-encoding'];
const RESPONSE_HEADER_OMIT = ['connection', 'content-encoding', 'content-length', 'transfer-encoding'];

export const dynamic = 'force-dynamic';

async function forward(request, { params }) {
  const { path } = await params;
  if (!Array.isArray(path) || path[0] !== 'api') {
    return new Response('Not found', { status: 404 });
  }

  const backend = resolveServerApi();
  const target = new URL(`${backend}/${path.map(encodeURIComponent).join('/')}`);
  target.search = request.nextUrl.search;

  const headers = new Headers(request.headers);
  REQUEST_HEADER_OMIT.forEach((name) => headers.delete(name));

  try {
    const upstream = await fetch(target, {
      method: request.method,
      headers,
      body: request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.arrayBuffer(),
      cache: 'no-store',
      redirect: 'manual',
    });
    const responseHeaders = new Headers(upstream.headers);
    RESPONSE_HEADER_OMIT.forEach((name) => responseHeaders.delete(name));
    return new Response(upstream.body, { status: upstream.status, headers: responseHeaders });
  } catch {
    return Response.json({ message: 'The catalogue is temporarily unavailable.' }, { status: 502 });
  }
}

export const GET = forward;
export const POST = forward;
export const PUT = forward;
export const PATCH = forward;
export const DELETE = forward;
