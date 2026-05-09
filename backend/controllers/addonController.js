const asyncHandler = require('express-async-handler');
const Addon = require('../models/Addon');

// @desc    Get all addons
// @route   GET /api/addons
// @access  Public
const getAddons = asyncHandler(async (req, res) => {
    const addons = await Addon.find({}).sort({ createdAt: -1 });
    res.json(addons);
});

// @desc    Create an addon
// @route   POST /api/addons
// @access  Private/Admin
const createAddon = asyncHandler(async (req, res) => {
    const { name, description, price, category, stock, isConditional, conditionRule } = req.body;

    const addon = await Addon.create({
        name,
        description,
        price,
        category,
        stock: stock || 'Unlimited',
        isConditional: isConditional || false,
        conditionRule: conditionRule || ''
    });

    res.status(201).json(addon);
});

// @desc    Update an addon
// @route   PUT /api/addons/:id
// @access  Private/Admin
const updateAddon = asyncHandler(async (req, res) => {
    const addon = await Addon.findById(req.params.id);

    if (!addon) {
        res.status(404);
        throw new Error('Addon not found');
    }

    const updatedAddon = await Addon.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    res.json(updatedAddon);
});

// @desc    Delete an addon
// @route   DELETE /api/addons/:id
// @access  Private/Admin
const deleteAddon = asyncHandler(async (req, res) => {
    const addon = await Addon.findById(req.params.id);

    if (!addon) {
        res.status(404);
        throw new Error('Addon not found');
    }

    await Addon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Addon removed' });
});

module.exports = {
    getAddons,
    createAddon,
    updateAddon,
    deleteAddon
};
