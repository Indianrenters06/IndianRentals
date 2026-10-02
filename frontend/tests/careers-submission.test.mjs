import test from 'node:test';
import assert from 'node:assert/strict';
import { careersSubmissionAttempt, supportsCareersSubmission } from '../src/lib/careersSubmission.mjs';
const payload = () => ({ jobId: 'role', fullName: 'Synthetic candidate', email: 'candidate@example.test', consent: true, answers: { resume: 'https://example.test/resume', website: 'https://example.test' } });
test('uncertain retries retain the reference while changed details and acknowledged success get new references', () => {
    let keys = 0;
    const uuid = () => `reference-${++keys}`;
    const first = careersSubmissionAttempt(null, payload(), uuid);
    const retry = careersSubmissionAttempt(first, payload(), uuid);
    assert.equal(retry, first); assert.equal(keys, 1);
    const reordered = careersSubmissionAttempt(first, { ...payload(), answers: { website: 'https://example.test', resume: 'https://example.test/resume' } }, uuid);
    assert.equal(reordered, first);
    const changed = careersSubmissionAttempt(first, { ...payload(), email: 'changed@example.test' }, uuid);
    assert.notEqual(changed.submissionId, first.submissionId);
    const afterSuccess = careersSubmissionAttempt(null, payload(), uuid);
    assert.notEqual(afterSuccess.submissionId, first.submissionId);
});
test('legacy or incompatible APIs cannot accept a browser application until retry-safe submission capability is advertised', () => {
    for (const content of [null, {}, { applicationSubmissionVersion: 0 }, { applicationSubmissionVersion: '1' }, { applicationSubmissionVersion: 2 }]) assert.equal(supportsCareersSubmission(content), false);
    assert.equal(supportsCareersSubmission({ applicationSubmissionVersion: 1 }), true);
});
