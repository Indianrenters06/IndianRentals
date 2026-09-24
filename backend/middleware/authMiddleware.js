const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const FULL_ACCESS_ROLES = ['admin', 'super_admin'];

const protect = asyncHandler(async (req, res, next) => {
    let token;

    token = req.cookies.jwt;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
        } catch (error) {
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
        // Token is valid but the account was deleted since it was issued.
        if (!req.user) {
            res.status(401);
            throw new Error('Not authorized, user not found');
        }
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

// Admin OR staff member (anyone with dashboard access)
const admin = (req, res, next) => {
    const adminRoles = ['admin', 'super_admin', 'staff', 'operations_manager', 'sales_executive', 'finance_executive'];
    if (req.user && adminRoles.includes(req.user.role)) {
        next();
    } else {
        res.status(403);
        throw new Error('Not authorized as an admin');
    }
};

// Only 'admin' and 'super_admin' — for team, roles and role changes, which
// would otherwise let a staff member grant themselves more access.
const fullAdmin = (req, res, next) => {
    if (req.user && FULL_ACCESS_ROLES.includes(req.user.role)) return next();
    res.status(403);
    throw new Error('Only an Admin can perform this action');
};

// Admin OR staff holding ANY of the given section permissions,
// e.g. hasPermission('orders', 'payments').
const hasPermission = (...sections) => (req, res, next) => {
    if (!req.user) {
        res.status(401);
        throw new Error('Not authorized');
    }
    if (FULL_ACCESS_ROLES.includes(req.user.role)) return next(); // superadmin/admin always passes
    const staffRoles = ['staff', 'operations_manager', 'sales_executive', 'finance_executive'];
    if (
        staffRoles.includes(req.user.role) &&
        Array.isArray(req.user.adminPermissions) &&
        sections.some((section) => req.user.adminPermissions.includes(section))
    ) {
        return next();
    }
    res.status(403);
    throw new Error(`Not authorized to access "${sections.join('" / "')}" section`);
};

module.exports = { protect, admin, fullAdmin, hasPermission };
