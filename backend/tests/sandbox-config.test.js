const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../config/cashfree.js'), 'utf8');
function config(env) {
    const module = { exports: {} };
    vm.runInNewContext(source, { module, process: { env } });
    return module.exports;
}
test('Payment: every live alias is refused even when credentials exist', () => {
    for (const mode of ['production', 'prod', 'live', 'PRODUCTION']) {
        const loaded = config({ CASHFREE_ENV: mode, CASHFREE_APP_ID: 'synthetic', CASHFREE_SECRET_KEY: 'synthetic' });
        assert.throws(loaded.assertCashfreeConfigured, error => error.statusCode === 503);
        assert.equal(loaded.cashfreeConfig.baseUrl, 'https://sandbox.cashfree.com/pg');
    }
});
test('Payment: missing credentials fail closed; only sandbox succeeds', () => {
    assert.throws(config({}).assertCashfreeConfigured, error => error.statusCode === 503);
    const loaded = config({ CASHFREE_ENV: 'sandbox', CASHFREE_APP_ID: 'synthetic', CASHFREE_SECRET_KEY: 'synthetic' });
    loaded.assertCashfreeConfigured();
    assert.equal(loaded.cashfreeConfig.mode, 'sandbox');
});
