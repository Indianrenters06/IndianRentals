function testimonialFields(body, { partial = false, canManage = false } = {}) {
    const result = {};
    const fail = message => { const error = new Error(message); error.statusCode = 400; throw error; };
    for (const field of ['name', 'role', 'message', 'image', 'sourceUrl']) {
        if (body[field] !== undefined) {
            if (typeof body[field] !== 'string') fail(`${field} must be text`);
            result[field] = body[field].trim();
        }
    }
    if (!partial || result.name !== undefined) {
        if (!result.name || result.name.length > 120) fail('Customer name is required (up to 120 characters)');
    }
    if (!partial || result.message !== undefined) {
        if (!result.message || result.message.length > 5000) fail('Review text is required (up to 5000 characters)');
    }
    if (body.rating !== undefined || !partial) {
        const rating = Number(body.rating ?? 5);
        if (!Number.isFinite(rating) || rating < 1 || rating > 5) fail('Rating must be between 1 and 5');
        result.rating = rating;
    }
    if (result.image) {
        let url;
        try { url = new URL(result.image); } catch { fail('Image must be an HTTPS URL'); }
        if (url.protocol !== 'https:') fail('Image must be an HTTPS URL');
    }
    if (canManage) {
        if (body.source !== undefined) {
            if (!['indianrenters', 'google'].includes(body.source)) fail('Choose IndianRenters or Google as the review source');
            result.source = body.source;
        }
        if (body.isApproved !== undefined) {
            if (typeof body.isApproved !== 'boolean') fail('Published status must be true or false');
            result.isApproved = body.isApproved;
        }
    } else {
        result.source = 'indianrenters';
        result.sourceUrl = '';
        result.isApproved = false;
    }
    if (result.sourceUrl) {
        let url;
        try { url = new URL(result.sourceUrl); } catch { fail('Enter a valid Google review link'); }
        const hostname = url.hostname.toLowerCase();
        if (url.protocol !== 'https:' || !['google.com', 'www.google.com', 'maps.google.com', 'g.page', 'maps.app.goo.gl'].includes(hostname)) fail('Review links must use HTTPS on Google Maps or g.page');
    }
    return result;
}
module.exports = { testimonialFields };
