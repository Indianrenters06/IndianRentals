const escapeRegex = require('./escapeRegex');
function invalid() { const error = new Error('Invalid catalogue filters or pagination'); error.statusCode = 400; throw error; }
function integer(value, fallback, max) {
    if (value === undefined) return fallback;
    if (typeof value !== 'string' || !/^\d+$/.test(value) || !Number.isSafeInteger(Number(value)) || Number(value) < 1 || Number(value) > max) invalid();
    return Number(value);
}
function text(value, max = 100) { if (typeof value !== 'string' || value.length > max) invalid(); return value.trim(); }
function catalogueQuery(input, defaultLimit = 10) {
    const page = integer(input.pageNumber, 1, 10000), limit = integer(input.limit, defaultLimit, 100);
    const query = { isActive: { $ne: false } };
    if (input.keyword) { const keyword = escapeRegex(text(input.keyword)); query.$or = ['name', 'description', 'brand', 'category'].map(field => ({ [field]: { $regex: keyword, $options: 'i' } })); }
    for (const key of ['category', 'brand']) if (input[key] !== undefined) { const values = text(input[key], 1000).split(',').map(value => value.trim()); if (values.length > 20 || values.some(value => !value || value.length > 100)) invalid(); query[key] = { $in: values }; }
    for (const key of ['city', 'state']) if (input[key] !== undefined) query[key] = { $regex: escapeRegex(text(input[key])), $options: 'i' };
    for (const key of ['minPrice', 'maxPrice', 'rating']) if (input[key] !== undefined) {
        const value = Number(text(input[key], 16)); if (!Number.isFinite(value) || value < 0 || (key === 'rating' && value > 5)) invalid();
        if (key === 'rating') query.rating = { $gte: value };
        else { query.rentalPrice ||= {}; query.rentalPrice[key === 'minPrice' ? '$gte' : '$lte'] = value; }
    }
    if (query.rentalPrice?.$gte > query.rentalPrice?.$lte) invalid();
    if (input.subcategory !== undefined) { if (!/^[a-f\d]{24}$/i.test(text(input.subcategory, 24))) invalid(); query.subcategory = input.subcategory; }
    if (input.ids !== undefined) { const ids = text(input.ids, 1000).split(','); if (ids.length > 40 || ids.some(id => !/^[a-f\d]{24}$/i.test(id))) invalid(); query._id = { $in: ids }; }
    return { query, page, limit };
}
function reviewInput(body) {
    if (typeof body.rating !== 'number' || !Number.isInteger(body.rating) || body.rating < 1 || body.rating > 5 || typeof body.comment !== 'string' || !body.comment.trim() || body.comment.length > 2000) {
        const error = new Error('Choose a rating from 1 to 5 and enter a review of at most 2000 characters'); error.statusCode = 400; throw error;
    }
    return { rating: body.rating, comment: body.comment.trim() };
}
module.exports = { catalogueQuery, reviewInput };
