const asyncHandler = require('express-async-handler');
const EmailTemplate = require('../models/EmailTemplate');
const sendEmail = require('../utils/sendEmail');
const { render } = require('../utils/sendTemplatedEmail');

// GET /api/email-templates
const getAll = asyncHandler(async (req, res) => {
    const { type, search } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (search) filter.name = { $regex: search, $options: 'i' };
    const templates = await EmailTemplate.find(filter).sort({ createdAt: -1 });
    res.json(templates);
});

// GET /api/email-templates/:id
const getOne = asyncHandler(async (req, res) => {
    const template = await EmailTemplate.findById(req.params.id);
    if (!template) { res.status(404); throw new Error('Template not found'); }
    res.json(template);
});

// POST /api/email-templates
const create = asyncHandler(async (req, res) => {
    const { name, type, subject, body, variables, isActive } = req.body;
    if (!name || !subject || !body) { res.status(400); throw new Error('name, subject and body are required'); }
    const template = await EmailTemplate.create({ name, type, subject, body, variables: variables || [], isActive: isActive !== false });
    res.status(201).json(template);
});

// PUT /api/email-templates/:id
const update = asyncHandler(async (req, res) => {
    const template = await EmailTemplate.findById(req.params.id);
    if (!template) { res.status(404); throw new Error('Template not found'); }
    Object.assign(template, req.body);
    await template.save();
    res.json(template);
});

// DELETE /api/email-templates/:id
const remove = asyncHandler(async (req, res) => {
    const template = await EmailTemplate.findByIdAndDelete(req.params.id);
    if (!template) { res.status(404); throw new Error('Template not found'); }
    res.json({ message: 'Deleted' });
});

// POST /api/email-templates/test
// Sends a one-off test email using the supplied subject/body (a draft does not
// need to be saved first). `sampleData` provides values for any {{variables}}.
const sendTest = asyncHandler(async (req, res) => {
    const { to, subject, body, sampleData } = req.body;
    if (!to || !subject || !body) { res.status(400); throw new Error('to, subject and body are required'); }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) { res.status(400); throw new Error('A valid recipient email is required'); }

    const renderedSubject = render(subject, sampleData || {});
    const renderedHtml = render(body, sampleData || {});

    try {
        await sendEmail({ email: to, subject: `[TEST] ${renderedSubject}`, html: renderedHtml });
    } catch (err) {
        res.status(502);
        throw new Error(`Failed to send: ${err.message}`);
    }
    res.json({ message: `Test email sent to ${to}` });
});

module.exports = { getAll, getOne, create, update, remove, sendTest };
