const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Product = require('../models/Product');
const Rental = require('../models/Rental');

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
    // Assuming Rental model has `totalPrice` and `isPaid`
    const revenueAggregation = await Rental.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);
    const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].total : 0;

    // 5. Recent Rentals (Last 5)
    // We populate user and orderItems.product to display names
    const recentRentals = await Rental.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'name email');

    // 6. Low Stock Products (Optional, good for admin)
    const lowStockProducts = await Product.find({ countInStock: { $lt: 5 } }).limit(5);

    res.json({
        totalUsers,
        totalProducts,
        totalRentals,
        totalRevenue,
        recentRentals,
        lowStockProducts
    });
});

module.exports = {
    getDashboardStats
};
