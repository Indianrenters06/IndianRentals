async function assertCheckoutStorageReady(Rental) {
    const indexes = await Rental.collection.indexes();
    const has = (key, field) => indexes.some(index => index.unique === true &&
        JSON.stringify(index.key) === JSON.stringify(key) &&
        (!index.partialFilterExpression || JSON.stringify(index.partialFilterExpression) === JSON.stringify({ [field]: { $type: 'string' } })));
    if (!has({ user: 1, checkoutKey: 1 }, 'checkoutKey') || !has({ 'payment.providerPaymentId': 1 }, 'payment.providerPaymentId')) {
        const error = new Error('Checkout storage indexes are not ready');
        error.statusCode = 503; throw error;
    }
}
module.exports = { assertCheckoutStorageReady };

async function assertStagedStorageReady(Rental) {
    await assertCheckoutStorageReady(Rental);
    const indexes = await Rental.collection.indexes();
    for (const stage of ['advance', 'balance']) for (const field of ['providerOrderId', 'providerPaymentId']) {
        const path = `staged.${stage}.${field}`;
        if (!indexes.some(index => index.unique === true && JSON.stringify(index.key) === JSON.stringify({ [path]: 1 }) &&
            JSON.stringify(index.partialFilterExpression) === JSON.stringify({ [path]: { $type: 'string' } }))) {
            const error = new Error('Staged checkout indexes are not ready'); error.statusCode = 503; throw error;
        }
    }
}
module.exports.assertStagedStorageReady = assertStagedStorageReady;
