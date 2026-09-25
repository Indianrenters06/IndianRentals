// One-off migration for mobile-only sign-ups: users.email_1 was a plain unique
// index, which treats every missing email as the same `null` value — so only one
// phone account could ever exist. Rebuild it as unique + sparse.
//   node scripts/make_email_index_sparse.js
const mongoose = require('mongoose');
require('dotenv').config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = mongoose.connection.db.collection('users');

        const current = (await users.indexes()).find((i) => i.name === 'email_1');
        if (current?.sparse) {
            console.log('email_1 is already sparse — nothing to do.');
            process.exit(0);
        }

        if (current) {
            await users.dropIndex('email_1');
            console.log('Dropped email_1 (unique, not sparse).');
        }
        await users.createIndex({ email: 1 }, { unique: true, sparse: true, name: 'email_1' });
        console.log('Created email_1 (unique, sparse).');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

run();
