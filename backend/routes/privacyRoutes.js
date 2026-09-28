const express = require('express');
const mongoose = require('mongoose');
const { createHash } = require('node:crypto');
const asyncHandler = require('express-async-handler');
const { rateLimit } = require('express-rate-limit');
const Consent = require('../models/CookieConsent');
const PageView = require('../models/SitePageView');
const { protect, admin, hasPermission } = require('../middleware/authMiddleware');
const router = express.Router();
const DAY = 86400000;
const VERSION = 2;
const uuid = value => typeof value === 'string' && /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(value);
const hash = value => createHash('sha256').update(value.toLowerCase()).digest('hex');
const handle = fn => asyncHandler(fn);
const limiter = rateLimit({ windowMs:60*1000, limit:120, standardHeaders:'draft-8', legacyHeaders:false, message:{message:'Please try again later.'} });

router.use((req,res,next) => {
    res.set('Cache-Control','no-store');
    next();
});
const storageReady = (req,res,next) => {
    if (mongoose.connection.readyState !== 1) return res.status(503).json({message:'Analytics storage is unavailable.'});
    next();
};

router.post('/consent', limiter, storageReady, handle(async (req,res) => {
    const { receiptId, version, essential, analytics, updatedAt } = req.body || {};
    const now = Date.now();
    if (!uuid(receiptId) || version !== VERSION || essential !== true || typeof analytics !== 'boolean' ||
        !Number.isSafeInteger(updatedAt) || updatedAt > now + 60000 || updatedAt <= now - 180*DAY) {
        return res.status(400).json({message:'Invalid consent preferences.'});
    }
    const receiptHash = hash(receiptId);
    const values = { receiptHash, version, essential:true, analytics, decidedAt:new Date(updatedAt), expiresAt:new Date(updatedAt + 180*DAY) };
    // Conditional upsert prevents delayed requests from restoring an older choice.
    // Same-timestamp rejection wins over acceptance, including across tabs.
    const filter = { receiptHash, $or:[{decidedAt:{$lt:values.decidedAt}}, {decidedAt:values.decidedAt, analytics}] };
    if (!analytics) filter.$or.push({decidedAt:values.decidedAt});
    try { await Consent.findOneAndUpdate(filter, {$set:values}, {upsert:true, runValidators:true}); }
    catch(error) { if (error.code !== 11000) throw error; return res.status(409).json({message:'A newer consent choice is already saved.'}); }
    res.status(200).json({saved:true, version:VERSION});
}));

router.post('/page-view', limiter, storageReady, handle(async (req,res) => {
    const {receiptId,eventId,page,device} = req.body || {};
    if (!uuid(receiptId) || !uuid(eventId) || !PageView.PAGES.includes(page) || !PageView.DEVICES.includes(device)) {
        return res.status(400).json({message:'Invalid analytics event.'});
    }
    // A bare analytics:true in an event is insufficient; an unexpired, explicitly
    // accepted server receipt is required, including after a withdrawal.
    const consent = await Consent.exists({receiptHash:hash(receiptId),version:VERSION,analytics:true,expiresAt:{$gt:new Date()}});
    if (!consent) return res.status(403).json({message:'Analytics consent is required.'});
    const now = new Date();
    try { await PageView.create({eventId,page,device,createdAt:now,expiresAt:new Date(+now + 90*DAY)}); }
    catch(error) { if (error.code !== 11000 || !error.keyPattern?.eventId) throw error; }
    res.status(201).json({received:true});
}));

router.get('/report', protect, admin, hasPermission('reports'), storageReady, handle(async (req,res) => {
    const days = Number(req.query.days || 30);
    if (![7,30,90].includes(days)) return res.status(400).json({message:'Choose 7, 30, or 90 days.'});
    const since = new Date(Date.now() - days*DAY);
    const [views, consent] = await Promise.all([
        PageView.aggregate([
            {$match:{createdAt:{$gte:since}}},
            {$facet:{
                total:[{$count:'count'}],
                pages:[{$group:{_id:'$page',count:{$sum:1}}},{$sort:{count:-1}}],
                devices:[{$group:{_id:'$device',count:{$sum:1}}},{$sort:{count:-1}}],
                daily:[{$group:{_id:{$dateToString:{format:'%Y-%m-%d',date:'$createdAt',timezone:'Asia/Kolkata'}},count:{$sum:1}}},{$sort:{_id:1}}],
            }},
        ]),
        Consent.aggregate([
            {$match:{decidedAt:{$gte:since},expiresAt:{$gt:new Date()}}},
            {$group:{_id:'$analytics',count:{$sum:1}}},
        ]),
    ]);
    res.json({days,generatedAt:new Date(),pageViews:views[0]?.total[0]?.count || 0,
        pages:views[0]?.pages || [],devices:views[0]?.devices || [],daily:views[0]?.daily || [],
        consent:{accepted:consent.find(row=>row._id===true)?.count || 0,rejected:consent.find(row=>row._id===false)?.count || 0}});
}));
module.exports = router;
