const defaults = require('../config/careers-defaults.json');
const { createHash, randomUUID } = require('node:crypto');
const types = ['text', 'email', 'tel', 'url', 'textarea', 'select'];
const fail = message => { const error = new Error(message); error.statusCode = 400; throw error; };
const text = (value, max = 5000) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const webUrl = value => { try { return ['https:', 'http:'].includes(new URL(value).protocol); } catch { return false; } };
const id = value => /^[a-zA-Z0-9_-]{1,80}$/.test(value);
function normalizeContent(input) {
    if (!input || typeof input !== 'object' || Array.isArray(input)) fail('Careers content is required.');
    const result = {};
    for (const [key, value] of Object.entries(defaults)) {
        if (typeof value === 'string') result[key] = text(input[key] ?? value);
        if (typeof value === 'boolean') result[key] = input[key] === undefined ? value : input[key] === true;
    }
    for (const key of ['title','jobsTitle','formTitle','submitLabel','consentText']) if (!result[key]) fail(`${key} cannot be empty.`);
    if (result.heroImage && !(webUrl(result.heroImage) || /^\/(?!\/)/.test(result.heroImage))) fail('Use a valid image URL.');
    for (const key of ['benefits', 'steps']) {
        const rows = input[key] ?? defaults[key];
        if (!Array.isArray(rows) || rows.length > 12) fail(`Add up to 12 ${key}.`);
        if (rows.some(row => !row || typeof row !== 'object')) fail(`Invalid ${key} item.`);
        result[key] = rows.map(row => ({ title: text(row.title, 180), description: text(row.description, 1000) }));
    }
    if (!Array.isArray(input.forms) || !input.forms.length || input.forms.length > 20) fail('Add between 1 and 20 application forms.');
    const formIds = new Set();
    result.forms = input.forms.map(form => {
        if (!form || typeof form !== 'object') fail('Invalid form.');
        if (!id(form.id) || formIds.has(form.id)) fail('Form IDs must be unique.');
        formIds.add(form.id);
        if (!text(form.name)) fail('Each form needs a name.');
        if (!Array.isArray(form.fields) || form.fields.length > 20) fail('Add up to 20 fields per form.');
        const fieldIds = new Set();
        return { id: form.id, name: text(form.name, 120), fields: form.fields.map(field => {
            if (!field || typeof field !== 'object') fail('Invalid field.');
            if (!id(field.id) || fieldIds.has(field.id)) fail('Field IDs must be unique within a form.');
            fieldIds.add(field.id);
            if (!types.includes(field.type) || !text(field.label)) fail('Each field needs a valid type and label.');
            const options = Array.isArray(field.options) ? [...new Set(field.options.map(v => text(v, 200)).filter(Boolean))].slice(0, 30) : [];
            if (field.type === 'select' && !options.length) fail('Dropdown fields need at least one option.');
            return { id: field.id, label: text(field.label, 180), type: field.type, required: field.required === true, options };
        }) };
    });
    if (!formIds.has(result.defaultFormId)) fail('Choose an existing default application form.');
    if (!Array.isArray(input.jobs) || input.jobs.length > 100) fail('Add up to 100 jobs.');
    const jobIds = new Set();
    result.jobs = input.jobs.map(job => {
        if (!job || typeof job !== 'object') fail('Invalid job.');
        if (!id(job.id) || jobIds.has(job.id)) fail('Job IDs must be unique.');
        jobIds.add(job.id);
        if (!['draft','published','closed'].includes(job.status)) fail('Choose a valid job status.');
        if (!text(job.title) || !text(job.department) || !text(job.location)) fail('Each job needs a title, team and location.');
        const formId = job.formId || result.defaultFormId;
        if (!formIds.has(formId)) fail('Each job must reference an existing application form.');
        return { id: job.id, title: text(job.title, 200), department: text(job.department, 120), location: text(job.location, 200), type: text(job.type, 80), experience: text(job.experience, 100), description: text(job.description, 10000), requirements: text(job.requirements, 10000), status: job.status, formId };
    });
    return result;
}
function publicContent(content) {
    const data = { ...defaults, ...content };
    return { ...data, jobs: data.enabled ? data.jobs.filter(j => j.status === 'published') : [], forms: data.enabled ? data.forms : [] };
}
function validateApplication(input, content) {
    if (!input || typeof input !== 'object' || Array.isArray(input)) fail('Application details are required.');
    if (!content.enabled) fail('Applications are currently closed.');
    const jobId = text(input.jobId, 80);
    const job = jobId ? content.jobs.find(j => j.id === jobId && j.status === 'published') : null;
    if (jobId && !job) fail('This role is no longer accepting applications.');
    if (!jobId && !content.generalEnabled) fail('Open applications are currently closed.');
    const form = content.forms.find(f => f.id === (job?.formId || content.defaultFormId));
    if (!form) fail('This application form is unavailable.');
    const fullName = text(input.fullName, 150), email = text(input.email, 254).toLowerCase();
    if (!fullName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail('Enter your name and a valid email address.');
    if (input.consent !== true) fail('Please agree to the application consent statement.');
    const answers = form.fields.map(field => {
        const value = text(input.answers?.[field.id], field.type === 'textarea' ? 5000 : 1000);
        if (field.required && !value) fail(`${field.label} is required.`);
        if (value && field.type === 'url' && !webUrl(value)) fail(`${field.label} must be an http or https link.`);
        if (value && field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) fail(`${field.label} must be a valid email.`);
        if (value && field.type === 'select' && !field.options.includes(value)) fail(`Choose a valid ${field.label}.`);
        return { fieldId: field.id, label: field.label, value };
    });
    return { jobId, jobTitle: job?.title || 'Open application', formId: form.id, fullName, email, answers, consentText: content.consentText, consentAt: new Date() };
}
function applicationSubmission(input) {
    if (!input || typeof input !== 'object' || Array.isArray(input)) fail('Application details are required.');
    // Older clients remain usable, but only a client-supplied reference supports retries.
    const submissionId = input.submissionId === undefined ? randomUUID() : input.submissionId;
    if (typeof submissionId !== 'string' || !/^[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}$/i.test(submissionId)) fail('Invalid submission reference. Please reload the page.');
    const answers = input.answers ?? {};
    if (typeof answers !== 'object' || Array.isArray(answers) || Object.keys(answers).length > 20 || Object.entries(answers).some(([key, value]) => !id(key) || typeof value !== 'string' || value.length > 5000)) fail('Invalid application answers.');
    const payload = {
        jobId: text(input.jobId, 80), fullName: text(input.fullName, 150), email: text(input.email, 254).toLowerCase(), consent: input.consent === true,
        answers: Object.fromEntries(Object.keys(answers).sort().map(key => [key, answers[key].trim()]))
    };
    return { submissionId: submissionId.toLowerCase(), submissionHash: createHash('sha256').update(JSON.stringify(payload)).digest('hex') };
}
module.exports = { normalizeContent, publicContent, validateApplication, applicationSubmission };
