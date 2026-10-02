const express = require('express');
const asyncHandler = require('express-async-handler');
const { rateLimit } = require('express-rate-limit');
const CMS = require('../models/CMS');
const Application = require('../models/CareerApplication');
const { protect, admin, hasPermission } = require('../middleware/authMiddleware');
const { normalizeContent, publicContent, validateApplication, applicationSubmission } = require('../utils/careersValidation');
const { assertCareersStorageReady } = require('../utils/careersStorage');
const defaults = require('../config/careers-defaults.json');
const router = express.Router();
const adminOnly = [protect, admin, hasPermission('cms')];
const load = async () => (await CMS.findOne({ pageName: 'careers' }).lean())?.careersContent || defaults;
const handle = fn => asyncHandler(async (req, res) => { try { await fn(req, res); } catch (error) { if (error.statusCode) res.status(error.statusCode); throw error; } });
router.get('/', handle(async (req, res) => { res.set('Cache-Control', 'no-store'); res.json({ ...publicContent(await load()), applicationSubmissionVersion: 1 }); }));
router.get('/admin', ...adminOnly, handle(async (req, res) => { res.set('Cache-Control', 'no-store'); res.json(await load()); }));
router.put('/admin', ...adminOnly, handle(async (req, res) => {
    const content = normalizeContent(req.body);
    await CMS.findOneAndUpdate({ pageName: 'careers' }, { $set: { careersContent: content } }, { upsert: true, runValidators: true });
    res.json(content);
}));
router.post('/applications', rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-8', legacyHeaders: false }), handle(async (req, res) => {
    res.set('Cache-Control', 'no-store');
    const identity = applicationSubmission(req.body);
    await assertCareersStorageReady(Application);
    const existing = () => Application.findOne({ submissionId: identity.submissionId }).select('+submissionHash');
    const acknowledge = application => {
        if (application.submissionHash !== identity.submissionHash) {
            const error = new Error('This submission reference belongs to different application details. Please submit again with a new reference.');
            error.statusCode = 409; throw error;
        }
        res.status(201).json({ id: application.id, reference: identity.submissionId });
    };
    const prior = await existing();
    if (prior) return acknowledge(prior);
    const values = { ...validateApplication(req.body, await load()), ...identity };
    let application;
    try { application = await Application.create(values); }
    catch (error) {
        // The unique index resolves simultaneous requests; other storage errors
        // must not produce a success response. No notification side effects run here.
        if (error.code !== 11000 || !error.keyPattern?.submissionId) throw error;
        application = await existing();
        if (!application) throw error;
    }
    acknowledge(application);
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
