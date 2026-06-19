const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            kyc: user.kyc,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update own profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        const updated = await user.save();
        res.json({
            _id: updated._id,
            name: updated.name,
            email: updated.email,
            phone: updated.phone,
            role: updated.role,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Submit KYC documents
// @route   POST /api/users/kyc
// @access  Private
const submitKYC = asyncHandler(async (req, res) => {
    const { documentType, documentNumber, documentImage } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
        user.kyc = {
            status: 'pending',
            documentType,
            documentNumber,
            documentImage,
            submittedAt: Date.now(),
        };

        const updatedUser = await user.save();
        res.json({
            message: 'KYC Submitted Successfully',
            kyc: updatedUser.kyc,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

// @desc    Update KYC Status (Admin)
// @route   PUT /api/users/:id/kyc
// @access  Private/Admin
const updateKYCStatus = asyncHandler(async (req, res) => {
    const { status, rejectionReason } = req.body;
    const user = await User.findById(req.params.id);

    if (user) {
        user.kyc.status = status;
        if (status === 'rejected' && rejectionReason) {
            user.kyc.rejectionReason = rejectionReason;
        }

        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            kyc: updatedUser.kyc,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role; // Admin can update role

        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await user.deleteOne();
        res.json({ message: 'User removed' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// Allowed address fields a client may set (whitelist to avoid mass-assignment)
const ADDRESS_FIELDS = ['name', 'addressLine', 'city', 'state', 'pincode', 'country', 'phone', 'isBillingSame'];

const pickAddressFields = (body = {}) => {
    const data = {};
    ADDRESS_FIELDS.forEach((field) => {
        if (body[field] !== undefined) data[field] = body[field];
    });
    return data;
};

// @desc    Get current user's saved addresses
// @route   GET /api/users/addresses
// @access  Private
const getAddresses = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('addresses');
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    res.json(user.addresses);
});

// @desc    Add a new address
// @route   POST /api/users/addresses
// @access  Private
const addAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    const newAddress = pickAddressFields(req.body);
    // First address (or an explicit request) becomes the default.
    newAddress.isDefault = user.addresses.length === 0 || req.body.isDefault === true;

    if (newAddress.isDefault) {
        user.addresses.forEach((addr) => { addr.isDefault = false; });
    }

    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json(user.addresses);
});

// @desc    Update an existing address
// @route   PUT /api/users/addresses/:addressId
// @access  Private
const updateAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    const address = user.addresses.id(req.params.addressId);
    if (!address) {
        res.status(404);
        throw new Error('Address not found');
    }

    Object.assign(address, pickAddressFields(req.body));

    if (req.body.isDefault === true) {
        user.addresses.forEach((addr) => { addr.isDefault = false; });
        address.isDefault = true;
    }

    await user.save();
    res.json(user.addresses);
});

// @desc    Delete an address
// @route   DELETE /api/users/addresses/:addressId
// @access  Private
const deleteAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    const address = user.addresses.id(req.params.addressId);
    if (!address) {
        res.status(404);
        throw new Error('Address not found');
    }

    const wasDefault = address.isDefault;
    address.deleteOne();

    // If we removed the default, promote the first remaining address.
    if (wasDefault && user.addresses.length > 0) {
        user.addresses[0].isDefault = true;
    }

    await user.save();
    res.json(user.addresses);
});

module.exports = {
    getUserProfile,
    updateUserProfile,
    submitKYC,
    getAllUsers,
    updateKYCStatus,
    getUserById,
    deleteUser,
    updateUser,
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
};
