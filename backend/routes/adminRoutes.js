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
    getTeamMembers,
    createTeamMember,
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

// ── User Status Management (block / unblock / activate / deactivate) ─────────
router.patch('/users/:id/status', protect, admin, asyncHandler(async (req, res) => {
    const { action, reason } = req.body;
    // action: 'block' | 'unblock' | 'deactivate' | 'activate'

    const updatePayload = {};
    if (action === 'block') {
        updatePayload.isBlocked = true;
        updatePayload.isActive = false;
        updatePayload.blockedReason = reason || 'Blocked by admin';
    } else if (action === 'unblock') {
        updatePayload.isBlocked = false;
        updatePayload.isActive = true;
        updatePayload.blockedReason = '';
    } else if (action === 'deactivate') {
        updatePayload.isActive = false;
    } else if (action === 'activate') {
        updatePayload.isActive = true;
    } else {
        res.status(400);
        throw new Error('Invalid action. Use: block, unblock, activate, deactivate');
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { $set: updatePayload },
        { new: true, runValidators: false }
    ).select('-password');

    if (!updatedUser) { res.status(404); throw new Error('User not found'); }

    res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        isBlocked: updatedUser.isBlocked,
        isActive: updatedUser.isActive,
        blockedReason: updatedUser.blockedReason,
    });
}));

// ── Role & Permission Assignment (superadmin only) ────────────────────────────
router.put('/users/:id/role', protect, admin, asyncHandler(async (req, res) => {
    const { role, adminPermissions } = req.body;

    // Determine final role based on permissions
    const finalRole = role || (Array.isArray(adminPermissions) && adminPermissions.length > 0 ? 'staff' : 'customer');

    const updatePayload = { role: finalRole };
    if (Array.isArray(adminPermissions)) updatePayload.adminPermissions = adminPermissions;

    // Use findByIdAndUpdate to avoid triggering the password pre-save hook
    const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { $set: updatePayload },
        { new: true, runValidators: false }
    ).select('-password');

    if (!updatedUser) { res.status(404); throw new Error('User not found'); }

    res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        adminPermissions: updatedUser.adminPermissions,
    });
}));

// Team Management
router.route('/team')
    .get(protect, admin, getTeamMembers)
    .post(protect, admin, createTeamMember);

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

