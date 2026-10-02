const test = require('node:test');
const assert = require('node:assert/strict');
const { loadSource, invoke, serveRouter } = require('./helpers');
const id = '697f5f7934195cb8014c8dbf';
const clone = value => JSON.parse(JSON.stringify(value));
function fixture() {
    const rental = { _id: id, user: { _id: 'owner', name: 'Synthetic customer', email: 'customer@example.test', phone: '9000000000' },
        checkoutFlow: 'staged', pricingSnapshot: { version: 1, currency: 'INR', hash: 'estimate', totalPaise: 120000, deliveryPaise: 10000 },
        staged: { advancePaise: 12000, paidPaise: 0, advance: { providerOrderId: `ir_${id}_advance`, requestKey: 'fixed-advance', amountPaise: 12000, quoteHash: 'estimate', mode: 'sandbox', state: 'pending' } },
        status: 'Pending', isPaid: false, refundReviewRequired: false, shippingAddress: { phone: '9000000000' }, totalPrice: 1200, shippingPrice: 100, orderItems: [] };
    const user = { _id: 'owner', role: 'customer', kyc: { status: 'pending' }, isActive: true, isBlocked: false };
    const get = (value, path) => path.split('.').reduce((v, key) => v?.[key], value);
    const matches = (value, filter) => Object.entries(filter).every(([path, expected]) => {
        const actual = path === 'user' ? value.user?._id || value.user : get(value, path);
        if (expected && typeof expected === 'object') {
            if ('$exists' in expected) return (actual !== undefined) === expected.$exists;
            if ('$ne' in expected) return actual !== expected.$ne;
        }
        return String(actual) === String(expected);
    });
    const apply = (value, updates) => { for (const [path, amount] of Object.entries(updates.$inc || {})) {
        const keys = path.split('.'); let target = value; for (const key of keys.slice(0, -1)) target = target[key] ??= {}; target[keys.at(-1)] = (target[keys.at(-1)] || 0) + amount;
    } for (const [path, entry] of Object.entries(updates.$set || {})) {
        const keys = path.split('.'); let target = value; for (const key of keys.slice(0, -1)) target = target[key] ??= {}; target[keys.at(-1)] = clone(entry);
    } };
    const query = value => ({ populate() { return this; }, select() { return this; }, session() { return this; }, sort() { return this; }, then(resolve, reject) { return Promise.resolve(value).then(resolve, reject); } });
    let receipts = 0; let posts = 0; let posted; let providerMissing = false; let writes = 0; let tail = Promise.resolve();
    const Rental = { findById: () => query(clone(rental)), find: () => query([clone(rental)]), findOne: filter => query(matches(rental, filter) ? clone(rental) : null),
        findOneAndUpdate(filter, updates) { if (!matches(rental, filter)) return query(null); apply(rental, updates); writes++; return query(clone(rental)); } };
    const User = { findById: () => query(clone(user)), findOneAndUpdate(filter, updates) { if (!matches(user, filter)) return query(null); apply(user, updates); return query(clone(user)); } };
    const order = { order_id: rental.staged.advance.providerOrderId, order_status: 'PAID', order_amount: 120, order_currency: 'INR', customer_details: { customer_id: 'owner' }, payment_session_id: 'synthetic-session' };
    const payment = { order_id: order.order_id, cf_payment_id: 'synthetic-advance', payment_status: 'SUCCESS', is_captured: true, payment_currency: 'INR', payment_amount: 120 };
    const overrides = { '../models/Rental': Rental, '../models/User': User,
        mongoose: { connection: { transaction(fn) { const result = tail.then(() => fn('synthetic-session')); tail = result.catch(() => {}); return result; } } },
        '../utils/sendEmail': async () => { receipts++; },
        '../utils/checkoutStorage': { assertCheckoutStorageReady: async () => {}, assertStagedStorageReady: async () => {} },
        '../config/cashfree': { cashfreeConfig: { baseUrl: 'https://sandbox.cashfree.com/pg', mode: 'sandbox' }, cashfreeHeaders: () => ({}), assertCashfreeConfigured() {} },
        axios: { async get(url) { if (providerMissing && !url.endsWith('/payments')) { const error = new Error('synthetic 404'); error.response = { status: 404 }; throw error; } return { data: url.endsWith('/payments') ? [clone(payment)] : clone(order) }; },
            async post(url, payload, opts) { posts++; posted = { payload, opts }; providerMissing = false; Object.assign(order, { order_id: payload.order_id, order_amount: payload.order_amount, order_status: 'ACTIVE' }); return { data: clone(order) }; } },
        './notificationController': { createNotification: async () => {} }, '../utils/sendTemplatedEmail': { sendTemplatedEmail: async () => true },
    };
    const captures = new Map();
    const Capture = { findById: async id => captures.get(id), create: async values => {
        if (captures.has(values[0]._id)) { const error = new Error('duplicate capture'); error.code = 11000; throw error; }
        captures.set(values[0]._id, clone(values[0])); return values;
    } };
    overrides['../models/PaymentCapture'] = Capture;
    const ledger = loadSource('services/captureLedger.js', overrides); overrides['./captureLedger'] = ledger;
    const service = loadSource('services/stagedCheckout.js', overrides); overrides['../services/stagedCheckout'] = service;
    const controller = loadSource('controllers/stagedCheckoutController.js', overrides);
    const balance = async () => {
        await service.settleStage(clone(rental), 'advance', clone(order), clone(payment)); user.kyc.status = 'approved';
        await service.finalize(clone(rental));
        rental.staged.balance = { providerOrderId: `ir_${id}_balance`, requestKey: 'fixed-balance', amountPaise: 108000, quoteHash: rental.staged.finalQuote.hash, mode: 'sandbox', state: 'pending' };
        Object.assign(order, { order_id: rental.staged.balance.providerOrderId, order_amount: 1080 });
        Object.assign(payment, { order_id: order.order_id, cf_payment_id: 'synthetic-balance', payment_amount: 1080 });
    };
    return { rental, user, order, payment, overrides, service, controller, balance, writes: () => writes, receipts: () => receipts, posts: () => posts, posted: () => posted,
        missingProvider() { providerMissing = true; } };
}
const request = (body = {}, owner = 'owner') => ({ user: { _id: owner, role: 'customer' }, params: { id }, body: { rentalId: id, ...body } });

