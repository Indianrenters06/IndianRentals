const asyncHandler = require('express-async-handler');
const crypto = require('node:crypto');
const axios = require('axios');
const Rental = require('../models/Rental');
const { cashfreeConfig, cashfreeHeaders, assertCashfreeConfigured } = require('../config/cashfree');
const { assertStagedStorageReady } = require('../utils/checkoutStorage');
const { assertStaged, stateFor, finalize, lockedUpdate, reconcileStageOrder, settleStage, reject } = require('../services/stagedCheckout');
const { canManageOrders } = require('../utils/orderAccess');
const options = () => ({ headers: cashfreeHeaders(), timeout: 10000 });
const route = handler => asyncHandler(async (req, res) => {
    try { await handler(req, res); }
    catch (error) { res.status(error.statusCode || 503); throw new Error(error.statusCode ? error.message : 'Staged checkout is unavailable. Please retry.'); }
});
async function ownerRental(req, admin = false) {
    const id = req.params?.id || req.body?.rentalId;
    if (typeof id !== 'string' || !/^[a-f\d]{24}$/i.test(id)) reject('Invalid rental identifier', 400);
    const rental = await Rental.findById(id).populate({ path: 'user', select: 'name email phone', transform: (doc, id) => doc || { _id: id } });
    if (!rental) reject('Rental not found', 404);
    if (!admin && String(rental.user?._id || rental.user) !== String(req.user._id)) reject('Not authorized for this booking', 403);
    assertStaged(rental);
    return rental;
}
const getStagedRental = route(async (req, res) => {
    res.setHeader('Cache-Control', 'no-store, private');
    res.json(await stateFor(await ownerRental(req, canManageOrders(req.user))));
});
const finalizeStagedRental = route(async (req, res) => {
    // Owner cannot influence a bill through posted amounts.
    res.json(await stateFor(await finalize(await ownerRental(req), undefined, undefined, req.user._id)));
});
const adjustFinalQuote = route(async (req, res) => {
    if (req.body.deliveryPaise === undefined) reject('An explicit delivery amount is required', 400);
    res.json(await stateFor(await finalize(await ownerRental(req, true), req.body.deliveryPaise, req.body.reason, req.user._id)));
});
async function settleStagedProviderOrder(providerId) {
    if (typeof providerId !== 'string' || !/^ir_[a-f\d]{24}_(advance|balance)$/i.test(providerId)) reject('Invalid staged provider identifier', 400);
    const stage = providerId.endsWith('_advance') ? 'advance' : 'balance';
    const rental = await Rental.findOne({ checkoutFlow: 'staged', [`staged.${stage}.providerOrderId`]: providerId }).populate({ path: 'user', select: 'name email phone', transform: (doc, id) => doc || { _id: id } });
    if (!rental) reject('Staged payment association not found', 404);
    const { data: order } = await axios.get(`${cashfreeConfig.baseUrl}/orders/${providerId}`, options());
    reconcileStageOrder(rental, stage, order);
    if (order.order_status !== 'PAID') return { rental, stage, status: order.order_status, stagePaid: rental.staged[stage]?.state === 'paid' };
    const { data: payments } = await axios.get(`${cashfreeConfig.baseUrl}/orders/${providerId}/payments`, options());
    const successful = Array.isArray(payments) ? payments.filter(p => p.payment_status === 'SUCCESS') : [];
    if (successful.length !== 1) reject('Successful provider transaction is not uniquely confirmed', 503);
    const settled = await settleStage(rental, stage, order, successful[0]);
    return { rental: settled, stage, status: order.order_status, stagePaid: settled.staged[stage]?.state === 'paid' };
}
const createStagedPayment = route(async (req, res) => {
    assertCashfreeConfigured();
    await assertStagedStorageReady(Rental);
    let rental = await ownerRental(req);
    const stage = req.body.stage;
    if (!['advance', 'balance'].includes(stage)) reject('Invalid payment stage', 400);
    if (rental.status === 'Cancelled' || rental.refundReviewRequired) reject('This booking is unavailable for payment');
    const state = await stateFor(rental);
    if (stage === 'balance' && !state.canPayBalance && rental.staged.balance?.state !== 'paid') reject('Approved KYC and a reviewed final bill are required');
    const quote = stage === 'advance' ? rental.pricingSnapshot : rental.staged.finalQuote;
    if (!quote || req.body.quoteHash !== quote.hash) reject('Review the current quote before payment');
    if (rental.staged[stage]?.state === 'paid') return res.json({ alreadyPaid: true, ...state });
    const path = `staged.${stage}`;
    if (!rental.staged[stage]?.providerOrderId) {
        const association = { providerOrderId: `ir_${rental._id}_${stage}`, requestKey: crypto.randomUUID(), mode: 'sandbox',
            quoteHash: quote.hash, amountPaise: stage === 'advance' ? rental.staged.advancePaise : quote.totalPaise - rental.staged.advancePaise, state: 'pending' };
        const reserved = await lockedUpdate(rental, { status: { $ne: 'Cancelled' }, refundReviewRequired: { $ne: true }, [`${path}.providerOrderId`]: { $exists: false },
            ...(stage === 'balance' ? { 'staged.finalQuote.hash': quote.hash, 'staged.advance.state': 'paid' } : { 'pricingSnapshot.hash': quote.hash }) },
        { [path]: association, paymentState: 'payment_pending' }, stage === 'balance');
        rental = reserved || await ownerRental(req);
        // A concurrent bill adjustment may have won. Never silently pay its amount.
        if (rental.staged[stage]?.quoteHash !== req.body.quoteHash) reject('The reviewed payment quote changed');
    }
    const a = rental.staged[stage];
    const respond = async order => {
        reconcileStageOrder(rental, stage, order);
        if (order.order_status === 'PAID') {
            const settled = await settleStagedProviderOrder(a.providerOrderId);
            return res.json({ alreadyPaid: settled.stagePaid, ...await stateFor(settled.rental) });
        }
        if (order.order_status !== 'ACTIVE' || typeof order.payment_session_id !== 'string' || !order.payment_session_id) reject('Provider checkout is unavailable for this stage');
        return res.json({ paymentSessionId: order.payment_session_id, orderId: a.providerOrderId, mode: 'sandbox', stage, amountPaise: a.amountPaise });
    };
    let existing;
    try { existing = (await axios.get(`${cashfreeConfig.baseUrl}/orders/${a.providerOrderId}`, options())).data; }
    catch (error) { if (error.response?.status !== 404) throw error; }
    if (existing) return respond(existing);
    const phone = String(rental.user?.phone || rental.shippingAddress.phone).replace(/\D/g, '').slice(-10);
    if (!/^[6-9]\d{9}$/.test(phone)) reject('A valid customer phone is required', 400);
    const frontend = new URL(process.env.FRONTEND_URL || 'http://localhost:3000');
    if (!['http:', 'https:'].includes(frontend.protocol) || frontend.username || frontend.password) reject('Invalid payment return URL configuration', 503);
    const payload = { order_id: a.providerOrderId, order_amount: a.amountPaise / 100, order_currency: 'INR',
        customer_details: { customer_id: String(rental.user?._id || rental.user), customer_name: rental.user.name || 'Customer', customer_email: rental.user.email, customer_phone: phone },
        order_meta: { return_url: `${frontend.origin}/checkout/staged?orderId=${rental._id}&paymentStage=${stage}` }, order_note: `IndianRenters ${stage} ${rental._id}` };
    try {
        const { data } = await axios.post(`${cashfreeConfig.baseUrl}/orders`, payload, { ...options(), headers: { ...cashfreeHeaders(), 'x-idempotency-key': a.requestKey } });
        return respond(data);
    } catch (error) {
        if (error.response?.status !== 409) throw error;
        return respond((await axios.get(`${cashfreeConfig.baseUrl}/orders/${a.providerOrderId}`, options())).data);
    }
});
const verifyStagedPayment = route(async (req, res) => {
    assertCashfreeConfigured();
    const rental = await ownerRental(req);
    if (!['advance', 'balance'].includes(req.body.stage)) reject('Invalid payment stage', 400);
    const id = rental.staged[req.body.stage]?.providerOrderId;
    if (!id) reject('No provider payment is associated with this stage');
    const settled = await settleStagedProviderOrder(id);
    res.json({ status: settled.status, stagePaid: settled.stagePaid, ...await stateFor(settled.rental) });
});
module.exports = { getStagedRental, finalizeStagedRental, adjustFinalQuote, createStagedPayment, verifyStagedPayment, settleStagedProviderOrder };
