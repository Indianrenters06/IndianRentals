const express = require('express');
const router = express.Router();
const { getCoupons, verifyCoupon, createCoupon, updateCoupon, deleteCoupon } = require('../controllers/couponController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public route — verify a coupon code at checkout
router.post('/verify', verifyCoupon);

// Admin-only routes
router.route('/')
    .get(protect, admin, getCoupons)
    .post(protect, admin, createCoupon);

router.route('/:id')
    .put(protect, admin, updateCoupon)
    .delete(protect, admin, deleteCoupon);

module.exports = router;
