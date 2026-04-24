/**
 * seed_categories.js
 * Idempotent — safe to run multiple times. Skips any category/subcategory that already exists.
 * Usage: node scripts/seed_categories.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');

// ─────────────────────────────────────────────────────────────
//  Full category tree (mirrors every frontend category page)
// ─────────────────────────────────────────────────────────────
const TREE = [
    {
        name: 'Apple',
        description: 'Apple MacBooks, iMacs, iPads, iPhones and accessories for rent.',
        subcategories: [
            { name: 'MacBook Pro',          description: 'Apple MacBook Pro laptops' },
            { name: 'MacBook Air',          description: 'Apple MacBook Air laptops' },
            { name: 'iPhone',               description: 'Apple iPhones' },
            { name: 'iPad',                 description: 'Apple iPad tablets' },
            { name: 'iMac',                 description: 'Apple iMac all-in-one desktops' },
            { name: 'Mac Mini',             description: 'Apple Mac Mini desktop' },
            { name: 'Mac Studio',           description: 'Apple Mac Studio' },
            { name: 'Mac Pro',              description: 'Apple Mac Pro workstation' },
            { name: 'Apple Studio Display', description: 'Apple Studio Display monitor' },
            { name: 'Apple XDR Display',    description: 'Apple Pro Display XDR' },
        ],
    },
    {
        name: 'IT Products',
        description: 'Laptops, desktops, servers, monitors and IT accessories for rent.',
        subcategories: [
            { name: 'Laptop',                description: 'Windows & Linux laptops' },
            { name: 'Computer',              description: 'Desktop computers / PCs' },
            { name: 'Server',                description: 'Rack & tower servers' },
            { name: 'Workstation',           description: 'High-performance workstations' },
            { name: 'Storage',               description: 'NAS, SAN and external storage' },
            { name: 'Monitor / TFT',         description: 'LCD / TFT / LED monitors' },
            { name: 'UPS',                   description: 'Uninterruptible power supplies' },
            { name: 'Printer & Scanner',     description: 'Printers, scanners & MFPs' },
            { name: 'All In One',            description: 'All-in-one PCs' },
            { name: 'Computer Accessories',  description: 'Keyboards, mice and peripherals' },
        ],
    },
    {
        name: 'AV Products',
        description: 'Projectors, TVs, sound systems and audio-visual equipment for rent.',
        subcategories: [
            { name: 'Projector',            description: 'LCD & DLP projectors' },
            { name: 'Television',           description: 'LED & OLED TVs' },
            { name: 'Sound System',         description: 'PA systems, speakers & amplifiers' },
            { name: 'Touch Screen',         description: 'Interactive touch-screen panels' },
            { name: 'Conferencing Device',  description: 'Video conferencing equipment' },
            { name: 'KIOSK',               description: 'Self-service kiosk displays' },
            { name: 'Microphone',           description: 'Wired & wireless microphones' },
            { name: 'Panaboard',            description: 'Electronic whiteboards' },
            { name: 'DVD Player',           description: 'DVD & Blu-ray players' },
            { name: 'LED Wall',             description: 'LED video wall panels' },
        ],
    },
    {
        name: 'Office Equipment',
        description: 'Shredders, printers, scanners and other office machines for rent.',
        subcategories: [
            { name: 'Paper Shredder',        description: 'Document shredding machines' },
            { name: 'Note Counting Machine', description: 'Currency counting machines' },
            { name: 'Lamination Machine',    description: 'Pouch & roll laminators' },
            { name: 'FAX Machine',           description: 'Fax & multi-function machines' },
            { name: 'Barcode Scanner',       description: 'Handheld & fixed barcode scanners' },
            { name: 'Barcode Printer',       description: 'Label & barcode printers' },
            { name: 'PVC Card Printer',      description: 'ID and PVC card printers' },
            { name: 'POS Bill Printer',      description: 'Point-of-sale receipt printers' },
        ],
    },
    {
        name: 'DSLR',
        description: 'DSLR cameras, video cameras, lenses and photography gear for rent.',
        subcategories: [
            { name: 'DSLR Camera',   description: 'Professional DSLR cameras' },
            { name: 'Video Camera',  description: 'Camcorders & cinema cameras' },
            { name: 'Instant Camera',description: 'Polaroid & instant cameras' },
            { name: 'Go-Pro',        description: 'Action cameras' },
            { name: 'Camera Lenses', description: 'Prime & zoom lenses' },
            { name: 'Photo Printer', description: 'Portable & desktop photo printers' },
        ],
    },
];

// ─────────────────────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────────────────────
function toSlug(name) {
    return name.toLowerCase().trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');
}

// ─────────────────────────────────────────────────────────────
//  Main
// ─────────────────────────────────────────────────────────────
async function seed() {
    console.log('🔌 Connecting to MongoDB…');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected.\n');

    // ── Drop stale single-field name index if it exists ──────────────────
    try {
        const col = mongoose.connection.collection('categories');
        const indexes = await col.indexes();
        const hasOldIndex = indexes.some(idx => {
            const keys = Object.keys(idx.key);
            return keys.length === 1 && keys[0] === 'name' && idx.unique;
        });
        if (hasOldIndex) {
            await col.dropIndex('name_1');
            console.log('🧹 Dropped stale name_1 unique index.\n');
        }
    } catch (e) {
        // Index may not exist — safe to ignore
        console.log('ℹ️  No stale index to drop.\n');
    }

    let catCreated = 0, catSkipped = 0;
    let subCreated = 0, subSkipped = 0;

    for (const entry of TREE) {
        // ── Parent category ──────────────────────────────────
        let parent = await Category.findOne({ name: entry.name, parent: null });

        if (parent) {
            console.log(`⏭️  Category already exists: "${entry.name}"`);
            catSkipped++;
        } else {
            parent = await Category.create({
                name: entry.name,
                slug: toSlug(entry.name),
                description: entry.description,
                parent: null,
                isActive: true,
            });
            console.log(`✅ Created category: "${entry.name}"`);
            catCreated++;
        }

        // ── Subcategories ────────────────────────────────────
        for (const sub of entry.subcategories) {
            const exists = await Category.findOne({ name: sub.name, parent: parent._id });

            if (exists) {
                console.log(`   ⏭️  Subcategory already exists: "${sub.name}"`);
                subSkipped++;
            } else {
                await Category.create({
                    name: sub.name,
                    slug: toSlug(sub.name),
                    description: sub.description,
                    parent: parent._id,
                    isActive: true,
                });
                console.log(`   ✅ Created subcategory: "${sub.name}"`);
                subCreated++;
            }
        }
        console.log('');
    }

    console.log('─────────────────────────────────────────');
    console.log(`Categories  → created: ${catCreated}  skipped: ${catSkipped}`);
    console.log(`Subcategories → created: ${subCreated}  skipped: ${subSkipped}`);
    console.log('─────────────────────────────────────────\n');

    await mongoose.disconnect();
    console.log('🔌 Disconnected. Done!');
    process.exit(0);
}

seed().catch(err => {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
});
