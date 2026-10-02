const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { loadSource, invoke } = require('./helpers');
const fixtures = require('./fixtures/paymentDatabase');

// Opt-in only. Refuse remote/deployed databases and create a unique disposable
// database containing synthetic fixtures. Never connect using MONGO_URI here.
test('Database: concurrent checkout, final coupon use and settlement stay idempotent', {
    skip: !process.env.TEST_MONGO_URI, timeout: 60000,
}, async t => {
    const uri = process.env.TEST_MONGO_URI;
    assert.match(uri, /^mongodb:\/\/(?:127\.0\.0\.1|localhost):\d+\/ir_security_remediation_test(?:\?.*)?$/,
        'Use a local replica set and the dedicated ir_security_remediation_test database');
    const mongoose = require('mongoose');
    await mongoose.connect(uri, { dbName: `ir_security_remediation_test_${crypto.randomUUID().replaceAll('-', '')}`, serverSelectionTimeoutMS: 5000 });
    t.after(async () => { await mongoose.connection.dropDatabase(); await mongoose.disconnect(); });
    const Rental = require('../models/Rental');
    const Product = require('../models/Product');
    const Coupon = require('../models/Coupon');
    const Settings = require('../models/Settings');
    const CMS = require('../models/CMS');
    const User = require('../models/User');
    await Rental.createIndexes();
    await Settings.create({ requireKYC: false });
    await CMS.create({ pageName: 'product-page' });
    const user = await User.create(fixtures.user);
    const product = await Product.create(fixtures.product);
    const selections = { orderItems: [{ product: String(product._id), qty: 1, tenureMonths: 1 }],
        shippingAddress: { address: 'Synthetic address', city: 'Delhi', postalCode: '110001', country: 'India', phone: '9000000000' } };
    const rentalController = loadSource('controllers/rentalController.js', {
        './notificationController': { createNotification: async () => {} }, '../utils/sendTemplatedEmail': { sendTemplatedEmail: async () => true },
    });
    const quoteService = require('../services/rentalQuote');
    for (const withCoupon of [false, true]) {
        if (withCoupon) await Coupon.create({ code: 'LAST_USE', discountType: 'fixed', discountAmount: 10, usageLimit: 1, expiryDate: new Date(Date.now() + 600000) });
        const body = { ...selections, ...(withCoupon ? { couponCode: 'LAST_USE' } : {}), checkoutKey: crypto.randomUUID() };
        body.quoteHash = (await quoteService.buildRentalQuote(body)).hash;
        const results = await Promise.all(Array.from({ length: 6 }, () => invoke(rentalController.addRentalItems, { user, body })));
        results.forEach(result => assert.ok([200, 201].includes(result.statusCode), result.error?.message));
        assert.equal(new Set(results.map(result => result.body._id)).size, 1);
        assert.equal(await Rental.countDocuments({ user: user._id, checkoutKey: body.checkoutKey }), 1);
        if (withCoupon) assert.equal((await Coupon.findOne({ code: 'LAST_USE' })).usageCount, 1);
    }
    const rental = await Rental.findOne({ user: user._id });
    const id = String(rental._id);
    let receipts = 0;
    let providerPaid = false;
    const order = () => ({ order_id: id, order_status: providerPaid ? 'PAID' : 'ACTIVE', order_currency: 'INR', order_amount: rental.totalPrice,
        customer_details: { customer_id: String(user._id) }, payment_session_id: 'synthetic-session' });
    const effects = { '../config/cashfree': { assertCashfreeConfigured() {}, cashfreeHeaders: () => ({}),
        cashfreeConfig: { baseUrl: 'https://sandbox.cashfree.com/pg', mode: 'sandbox', secretKey: 'synthetic-secret' } },
        '../utils/sendTemplatedEmail': { sendTemplatedEmail: async () => { receipts++; return true; } },
        axios: { get: async url => ({ data: url.endsWith('/payments') ? [{ order_id: id, cf_payment_id: 'synthetic-payment', payment_status: 'SUCCESS', is_captured: true, payment_amount: rental.totalPrice, payment_currency: 'INR' }] : order() }) } };
    const settlement = loadSource('services/paymentSettlement.js', effects);
    const payments = loadSource('controllers/paymentController.js', { ...effects, '../services/paymentSettlement': settlement });
    assert.equal((await invoke(payments.createCashfreeOrder, { user, body: { rentalId: id } })).statusCode, 200);
    providerPaid = true;
    const rawBody = Buffer.from(JSON.stringify({ type: 'PAYMENT_SUCCESS_WEBHOOK', data: { order: { order_id: id }, payment: { payment_status: 'SUCCESS' } } }));
    const timestamp = String(Date.now());
    const request = { rawBody, headers: { 'x-webhook-timestamp': timestamp,
        'x-webhook-signature': crypto.createHmac('sha256', 'synthetic-secret').update(timestamp).update(rawBody).digest('base64') } };
    const responses = await Promise.all(Array.from({ length: 10 }, () => invoke(payments.cashfreeWebhook, request)));
    responses.forEach(response => assert.equal(response.statusCode, 200, response.error?.message));
    assert.equal((await Rental.findById(id)).isPaid, true);
    assert.equal((await Rental.findById(id)).paymentReceipt.state, 'sent');
    assert.equal(receipts, 1);
    assert.equal((await Product.findById(product._id)).stock, 10);
});
