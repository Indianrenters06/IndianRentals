export function careersSubmissionAttempt(previous, payload, uuid = () => crypto.randomUUID()) {
    const fingerprint = JSON.stringify({ ...payload, answers: Object.fromEntries(Object.entries(payload.answers || {}).sort(([a], [b]) => a.localeCompare(b))) });
    return previous?.fingerprint === fingerprint ? previous : { fingerprint, submissionId: uuid() };
}
export function supportsCareersSubmission(content) {
    return content?.applicationSubmissionVersion === 1;
}
