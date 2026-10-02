import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const source = await readFile(new URL('../src/services/cashfree.js', import.meta.url), 'utf8');
const { getCashfree } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
test('Payment SDK refuses production and never loads a script for invalid modes', async () => {
    for (const mode of [undefined, 'production', 'live']) await assert.rejects(() => getCashfree(mode), /Only sandbox/);
});
test('Payment SDK passes only sandbox to the hosted checkout factory', async () => {
    let actual;
    globalThis.window = { Cashfree: options => { actual = options; return { checkout: true }; } };
    try {
        assert.equal((await getCashfree('sandbox')).checkout, true);
        assert.deepEqual(actual, { mode: 'sandbox' });
    } finally { delete globalThis.window; }
});
