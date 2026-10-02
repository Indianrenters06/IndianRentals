const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadSource } = require('./helpers');
const owner = 'aaaaaaaaaaaaaaaaaaaaaaaa';
function fixture(existing) {
    let stored;
    const controller = loadSource('controllers/kycController.js', {
        mongoose: { connection: { transaction: fn => fn({ synthetic: true }) } },
        '../models/KYC': { findOne: async () => stored || existing,
            findOneAndUpdate: async (_query, update) => (stored = { ...existing, ...update.$set }),
            find: () => ({ populate: async () => [stored] }) },
        '../models/User': { findOneAndUpdate: async () => ({ _id: owner }) },
        '../models/KYCAsset': {},
        '../services/kycAssets': { ...require('../services/kycAssets'), validateDocuments: async docs => docs },
        './notificationController': { createNotification: async () => {} },
        '../utils/sendTemplatedEmail': { sendTemplatedEmail: async () => true },
    });
    return (action, body, role = 'customer') => new Promise(resolve => {
        const res = { statusCode: 200, status(code) { this.statusCode = code; return this; }, setHeader() {},
            json(value) { resolve({ status: this.statusCode, body: value }); } };
        controller[action]({ user: { _id: owner, name: 'Synthetic Customer', role }, body }, res);
    });
}

test('KYC updates from the account form retain older checkout details and private documents', async () => {
    const invoke = fixture({ status: 'pending',
        personalDetails: { name: 'Synthetic Customer', address: 'Old address', residenceStatus: 'Rented' },
        documents: { identityProof: 'bbbbbbbbbbbbbbbbbbbbbbbb', addressProof: 'cccccccccccccccccccccccc' } });
    const submitted = await invoke('createOrUpdateKYC', { personalDetails: { permanentAddress: 'New address', city: 'Delhi' },
        documents: { aadharFront: 'dddddddddddddddddddddddd' } });
    assert.equal(submitted.status, 200);
    assert.equal(submitted.body.personalDetails.address, 'Old address');
    assert.equal(submitted.body.personalDetails.residenceStatus, 'Rented');
    assert.equal(submitted.body.personalDetails.permanentAddress, 'New address');
    assert.equal(submitted.body.documents.identityProof, 'bbbbbbbbbbbbbbbbbbbbbbbb');
    assert.equal(submitted.body.documents.aadharFront, 'dddddddddddddddddddddddd');
    assert.deepEqual((await invoke('getKYCStatus')).body, submitted.body);
});

test('reference details added to a pending KYC are returned for admin and customer views', async () => {
    const invoke = fixture({ status: 'pending', personalDetails: { name: 'Synthetic Customer' }, documents: { aadharFront: 'bbbbbbbbbbbbbbbbbbbbbbbb' } });
    const referenceDetails = { name: 'Synthetic Reference', relation: 'Friend', phone: '9000000000', address: 'Synthetic Street', city: 'Delhi', state: 'Delhi', pincode: '110001', country: 'India' };
    const submitted = await invoke('createOrUpdateKYC', { referenceDetails });
    assert.equal(submitted.status, 200);
    assert.deepEqual(JSON.parse(JSON.stringify(submitted.body.referenceDetails)), referenceDetails);
    assert.equal(submitted.body.personalDetails.name, 'Synthetic Customer');
    assert.equal(submitted.body.documents.aadharFront, 'bbbbbbbbbbbbbbbbbbbbbbbb');
    assert.deepEqual(JSON.parse(JSON.stringify((await invoke('getKYCStatus')).body.referenceDetails)), referenceDetails);
    assert.deepEqual(JSON.parse(JSON.stringify((await invoke('getAllKYC', undefined, 'admin')).body[0].referenceDetails)), referenceDetails);
});
