const { test } = require('node:test');
const assert = require('node:assert/strict');
const BlogPost = require('../models/BlogPost');
const { getAllPosts, getAdminPosts, getPostById } = require('../controllers/blogController');

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

test('public blog listing always filters to published posts', async t => {
    let seenFilter;
    t.mock.method(BlogPost, 'find', filter => {
        seenFilter = filter;
        return { sort: () => ({ lean: async () => [] }) };
    });
    await invoke(getAllPosts, { query: { status: 'draft' } });
    assert.deepEqual(seenFilter, { status: 'published' });
    await invoke(getAdminPosts, { query: {} });
    assert.deepEqual(seenFilter, {});
});

test('public blog detail rejects a draft post', async t => {
    t.mock.method(BlogPost, 'findOne', async () => ({ status: 'draft' }));
    await assert.rejects(
        invoke(getPostById, { params: { id: 'unpublished-post' } }),
        error => error.status === 404,
    );
});
