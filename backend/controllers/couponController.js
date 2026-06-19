const asyncHandler = require('express-async-handler');
const Coupon = require('../models/Coupon');

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = asyncHandler(async (req, res) => {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    res.json(coupons);
});

// @desc    Get active, currently-valid coupons (shown to shoppers in the cart)
// @route   GET /api/coupons/active
// @access  Public
const getActiveCoupons = asyncHandler(async (req, res) => {
    const now = new Date();
    const coupons = await Coupon.find({
        isActive: true,
        expiryDate: { $gte: now },
    }).sort({ createdAt: -1 });

    // Drop usage-exhausted coupons and expose only customer-safe fields
    // (no internal usageCount/usageLimit/_id leakage).
    const visible = coupons
        .filter((c) => !c.usageLimit || c.usageCount < c.usageLimit)
        .map((c) => ({
            code: c.code,
            discountType: c.discountType,
            discountAmount: c.discountAmount,
            minOrderAmount: c.minOrderAmount,
            maxDiscountAmount: c.maxDiscountAmount,
            expiryDate: c.expiryDate,
            description: c.description,
        }));

    res.json(visible);
});

// @desc    Verify / Apply a coupon code (for logged-in users at checkout)
// @route   POST /api/coupons/verify
// @access  Private (any logged-in user)
const verifyCoupon = asyncHandler(async (req, res) => {
    const { code, orderAmount } = req.body;

    if (!code) {
        res.status(400);
        throw new Error('Coupon code is required');
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
        res.status(404);
        throw new Error('Invalid coupon code');
    }

    if (!coupon.isActive) {
        res.status(400);
        throw new Error('This coupon is no longer active');
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
        res.status(400);
        throw new Error('This coupon has expired');
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
        res.status(400);
        throw new Error('This coupon has reached its usage limit');
    }

    if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
        res.status(400);
        throw new Error(`Minimum order amount of ₹${coupon.minOrderAmount} required for this coupon`);
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
        discountAmount = (orderAmount * coupon.discountAmount) / 100;
        if (coupon.maxDiscountAmount) {
            discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
        }
    } else {
        // flat
        discountAmount = coupon.discountAmount;
    }
    discountAmount = Math.round(discountAmount);

    res.json({
        valid: true,
        code: coupon.code,
        discountType: coupon.discountType,
        discountAmount,
        description: coupon.description,
    });
});

// @desc    Create a new coupon
// @route   POST /api/admin/coupons
// @access  Private/Admin
const createCoupon = asyncHandler(async (req, res) => {
    const {
        code, discountType, discountAmount, minOrderAmount,
        maxDiscountAmount, isActive, expiryDate, usageLimit, description
    } = req.body;

    const couponExists = await Coupon.findOne({ code: code.toUpperCase() });

    if (couponExists) {
        res.status(400);
        throw new Error('Coupon code already exists');
    }

    const coupon = await Coupon.create({
        code,
        discountType,
        discountAmount,
        minOrderAmount,
        maxDiscountAmount,
        isActive,
        expiryDate,
        usageLimit,
        description
    });

    if (coupon) {
        res.status(201).json(coupon);
    } else {
        res.status(400);
        throw new Error('Invalid coupon data');
    }
});

// @desc    Update a coupon
// @route   PUT /api/admin/coupons/:id
// @access  Private/Admin
const updateCoupon = asyncHandler(async (req, res) => {
    const coupon = await Coupon.findById(req.params.id);

    if (coupon) {
        coupon.code = req.body.code || coupon.code;
        coupon.discountType = req.body.discountType || coupon.discountType;
        coupon.discountAmount = req.body.discountAmount || coupon.discountAmount;
        coupon.minOrderAmount = req.body.minOrderAmount !== undefined ? req.body.minOrderAmount : coupon.minOrderAmount;
        coupon.maxDiscountAmount = req.body.maxDiscountAmount !== undefined ? req.body.maxDiscountAmount : coupon.maxDiscountAmount;
        coupon.isActive = req.body.isActive !== undefined ? req.body.isActive : coupon.isActive;
        coupon.expiryDate = req.body.expiryDate || coupon.expiryDate;
        coupon.usageLimit = req.body.usageLimit !== undefined ? req.body.usageLimit : coupon.usageLimit;
        coupon.description = req.body.description || coupon.description;

        const updatedCoupon = await coupon.save();
        res.json(updatedCoupon);
    } else {
        res.status(404);
        throw new Error('Coupon not found');
    }
});

// @desc    Delete a coupon
// @route   DELETE /api/admin/coupons/:id
// @access  Private/Admin
const deleteCoupon = asyncHandler(async (req, res) => {
    const coupon = await Coupon.findById(req.params.id);

    if (coupon) {
        await coupon.deleteOne();
        res.json({ message: 'Coupon removed' });
    } else {
        res.status(404);
        throw new Error('Coupon not found');
    }
});

// @desc    Get coupon analytics
// @route   GET /api/admin/coupons/analytics
// @access  Private/Admin
const getCouponAnalytics = asyncHandler(async (req, res) => {
    // We need Rental to fetch usage stats
    const Rental = require('../models/Rental');
    
    // Find all rentals that used a coupon
    const rentals = await Rental.find({ couponCode: { $ne: null, $ne: "" } });

    let totalDiscount = 0;
    let totalRevenue = 0;
    const usageByCode = {};
    const timeline = {};

    rentals.forEach(r => {
        totalDiscount += (r.couponDiscount || 0);
        totalRevenue += (r.totalPrice || 0);

        const code = r.couponCode.toUpperCase();
        usageByCode[code] = (usageByCode[code] || 0) + 1;

        // Group by day for timeline
        const dateStr = r.createdAt.toISOString().split('T')[0];
        timeline[dateStr] = (timeline[dateStr] || 0) + 1;
    });

    const topCoupons = Object.entries(usageByCode)
        .map(([code, count]) => ({ code, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    // Format timeline for charts
    const timelineData = Object.entries(timeline)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json({
        totalCouponsUsed: rentals.length,
        totalDiscountGiven: totalDiscount,
        revenueFromCoupons: totalRevenue,
        topCoupons,
        timelineData
    });
});

// @desc    Get coupon usage report
// @route   GET /api/admin/coupons/report
// @access  Private/Admin
const getCouponReport = asyncHandler(async (req, res) => {
    const Rental = require('../models/Rental');
    const rentals = await Rental.find({ couponCode: { $ne: null, $ne: "" } })
        .populate('user', 'name email')
        .sort({ createdAt: -1 });

    const report = rentals.map(r => ({
        orderId: r._id,
        user: r.user ? r.user.name : 'Unknown',
        email: r.user ? r.user.email : '',
        date: r.createdAt,
        couponCode: r.couponCode,
        discount: r.couponDiscount,
        orderTotal: r.totalPrice,
        status: r.status
    }));

    res.json(report);
});

module.exports = {
    getCoupons,
    getActiveCoupons,
    verifyCoupon,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    getCouponAnalytics,
    getCouponReport
};
