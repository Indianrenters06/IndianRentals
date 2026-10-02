import { test } from 'node:test';
import assert from 'node:assert/strict';
import { publicContentRequest } from '../src/lib/publicContentRequest.mjs';
import { socialDestination, whatsappDestination, footerDestination } from '../src/lib/footerDestinations.mjs';

test('public CMS consumers share a request and own separate response streams; preview/account are not reused', async () => {
    const priorFetch = globalThis.fetch, priorWindow = globalThis.window, priorTimeout = globalThis.setTimeout;
    let reads = 0;
    globalThis.window = {}; globalThis.setTimeout = fn => { queueMicrotask(fn); return 0; };
    globalThis.fetch = async (_url, options) => { reads++; assert.ok(options.signal instanceof AbortSignal); return new Response(JSON.stringify({ title: 'Synthetic' })); };
    try {
        const [first, second] = await Promise.all([publicContentRequest('/api/cms/synthetic'), publicContentRequest('/api/cms/synthetic')]);
        assert.equal(reads, 1); assert.deepEqual(await first.json(), await second.json());
        await Promise.all([publicContentRequest('/api/cms/synthetic/preview?token=synthetic'), publicContentRequest('/api/cms/synthetic/preview?token=synthetic')]); assert.equal(reads, 3);
        for (const url of ['/api/users/profile', '/api/cms/synthetic/draft']) {
            const before = reads;
            await Promise.all([publicContentRequest(url), publicContentRequest(url)]);
            assert.equal(reads, before + 2);
        }
        const beforeAuth = reads;
        await Promise.all([1, 2].map(() => publicContentRequest('/api/cms/synthetic', { headers: { Authorization: 'Bearer synthetic' } })));
        assert.equal(reads, beforeAuth + 2);
    } finally { globalThis.fetch = priorFetch; globalThis.setTimeout = priorTimeout; if (priorWindow === undefined) delete globalThis.window; else globalThis.window = priorWindow; }
});
test('footer drops unavailable/unsafe external actions and connects legacy policy/support aliases', () => {
    for (const value of ['#', '', '/b2b', 'javascript:alert(1)', '//evil.test']) assert.equal(footerDestination(value), null);
    assert.equal(footerDestination('/shipping-policy'), '/shipping'); assert.equal(footerDestination('/ticket'), '/contact');
    assert.equal(socialDestination('#', 'facebook'), null); assert.equal(socialDestination('https://evil.test', 'linkedin'), null);
    assert.equal(socialDestination('https://www.instagram.com/synthetic/', 'instagram'), 'https://www.instagram.com/synthetic/');
    assert.equal(whatsappDestination('+91 1234567890'), null); assert.equal(whatsappDestination('+91 9999999999'), null);
    assert.equal(whatsappDestination('+91 9000000001'), 'https://wa.me/919000000001');
});
