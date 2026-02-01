require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const allInOne = await Category.find({ name: { $regex: /all in one/i } });
        console.log("\n--- Searching for 'All in One' ---");
        if (allInOne.length > 0) {
            allInOne.forEach(c => {
                console.log(`Found: "${c.name}"`);
                console.log(`ID: ${c._id}`);
            });
        } else {
            console.log("NOT FOUND in database.");
        }
        console.log("----------------------------------\n");

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

check();
