const { test } = require('node:test');
const assert = require('node:assert/strict');
const KYC = require('../models/KYC');
const { getKYCStatus } = require('../controllers/kycController');

function invoke(handler, userId) {
    return new Promise(resolve => {
        const res = {
            statusCode: 200,
            status(code) { this.statusCode = code; return this; }, setHeader() {},
            json(body) { resolve({ status: this.statusCode, body }); },
        };
        handler({ user: { _id: userId, role: 'customer' } }, res);
    });
}

test('KYC status returns an empty state for a customer without a submission', async t => {
    t.mock.method(KYC, 'findOne', async () => null);
    assert.deepEqual(await invoke(getKYCStatus, 'customer-1'), {
        status: 200,
        body: { status: 'not_submitted' },
    });
});

test('KYC status still returns the submitted record', async t => {
    const submitted = { status: 'pending', personalDetails: { name: 'Customer' } };
    t.mock.method(KYC, 'findOne', async () => submitted);
    assert.deepEqual(await invoke(getKYCStatus, 'customer-2'), {
        status: 200,
        body: { ...submitted, documents: {}, migrationRequiredFields: [] },
    });
});
