const mongoose = require('mongoose');
const PAGES = ['home','catalogue','product','category','locations','services','blog','contact','about','careers','rental-process','faq'];
const DEVICES = ['mobile','tablet','desktop'];
const schema = new mongoose.Schema({
    eventId: { type:String, required:true, unique:true },
    page: { type:String, required:true, enum:PAGES },
    device: { type:String, required:true, enum:DEVICES },
    createdAt: { type:Date, required:true, default:Date.now },
    expiresAt: { type:Date, required:true },
}, { bufferCommands:false });
schema.index({ expiresAt:1 }, { expireAfterSeconds:0 });
schema.index({ createdAt:-1 });
// No consent ID, visitor ID, URL, user agent, IP, or contact details in events.
module.exports = mongoose.model('SitePageView', schema);
module.exports.PAGES = PAGES;
module.exports.DEVICES = DEVICES;
