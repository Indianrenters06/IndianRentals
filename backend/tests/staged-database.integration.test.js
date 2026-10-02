const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { loadSource } = require('./helpers');
const fixture = require('./fixtures/paymentDatabase');

test('Database: staged captures, quote freezing and concurrent callbacks use real replica-set transactions', {
    skip: !process.env.TEST_MONGO_URI, timeout: 60000,
}, async t => {
    const uri = process.env.TEST_MONGO_URI;
    assert.match(uri, /^mongodb:\/\/(?:127\.0\.0\.1|localhost):\d+\/ir_security_remediation_test(?:\?.*)?$/);
    const mongoose = require('mongoose');
    await mongoose.connect(uri, { dbName: `ir_security_remediation_test_${crypto.randomUUID().replaceAll('-', '')}`, serverSelectionTimeoutMS: 5000 });
    t.after(async () => { await mongoose.connection.dropDatabase(); await mongoose.disconnect(); });
    const User = require('../models/User'); const Rental = require('../models/Rental'); const Capture = require('../models/PaymentCapture');
    await Promise.all([Rental.createIndexes(), Capture.createIndexes()]);
    const user = await User.create(fixture.user);
    const rental = await Rental.create({ user: user._id, orderItems: [], shippingAddress: { address: 'Synthetic address', city: 'Delhi', postalCode: '110001', country: 'India', phone: '9000000000' },
        rentalPeriod: { startDate: new Date(), endDate: new Date(), durationMonths: 1 }, checkoutFlow: 'staged', totalPrice: 1200,
        pricingSnapshot: { version: 1, hash: 'synthetic-quote', totalPaise: 120000, deliveryPaise: 10000, currency: 'INR' },
        staged: { advancePaise: 12000, paidPaise: 0, advance: { providerOrderId: 'synthetic-advance-order', amountPaise: 12000, quoteHash: 'synthetic-quote', mode: 'sandbox', state: 'pending' } } });
    let receipts = 0;
    const service = loadSource('services/stagedCheckout.js', { '../utils/sendEmail': async () => { receipts++; } });
    const order = { order_id: 'synthetic-advance-order', order_status: 'PAID', order_amount: 120, order_currency: 'INR', customer_details: { customer_id: String(user._id) } };
    const payment = { order_id: order.order_id, cf_payment_id: 'synthetic-capture-advance', payment_status: 'SUCCESS', is_captured: true, payment_currency: 'INR', payment_amount: 120 };
    await Promise.all(Array.from({ length: 8 }, async () => service.settleStage(await Rental.findById(rental._id), 'advance', order, payment)));
    let saved = await Rental.findById(rental._id);
    assert.equal(saved.isPaid, false); assert.equal(saved.staged.paidPaise, 12000); assert.equal(receipts, 1);
    await User.updateOne({ _id: user._id }, { $set: { 'kyc.status': 'approved' } });
    saved = await service.finalize(saved, 30000, 'Reviewed delivery');
    assert.equal(saved.totalPrice, 1400); assert.equal(saved.pricingSnapshot.totalPaise, 120000);
    const balance = { providerOrderId: 'synthetic-balance-order', amountPaise: 128000, quoteHash: saved.staged.finalQuote.hash, mode: 'sandbox', state: 'pending' };
    saved = await service.lockedUpdate(saved, { 'staged.finalQuote.hash': balance.quoteHash }, { 'staged.balance': balance }, true);
    await assert.rejects(() => service.finalize(saved, 20000, 'Another delivery'), /frozen/);
    const finalOrder = { ...order, order_id: balance.providerOrderId, order_amount: 1280 };
    const finalPayment = { ...payment, order_id: balance.providerOrderId, cf_payment_id: 'synthetic-capture-balance', payment_amount: 1280 };
    await User.updateOne({ _id: user._id }, { $set: { 'kyc.status': 'rejected' } });
    await Promise.all(Array.from({ length: 8 }, async () => service.settleStage(await Rental.findById(rental._id), 'balance', finalOrder, finalPayment)));
    saved = await Rental.findById(rental._id);
    assert.equal(saved.staged.paidPaise, 140000); assert.equal(saved.isPaid, true); assert.equal(saved.refundReviewRequired, true); assert.equal(receipts, 2);
    assert.equal(await Capture.countDocuments(), 2);
    await assert.rejects(() => service.assertFulfillment(saved), /approved KYC/);
});
