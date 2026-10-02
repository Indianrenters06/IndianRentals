const test = require('node:test');
const assert = require('node:assert/strict');
const { assertCheckoutStorageReady } = require('../utils/checkoutStorage');
const checkout = { key: { user: 1, checkoutKey: 1 }, unique: true, partialFilterExpression: { checkoutKey: { $type: 'string' } } };
const payment = { key: { 'payment.providerPaymentId': 1 }, unique: true, partialFilterExpression: { 'payment.providerPaymentId': { $type: 'string' } } };
test('Payment: storage refuses missing, nonunique or incorrectly scoped indexes', async () => {
    for (const indexes of [[], [checkout], [payment], [{ ...checkout, unique: false }, payment],
        [{ ...checkout, partialFilterExpression: { isPaid: true } }, payment]]) {
        await assert.rejects(() => assertCheckoutStorageReady({ collection: { indexes: async () => indexes } }), error => error.statusCode === 503);
    }
    await assertCheckoutStorageReady({ collection: { indexes: async () => [checkout, payment] } });
});
test('Staged: storage requires all stage association and captured-transaction uniqueness indexes', async () => {
    const { assertStagedStorageReady } = require('../utils/checkoutStorage');
    const stagedIndexes = ['advance', 'balance'].flatMap(stage => ['providerOrderId', 'providerPaymentId'].map(field => {
        const path = `staged.${stage}.${field}`;
        return { key: { [path]: 1 }, unique: true, partialFilterExpression: { [path]: { $type: 'string' } } };
    }));
    for (let missing = 0; missing < stagedIndexes.length; missing++) {
        const indexes = [checkout, payment, ...stagedIndexes.filter((_, i) => i !== missing)];
        await assert.rejects(() => assertStagedStorageReady({ collection: { indexes: async () => indexes } }), error => error.statusCode === 503);
    }
    await assertStagedStorageReady({ collection: { indexes: async () => [checkout, payment, ...stagedIndexes] } });
});
