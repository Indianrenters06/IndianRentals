const mongoose = require('mongoose');
const Rental = require('../models/Rental');
const User = require('../models/User');
const { fingerprint } = require('./rentalQuote');
const { registerCapture } = require('./captureLedger');
const sendEmail = require('../utils/sendEmail');

function reject(message, statusCode = 409) { const error = new Error(message); error.statusCode = statusCode; throw error; }
function assertStaged(rental) {
    const q = rental?.pricingSnapshot;
    if (rental?.checkoutFlow !== 'staged' || q?.version !== 1 || q.currency !== 'INR' ||
        !Number.isSafeInteger(q.totalPaise) || !Number.isSafeInteger(rental.staged?.advancePaise) ||
        rental.staged.advancePaise !== Math.round(q.totalPaise / 10) || rental.staged.advancePaise < 100) reject('A reviewed staged checkout is required');
    return q;
}
function moneyRecorded(rental) { return rental.isPaid === true || (rental.staged?.paidPaise || 0) > 0; }
function finalQuoteFor(rental, deliveryPaise, reason = '') {
    const initial = assertStaged(rental);
    const delivery = deliveryPaise ?? initial.deliveryPaise;
    if (!Number.isSafeInteger(delivery) || delivery < 0 || delivery > 10000000) reject('Invalid delivery amount in paise', 400);
    const totalPaise = initial.totalPaise - initial.deliveryPaise + delivery;
    if (totalPaise - rental.staged.advancePaise < 100) reject('Final bill must leave at least one rupee payable; contact support for credit/refund review', 409);
    const quote = { ...initial, deliveryPaise: delivery, totalPaise,
        initialQuoteHash: initial.hash, revision: (rental.staged.finalQuote?.revision || 0) + 1,
        adjustmentReason: reason, reviewedAt: new Date().toISOString() };
    delete quote.hash;
    return { ...quote, hash: fingerprint(quote) };
}
async function currentKyc(rental) {
    const user = await User.findById(rental.user?._id || rental.user).select('kyc.status kyc.rejectionReason isBlocked isActive role');
    return user?.role === 'customer' && user.isBlocked !== true && user.isActive !== false ? user.kyc?.status || 'not_submitted' : 'unavailable';
}
async function stateFor(rental) {
    assertStaged(rental);
    const kycStatus = await currentKyc(rental);
    const paidPaise = rental.staged?.paidPaise || 0;
    const finalQuote = rental.staged?.finalQuote || null;
    return { rental, kycStatus, advancePaise: rental.staged.advancePaise, paidPaise,
        balancePaise: Math.max(0, (finalQuote?.totalPaise ?? rental.pricingSnapshot.totalPaise) - paidPaise), finalQuote,
        canPayBalance: rental.status !== 'Cancelled' && !rental.refundReviewRequired && kycStatus === 'approved' &&
            rental.staged.advance?.state === 'paid' && Boolean(finalQuote) && rental.staged.balance?.state !== 'paid' };
}
// Taking a real write lock on the customer serializes this operation with KYC
// transactions. There is no nontransactional fallback on unsupported databases.
async function lockedUpdate(rental, filter, updates, approved = false) {
    return mongoose.connection.transaction(async session => {
        const cancellation = updates.status === 'Cancelled';
        const user = await User.findOneAndUpdate({ _id: rental.user?._id || rental.user,
            ...(!cancellation ? { role: 'customer', isBlocked: { $ne: true }, isActive: { $ne: false } } : {}),
            ...(approved ? { 'kyc.status': 'approved' } : {}) }, { $inc: { checkoutGuardRevision: 1 } }, { new: true, session });
        if (!user) reject(approved ? 'Approved KYC is required' : 'Customer account is unavailable');
        return Rental.findOneAndUpdate({ _id: rental._id, checkoutFlow: 'staged', ...filter }, { $set: updates }, { new: true, runValidators: true, session });
    });
}
async function finalize(rental, deliveryPaise, reason, reviewerId) {
    assertStaged(rental);
    if (rental.status === 'Cancelled' || rental.refundReviewRequired || rental.staged.advance?.state !== 'paid') reject('A confirmed advance and an active booking are required');
    if (rental.staged.balance?.providerOrderId) reject('The final bill is frozen after balance payment starts');
    // Customer retries simply return the stored quote; administrative adjustments
    // require an explicit amount/reason and create a new review hash.
    if (deliveryPaise === undefined && rental.staged.finalQuote) {
        if (await currentKyc(rental) !== 'approved') reject('Approved KYC is required');
        return rental;
    }
    if (deliveryPaise !== undefined && (typeof reason !== 'string' || !reason.trim() || reason.length > 1000)) reject('A delivery adjustment reason is required', 400);
    const quote = finalQuoteFor(rental, deliveryPaise, reason?.trim());
    // The actor is supplied by authenticated handlers, never by the browser.
    if (reviewerId) { quote.reviewedBy = String(reviewerId); const body = { ...quote }; delete body.hash; quote.hash = fingerprint(body); }
    const updated = await lockedUpdate(rental, { status: { $ne: 'Cancelled' }, refundReviewRequired: { $ne: true },
        'staged.advance.state': 'paid', 'staged.balance.providerOrderId': { $exists: false },
        'staged.finalQuote.hash': rental.staged.finalQuote?.hash ?? { $exists: false } },
    { 'staged.finalQuote': quote, totalPrice: quote.totalPaise / 100, shippingPrice: quote.deliveryPaise / 100 }, true);
    if (!updated) reject('The booking changed. Review the current bill.');
    return updated;
}
function stageAssociation(rental, stage) {
    assertStaged(rental);
    if (!['advance', 'balance'].includes(stage)) reject('Invalid payment stage', 400);
    const association = rental.staged[stage];
    if (!association?.providerOrderId || association.mode !== 'sandbox' || !Number.isSafeInteger(association.amountPaise) || association.amountPaise < 100) reject('Payment stage was not reserved');
    const quote = stage === 'advance' ? rental.pricingSnapshot : rental.staged.finalQuote;
    const expected = stage === 'advance' ? rental.staged.advancePaise : quote?.totalPaise - rental.staged.advancePaise;
    if (!quote || association.quoteHash !== quote.hash || association.amountPaise !== expected) reject('Payment stage quote mismatch');
    return association;
}
function amountMatches(amount, paise) { return typeof amount === 'number' && Number.isFinite(amount) && Math.abs(amount * 100 - paise) < 0.00001; }
function reconcileStageOrder(rental, stage, order) {
    const a = stageAssociation(rental, stage);
    if (order?.order_id !== a.providerOrderId || order.order_currency !== 'INR' ||
        order.customer_details?.customer_id !== String(rental.user?._id || rental.user) || !amountMatches(order.order_amount, a.amountPaise)) reject('Staged payment order reconciliation failed');
    return a;
}
async function dispatchStageReceipt(rentalId, stage) {
    const path = `staged.${stage}`;
    const claimed = await Rental.findOneAndUpdate({ _id: rentalId, [`${path}.state`]: 'paid', [`${path}.receiptState`]: 'pending' },
        { $set: { [`${path}.receiptState`]: 'dispatching', [`${path}.receiptClaimedAt`]: new Date() } }, { new: true }).populate('user', 'name email');
    if (!claimed) return;
    let sent = false;
    try {
        await sendEmail({ email: claimed.user?.email, subject: stage === 'advance' ? 'Booking advance received' : 'Booking balance received',
            message: `We received INR ${(claimed.staged[stage].amountPaise / 100).toFixed(2)} for your booking ${String(claimed._id).slice(-6).toUpperCase()}. ${claimed.refundReviewRequired ? 'Your booking needs manual review. Please contact our team.' : stage === 'advance' ? 'Identity verification and the remaining balance are required before delivery.' : 'Our team will confirm delivery after verification.'}` });
        sent = true;
    } catch { /* SMTP ambiguity remains durable and is never automatically retried. */ }
    await Rental.findOneAndUpdate({ _id: rentalId, [`${path}.receiptState`]: 'dispatching' }, { $set: { [`${path}.receiptState`]: sent ? 'sent' : 'delivery_unknown' } });
}
async function settleStage(rental, stage, order, payment) {
    const a = reconcileStageOrder(rental, stage, order);
    if (order.order_status !== 'PAID' || payment?.payment_status !== 'SUCCESS' || payment.is_captured !== true ||
        payment.order_id !== a.providerOrderId || !payment.cf_payment_id || payment.payment_currency !== 'INR' || !amountMatches(payment.payment_amount, a.amountPaise)) reject('Staged transaction reconciliation failed');
    const paymentId = String(payment.cf_payment_id);
    const path = `staged.${stage}`;
    const result = await mongoose.connection.transaction(async session => {
        // Capture records must survive KYC withdrawal or account blocking. Lock
        // even an unavailable account, then mark the payment for manual review.
        const user = await User.findOneAndUpdate({ _id: rental.user?._id || rental.user }, { $inc: { checkoutGuardRevision: 1 } }, { new: true, session });
        const current = await Rental.findById(rental._id).session(session);
        const existing = stageAssociation(current, stage);
        await registerCapture(current, stage, order.order_id, paymentId, existing.amountPaise, session);
        if (existing.state === 'paid') {
            if (existing.providerPaymentId !== paymentId) reject('Stage already paid by another transaction');
            return current;
        }
        const approved = user?.kyc?.status === 'approved' && user?.role === 'customer' && user.isBlocked !== true && user.isActive !== false;
        const manual = current.status === 'Cancelled' || current.refundReviewRequired || !user || user.isBlocked === true || user.isActive === false || (stage === 'balance' && !approved);
        const paidPaise = (current.staged.paidPaise || 0) + existing.amountPaise;
        const fullyPaid = stage === 'balance' && current.staged.advance?.state === 'paid' && paidPaise === current.staged.finalQuote.totalPaise;
        const updated = await Rental.findOneAndUpdate({ _id: current._id, [`${path}.state`]: { $ne: 'paid' },
            [`${path}.providerOrderId`]: order.order_id, [`${path}.quoteHash`]: existing.quoteHash },
        { $set: { [`${path}.state`]: 'paid', [`${path}.providerPaymentId`]: paymentId, [`${path}.paidAt`]: new Date(),
            [`${path}.receiptState`]: 'pending', 'staged.paidPaise': paidPaise, isPaid: fullyPaid,
            ...(fullyPaid ? { paidAt: new Date() } : {}), paymentState: manual ? 'manual_review' : fullyPaid ? 'confirmed' : 'created',
            refundReviewRequired: manual } }, { new: true, runValidators: true, session });
        if (!updated) reject('Payment persistence needs retry', 503);
        return updated;
    });
    await dispatchStageReceipt(rental._id, stage);
    return result;
}
async function assertFulfillment(rental) {
    if (rental.checkoutFlow !== 'staged') return;
    assertStaged(rental);
    if (!rental.isPaid || rental.staged.balance?.state !== 'paid' || rental.staged.advance?.state !== 'paid' ||
        rental.staged.paidPaise !== rental.staged.finalQuote?.totalPaise || await currentKyc(rental) !== 'approved') reject('Full staged payment and current approved KYC are required before fulfilment');
}
module.exports = { assertStaged, moneyRecorded, finalQuoteFor, currentKyc, stateFor, lockedUpdate, finalize,
    stageAssociation, reconcileStageOrder, settleStage, assertFulfillment, dispatchStageReceipt, reject };
