const test = require('node:test');
const assert = require('node:assert/strict');
const { PassThrough } = require('node:stream');
const { loadSource, invoke } = require('./helpers');
const owner = 'aaaaaaaaaaaaaaaaaaaaaaaa', id = 'bbbbbbbbbbbbbbbbbbbbbbbb', assetId = 'cccccccccccccccccccccccc';
const pdf = Buffer.from('%PDF-1.7 synthetic fixture only');
function response() { return { statusCode: 200, headers: {}, status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; }, setHeader(k,v) { this.headers[k] = v; }, send(body) { this.body = body; return this; } }; }
const privateAsset = { _id: assetId, user: owner, field: 'identityProof', deliveryType: 'authenticated', resourceType: 'raw',
    publicId: 'indian-rentals/kyc-private/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa.pdf', contentType: 'application/pdf', extension: 'pdf', bytes: pdf.length };

test('S7: new identity uploads use authenticated raw storage and return an owner-bound reference only', async () => {
    const names = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
    const previous = Object.fromEntries(names.map(n => [n, process.env[n]]));
    names.forEach(n => { process.env[n] = 'synthetic'; });
    let options, saved;
    const cloudinary = { uploader: { upload_stream(opts, done) { options = opts; const stream = new PassThrough(); stream.resume();
        stream.on('end', () => done(null, { type: opts.type, resource_type: opts.resource_type, public_id: opts.public_id, bytes: pdf.length,
            secure_url: 'https://invalid.example/never-return-this' })); return stream; } } };
    try {
        const service = loadSource('services/kycAssets.js', {
            '../middleware/uploadMiddleware': { cloudinary }, '../models/KYCAsset': { create: async data => { saved = data; return { _id: assetId }; } },
        });
        assert.equal(await service.uploadPrivateAsset({ _id: owner, role: 'customer' }, 'identityProof', pdf), assetId);
        assert.equal(options.type, 'authenticated'); assert.equal(options.resource_type, 'raw'); assert.equal(options.overwrite, false);
        assert.equal(saved.user, owner); assert.equal(saved.field, 'identityProof'); assert.equal(saved.publicId, options.public_id);
        assert.equal(Object.hasOwn(saved, 'secure_url'), false);
    } finally { for (const n of names) previous[n] === undefined ? delete process.env[n] : process.env[n] = previous[n]; }
});
test('S7/S8: document submission refuses URLs and another customer/field reference before writes', async () => {
    let reads = 0;
    const service = loadSource('services/kycAssets.js', { '../models/KYCAsset': { findOne: async filter => {
        reads++; return filter.user === owner && filter.field === 'identityProof' ? privateAsset : null;
    } } });
    for (const url of ['http://127.0.0.1/internal', 'http://169.254.169.254/latest/meta-data', 'https://res.cloudinary.com/any/image/upload/x.png']) {
        await assert.rejects(service.validateDocuments({ identityProof: url }, owner), { statusCode: 400 });
    }
    assert.equal(reads, 0);
    await assert.rejects(service.validateDocuments({ identityProof: assetId }, id), { statusCode: 403 });
    await assert.rejects(service.validateDocuments({ addressProof: assetId }, owner), { statusCode: 403 });
    assert.equal((await service.validateDocuments({ identityProof: assetId }, owner)).identityProof, assetId);
});
test('S7: identity metadata DTOs never return legacy delivery URLs', () => {
    const { kycResponse } = require('../services/kycAssets');
    const result = kycResponse({ documents: { identityProof: 'https://private.example/customer.pdf', addressProof: assetId } });
    assert.equal(JSON.stringify(result).includes('https://'), false);
    assert.deepEqual(result.migrationRequiredFields, ['identityProof']);
    const { userResponse } = require('../utils/userResponse');
    assert.equal(userResponse({ kyc: { documentImage: 'https://private.example/customer.png', documentNumber: 'synthetic-identity', status: 'pending' } }).kyc.documentImage, undefined);
});
test('S8: legacy arbitrary stored URL is rejected without any outbound request', async () => {
    let fetched = 0;
    const record = { _id: id, user: { _id: owner, role: 'customer' }, documents: { identityProof: 'http://127.0.0.1/internal' } };
    const controller = loadSource('controllers/kycController.js', { '../models/KYC': { findById: () => ({ populate: async () => record }) } },
        { fetch: async () => { fetched++; return new Response(pdf); } });
    const res = response();
    await controller.downloadKYCDocument({ user: { role: 'admin' }, params: { id, field: 'identityProof' } }, res);
    assert.equal(fetched, 0); assert.equal(res.statusCode, 409);
});
test('S7/S8: private read uses short-lived signed trusted API, rejects redirects and returns synthetic bytes', async () => {
    let options, requested;
    const cloudinary = { utils: { private_download_url(publicId, format, opts) { options = opts; assert.equal(publicId, privateAsset.publicId);
        return 'https://api.cloudinary.com/v1_1/synthetic/raw/download?signature=synthetic'; } } };
    const service = loadSource('services/kycAssets.js', { '../middleware/uploadMiddleware': { cloudinary } }, { fetch: async (url, opts) => {
        requested = { url, opts }; return new Response(pdf);
    } });
    assert.deepEqual(await service.readPrivateAsset(privateAsset), pdf);
    assert.equal(options.type, 'authenticated'); assert.ok(options.expires_at <= Math.floor(Date.now()/1000)+60);
    assert.equal(requested.opts.redirect, 'error'); assert.ok(requested.opts.signal);
    cloudinary.utils.private_download_url = () => 'http://127.0.0.1/internal';
    await assert.rejects(service.readPrivateAsset(privateAsset), { statusCode: 503 });
});
test('S7: uploaded file bytes must be a bounded permitted document type', () => {
    const { fileType } = require('../services/kycAssets');
    assert.throws(() => fileType(Buffer.from('<script>synthetic</script>')));
    assert.throws(() => fileType(Buffer.alloc(10485761)));
    assert.equal(fileType(pdf).contentType, 'application/pdf');
});
test('S8: actual KYC creation refuses arbitrary URLs before changing a record', async () => {
    let writes = 0;
    const controller = loadSource('controllers/kycController.js', { '../models/KYC': { findOneAndUpdate: async () => { writes++; } } });
    const res = response();
    await controller.createOrUpdateKYC({ user: { _id: owner, role: 'customer' }, body: { documents: { identityProof: 'http://169.254.169.254/latest/meta-data/' } } }, res);
    assert.equal(res.statusCode, 400); assert.equal(writes, 0);
});
test('S7: legacy identity URL submission endpoint fails closed', async () => {
    let writes = 0;
    const controller = loadSource('controllers/userController.js', { '../models/User': { findById: async () => { writes++; } } });
    const result = await invoke(controller.submitKYC, { user: { _id: owner }, body: { documentImage: 'https://invalid.example/customer.png' } });
    assert.equal(result.statusCode, 410); assert.equal(writes, 0);
});
test('S7: authorized download keeps bytes private and rejects staff without KYC permission', async () => {
    let reads = 0;
    const record = { _id: id, user: { _id: owner, role: 'customer' }, documents: { identityProof: assetId } };
    const controller = loadSource('controllers/kycController.js', {
        '../models/KYC': { findById: () => ({ populate: async () => { reads++; return record; } }) },
        '../services/kycAssets': { ...require('../services/kycAssets'), ownedAsset: async (ref, user, field) => {
            assert.equal(ref, assetId); assert.equal(String(user), owner); assert.equal(field, 'identityProof'); return privateAsset;
        }, readPrivateAsset: async () => pdf },
    });
    const res = response();
    await controller.downloadKYCDocument({ user: { role: 'staff', adminPermissions: ['kyc'] }, params: { id, field: 'identityProof' } }, res);
    assert.equal(res.statusCode, 200); assert.deepEqual(res.body, pdf); assert.equal(res.headers['Cache-Control'], 'no-store, private');
    const denied = response();
    await controller.downloadKYCDocument({ user: { role: 'staff', adminPermissions: ['users'] }, params: { id, field: 'identityProof' } }, denied);
    assert.equal(denied.statusCode, 403); assert.equal(reads, 1);
});
test('S7: changing approved identity resets review and synchronizes customer/KYC in one transaction', async () => {
    const session = { synthetic: true }; let userStatus, kycStatus;
    const controller = loadSource('controllers/kycController.js', {
        mongoose: { connection: { transaction: fn => fn(session) } },
        '../models/User': { findOneAndUpdate: async (filter, update, opts) => { assert.equal(opts.session, session); assert.equal(filter.role, 'customer'); userStatus = update.$set['kyc.status']; return { _id: owner }; } },
        '../models/KYC': { findOne: async () => ({ _id: id, status: 'approved', documents: {} }),
            findOneAndUpdate: async (filter, update, opts) => { assert.equal(opts.session, session); kycStatus = update.$set.status; return { _id: id, ...update.$set }; } },
        '../services/kycAssets': { ...require('../services/kycAssets'), validateDocuments: async () => ({}) },
        './notificationController': { createNotification: async () => {} }, '../utils/sendTemplatedEmail': { sendTemplatedEmail: async () => true },
    });
    const res = response();
    await controller.createOrUpdateKYC({ user: { _id: owner, role: 'customer' }, body: { personalDetails: { name: 'New Synthetic Identity' } } }, res);
    assert.equal(res.statusCode, 200); assert.equal(userStatus, 'pending'); assert.equal(kycStatus, 'pending');
});
test('S7: approval of a changed submission is rejected before account or KYC writes', async () => {
    let writes = 0;
    const controller = loadSource('controllers/kycController.js', {
        mongoose: { connection: { transaction: fn => fn({ synthetic: true }) } },
        '../models/User': { findById: async () => ({ role: 'customer' }), findOneAndUpdate: async () => { writes++; return {}; } },
        '../utils/customerAccess': { requireCustomerTarget: async () => ({ role: 'customer' }), requireUnchangedCustomer: value => value },
        '../models/KYC': { findById: async () => ({ user: owner, updatedAt: new Date('2026-10-01T10:00:00Z'), save: async () => { writes++; } }) },
    });
    for (const expectedUpdatedAt of [undefined, '2026-10-01T09:00:00Z', 'invalid']) {
        const res = response(); await controller.updateKYCStatus({ user: { role: 'admin' }, params: { id }, body: { status: 'approved', expectedUpdatedAt } }, res);
        assert.equal(res.statusCode, 409); assert.equal(writes, 0);
    }
});
test('S7: fresh private upload removes obsolete legacy URLs while retaining other private assets', async () => {
    let documents;
    const controller = loadSource('controllers/kycController.js', {
        mongoose: { connection: { transaction: fn => fn({ synthetic: true }) } },
        '../models/User': { findOneAndUpdate: async () => ({ _id: owner }) },
        '../models/KYC': { findOne: async () => ({ status: 'rejected', documents: { identityProof: 'https://legacy.example/private.pdf', bankStatement: assetId } }),
            findOneAndUpdate: async (_filter, update) => { documents = update.$set.documents; return update.$set; } },
        '../services/kycAssets': { ...require('../services/kycAssets'), validateDocuments: async docs => docs },
        './notificationController': { createNotification: async () => {} }, '../utils/sendTemplatedEmail': { sendTemplatedEmail: async () => true },
    });
    const res = response(); await controller.createOrUpdateKYC({ user: { _id: owner, role: 'customer' }, body: { documents: { aadharFront: id } } }, res);
    assert.equal(res.statusCode, 200); assert.equal(documents.identityProof, undefined); assert.equal(documents.bankStatement, assetId); assert.equal(documents.aadharFront, id);
});
