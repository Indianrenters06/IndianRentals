const asyncHandler = require('express-async-handler');
const CMS = require('../models/CMS');

// @desc    Get homepage CMS content
// @route   GET /api/admin/cms/homepage
// @access  Public (so frontend can fetch it) / Admin can fetch it too
const getHomepageCMS = asyncHandler(async (req, res) => {
    let cms = await CMS.findOne({ pageName: 'homepage' });

    if (!cms) {
        cms = await CMS.create({ pageName: 'homepage' }); // default empty document
    }

    res.json(cms);
});

// @desc    Update homepage CMS
// @route   PUT /api/admin/cms/homepage
// @access  Private/Admin
const updateHomepageCMS = asyncHandler(async (req, res) => {
    let cms = await CMS.findOne({ pageName: 'homepage' });

    if (!cms) {
        cms = await CMS.create({ pageName: 'homepage' });
    }

    // Update fields
    const fields = ['heroEnabled', 'heroTitle', 'heroSubtitle', 'heroImage', 'overlayColor', 'pageContent', 'publishStatus', 'scheduledPublishTime'];
    fields.forEach(field => {
        if (req.body[field] !== undefined) {
            cms[field] = req.body[field];
        }
    });

    const updatedCMS = await cms.save();
    res.json(updatedCMS);
});

module.exports = {
    getHomepageCMS,
    updateHomepageCMS,
};
