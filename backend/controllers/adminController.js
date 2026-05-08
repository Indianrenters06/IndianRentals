const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Product = require('../models/Product');
const Rental = require('../models/Rental');
const KYC = require('../models/KYC');
const Notification = require('../models/Notification');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
    // 1. Total Users
    const totalUsers = await User.countDocuments();

    // 2. Total Products
    const totalProducts = await Product.countDocuments();

    // 3. Total Rentals (Orders)
    const totalRentals = await Rental.countDocuments();

    // 4. Total Revenue (Sum of paid rentals)
    const revenueAggregation = await Rental.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);
    const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].total : 0;

    // 5. Recent Rentals (Last 5)
    const recentRentals = await Rental.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'name email');

    // 6. Low Stock Products
    const lowStockProducts = await Product.find({ stock: { $lt: 5 } }).limit(5);

    // 7. Active users (users who logged in within last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const activeNow = await User.countDocuments({ lastLogin: { $gte: oneDayAgo } });

    // 8. Pending KYC count
    const pendingKYC = await KYC.countDocuments({ status: 'pending' });

    // 9. Recent Notifications
    const recentNotifications = await Notification.find({}).sort({ createdAt: -1 }).limit(5);

    res.json({
        totalUsers,
        totalProducts,
        totalRentals,
        totalRevenue,
        recentRentals,
        lowStockProducts,
        activeNow,
        pendingKYC,
        recentNotifications
    });
});

// ============= PRODUCT MANAGEMENT =============

// @desc    Get all products (Admin)
// @route   GET /api/admin/products
// @access  Private/Admin
const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
});

// @desc    Create a product
// @route   POST /api/admin/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const {
        name,
        description,
        category,
        subcategory,
        brand,
        rentalPrice,
        securityDeposit,
        stock,
        condition,
        city,
        state,
        images
    } = req.body;

    const product = await Product.create({
        name,
        description,
        category,
        subcategory: subcategory || null,
        brand,
        rentalPrice,
        securityDeposit,
        stock,
        condition,
        city,
        state,
        images: images || []
    });

    res.status(201).json(product);
});

// @desc    Update a product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    // Allow explicitly setting subcategory to null (to remove it)
    if (req.body.subcategory === '') req.body.subcategory = null;

    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    ).populate('subcategory', 'name slug');

    res.json(updatedProduct);
});

// @desc    Delete a product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product removed successfully' });
});

// ============= USER MANAGEMENT =============

// @desc    Get all users (customers)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({ role: 'customer' }).select('-password').sort({ createdAt: -1 });
    res.json(users);
});

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    res.json(user);
});

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    ).select('-password');

    res.json(updatedUser);
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User removed successfully' });
});

// ============= TEAM MEMBERS MANAGEMENT =============

// @desc    Get all team members (staff and admins)
// @route   GET /api/admin/team
// @access  Private/Admin
const getTeamMembers = asyncHandler(async (req, res) => {
    const team = await User.find({ role: { $in: ['admin', 'staff', 'superadmin', 'operations_manager', 'sales_executive', 'finance_executive'] } }).select('-password').sort({ createdAt: -1 });
    res.json(team);
});

// @desc    Create a team member
// @route   POST /api/admin/team
// @access  Private/Admin
const createTeamMember = asyncHandler(async (req, res) => {
    const { name, email, password, phone, role, adminPermissions } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const member = await User.create({
        name,
        email,
        password,
        phone,
        role: role || 'staff',
        adminPermissions: adminPermissions || [],
        isEmailVerified: true,
        isPhoneVerified: true
    });

    res.status(201).json({
        _id: member._id,
        name: member.name,
        email: member.email,
        role: member.role,
        adminPermissions: member.adminPermissions
    });
});

// ============= RENTAL MANAGEMENT =============

// @desc    Get all rentals
// @route   GET /api/admin/rentals
// @access  Private/Admin
const getAllRentals = asyncHandler(async (req, res) => {
    const rentals = await Rental.find({})
        .populate('user', 'name email')
        .sort({ createdAt: -1 });
    res.json(rentals);
});

// @desc    Update rental status
// @route   PUT /api/admin/rentals/:id
// @access  Private/Admin
const updateRentalStatus = asyncHandler(async (req, res) => {
    const rental = await Rental.findById(req.params.id);

    if (!rental) {
        res.status(404);
        throw new Error('Rental not found');
    }

    const updatedRental = await Rental.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    ).populate('user', 'name email');

    res.json(updatedRental);
});

