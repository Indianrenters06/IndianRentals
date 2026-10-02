const mongoose = require('mongoose');
const { randomUUID } = require('node:crypto');

const rentalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    orderItems: [
        {
            name: { type: String, required: true },
            qty: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            securityDeposit: { type: Number, required: true },
            tenureMonths: { type: Number },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Product'
            },
            processed: { type: Boolean, default: false },
            condition: { type: String, default: 'Pending Inspection' },
            inspectionNotes: { type: String, default: '' }
        }
    ],
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
        phone: { type: String, required: true }
    },
    rentalPeriod: {
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        durationMonths: { type: Number, required: true }
    },
    paymentMethod: {
        type: String,
        required: true,
        default: 'Cashfree'
    },
    paymentResult: {
        id: { type: String },
        status: { type: String },
        update_time: { type: String },
        email_address: { type: String }
    },
    // Financials
    itemsPrice: { type: Number, required: true, default: 0.0 },
    taxPrice: { type: Number, required: true, default: 0.0 },
    shippingPrice: { type: Number, required: true, default: 0.0 },
    couponCode: { type: String, default: null },
    couponDiscount: { type: Number, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },
    depositPrice: { type: Number, default: 0 },
    pricingSnapshot: { type: mongoose.Schema.Types.Mixed, immutable: true },
    checkoutFlow: { type: String, enum: ['legacy', 'staged'], default: 'legacy', immutable: true },
    // The estimate remains immutable. A separate reviewed bill may change only
    // before the first balance provider session has been reserved.
    staged: {
        advancePaise: Number,
        paidPaise: { type: Number, default: 0 },
        finalQuote: mongoose.Schema.Types.Mixed,
        advance: {
            providerOrderId: String, requestKey: String, mode: String,
            amountPaise: Number, quoteHash: String, state: String,
            providerPaymentId: String, paidAt: Date,
            receiptState: String, receiptClaimedAt: Date,
        },
        balance: {
            providerOrderId: String, requestKey: String, mode: String,
            amountPaise: Number, quoteHash: String, state: String,
            providerPaymentId: String, paidAt: Date,
            receiptState: String, receiptClaimedAt: Date,
        },
    },
    checkoutKey: { type: String, immutable: true },
    selectionHash: { type: String, immutable: true },
    paymentState: { type: String, enum: ['created', 'payment_pending', 'payment_failed', 'confirmed', 'cancelled', 'manual_review'], default: 'created' },
    payment: {
        providerOrderId: String,
        mode: { type: String, enum: ['sandbox'] },
        requestKey: { type: String, default: randomUUID },
        providerPaymentId: String,
    },
    refundReviewRequired: { type: Boolean, default: false },
    paymentReceipt: {
        state: { type: String, enum: ['pending', 'dispatching', 'sent', 'delivery_unknown'] },
        claimedAt: Date,
    },

    // Status Tracking
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Shipped', 'Delivered', 'Active', 'Returned', 'Cancelled'],
        default: 'Pending'
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false
    },
    paidAt: {
        type: Date
    },
    isDelivered: {
        type: Boolean,
        required: true,
        default: false
    },
    deliveredAt: {
        type: Date
    },
    isReturned: {
        type: Boolean,
        required: true,
        default: false
    },
    returnedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Legacy records without a checkout key are not backfilled or repriced.
rentalSchema.index({ user: 1, checkoutKey: 1 }, { unique: true,
    partialFilterExpression: { checkoutKey: { $type: 'string' } } });
rentalSchema.index({ 'payment.providerPaymentId': 1 }, { unique: true,
    partialFilterExpression: { 'payment.providerPaymentId': { $type: 'string' } } });

for (const stage of ['advance', 'balance']) {
    for (const field of ['providerOrderId', 'providerPaymentId']) {
        const path = `staged.${stage}.${field}`;
        rentalSchema.index({ [path]: 1 }, { unique: true,
            partialFilterExpression: { [path]: { $type: 'string' } } });
    }
}
module.exports = mongoose.model('Rental', rentalSchema);
