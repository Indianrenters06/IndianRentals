const crypto = require('crypto');
const axios = require('axios');
const asyncHandler = require('express-async-handler');
const Rental = require('../models/Rental');
const { cashfreeConfig, cashfreeHeaders, assertCashfreeConfigured } = require('../config/cashfree');
const { markRentalPaid } = require('./rentalController');

// Cashfree order_id must be alphanumeric + _ - and <= 50 chars.
// A Mongo ObjectId hex string (24 chars) satisfies this, so we use the
// rental's own _id as the Cashfree order_id — this makes webhook and
// verification lookups a direct 1:1 mapping with no extra bookkeeping.
const cfOrderIdFor = (rental) => rental._id.toString();

// Strip a phone number down to the last 10 digits Cashfree expects.
const normalisePhone = (raw) => {
    const digits = String(raw || '').replace(/\D/g, '');
    return digits.slice(-10);
};

// Fetch the successful payment for an order to obtain a real transaction id.
// Best-effort: returns null if the call fails or none is found.
const fetchSuccessfulPaymentId = async (cfOrderId) => {
    try {
        const { data } = await axios.get(
            `${cashfreeConfig.baseUrl}/orders/${cfOrderId}/payments`,
            { headers: cashfreeHeaders() }
        );
        const paid = Array.isArray(data)
            ? data.find((p) => p.payment_status === 'SUCCESS')
            : null;
        return paid ? String(paid.cf_payment_id) : null;
    } catch (err) {
        console.error('[Cashfree] Could not fetch payments for', cfOrderId, err.response?.data || err.message);
        return null;
    }
};

// Shared settlement: given a Cashfree order id, confirm it's PAID with
// Cashfree and mark the matching rental paid. Idempotent (markRentalPaid
// short-circuits already-paid rentals). Returns { rental, status }.
const settleRentalFromCashfree = async (cfOrderId) => {
    const { data: order } = await axios.get(
        `${cashfreeConfig.baseUrl}/orders/${cfOrderId}`,
        { headers: cashfreeHeaders() }
    );

    const rental = await Rental.findById(cfOrderId).populate('user', 'name email');
    if (!rental) {
        return { rental: null, status: order.order_status };
    }

    if (order.order_status === 'PAID') {
        const paymentId = await fetchSuccessfulPaymentId(cfOrderId);
        await markRentalPaid(rental, {
            id: paymentId || String(order.cf_order_id || cfOrderId),
            status: 'PAID',
            update_time: new Date().toISOString(),
            email_address: rental.user?.email,
        });
    }

    return { rental, status: order.order_status };
};

