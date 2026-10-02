const test = require('node:test');
const assert = require('node:assert/strict');
const User = require('../models/User');
const Product = require('../models/Product');
const fixtures = require('./fixtures/paymentDatabase');
test('Database: synthetic integration fixtures satisfy actual model validation', async () => {
    await new User(fixtures.user).validate();
    await new Product(fixtures.product).validate();
    assert.equal(fixtures.user.email.endsWith('.test'), true);
});
test('F5: actual Product model rejects out-of-range/fractional ratings and oversized reviews', async () => {
    const review = { name: 'Synthetic', user: 'aaaaaaaaaaaaaaaaaaaaaaaa', rating: 5, comment: 'Synthetic review' };
    for (const rating of [0, 6, 1.5]) {
        await assert.rejects(new Product({ ...fixtures.product, reviews: [{ ...review, rating }] }).validate(), /rating/);
    }
    await assert.rejects(new Product({ ...fixtures.product, reviews: [{ ...review, comment: 'a'.repeat(2001) }] }).validate(), /comment/);
    await new Product({ ...fixtures.product, reviews: [review] }).validate();
});
