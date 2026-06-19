const express = require('express');
const router = express.Router();
const { getCoupons, getActiveCoupons, verifyCoupon, createCoupon, updateCoupon, deleteCoupon, getCouponAnalytics, getCouponReport } = require('../controllers/couponController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes — used by the storefront cart
router.post('/verify', verifyCoupon);   // verify a single code at checkout
router.get('/active', getActiveCoupons); // list active coupons ("View All Coupons")

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
