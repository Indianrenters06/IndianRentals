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

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
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
    getCalendarEvents
};
