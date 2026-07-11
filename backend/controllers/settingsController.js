const asyncHandler = require('express-async-handler');
const axios = require('axios');
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
        currency, timezone,
        navbarAnnouncements, navbarLinks, footerDescription, socialLinks, footerQuickLinks,
        footerColumns, footerCopyright, paymentLogos,
        maintenanceMode, allowRegistrations, requireKYC,
        paymentGatewaySecret, theme,
        robotsTxt, llmsTxt, serviceablePincodes
    } = req.body;

    if (siteName !== undefined) settings.siteName = siteName;
    if (siteLogo !== undefined) settings.siteLogo = siteLogo;
    if (contactEmail !== undefined) settings.contactEmail = contactEmail;
    if (contactPhone !== undefined) settings.contactPhone = contactPhone;
    if (address !== undefined) settings.address = address;
    if (currency !== undefined) settings.currency = currency;
    if (timezone !== undefined) settings.timezone = timezone;
    if (maintenanceMode !== undefined) settings.maintenanceMode = maintenanceMode;
    if (allowRegistrations !== undefined) settings.allowRegistrations = allowRegistrations;
    if (requireKYC !== undefined) settings.requireKYC = requireKYC;
    if (paymentGatewaySecret !== undefined) settings.paymentGatewaySecret = paymentGatewaySecret;
    if (theme !== undefined) settings.theme = theme;
    if (robotsTxt !== undefined) settings.robotsTxt = robotsTxt;
    if (llmsTxt !== undefined) settings.llmsTxt = llmsTxt;
    if (serviceablePincodes !== undefined) {
        settings.serviceablePincodes = Array.isArray(serviceablePincodes)
            ? serviceablePincodes.map((p) => String(p).trim()).filter(Boolean)
            : [];
    }

    if (navbarAnnouncements !== undefined) settings.navbarAnnouncements = navbarAnnouncements;
    if (navbarLinks !== undefined) settings.navbarLinks = navbarLinks;
    if (footerDescription !== undefined) settings.footerDescription = footerDescription;
    if (socialLinks !== undefined) settings.socialLinks = { ...settings.socialLinks, ...socialLinks };
    if (footerQuickLinks !== undefined) settings.footerQuickLinks = footerQuickLinks;
    if (footerColumns !== undefined) settings.footerColumns = footerColumns;
    if (footerCopyright !== undefined) settings.footerCopyright = footerCopyright;
    if (paymentLogos !== undefined) settings.paymentLogos = paymentLogos;

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
});

// @desc    Check delivery serviceability for a pincode
// @route   GET /api/settings/serviceability/:pincode
// @access  Public
const checkServiceability = asyncHandler(async (req, res) => {
    const pincode = String(req.params.pincode || '').trim();

    // Indian PIN codes are 6 digits and never start with 0.
    if (!/^[1-9][0-9]{5}$/.test(pincode)) {
        return res.status(400).json({
            serviceable: false,
            pincode,
            message: 'Please enter a valid 6-digit pincode.',
        });
    }

    const settings = await Settings.findOne();
    const allowList = (settings?.serviceablePincodes || [])
        .map((p) => String(p).trim())
        .filter(Boolean);

    // Best-effort: resolve the real location via India Post's free public API.
    // Used to show the state/district and to reject non-existent pincodes.
    let state = null;
    let district = null;
    let existsInIndia = null; // true | false | null (lookup unavailable)
    try {
        const { data } = await axios.get(
            `https://api.postalpincode.in/pincode/${pincode}`,
            { timeout: 5000 }
        );
        const entry = Array.isArray(data) ? data[0] : null;
        if (entry && entry.Status === 'Success' && entry.PostOffice?.length) {
            existsInIndia = true;
            state = entry.PostOffice[0].State || null;
            district = entry.PostOffice[0].District || null;
        } else if (entry && entry.Status === 'Error') {
            existsInIndia = false;
        }
    } catch (e) {
        existsInIndia = null; // fall back to format-only validation
    }

    if (existsInIndia === false) {
        return res.json({
            serviceable: false,
            pincode,
            message: 'This pincode does not exist. Please recheck.',
        });
    }

    // Serviceable decision:
    // - If an allow-list is configured, match exact pincode or a shorter prefix.
    // - Otherwise, serve any valid/real Indian pincode.
    let serviceable;
    if (allowList.length > 0) {
        serviceable = allowList.some(
            (p) => p === pincode || (p.length < 6 && pincode.startsWith(p))
        );
    } else {
        serviceable = existsInIndia !== false;
    }

    const place = [district, state].filter(Boolean).join(', ');
    return res.json({
        serviceable,
        pincode,
        state,
        district,
        message: serviceable
            ? `Delivery available${place ? ` in ${place}` : ''}.`
            : `Sorry, we don't deliver to ${state || 'this area'} yet.`,
    });
});

module.exports = {
    getSettings,
    updateSettings,
    checkServiceability,
};
