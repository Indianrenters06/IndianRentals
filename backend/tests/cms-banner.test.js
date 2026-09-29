const { test } = require('node:test');
const assert = require('node:assert/strict');
const CMS = require('../models/CMS');
const { updatePage, getPage, publishPage } = require('../controllers/cmsController');

function invoke(handler, req) {
    return new Promise((resolve, reject) => {
        const res = { statusCode: 200, status(code) { this.statusCode = code; return this; }, json(body) { resolve({ status: this.statusCode, body }); } };
        handler(req, res, error => reject(Object.assign(error, { status: res.statusCode })));
    });
}
test('banner appearance survives the CMS write/read path without changing the image', async t => {
    let stored = { pageName: 'contact', bannerImage: '/original.jpg', bannerTitle: 'Contact Us' };
    t.mock.method(CMS, 'findOne', async () => {
        const doc = new CMS(stored);
        doc.save = async () => { await doc.validate(); stored = doc.toObject(); return doc; };
        return doc;
    });
    await invoke(updatePage, { params: { page: 'contact' }, body: { bannerShowText: false, bannerBackground: '#123AbC' } });
    await invoke(publishPage, { params: { page: 'contact' } });
    const { body } = await invoke(getPage, { params: { page: 'contact' } });
    assert.equal(body.bannerShowText, false);
    assert.equal(body.bannerBackground, '#123AbC');
    assert.equal(body.bannerImage, '/original.jpg');
    assert.equal(body.bannerTitle, 'Contact Us');
    await invoke(updatePage, { params: { page: 'contact' }, body: { bannerShowText: true, bannerBackground: '' } });
    await invoke(publishPage, { params: { page: 'contact' } });
    const reset = (await invoke(getPage, { params: { page: 'contact' } })).body;
    assert.equal(reset.bannerShowText, true);
    assert.equal(reset.bannerBackground, '');
});
test('legacy CMS documents retain their current appearance', () => {
    const doc = new CMS({ pageName: 'about' });
    assert.equal(doc.bannerShowText, true);
    assert.equal(doc.bannerBackground, '');
});
test('shared page banners retain independent admin settings', async t => {
    const pages = ['about', 'rental-process', 'faq', 'terms', 'privacy', 'refund'];
    const stored = new Map(pages.map(pageName => [pageName, { pageName, bannerImage: `/${pageName}.jpg`, bannerTitle: pageName }]));
    t.mock.method(CMS, 'findOne', async ({ pageName }) => {
        const doc = new CMS(stored.get(pageName));
        doc.save = async () => { await doc.validate(); stored.set(pageName, doc.toObject()); return doc; };
        return doc;
    });
    for (const page of pages) {
        const color = page === 'rental-process' ? '#ffcf46' : '#f6f6f6';
        await invoke(updatePage, { params: { page }, body: { bannerShowText: false, bannerBackground: color } });
        await invoke(publishPage, { params: { page } });
        const { body } = await invoke(getPage, { params: { page } });
        assert.equal(body.bannerShowText, false, page);
        assert.equal(body.bannerBackground, color, page);
        assert.equal(body.bannerImage, `/${page}.jpg`, page);
    }
});
test('malformed colours and non-boolean visibility are rejected before writing', async () => {
    for (const body of [{ bannerBackground: 'red' }, { bannerBackground: '#ff00' }, { bannerBackground: 0 }, { bannerShowText: 'false' }]) {
        await assert.rejects(invoke(updatePage, { params: { page: 'contact' }, body }), error => error.status === 400);
    }
});
