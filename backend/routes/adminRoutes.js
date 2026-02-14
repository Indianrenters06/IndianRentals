const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    // Products
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    // Users
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    // Rentals
    getAllRentals,
    updateRentalStatus,
    // KYC
    getAllKYC,
    updateKYCStatus,
    // Invoices
    getAllInvoices,
    // Payments
    getAllPayments,
    // Calendar
    getCalendarEvents
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// Dashboard
router.get('/stats', protect, admin, getDashboardStats);

// Products Management
router.route('/products')
    .get(protect, admin, getAllProducts)
    .post(protect, admin, createProduct);

router.route('/products/:id')
    .put(protect, admin, updateProduct)
    .delete(protect, admin, deleteProduct);

// Users Management
router.route('/users')
    .get(protect, admin, getAllUsers);

router.route('/users/:id')
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUser)
    .delete(protect, admin, deleteUser);

// Rentals Management
router.route('/rentals')
    .get(protect, admin, getAllRentals);

router.route('/rentals/:id')
    .put(protect, admin, updateRentalStatus);

// KYC Management
router.route('/kyc')
    .get(protect, admin, getAllKYC);

router.route('/kyc/:id')
    .put(protect, admin, updateKYCStatus);

// Invoices Management
router.route('/invoices')
    .get(protect, admin, getAllInvoices);

// Payments Management
router.route('/payments')
    .get(protect, admin, getAllPayments);

// Calendar Management
router.route('/calendar')
    .get(protect, admin, getCalendarEvents);

module.exports = router;

