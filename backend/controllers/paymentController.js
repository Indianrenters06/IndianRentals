const crypto = require('node:crypto');
const axios = require('axios');
const asyncHandler = require('express-async-handler');
const Rental = require('../models/Rental');
const { cashfreeConfig, cashfreeHeaders, assertCashfreeConfigured } = require('../config/cashfree');
const { snapshotFor, reconcileOrder, persistVerifiedPayment } = require('../services/paymentSettlement');
const { assertCheckoutStorageReady } = require('../utils/checkoutStorage');

const providerOptions = () => ({ headers: cashfreeHeaders(), timeout: 10000 });
function reject(message, statusCode) { const error = new Error(message); error.statusCode = statusCode; throw error; }
function validId(id) { if (typeof id !== 'string' || !/^[a-f\d]{24}$/i.test(id)) reject('Invalid rental identifier', 400); }
async function ownerRental(req) {
    validId(req.body.rentalId);
    const rental = await Rental.findById(req.body.rentalId).populate('user', 'name email phone');
    if (!rental) reject('Rental not found', 404);
    if (String(rental.user?._id || rental.user) !== String(req.user._id)) reject('Not authorized for this rental', 403);
    if (rental.checkoutFlow === 'staged') reject('Use the staged payment endpoint for this booking', 409);
    return rental;
}
const route = handler => asyncHandler(async (req, res) => {
    try { assertCashfreeConfigured(); await handler(req, res); }
    catch (error) {
        // Never serialize Axios config, headers or provider payloads containing
        // secrets/customer details. Return a bounded error, without logging them.
        res.status(error.statusCode || 502);
        throw new Error(error.statusCode ? error.message : 'Payment processing is unavailable. Please retry.');
    }
});

async function settleRentalFromCashfree(id) {
    validId(id);
    const rental = await Rental.findById(id).populate('user', 'name email phone');
    if (!rental) reject('Rental not found', 404);
    if (rental.checkoutFlow === 'staged') reject('Use staged payment settlement for this booking', 409);
    snapshotFor(rental);
    const { data: order } = await axios.get(`${cashfreeConfig.baseUrl}/orders/${id}`, providerOptions());
    reconcileOrder(rental, order);
    if (order.order_status === 'PAID') {
        const { data: payments } = await axios.get(`${cashfreeConfig.baseUrl}/orders/${id}/payments`, providerOptions());
        const successful = Array.isArray(payments) ? payments.filter(payment => payment.payment_status === 'SUCCESS') : [];
        if (successful.length !== 1) reject('Successful provider transaction is not uniquely confirmed', 503);
        const settled = await persistVerifiedPayment(rental, order, successful[0]);
        return { rental: settled, status: order.order_status };
    }
    if (!rental.isPaid && ['EXPIRED', 'TERMINATED'].includes(order.order_status)) {
        await Rental.findOneAndUpdate({ _id: id, isPaid: false }, { $set: { paymentState: 'cancelled' } }, { new: true });
    }
    return { rental, status: order.order_status };
}

