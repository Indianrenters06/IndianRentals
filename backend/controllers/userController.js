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

module.exports = {
    getUserProfile,
    submitKYC,
    getAllUsers,
    updateKYCStatus,
    getUserById,
    deleteUser,
    updateUser,
};
