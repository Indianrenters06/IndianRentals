const mongoose = require('mongoose');
// A Cashfree transaction has one global provenance, even across legacy/staged
// orders. This record is an association, not proof of fulfillment eligibility.
const schema = new mongoose.Schema({
    _id: { type: String }, rental: { type: mongoose.Schema.Types.ObjectId, ref: 'Rental', required: true },
    stage: { type: String, enum: ['legacy', 'advance', 'balance'], required: true },
    providerOrderId: { type: String, required: true }, amountPaise: { type: Number, required: true, min: 100, validate: Number.isSafeInteger },
    currency: { type: String, enum: ['INR'], required: true },
}, { timestamps: true });
module.exports = mongoose.model('PaymentCapture', schema);
