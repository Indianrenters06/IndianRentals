const asyncHandler = require('express-async-handler');
const Rental = require('../models/Rental');
const User = require('../models/User');
const Product = require('../models/Product');

// ── helpers ───────────────────────────────────────────────────────────────────
const yearRange = (year) => ({
    $gte: new Date(`${year}-01-01`),
    $lt:  new Date(`${year + 1}-01-01`),
});

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const fillMonths = (agg, valueKey = 'revenue') =>
    MONTHS.map((label, i) => {
        const found = agg.find(d => d._id?.month === i + 1);
        return { month: label, [valueKey]: found ? found[valueKey] : 0 };
    });

// ── 1. Revenue Report  GET /api/reports/revenue ───────────────────────────────
const getRevenueReport = asyncHandler(async (req, res) => {
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const [monthlyRaw, byStatus, totals] = await Promise.all([
        Rental.aggregate([
            { $match: { isPaid: true, createdAt: yearRange(year) } },
            { $group: { _id: { month: { $month: '$createdAt' } }, revenue: { $sum: '$totalPrice' }, orders: { $sum: 1 } } },
            { $sort: { '_id.month': 1 } },
        ]),
        Rental.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 }, revenue: { $sum: '$totalPrice' } } },
        ]),
        Rental.aggregate([
            { $group: { _id: null, totalRevenue: { $sum: { $cond: ['$isPaid', '$totalPrice', 0] } }, totalOrders: { $sum: 1 }, paidOrders: { $sum: { $cond: ['$isPaid', 1, 0] } } } },
        ]),
    ]);

    const monthly = MONTHS.map((label, i) => {
        const found = monthlyRaw.find(d => d._id?.month === i + 1);
        return { month: label, revenue: found?.revenue || 0, orders: found?.orders || 0 };
    });

    res.json({ monthly, byStatus, totals: totals[0] || {}, year });
});

// ── 2. Rental Duration  GET /api/reports/rental-duration ─────────────────────
const getRentalDurationReport = asyncHandler(async (req, res) => {
    const raw = await Rental.aggregate([
        { $match: { 'rentalPeriod.durationMonths': { $exists: true, $ne: null } } },
        { $group: { _id: '$rentalPeriod.durationMonths', count: { $sum: 1 }, revenue: { $sum: '$totalPrice' } } },
        { $sort: { _id: 1 } },
    ]);

    const avgRaw = await Rental.aggregate([
        { $match: { 'rentalPeriod.durationMonths': { $exists: true, $ne: null } } },
        { $group: { _id: null, avg: { $avg: '$rentalPeriod.durationMonths' }, total: { $sum: 1 } } },
    ]);

    // Bucket into readable labels
    const buckets = { '1 Month': 0, '2-3 Months': 0, '4-6 Months': 0, '7-12 Months': 0, '12+ Months': 0 };
    const bucketRevenue = { '1 Month': 0, '2-3 Months': 0, '4-6 Months': 0, '7-12 Months': 0, '12+ Months': 0 };

    for (const { _id: d, count, revenue } of raw) {
        const key =
            d === 1           ? '1 Month'    :
            d <= 3            ? '2-3 Months' :
            d <= 6            ? '4-6 Months' :
            d <= 12           ? '7-12 Months': '12+ Months';
        buckets[key]        += count;
        bucketRevenue[key]  += revenue;
    }

    const durations = Object.entries(buckets).map(([label, count]) => ({
        label, count, revenue: bucketRevenue[label],
    }));

    res.json({ durations, raw, avg: avgRaw[0] || {} });
});

// ── 3. Category Performance  GET /api/reports/category-performance ────────────
const getCategoryReport = asyncHandler(async (req, res) => {
    const items = await Rental.aggregate([
        { $match: { isPaid: true } },
        { $unwind: '$orderItems' },
        { $lookup: { from: 'products', localField: 'orderItems.product', foreignField: '_id', as: 'prod' } },
        { $unwind: { path: '$prod', preserveNullAndEmptyArrays: true } },
        { $group: {
            _id: { $ifNull: ['$prod.category', 'Uncategorized'] },
            revenue:    { $sum: { $multiply: ['$orderItems.price', { $ifNull: ['$orderItems.qty', 1] }] } },
            orders:     { $sum: 1 },
            items:      { $sum: { $ifNull: ['$orderItems.qty', 1] } },
        }},
        { $sort: { revenue: -1 } },
    ]);

    res.json({ categories: items.map(c => ({ name: c._id, revenue: c.revenue, orders: c.orders, items: c.items })) });
});

