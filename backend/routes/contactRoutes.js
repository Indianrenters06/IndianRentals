const express = require('express');
const asyncHandler = require('express-async-handler');
const { rateLimit } = require('express-rate-limit');
const CMS = require('../models/CMS');
const ContactEnquiry = require('../models/ContactEnquiry');
const { protect, admin, hasPermission } = require('../middleware/authMiddleware');
const { normalizeContent, validateEnquiry } = require('../utils/contactValidation');
const router = express.Router();
const statuses = ['new','in_progress','resolved'];
const adminOnly = [protect, admin, hasPermission('cms')];
const handle = fn => asyncHandler(async (req,res) => { try { await fn(req,res); } catch(error) { if(error.statusCode) res.status(error.statusCode); throw error; } });
router.post('/enquiries', rateLimit({ windowMs:15*60*1000, limit:10, standardHeaders:'draft-8', legacyHeaders:false, message:{message:'Too many requests. Please try again in 15 minutes or call us.'} }), handle(async (req,res) => {
    const page = await CMS.findOne({pageName:'contact'}).lean();
    const values = validateEnquiry(req.body, normalizeContent(page?.contactContent || {}));
    // The unique submission key makes retrying an uncertain network response safe.
    try { await ContactEnquiry.create(values); }
    catch(error) { if (error.code !== 11000 || !error.keyPattern?.submissionId) throw error; }
    res.status(201).json({ received:true, reference:values.submissionId });
}));
router.get('/enquiries', ...adminOnly, handle(async (req,res) => {
    const filter = {};
    if (req.query.intent) { if (!['rental','support'].includes(req.query.intent)) { res.status(400); throw new Error('Invalid intent filter.'); } filter.intent=req.query.intent; }
    if (req.query.status) { if (!statuses.includes(req.query.status)) { res.status(400); throw new Error('Invalid status filter.'); } filter.status=req.query.status; }
    const page = Math.max(1, Math.min(100000,parseInt(req.query.page,10)||1));
    const [items,total] = await Promise.all([ContactEnquiry.find(filter).select('-__v').sort({createdAt:-1}).skip((page-1)*25).limit(25).lean(),ContactEnquiry.countDocuments(filter)]);
    res.set('Cache-Control','no-store'); res.json({items,total,page});
}));
router.patch('/enquiries/:id', ...adminOnly, handle(async (req,res) => {
    if (!/^[a-f\d]{24}$/i.test(req.params.id) || !statuses.includes(req.body.status)) { res.status(400); throw new Error('Invalid enquiry or status.'); }
    const item=await ContactEnquiry.findByIdAndUpdate(req.params.id,{$set:{status:req.body.status}},{returnDocument:'after',runValidators:true}).select('-__v');
    if(!item) { res.status(404); throw new Error('Enquiry not found.'); }
    res.set('Cache-Control','no-store'); res.json(item);
}));
module.exports=router;
