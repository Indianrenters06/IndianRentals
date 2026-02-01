require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');

const subCats = [
    "MacBook Pro",
    "iPhone",
    "Mac Mini",
    "Mac Studio",
    "MacBook Air",
    "Apple Studio Display",
    "Apple XDR Display",
    "Mac Pro",
    "iMac",
    "iPad",
    "MacBook"
];

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        console.log("---------------------------------------------------");
        console.log("  APPLE SUBCATEGORY IDs (Use these in Postman)");
        console.log("---------------------------------------------------");

        for (const name of subCats) {
            let cat = await Category.findOne({ name });
            if (!cat) {
                cat = await Category.create({ name, description: name + " subcategory", isActive: true });
                console.log(`[CREATED] ${name.padEnd(25)} : ${cat._id}`);
            } else {
                console.log(`[EXISTS ] ${name.padEnd(25)} : ${cat._id}`);
            }
        }
        console.log("---------------------------------------------------");
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

run();
