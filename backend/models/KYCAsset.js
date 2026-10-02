const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    field: { type: String, required: true },
    publicId: { type: String, required: true, immutable: true },
    resourceType: { type: String, enum: ['raw'], required: true, immutable: true },
    deliveryType: { type: String, enum: ['authenticated'], required: true, immutable: true },
    contentType: { type: String, enum: ['image/jpeg', 'image/png', 'application/pdf'], required: true },
    extension: { type: String, enum: ['jpg', 'png', 'pdf'], required: true },
    bytes: { type: Number, min: 1, max: 10485760, required: true },
}, { timestamps: true });
module.exports = mongoose.model('KYCAsset', schema);
