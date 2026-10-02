const mongoose = require('mongoose');
const KYC = require('../models/KYC');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const { createNotification } = require('./notificationController');
const { sendTemplatedEmail } = require('../utils/sendTemplatedEmail');
const { requireCustomerTarget, requireUnchangedCustomer, assertCustomerActor } = require('../utils/customerAccess');
const { FIELDS, requireCustomer, uploadPrivateAsset, validateDocuments, ownedAsset, kycResponse, readPrivateAsset } = require('../services/kycAssets');

function reject(message, statusCode = 400) { const error = new Error(message); error.statusCode = statusCode; throw error; }
function fail(res, error) { return res.status(error.statusCode || (res.statusCode >= 400 ? res.statusCode : 503)).json({ message: error.statusCode ? error.message : 'KYC processing is unavailable. Please retry.' }); }
function details(value, reference = false) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) reject('Invalid KYC details');
    const allowed = reference ? ['name', 'relation', 'phone', 'address', 'city', 'state', 'pincode', 'country'] :
        ['name', 'fullName', 'dob', 'gender', 'email', 'phone', 'fatherName', 'fatherPhone', 'residenceStatus', 'address',
            'permanentAddress', 'currentAddress', 'city', 'state', 'pincode', 'country', 'idType', 'idNumber'];
    const result = {};
    for (const [key, valueAtKey] of Object.entries(value)) {
        if (!allowed.includes(key) || typeof valueAtKey !== 'string' || valueAtKey.length > 500) reject('Invalid KYC details');
        result[key] = valueAtKey.trim();
    }
    return result;
}
exports.getAllKYC = async (req, res) => {
    try {
        assertCustomerActor(req, res, ['kyc']);
        const records = await KYC.find({}).populate({ path: 'user', select: 'name email phone role', match: { role: 'customer' } });
        res.setHeader('Cache-Control', 'no-store, private');
        res.json(records.filter(record => record.user).map(kycResponse));
    } catch (error) { fail(res, error); }
};
exports.updateKYCStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['approved', 'rejected', 'pending'].includes(status)) reject('Invalid KYC status');
        const reason = req.body.rejectionReason ?? req.body.remarks ?? '';
        if (typeof reason !== 'string' || reason.length > 1000) reject('Invalid review notes');
        const record = await mongoose.connection.transaction(async session => {
            const kyc = await KYC.findById(req.params.id, null, { session });
            if (!kyc) reject('KYC record not found', 404);
            await requireCustomerTarget({ ...req, params: { id: kyc.user } }, res, ['kyc']);
            if (status === 'approved') {
                const expected = req.body.expectedUpdatedAt;
                if (typeof expected !== 'string' || !kyc.updatedAt ||
                    new Date(expected).getTime() !== new Date(kyc.updatedAt).getTime()) {
                    reject('This submission changed. Reload and review the current documents before approval.', 409);
                }
                const documents = kyc.documents?.toObject?.() || kyc.documents || {};
                if (!FIELDS.some(field => documents[field])) reject('Private verification documents are required for approval');
                await validateDocuments(documents, kyc.user, session);
            }
            const customer = requireUnchangedCustomer(await User.findOneAndUpdate({ _id: kyc.user, role: 'customer', isBlocked: { $ne: true }, isActive: { $ne: false } },
                { $set: { 'kyc.status': status, 'kyc.rejectionReason': status === 'rejected' ? reason : '' } },
                { new: true, runValidators: true, session }), res);
            kyc.status = status;
            kyc.rejectionReason = status === 'rejected' ? reason : '';
            kyc.remarks = reason;
            await kyc.save({ session });
            return { kyc, customer };
        });
        // Notify only the persisted account contact, after the decision transaction commits.
        if (record.customer.email && ['approved', 'rejected'].includes(status)) {
            try {
                // The legacy approved template invents an unassigned rental limit.
                // Send the confirmed decision without a financial eligibility claim.
                if (status === 'approved') await sendEmail({ email: record.customer.email,
                    subject: 'KYC approved', message: 'Your identity verification has been approved. You can continue with your rental.' });
                else await sendTemplatedEmail('KYC Rejected — Action Required', record.customer.email,
                    { CUSTOMER_NAME: record.customer.name || 'Customer', REJECTION_REASON: reason || 'Please resubmit clear, valid documents.' });
            } catch { /* delivery failures do not undo a committed review */ }
        }
        res.json({ message: `KYC ${status}`, kyc: kycResponse(record.kyc) });
    } catch (error) { fail(res, error); }
};
exports.createOrUpdateKYC = async (req, res) => {
    try {
        requireCustomer(req.user);
        const personal = req.body.personalDetails === undefined ? undefined : details(req.body.personalDetails);
        const reference = req.body.referenceDetails === undefined ? undefined : details(req.body.referenceDetails, true);
        const suppliedDocuments = req.body.documents === undefined ? {} : req.body.documents;
        await validateDocuments(suppliedDocuments, req.user._id);
        const result = await mongoose.connection.transaction(async session => {
            const ownedDocuments = await validateDocuments(suppliedDocuments, req.user._id, session);
            const previous = await KYC.findOne({ user: req.user._id }, null, { session });
            const previousValue = previous?.toObject?.() || previous || {};
            const identityChanged = personal !== undefined || FIELDS.some(field => Object.hasOwn(ownedDocuments, field));
            const status = previous?.status === 'approved' && !identityChanged ? 'approved' : 'pending';
            const update = { user: req.user._id, status, rejectionReason: '' };
            if (personal !== undefined) update.personalDetails = { ...previousValue.personalDetails, ...personal };
            if (reference !== undefined) update.referenceDetails = { ...previousValue.referenceDetails, ...reference };
            const retainedDocuments = { ...previousValue.documents };
            // New private uploads replace the legacy submission; never fetch or carry
            // obsolete public URLs into the next review. Files themselves are not deleted.
            if (FIELDS.some(field => Object.hasOwn(ownedDocuments, field))) {
                for (const field of FIELDS) if (retainedDocuments[field] && !/^[a-f\d]{24}$/i.test(retainedDocuments[field])) delete retainedDocuments[field];
            }
            update.documents = { ...retainedDocuments, ...ownedDocuments };
            requireUnchangedCustomer(await User.findOneAndUpdate({ _id: req.user._id, role: 'customer', isBlocked: { $ne: true }, isActive: { $ne: false } },
                { $set: { 'kyc.status': status, 'kyc.rejectionReason': '', 'kyc.submittedAt': new Date() } }, { new: true, runValidators: true, session }), res);
            const record = await KYC.findOneAndUpdate({ user: req.user._id }, { $set: update }, { new: true, upsert: true, runValidators: true, session });
            return { record, isNew: !previous, notify: !previous || previous.status === 'rejected' || identityChanged };
        });
        if (result.notify) {
            try { await createNotification({ title: 'KYC Submission', message: 'A customer identity submission is ready for review.', type: 'kyc', relatedId: result.record._id }); } catch { /* no identity details logged */ }
            try { await sendTemplatedEmail('KYC Submitted — Under Review', req.user.email, { CUSTOMER_NAME: req.user.name || 'Customer', SUBMITTED_DOCS: 'Documents submitted for verification.' }); } catch { /* stored submission remains successful */ }
        }
        res.status(result.isNew ? 201 : 200).json(kycResponse(result.record));
    } catch (error) { fail(res, error); }
};
exports.getKYCStatus = async (req, res) => {
    try {
        requireCustomer(req.user);
        const record = await KYC.findOne({ user: req.user._id });
        res.setHeader('Cache-Control', 'no-store, private');
        res.json(kycResponse(record));
    } catch (error) { fail(res, error); }
};
exports.uploadKYCDocuments = async (req, res) => {
    try {
        requireCustomer(req.user);
        if (!req.files || !Object.keys(req.files).length) reject('No files uploaded');
        const documents = {};
        for (const field of Object.keys(req.files)) documents[field] = await uploadPrivateAsset(req.user, field, req.files[field][0].buffer);
        res.json(documents);
    } catch (error) { fail(res, error); }
};
exports.downloadKYCDocument = async (req, res) => {
    try {
        assertCustomerActor(req, res, ['kyc']);
        const { id, field } = req.params;
        if (!FIELDS.includes(field) || !mongoose.Types.ObjectId.isValid(id)) reject('Invalid KYC document request');
        const record = await KYC.findById(id).populate('user', 'name role');
        if (!record) reject('KYC record not found', 404);
        if (record.user?.role !== 'customer') reject('Customer KYC access required', 403);
        const reference = record.documents?.[field];
        if (!reference) reject('Document not found', 404);
        if (!/^[a-f\d]{24}$/i.test(reference)) reject('This legacy document requires a private storage migration or re-upload', 409);
        const asset = await ownedAsset(reference, record.user?._id || record.user, field);
        const buffer = await readPrivateAsset(asset);
        res.setHeader('Content-Type', asset.contentType);
        res.setHeader('Content-Length', buffer.length);
        res.setHeader('Content-Disposition', `attachment; filename="kyc-${field}.${asset.extension}"`);
        res.setHeader('Cache-Control', 'no-store, private');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        return res.send(buffer);
    } catch (error) { fail(res, error); }
};
