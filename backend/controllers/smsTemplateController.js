const asyncHandler = require('express-async-handler');
const SmsTemplate = require('../models/SmsTemplate');

// GET /api/sms-templates
const getAll = asyncHandler(async (req, res) => {
    const { type, search } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (search) filter.name = { $regex: search, $options: 'i' };
    const templates = await SmsTemplate.find(filter).sort({ createdAt: -1 });
    res.json(templates);
});

// GET /api/sms-templates/:id
const getOne = asyncHandler(async (req, res) => {
    const template = await SmsTemplate.findById(req.params.id);
    if (!template) { res.status(404); throw new Error('Template not found'); }
    res.json(template);
});

// POST /api/sms-templates
const create = asyncHandler(async (req, res) => {
    const { name, type, body, variables, isActive } = req.body;
    if (!name || !body) { res.status(400); throw new Error('name and body are required'); }
    const template = await SmsTemplate.create({ name, type, body, variables: variables || [], isActive: isActive !== false });
    res.status(201).json(template);
});

// PUT /api/sms-templates/:id
const update = asyncHandler(async (req, res) => {
    const template = await SmsTemplate.findById(req.params.id);
    if (!template) { res.status(404); throw new Error('Template not found'); }
    Object.assign(template, req.body);
    await template.save();
    res.json(template);
});

// DELETE /api/sms-templates/:id
const remove = asyncHandler(async (req, res) => {
    const template = await SmsTemplate.findByIdAndDelete(req.params.id);
    if (!template) { res.status(404); throw new Error('Template not found'); }
    res.json({ message: 'Deleted' });
});

module.exports = { getAll, getOne, create, update, remove };
