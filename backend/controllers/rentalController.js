const asyncHandler = require('express-async-handler');
const Rental = require('../models/Rental');
const mongoose = require('mongoose');
const { buildRentalQuote, fingerprint } = require('../services/rentalQuote');
const { assertCheckoutStorageReady } = require('../utils/checkoutStorage');
const Coupon = require('../models/Coupon');
const { RENTAL_STATUS } = require('../config/constants');
const { createNotification } = require('./notificationController');
const { sendTemplatedEmail } = require('../utils/sendTemplatedEmail');
const stagedCheckout = require('../services/stagedCheckout');
const { canManageOrders } = require('../utils/orderAccess');

// Build a single-line address string from a shippingAddress object
const formatAddress = (a) => {
    if (!a) return '';
    return [a.address, a.city, a.postalCode, a.country].filter(Boolean).join(', ');
};
// Summarise order items into a product label (first item + "& N more")
const productLabel = (items = []) => {
    if (!items.length) return 'your rental';
    const first = items[0]?.name || 'Product';
    return items.length > 1 ? `${first} & ${items.length - 1} more` : first;
};
const inr = (n) => Number(n || 0).toLocaleString('en-IN');
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

// Email merge fields shared by every rental status email.
const rentalEmailBase = (rental) => ({
    CUSTOMER_NAME: rental.user?.name || 'Customer',
    ORDER_ID: rental._id.toString().slice(-6).toUpperCase(),
    PRODUCT_NAME: productLabel(rental.orderItems),
    DELIVERY_DATE: fmtDate(rental.rentalPeriod?.startDate),
    RENTAL_DURATION: rental.rentalPeriod?.durationMonths ? `${rental.rentalPeriod.durationMonths} month(s)` : '1 month',
    MONTHLY_RENT: inr(rental.itemsPrice),
    DELIVERY_ADDRESS: formatAddress(rental.shippingAddress),
});

// @desc    Create new rental order
// @route   POST /api/rentals
// @access  Private
const quoteRental = asyncHandler(async (req, res) => {
    try { res.json(await buildRentalQuote(req.body)); }
    catch (error) { res.status(error.statusCode || 500); throw error; }
});