// ── 4. Customer LTV  GET /api/reports/customer-ltv ────────────────────────────
const getCustomerLTVReport = asyncHandler(async (req, res) => {
    const [topCustomers, segments] = await Promise.all([
        Rental.aggregate([
            { $match: { isPaid: true } },
            { $group: { _id: '$user', totalSpend: { $sum: '$totalPrice' }, orderCount: { $sum: 1 }, avgOrder: { $avg: '$totalPrice' }, lastOrder: { $max: '$createdAt' } } },
            { $sort: { totalSpend: -1 } },
            { $limit: 15 },
            { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'u' } },
            { $unwind: { path: '$u', preserveNullAndEmptyArrays: true } },
            { $project: { name: { $ifNull: ['$u.name', 'Unknown'] }, email: '$u.email', totalSpend: 1, orderCount: 1, avgOrder: 1, lastOrder: 1 } },
        ]),
        Rental.aggregate([
            { $match: { isPaid: true } },
            { $group: { _id: '$user', spend: { $sum: '$totalPrice' } } },
            { $bucket: {
                groupBy: '$spend',
                boundaries: [0, 1000, 5000, 15000, 50000],
                default: '₹50k+',
                output: { count: { $sum: 1 } },
            }},
        ]),
    ]);

    res.json({ topCustomers, segments });
});

