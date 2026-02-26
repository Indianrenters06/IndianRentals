const asyncHandler = require('express-async-handler');
const Coupon = require('../models/Coupon');

// @desc    Get all coupons
// @route   GET /api/admin/coupons
// @access  Private/Admin
const getCoupons = asyncHandler(async (req, res) => {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    res.json(coupons);
});

// @desc    Create a new coupon
// @route   POST /api/admin/coupons
// @access  Private/Admin
const createCoupon = asyncHandler(async (req, res) => {
    const {
        code, discountType, discountAmount, minOrderAmount,
        maxDiscountAmount, isActive, expiryDate, usageLimit
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
        usageLimit
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

module.exports = {
    getCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon
};