const addRentalItems = asyncHandler(async (req, res) => {
    try { if (req.stagedCheckout === true) await require('../utils/checkoutStorage').assertStagedStorageReady(Rental); else await assertCheckoutStorageReady(Rental); }
    catch (error) { res.status(error.statusCode || 503); throw new Error('Checkout storage is unavailable'); }
    const staged = req.stagedCheckout === true;
    const { checkoutKey, quoteHash } = req.body;
    if (typeof checkoutKey !== 'string' || !/^[a-z0-9_-]{16,80}$/i.test(checkoutKey) || typeof quoteHash !== 'string') {
        res.status(400); throw new Error('Review your quote before creating the order');
    }
    if (!Array.isArray(req.body.orderItems) || !req.body.orderItems.length || req.body.orderItems.some(item => !item || typeof item !== 'object')) {
        res.status(400); throw new Error('Choose valid products for your order');
    }
    const selections = { orderItems: req.body.orderItems.map(item => ({ product: item.product, qty: item.qty,
        tenureMonths: item.tenureMonths ?? req.body.rentalPeriod?.durationMonths, options: item.options, addons: item.addons })),
        shippingAddress: req.body.shippingAddress, couponCode: req.body.couponCode || null };
    const selectionHash = fingerprint(selections);
    const replay = async () => {
        const existing = await Rental.findOne({ user: req.user._id, checkoutKey });
        if (existing) {
            if (existing.selectionHash !== selectionHash || existing.pricingSnapshot?.hash !== quoteHash || (existing.checkoutFlow === 'staged') !== staged) {
                res.status(409); throw new Error('Checkout key is already associated with another quote');
            }
            if (existing.status === 'Cancelled') { res.status(409); throw new Error('This checkout has been cancelled'); }
            res.status(200).json(existing); return true;
        }
        return false;
    };
    if (await replay()) return;
    const Settings = require('../models/Settings');
    const settings = await Settings.findOne();
    if (!staged && settings?.requireKYC !== false) {
        const User = require('../models/User');
        const user = await User.findById(req.user._id);
        if (user?.kyc?.status !== 'approved') {
            res.status(403); throw new Error('KYC verification is required before placing a rental order.');
        }
    }
    let quote;
    try { quote = await buildRentalQuote(req.body); }
    catch (error) {
        if (await replay()) return;
        res.status(error.statusCode || 500); throw error;
    }
    if (quote.hash !== quoteHash) {
        if (await replay()) return;
        return res.status(409).json({ message: 'Pricing changed. Review the updated quote.', quote });
    }
    if (staged && Math.round(quote.totalPaise / 10) < 100) { res.status(400); throw new Error('Booking advance must be at least one rupee'); }
    const startDate = new Date();
    const durationMonths = Math.max(...quote.lines.map(line => line.tenureMonths));
    const endDate = new Date(startDate); endDate.setMonth(endDate.getMonth() + durationMonths);
    const rental = new Rental({
        user: req.user._id, checkoutKey, selectionHash, pricingSnapshot: quote,
        ...(staged ? { checkoutFlow: 'staged', staged: { advancePaise: Math.round(quote.totalPaise / 10), paidPaise: 0 } } : {}),
        orderItems: quote.lines.map(line => ({ product: line.product, qty: line.qty, name: line.name, image: line.image,
            price: line.unitRentPaise / 100, securityDeposit: line.unitDepositPaise / 100, tenureMonths: line.tenureMonths })),
        shippingAddress: quote.shippingAddress, paymentMethod: 'Cashfree',
        rentalPeriod: { startDate, endDate, durationMonths },
        itemsPrice: quote.rentPaise / 100, taxPrice: quote.taxPaise / 100, shippingPrice: quote.deliveryPaise / 100,
        depositPrice: quote.depositPaise / 100, couponCode: quote.couponCode,
        couponDiscount: quote.discountPaise / 100, totalPrice: quote.totalPaise / 100,
    });
    try {
        if (quote.couponCode) {
            // Reserve coupon usage and create the order in one transaction.
            // A replica-set test DB is required; never fall back to non-atomic writes.
            await mongoose.connection.transaction(async session => {
                const coupon = await Coupon.findOneAndUpdate({ code: quote.couponCode, isActive: true,
                    ...quote.couponPolicy, expiryDate: new Date(quote.couponPolicy.expiryDate), $and: [{ expiryDate: { $gt: new Date() } }],
                    $or: [{ usageLimit: null }, { $expr: { $lt: ['$usageCount', '$usageLimit'] } }] },
                    { $inc: { usageCount: 1 } }, { new: true, session });
                if (!coupon) { res.status(409); throw new Error('Coupon is no longer available'); }
                await rental.save({ session });
            });
        } else await rental.save();
    } catch (error) {
        // A concurrent matching request may have consumed the last coupon use
        // before this transaction retried. Replay on every failure, not just
        // duplicate-key errors; ownership/selection/quote checks still apply.
        if (await replay()) return;
        throw error;
    }
    // Order confirmation and payment email belong to verified settlement.
    res.status(201).json(rental);
});

// @desc    Get rental by ID
// @route   GET /api/rentals/:id
// @access  Private
const addStagedRental = (req, res, next) => {
    if (req.user.role !== 'customer') return res.status(403).json({ message: 'A customer account is required' });
    req.stagedCheckout = true; return addRentalItems(req, res, next);
};

const getRentalById = asyncHandler(async (req, res) => {
    const rental = await Rental.findById(req.params.id).populate(
        'user',
        'name email'
    );

    if (rental) {
        const ownerId = rental.user?._id || rental.user;
        if (String(ownerId) === String(req.user._id) || canManageOrders(req.user)) {
            res.json(rental);
        } else {
            res.status(403);
            throw new Error('Not authorized to view this rental');
        }
    } else {
        res.status(404);
        throw new Error('Rental not found');
    }
});

