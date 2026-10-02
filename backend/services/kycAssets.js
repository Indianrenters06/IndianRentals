const { randomUUID } = require('node:crypto');
const streamifier = require('streamifier');
const KYCAsset = require('../models/KYCAsset');
const { cloudinary } = require('../middleware/uploadMiddleware');
const FIELDS = ['identityProof', 'addressProof', 'bankStatement', 'aadharFront', 'aadharBack', 'panCard', 'photo'];
const LABELS = ['identityProofType', 'addressProofType'];
const MAX_BYTES = 10 * 1024 * 1024;
function reject(message, statusCode = 400) { const error = new Error(message); error.statusCode = statusCode; throw error; }
function isAssetId(value) { return typeof value === 'string' && /^[a-f\d]{24}$/i.test(value); }
function requireCustomer(user) { if (user?.role !== 'customer') reject('Customer KYC access required', 403); }

// Inspect bytes rather than trusting a filename or caller Content-Type.
function fileType(buffer) {
    if (!Buffer.isBuffer(buffer) || !buffer.length || buffer.length > MAX_BYTES) reject('Document exceeds the upload limit');
    if (buffer.subarray(0, 5).toString() === '%PDF-') return { extension: 'pdf', contentType: 'application/pdf' };
    if (buffer.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return { extension: 'png', contentType: 'image/png' };
    if (buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255) return { extension: 'jpg', contentType: 'image/jpeg' };
    reject('Use a JPG, PNG or PDF document');
}
async function uploadPrivateAsset(user, field, buffer) {
    requireCustomer(user);
    if (!FIELDS.includes(field)) reject('Unknown document field');
    const type = fileType(buffer);
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) reject('Private document storage is not configured', 503);
    const publicId = `indian-rentals/kyc-private/${randomUUID()}.${type.extension}`;
    const result = await new Promise((resolve, rejectUpload) => {
        const stream = cloudinary.uploader.upload_stream({ public_id: publicId, resource_type: 'raw', type: 'authenticated',
            overwrite: false, timeout: 20000 }, (error, asset) => error ? rejectUpload(error) : resolve(asset));
        stream.on('error', rejectUpload);
        streamifier.createReadStream(buffer).pipe(stream);
    });
    if (result?.type !== 'authenticated' || result.resource_type !== 'raw' || result.public_id !== publicId || result.bytes !== buffer.length) reject('Private document storage could not be verified', 502);
    try {
        const stored = await KYCAsset.create({ user: user._id, field, publicId, resourceType: 'raw', deliveryType: 'authenticated',
            ...type, bytes: buffer.length });
        return String(stored._id);
    } catch (error) {
        // An unreferenced private upload must not be deliberately made public.
        // Cleanup is best effort; orphan retention is documented for operators.
        try { await cloudinary.uploader.destroy(publicId, { resource_type: 'raw', type: 'authenticated' }); } catch { /* no sensitive payload logging */ }
        throw error;
    }
}
async function ownedAsset(id, user, field, session) {
    if (!isAssetId(id)) reject('Re-upload this document using the private upload form');
    const asset = await KYCAsset.findOne({ _id: id, user, field }, null, session ? { session } : {});
    if (!asset || asset.deliveryType !== 'authenticated' || asset.resourceType !== 'raw' ||
        !/^indian-rentals\/kyc-private\/[a-f\d-]+\.(jpg|png|pdf)$/.test(asset.publicId)) reject('Document is not available for this customer', 403);
    return asset;
}
async function validateDocuments(documents, user, session) {
    if (!documents || typeof documents !== 'object' || Array.isArray(documents)) reject('Invalid documents');
    const result = {};
    for (const [field, value] of Object.entries(documents)) {
        if (LABELS.includes(field)) {
            if (typeof value !== 'string' || value.length > 80) reject('Invalid document type');
            result[field] = value; continue;
        }
        if (!FIELDS.includes(field)) reject('Unknown document field');
        await ownedAsset(value, user, field, session);
        result[field] = value;
    }
    return result;
}
function kycResponse(record) {
    if (!record) return { status: 'not_submitted' };
    const value = typeof record.toObject === 'function' ? record.toObject() : record;
    const response = {};
    for (const key of ['_id', 'user', 'personalDetails', 'referenceDetails', 'status', 'rejectionReason', 'remarks', 'createdAt', 'updatedAt']) if (value[key] !== undefined) response[key] = value[key];
    response.documents = {}; response.migrationRequiredFields = [];
    for (const field of FIELDS) {
        const id = value.documents?.[field];
        if (isAssetId(id)) response.documents[field] = id;
        else if (id) response.migrationRequiredFields.push(field);
    }
    for (const label of LABELS) if (typeof value.documents?.[label] === 'string') response.documents[label] = value.documents[label];
    return response;
}
async function readPrivateAsset(asset) {
    // Only a provider URL generated from server-uploaded metadata is fetched.
    // Signed URLs stay server-side and expire after one minute.
    const generated = cloudinary.utils.private_download_url(asset.publicId, undefined,
        { resource_type: 'raw', type: 'authenticated', expires_at: Math.floor(Date.now() / 1000) + 60 });
    const url = new URL(generated);
    if (url.protocol !== 'https:' || !['api.cloudinary.com', 'api-eu.cloudinary.com', 'api-ap.cloudinary.com'].includes(url.hostname) || url.username || url.password || url.port) reject('Invalid private storage endpoint', 503);
    const upstream = await fetch(url.href, { redirect: 'error', signal: AbortSignal.timeout(15000) });
    if (!upstream.ok || !upstream.body) reject('Private document could not be retrieved', 502);
    const length = Number(upstream.headers.get('content-length'));
    if (length > MAX_BYTES) { await upstream.body.cancel(); reject('Storage document exceeds the size limit', 502); }
    const reader = upstream.body.getReader(); const chunks = []; let bytes = 0;
    try {
        for (;;) { const { done, value } = await reader.read(); if (done) break;
            bytes += value.byteLength;
            if (bytes > MAX_BYTES) { await reader.cancel(); reject('Storage document exceeds the size limit', 502); }
            chunks.push(Buffer.from(value));
        }
    } finally { reader.releaseLock(); }
    const buffer = Buffer.concat(chunks);
    if (bytes !== asset.bytes || fileType(buffer).contentType !== asset.contentType) reject('Storage document verification failed', 502);
    return buffer;
}
module.exports = { FIELDS, LABELS, requireCustomer, uploadPrivateAsset, ownedAsset, validateDocuments, kycResponse, readPrivateAsset, fileType };
