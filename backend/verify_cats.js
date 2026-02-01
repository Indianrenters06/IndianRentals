require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');

const verify = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const terms = ['dslr', 'phone', 'smartphone', 'camera'];

        console.log("\n--- SEARCHING FOR CATEGORIES ---");
        for (const term of terms) {
            const results = await Category.find({ name: { $regex: term, $options: 'i' } });
            console.log(`\nResults for term "${term}":`);
            if (results.length === 0) console.log("  (None found)");
            results.forEach(c => {
                console.log(`  - Name: "${c.name}", ID: ${c._id}, Image: "${c.image || 'N/A'}"`);
            });
        }
        console.log("\n--------------------------------");
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

verify();
