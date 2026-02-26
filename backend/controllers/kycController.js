const KYC = require('../models/KYC');
const User = require('../models/User');
const { createNotification } = require('./notificationController');

// @desc    Get All KYC Requests (Admin)
// @route   GET /api/kyc/admin/all
// @access  Private/Admin
exports.getAllKYC = async (req, res) => {
    try {
        const kycList = await KYC.find({}).populate('user', 'name email phone');
        res.status(200).json(kycList);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update KYC Status (Admin)
// @route   PUT /api/kyc/admin/:id
// @access  Private/Admin
exports.updateKYCStatus = async (req, res) => {
    try {
        const { status, rejectionReason } = req.body;

        // Find KYC record
        const kyc = await KYC.findById(req.params.id);
        if (!kyc) {
            return res.status(404).json({ message: 'KYC record not found' });
        }

        // Update KYC record
        kyc.status = status;
        if (status === 'rejected') {
            kyc.rejectionReason = rejectionReason;
        }
        await kyc.save();

        // SYNC: Update User model status
        const user = await User.findById(kyc.user);
        if (user) {
            user.kyc.status = status;
            if (status === 'rejected') {
                user.kyc.rejectionReason = rejectionReason;
            }
            await user.save();
        }

        res.status(200).json({ message: `KYC ${status}`, kyc });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create or Update KYC
// @route   POST /api/kyc
// @access  Private
exports.createOrUpdateKYC = async (req, res) => {
    try {
        const { personalDetails, companyDetails, referenceDetails } = req.body;

        const kycFields = {
            user: req.user._id,
            personalDetails,
            companyDetails,
            referenceDetails,
            status: 'pending'
        };

        // Check if KYC exists
        let kyc = await KYC.findOne({ user: req.user._id });

        if (kyc) {
            // Update
            kyc = await KYC.findOneAndUpdate(
                { user: req.user._id },
                { $set: kycFields },
                { new: true }
            );
            return res.status(200).json(kyc);
        }

        // Create
        kyc = new KYC(kycFields);
        await kyc.save();

        await createNotification({
            title: 'New KYC Submission',
            message: `User ${req.user.name} submitted their KYC details for review.`,
            type: 'kyc',
            relatedId: kyc._id
        });

        res.status(201).json(kyc);

    } catch (err) {
        console.error('KYC Create Error:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// @desc    Get KYC Status
// @route   GET /api/kyc
// @access  Private
exports.getKYCStatus = async (req, res) => {
    try {
        const kyc = await KYC.findOne({ user: req.user._id });
        if (!kyc) {
            return res.status(404).json({ message: 'KYC not found' });
        }
        res.status(200).json(kyc);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Upload KYC Documents
// @route   POST /api/kyc/upload
// @access  Private
exports.uploadKYCDocuments = async (req, res) => {
    try {
        console.log('Files:', req.files);

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const documents = {};
        Object.keys(req.files).forEach(key => {
            // Assuming multer stores file path in req.files[key][0].path
            // If using Cloudinary, it might be .path or .secure_url
            // For disk storage:
            documents[key] = req.files[key][0].path;
        });

        let kyc = await KYC.findOne({ user: req.user._id });

        if (kyc) {
            // Merge existing documents with new ones
            const newDocs = { ...kyc.documents, ...documents };
            kyc = await KYC.findOneAndUpdate(
                { user: req.user._id },
                { $set: { documents: newDocs } },
                { new: true }
            );
        } else {
            kyc = new KYC({
                user: req.user._id,
                documents,
                status: 'pending' // Just uploading docs, maybe details missing
            });
            await kyc.save();

            await createNotification({
                title: 'New KYC Documents',
                message: `User ${req.user.name} uploaded new KYC documents.`,
                type: 'kyc',
                relatedId: kyc._id
            });
        }

        res.status(200).json(kyc);

    } catch (err) {
        console.error('KYC Upload Error:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};
