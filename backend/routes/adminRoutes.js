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
    getCalendarEvents,
    // Inventory
    getAvailableStock,
    getAssignedInventory,
    getReturnedInventory,
    getDamagedInventory,
    getStockAlerts,
    adjustStock,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

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

// ── Role & Permission Assignment (superadmin only) ────────────────────────────
router.put('/users/:id/role', protect, admin, asyncHandler(async (req, res) => {
    const { role, adminPermissions } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) { res.status(404); throw new Error('User not found'); }
    if (role) user.role = role;
    if (Array.isArray(adminPermissions)) user.adminPermissions = adminPermissions;
    await user.save();
    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        adminPermissions: user.adminPermissions,
    });
}));

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

// Inventory Management
router.route('/inventory/available')
    .get(protect, admin, getAvailableStock);

router.route('/inventory/assigned')
    .get(protect, admin, getAssignedInventory);

router.route('/inventory/returned')
    .get(protect, admin, getReturnedInventory);

router.route('/inventory/damaged')
    .get(protect, admin, getDamagedInventory);

router.route('/inventory/alerts')
    .get(protect, admin, getStockAlerts);

router.route('/inventory/adjustment')
    .post(protect, admin, adjustStock);

module.exports = router;

