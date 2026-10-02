const { test } = require('node:test');
const assert = require('node:assert/strict');
const { normalizeContent, publicContent, validateApplication, applicationSubmission } = require('../utils/careersValidation');
const { randomUUID } = require('node:crypto');
const CMS = require('../models/CMS');
const Application = require('../models/CareerApplication');
const { serveRouter, loadSource } = require('./helpers');
const defaults = require('../config/careers-defaults.json');
const content = () => normalizeContent({ ...structuredClone(defaults), jobs: [{ id: 'test-role', title: 'Test role', department: 'Operations', location: 'Noida', status: 'published', formId: 'standard' }] });
const application = () => ({ jobId: 'test-role', fullName: 'QA Candidate', email: 'qa@example.com', consent: true, answers: { resume: 'https://example.com/resume' } });
test('public content excludes drafts and closed jobs', () => {
    const data = content(); data.jobs.push({ ...data.jobs[0], id: 'draft', status: 'draft' }, { ...data.jobs[0], id: 'closed', status: 'closed' });
    assert.deepEqual(publicContent(data).jobs.map(j => j.id), ['test-role']);
    assert.equal(publicContent({ ...data, enabled: false }).jobs.length, 0);
});
test('form references and dropdown options are validated before saving', () => {
    assert.throws(() => normalizeContent({ ...content(), defaultFormId: 'missing' }), /existing/);
    const data = content(); data.forms[0].fields.push({ id: 'team', label: 'Team', type: 'select', options: [] });
    assert.throws(() => normalizeContent(data), /option/);
});
test('applications require valid open roles, consent and required fields', () => {
    assert.throws(() => validateApplication({ ...application(), jobId: 'missing' }, content()), /no longer/);
    assert.throws(() => validateApplication({ ...application(), consent: false }, content()), /consent/);
    assert.throws(() => validateApplication({ ...application(), answers: {} }, content()), /required/);
    assert.throws(() => validateApplication({ ...application(), answers: { resume: 'javascript:alert(1)' } }, content()), /http/);
    assert.throws(() => validateApplication(application(), { ...content(), enabled: false }), /closed/);
});
test('server snapshots configured labels and ignores forged fields and job titles', () => {
    const saved = validateApplication({ ...application(), jobTitle: 'Forged', answers: { resume: 'https://example.com/resume', injected: 'discard' } }, content());
    assert.equal(saved.jobTitle, 'Test role'); assert.equal(saved.answers.length, 4);
    assert.equal(saved.answers.find(f => f.fieldId === 'resume').label, 'CV / resume link');
    assert.ok(saved.consentAt instanceof Date);
});
test('form configuration can be removed without retaining hidden questions', () => {
    const data = content(); data.forms[0].fields = [];
    assert.deepEqual(validateApplication(application(), data).answers, []);
});
test('frontend and admin fallback content match backend defaults', () => {
    assert.deepEqual(require('../../frontend/src/lib/careers-defaults.json'), defaults);
    assert.deepEqual(require('../../admin/src/lib/careers-defaults.json'), defaults);
});
test('retry identity binds normalized applicant details and answers without depending on CMS snapshots', () => {
    const submissionId = randomUUID();
    const input = { ...application(), submissionId, answers: { resume: 'https://example.com/resume', website: 'https://example.com/' } };
    const first = applicationSubmission(input);
    assert.equal(applicationSubmission({ ...input, fullName: ' QA Candidate ', email: 'QA@EXAMPLE.COM', answers: { website: 'https://example.com/', resume: 'https://example.com/resume' } }).submissionHash, first.submissionHash);
    for (const changes of [{ jobId: '' }, { email: 'other@example.com' }, { fullName: 'Other name' }, { consent: false }, { answers: { resume: 'https://example.com/changed' } }]) assert.notEqual(applicationSubmission({ ...input, ...changes }).submissionHash, first.submissionHash);
    assert.throws(() => applicationSubmission({ ...input, submissionId: 'invalid' }), error => error.statusCode === 400);
    assert.throws(() => applicationSubmission({ ...input, answers: { resume: { url: 'https://example.com' } } }), error => error.statusCode === 400);
    assert.match(applicationSubmission(application()).submissionId, /^[a-f\d-]{36}$/);
});
test('the real application schema supports legacy records and requires a unique sparse retry reference', async () => {
    await new Application(validateApplication(application(), content())).validate();
    assert.ok(Application.schema.indexes().some(([fields, options]) => fields.submissionId === 1 && options.unique && options.sparse));
    assert.equal(Application.schema.path('submissionHash').options.select, false);
});
test('HTTP retries and simultaneous requests persist once, reject changed details and never acknowledge failed storage', async context => {
    let currentContent = content();
    const records = [];
    let storageFailure = false;
    context.mock.method(Application.collection, 'indexes', async () => [{ key: { submissionId: 1 }, unique: true, sparse: true }]);
    context.mock.method(CMS, 'findOne', () => ({ lean: async () => ({ careersContent: currentContent }) }));
    context.mock.method(Application, 'findOne', query => ({ select: async () => records.find(record => record.submissionId === query.submissionId) || null }));
    context.mock.method(Application, 'create', async values => {
        if (storageFailure) throw new Error('Storage unavailable');
        // Yield so both concurrent requests pass their initial lookup, exercising
        // the duplicate-index recovery path rather than only sequential retries.
        await new Promise(resolve => setImmediate(resolve));
        const record = new Application(values);
        await record.validate();
        if (records.some(record => record.submissionId === values.submissionId)) throw Object.assign(new Error('Duplicate reference'), { code: 11000, keyPattern: { submissionId: 1 } });
        records.push(record);
        return record;
    });
    const request = await serveRouter(context, require('../routes/careersRoutes'), '/api/careers');
    const publicResponse = await request('/');
    assert.equal(publicResponse.status, 200); assert.equal((await publicResponse.json()).applicationSubmissionVersion, 1);
    const submit = body => request('/applications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const firstPayload = { ...application(), submissionId: randomUUID() };
    const first = await submit(firstPayload);
    assert.equal(first.status, 201); assert.equal(first.headers.get('cache-control'), 'no-store');
    const saved = await first.json();
    const retry = await submit(firstPayload);
    assert.equal(retry.status, 201); assert.deepEqual(await retry.json(), saved); assert.equal(records.length, 1);
    assert.equal((await submit({ ...firstPayload, email: 'changed@example.com' })).status, 409); assert.equal(records.length, 1);
    currentContent = { ...currentContent, enabled: false };
    assert.equal((await submit(firstPayload)).status, 201); // acknowledgement survives role closure
    currentContent = content();
    storageFailure = true;
    const failed = await submit({ ...application(), submissionId: randomUUID() });
    assert.equal(failed.status, 500); assert.equal((await failed.json()).id, undefined); assert.equal(records.length, 1);
    storageFailure = false;
    const simultaneous = { ...application(), submissionId: randomUUID() };
    const replies = await Promise.all([submit(simultaneous), submit(simultaneous)]);
    assert.deepEqual(replies.map(reply => reply.status), [201, 201]);
    const receipts = await Promise.all(replies.map(reply => reply.json()));
    assert.equal(receipts[0].id, receipts[1].id); assert.equal(records.length, 2);
    assert.equal((await submit({ ...application(), consent: false, submissionId: randomUUID() })).status, 400); assert.equal(records.length, 2);
    const disputed = { ...application(), submissionId: randomUUID() };
    const conflicting = await Promise.all([submit(disputed), submit({ ...disputed, email: 'different@example.com' })]);
    assert.deepEqual(conflicting.map(reply => reply.status).sort(), [201, 409]); assert.equal(records.length, 3);
});
test('keyed HTTP submissions fail closed until the actual unique sparse index exists', async context => {
    let indexes = [], reads = 0, writes = 0, indexFailure = false;
    const Model = {
        collection: { indexes: async () => { if (indexFailure) throw new Error('Index catalogue unavailable'); return indexes; } },
        findOne: () => { reads++; return { select: async () => null }; },
        create: async values => { writes++; const record = new Application(values); await record.validate(); return record; }
    };
    const router = loadSource('routes/careersRoutes.js', {
        '../models/CMS': { findOne: () => ({ lean: async () => ({ careersContent: content() }) }) },
        '../models/CareerApplication': Model,
        'express-rate-limit': { rateLimit: () => (req, res, next) => next() }
    });
    const request = await serveRouter(context, router, '/api/careers');
    const submit = () => request('/applications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...application(), submissionId: randomUUID() }) });
    for (const invalid of [[], [{ key: { submissionId: 1 }, sparse: true }], [{ key: { submissionId: 1 }, unique: true }],
        [{ key: { submissionId: 1, jobId: 1 }, unique: true, sparse: true }],
        [{ key: { submissionId: 1 }, unique: true, sparse: true, partialFilterExpression: { status: 'new' } }]]) {
        indexes = invalid;
        assert.equal((await submit()).status, 503);
    }
    indexFailure = true;
    assert.equal((await submit()).status, 503);
    assert.equal(reads, 0); assert.equal(writes, 0);
    indexFailure = false; indexes = [{ key: { submissionId: 1 }, unique: true, sparse: true }];
    assert.equal((await submit()).status, 201); assert.equal(reads, 1); assert.equal(writes, 1);
});
