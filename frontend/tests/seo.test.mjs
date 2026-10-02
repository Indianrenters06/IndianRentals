import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { resolveServerApi, fetchPublicJson } from '../src/lib/serverApi.mjs';
import { PRIVATE_PATHS, safeRobotsText, validProductId, plainText } from '../src/lib/seo.mjs';

function loadFunctions(path, globals = {}, beforeDefault = false) {
    let source = readFileSync(new URL(`../src/${path}`, import.meta.url), 'utf8');
    if (beforeDefault) source = source.split('export default')[0];
    source = source.replace(/^import .*?;\n/gm, '').replace(/export const /g, 'const ').replace(/export async function /g, 'async function ').replace(/export function /g, 'function ').replace(/export default async function /g, 'async function ');
    const context = vm.createContext({ ...globals, module: { exports: {} }, URL, Date, Map, Number, String });
    vm.runInContext(source + '\nmodule.exports = { ' + (path.includes('sitemap') ? 'sitemap' : path.includes('products/') ? 'generateMetadata' : 'publicMetadata') + ' };', context);
    return context.module.exports;
}
const site = { SITE_NAME: 'IndianRenters', DEFAULT_OG_IMAGE: 'https://indianrenters.com/share-image', absoluteUrl: path => `https://indianrenters.com${path}`, plainText };
const { publicMetadata } = loadFunctions('lib/publicMetadata.js', site);

test('server API resolver requires an absolute API and never relies on browser proxy URLs', () => {
    assert.equal(resolveServerApi({}), 'https://indianrentals-3ugl.onrender.com');
    assert.equal(resolveServerApi({ API_URL: 'http://127.0.0.1:5001/' }), 'http://127.0.0.1:5001');
    assert.throws(() => resolveServerApi({ NEXT_PUBLIC_API_URL: '/backend' }));
    assert.throws(() => resolveServerApi({ API_URL: 'https://user:password@example.com' }));
});

test('API absence is distinct from server errors and transport failures', async () => {
    const original = globalThis.fetch;
    try {
        globalThis.fetch = async () => ({ status: 404, ok: false });
        assert.equal(await fetchPublicJson('/api/products/invalid'), null);
        globalThis.fetch = async () => ({ status: 503, ok: false });
        await assert.rejects(fetchPublicJson('/api/products/invalid'), /temporarily unavailable/);
        globalThis.fetch = async () => { throw new Error('network unavailable'); };
        await assert.rejects(fetchPublicJson('/api/products/invalid'), /network unavailable/);
    } finally { globalThis.fetch = original; }
});

test('public metadata keeps the canonical, social URL and fallback image aligned', () => {
    const metadata = publicMetadata({ title: 'Rental Guides | IndianRenters', description: '<p>Equipment guides</p>', path: '/blog' });
    assert.equal(metadata.title.absolute, 'Rental Guides | IndianRenters');
    assert.equal(metadata.openGraph.url, metadata.alternates.canonical);
    assert.equal(metadata.description, 'Equipment guides');
    assert.equal(metadata.openGraph.images[0].width, 1200);
    assert.equal(metadata.openGraph.images[0].height, 630);
    assert.equal(metadata.twitter.images[0], metadata.openGraph.images[0].url);
    assert.doesNotMatch(publicMetadata({ title: 'IndianRenters', description: '', path: '/' }).title.absolute, /IndianRenters \| IndianRenters/);
    assert.equal(publicMetadata({ title: 'Guide', description: '', path: '/blog', image: 'javascript:alert(1)' }).openGraph.images[0].url, site.DEFAULT_OG_IMAGE);
});

test('robots fallback and every named crawler group exclude private screens', () => {
    const configured = 'User-agent: *\nAllow: /\n\nUser-agent: GPTBot\nAllow: /\nAllow: /profile/overview\n\nUser-agent: ClaudeBot\nAllow: /\nSitemap: https://unrelated.example/sitemap.xml';
    for (const text of [safeRobotsText('', 'https://indianrenters.com'), safeRobotsText(configured, 'https://indianrenters.com')]) {
        for (const group of text.split(/(?=User-agent:)/).filter(s => s.startsWith('User-agent:'))) {
            for (const path of PRIVATE_PATHS) assert.ok(group.includes(`Disallow: ${path}`));
        }
        assert.match(text, /Sitemap: https:\/\/indianrenters.com\/sitemap.xml/);
        assert.doesNotMatch(text, /unrelated.example|Allow: \/profile/);
    }
});

