const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { loadSource, invoke, serveRouter } = require('./helpers');
const id = '697f5f7934195cb8014c8dbf';
function fixture() {
    const rental = { _id: id, user: { _id: 'owner', name: 'Test', email: 'test@example.test', phone: '9000000000', equals: value => value === 'owner' },
        isPaid: false, status: 'Pending', totalPrice: 1180,
        pricingSnapshot: { version: 1, hash: 'immutable', totalPaise: 118000, currency: 'INR' },
        payment: { providerOrderId: id, mode: 'sandbox', requestKey: '3d00600b-e7a9-4a13-bb39-dd891ad60820' }, paymentState: 'payment_pending',
        async save() { writes++; return this; } };
    rental.user._id = { toString: () => 'owner', equals: value => String(value) === 'owner' };
    let writes = 0, sends = 0, failWrite = false, failProvider = false, sendResult = true, missingOrder = false, posts = 0, posted;
    const query = value => ({ populate() { return this; }, then(resolve, reject) { return Promise.resolve(value).then(resolve, reject); } });
    const Rental = { findById: () => query(rental),
        findOneAndUpdate(filter, update) {
            if (failWrite) throw new Error('synthetic persistence failure');
            const get = key => key.split('.').reduce((obj, part) => obj?.[part], rental);
            for (const [key, expected] of Object.entries(filter)) {
                const actual = key === 'user' ? String(rental.user?._id || rental.user) : get(key);
                if (expected && typeof expected === 'object' && '$ne' in expected) { if (actual === expected.$ne) return query(null); }
                else if (String(actual) !== String(expected)) return query(null);
            }
            for (const [key, value] of Object.entries(update.$set || {})) {
                const parts = key.split('.'); let target = rental;
                for (const part of parts.slice(0, -1)) target = target[part] ??= {};
                target[parts.at(-1)] = value;
            }
            writes++; return query(rental);
        },
    };
    const order = { order_id: id, order_status: 'PAID', order_amount: 1180, order_currency: 'INR', customer_details: { customer_id: 'owner' }, payment_session_id: 'synthetic-session' };
    const payment = { order_id: id, cf_payment_id: 'synthetic-payment', payment_status: 'SUCCESS', is_captured: true, payment_amount: 1180, payment_currency: 'INR' };
    const config = { cashfreeConfig: { secretKey: 'synthetic-secret', baseUrl: 'https://sandbox.cashfree.com/pg', mode: 'sandbox' }, cashfreeHeaders: () => ({}), assertCashfreeConfigured() {} };
    const overrides = { '../services/captureLedger': { registerCapture: async () => {} }, './captureLedger': { registerCapture: async () => {} }, '../models/Rental': Rental,
        './notificationController': { createNotification: async () => {} },
        '../utils/checkoutStorage': { assertCheckoutStorageReady: async () => {} },
        '../config/cashfree': config,
        '../utils/sendTemplatedEmail': { async sendTemplatedEmail() { sends++; return sendResult; } },
        axios: { async get(url) {
            if (failProvider) throw new Error('synthetic network failure');
            if (missingOrder && !url.endsWith('/payments')) { const error = new Error('synthetic 404'); error.response = { status: 404 }; throw error; }
            return { data: url.endsWith('/payments') ? [payment] : order };
        }, async post(url, payload, options) { posts++; posted = { payload, options }; missingOrder = false; return { data: order }; } },
    };
    let settlement;
    try { settlement = loadSource('services/paymentSettlement.js', overrides); overrides['../services/paymentSettlement'] = settlement; }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
    const rentalController = loadSource('controllers/rentalController.js', overrides);
    overrides['./rentalController'] = rentalController;
    const controller = loadSource('controllers/paymentController.js', overrides);
    const webhook = (event = { type: 'PAYMENT_SUCCESS_WEBHOOK', data: { order: { order_id: id }, payment: { payment_status: 'SUCCESS' } } }) => {
        const rawBody = Buffer.from(JSON.stringify(event)); const timestamp = String(Date.now());
        return { body: event, rawBody, headers: { 'x-webhook-timestamp': timestamp, 'x-webhook-signature': crypto.createHmac('sha256', 'synthetic-secret').update(timestamp).update(rawBody).digest('base64') } };
    };
    return { rental, order, payment, controller, rentalController, overrides, Rental, webhook, writes: () => writes, sends: () => sends,
        setFailWrite(value) { failWrite = value; }, setFailProvider(value) { failProvider = value; },
        setSendResult(value) { sendResult = value; }, setMissingOrder(value) { missingOrder = value; },
        posts: () => posts, posted: () => posted };
}
test('Payment: provider order uses the snapshot amount and fixed ID/key; retry reuses its session', async () => {
    const f = fixture(); f.order.order_status = 'ACTIVE'; f.setMissingOrder(true);
    const request = { user: { _id: 'owner' }, body: { rentalId: id, totalPrice: 1, order_amount: 1 } };
    assert.equal((await invoke(f.controller.createCashfreeOrder, request)).statusCode, 200);
    assert.equal(f.posted().payload.order_amount, 1180);
    assert.equal(f.posted().payload.order_currency, 'INR');
    assert.equal(f.posted().payload.order_id, id);
    assert.equal(f.posted().options.headers['x-idempotency-key'], f.rental.payment.requestKey);
    assert.equal((await invoke(f.controller.createCashfreeOrder, request)).statusCode, 200);
    assert.equal(f.posts(), 1);
    assert.equal(f.rental.isPaid, false);
});
test('Payment: ambiguous SMTP delivery is persisted and never automatically resent', async () => {
    const f = fixture(); f.setSendResult(false);
    assert.equal((await invoke(f.controller.cashfreeWebhook, f.webhook())).statusCode, 200);
    assert.equal(f.rental.isPaid, true);
    assert.equal(f.rental.paymentReceipt.state, 'delivery_unknown');
    await invoke(f.controller.cashfreeWebhook, f.webhook());
    assert.equal(f.sends(), 1);
});
test('Payment: actual HTTP webhook rejects altered bytes and reconciles a valid signed event', async t => {
    const f = fixture();
    const express = require('express');
    const router = express.Router();
    router.post('/webhook', f.controller.cashfreeWebhook);
    const request = await serveRouter(t, router, '/callbacks');
    const event = f.webhook();
    const headers = { ...event.headers, 'content-type': 'application/json' };
    assert.equal((await request('/webhook', { method: 'POST', headers, body: `${event.rawBody.toString()} ` })).status, 401);
    assert.equal(f.rental.isPaid, false);
    assert.equal((await request('/webhook', { method: 'POST', headers, body: event.rawBody })).status, 200);
    assert.equal(f.rental.isPaid, true);
});
test('Payment: uncaptured success never settles', async () => {
    const f = fixture(); f.payment.is_captured = false;
    assert.equal((await invoke(f.controller.cashfreeWebhook, f.webhook())).statusCode, 409);
    assert.equal(f.rental.isPaid, false);
});
test('Payment: late success on a cancelled order records money for refund review without a receipt', async () => {
    const f = fixture(); f.rental.status = 'Cancelled';
    assert.equal((await invoke(f.controller.cashfreeWebhook, f.webhook())).statusCode, 200);
    assert.equal(f.rental.isPaid, true);
    assert.equal(f.rental.refundReviewRequired, true);
    assert.equal(f.rental.paymentState, 'manual_review');
    assert.equal(f.sends(), 0);
});
test('Payment: cancellation after success enters manual review; unpaid/manual-review orders cannot be fulfilled', async () => {
    const f = fixture();
    const request = { user: { _id: 'owner' }, params: { id }, body: { status: 'Approved' } };
    const admin = loadSource('controllers/adminController.js', f.overrides);
    for (const controller of [f.rentalController, admin]) {
        assert.equal((await invoke(controller.updateRentalStatus, request)).statusCode, 409);
    }
    await invoke(f.controller.cashfreeWebhook, f.webhook());
    const cancelled = await invoke(f.rentalController.cancelMyRental, { ...request, body: {} });
    assert.equal(cancelled.statusCode, 200);
    assert.equal(cancelled.body.paymentState, 'manual_review');
    assert.equal(cancelled.body.refundReviewRequired, true);
    for (const controller of [f.rentalController, admin]) assert.equal((await invoke(controller.updateRentalStatus, request)).statusCode, 409);
});
test('Payment: cancellation refuses a concurrent paid transition, preserving the settled state', async () => {
    const f = fixture();
    f.Rental.findOneAndUpdate = () => { f.rental.isPaid = true; return { populate: async () => null }; };
    const result = await invoke(f.rentalController.cancelMyRental, { user: { _id: 'owner' }, params: { id }, body: {} });
    assert.equal(result.statusCode, 409);
    assert.equal(f.rental.isPaid, true);
    assert.equal(f.rental.status, 'Pending');
});
test('Payment: forged, missing and reserialized webhook signatures never settle', async () => {
    const f = fixture();
    for (const modify of [req => req.headers = {}, req => req.headers['x-webhook-signature'] = 'forged', req => delete req.rawBody]) {
        const req = f.webhook(); modify(req);
        const result = await invoke(f.controller.cashfreeWebhook, req);
        assert.ok(result.statusCode >= 400);
        assert.equal(f.rental.isPaid, false);
    }
});
for (const mismatch of ['amount', 'currency', 'order', 'customer', 'paymentAmount', 'paymentCurrency', 'paymentOrder']) {
    test(`Payment: ${mismatch} mismatch cannot settle`, async () => {
        const f = fixture();
        if (mismatch === 'amount') f.order.order_amount = 1;
        if (mismatch === 'currency') f.order.order_currency = 'USD';
        if (mismatch === 'order') f.order.order_id = 'other-order';
        if (mismatch === 'customer') f.order.customer_details.customer_id = 'other-customer';
        if (mismatch === 'paymentAmount') f.payment.payment_amount = 1;
        if (mismatch === 'paymentCurrency') f.payment.payment_currency = 'USD';
        if (mismatch === 'paymentOrder') f.payment.order_id = 'other-order';
        const result = await invoke(f.controller.cashfreeWebhook, f.webhook());
        assert.ok(result.statusCode >= 400);
        assert.equal(f.rental.isPaid, false); assert.equal(f.sends(), 0);
    });
}
test('Payment: normal, duplicate and concurrent success settle and send only once', async () => {
    const f = fixture();
    const results = await Promise.all(Array.from({ length: 12 }, () => invoke(f.controller.cashfreeWebhook, f.webhook())));
    results.forEach(result => assert.equal(result.statusCode, 200));
    assert.equal(f.rental.isPaid, true); assert.equal(f.sends(), 1);
    assert.equal(f.rental.paymentState, 'confirmed');
    assert.equal((await invoke(f.controller.cashfreeWebhook, f.webhook())).statusCode, 200);
    assert.equal(f.sends(), 1);
});
test('Payment: persistence failure is not acknowledged and a retry can settle', async () => {
    const f = fixture(); f.setFailWrite(true);
    assert.ok((await invoke(f.controller.cashfreeWebhook, f.webhook())).statusCode >= 500);
    assert.equal(f.rental.isPaid, false);
    f.setFailWrite(false);
    assert.equal((await invoke(f.controller.cashfreeWebhook, f.webhook())).statusCode, 200);
    assert.equal(f.rental.isPaid, true);
});
test('Payment: provider failure leaves pending, and failed/abandoned attempts never overwrite paid state', async () => {
    const f = fixture(); f.setFailProvider(true);
    assert.ok((await invoke(f.controller.cashfreeWebhook, f.webhook())).statusCode >= 500);
    assert.equal(f.rental.isPaid, false);
    f.setFailProvider(false); f.order.order_status = 'ACTIVE'; f.payment.payment_status = 'FAILED';
    assert.equal((await invoke(f.controller.verifyCashfreePayment, { user: { _id: 'owner' }, body: { rentalId: id } })).body.paid, false);
    f.order.order_status = 'PAID'; f.payment.payment_status = 'SUCCESS';
    await invoke(f.controller.cashfreeWebhook, f.webhook());
    await invoke(f.controller.cashfreeWebhook, f.webhook({ type: 'PAYMENT_FAILED_WEBHOOK', data: { order: { order_id: id } } }));
    assert.equal(f.rental.isPaid, true); assert.equal(f.sends(), 1);
});
test('Payment: foreign customer cannot create or verify; legacy snapshots cannot start payment', async () => {
    const f = fixture();
    for (const action of ['createCashfreeOrder', 'verifyCashfreePayment']) {
        assert.equal((await invoke(f.controller[action], { user: { _id: 'foreign' }, body: { rentalId: id } })).statusCode, 403);
    }
    delete f.rental.pricingSnapshot;
    assert.equal((await invoke(f.controller.createCashfreeOrder, { user: { _id: 'owner' }, body: { rentalId: id } })).statusCode, 409);
});
test('Payment: maintenance exemption is exact and limited to POST webhook', async () => {
    const middleware = loadSource('middleware/maintenanceMiddleware.js', { '../models/Settings': { findOne: async () => ({ maintenanceMode: true }) } });
    for (const [method, path, allowed] of [['POST', '/api/payments/cashfree/webhook', true], ['GET', '/api/payments/cashfree/webhook', false], ['POST', '/api/payments/cashfree/order', false], ['POST', '/api/payments/cashfree/webhook/extra', false]]) {
        let next = false;
        const res = { statusCode: 200, status(code) { this.statusCode = code; return this; }, json() { return this; } };
        await middleware.checkMaintenanceMode({ method, path }, res, () => next = true);
        assert.equal(next, allowed);
        if (!allowed) assert.equal(res.statusCode, 503);
    }
});
