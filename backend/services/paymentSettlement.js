const { registerCapture } = require('./captureLedger');
const Rental = require('../models/Rental');
const { sendTemplatedEmail } = require('../utils/sendTemplatedEmail');

function reject(message, statusCode = 409) { const error = new Error(message); error.statusCode = statusCode; throw error; }
function snapshotFor(rental) {
    const quote = rental?.pricingSnapshot;
    if (quote?.version !== 1 || quote.currency !== 'INR' || !Number.isSafeInteger(quote.totalPaise) || quote.totalPaise < 100 ||
        Math.round(rental.totalPrice * 100) !== quote.totalPaise) reject('This order requires a new reviewed checkout');
    return quote;
}
function amountMatches(amount, paise) {
    return typeof amount === 'number' && Number.isFinite(amount) &&
        Math.abs(amount * 100 - paise) < 0.00001;
}
function reconcileOrder(rental, order) {
    const quote = snapshotFor(rental);
    const owner = String(rental.user?._id || rental.user);
    if (order?.order_id !== String(rental._id) || order.order_id !== rental.payment?.providerOrderId ||
        rental.payment.mode !== 'sandbox' || order.customer_details?.customer_id !== owner ||
        order.order_currency !== quote.currency || !amountMatches(order.order_amount, quote.totalPaise)) reject('Payment order reconciliation failed');
    return quote;
}
function reconcilePayment(rental, order, payment) {
    const quote = reconcileOrder(rental, order);
    if (order.order_status !== 'PAID' || payment?.payment_status !== 'SUCCESS' || payment.is_captured !== true ||
        payment.order_id !== order.order_id || !payment.cf_payment_id || payment.payment_currency !== quote.currency ||
        !amountMatches(payment.payment_amount, quote.totalPaise)) reject('Payment amount or association reconciliation failed');
    return quote;
}

// Receipt intent is persisted in the SAME atomic update as paid state. Claim
// once before SMTP. Ambiguous delivery is never automatically resent: SMTP
// has no idempotency key and cannot promise exactly-once delivery after a crash.
async function dispatchReceipt(rentalId) {
    const claimed = await Rental.findOneAndUpdate({ _id: rentalId, isPaid: true, 'paymentReceipt.state': 'pending', refundReviewRequired: false },
        { $set: { 'paymentReceipt.state': 'dispatching', 'paymentReceipt.claimedAt': new Date() } }, { new: true }).populate('user', 'name email');
    if (!claimed) return;
    const inr = value => Number(value || 0).toLocaleString('en-IN');
    let sent = false;
    try {
        sent = await sendTemplatedEmail('Payment Successful', claimed.user?.email, {
            CUSTOMER_NAME: claimed.user?.name || 'Customer', AMOUNT_PAID: inr(claimed.totalPrice),
            TRANSACTION_ID: claimed.payment.providerPaymentId, PAYMENT_DATE: new Date(claimed.paidAt).toLocaleDateString('en-IN'),
            BOOKING_ID: String(claimed._id).slice(-6).toUpperCase(),
            PRODUCT_NAME: (claimed.orderItems || []).map(item => item.name).join(', '),
            MONTHLY_RENT: inr(claimed.itemsPrice), SECURITY_DEPOSIT: inr(claimed.depositPrice), PAYMENT_METHOD: 'Cashfree',
        });
    } catch { /* Preserve ambiguity for manual recovery, never duplicate SMTP. */ }
    await Rental.findOneAndUpdate({ _id: rentalId, 'paymentReceipt.state': 'dispatching' },
        { $set: { 'paymentReceipt.state': sent ? 'sent' : 'delivery_unknown' } }, { new: true });
}

async function persistVerifiedPayment(rental, order, payment) {
    const quote = reconcilePayment(rental, order, payment);
    await registerCapture(rental, 'legacy', order.order_id, String(payment.cf_payment_id), quote.totalPaise);
    if (rental.isPaid && rental.payment?.providerPaymentId !== String(payment.cf_payment_id)) reject('Paid order is associated with another transaction');
    const filter = { _id: rental._id, isPaid: false, 'pricingSnapshot.hash': quote.hash,
        'pricingSnapshot.totalPaise': quote.totalPaise, 'payment.providerOrderId': order.order_id, 'payment.mode': 'sandbox' };
    const paid = { isPaid: true, paidAt: new Date(), 'payment.providerPaymentId': String(payment.cf_payment_id),
        paymentResult: { id: String(payment.cf_payment_id), status: 'PAID', update_time: new Date().toISOString() } };
    let settled = await Rental.findOneAndUpdate({ ...filter, status: { $ne: 'Cancelled' } },
        { $set: { ...paid, paymentState: 'confirmed', refundReviewRequired: false, 'paymentReceipt.state': 'pending' } }, { new: true });
    if (!settled) settled = await Rental.findOneAndUpdate({ ...filter, status: 'Cancelled' },
        { $set: { ...paid, paymentState: 'manual_review', refundReviewRequired: true } }, { new: true });
    if (!settled) settled = await Rental.findById(rental._id);
    if (!settled?.isPaid || settled.payment?.providerPaymentId !== String(payment.cf_payment_id)) reject('Settlement could not be persisted', 503);
    await dispatchReceipt(rental._id);
    return settled;
}

module.exports = { snapshotFor, reconcileOrder, reconcilePayment, persistVerifiedPayment, dispatchReceipt };
