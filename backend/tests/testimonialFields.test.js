const { test } = require('node:test');
const assert = require('node:assert/strict');
const { testimonialFields } = require('../lib/testimonialFields');
const review = { name: 'Test customer', message: 'Test review', rating: 4.5 };

test('customer submissions cannot self-publish or impersonate a Google review', () => {
    const result = testimonialFields({ ...review, isApproved: true, source: 'google', sourceUrl: 'https://google.com/maps' });
    assert.equal(result.isApproved, false);
    assert.equal(result.source, 'indianrenters');
    assert.equal(result.sourceUrl, '');
});
test('CMS administrators can publish and keep fractional ratings', () => {
    const result = testimonialFields({ ...review, isApproved: true, source: 'google', sourceUrl: 'https://www.google.com/maps' }, { canManage: true });
    assert.equal(result.isApproved, true);
    assert.equal(result.rating, 4.5);
    assert.equal(result.source, 'google');
});
test('partial updates can clear optional fields and unpublish', () => {
    assert.deepEqual(testimonialFields({ role: '', image: '', sourceUrl: '', isApproved: false }, { partial: true, canManage: true }), { role: '', image: '', sourceUrl: '', isApproved: false });
});
test('invalid rating, empty review, and unsafe source links are rejected', () => {
    for (const fields of [{ rating: 6 }, { rating: 'invalid' }, { message: '' }, { sourceUrl: 'javascript:alert(1)' }, { sourceUrl: 'https://google.com.evil.test' }]) {
        assert.throws(() => testimonialFields({ ...review, ...fields }, { canManage: true }), error => error.statusCode === 400);
    }
});
