const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '../.env') });

const checkCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/indian_rentals');
        const db = mongoose.connection.db;
        const categories = await db.collection('categories').find({}).toArray();
        fs.writeFileSync(path.join(__dirname, 'cat_output.json'), JSON.stringify(categories, null, 2));
        console.log('Categories written to cat_output.json');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};
checkCategories();