test('Staged: captured advance is recorded once under concurrent callbacks and never marks the booking fully paid', async () => {
    const f = fixture();
    await Promise.all(Array.from({ length: 8 }, () => f.service.settleStage(clone(f.rental), 'advance', f.order, f.payment)));
    assert.equal(f.rental.staged.paidPaise, 12000); assert.equal(f.rental.isPaid, false); assert.equal(f.rental.staged.advance.state, 'paid'); assert.equal(f.receipts(), 1);
    assert.equal((await f.service.stateFor(f.rental)).canPayBalance, false);
});
test('Staged: finalization refuses unpaid/unapproved state and ignores browser financials', async () => {
    const f = fixture();
    assert.equal((await invoke(f.controller.finalizeStagedRental, request())).statusCode, 409);
    await f.service.settleStage(clone(f.rental), 'advance', f.order, f.payment);
    assert.equal((await invoke(f.controller.finalizeStagedRental, request())).statusCode, 409);
    f.user.kyc.status = 'approved';
    const result = await invoke(f.controller.finalizeStagedRental, request({ deliveryPaise: 1, totalPaise: 1 }));
    assert.equal(result.statusCode, 200); assert.equal(result.body.finalQuote.totalPaise, 120000); assert.equal(result.body.balancePaise, 108000); assert.equal(result.body.canPayBalance, true);
});
test('Staged: final delivery adjustment preserves initial quote/advance and freezes after balance starts', async () => {
    const f = fixture(); await f.service.settleStage(clone(f.rental), 'advance', f.order, f.payment); f.user.kyc.status = 'approved';
    await f.service.finalize(clone(f.rental), 30000, 'Reviewed delivery address');
    assert.equal(f.rental.pricingSnapshot.totalPaise, 120000); assert.equal(f.rental.staged.advancePaise, 12000); assert.equal(f.rental.totalPrice, 1400);
    assert.equal((await f.service.stateFor(f.rental)).balancePaise, 128000);
    assert.notEqual(f.rental.staged.finalQuote.hash, 'estimate');
    f.rental.staged.balance = { providerOrderId: `ir_${id}_balance` };
    await assert.rejects(() => f.service.finalize(clone(f.rental), 20000, 'Another change'), /frozen/);
});
test('Staged: sandbox initiation takes stored paise/quote and reuses the fixed provider ID/session', async () => {
    const f = fixture(); f.order.order_status = 'ACTIVE'; f.missingProvider();
    const r = request({ stage: 'advance', quoteHash: 'estimate', amount: 1 });
    assert.equal((await invoke(f.controller.createStagedPayment, r)).statusCode, 200);
    assert.equal(f.posted().payload.order_amount, 120); assert.equal(f.posted().payload.order_id, `ir_${id}_advance`);
    assert.equal(f.posted().opts.headers['x-idempotency-key'], 'fixed-advance');
    assert.equal((await invoke(f.controller.createStagedPayment, r)).statusCode, 200); assert.equal(f.posts(), 1);
    assert.equal((await invoke(f.controller.createStagedPayment, request({ stage: 'advance', quoteHash: 'tampered' }))).statusCode, 409);
});
test('Staged: foreign ownership, premature balance and cross-stage provider data cannot settle', async () => {
    const f = fixture();
    assert.equal((await invoke(f.controller.getStagedRental, request({}, 'stranger'))).statusCode, 403);
    assert.equal((await invoke(f.controller.createStagedPayment, request({ stage: 'balance', quoteHash: 'estimate' }))).statusCode, 409);
    await assert.rejects(() => f.service.settleStage(f.rental, 'advance', { ...f.order, order_id: `ir_${id}_balance` }, f.payment), /reconciliation/);
    await assert.rejects(() => f.service.settleStage(f.rental, 'advance', f.order, { ...f.payment, payment_amount: 1 }), /reconciliation/);
    await assert.rejects(() => f.service.settleStage(f.rental, 'advance', f.order, { ...f.payment, is_captured: false }), /reconciliation/);
    assert.equal(f.rental.staged.paidPaise, 0);
});
test('Staged: complete balance credits advance exactly once and current KYC gates fulfillment', async () => {
    const f = fixture(); await f.balance();
    await Promise.all(Array.from({ length: 5 }, () => f.service.settleStage(clone(f.rental), 'balance', f.order, f.payment)));
    assert.equal(f.rental.isPaid, true); assert.equal(f.rental.staged.paidPaise, 120000); assert.equal(f.receipts(), 2);
    await f.service.assertFulfillment(f.rental); f.user.kyc.status = 'rejected';
    await assert.rejects(() => f.service.assertFulfillment(f.rental), /approved KYC/);
});
test('Staged: cancellation after advance flags manual review and late capture records money without opening fulfillment', async () => {
    const f = fixture(); await f.service.settleStage(clone(f.rental), 'advance', f.order, f.payment);
    const rentals = loadSource('controllers/rentalController.js', f.overrides);
    assert.equal((await invoke(rentals.cancelMyRental, request())).statusCode, 200);
    assert.equal(f.rental.refundReviewRequired, true); assert.equal(f.rental.isPaid, false);
    const late = fixture(); late.rental.status = 'Cancelled'; await late.service.settleStage(clone(late.rental), 'advance', late.order, late.payment);
    assert.equal(late.rental.staged.paidPaise, 12000); assert.equal(late.rental.paymentState, 'manual_review'); assert.equal(late.rental.isPaid, false);
});
test('Staged: KYC rejection between provider initiation and capture preserves balance money for manual review', async () => {
    const f = fixture(); await f.balance(); f.user.kyc.status = 'rejected';
    await f.service.settleStage(clone(f.rental), 'balance', f.order, f.payment);
    assert.equal(f.rental.staged.paidPaise, 120000); assert.equal(f.rental.isPaid, true); assert.equal(f.rental.refundReviewRequired, true);
    const admin = loadSource('controllers/adminController.js', f.overrides);
    assert.equal((await invoke(admin.updateRentalStatus, { ...request(), body: { status: 'Approved' } })).statusCode, 409);
});
test('Staged: a second captured provider transaction cannot replace a settled stage', async () => {
    const f = fixture(); await f.service.settleStage(clone(f.rental), 'advance', f.order, f.payment);
    await assert.rejects(() => f.service.settleStage(clone(f.rental), 'advance', f.order, { ...f.payment, cf_payment_id: 'different' }), /another transaction/);
    assert.equal(f.rental.staged.paidPaise, 12000);
});
test('Staged: legacy payment endpoints refuse staged bookings and admin reports only actual stage payments', async () => {
    const f = fixture(); const legacy = loadSource('controllers/paymentController.js', f.overrides);
    assert.equal((await invoke(legacy.createCashfreeOrder, request())).statusCode, 409);
    assert.equal((await invoke(legacy.verifyCashfreePayment, request())).statusCode, 409);
    await f.service.settleStage(clone(f.rental), 'advance', f.order, f.payment);
    const admin = loadSource('controllers/adminController.js', f.overrides);
    const payments = await invoke(admin.getAllPayments, request());
    assert.equal(payments.body[0].stage, 'advance'); assert.equal(payments.body[0].amountPaid, 120); assert.equal(payments.body[0].amount, 120);
    const invoices = await invoke(admin.getAllInvoices, request());
    assert.equal(invoices.body[0].status, 'partially_paid'); assert.equal(invoices.body[0].balanceDue, 1080);
});

