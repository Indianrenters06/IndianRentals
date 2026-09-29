const SERVICE_PREFIX = 'service-json-v1:';
const CONTACT_PREFIX = 'contact-json-v1:';

const encode = (prefix, content) => `${prefix}${encodeURIComponent(JSON.stringify(content))}`;
const decode = (prefix, value) => {
    if (typeof value !== 'string' || !value.startsWith(prefix)) return null;
    try {
        const content = JSON.parse(decodeURIComponent(value.slice(prefix.length)));
        return content && !Array.isArray(content) && typeof content === 'object' ? content : null;
    } catch { return null; }
};

export function encodeLegacyServiceContent(content) {
    return encode(SERVICE_PREFIX, content);
}

export function decodeLegacyServiceContent(value) {
    return decode(SERVICE_PREFIX, value);
}

export const encodeLegacyContactContent = content => encode(CONTACT_PREFIX, content);
export const decodeLegacyContactContent = value => decode(CONTACT_PREFIX, value);
