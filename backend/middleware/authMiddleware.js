const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

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
            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    } else {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

// Full admin only
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403);
        throw new Error('Not authorized as an admin');
    }
};

// Admin OR staff with the right permission
const hasPermission = (section) => (req, res, next) => {
    if (!req.user) {
        res.status(401);
        throw new Error('Not authorized');
    }
    if (req.user.role === 'admin') return next(); // superadmin always passes
    if (
        req.user.role === 'staff' &&
        Array.isArray(req.user.adminPermissions) &&
        req.user.adminPermissions.includes(section)
    ) {
        return next();
    }
    res.status(403);
    throw new Error(`Not authorized to access "${section}" section`);
};

module.exports = { protect, admin, hasPermission };
