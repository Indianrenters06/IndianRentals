const defaults = require('../config/contact-defaults.json');
const fail = message => { throw Object.assign(new Error(message), { statusCode: 400 }); };
const text = (value, label, max = 2000, optional = false) => {
    if (typeof value !== 'string' || value.length > max || (!optional && !value.trim())) fail(`${label} is required and must be at most ${max} characters.`);
    return value.trim();
};
const email = value => {
    value = text(value, 'Email', 254).toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) fail('Enter a valid email address.');
    return value;
};
const phone = value => {
    value = text(value, 'Phone number', 24);
    if (!/^\+?[0-9() \-]+$/.test(value) || !/^\d{10,15}$/.test(value.replace(/\D/g, ''))) fail('Enter a valid phone number with 10–15 digits.');
    return value;
};
const url = (value, label, optional = false, image = false) => {
    value = text(value, label, 2000, optional);
    if (!value && optional) return value;
    if (/^\/(?!\/)/.test(value) && !/[\\\s\x00-\x1f]/.test(value)) return value;
    let parsed;
    try { parsed = new URL(value); } catch { fail(`${label} must be a site path or HTTPS URL.`); }
    if (parsed.username || parsed.password || !(parsed.protocol === 'https:' || (image && parsed.protocol === 'http:' && ['localhost','127.0.0.1'].includes(parsed.hostname)))) fail(`${label} must be a site path or HTTPS URL.`);
    return value;
};
function normalizeContent(input) {
    if (!input || typeof input !== 'object' || Array.isArray(input)) fail('Contact content must be an object.');
    const merged = { ...defaults, ...input }, out = {};
    for (const key of Object.keys(defaults)) {
        if (['branches','equipment','helpLinks','heroShowText'].includes(key)) continue;
        out[key] = text(merged[key], key, 2000, ['heroTitle','titleAccent','introClosing'].includes(key));
    }
    out.heroImage = url(merged.heroImage, 'Hero image', false, true);
    if (typeof merged.heroShowText !== 'boolean') fail('Hero text visibility must be true or false.');
    out.heroShowText = merged.heroShowText;
    if (!/^#[\da-f]{6}$/i.test(out.heroBackground)) fail('Hero background must be a six-digit hex colour.');
    out.phone = phone(merged.phone); out.email = email(merged.email);
    if (!Array.isArray(merged.equipment) || !merged.equipment.length || merged.equipment.length > 50) fail('Provide between 1 and 50 equipment options.');
    out.equipment = [...new Set(merged.equipment.map(item => text(item, 'Equipment option', 100)))];
    if (!Array.isArray(merged.branches) || !merged.branches.length || merged.branches.length > 30) fail('Provide between 1 and 30 cities.');
    out.branches = merged.branches.map(b => {
        if (!b || typeof b !== 'object' || !/^[a-z][a-z0-9-]{0,49}$/.test(b.id)) fail('Each city needs a unique lowercase ID.');
        if (!['Head office','Branch office','Service city'].includes(b.type)) fail('Choose a valid branch type.');
        return { id:b.id, name:text(b.name,'City name',100), type:b.type,
            address:text(b.address,'Address',1000,b.type==='Service city'), serviceNote:text(b.serviceNote,'Service city description',1000,b.type!=='Service city'),
            phone:phone(b.phone), image:url(b.image,'City illustration',false,true), mapUrl:url(b.mapUrl,'Directions URL',true) };
    });
    if (new Set(out.branches.map(b=>b.id)).size !== out.branches.length) fail('City IDs must be unique.');
    if (!Array.isArray(merged.helpLinks) || merged.helpLinks.length > 6) fail('Use at most six help links.');
    out.helpLinks = merged.helpLinks.map(l=>({label:text(l?.label,'Help link label',100),href:url(l?.href,'Help link URL')}));
    return out;
}
function validateEnquiry(body, content) {
    if (!body || !['rental','support'].includes(body.intent)) fail('Choose rental enquiry or support request.');
    if (body.consent !== true) fail('Please agree to the privacy policy.');
    const branch = content.branches.find(b=>b.id===body.city);
    if (!branch) fail('Choose an available city.');
    const values = { intent:body.intent, fullName:text(body.fullName,'Full name',100), phone:phone(body.phone), email:email(body.email), city:branch.id, cityName:branch.name, consent:true,
        message:text(body.message ?? '', 'Message',2000,body.intent==='rental') };
    if (body.intent==='rental') {
        if (!content.equipment.includes(body.equipment)) fail('Choose an available equipment option.');
        values.equipment = body.equipment;
    } else values.order = text(body.order ?? '', 'Order reference',100,true);
    if (!/^[a-f\d-]{36}$/i.test(body.submissionId || '')) fail('Invalid submission reference. Please reload the page.');
    values.submissionId = body.submissionId;
    return values;
}
module.exports = { normalizeContent, validateEnquiry };
