const { test } = require('node:test');
const assert = require('node:assert/strict');
const { normalizeContent, publicContent, validateApplication } = require('../utils/careersValidation');
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
