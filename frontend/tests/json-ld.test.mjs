import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { serializeJsonLd } from '../src/lib/serializeJsonLd.mjs';

test('catalogue values cannot terminate a JSON-LD script, while JSON values round-trip', () => {
    const value = { name: '</script><script>alert(1)</script>', description: '<!-->&\u2028\u2029', price: 1500 };
    const serialized = serializeJsonLd(value);
    assert.doesNotMatch(serialized, /[<>&\u2028\u2029]/);
    assert.deepEqual(JSON.parse(serialized), value);
});
test('PDP uses the script-safe serializer', () => {
    const source = readFileSync(new URL('../src/app/products/[id]/layout.js', import.meta.url), 'utf8');
    assert.match(source, /__html: serializeJsonLd\(jsonLd\)/);
});
test('blog has no local-only subscription acknowledgement', () => {
    const source = readFileSync(new URL('../src/app/blog/[slug]/page.js', import.meta.url), 'utf8');
    assert.doesNotMatch(source, /handleSubscribe|Thanks for subscribing|setSubscribed/);
});
