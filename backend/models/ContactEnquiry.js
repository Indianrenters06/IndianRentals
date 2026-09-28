const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    submissionId: { type:String, required:true, unique:true },
    intent: { type:String, enum:['rental','support'], required:true },
    fullName: { type:String, required:true, maxlength:100 }, phone: { type:String, required:true, maxlength:24 }, email: { type:String, required:true, maxlength:254 },
    city: { type:String, required:true }, cityName: { type:String, required:true },
    equipment: { type:String, maxlength:100 }, order: { type:String, maxlength:100 }, message: { type:String, maxlength:2000 },
    consent: { type:Boolean, required:true, enum:[true] },
    status: { type:String, enum:['new','in_progress','resolved'], default:'new' },
}, { timestamps:true });
schema.index({ createdAt:-1 });
schema.index({ intent:1, status:1, createdAt:-1 });
module.exports = mongoose.model('ContactEnquiry',schema);
