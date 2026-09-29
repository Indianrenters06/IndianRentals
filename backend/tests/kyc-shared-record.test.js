const { test } = require('node:test');
const assert = require('node:assert/strict');
const KYC = require('../models/KYC');
const { createOrUpdateKYC, getKYCStatus } = require('../controllers/kycController');

function invoke(handler, body) {
    return new Promise(resolve => {
        const res = {
            statusCode: 200,
            status(code) { this.statusCode = code; return this; },
            json(value) { resolve({ status: this.statusCode, body: value }); },
        };
        handler({ user: { _id: 'customer-1', name: 'Customer' }, body }, res);
    });
}

test('KYC updates from the account form retain older checkout details and documents', async t => {
    const existing = {
        status: 'pending',
        personalDetails: { toObject: () => ({ name: 'Customer', address: 'Old address', residenceStatus: 'Rented' }) },
        documents: { toObject: () => ({ identityProof: 'old-id-url', addressProof: 'old-address-url' }) },
    };
    let stored;
    t.mock.method(KYC, 'findOne', async () => stored || existing);
    t.mock.method(KYC, 'findOneAndUpdate', async (_query, update) => {
        stored = { status: update.$set.status, personalDetails: update.$set.personalDetails, documents: update.$set.documents };
        return stored;
    });

    const submitted = await invoke(createOrUpdateKYC, {
        personalDetails: { permanentAddress: 'New address', city: 'Delhi' },
        documents: { aadharFront: 'new-aadhaar-url' },
    });
    assert.equal(submitted.status, 200);
    assert.equal(submitted.body.personalDetails.address, 'Old address');
    assert.equal(submitted.body.personalDetails.residenceStatus, 'Rented');
    assert.equal(submitted.body.personalDetails.permanentAddress, 'New address');
    assert.equal(submitted.body.documents.identityProof, 'old-id-url');
    assert.equal(submitted.body.documents.aadharFront, 'new-aadhaar-url');

    const fromCheckout = await invoke(getKYCStatus, undefined);
    assert.deepEqual(fromCheckout.body, submitted.body);
});
