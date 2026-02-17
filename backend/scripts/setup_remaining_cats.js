require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');

const itProducts = [
    "Laptop", "Computer", "Server", "Workstation", "Storage",
    "Monitor / TFT", "UPS", "Printer & Scanner", "All In One", "Computer Accessories"
];

const officeEquipment = [
    "Paper Shredder", "Note Counting Machine", "Lamination Machine", "FAX Machine", "Barcode Scanner",
    "Barcode Printer", "PVC Card Printer", "POS Bill Printer", "IT Products"
];

const avProducts = [
    "Projector", "Television", "Sound System", "PA System", "Touch Screen", "Conferencing Device",
    "KIOSK", "Microphone", "Panaboard", "DVD Player", "LED Wall"
];

const dslrCameras = [
    "DSLR Camera", "Video Camera", "Instant Camera", "Go-Pro", "Camera Lenses",
    "Photo Printer"
];

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const processCategories = async (categoryName, subCats) => {
            console.log(`\n---------------------------------------------------`);
            console.log(`  ${categoryName.toUpperCase()} SUBCATEGORY IDs`);
            console.log(`---------------------------------------------------`);

            for (const name of subCats) {
                let cat = await Category.findOne({ name });
                if (!cat) {
                    cat = await Category.create({ name, description: name + " subcategory", isActive: true });
                    console.log(`[CREATED] ${name.padEnd(25)} : ${cat._id}`);
                } else {
                    console.log(`[EXISTS ] ${name.padEnd(25)} : ${cat._id}`);
                }
            }
        };

        await processCategories("IT Products", itProducts);
        await processCategories("Office Equipment", officeEquipment);
        await processCategories("AV Products", avProducts);
        await processCategories("DSLR Cameras", dslrCameras);

        console.log("---------------------------------------------------");
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

run();