// @desc    Get logged in user rentals
// @route   GET /api/rentals/myrentals
// @access  Private
const getMyRentals = asyncHandler(async (req, res) => {
    const rentals = await Rental.find({ user: req.user._id });
    res.json(rentals);
});

// @desc    Get all rentals
// @route   GET /api/rentals
// @access  Private/Admin
const getRentals = asyncHandler(async (req, res) => {
    const rentals = await Rental.find({}).populate('user', 'id name');
    res.json(rentals);
});

// @desc    Update rental status (Admin)
// @route   PUT /api/rentals/:id/status
// @access  Private/Admin
const updateRentalStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const rental = await Rental.findById(req.params.id).populate('user', 'name email');

    if (rental) {
        if ([RENTAL_STATUS.APPROVED, RENTAL_STATUS.SHIPPED, RENTAL_STATUS.DELIVERED, RENTAL_STATUS.ACTIVE].includes(status) &&
            (!rental.isPaid || rental.refundReviewRequired || rental.status === RENTAL_STATUS.CANCELLED)) {
            res.status(409); throw new Error('Verified payment and an active order are required before fulfilment');
        }
        const fulfilling = [RENTAL_STATUS.APPROVED, RENTAL_STATUS.SHIPPED, RENTAL_STATUS.DELIVERED, RENTAL_STATUS.ACTIVE].includes(status);
        if (fulfilling) { try { await stagedCheckout.assertFulfillment(rental); } catch (error) { res.status(error.statusCode || 503); throw error; } }
        const updates = { status };
        if (status === RENTAL_STATUS.DELIVERED || status === RENTAL_STATUS.ACTIVE) {
            updates.isDelivered = true; updates.deliveredAt = Date.now();
        }
        if (status === RENTAL_STATUS.RETURNED) { updates.isReturned = true; updates.returnedAt = Date.now(); }
        if (status === RENTAL_STATUS.CANCELLED) {
            updates.paymentState = stagedCheckout.moneyRecorded(rental) ? 'manual_review' : 'cancelled';
            updates.refundReviewRequired = stagedCheckout.moneyRecorded(rental);
        }
        const filter = { status: rental.status, isPaid: rental.isPaid,
            ...(rental.checkoutFlow === 'staged' ? { 'staged.paidPaise': rental.staged.paidPaise,
                ...(fulfilling ? { refundReviewRequired: { $ne: true }, 'staged.balance.state': 'paid' } : {}) } : {}) };
        let updatedRental;
        if (rental.checkoutFlow === 'staged') {
            try { updatedRental = await stagedCheckout.lockedUpdate(rental, filter, updates, fulfilling); }
            catch (error) { res.status(error.statusCode || 503); throw error; }
        } else updatedRental = await Rental.findOneAndUpdate({ _id: rental._id, ...filter }, { $set: updates }, { new: true, runValidators: true }).populate('user', 'name email');
        if (!updatedRental) { res.status(409); throw new Error('Order changed while updating its status. Please retry.'); }

        // Send the email matching the new status (non-blocking).
        const depositTotal = (rental.orderItems || []).reduce((s, i) => s + (i.securityDeposit || 0) * (i.qty || 1), 0);
        const base = rentalEmailBase(rental);
        const email = rental.user?.email;
        if (status === RENTAL_STATUS.APPROVED) {
            sendTemplatedEmail('Order Approved', email, base);
        } else if (status === RENTAL_STATUS.SHIPPED) {
            sendTemplatedEmail('Order Shipped', email, {
                ...base,
                TRACKING_ID: rental._id.toString().slice(-8).toUpperCase(),
                CARRIER_NAME: 'IndianRenters Logistics',
                TRACKING_URL: `https://indianrenters.com/track/${rental._id}`,
            });
        } else if (status === RENTAL_STATUS.DELIVERED || status === RENTAL_STATUS.ACTIVE) {
            sendTemplatedEmail('Order Delivered — Rental Active', email, {
                ...base,
                START_DATE: fmtDate(rental.rentalPeriod?.startDate),
                END_DATE: fmtDate(rental.rentalPeriod?.endDate),
                DUE_DAY: rental.rentalPeriod?.startDate ? new Date(rental.rentalPeriod.startDate).getDate() : '1st',
                NEXT_PAYMENT_DATE: fmtDate(rental.rentalPeriod?.endDate),
                NEXT_PAYMENT_AMOUNT: inr(rental.itemsPrice),
            });
        } else if (status === RENTAL_STATUS.RETURNED && rental.checkoutFlow !== 'staged') {
            sendTemplatedEmail('Return Confirmed — Refund Initiated', email, {
                ...base,
                REFUND_AMOUNT: inr(depositTotal),
                PAYMENT_METHOD: rental.paymentMethod || 'original payment method',
            });
        } else if (status === RENTAL_STATUS.CANCELLED && rental.checkoutFlow !== 'staged') {
            sendTemplatedEmail('Order Cancelled', email, {
                ...base,
                CANCELLATION_REASON: req.body.reason || 'Cancelled as per request.',
                REFUND_AMOUNT: rental.isPaid ? inr(rental.totalPrice) : '0',
                PAYMENT_METHOD: rental.paymentMethod || 'original payment method',
            });
        }

        res.json(updatedRental);
    } else {
        res.status(404);
        throw new Error('Rental not found');
    }
});

