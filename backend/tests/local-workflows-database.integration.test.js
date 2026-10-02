const test = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { loadSource, invoke, serveRouter } = require('./helpers');
const fixtures = require('./fixtures/paymentDatabase');

test('Local database: KYC transactions, duplicate reviews, careers receipts and CMS publication persist safely', {
    skip: !process.env.TEST_MONGO_URI, timeout: 60000,
}, async t => {
    const uri = process.env.TEST_MONGO_URI;
    assert.match(uri, /^mongodb:\/\/(?:127\.0\.0\.1|localhost):\d+\/ir_security_remediation_test(?:\?.*)?$/);
    const mongoose = require('mongoose');
    await mongoose.connect(uri, { dbName: `ir_security_remediation_test_${randomUUID().replaceAll('-', '')}`, serverSelectionTimeoutMS: 5000 });
    t.after(async () => { await mongoose.connection.dropDatabase(); await mongoose.disconnect(); });
    const User = require('../models/User'), Product = require('../models/Product'), KYC = require('../models/KYC');
    const KYCAsset = require('../models/KYCAsset'), CMS = require('../models/CMS'), Application = require('../models/CareerApplication');
    await Promise.all([User.createIndexes(), Product.createIndexes(), KYC.createIndexes(), Application.createIndexes()]);
    const customer = await User.create(fixtures.user);
    const product = await Product.create(fixtures.product);
    const asset = await KYCAsset.create({ user: customer._id, field: 'identityProof', publicId: `indian-rentals/kyc-private/${randomUUID()}.pdf`,
        resourceType: 'raw', deliveryType: 'authenticated', contentType: 'application/pdf', extension: 'pdf', bytes: 8 });
    const noEffects = { './notificationController': { createNotification: async () => {} },
        '../utils/sendEmail': async () => true, '../utils/sendTemplatedEmail': { sendTemplatedEmail: async () => true } };
    const kyc = loadSource('controllers/kycController.js', noEffects);
    const submitted = await invoke(kyc.createOrUpdateKYC, { user: customer, body: {
        personalDetails: { name: 'Synthetic Customer' }, documents: { identityProof: String(asset._id) } } });
    assert.equal(submitted.statusCode, 201, JSON.stringify(submitted.body));
    const record = await KYC.findOne({ user: customer._id });
    const staff = { _id: new mongoose.Types.ObjectId(), role: 'staff', adminPermissions: ['kyc'] };
    const review = { user: staff, params: { id: String(record._id) }, body: { status: 'approved', expectedUpdatedAt: record.updatedAt.toISOString() } };
    assert.equal((await invoke(kyc.updateKYCStatus, review)).statusCode, 200);
    assert.equal((await User.findById(customer._id)).kyc.status, 'approved');
    assert.equal((await KYC.findById(record._id)).status, 'approved');
    await new Promise(resolve => setTimeout(resolve, 5));
    const changed = await invoke(kyc.createOrUpdateKYC, { user: customer, body: { personalDetails: { name: 'Changed synthetic identity' } } });
    assert.equal(changed.statusCode, 200);
    assert.equal((await invoke(kyc.updateKYCStatus, review)).statusCode, 409);
    assert.equal((await User.findById(customer._id)).kyc.status, 'pending');
    assert.equal((await KYC.findById(record._id)).status, 'pending');
    const latest = await KYC.findById(record._id);
    const simultaneous = await Promise.all([1, 2].map(() => invoke(kyc.updateKYCStatus, {
        ...review, body: { status: 'approved', expectedUpdatedAt: latest.updatedAt.toISOString() } })));
    assert.deepEqual(simultaneous.map(result => result.statusCode).sort(), [200, 409]);
    // A real failed second write must roll back the preceding User status write.
    const failing = loadSource('controllers/kycController.js', { ...noEffects, '../models/KYC': {
        findOne: (...args) => KYC.findOne(...args), findOneAndUpdate: async () => { throw new Error('Synthetic second-write failure'); } } });
    const failure = await invoke(failing.createOrUpdateKYC, { user: customer, body: { personalDetails: { name: 'Rollback synthetic' } } });
    assert.equal(failure.statusCode, 503);
    assert.equal((await KYC.findById(record._id)).personalDetails.name, 'Changed synthetic identity');
    assert.equal((await User.findById(customer._id)).kyc.status, 'approved');
    assert.equal((await KYC.findById(record._id)).status, 'approved');

    const reviews = require('../controllers/productController');
    const results = await Promise.all(Array.from({ length: 8 }, () => invoke(reviews.createProductReview, {
        user: customer, params: { id: String(product._id) }, body: { rating: 5, comment: 'Synthetic review' } })));
    assert.equal(results.filter(result => result.statusCode === 201).length, 1);
    assert.equal(results.filter(result => result.statusCode === 409).length, 7);
    const stored = await Product.findById(product._id);
    assert.equal(stored.reviews.length, 1); assert.equal(stored.rating, 5); assert.equal(stored.numReviews, 1);

    const defaults = require('../config/careers-defaults.json');
    await CMS.create({ pageName: 'careers', careersContent: { ...defaults, generalEnabled: true } });
    const router = loadSource('routes/careersRoutes.js');
    const request = await serveRouter(t, router, '/careers');
    const application = { submissionId: randomUUID(), fullName: 'Synthetic Candidate', email: 'candidate@example.test', consent: true, answers: { resume: 'https://example.test/resume' } };
    const receipts = await Promise.all(Array.from({ length: 6 }, async () => {
        const response = await request('/applications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(application) });
        assert.equal(response.status, 201); return response.json();
    }));
    assert.equal(new Set(receipts.map(receipt => receipt.id)).size, 1);
    assert.equal(await Application.countDocuments({ submissionId: application.submissionId }), 1);
    assert.equal((await request('/applications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...application, email: 'different@example.test' }) })).status, 409);

    const cms = require('../controllers/cmsController');
    const req = { params: { page: 'homepage' } };
    await CMS.create({ pageName: 'homepage', metaTitle: 'Published synthetic' });
    assert.equal((await invoke(cms.updatePage, { ...req, body: { metaTitle: 'Draft synthetic', bestRentedProductIds: [String(product._id)] } })).statusCode, 200);
    assert.equal((await invoke(cms.getPage, req)).body.metaTitle, 'Published synthetic');
    assert.equal((await invoke(cms.publishPage, req)).statusCode, 200);
    assert.equal((await invoke(cms.getPage, req)).body.metaTitle, 'Draft synthetic');
    await invoke(cms.updatePage, { ...req, body: { metaTitle: 'Discard synthetic' } });
    await invoke(cms.discardDraft, req);
    assert.equal((await invoke(cms.getPage, req)).body.metaTitle, 'Draft synthetic');
    await Product.updateOne({ _id: product._id }, { $set: { isActive: false } });
    await invoke(cms.updatePage, { ...req, body: { bestRentedProductIds: [String(product._id)] } });
    assert.equal((await invoke(cms.publishPage, req)).statusCode, 409);
    const testimonials = loadSource('controllers/testimonialController.js', noEffects);
    const created = await invoke(testimonials.createTestimonial, { user: customer,
        body: { name: 'Synthetic reviewer', message: 'Synthetic workflow test', rating: 5, isApproved: true } });
    assert.equal(created.statusCode, 201); assert.equal(created.body.isApproved, false);
    assert.equal((await invoke(testimonials.getTestimonials, {})).body.length, 0);
    const approved = await invoke(testimonials.updateTestimonial, { params: { id: created.body._id }, body: { isApproved: true, message: 'Edited synthetic workflow' } });
    assert.equal(approved.statusCode, 200);
    assert.equal((await invoke(testimonials.getTestimonials, {})).body[0].message, 'Edited synthetic workflow');
    await invoke(testimonials.deleteTestimonial, { params: { id: created.body._id } });
    assert.equal((await invoke(testimonials.getTestimonials, {})).body.length, 0);
});
