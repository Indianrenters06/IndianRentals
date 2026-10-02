import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildCsp, configuredOrigins } from '../src/lib/csp.mjs';
const nonce = 'YmxvY2t1bnRydXN0ZWRzY3JpcHQ=';
const directives = policy => new Map(policy.split(';').filter(Boolean).map(part => {
  const [name, ...values] = part.trim().split(/\s+/); return [name, values];
}));

test('production scripts require a nonce with no inline or eval permission', () => {
  for (const admin of [false, true]) {
    const csp = directives(buildCsp({ nonce, admin }));
    assert.ok(csp.get('script-src').includes(`'nonce-${nonce}'`));
    assert.ok(csp.get('script-src').includes("'strict-dynamic'"));
    assert.ok(!csp.get('script-src').includes("'unsafe-inline'"));
    assert.ok(!csp.get('script-src').includes("'unsafe-eval'"));
    assert.deepEqual(csp.get('object-src'), ["'none'"]);
    assert.deepEqual(csp.get('frame-ancestors'), [admin ? "'none'" : "'self'"]);
    assert.ok(!buildCsp({ admin }).includes("'unsafe-eval'"));
    assert.ok(!directives(buildCsp({ admin })).get('script-src').includes("'unsafe-inline'"));
  }
});

test('only development permits eval, and configured origins are parsed before inclusion', () => {
  assert.ok(directives(buildCsp({ nonce, development: true })).get('script-src').includes("'unsafe-eval'"));
  assert.deepEqual(configuredOrigins(['/backend', 'https://api.example.test/backend', 'https://api.example.test']), ['https://api.example.test']);
  for (const origin of ['https://user:password@api.test', 'https://api.test?token=x', 'https://api.test#x', 'https://*.example.test', 'data:text/javascript,alert(1)', 'http://public.example.test']) {
    assert.throws(() => configuredOrigins([origin]));
  }
  assert.throws(() => buildCsp({ nonce: "x'; script-src *" }));
});

test('API and storage origins are exact and provider access is excluded from admin', () => {
  const env = { NEXT_PUBLIC_API_URL: 'https://api.example.test/backend', CSP_IMG_ORIGINS: 'https://assets.example.test', CSP_FRAME_ORIGINS: 'https://checkout.example.test' };
  const publicPolicy = directives(buildCsp({ nonce, env }));
  assert.ok(publicPolicy.get('connect-src').includes('https://api.example.test'));
  assert.ok(publicPolicy.get('img-src').includes('https://assets.example.test'));
  assert.ok(publicPolicy.get('frame-src').includes('https://checkout.example.test'));
  assert.ok(publicPolicy.get('frame-src').includes('https://test.cashfree.com'));
  assert.ok(!buildCsp({ nonce, env }).includes('*.'));
  assert.ok(!publicPolicy.get('img-src').includes('https:'));
  assert.ok(!buildCsp({ nonce, env, admin: true }).includes('cashfree.com'));
});

test('proxy overwrites caller nonce, sends CSP upstream and disables HTML caching', async () => {
  const proxy = await readFile(new URL('../src/proxy.js', import.meta.url), 'utf8');
  assert.match(proxy, /randomBytes\(18\)/);
  assert.match(proxy, /requestHeaders\.set\('x-nonce', nonce\)/);
  assert.match(proxy, /requestHeaders\.set\('Content-Security-Policy', policy\)/);
  assert.match(proxy, /response\.headers\.set\('Content-Security-Policy', policy\)/);
  assert.match(proxy, /private, no-store/);
  const layout = await readFile(new URL('../src/app/layout.js', import.meta.url), 'utf8');
  assert.match(layout, /force-dynamic/);
  assert.match(layout, /await headers\(\)/);
  assert.match(layout, /nonce=\{nonce\}/);
});