test('Staged: one captured transaction ID cannot be reused across advance and balance ledgers', async () => {
    const f = fixture(); await f.balance(); f.payment.cf_payment_id = 'synthetic-advance';
    await assert.rejects(() => f.service.settleStage(clone(f.rental), 'balance', f.order, f.payment), /another payment association/);
    assert.equal(f.rental.staged.paidPaise, 12000); assert.equal(f.rental.isPaid, false);
});

test('Staged: order creation accepts a customer before KYC while keeping all quote amounts server-derived', async () => {
    const f = fixture();
    const Rental = function(value) { Object.assign(this, value); this._id = id; this.isPaid = false; this.save = async () => this; };
    Rental.findOne = async () => null;
    const quote = { ...f.rental.pricingSnapshot, lines: [{ product: id, qty: 1, tenureMonths: 1, name: 'Synthetic product', image: '/synthetic.webp', unitRentPaise: 100000, unitDepositPaise: 10000 }],
        rentPaise: 100000, depositPaise: 10000, taxPaise: 0, deliveryPaise: 10000, discountPaise: 0 };
    const rentals = loadSource('controllers/rentalController.js', { ...f.overrides, '../models/Rental': Rental,
        '../models/Settings': { findOne: async () => ({ requireKYC: true }) },
        '../services/rentalQuote': { fingerprint: () => 'synthetic-selection', buildRentalQuote: async () => quote } });
    const result = await invoke(rentals.addStagedRental, request({ checkoutKey: 'synthetic-booking-key', quoteHash: 'estimate', orderItems: [{ product: id, qty: 1, tenureMonths: 1 }], totalPrice: 1, isPaid: true, checkoutFlow: 'legacy', staged: { paidPaise: 120000 } }));
    assert.equal(result.statusCode, 201); assert.equal(result.body.checkoutFlow, 'staged'); assert.equal(result.body.totalPrice, 1200);
    assert.equal(result.body.isPaid, false); assert.equal(result.body.staged.paidPaise, 0); assert.equal(result.body.staged.advancePaise, 12000);
    assert.equal((await invoke(rentals.addStagedRental, { ...request(), user: { _id: 'staff', role: 'admin' } })).statusCode, 403);
});
test('Staged: authenticated webhook independently confirms advance without pretending the order is fully paid', async () => {
    const f = fixture(); const crypto = require('node:crypto');
    f.overrides['../config/cashfree'].cashfreeConfig.secretKey = 'synthetic-secret';
    const legacy = loadSource('controllers/paymentController.js', { ...f.overrides, './stagedCheckoutController': f.controller });
    const rawBody = Buffer.from(JSON.stringify({ type: 'PAYMENT_SUCCESS_WEBHOOK', data: { order: { order_id: f.order.order_id }, payment: { payment_status: 'SUCCESS' } } }));
    const timestamp = String(Date.now());
    const headers = { 'x-webhook-timestamp': timestamp, 'x-webhook-signature': crypto.createHmac('sha256', 'synthetic-secret').update(timestamp).update(rawBody).digest('base64') };
    assert.equal((await invoke(legacy.cashfreeWebhook, { rawBody, headers })).statusCode, 200);
    assert.equal(f.rental.isPaid, false); assert.equal(f.rental.staged.advance.state, 'paid');
    assert.equal((await invoke(legacy.cashfreeWebhook, { rawBody: Buffer.from(`${rawBody} `), headers })).statusCode, 401);
});
test('Staged: global capture provenance also refuses reuse in legacy settlement', async () => {
    const f = fixture(); await f.service.settleStage(clone(f.rental), 'advance', f.order, f.payment);
    const settlement = loadSource('services/paymentSettlement.js', f.overrides);
    const rental = { _id: id, user: 'owner', totalPrice: 1200, isPaid: false, pricingSnapshot: f.rental.pricingSnapshot,
        payment: { providerOrderId: id, mode: 'sandbox' } };
    await assert.rejects(() => settlement.persistVerifiedPayment(rental,
        { ...f.order, order_id: id, order_amount: 1200 }, { ...f.payment, order_id: id, payment_amount: 1200 }), /another payment association/);
});
test('Staged: financial reports count captured advances and keep review exposure separate from refunded totals', async () => {
    const pipelines = [];
    const reports = loadSource('controllers/reportController.js', { '../models/Rental': { aggregate: async pipeline => { pipelines.push(pipeline); return []; } } });
    await invoke(reports.getRevenueReport, { query: { year: '2026' } });
    const sum = pipelines[2][0].$group.totalRevenue.$sum;
    const evaluate = (expression, value) => {
        if (typeof expression === 'string' && expression.startsWith('$')) return expression.slice(1).split('.').reduce((v, key) => v?.[key], value);
        if (!expression || typeof expression !== 'object') return expression;
        if (expression.$eq) return evaluate(expression.$eq[0], value) === evaluate(expression.$eq[1], value);
        if (expression.$ifNull) return evaluate(expression.$ifNull[0], value) ?? evaluate(expression.$ifNull[1], value);
        if (expression.$divide) return evaluate(expression.$divide[0], value) / evaluate(expression.$divide[1], value);
        if (expression.$cond) return evaluate(expression.$cond[evaluate(expression.$cond[0], value) ? 1 : 2], value);
    };
    assert.equal(evaluate(sum, { checkoutFlow: 'staged', isPaid: false, staged: { paidPaise: 12000 }, totalPrice: 1200 }), 120);
    assert.equal(evaluate(sum, { checkoutFlow: 'legacy', isPaid: false, totalPrice: 1200 }), 0);
    assert.equal(evaluate(sum, { checkoutFlow: 'legacy', isPaid: true, totalPrice: 1200 }), 1200);
    pipelines.length = 0;
    const result = await invoke(reports.getRefundReport, { query: { year: '2026' } });
    assert.equal(pipelines[0][0].$match.checkoutFlow.$ne, 'staged');
    assert.equal(pipelines[4][0].$match.refundReviewRequired, true);
    assert.equal(result.body.manualReview.capturedAmount, 0);
});

