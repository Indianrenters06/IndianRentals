const mongoose = require('mongoose');

// The random browser receipt is hashed, never linked to a user/account or IP.
const schema = new mongoose.Schema({
    receiptHash: { type:String, required:true, unique:true },
    version: { type:Number, required:true, enum:[2] },
    essential: { type:Boolean, required:true, enum:[true] },
    analytics: { type:Boolean, required:true },
    decidedAt: { type:Date, required:true },
    expiresAt: { type:Date, required:true },
}, { timestamps:true, bufferCommands:false });
schema.index({ expiresAt:1 }, { expireAfterSeconds:0 });
schema.index({ updatedAt:-1 });
module.exports = mongoose.model('CookieConsent', schema);
