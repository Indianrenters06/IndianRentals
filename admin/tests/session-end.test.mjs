import test from 'node:test';
import assert from 'node:assert/strict';
import { revokeSession } from '../src/lib/revokeSession.mjs';

const confirmed = () => new Response(JSON.stringify({ message: 'Logged out successfully' }), { status: 200 });

test('logout confirms revocation before browser cleanup and keeps uncertain failures retryable', async () => {
    let request;
    await revokeSession('/backend', 'synthetic', async (url, options) => {
        request = { url, ...options }; return confirmed();
    });
    assert.equal(request.url, '/backend/api/auth/logout');
    assert.equal(request.method, 'POST');
    assert.equal(request.cache, 'no-store');
    assert.equal(request.credentials, 'include');
    assert.equal(request.headers.Authorization, 'Bearer synthetic');
    assert.ok(request.signal instanceof AbortSignal);
    for (const status of [403, 404, 503]) await assert.rejects(revokeSession('/backend', 'synthetic', async () => new Response('', { status })), /Could not end/);
    await assert.rejects(revokeSession('/backend', 'synthetic', async () => new Response('{}')), /Could not confirm/);
    await assert.rejects(revokeSession('/backend', 'synthetic', async () => { throw new TypeError('offline'); }), /offline/);
});

test('stale bearer retries with cookie-only credentials and requires confirmed cookie revocation', async () => {
    const requests = [];
    await revokeSession('/backend', 'stale-synthetic', async (url, options) => {
        requests.push({ url, ...options });
        return requests.length === 1 ? new Response('', { status: 401 }) : confirmed();
    });
    assert.equal(requests.length, 2);
    assert.equal(requests[0].headers.Authorization, 'Bearer stale-synthetic');
    assert.deepEqual(requests[1].headers, {});
    assert.equal(requests[1].credentials, 'include');
    assert.equal(requests[1].method, 'POST');
    assert.equal(requests[1].cache, 'no-store');
    assert.equal(requests[1].url, requests[0].url);
});

test('only the cookie-only 401 proves both available browser credentials are already invalid', async () => {
    let calls = 0;
    await revokeSession('/backend', 'stale-synthetic', async () => {
        calls++; return new Response('', { status: 401 });
    });
    assert.equal(calls, 2);
    calls = 0;
    await revokeSession('/backend', null, async (url, options) => {
        assert.deepEqual(options.headers, {}); calls++; return new Response('', { status: 401 });
    });
    assert.equal(calls, 1);
});

for (const failure of ['503', 'network', 'uncertain-body']) {
    test(`cookie retry ${failure} refuses sign-out acknowledgement and remains retryable`, async () => {
        let calls = 0;
        await assert.rejects(revokeSession('/backend', 'stale-synthetic', async (url, options) => {
            calls++;
            if (calls === 1) return new Response('', { status: 401 });
            assert.deepEqual(options.headers, {});
            if (failure === 'network') throw new TypeError('synthetic offline');
            return failure === '503' ? new Response('', { status: 503 }) : new Response('{}', { status: 200 });
        }), failure === 'network' ? /offline/ : /Could not/);
        assert.equal(calls, 2);
    });
}
