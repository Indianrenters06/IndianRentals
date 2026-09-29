const CONTACT_PREFIX = 'contact-json-v1:';

const decodeLegacyContactContent = value => {
    if (typeof value !== 'string' || !value.startsWith(CONTACT_PREFIX)) return null;
    try {
        const content = JSON.parse(decodeURIComponent(value.slice(CONTACT_PREFIX.length)));
        return content && !Array.isArray(content) && typeof content === 'object' ? content : null;
    } catch { return null; }
};

module.exports = { decodeLegacyContactContent };
