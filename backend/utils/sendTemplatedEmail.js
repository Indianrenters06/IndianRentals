const EmailTemplate = require('../models/EmailTemplate');
const sendEmail = require('./sendEmail');

/**
 * Replace {{KEY}} placeholders in a string with values from `data`.
 * Matching is case-insensitive on the key. Unknown placeholders are left as-is.
 */
function render(str, data = {}) {
    if (!str) return str;
    return str.replace(/\{\{\s*([\w]+)\s*\}\}/g, (match, key) => {
        if (data[key] !== undefined && data[key] !== null) return String(data[key]);
        const found = Object.keys(data).find(k => k.toLowerCase() === key.toLowerCase());
        if (found && data[found] !== undefined && data[found] !== null) return String(data[found]);
        return match;
    });
}

/**
 * Look up an ACTIVE email template by its exact `name`, render the subject and
 * body with `variables`, then send it via the configured SMTP transport.
 *
 * This NEVER throws — it logs and returns false on any failure so a missing
 * template or SMTP hiccup can never break the surrounding request (order
 * placement, registration, etc.).
 *
 * @returns {Promise<boolean>} true if an email was actually sent
 */
async function sendTemplatedEmail(templateName, toEmail, variables = {}) {
    try {
        if (!toEmail) return false;
        const template = await EmailTemplate.findOne({ name: templateName, isActive: true });
        if (!template) {
            console.log(`[email] No active template "${templateName}" — skipped`);
            return false;
        }
        const subject = render(template.subject, variables);
        const html = render(template.body, variables);
        await sendEmail({ email: toEmail, subject, html });
        console.log(`[email] Sent "${templateName}" to ${toEmail}`);
        return true;
    } catch (err) {
        console.log(`[email] Failed "${templateName}" to ${toEmail}: ${err.message}`);
        return false;
    }
}

module.exports = { sendTemplatedEmail, render };
