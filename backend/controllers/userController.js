const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                kyc: user.kyc
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Submit KYC documents
// @route   POST /api/users/kyc
// @access  Private
const submitKYC = async (req, res) => {
    try {
        const { documentType, documentNumber, documentImage } = req.body;
        const user = await User.findById(req.user._id);

        if (user) {
            user.kyc = {
                status: 'pending',
                documentType,
                documentNumber,
                documentImage,
                submittedAt: Date.now()
            };

            const updatedUser = await user.save();
            res.json({
                message: 'KYC Submitted Successfully',
                kyc: updatedUser.kyc
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update KYC Status (Admin)
// @route   PUT /api/users/:id/kyc
// @access  Private/Admin
const updateKYCStatus = async (req, res) => {
    try {
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
                kyc: updatedUser.kyc
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getUserProfile,
    submitKYC,
    getAllUsers,
    updateKYCStatus
};
