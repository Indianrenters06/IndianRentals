const asyncHandler = require('express-async-handler');
const Settings = require('../models/Settings');

// @desc    Get site settings
// @route   GET /api/admin/settings
// @access  Private/Admin
const getSettings = asyncHandler(async (req, res) => {
    let settings = await Settings.findOne();

    if (!settings) {
        settings = await Settings.create({}); // default config
    }

    res.json(settings);
});

// @desc    Update site settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
const updateSettings = asyncHandler(async (req, res) => {
    let settings = await Settings.findOne();

    if (!settings) {
        settings = await Settings.create({});
    }

    const {
        siteName, siteLogo, contactEmail, contactPhone, address,
        navbarAnnouncements, navbarLinks, footerDescription, socialLinks, footerQuickLinks,
        maintenanceMode, allowRegistrations, requireKYC,
        paymentGatewaySecret, gstConfig, deliveryCharges, lateFeeRules
    } = req.body;

    if (siteName !== undefined) settings.siteName = siteName;
    if (siteLogo !== undefined) settings.siteLogo = siteLogo;
    if (contactEmail !== undefined) settings.contactEmail = contactEmail;
    if (contactPhone !== undefined) settings.contactPhone = contactPhone;
    if (address !== undefined) settings.address = address;
    if (maintenanceMode !== undefined) settings.maintenanceMode = maintenanceMode;
    if (allowRegistrations !== undefined) settings.allowRegistrations = allowRegistrations;
    if (requireKYC !== undefined) settings.requireKYC = requireKYC;
    if (paymentGatewaySecret !== undefined) settings.paymentGatewaySecret = paymentGatewaySecret;
    if (gstConfig !== undefined) settings.gstConfig = { ...settings.gstConfig, ...gstConfig };
    if (deliveryCharges !== undefined) settings.deliveryCharges = { ...settings.deliveryCharges, ...deliveryCharges };
    if (lateFeeRules !== undefined) settings.lateFeeRules = { ...settings.lateFeeRules, ...lateFeeRules };

    if (navbarAnnouncements !== undefined) settings.navbarAnnouncements = navbarAnnouncements;
    if (navbarLinks !== undefined) settings.navbarLinks = navbarLinks;
    if (footerDescription !== undefined) settings.footerDescription = footerDescription;
    if (socialLinks !== undefined) settings.socialLinks = { ...settings.socialLinks, ...socialLinks };
    if (footerQuickLinks !== undefined) settings.footerQuickLinks = footerQuickLinks;

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
});

module.exports = {
    getSettings,
    updateSettings,
};
