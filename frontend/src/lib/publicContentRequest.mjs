// Only explicitly public published CMS URLs are eligible. Preview data is never cached.
const requests = new Map();
export function publicContentRequest(url, options = {}) {
    const parsed = new URL(url, 'http://localhost');
    const eligible = typeof window !== 'undefined' && /^\/api\/cms\/[^/]+$/.test(parsed.pathname)
        && !parsed.search && !parsed.hash && (options.method || 'GET').toUpperCase() === 'GET'
        && !new Headers(options.headers).has('authorization') && !options.signal;
    const requestOptions = { cache: 'no-store', ...options, signal: options.signal || AbortSignal.timeout(5000) };
    if (!eligible) return fetch(url, requestOptions);
    let pending = requests.get(url);
    if (!pending) {
        pending = fetch(url, requestOptions);
        requests.set(url, pending);
        pending.then(response => {
            if (!response.ok) requests.delete(url);
            else setTimeout(() => { if (requests.get(url) === pending) requests.delete(url); }, 5000);
        }, () => { if (requests.get(url) === pending) requests.delete(url); });
    }
    // Each consumer owns its body stream; deduplication must not consume another reader.
    return pending.then(response => response.clone());
}
