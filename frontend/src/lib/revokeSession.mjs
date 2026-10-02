export async function revokeSession(api, token, fetcher = fetch) {
    const request = headers => fetcher(`${api}/api/auth/logout`, {
        method: 'POST', credentials: 'include', cache: 'no-store', headers,
        signal: AbortSignal.timeout(10000),
    });
    let response = await request(token ? { Authorization: `Bearer ${token}` } : {});
    // A stale bearer can hide a newer valid HttpOnly cookie. Give the server
    // one cookie-only attempt before treating a 401 as an ended session.
    if (response.status === 401 && token) response = await request({});
    if (response.status === 401) return;
    if (!response.ok) throw new Error('Could not end your sessions. Please try again.');
    const body = await response.json().catch(() => null);
    if (body?.message !== 'Logged out successfully') throw new Error('Could not confirm sign out. Please try again.');
}
