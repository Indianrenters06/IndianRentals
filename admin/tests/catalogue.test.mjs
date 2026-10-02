import test from 'node:test';
import assert from 'node:assert/strict';
import { loadCatalogue } from '../src/lib/catalogue.mjs';

test('catalogue picker collects bounded pages and deduplicates products', async () => {
  const requests = [];
  const products = await loadCatalogue('https://example.test', { fetcher: async url => {
    requests.push(url);
    return { ok: true, json: async () => ({ pages: 2, products: url.endsWith('pageNumber=1') ? [{ _id: 'a' }] : [{ _id: 'a' }, { _id: 'b' }] }) };
  } });
  assert.deepEqual(products.map(product => product._id), ['a', 'b']);
  assert.deepEqual(requests, ['https://example.test/api/products?limit=100&pageNumber=1', 'https://example.test/api/products?limit=100&pageNumber=2']);
});

test('admin inventory uses authenticated private pagination', async () => {
  const signal = new AbortController().signal;
  await loadCatalogue('https://example.test', { administrative: true, headers: { Authorization: 'Bearer synthetic' }, signal, fetcher: async (url, options) => {
    assert.equal(url, 'https://example.test/api/admin/products?limit=100&page=1');
    assert.equal(options.signal, signal);
    assert.equal(options.headers.Authorization, 'Bearer synthetic');
    return { ok: true, json: async () => ({ products: [], pages: 0 }) };
  } });
});

test('malformed or unbounded catalogue replies cannot cause unlimited requests', async () => {
  for (const data of [{ pages: 101, products: [] }, { pages: 1, products: Array(101).fill({}) }, { products: [] }]) {
    await assert.rejects(loadCatalogue('https://example.test', { fetcher: async () => ({ ok: true, json: async () => data }) }), /Invalid catalogue/);
  }
});