// ── 5. Churn Report  GET /api/reports/churn ───────────────────────────────────
const getChurnReport = asyncHandler(async (req, res) => {
    const year  = parseInt(req.query.year) || new Date().getFullYear();
    const now   = new Date();
    const ago   = (d) => new Date(now - d * 24 * 60 * 60 * 1000);

    const [newUsersRaw, monthlyActiveRaw, totalCustomers, a30, a60, a90] = await Promise.all([
        User.aggregate([
            { $match: { role: 'customer', createdAt: yearRange(year) } },
            { $group: { _id: { month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
            { $sort: { '_id.month': 1 } },
        ]),
        Rental.aggregate([
            { $match: { createdAt: yearRange(year) } },
            { $group: { _id: { month: { $month: '$createdAt' } }, users: { $addToSet: '$user' } } },
            { $project: { month: '$_id.month', count: { $size: '$users' } } },
            { $sort: { month: 1 } },
        ]),
        User.countDocuments({ role: 'customer' }),
        Rental.distinct('user', { createdAt: { $gte: ago(30) } }),
        Rental.distinct('user', { createdAt: { $gte: ago(60) } }),
        Rental.distinct('user', { createdAt: { $gte: ago(90) } }),
    ]);

    const newUsers    = fillMonths(newUsersRaw, 'count');
    const monthlyActive = MONTHS.map((label, i) => {
        const found = monthlyActiveRaw.find(d => d.month === i + 1);
        return { month: label, count: found?.count || 0 };
    });

    res.json({
        newUsers, monthlyActive, totalCustomers,
        active30: a30.length, active60: a60.length, active90: a90.length,
        churnRate: totalCustomers > 0 ? +((1 - a30.length / totalCustomers) * 100).toFixed(1) : 0,
        year,
    });
});

// ── 6. Inventory Utilization  GET /api/reports/inventory-utilization ──────────
const getInventoryReport = asyncHandler(async (req, res) => {
    const [products, activeRentals, totalRentalsRaw] = await Promise.all([
        Product.find({ isActive: true }).select('name stock category').lean(),
        Rental.find({ status: { $in: ['Active', 'Shipped', 'Delivered', 'Approved'] } }).lean(),
        Rental.aggregate([
            { $unwind: '$orderItems' },
            { $group: { _id: '$orderItems.product', totalRented: { $sum: { $ifNull: ['$orderItems.qty', 1] } } } },
        ]),
    ]);

    const rentedNow  = {};
    for (const r of activeRentals)
        for (const item of r.orderItems)
            if (item.product) rentedNow[item.product.toString()] = (rentedNow[item.product.toString()] || 0) + (item.qty || 1);

    const totalMap = {};
    totalRentalsRaw.forEach(r => { if (r._id) totalMap[r._id.toString()] = r.totalRented; });

    const inventory = products.map(p => {
        const id            = p._id.toString();
        const currentRented = rentedNow[id] || 0;
        const totalStock    = p.stock + currentRented;
        const utilization   = totalStock > 0 ? Math.round((currentRented / totalStock) * 100) : 0;
        return { _id: id, name: p.name, category: p.category, stock: p.stock, currentRented, totalStock, utilization, totalRentals: totalMap[id] || 0 };
    }).sort((a, b) => b.utilization - a.utilization);

    const avg = inventory.length
        ? Math.round(inventory.reduce((s, i) => s + i.utilization, 0) / inventory.length)
        : 0;

    res.json({ inventory: inventory.slice(0, 20), avgUtilization: avg, totalProducts: products.length });
});

// ── 7. Cancellation Report  GET /api/reports/cancellations ────────────────────
const getCancellationReport = asyncHandler(async (req, res) => {
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const [monthlyRaw, monthlyTotalRaw, totals, lostRaw] = await Promise.all([
        Rental.aggregate([
            { $match: { status: 'Cancelled', createdAt: yearRange(year) } },
            { $group: { _id: { month: { $month: '$createdAt' } }, count: { $sum: 1 }, lostRevenue: { $sum: '$totalPrice' } } },
            { $sort: { '_id.month': 1 } },
        ]),
        Rental.aggregate([
            { $match: { createdAt: yearRange(year) } },
            { $group: { _id: { month: { $month: '$createdAt' } }, total: { $sum: 1 } } },
            { $sort: { '_id.month': 1 } },
        ]),
        Rental.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ]),
        Rental.aggregate([
            { $match: { status: 'Cancelled' } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } },
        ]),
    ]);

    const monthly = MONTHS.map((label, i) => {
        const c = monthlyRaw.find(d => d._id?.month === i + 1);
        const t = monthlyTotalRaw.find(d => d._id?.month === i + 1);
        return { month: label, cancelled: c?.count || 0, lostRevenue: c?.lostRevenue || 0, total: t?.total || 0 };
    });

    const totalCancelled = totals.find(s => s._id === 'Cancelled')?.count || 0;
    const totalOrders    = totals.reduce((s, t) => s + t.count, 0);

    res.json({
        monthly, totals, totalCancelled, totalOrders,
        cancellationRate: totalOrders > 0 ? +((totalCancelled / totalOrders) * 100).toFixed(1) : 0,
        lostRevenue: lostRaw[0]?.total || 0,
        year,
    });
});

// ── 8. Refund Report  GET /api/reports/refunds ────────────────────────────────
const getRefundReport = asyncHandler(async (req, res) => {
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const [monthlyRaw, refundTotals, allRevenue, topRefunded] = await Promise.all([
        Rental.aggregate([
            { $match: { isPaid: true, status: 'Cancelled', createdAt: yearRange(year) } },
            { $group: { _id: { month: { $month: '$createdAt' } }, amount: { $sum: '$totalPrice' }, count: { $sum: 1 } } },
            { $sort: { '_id.month': 1 } },
        ]),
        Rental.aggregate([
            { $match: { isPaid: true, status: 'Cancelled' } },
            { $group: { _id: null, totalAmount: { $sum: '$totalPrice' }, totalCount: { $sum: 1 } } },
        ]),
        Rental.aggregate([
            { $match: { isPaid: true } },
            { $group: { _id: null, total: { $sum: '$totalPrice' }, count: { $sum: 1 } } },
        ]),
        Rental.aggregate([
            { $match: { isPaid: true, status: 'Cancelled' } },
            { $unwind: '$orderItems' },
            { $lookup: { from: 'products', localField: 'orderItems.product', foreignField: '_id', as: 'prod' } },
            { $unwind: { path: '$prod', preserveNullAndEmptyArrays: true } },
            { $group: {
                _id: '$orderItems.product',
                name: { $first: { $ifNull: ['$prod.name', 'Unknown'] } },
                amount: { $sum: { $multiply: ['$orderItems.price', { $ifNull: ['$orderItems.qty', 1] }] } },
                count: { $sum: 1 },
            }},
            { $sort: { amount: -1 } },
            { $limit: 10 },
        ]),
    ]);

    const monthly = MONTHS.map((label, i) => {
        const found = monthlyRaw.find(d => d._id?.month === i + 1);
        return { month: label, amount: found?.amount || 0, count: found?.count || 0 };
    });

    const rt = refundTotals[0] || {};
    const ar = allRevenue[0] || {};

    res.json({
        monthly,
        totalRefunds: rt.totalAmount || 0,
        refundCount: rt.totalCount || 0,
        totalRevenue: ar.total || 0,
        paidOrders: ar.count || 0,
        refundRate: ar.count > 0 ? +((rt.totalCount / ar.count) * 100).toFixed(1) : 0,
        topRefunded: topRefunded.map(p => ({ name: p.name, amount: p.amount, count: p.count })),
        year,
    });
});

