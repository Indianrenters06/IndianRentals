const express = require('express');
const router  = express.Router();
const { protect, admin, hasPermission } = require('../middleware/authMiddleware');
const {
    getRevenueReport,
    getRentalDurationReport,
    getCategoryReport,
    getCustomerLTVReport,
    getChurnReport,
    getInventoryReport,
    getCancellationReport,
    getRefundReport,
    getVendorReport,
    getLocationReport,
} = require('../controllers/reportController');

router.get('/revenue',               protect, admin, hasPermission('reports'), getRevenueReport);
router.get('/rental-duration',       protect, admin, hasPermission('reports'), getRentalDurationReport);
router.get('/category-performance',  protect, admin, hasPermission('reports'), getCategoryReport);
router.get('/customer-ltv',          protect, admin, hasPermission('reports'), getCustomerLTVReport);
router.get('/churn',                 protect, admin, hasPermission('reports'), getChurnReport);
router.get('/inventory-utilization', protect, admin, hasPermission('reports'), getInventoryReport);
router.get('/cancellations',         protect, admin, hasPermission('reports'), getCancellationReport);
router.get('/refunds',               protect, admin, hasPermission('reports'), getRefundReport);
router.get('/vendors',               protect, admin, hasPermission('reports'), getVendorReport);
router.get('/location',              protect, admin, hasPermission('reports'), getLocationReport);

module.exports = router;
