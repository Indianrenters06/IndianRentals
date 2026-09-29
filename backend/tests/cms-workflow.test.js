const { test } = require('node:test');
const assert = require('node:assert/strict');
const CMS = require('../models/CMS');
const { getPage, getDraftPage, updatePage, publishPage, discardDraft, getPreviewToken, getPreviewPage } = require('../controllers/cmsController');

function invoke(handler, req) {
    return new Promise((resolve, reject) => {
        const headers = {};
        const res = {
            statusCode: 200,
            status(code) { this.statusCode = code; return this; },
            set(name, value) { headers[name] = value; return this; },
            json(body) { resolve({ status: this.statusCode, body, headers }); },
        };
        handler(req, res, error => reject(Object.assign(error, { status: res.statusCode })));
    });
}

test('service page drafts preview privately, publish, and discard without leaking draft fields', async t => {
    const previousSecret = process.env.JWT_SECRET;
    process.env.JWT_SECRET = 'test-only-cms-preview-secret';
    t.after(() => { if (previousSecret === undefined) delete process.env.JWT_SECRET; else process.env.JWT_SECRET = previousSecret; });
    const content = title => ({ title, headline: title, description: 'Laptops for your team.', image: '/images/laptop.jpg', imageAlt: 'Laptop on a desk', categoryHref: '/products', categoryLabel: 'Browse laptops', catalogueCategory: 'Laptops', catalogueKeyword: 'laptop', primaryAction: 'browse', useCases: [{ title: 'Teams', description: 'Rent for a project.' }], faqs: [{ q: 'Can I rent?', a: 'Yes.' }], keywords: ['laptop rental'] });
    let stored = { pageName: 'service-laptop-rental', serviceContent: content('Published laptop rentals'), metaTitle: 'Published SEO' };
    t.mock.method(CMS, 'findOne', async () => {
        const doc = new CMS(stored);
        doc.save = async () => { await doc.validate(); stored = doc.toObject(); return doc; };
        return doc;
    });
    const req = { params: { page: 'service-laptop-rental' } };
    await invoke(updatePage, { ...req, body: { serviceContent: content('New laptop rentals'), metaTitle: 'Draft SEO' } });
    const live = await invoke(getPage, req);
    assert.equal(live.body.serviceContent.title, 'Published laptop rentals');
    assert.equal(live.body.metaTitle, 'Published SEO');
    assert.equal(live.body.draftData, undefined);
    const draft = await invoke(getDraftPage, req);
    assert.equal(draft.body.serviceContent.title, 'New laptop rentals');
    assert.equal(draft.body._workflow.hasDraft, true);
    const { body: { token } } = await invoke(getPreviewToken, req);
    const preview = await invoke(getPreviewPage, { ...req, query: { token } });
    assert.equal(preview.body.serviceContent.title, 'New laptop rentals');
    assert.equal(preview.headers['X-Robots-Tag'], 'noindex, nofollow');
    await assert.rejects(invoke(getPreviewPage, { ...req, query: { token: 'bad' } }), error => error.status === 403);
    await assert.rejects(invoke(getPreviewPage, { params: { page: 'service-camera-rental' }, query: { token } }), error => error.status === 403);
    await invoke(publishPage, req);
    assert.equal((await invoke(getPage, req)).body.serviceContent.title, 'New laptop rentals');
    assert.equal((await invoke(getDraftPage, req)).body._workflow.hasDraft, false);
    await invoke(updatePage, { ...req, body: { serviceContent: content('Discard me') } });
    await invoke(discardDraft, req);
    assert.equal((await invoke(getPage, req)).body.serviceContent.title, 'New laptop rentals');
    assert.equal((await invoke(getDraftPage, req)).body._workflow.hasDraft, false);
});

test('unknown CMS keys and unsafe service links cannot be saved', async () => {
    await assert.rejects(invoke(getPage, { params: { page: 'anything' } }), error => error.status === 404);
    await assert.rejects(invoke(updatePage, { params: { page: 'service-laptop-rental' }, body: { serviceContent: { title: 'Broken', categoryHref: '//external.example' } } }), error => error.status === 400);
});
