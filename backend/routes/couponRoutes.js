const express = require('express');
const router = express.Router();
const { getCoupons, verifyCoupon, createCoupon, updateCoupon, deleteCoupon, getCouponAnalytics, getCouponReport } = require('../controllers/couponController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public route — verify a coupon code at checkout
router.post('/verify', verifyCoupon);

// Admin-only routes
router.get('/analytics', protect, admin, getCouponAnalytics);
router.get('/report', protect, admin, getCouponReport);

router.route('/')
    .get(protect, admin, getCoupons)
    .post(protect, admin, createCoupon);

router.route('/:id')
    .put(protect, admin, updateCoupon)
    .delete(protect, admin, deleteCoupon);

module.exports = router;
