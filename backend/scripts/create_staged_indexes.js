/**
 * One-time migration: create the staged checkout unique partial indexes
 * required by assertStagedStorageReady().
 *
 * Run once against your live Atlas database:
 *   node backend/scripts/create_staged_indexes.js
 *
 * Safe to run multiple times — MongoDB ignores existing identical indexes.
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');

async function main() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const col = mongoose.connection.collection('rentals');

    // Legacy checkout indexes (may already exist — harmless if so)
    await col.createIndex(
        { user: 1, checkoutKey: 1 },
        { unique: true, partialFilterExpression: { checkoutKey: { $type: 'string' } }, background: true }
    );
    console.log('✅ index: user + checkoutKey');

    await col.createIndex(
        { 'payment.providerPaymentId': 1 },
        { unique: true, partialFilterExpression: { 'payment.providerPaymentId': { $type: 'string' } }, background: true }
    );
    console.log('✅ index: payment.providerPaymentId');

    // Staged checkout indexes (the ones causing the 503)
    for (const stage of ['advance', 'balance']) {
        for (const field of ['providerOrderId', 'providerPaymentId']) {
            const path = `staged.${stage}.${field}`;
            await col.createIndex(
                { [path]: 1 },
                { unique: true, partialFilterExpression: { [path]: { $type: 'string' } }, background: true }
            );
            console.log(`✅ index: ${path}`);
        }
    }

    console.log('\n✅ All staged checkout indexes created successfully.');
    await mongoose.disconnect();
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });
