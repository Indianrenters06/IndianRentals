/**
 * Seed the EmailTemplate collection from the admin panel's preset list.
 *
 * Reads EMAIL_PRESETS straight from
 *   admin/src/app/dashboard/settings/emails/presets.js
 * so the seeded templates always match what you see in the admin UI.
 *
 * Each preset is upserted by `name`:
 *   - if a template with that name doesn't exist  -> it's created (active)
 *   - if it already exists                         -> subject/body/variables/type
 *                                                      are refreshed, isActive left as-is
 *
 * Usage (from the backend folder):
 *   node seedEmailTemplates.js            # create missing + refresh existing
 *   node seedEmailTemplates.js --force    # also overwrite isActive -> true for all
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const mongoose = require('mongoose');
require('dotenv').config();

const EmailTemplate = require('./models/EmailTemplate');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/indian_rentals';
const FORCE_ACTIVE = process.argv.includes('--force');

// ── Load EMAIL_PRESETS from the admin ES module without a build step ──────────
function loadPresets() {
    const presetsPath = path.join(
        __dirname,
        '..',
        'admin',
        'src',
        'app',
        'dashboard',
        'settings',
        'emails',
        'presets.js'
    );
    if (!fs.existsSync(presetsPath)) {
        throw new Error(`Could not find presets file at: ${presetsPath}`);
    }
    let code = fs.readFileSync(presetsPath, 'utf8');
    // Turn the ES export into a CommonJS export we can capture via vm
    code = code.replace('export const EMAIL_PRESETS', 'const EMAIL_PRESETS');
    code += '\nmodule.exports = EMAIL_PRESETS;';
    const sandbox = { module: { exports: {} } };
    sandbox.exports = sandbox.module.exports;
    vm.runInNewContext(code, sandbox, { filename: 'presets.js' });
    const presets = sandbox.module.exports;
    if (!Array.isArray(presets) || presets.length === 0) {
        throw new Error('No presets parsed from presets.js');
    }
    return presets;
}

async function run() {
    const presets = loadPresets();
    console.log(`Loaded ${presets.length} presets from the admin panel.\n`);

    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    let created = 0;
    let updated = 0;

    for (const p of presets) {
        const existing = await EmailTemplate.findOne({ name: p.name });
        if (existing) {
            existing.type = p.type;
            existing.subject = p.subject;
            existing.body = p.body;
            existing.variables = p.variables || [];
            if (FORCE_ACTIVE) existing.isActive = true;
            await existing.save();
            updated++;
            console.log(`↻ Updated:  ${p.name}${FORCE_ACTIVE ? ' (set active)' : ''}`);
        } else {
            await EmailTemplate.create({
                name: p.name,
                type: p.type,
                subject: p.subject,
                body: p.body,
                variables: p.variables || [],
                isActive: true,
            });
            created++;
            console.log(`＋ Created:  ${p.name} (active)`);
        }
    }

    console.log(`\nDone. ${created} created, ${updated} updated.`);
    await mongoose.disconnect();
    process.exit(0);
}

run().catch((err) => {
    console.error('Seed failed:', err.message);
    process.exit(1);
});
