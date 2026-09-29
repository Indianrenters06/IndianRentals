const { test } = require('node:test');
const assert = require('node:assert/strict');
const CMS = require('../models/CMS');
const { getPage, updatePage, publishPage } = require('../controllers/cmsController');

function invoke(handler, req) {
    return new Promise((resolve, reject) => {
        const res = {
            statusCode: 200,
            status(code) { this.statusCode = code; return this; },
            json(body) { resolve({ status: this.statusCode, body }); },
        };
        handler(req, res, error => reject(Object.assign(error, { status: res.statusCode })));
    });
}

test('homepage media banner settings publish through the CMS write/read path', async t => {
    let stored = { pageName: 'homepage', featureSectionTitle: 'Old title' };
    t.mock.method(CMS, 'findOne', async () => {
        const doc = new CMS(stored);
        doc.save = async () => { await doc.validate(); stored = doc.toObject(); return doc; };
        return doc;
    });
    const req = { params: { page: 'homepage' } };
    const fields = {
        featureSectionTitle: 'Tech for your next project',
        featureSectionImage: 'https://example.com/banner.webm',
        featureSectionMediaType: 'video',
        featureSectionMobileMedia: 'https://example.com/banner-mobile.webp',
        featureSectionPosterImage: '/images/home/rental-workspace-offer.webp',
        featureSectionMediaAlt: 'Laptop ready for rent',
        featureSectionInteraction: 'hover-zoom',
    };
    await invoke(updatePage, { ...req, body: fields });
    await invoke(publishPage, req);
    const { body } = await invoke(getPage, req);
    for (const [key, value] of Object.entries(fields)) assert.equal(body[key], value, key);
});