test('Staged: registered HTTP routes connect advance settlement, approved KYC, admin delivery review and the final balance', async t => {
    const f = fixture();
    // Synthetic authentication only; the actual route modules and controllers
    // still run. This verifies the public API contract without provider calls.
    const auth = {
        protect(req, res, next) {
            req.user = req.headers['x-synthetic-admin'] === 'orders'
                ? { _id: 'staff', role: 'admin', permissions: ['orders'] }
                : { _id: 'owner', role: 'customer' };
            next();
        },
        admin(req, res, next) { return req.user.role === 'admin' ? next() : res.status(403).json({ message: 'Admin required' }); },
        hasPermission: permission => (req, res, next) => req.user.permissions?.includes(permission)
            ? next() : res.status(403).json({ message: 'Permission required' }),
    };
    const modules = { ...f.overrides, '../middleware/authMiddleware': auth,
        '../controllers/stagedCheckoutController': f.controller,
        '../controllers/rentalController': loadSource('controllers/rentalController.js', f.overrides),
        '../controllers/paymentController': loadSource('controllers/paymentController.js', f.overrides) };
    const rentals = await serveRouter(t, loadSource('routes/rentalRoutes.js', modules), '/api/rentals');
    const payments = await serveRouter(t, loadSource('routes/paymentRoutes.js', modules), '/api/payments');
    const json = (body, admin = false, method = 'POST') => ({ method, headers: { 'Content-Type': 'application/json',
        ...(admin ? { 'x-synthetic-admin': 'orders' } : {}) }, body: JSON.stringify(body) });

    let response = await rentals(`/${id}/staged`);
    assert.equal(response.status, 200);
    assert.equal((await response.json()).canPayBalance, false);
    response = await payments('/staged/verify', json({ rentalId: id, stage: 'advance' }));
    assert.equal(response.status, 200);
    const advance = await response.json();
    assert.equal(advance.stagePaid, true);
    assert.equal(advance.paidPaise, 12000);
    assert.equal(advance.rental.isPaid, false);
    assert.equal((await rentals(`/${id}/staged/finalize`, json({}))).status, 409);

    f.user.kyc.status = 'approved';
    response = await rentals(`/${id}/staged/finalize`, json({}));
    assert.equal(response.status, 200);
    assert.equal((await response.json()).balancePaise, 108000);
    assert.equal((await rentals(`/${id}/staged/final-quote`, json({ deliveryPaise: 30000, reason: 'Reviewed delivery' }, false, 'PUT'))).status, 403);
    response = await rentals(`/${id}/staged/final-quote`, json({ deliveryPaise: 30000, reason: 'Reviewed delivery' }, true, 'PUT'));
    assert.equal(response.status, 200);
    const reviewed = await response.json();
    assert.equal(reviewed.balancePaise, 128000);
    assert.equal(reviewed.finalQuote.reviewedBy, 'staff');

    f.order.order_status = 'ACTIVE'; f.missingProvider();
    response = await payments('/staged/order', json({ rentalId: id, stage: 'balance', quoteHash: reviewed.finalQuote.hash }));
    assert.equal(response.status, 200);
    assert.equal((await response.json()).amountPaise, 128000);
    assert.equal(f.posted().payload.order_meta.return_url.includes(`/checkout/staged?orderId=${id}&paymentStage=balance`), true);
    Object.assign(f.order, { order_status: 'PAID' });
    Object.assign(f.payment, { order_id: f.order.order_id, cf_payment_id: 'synthetic-http-balance', payment_amount: 1280 });
    response = await payments('/staged/verify', json({ rentalId: id, stage: 'balance' }));
    assert.equal(response.status, 200);
    const settled = await response.json();
    assert.equal(settled.rental.isPaid, true);
    assert.equal(settled.paidPaise, 140000);
    assert.equal(settled.balancePaise, 0);
});
