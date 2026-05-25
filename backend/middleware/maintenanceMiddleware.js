const asyncHandler = require('express-async-handler');
const Settings = require('../models/Settings');

const checkMaintenanceMode = asyncHandler(async (req, res, next) => {
    // Exempt routes that need to be accessible during maintenance
    const exemptRoutes = [
        '/api/health',
        '/api/admin',
        '/api/auth/admin-login', // Admin login (kebab-case route)
        '/api/auth/adminLogin',  // legacy alias — keep for safety
        '/api/settings'          // public settings (frontend needs to detect maintenance)
    ];

    const isExempt = exemptRoutes.some(route => req.path.startsWith(route));

    if (isExempt) {
        return next();
    }

    const settings = await Settings.findOne();

    if (settings && settings.maintenanceMode) {
        return res.status(503).json({
            success: false,
            message: 'Platform is currently under maintenance. Please try again later.'
        });
    }

    next();
});

module.exports = { checkMaintenanceMode };
