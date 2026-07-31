const mongoose = require('mongoose');
const KYC = require('../models/KYC');
const User = require('../models/User');
const { createNotification } = require('./notificationController');
const { uploadToCloudinary, cloudinary } = require('../middleware/uploadMiddleware');
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

// @desc    Create or Update KYC (personal/reference details)
// @route   POST /api/kyc
// @access  Private
exports.createOrUpdateKYC = async (req, res) => {
    try {
        const { personalDetails, referenceDetails, documents } = req.body;

        const kycFields = {
            user: req.user._id,
        };

        if (personalDetails) kycFields.personalDetails = personalDetails;
        if (referenceDetails && Object.keys(referenceDetails).length > 0) kycFields.referenceDetails = referenceDetails;
        if (documents && Object.keys(documents).length > 0) kycFields.documents = documents;

        let kyc = await KYC.findOne({ user: req.user._id });
        const isNew = !kyc;
        const wasRejected = kyc?.status === 'rejected';
        const wasApproved = kyc?.status === 'approved';

        // Approved customers still submit documents on every order (a fresh bank
        // statement each time), so a re-submission must not push them back into
        // the review queue — that would show "Verification In Progress" to a
        // customer who is already verified. Everything else (first submission,
        // or a re-submit after rejection) does go back to pending.
        kycFields.status = wasApproved ? 'approved' : 'pending';

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

        // Tell the admin about a first submission, a re-submit after rejection,
        // or fresh paperwork from an already-verified customer.
        if (isNew || wasRejected || wasApproved) {
            let title = 'New KYC Submission';
            let message = `User ${req.user.name} submitted their KYC for review.`;
            if (wasRejected) {
                title = 'KYC Re-submitted';
                message = `User ${req.user.name} has re-submitted their KYC after rejection.`;
            } else if (wasApproved) {
                title = 'New KYC Documents';
                message = `Verified user ${req.user.name} uploaded new documents for a new order.`;
            }

            await createNotification({ title, message, type: 'kyc', relatedId: kyc._id });

            // Confirm receipt to the customer (non-blocking). Skipped for approved
            // customers — they are not "under review", so that email would be wrong.
            if (!wasApproved) {
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

// ── Admin document download ─────────────────────────────────────────────────
// KYC documents are identity papers. Storing them on public Cloudinary URLs
// means anyone holding the link can read a customer's ID without logging in,
// and PDFs additionally 401 because Cloudinary disables PDF/ZIP delivery by
// default ("deny or ACL failure").
//
// The fetch therefore goes through cloudinary's authenticated download endpoint
// (api.cloudinary.com/.../download) rather than the delivery CDN. Verified
// against the live account: the CDN returns 401 for PDFs even with sign_url,
// while the download endpoint returns the file. Images work either way, so the
// same path is used for everything and the plain URL is only a fallback.

// Only real file fields — the *Type entries are text labels, not documents.
const DOWNLOADABLE_FIELDS = [
    'identityProof', 'addressProof', 'bankStatement',
    'aadharFront', 'aadharBack', 'panCard', 'photo',
];

// Turn a stored secure_url back into the parts Cloudinary needs to re-sign it.
// Anything before the version segment is a transformation and is dropped.
const parseCloudinaryUrl = (url) => {
    const afterUpload = String(url).split('/upload/')[1];
    if (!afterUpload) return null;

    const resourceType = (/\/(image|video|raw)\/upload\//.exec(url) || [, 'image'])[1];
    const segments = afterUpload.split('/');
    const versionIndex = segments.findIndex((s) => /^v\d+$/.test(s));
    const pathSegments = versionIndex === -1 ? segments : segments.slice(versionIndex + 1);

    const joined = decodeURIComponent(pathSegments.join('/'));
    const dot = joined.lastIndexOf('.');
    return {
        resourceType,
        publicId: dot > -1 ? joined.slice(0, dot) : joined,
        format: dot > -1 ? joined.slice(dot + 1).toLowerCase() : '',
    };
};

// @desc    Download a single KYC document (admin only)
// @route   GET /api/kyc/admin/:id/document/:field
// @access  Private/Admin
exports.downloadKYCDocument = async (req, res) => {
    try {
        const { id, field } = req.params;

        if (!DOWNLOADABLE_FIELDS.includes(field)) {
            return res.status(400).json({ message: 'Unknown document field' });
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid KYC id' });
        }

        const kyc = await KYC.findById(id).populate('user', 'name');
        if (!kyc) {
            return res.status(404).json({ message: 'KYC record not found' });
        }

        const storedUrl = kyc.documents?.[field];
        if (!storedUrl || !String(storedUrl).startsWith('http')) {
            return res.status(404).json({ message: 'That document has not been uploaded' });
        }

        const parsed = parseCloudinaryUrl(storedUrl);

        let upstream;
        if (parsed) {
            const downloadUrl = cloudinary.utils.private_download_url(
                parsed.publicId,
                parsed.format,
                { resource_type: parsed.resourceType, type: 'upload' }
            );
            upstream = await fetch(downloadUrl);
        }
        // Only reachable if the URL could not be parsed or the API host failed.
        if (!upstream || !upstream.ok) {
            upstream = await fetch(storedUrl);
        }

        if (!upstream.ok) {
            console.error(`KYC document fetch failed (${upstream.status}) for ${field} on ${id}`);
            return res.status(502).json({
                message: `Could not retrieve the document from storage (${upstream.status}).`,
            });
        }

        const safeName = String(kyc.user?.name || 'customer')
            .replace(/[^a-z0-9]+/gi, '-')
            .replace(/^-|-$/g, '')
            .toLowerCase() || 'customer';
        const extension = parsed?.format || 'bin';
        const filename = `kyc-${safeName}-${field}.${extension}`;

        const buffer = Buffer.from(await upstream.arrayBuffer());
        res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/octet-stream');
        res.setHeader('Content-Length', buffer.length);
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        // Identity documents must never sit in a shared or browser cache.
        res.setHeader('Cache-Control', 'no-store, private');
        return res.send(buffer);

    } catch (err) {
        console.error('KYC Document Download Error:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};
