// Server fetches cannot resolve the browser-only /backend proxy path.
export function resolveServerApi(env = process.env) {
    const configured = env.API_URL || env.NEXT_PUBLIC_API_URL;
    const value = configured || 'https://indianrentals-3ugl.onrender.com';
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
        throw new Error('Configure API_URL as an absolute HTTP(S) API origin');
    }
    return value.replace(/\/$/, '');
}
export async function fetchPublicJson(path, options = {}) {
    const response = await fetch(`${resolveServerApi()}${path}`, {
        ...options, signal: options.signal || AbortSignal.timeout(10000),
    });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`Public content is temporarily unavailable (${response.status})`);
    return response.json();
}