// @desc    Cancel your own rental order
// @route   PUT /api/rentals/:id/cancel
// @access  Private
const cancelMyRental = asyncHandler(async (req, res) => {
    const rental = await Rental.findById(req.params.id).populate('user', 'name email');

    if (!rental) {
        res.status(404);
        throw new Error('Rental not found');
    }

    // Owner only — the id comes from the client, so never cancel someone else's order.
    const ownerId = rental.user?._id || rental.user;
    if (ownerId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorised to cancel this order');
    }

    if (rental.status === RENTAL_STATUS.CANCELLED) {
        res.status(400);
        throw new Error('This order is already cancelled');
    }

    // Once the item is out with the customer, cancellation becomes a return, not a cancel.
    if ([RENTAL_STATUS.DELIVERED, RENTAL_STATUS.ACTIVE, RENTAL_STATUS.RETURNED].includes(rental.status)) {
        res.status(400);
        throw new Error('This order can no longer be cancelled. Please contact support.');
    }

    const filter = { user: req.user._id, status: rental.status, isPaid: rental.isPaid,
        ...(rental.checkoutFlow === 'staged' ? { 'staged.paidPaise': rental.staged.paidPaise } : {}) };
    const updates = { status: RENTAL_STATUS.CANCELLED, paymentState: stagedCheckout.moneyRecorded(rental) ? 'manual_review' : 'cancelled',
        refundReviewRequired: stagedCheckout.moneyRecorded(rental) };
    let updatedRental;
    if (rental.checkoutFlow === 'staged') {
        try { updatedRental = await stagedCheckout.lockedUpdate(rental, filter, updates); }
        catch (error) { res.status(error.statusCode || 503); throw error; }
    } else updatedRental = await Rental.findOneAndUpdate({ _id: rental._id, ...filter }, { $set: updates }, { new: true, runValidators: true }).populate('user', 'name email');
    if (!updatedRental) { res.status(409); throw new Error('Order changed while cancelling. Please retry.'); }

    if (rental.checkoutFlow !== 'staged') sendTemplatedEmail('Order Cancelled', rental.user?.email, {
        ...rentalEmailBase(rental),
        CANCELLATION_REASON: req.body.reason || 'Cancelled by the customer.',
        REFUND_AMOUNT: rental.isPaid ? inr(rental.totalPrice) : '0',
        PAYMENT_METHOD: rental.paymentMethod || 'original payment method',
    });

    createNotification({
        title: 'Order cancelled by customer',
        message: `${rental.user?.name || 'A customer'} cancelled order #${rental._id.toString().slice(-6).toUpperCase()}.`,
        type: 'order',
        relatedId: rental._id,
    });

    res.json(updatedRental);
});

module.exports = {
    addRentalItems,
    addStagedRental,
    quoteRental,
    getRentalById,
    getMyRentals,
    getRentals,
    updateRentalStatus,
    cancelMyRental,
};
