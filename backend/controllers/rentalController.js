const asyncHandler = require('express-async-handler');
const Rental = require('../models/Rental');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const { RENTAL_STATUS } = require('../config/constants');
const { createNotification } = require('./notificationController');
const { sendTemplatedEmail } = require('../utils/sendTemplatedEmail');

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

// @desc    Create new rental order
// @route   POST /api/rentals
// @access  Private
const addRentalItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        couponCode,
        couponDiscount,
        totalPrice,
        rentalPeriod,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    } else {
        const Settings = require('../models/Settings');
        const settings = await Settings.findOne();
        
        if (settings && settings.requireKYC) {
            const User = require('../models/User');
            const user = await User.findById(req.user._id);
            if (!user.kyc || user.kyc.status !== 'approved') {
                res.status(403);
                throw new Error('KYC verification is required before placing a rental order.');
            }
        }

        const rental = new Rental({
            orderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            couponCode,
            couponDiscount,
            totalPrice,
            rentalPeriod,
        });

        const createdRental = await rental.save();

        if (couponCode) {
            const coupon = await Coupon.findOne({ code: couponCode });
            if (coupon) {
                coupon.usageCount = (coupon.usageCount || 0) + 1;
                await coupon.save();
            }
        }

        await createNotification({
            title: 'New Rental Order',
            message: `Order ${createdRental._id.toString().slice(-6)} placed for ₹${totalPrice}.`,
            type: 'order',
            relatedId: createdRental._id
        });

        // Send "Order Confirmed" email to the customer (non-blocking).
        const depositTotal = (orderItems || []).reduce((s, i) => s + (i.securityDeposit || 0) * (i.qty || 1), 0);
        sendTemplatedEmail('Order Confirmed', req.user?.email, {
            ORDER_ID: createdRental._id.toString().slice(-6).toUpperCase(),
            CUSTOMER_NAME: req.user?.name || 'Customer',
            PRODUCT_NAME: productLabel(orderItems),
            RENTAL_DURATION: rentalPeriod?.durationMonths ? `${rentalPeriod.durationMonths} month(s)` : '1 month',
            MONTHLY_RENT: inr(itemsPrice),
            SECURITY_DEPOSIT: inr(depositTotal),
            FIRST_MONTH: inr(itemsPrice),
            DELIVERY_CHARGE: shippingPrice ? `₹${inr(shippingPrice)}` : 'FREE',
            TOTAL_AMOUNT: inr(totalPrice),
            DELIVERY_DATE: rentalPeriod?.startDate ? new Date(rentalPeriod.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '2–4 days',
            TIME_SLOT: '10:00 AM – 7:00 PM',
            CUSTOMER_ADDRESS: formatAddress(shippingAddress),
        });

        res.status(201).json(createdRental);
    }
});

// @desc    Get rental by ID
// @route   GET /api/rentals/:id
// @access  Private
const getRentalById = asyncHandler(async (req, res) => {
    const rental = await Rental.findById(req.params.id).populate(
        'user',
        'name email'
    );

    if (rental) {
        // Allow admin or the user who made the order to view it
        if (req.user.isAdmin || rental.user._id.equals(req.user._id)) {
            res.json(rental);
        } else {
            res.status(401);
            throw new Error('Not authorized to view this rental');
        }
    } else {
        res.status(404);
        throw new Error('Rental not found');
    }
});

// @desc    Update rental to paid
// @route   PUT /api/rentals/:id/pay
// @access  Private
const updateRentalToPaid = asyncHandler(async (req, res) => {
    const rental = await Rental.findById(req.params.id).populate('user', 'name email');

    if (rental) {
        rental.isPaid = true;
        rental.paidAt = Date.now();
        rental.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address,
        };

        const updatedRental = await rental.save();

        // Send "Payment Successful" email (non-blocking).
        const depositTotal = (rental.orderItems || []).reduce((s, i) => s + (i.securityDeposit || 0) * (i.qty || 1), 0);
        const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
        sendTemplatedEmail('Payment Successful', rental.user?.email, {
            CUSTOMER_NAME: rental.user?.name || 'Customer',
            AMOUNT_PAID: inr(rental.totalPrice),
            TRANSACTION_ID: req.body.id || rental.paymentResult?.id || '—',
            PAYMENT_DATE: fmtDate(rental.paidAt),
            BOOKING_ID: rental._id.toString().slice(-6).toUpperCase(),
            PRODUCT_NAME: productLabel(rental.orderItems),
            MONTHLY_RENT: inr(rental.itemsPrice),
            SECURITY_DEPOSIT: inr(depositTotal),
            START_DATE: fmtDate(rental.rentalPeriod?.startDate),
            END_DATE: fmtDate(rental.rentalPeriod?.endDate),
            NEXT_DUE_DATE: fmtDate(rental.rentalPeriod?.endDate),
            PAYMENT_METHOD: rental.paymentMethod || 'Online',
            DELIVERY_ADDRESS: formatAddress(rental.shippingAddress),
            DELIVERY_DATE: fmtDate(rental.rentalPeriod?.startDate),
            SAVINGS_AMOUNT: inr(Math.round((rental.itemsPrice || 0) * 10)),
            SAVINGS_PERCENT: '70',
        });

        res.json(updatedRental);
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
        rental.status = status;

        // Auto update booleans based on status
        if (status === RENTAL_STATUS.DELIVERED || status === RENTAL_STATUS.ACTIVE) {
            rental.isDelivered = true;
            rental.deliveredAt = Date.now();
        }
        if (status === RENTAL_STATUS.RETURNED) {
            rental.isReturned = true;
            rental.returnedAt = Date.now();
        }

        const updatedRental = await rental.save();

        // Send the email matching the new status (non-blocking).
        const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
        const depositTotal = (rental.orderItems || []).reduce((s, i) => s + (i.securityDeposit || 0) * (i.qty || 1), 0);
        const base = {
            CUSTOMER_NAME: rental.user?.name || 'Customer',
            ORDER_ID: rental._id.toString().slice(-6).toUpperCase(),
            PRODUCT_NAME: productLabel(rental.orderItems),
            DELIVERY_DATE: fmtDate(rental.rentalPeriod?.startDate),
            RENTAL_DURATION: rental.rentalPeriod?.durationMonths ? `${rental.rentalPeriod.durationMonths} month(s)` : '1 month',
            MONTHLY_RENT: inr(rental.itemsPrice),
            DELIVERY_ADDRESS: formatAddress(rental.shippingAddress),
        };
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
        } else if (status === RENTAL_STATUS.RETURNED) {
            sendTemplatedEmail('Return Confirmed — Refund Initiated', email, {
                ...base,
                REFUND_AMOUNT: inr(depositTotal),
                PAYMENT_METHOD: rental.paymentMethod || 'original payment method',
            });
        } else if (status === RENTAL_STATUS.CANCELLED) {
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

module.exports = {
    addRentalItems,
    getRentalById,
    updateRentalToPaid,
    getMyRentals,
    getRentals,
    updateRentalStatus,
};
