const { test } = require('node:test');
const assert = require('node:assert/strict');
const { allowedOrigins, corsOptions, cookieOriginGuard, accessLog } = require('../utils/httpPolicy');
const { publicSettings } = require('../utils/publicSettings');
const { catalogueQuery, reviewInput } = require('../utils/catalogueQuery');
const { loadSource, invoke } = require('./helpers');

test('S11: production credentialed CORS accepts only exact owned deployments', () => {
    const origins = allowedOrigins({ NODE_ENV: 'production', FRONTEND_URL: 'https://owned.example.test' });
    const check = origin => { let result; corsOptions(origins).origin(origin, (_error, allowed) => { result = allowed; }); return result; };
    assert.equal(check('https://owned.example.test'), true);
    for (const origin of ['https://attacker.netlify.app', 'https://indian-rentals-evil.vercel.app', 'https://1-2-3-4.sslip.io', 'http://localhost:3000', 'null']) assert.equal(check(origin), false);
    assert.equal(check(undefined), true); // non-browser webhook/bearer clients
    assert.throws(() => allowedOrigins({ FRONTEND_URL: 'https://owned.example.test/token?secret=x' }));
});
test('S11: cookie writes require trusted Origin; explicit bearer calls and public webhooks remain possible', () => {
    const guard = cookieOriginGuard(new Set(['https://owned.example.test']));
    for (const origin of [undefined, 'https://evil.example.test']) { let next = false; const response = { status(n) { this.code = n; return this; }, json() {} }; guard({ method: 'POST', headers: { origin }, cookies: { jwt: 'synthetic' } }, response, () => { next = true; }); assert.equal(next, false); assert.equal(response.code, 403); }
    for (const request of [{ method: 'POST', headers: {}, cookies: {} }, { method: 'POST', headers: { authorization: 'Bearer synthetic' }, cookies: { jwt: 'synthetic' } }, { method: 'PUT', headers: { origin: 'https://owned.example.test' }, cookies: { jwt: 'synthetic' } }]) { let next = false; guard(request, {}, () => { next = true; }); assert.ok(next); }
});
test('S12: public settings omit present and future secrets, including nested fields', () => {
    const result = publicSettings({ siteName: 'Synthetic', paymentGatewaySecret: 'synthetic-secret', futureSecret: 'synthetic', theme: { activeTheme: 'default', privateToken: 'synthetic' }, socialLinks: { linkedin: 'https://example.test', credential: 'synthetic' }, navbarLinks: [{ name: 'Catalog', href: '/products', secret: 'synthetic' }] });
    assert.equal(result.siteName, 'Synthetic'); assert.doesNotMatch(JSON.stringify(result), /secret|credential|privateToken/i);
});
test('S14: access logs omit preview queries, bearer/cookie, referrer and identity metadata', () => {
    const result = accessLog({ status: () => '200', 'response-time': () => '1' }, { method: 'GET', path: '/api/cms/homepage/preview', originalUrl: '/api/cms/homepage/preview?token=synthetic-secret', headers: { referer: 'synthetic-secret', authorization: 'synthetic-secret' } }, {});
    assert.equal(result, 'GET /api/cms/homepage/preview 200 1ms');
});
test('S17: pagination rejects zero/negative/fractional/unbounded values and search is literal', () => {
    for (const limit of ['0', '-1', '1.5', '101', 'Infinity', ['10']]) assert.throws(() => catalogueQuery({ limit }));
    for (const pageNumber of ['0', '-1', '10001']) assert.throws(() => catalogueQuery({ pageNumber }));
    assert.throws(() => catalogueQuery({ keyword: 'a'.repeat(101) }));
    assert.throws(() => catalogueQuery({ minPrice: 'x' }));
    assert.equal(catalogueQuery({ keyword: '(a+)+$' }).query.$or[0].name.$regex, '\\(a\\+\\)\\+\\$');
    assert.equal(catalogueQuery({ limit: '100', pageNumber: '2' }).page, 2);
});
test('F5: invalid ratings, oversized and non-text comments are rejected; valid input is retained', () => {
    for (const rating of [999, 0, 1.5, '5', null]) assert.throws(() => reviewInput({ rating, comment: 'Synthetic review' }));
    for (const comment of ['', ' ', 'a'.repeat(2001), {}, null]) assert.throws(() => reviewInput({ rating: 5, comment }));
    assert.deepEqual(reviewInput({ rating: 5, comment: ' Synthetic review ' }), { rating: 5, comment: 'Synthetic review' });
});
test('F5: server review validation happens before DB reads/writes and atomic predicate guards duplicates', async () => {
    let writes = 0; let filter; let pipeline; let updateOptions;
    const controller = loadSource('controllers/productController.js', { '../models/Product': { findOneAndUpdate: async (query, update, options) => { writes++; filter = query; pipeline = update; updateOptions = options; return {}; } } });
    const req = { user: { _id: 'aaaaaaaaaaaaaaaaaaaaaaaa', role: 'customer', name: 'Synthetic' }, params: { id: 'bbbbbbbbbbbbbbbbbbbbbbbb' } };
    const bad = await invoke(controller.createProductReview, { ...req, body: { rating: 999, comment: 'a'.repeat(3000) } }); assert.equal(bad.statusCode, 400); assert.equal(writes, 0);
    const good = await invoke(controller.createProductReview, { ...req, body: { rating: 5, comment: 'Synthetic' } }); assert.equal(good.statusCode, 201); assert.equal(filter['reviews.user'].$ne, req.user._id); assert.ok(pipeline[0].$set.reviews.$concatArrays[1].$literal); assert.equal(updateOptions.updatePipeline, true);
});
test('F6: publishing rejects missing/deactivated selections but accepts current public references', async () => {
    const id = 'aaaaaaaaaaaaaaaaaaaaaaaa';
    const fixture = available => loadSource('utils/cmsProductReferences.js', { '../models/Product': { find: () => ({ select: async () => available }) } }).validateProductReferences;
    await assert.rejects(fixture([])({ bestRentedProductIds: [id] }), /missing or unpublished/);
    await fixture([{ _id: id }])({ bestRentedProductIds: [id] });
    await assert.rejects(fixture([])({ bestRentedProductIds: ['https://example.test'] }), /Invalid product selections/);
});
function googleFixture(info, profile, user) {
    let reads = 0, saves = 0, issued = 0;
    process.env.GOOGLE_CLIENT_ID = 'synthetic-client';
    const handler = loadSource('controllers/authController.js', {
        'google-auth-library': { OAuth2Client: class { async getTokenInfo() { return info; } } },
        '../models/User': { findOne: async () => { reads++; return { _id: 'synthetic', isActive: true, ...user, save: async () => { saves++; } }; } },
        '../utils/generateToken': () => { issued++; return 'synthetic'; },
    }, { fetch: async () => ({ ok: true, json: async () => profile }) }).googleLogin;
    return { handler, counts: () => ({ reads, saves, issued }) };
}
for (const [label, info, profile] of [
    ['wrong audience', { aud: 'other-client', expiry_date: Date.now() + 60000 }, { email_verified: true }],
    ['expired token', { aud: 'synthetic-client', expiry_date: 1 }, { email_verified: true }],
    ['unverified email', { aud: 'synthetic-client', expiry_date: Date.now() + 60000 }, { email: 'synthetic@example.test', sub: 'synthetic', email_verified: false }],
]) test(`S18: rejects ${label} before account linking`, async () => {
    const f = googleFixture(info, profile, {}); const result = await invoke(f.handler, { body: { access_token: 'synthetic' } }); assert.ok(result.statusCode >= 400); assert.deepEqual(f.counts(), { reads: 0, saves: 0, issued: 0 });
});
test('S18: verified identity with matching audience can sign in; conflicting subject cannot', async () => {
    const info = { aud: 'synthetic-client', expiry_date: Date.now() + 60000 }, profile = { email: 'synthetic@example.test', sub: 'synthetic-sub', email_verified: true };
    const good = googleFixture(info, profile, { role: 'customer', googleId: 'synthetic-sub' }); assert.equal((await invoke(good.handler, { body: { access_token: 'synthetic' } })).statusCode, 200); assert.equal(good.counts().issued, 1);
    const bad = googleFixture(info, profile, { googleId: 'another-sub' }); assert.equal((await invoke(bad.handler, { body: { access_token: 'synthetic' } })).statusCode, 401); assert.equal(bad.counts().issued, 0);
});
