const KYC = require('../models/KYC');
const User = require('../models/User');
const { createNotification } = require('./notificationController');
const { uploadToCloudinary } = require('../middleware/uploadMiddleware');
const { sendTemplatedEmail } = require('../utils/sendTemplatedEmail');

// Map raw document keys to friendly labels for the KYC email
const DOC_LABELS = {
    identityProof: 'Identity Proof',
    addressProof: 'Address Proof',
    bankStatement: 'Bank Statement',
    aadhaar: 'Aadhaar Card',
    pan: 'PAN Card',
    photo: 'Photograph',
};

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

        const kyc = await KYC.findById(req.params.id);
        if (!kyc) {
            return res.status(404).json({ message: 'KYC record not found' });
        }

        kyc.status = status;
        if (status === 'rejected') {
            kyc.rejectionReason = rejectionReason;
        }
        await kyc.save();

        // Sync status to User model
        const user = await User.findById(kyc.user);
        if (user) {
            user.kyc = user.kyc || {};
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

// @desc    Create or Update KYC (personal/company/reference details)
// @route   POST /api/kyc
// @access  Private
exports.createOrUpdateKYC = async (req, res) => {
    try {
        const { personalDetails, companyDetails, referenceDetails, documents } = req.body;

        const kycFields = {
            user: req.user._id,
            status: 'pending',
        };

        if (personalDetails) kycFields.personalDetails = personalDetails;
        if (companyDetails && Object.keys(companyDetails).length > 0) kycFields.companyDetails = companyDetails;
        if (referenceDetails && Object.keys(referenceDetails).length > 0) kycFields.referenceDetails = referenceDetails;
        if (documents && Object.keys(documents).length > 0) kycFields.documents = documents;

        let kyc = await KYC.findOne({ user: req.user._id });
        const isNew = !kyc;
        const wasRejected = kyc?.status === 'rejected';

        if (kyc) {
            // Merge new document URLs on top of existing ones
            if (documents) {
                const existingDocs = kyc.documents?.toObject?.() ?? kyc.documents ?? {};
                kycFields.documents = { ...existingDocs, ...documents };
            }
            kyc = await KYC.findOneAndUpdate(
                { user: req.user._id },
                { $set: kycFields },
                { new: true }
            );
        } else {
            kyc = new KYC(kycFields);
            await kyc.save();
        }

        // Fire admin notification on first submission OR after a rejection re-submit
        if (isNew || wasRejected) {
            await createNotification({
                title: isNew ? 'New KYC Submission' : 'KYC Re-submitted',
                message: isNew
                    ? `User ${req.user.name} submitted their KYC for review.`
                    : `User ${req.user.name} has re-submitted their KYC after rejection.`,
                type: 'kyc',
                relatedId: kyc._id
            });

            // Confirm receipt to the customer (non-blocking).
            const docKeys = Object.keys(kyc.documents?.toObject?.() ?? kyc.documents ?? {})
                .filter(k => (kyc.documents?.[k]));
            const docList = docKeys.length
                ? `Other documents received: ${docKeys.map(k => DOC_LABELS[k] || k).join(', ')}.`
                : '';
            sendTemplatedEmail('KYC Submitted — Under Review', req.user.email, {
                CUSTOMER_NAME: req.user.name || 'Customer',
                SUBMITTED_DOCS: docList,
            });
        }

        res.status(isNew ? 201 : 200).json(kyc);

    } catch (err) {
        console.error('KYC Create Error:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// @desc    Get KYC Status for logged-in user
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

// @desc    Upload KYC Documents to Cloudinary — returns URLs only, does NOT write to DB
// @route   POST /api/kyc/upload
// @access  Private
exports.uploadKYCDocuments = async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        // Upload each file buffer to Cloudinary in parallel
        const uploadPromises = Object.keys(req.files).map(async (fieldName) => {
            const file = req.files[fieldName][0];
            const url = await uploadToCloudinary(file.buffer, fieldName);
            return { fieldName, url };
        });

        const results = await Promise.all(uploadPromises);

        // Return a map of { fieldName: cloudinaryUrl } to the frontend
        // The frontend passes these URLs to saveKYCData, which is the single
        // entry point that persists data and fires admin notifications.
        const documents = {};
        results.forEach(({ fieldName, url }) => {
            documents[fieldName] = url;
        });

        res.status(200).json(documents);

    } catch (err) {
        console.error('KYC Upload Error:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};