test('private route layouts provide both general and Google noindex', () => {
    const seo = readFileSync(new URL('../src/lib/seo.mjs', import.meta.url), 'utf8');
    assert.match(seo, /googleBot: \{ index: false/);
    for (const route of ['login', 'register', 'cart', 'checkout', 'profile', 'order-confirmation', 'figma-preview']) {
        const source = readFileSync(new URL(`../src/app/${route}/layout.js`, import.meta.url), 'utf8');
        assert.match(source, /robots: privateRobots/);
    }
});

test('all fixed Apple child routes have their own canonical metadata', () => {
    for (const slug of ['imac', 'ipad', 'iphone', 'mac-mini', 'mac-pro', 'mac-studio', 'macbook-air', 'macbook-pro', 'studio-display', 'xdr-display']) {
        const source = readFileSync(new URL(`../src/app/category/apple/${slug}/layout.js`, import.meta.url), 'utf8');
        assert.ok(source.includes(`path: '/category/apple/${slug}'`));
    }
});

test('PDP invalid identifiers and missing products invoke server notFound, while outages propagate', async () => {
    const id = '697f5f7934195cb8014c8dbf';
    let calls = 0;
    let result = null;
    const { generateMetadata } = loadFunctions('app/products/[id]/layout.js', {
        ...site, SITE_URL: 'https://indianrenters.com', cache: fn => fn, validProductId, publicMetadata,
        notFound: () => { throw new Error('NEXT_HTTP_ERROR_FALLBACK;404'); },
        fetchPublicJson: async () => { calls++; if (result instanceof Error) throw result; return result; },
    }, true);
    await assert.rejects(generateMetadata({ params: Promise.resolve({ id: 'not-a-product' }) }), /;404/);
    assert.equal(calls, 0);
    await assert.rejects(generateMetadata({ params: Promise.resolve({ id }) }), /;404/);
    result = new Error('provider unavailable');
    await assert.rejects(generateMetadata({ params: Promise.resolve({ id }) }), /provider unavailable/);
    result = { name: 'Catalogue name', seoTitle: 'Dedicated rental title', seoDescription: 'Dedicated description', _id: id };
    const metadata = await generateMetadata({ params: Promise.resolve({ id }) });
    assert.equal(metadata.title.absolute, 'Dedicated rental title | IndianRenters');
    assert.equal(metadata.description, 'Dedicated description');
});

test('sitemap paginates bounded product reads, includes published posts and omits aliases/private paths', async () => {
    const requests = [];
    const { sitemap } = loadFunctions('app/sitemap.js', {
        SITE_URL: 'https://indianrenters.com', validProductId,
        categorySlug: c => c.slug, subcategorySlug: c => c.slug,
        fetchPublicJson: async path => {
            requests.push(path);
            if (path.startsWith('/api/products')) return { products: [{ _id: path.includes('page=2') ? '697f5f7934195cb8014c8dbe' : '697f5f7934195cb8014c8dbf' }], pages: 2 };
            if (path.startsWith('/api/blog')) return [{ slug: 'published-guide', status: 'published' }, { slug: 'draft-guide', status: 'draft' }];
            return [{ slug: 'apple', subcategories: [{ slug: 'ipad' }] }];
        },
    });
    const entries = await sitemap();
    assert.equal(requests.filter(p => p.startsWith('/api/products')).length, 2);
    assert.ok(requests.filter(p => p.startsWith('/api/products')).every(p => p.includes('limit=100')));
    const urls = entries.map(e => e.url);
    assert.ok(urls.includes('https://indianrenters.com/blog/published-guide'));
    assert.ok(urls.includes('https://indianrenters.com/shipping'));
    assert.ok(urls.includes('https://indianrenters.com/careers'));
    assert.ok(urls.includes('https://indianrenters.com/return-policy'));
    assert.ok(!urls.some(url => /draft-guide|refund-policy|checkout|profile|homepage-demo/.test(url)));
    assert.equal(new Set(urls).size, urls.length);
});
