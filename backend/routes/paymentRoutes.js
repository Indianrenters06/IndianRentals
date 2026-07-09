const express = require('express');
const router = express.Router();
const {
    createCashfreeOrder,
    verifyCashfreePayment,
    cashfreeWebhook,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// Create a Cashfree order for a rental the logged-in user owns.
router.post('/cashfree/order', protect, createCashfreeOrder);

// Confirm payment status after the checkout modal closes.
router.post('/cashfree/verify', protect, verifyCashfreePayment);

// Cashfree -> our server webhook (public, HMAC-verified inside the handler).
router.post('/cashfree/webhook', cashfreeWebhook);

module.exports = router;
