async function assertCareersStorageReady(Application) {
    let indexes;
    try { indexes = await Application.collection.indexes(); }
    catch { indexes = []; }
    // A declaration in the Mongoose schema cannot guarantee that deployment
    // created the index. Reject missing, compound or partial scopes before writes.
    if (!indexes.some(index => index.unique === true && index.sparse === true && !index.partialFilterExpression &&
        Object.keys(index.key || {}).length === 1 && index.key.submissionId === 1)) {
        const error = new Error('Applications are temporarily unavailable. Please try again later.');
        error.statusCode = 503;
        throw error;
    }
}
module.exports = { assertCareersStorageReady };
