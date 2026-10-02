import test from 'node:test';
import assert from 'node:assert/strict';
import { loadShowcaseCatalogue } from '../src/lib/showcaseCatalogue.mjs';
import { productsForShowcaseSlide } from '../src/components/showcaseProducts.js';

const id = number => number.toString(16).padStart(24, '0');
const response = (products, pages = 1) => ({ ok: true, json: async () => ({ products, pages }) });
test('targeted collection finds products beyond the first 100 global catalogue records', async () => {
    const newer = Array.from({ length: 110 }, (_, index) => ({ _id: id(index + 1), name: `Office chair ${index}`, category: 'Office' }));
    const cameras = [{ _id: id(111), name: 'Sony camera', category: 'DSLR' }, { _id: id(112), name: 'Canon camera', category: 'DSLR' }];
    const calls = [];
    const slide = { title: 'Cameras', category: 'DSLR' };
    const products = await loadShowcaseCatalogue('https://example.test', [slide], [], async (url, options) => {
        const params = new URL(url).searchParams;
        calls.push(params);
        assert.ok(options.signal instanceof AbortSignal);
        return response(params.get('category') === 'DSLR' ? cameras : newer.slice(0, 100));
    });
    assert.deepEqual(productsForShowcaseSlide(slide, 0, products).map(product => product._id), cameras.map(product => product._id));
    assert.equal(calls.length, 1);
    assert.equal(calls[0].get('category'), 'DSLR');
    assert.equal(calls[0].get('limit'), '20');
});
test('keyword discovery filters description-only matches and checks a bounded second page', async () => {
    const slide = { title: 'Apple Products' };
    const decoys = Array.from({ length: 20 }, (_, index) => ({ _id: id(index + 1), name: 'Office chair', category: 'Office' }));
    const expected = [{ _id: id(21), name: 'Apple iPad', category: 'Tablet' }, { _id: id(22), name: 'Apple MacBook', category: 'Laptop' }];
    const calls = [];
    const products = await loadShowcaseCatalogue('https://example.test', [slide], [], async url => {
        const parameters = new URL(url).searchParams;
        calls.push(parameters);
        return response(parameters.get('pageNumber') === '1' ? decoys : expected, 2);
    });
    assert.deepEqual(products.map(product => product._id), expected.map(product => product._id));
    assert.equal(calls.length, 2);
    assert.ok(calls.every(parameters => parameters.get('keyword') === 'apple'));
});
test('explicit selections preserve CMS order, batch IDs and never substitute category results', async () => {
    const selected = [id(2), id(1), id(3)];
    const slide = { title: 'Apple Products', productIds: selected };
    let calls = 0;
    const products = await loadShowcaseCatalogue('https://example.test', [slide], [], async url => {
        calls++;
        assert.equal(new URL(url).searchParams.get('ids'), selected.join(','));
        return response([{ _id: id(1), name: 'Apple laptop' }, { _id: id(2), name: 'Tablet' }, { _id: id(99), name: 'Unrequested product' }]);
    });
    assert.equal(calls, 1);
    assert.deepEqual(productsForShowcaseSlide(slide, 0, products).map(product => product._id), [id(2), id(1)]);
    assert.ok(!products.some(product => product._id === id(99)));
    const missing = await loadShowcaseCatalogue('https://example.test', [slide], [], async () => response([]));
    assert.deepEqual(missing, []);
});
test('identical collections reuse queries and failed requests retain an honest empty state', async () => {
    let calls = 0;
    const slide = { title: 'Camera collection', category: 'DSLR' };
    const products = await loadShowcaseCatalogue('https://example.test', [slide, slide], [], async () => { calls++; throw new Error('offline'); });
    assert.deepEqual(products, []);
    // One exact-category request and one keyword request shared across both slides.
    assert.equal(calls, 2);
});
test('legacy excessive CMS collections cannot create unbounded request fanout', async () => {
    let calls = 0;
    const slides = Array.from({ length: 40 }, (_, index) => ({ category: `Collection ${index}` }));
    await loadShowcaseCatalogue('https://example.test', slides, [], async () => { calls++; return response([]); });
    assert.equal(calls, 32);
});
test('an outage cannot accumulate sequential five-second timeouts across every alias', async context => {
    let clock = 0;
    context.mock.method(Date, 'now', () => clock);
    let calls = 0;
    const products = await loadShowcaseCatalogue('https://example.test', [{ title: 'Apple Products' }, { title: 'Gaming' }], [], async () => {
        calls++;
        clock = 10001;
        throw new Error('network timeout');
    });
    assert.equal(calls, 1);
    assert.deepEqual(products, []);
});
