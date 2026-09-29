const { test } = require('node:test');
const assert = require('node:assert/strict');
const CMS = require('../models/CMS');
const { updatePage, getPage, getDraftPage, publishPage } = require('../controllers/cmsController');

function invoke(handler, req) {
    return new Promise((resolve, reject) => {
        const res = {
            statusCode: 200,
            status(code) { this.statusCode = code; return this; },
            json(body) { resolve({ status: this.statusCode, body }); },
        };
        handler(req, res, error => reject(error));
    });
}

test('blog landing page settings are private until published', async t => {
    let stored = { pageName: 'blog' };
    t.mock.method(CMS, 'findOne', async () => {
        const doc = new CMS(stored);
        doc.save = async () => { await doc.validate(); stored = doc.toObject(); return doc; };
        return doc;
    });

    const body = {
        blogTitle: 'Rental guides',
        blogSubtitle: 'Ideas for your next project.',
        blogTabs: ['View all', 'Workspaces'],
    };
    await invoke(updatePage, { params: { page: 'blog' }, body });
    const before = await invoke(getPage, { params: { page: 'blog' } });
    assert.notEqual(before.body.blogTitle, body.blogTitle);
    const draft = await invoke(getDraftPage, { params: { page: 'blog' } });
    assert.equal(draft.body.blogTitle, body.blogTitle);
    assert.equal(draft.body._workflow.hasDraft, true);
    await invoke(publishPage, { params: { page: 'blog' } });
    const result = await invoke(getPage, { params: { page: 'blog' } });
    assert.equal(result.body.blogTitle, body.blogTitle);
    assert.equal(result.body.blogSubtitle, body.blogSubtitle);
    assert.deepEqual(result.body.blogTabs, body.blogTabs);
    assert.equal(result.body.draftData, undefined);
});
