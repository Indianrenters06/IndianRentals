const express = require('express');
const router = express.Router();
const { getCoupons, getActiveCoupons, verifyCoupon, createCoupon, updateCoupon, deleteCoupon, getCouponAnalytics, getCouponReport } = require('../controllers/couponController');
const { protect, admin, hasPermission } = require('../middleware/authMiddleware');

// Public routes — used by the storefront cart
router.post('/verify', verifyCoupon);   // verify a single code at checkout
router.get('/active', getActiveCoupons); // list active coupons ("View All Coupons")

// Admin-only routes
router.get('/analytics', protect, admin, hasPermission('coupons'), getCouponAnalytics);
router.get('/report', protect, admin, hasPermission('coupons'), getCouponReport);

router.route('/')
    .get(protect, admin, hasPermission('coupons'), getCoupons)
    .post(protect, admin, hasPermission('coupons'), createCoupon);

router.route('/:id')
    .put(protect, admin, hasPermission('coupons'), updateCoupon)
    .delete(protect, admin, hasPermission('coupons'), deleteCoupon);

module.exports = router;
