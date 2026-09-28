const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    jobId: String, jobTitle: String, formId: String,
    fullName: { type: String, required: true }, email: { type: String, required: true },
    answers: [{ fieldId: String, label: String, value: String, _id: false }],
    consentText: String, consentAt: Date,
    status: { type: String, enum: ['new', 'reviewing', 'shortlisted', 'closed'], default: 'new' }
}, { timestamps: true });
schema.index({ createdAt: -1 });
module.exports = mongoose.model('CareerApplication', schema);