// ============= KYC MANAGEMENT =============

// @desc    Get all KYC submissions
// @route   GET /api/admin/kyc
// @access  Private/Admin
const getAllKYC = asyncHandler(async (req, res) => {
    const kycList = await KYC.find({})
        .populate('user', 'name email phone')
        .sort({ createdAt: -1 });
    res.json(kycList);
});

// @desc    Update KYC status (Approve/Reject)
// @route   PUT /api/admin/kyc/:id
// @access  Private/Admin
const updateKYCStatus = asyncHandler(async (req, res) => {
    const { status, remarks } = req.body;

    // Validate status
    if (!['approved', 'rejected', 'pending'].includes(status)) {
        res.status(400);
        throw new Error('Invalid status. Must be approved, rejected, or pending');
    }

    // Find KYC record
    const kyc = await KYC.findById(req.params.id);
    if (!kyc) {
        res.status(404);
        throw new Error('KYC record not found');
    }

    // Update KYC status
    kyc.status = status;
    if (remarks) {
        kyc.remarks = remarks;
    }
    await kyc.save();

    // Update user's KYC status
    const user = await User.findById(kyc.user);
    if (user) {
        user.kyc = user.kyc || {};
        user.kyc.status = status;
        if (remarks && status === 'rejected') {
            user.kyc.rejectionReason = remarks;
        }
        await user.save();
    }

    // Populate user data for response
    await kyc.populate('user', 'name email phone');

    res.json({
        message: `KYC ${status} successfully`,
        kyc
    });
});

// @desc    Get all invoices
// @route   GET /api/admin/invoices
// @access  Private/Admin
const getAllInvoices = asyncHandler(async (req, res) => {
    const rentals = await Rental.find({})
        .populate('user', 'name email')
        .populate('product', 'name')
        .sort({ createdAt: -1 });

    // Transform rentals to invoice format
    const invoices = rentals.map(rental => ({
        _id: rental._id,
        invoiceNumber: `INV-${rental._id.toString().slice(-6).toUpperCase()}`,
        customer: rental.user,
        amount: rental.totalPrice,
        status: rental.isPaid ? 'paid' : 'pending',
        createdAt: rental.createdAt,
        product: rental.product
    }));

    res.json(invoices);
});

// @desc    Get all payments
// @route   GET /api/admin/payments
// @access  Private/Admin
const getAllPayments = asyncHandler(async (req, res) => {
    const rentals = await Rental.find({})
        .populate('user', 'name email')
        .populate('product', 'name')
        .sort({ createdAt: -1 });

    // Transform rentals to payment format
    const payments = rentals.map(rental => ({
        _id: rental._id,
        transactionId: `TXN-${rental._id.toString().slice(-8).toUpperCase()}`,
        customer: rental.user,
        amount: rental.totalPrice,
        paymentMethod: rental.paymentMethod || 'card',
        status: rental.isPaid ? 'completed' : 'pending',
        createdAt: rental.createdAt,
        product: rental.product
    }));

    res.json(payments);
});

// @desc    Get calendar events (rentals)
// @route   GET /api/admin/calendar
// @access  Private/Admin
const getCalendarEvents = asyncHandler(async (req, res) => {
    const rentals = await Rental.find({})
        .populate('user', 'name email')
        .populate('product', 'name')
        .sort({ startDate: 1 });

    // Transform rentals to calendar events
    const events = rentals.map(rental => ({
        _id: rental._id,
        title: `${rental.product?.name || 'Rental'} - ${rental.user?.name || 'Customer'}`,
        date: rental.startDate || rental.createdAt,
        customer: rental.user,
        product: rental.product,
        status: rental.status,
        amount: rental.totalPrice
    }));

    res.json(events);
});

// ============= INVENTORY MANAGEMENT =============

// @desc    Get available stock (products with stock > 0)
// @route   GET /api/admin/inventory/available
// @access  Private/Admin
const getAvailableStock = asyncHandler(async (req, res) => {
    const products = await Product.find({ stock: { $gt: 0 }, isActive: true })
        .sort({ createdAt: -1 });
    const stockItems = products.map(p => ({
        _id: p._id,
        name: p.name,
        sku: `${p.category?.substring(0, 3).toUpperCase() || 'PRD'}-${p._id.toString().slice(-5).toUpperCase()}`,
        location: `${p.city}, ${p.state}`,
        condition: p.condition,
        stock: p.stock,
        status: p.condition === 'New' ? 'Ready' : p.condition === 'Good' ? 'Ready' : 'In Inspection'
    }));
    res.json(stockItems);
});