// @desc    Create a Cashfree order for an existing (unpaid) rental
// @route   POST /api/payments/cashfree/order
// @access  Private
const createCashfreeOrder = asyncHandler(async (req, res) => {
    assertCashfreeConfigured();

    const { rentalId } = req.body;
    if (!rentalId) {
        res.status(400);
        throw new Error('rentalId is required');
    }

    const rental = await Rental.findById(rentalId).populate('user', 'name email phone');
    if (!rental) {
        res.status(404);
        throw new Error('Rental not found');
    }

    // Only the owner may pay for their own rental.
    if (!rental.user._id.equals(req.user._id)) {
        res.status(403);
        throw new Error('Not authorized to pay for this rental');
    }

    if (rental.isPaid) {
        return res.json({ alreadyPaid: true });
    }

    const cfOrderId = cfOrderIdFor(rental);

    // Reuse an existing Cashfree order if one was already created for this
    // rental (e.g. the customer retried after abandoning the first attempt).
    try {
        const { data: existing } = await axios.get(
            `${cashfreeConfig.baseUrl}/orders/${cfOrderId}`,
            { headers: cashfreeHeaders() }
        );
        if (existing.order_status === 'PAID') {
            const { rental: settled } = await settleRentalFromCashfree(cfOrderId);
            return res.json({ alreadyPaid: true, rental: settled });
        }
        if (existing.order_status === 'ACTIVE' && existing.payment_session_id) {
            return res.json({
                paymentSessionId: existing.payment_session_id,
                orderId: cfOrderId,
                mode: cashfreeConfig.mode,
            });
        }
    } catch (err) {
        // 404 => no order yet, fall through and create one. Anything else is real.
        if (err.response?.status && err.response.status !== 404) {
            console.error('[Cashfree] Lookup failed:', err.response?.data || err.message);
        }
    }

    const phone = normalisePhone(rental.user?.phone || rental.shippingAddress?.phone) || '9999999999';

    const payload = {
        order_id: cfOrderId,
        order_amount: Number(Number(rental.totalPrice).toFixed(2)),
        order_currency: 'INR',
        customer_details: {
            customer_id: rental.user._id.toString(),
            customer_name: rental.user?.name || 'Customer',
            customer_email: rental.user?.email || 'noreply@indianrenters.com',
            customer_phone: phone,
        },
        order_meta: {
            return_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/order-confirmation?orderId=${cfOrderId}`,
        },
        order_note: `IndianRenters rental ${cfOrderId}`,
    };

    try {
        const { data } = await axios.post(
            `${cashfreeConfig.baseUrl}/orders`,
            payload,
            { headers: cashfreeHeaders() }
        );
        return res.json({
            paymentSessionId: data.payment_session_id,
            orderId: cfOrderId,
            cfOrderId: data.cf_order_id,
            mode: cashfreeConfig.mode,
        });
    } catch (err) {
        const cfError = err.response?.data;
        console.error('[Cashfree] Create order failed:', cfError || err.message);
        res.status(err.response?.status || 502);
        throw new Error(cfError?.message || 'Failed to create Cashfree order');
    }
});

// @desc    Verify a Cashfree payment (client-side confirmation after checkout)
// @route   POST /api/payments/cashfree/verify
// @access  Private
const verifyCashfreePayment = asyncHandler(async (req, res) => {
    assertCashfreeConfigured();

    const { rentalId } = req.body;
    if (!rentalId) {
        res.status(400);
        throw new Error('rentalId is required');
    }

    const rental = await Rental.findById(rentalId);
    if (!rental) {
        res.status(404);
        throw new Error('Rental not found');
    }
    if (!rental.user.equals(req.user._id)) {
        res.status(403);
        throw new Error('Not authorized to verify this payment');
    }

    try {
        const { status, rental: settled } = await settleRentalFromCashfree(cfOrderIdFor(rental));
        return res.json({
            status,               // PAID | ACTIVE | EXPIRED | ...
            paid: status === 'PAID',
            rental: settled,
        });
    } catch (err) {
        console.error('[Cashfree] Verify failed:', err.response?.data || err.message);
        res.status(err.response?.status || 502);
        throw new Error('Failed to verify payment with Cashfree');
    }
});

// @desc    Cashfree webhook — authoritative source of payment truth
// @route   POST /api/payments/cashfree/webhook
// @access  Public (signature-verified)
const cashfreeWebhook = asyncHandler(async (req, res) => {
    const signature = req.headers['x-webhook-signature'];
    const timestamp = req.headers['x-webhook-timestamp'];
    // req.rawBody is the exact bytes received — required for a valid HMAC.
    const rawBody = req.rawBody ? req.rawBody.toString('utf8') : JSON.stringify(req.body);

    if (!signature || !timestamp) {
        res.status(400);
        throw new Error('Missing Cashfree webhook signature headers');
    }

    // Cashfree signature = base64( HMAC-SHA256( timestamp + rawBody, secretKey ) )
    const expected = crypto
        .createHmac('sha256', cashfreeConfig.secretKey || '')
        .update(timestamp + rawBody)
        .digest('base64');

    const valid =
        expected.length === signature.length &&
        crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));

    if (!valid) {
        console.warn('[Cashfree] Webhook signature mismatch');
        res.status(401);
        throw new Error('Invalid webhook signature');
    }

    const event = req.body;
    const cfOrderId = event?.data?.order?.order_id;
    const eventType = event?.type;

    // Acknowledge quickly; only act on successful-payment events.
    if (cfOrderId && eventType === 'PAYMENT_SUCCESS_WEBHOOK') {
        try {
            await settleRentalFromCashfree(cfOrderId);
        } catch (err) {
            console.error('[Cashfree] Webhook settlement failed:', err.response?.data || err.message);
        }
    }

    // Always 200 so Cashfree stops retrying a signature-valid event.
    res.status(200).json({ received: true });
});

module.exports = { createCashfreeOrder, verifyCashfreePayment, cashfreeWebhook };
