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
    processReturnedInspection,
    getDamagedInventory,
    getStockAlerts,
    adjustStock,
    getTeamMembers,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
    getPricingPlans,
    createPricingPlan,
    deletePricingPlan,
    getRoles,
    createRole,
    updateRole,
    deleteRole,
} = require('../controllers/adminController');
const { protect, admin, fullAdmin, hasPermission } = require('../middleware/authMiddleware');

// Staff only reach the sections an admin granted them (adminPermissions).
// Some screens read another section's data — e.g. Inventory lists products,
// Customers and Payments list rentals — so those reads accept either permission.
const products = hasPermission('products');
const productsRead = hasPermission('products', 'inventory');
const users = hasPermission('users');
const rentalsRead = hasPermission('orders', 'users', 'payments');
const orders = hasPermission('orders');
const kyc = hasPermission('kyc');
const payments = hasPermission('payments', 'orders');
const inventory = hasPermission('inventory');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// Dashboard
router.get('/stats', protect, admin, getDashboardStats);

// Products Management
router.route('/products')
    .get(protect, admin, productsRead, getAllProducts)
    .post(protect, admin, products, createProduct);

router.route('/products/:id')
    .put(protect, admin, products, updateProduct)
    .delete(protect, admin, products, deleteProduct);

// Users Management
router.route('/users')
    .get(protect, admin, users, getAllUsers);

router.route('/users/:id')
    .get(protect, admin, users, getUserById)
    .put(protect, admin, users, updateUser)
    .delete(protect, admin, users, deleteUser);

// ── Orders for a specific user ────────────────────────────────────────────────
const Rental = require('../models/Rental');
router.get('/users/:id/orders', protect, admin, rentalsRead, asyncHandler(async (req, res) => {
    const orders = await Rental.find({ user: req.params.id })
        .sort({ createdAt: -1 })
        .lean();
    res.json(orders);
}));

// ── User Status Management (block / unblock / activate / deactivate) ─────────
router.patch('/users/:id/status', protect, admin, users, asyncHandler(async (req, res) => {
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
router.put('/users/:id/role', protect, admin, fullAdmin, asyncHandler(async (req, res) => {
    const { role, adminPermissions } = req.body;

    // Determine final role based on permissions
    const finalRole = role || (Array.isArray(adminPermissions) && adminPermissions.length > 0 ? 'staff' : 'customer');

    const target = await User.findById(req.params.id).select('role');
    if (!target) { res.status(404); throw new Error('User not found'); }
    if ((finalRole === 'super_admin' || target.role === 'super_admin') && req.user.role !== 'super_admin') {
        res.status(403);
        throw new Error('Only Super Admin can grant or change the Super Admin role');
    }
    if (!User.schema.path('role').enumValues.includes(finalRole)) {
        res.status(400);
        throw new Error('Invalid role');
    }

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
// Pricing Plans
router.route('/pricing-plans')
    .get(protect, admin, products, getPricingPlans)
    .post(protect, admin, products, createPricingPlan);

router.delete('/pricing-plans/:id', protect, admin, products, deletePricingPlan);


router.route('/team')
    .get(protect, admin, fullAdmin, getTeamMembers)
    .post(protect, admin, fullAdmin, createTeamMember);

router.route('/team/:id')
    .put(protect, admin, fullAdmin, updateTeamMember)
    .delete(protect, admin, fullAdmin, deleteTeamMember);

// Rentals Management
router.route('/rentals')
    .get(protect, admin, rentalsRead, getAllRentals);

router.route('/rentals/:id')
    .put(protect, admin, orders, updateRentalStatus);

// KYC Management
router.route('/kyc')
    .get(protect, admin, kyc, getAllKYC);

router.route('/kyc/:id')
    .put(protect, admin, kyc, updateKYCStatus);

// Invoices Management
router.route('/invoices')
    .get(protect, admin, payments, getAllInvoices);

// Payments Management
router.route('/payments')
    .get(protect, admin, payments, getAllPayments);

// Calendar Management
router.route('/calendar')
    .get(protect, admin, getCalendarEvents);

// Inventory Management
router.route('/inventory/available')
    .get(protect, admin, inventory, getAvailableStock);

router.route('/inventory/assigned')
    .get(protect, admin, inventory, getAssignedInventory);

router.route('/inventory/returned')
    .get(protect, admin, inventory, getReturnedInventory);

router.route('/inventory/returned/:rentalId/:itemId')
    .put(protect, admin, inventory, processReturnedInspection);

router.route('/inventory/damaged')
    .get(protect, admin, inventory, getDamagedInventory);

router.route('/inventory/alerts')
    .get(protect, admin, inventory, getStockAlerts);

router.route('/inventory/adjustment')
    .post(protect, admin, inventory, adjustStock);

// Roles Management
router.route('/roles')
    .get(protect, admin, fullAdmin, getRoles)
    .post(protect, admin, fullAdmin, createRole);

router.route('/roles/:id')
    .put(protect, admin, fullAdmin, updateRole)
    .delete(protect, admin, fullAdmin, deleteRole);

module.exports = router;