// @desc    Get assigned inventory (active rentals)
// @route   GET /api/admin/inventory/assigned
// @access  Private/Admin
const getAssignedInventory = asyncHandler(async (req, res) => {
    const rentals = await Rental.find({
        status: { $in: ['Active', 'Delivered', 'Shipped', 'Approved'] }
    })
        .populate('user', 'name email')
        .populate('orderItems.product', 'name')
        .sort({ createdAt: -1 });

    const assigned = [];
    rentals.forEach(rental => {
        rental.orderItems.forEach(item => {
            const endDate = rental.rentalPeriod?.endDate;
            const daysLeft = endDate
                ? Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24))
                : null;
            assigned.push({
                _id: `${rental._id}-${item._id}`,
                item: item.name,
                user: rental.user?.name || 'Unknown',
                email: rental.user?.email || '',
                order: `ORD-${rental._id.toString().slice(-6).toUpperCase()}`,
                returnDate: endDate ? new Date(endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A',
                daysLeft,
                status: rental.status
            });
        });
    });
    res.json(assigned);
});

// @desc    Get returned inventory
// @route   GET /api/admin/inventory/returned
// @access  Private/Admin
const getReturnedInventory = asyncHandler(async (req, res) => {
    const rentals = await Rental.find({ status: 'Returned' })
        .populate('user', 'name email')
        .sort({ returnedAt: -1 });

    const returned = [];
    rentals.forEach(rental => {
        rental.orderItems.forEach(item => {
            returned.push({
                _id: `${rental._id}-${item._id}`,
                item: item.name,
                returnedBy: rental.user?.name || 'Unknown',
                condition: 'Pending Inspection',
                processed: false,
                date: rental.returnedAt
                    ? new Date(rental.returnedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                    : new Date(rental.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
            });
        });
    });
    res.json(returned);
});

// @desc    Get damaged inventory (products with condition Fair or manually flagged)
// @route   GET /api/admin/inventory/damaged
// @access  Private/Admin
const getDamagedInventory = asyncHandler(async (req, res) => {
    const products = await Product.find({ condition: 'Fair' }).sort({ updatedAt: -1 });
    const damaged = products.map(p => ({
        _id: p._id,
        item: p.name,
        issue: 'Wear & Tear – Condition Marked Fair',
        severity: 'Low',
        estimate: 'Under Assessment',
        status: 'Pending Quote'
    }));
    res.json(damaged);
});

// @desc    Get stock alerts (low stock products < 5)
// @route   GET /api/admin/inventory/alerts
// @access  Private/Admin
const getStockAlerts = asyncHandler(async (req, res) => {
    const lowStock = await Product.find({ stock: { $gt: 0, $lt: 5 }, isActive: true }).sort({ stock: 1 });
    const outOfStock = await Product.find({ stock: 0, isActive: true }).sort({ updatedAt: -1 });

    const alerts = [
        ...outOfStock.map(p => ({
            _id: p._id,
            item: p.name,
            type: 'Out of Stock',
            message: `${p.name} is currently out of stock.`,
            priority: 'High',
            stock: p.stock
        })),
        ...lowStock.map(p => ({
            _id: p._id,
            item: p.name,
            type: 'Low Stock',
            message: `Only ${p.stock} unit${p.stock !== 1 ? 's' : ''} remaining in ${p.city}.`,
            priority: p.stock <= 2 ? 'High' : 'Medium',
            stock: p.stock
        }))
    ];
    res.json(alerts);
});

// @desc    Log a stock adjustment
// @route   POST /api/admin/inventory/adjustment
// @access  Private/Admin
const adjustStock = asyncHandler(async (req, res) => {
    const { productId, change, reason } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }
    product.stock = Math.max(0, product.stock + Number(change));
    await product.save();
    res.json({
        message: 'Stock adjusted successfully',
        product: { _id: product._id, name: product.name, stock: product.stock },
        change,
        reason
    });
});

module.exports = {
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
    // Team
    getTeamMembers,
    createTeamMember,
};
