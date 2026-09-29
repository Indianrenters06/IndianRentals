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

test('homepage campaign image and copy survive draft, publish, and public read', async t => {
    let stored = { pageName: 'homepage', clientLogos: [] };
    t.mock.method(CMS, 'findOne', async () => {
        const doc = new CMS(stored);
        doc.save = async () => { await doc.validate(); stored = doc.toObject(); return doc; };
        return doc;
    });
    const request = { params: { page: 'homepage' } };
    const offer = {
        image: '/images/home/offers/camera-campaign.webp',
        link: '/services/camera-rental',
        title: 'The shot starts here.',
        subtitle: 'Camera kits for every brief.',
        ctaText: 'Explore cameras',
        altText: 'Camera rental campaign',
    };
    const saved = await invoke(updatePage, { ...request, body: { clientLogos: [offer] } });
    assert.deepEqual(saved.body.clientLogos[0], offer);
    await invoke(publishPage, request);
    const { body } = await invoke(getPage, request);
    assert.deepEqual(body.clientLogos[0], offer);
});
