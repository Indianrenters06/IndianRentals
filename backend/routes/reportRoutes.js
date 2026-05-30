const express = require('express');
const router  = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
    getRevenueReport,
    getRentalDurationReport,
    getCategoryReport,
    getCustomerLTVReport,
    getChurnReport,
    getInventoryReport,
    getCancellationReport,
} = require('../controllers/reportController');

router.get('/revenue',               protect, admin, getRevenueReport);
router.get('/rental-duration',       protect, admin, getRentalDurationReport);
router.get('/category-performance',  protect, admin, getCategoryReport);
router.get('/customer-ltv',          protect, admin, getCustomerLTVReport);
router.get('/churn',                 protect, admin, getChurnReport);
router.get('/inventory-utilization', protect, admin, getInventoryReport);
router.get('/cancellations',         protect, admin, getCancellationReport);

module.exports = router;