// ── 9. Vendor (Brand) Performance  GET /api/reports/vendors ───────────────────
const getVendorReport = asyncHandler(async (req, res) => {
    const [byBrand, topProducts] = await Promise.all([
        Rental.aggregate([
            { $match: { isPaid: true } },
            { $unwind: '$orderItems' },
            { $lookup: { from: 'products', localField: 'orderItems.product', foreignField: '_id', as: 'prod' } },
            { $unwind: { path: '$prod', preserveNullAndEmptyArrays: true } },
            { $group: {
                _id: { $ifNull: ['$prod.brand', 'Unbranded'] },
                revenue: { $sum: { $multiply: ['$orderItems.price', { $ifNull: ['$orderItems.qty', 1] }] } },
                orders: { $sum: 1 },
                items: { $sum: { $ifNull: ['$orderItems.qty', 1] } },
            }},
            { $sort: { revenue: -1 } },
            { $limit: 15 },
        ]),
        Rental.aggregate([
            { $match: { isPaid: true } },
            { $unwind: '$orderItems' },
            { $lookup: { from: 'products', localField: 'orderItems.product', foreignField: '_id', as: 'prod' } },
            { $unwind: { path: '$prod', preserveNullAndEmptyArrays: true } },
            { $group: {
                _id: '$orderItems.product',
                name: { $first: { $ifNull: ['$prod.name', 'Unknown'] } },
                brand: { $first: { $ifNull: ['$prod.brand', 'Unbranded'] } },
                category: { $first: { $ifNull: ['$prod.category', 'Uncategorized'] } },
                revenue: { $sum: { $multiply: ['$orderItems.price', { $ifNull: ['$orderItems.qty', 1] }] } },
                orders: { $sum: 1 },
            }},
            { $sort: { revenue: -1 } },
            { $limit: 10 },
        ]),
    ]);

    res.json({ byBrand, topProducts });
});

// ── 10. Location Analytics  GET /api/reports/location ─────────────────────────
const getLocationReport = asyncHandler(async (req, res) => {
    const [byCity, totals] = await Promise.all([
        Rental.aggregate([
            { $group: {
                _id: '$shippingAddress.city',
                orders: { $sum: 1 },
                revenue: { $sum: { $cond: ['$isPaid', '$totalPrice', 0] } },
                customers: { $addToSet: '$user' },
            }},
            { $project: { city: { $ifNull: ['$_id', 'Unknown'] }, orders: 1, revenue: 1, customers: { $size: '$customers' } } },
            { $sort: { revenue: -1 } },
            { $limit: 15 },
        ]),
        Rental.aggregate([
            { $group: {
                _id: null,
                cities: { $addToSet: '$shippingAddress.city' },
                totalOrders: { $sum: 1 },
                totalRevenue: { $sum: { $cond: ['$isPaid', '$totalPrice', 0] } },
            }},
            { $project: { citiesCount: { $size: '$cities' }, totalOrders: 1, totalRevenue: 1 } },
        ]),
    ]);

    res.json({ byCity, totals: totals[0] || {} });
});

module.exports = {
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
};
