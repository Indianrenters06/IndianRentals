const express = require('express');
const asyncHandler = require('express-async-handler');
const { rateLimit } = require('express-rate-limit');
const CMS = require('../models/CMS');
const Application = require('../models/CareerApplication');
const { protect, admin, hasPermission } = require('../middleware/authMiddleware');
const { normalizeContent, publicContent, validateApplication } = require('../utils/careersValidation');
const defaults = require('../config/careers-defaults.json');
const router = express.Router();
const adminOnly = [protect, admin, hasPermission('cms')];
const load = async () => (await CMS.findOne({ pageName: 'careers' }).lean())?.careersContent || defaults;
const handle = fn => asyncHandler(async (req, res) => { try { await fn(req, res); } catch (error) { if (error.statusCode) res.status(error.statusCode); throw error; } });
router.get('/', handle(async (req, res) => { res.set('Cache-Control', 'no-store'); res.json(publicContent(await load())); }));
router.get('/admin', ...adminOnly, handle(async (req, res) => { res.set('Cache-Control', 'no-store'); res.json(await load()); }));
router.put('/admin', ...adminOnly, handle(async (req, res) => {
    const content = normalizeContent(req.body);
    await CMS.findOneAndUpdate({ pageName: 'careers' }, { $set: { careersContent: content } }, { upsert: true, runValidators: true });
    res.json(content);
}));
router.post('/applications', rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-8', legacyHeaders: false }), handle(async (req, res) => {
    const values = validateApplication(req.body, await load());
    const application = await Application.create(values);
    res.status(201).json({ id: application.id });
}));
router.get('/applications', ...adminOnly, handle(async (req, res) => {
    const page = Math.max(1, Math.min(100000, parseInt(req.query.page, 10) || 1));
    const [items, total] = await Promise.all([Application.find({}).sort({ createdAt: -1 }).skip((page - 1) * 25).limit(25).lean(), Application.countDocuments({})]);
    res.set('Cache-Control', 'no-store'); res.json({ items, total, page });
}));
router.patch('/applications/:id', ...adminOnly, handle(async (req, res) => {
    if (!/^[a-f\d]{24}$/i.test(req.params.id) || !['new','reviewing','shortlisted','closed'].includes(req.body.status)) { res.status(400); throw new Error('Invalid application or status.'); }
    const item = await Application.findByIdAndUpdate(req.params.id, { $set: { status: req.body.status } }, { returnDocument: 'after', runValidators: true });
    if (!item) { res.status(404); throw new Error('Application not found.'); }
    res.json(item);
}));
module.exports = router;