const createCashfreeOrder = route(async (req, res) => {
    let rental = await ownerRental(req);
    await assertCheckoutStorageReady(Rental);
    snapshotFor(rental);
    if (rental.isPaid) return res.json({ alreadyPaid: true, rental });
    if (rental.status === 'Cancelled' || rental.paymentState === 'cancelled') reject('This checkout is cancelled. Start a new checkout.', 409);
    const id = String(rental._id);
    const requestKey = rental.payment?.requestKey || crypto.randomUUID();
    rental = await Rental.findOneAndUpdate({ _id: id, isPaid: false, status: { $ne: 'Cancelled' }, 'pricingSnapshot.hash': rental.pricingSnapshot.hash },
        { $set: { paymentState: 'payment_pending', 'payment.providerOrderId': id, 'payment.mode': 'sandbox', 'payment.requestKey': requestKey } },
        { new: true }).populate('user', 'name email phone');
    if (!rental) reject('Order changed while starting payment. Please retry.', 409);
    const respond = async order => {
        reconcileOrder(rental, order);
        if (order.order_status === 'PAID') {
            const settled = await settleRentalFromCashfree(id);
            return res.json({ alreadyPaid: settled.rental.isPaid === true, rental: settled.rental });
        }
        if (order.order_status !== 'ACTIVE' || typeof order.payment_session_id !== 'string' || !order.payment_session_id) reject('Provider checkout is unavailable for this order', 409);
        return res.json({ paymentSessionId: order.payment_session_id, orderId: id, mode: 'sandbox' });
    };
    let existing;
    try { existing = (await axios.get(`${cashfreeConfig.baseUrl}/orders/${id}`, providerOptions())).data; }
    catch (error) { if (error.response?.status !== 404) throw error; }
    if (existing) return respond(existing);
    const phone = String(rental.user?.phone || rental.shippingAddress?.phone || '').replace(/\D/g, '').slice(-10);
    if (!/^[6-9]\d{9}$/.test(phone)) reject('A valid customer phone is required', 400);
    const frontend = new URL(process.env.FRONTEND_URL || 'http://localhost:3000');
    if (!['https:', 'http:'].includes(frontend.protocol) || frontend.username || frontend.password) reject('Invalid checkout return URL configuration', 503);
    const payload = { order_id: id, order_amount: rental.pricingSnapshot.totalPaise / 100, order_currency: rental.pricingSnapshot.currency,
        customer_details: { customer_id: String(rental.user._id), customer_name: rental.user.name || 'Customer', customer_email: rental.user.email, customer_phone: phone },
        order_meta: { return_url: `${frontend.origin}/order-confirmation?orderId=${id}` }, order_note: `IndianRenters rental ${id}` };
    try {
        const { data } = await axios.post(`${cashfreeConfig.baseUrl}/orders`, payload,
            { ...providerOptions(), headers: { ...cashfreeHeaders(), 'x-idempotency-key': requestKey } });
        return respond(data);
    } catch (error) {
        if (error.response?.status !== 409) throw error;
        // Concurrent fixed-ID creation: reuse only after reconciliation.
        const { data } = await axios.get(`${cashfreeConfig.baseUrl}/orders/${id}`, providerOptions());
        return respond(data);
    }
});

const verifyCashfreePayment = route(async (req, res) => {
    const rental = await ownerRental(req);
    const settled = await settleRentalFromCashfree(String(rental._id));
    res.json({ status: settled.status, paid: settled.rental?.isPaid === true, rental: settled.rental });
});

const cashfreeWebhook = route(async (req, res) => {
    const signature = req.headers['x-webhook-signature'];
    const timestamp = req.headers['x-webhook-timestamp'];
    if (typeof signature !== 'string' || typeof timestamp !== 'string' || !/^\d{13}$/.test(timestamp) || !Buffer.isBuffer(req.rawBody)) reject('Missing exact webhook body or signature headers', 400);
    const expected = crypto.createHmac('sha256', cashfreeConfig.secretKey).update(timestamp).update(req.rawBody).digest('base64');
    const provided = Buffer.from(signature);
    if (provided.length !== Buffer.byteLength(expected) || !crypto.timingSafeEqual(Buffer.from(expected), provided)) reject('Invalid webhook signature', 401);
    // Parse authenticated bytes, not the middleware-modified body. Old signed
    // retries remain valid; atomic dedup prevents replay side effects.
    let event;
    try { event = JSON.parse(req.rawBody.toString('utf8')); }
    catch { reject('Invalid webhook payload', 400); }
    if (event.type === 'PAYMENT_SUCCESS_WEBHOOK') {
        if (event.data?.payment?.payment_status !== 'SUCCESS') reject('Invalid success event', 400);
        const providerId = event.data?.order?.order_id;
        const staged = typeof providerId === 'string' && providerId.startsWith('ir_');
        const settled = staged ? await require('./stagedCheckoutController').settleStagedProviderOrder(providerId) : await settleRentalFromCashfree(providerId);
        if (staged ? !settled.stagePaid : !settled.rental?.isPaid) reject('Payment is awaiting independent confirmation', 503);
    }
    // Non-success attempts never undo success. A success is acknowledged only
    // after paid state and its receipt intent are durably persisted.
    res.status(200).json({ received: true });
});

module.exports = { createCashfreeOrder, verifyCashfreePayment, cashfreeWebhook };
