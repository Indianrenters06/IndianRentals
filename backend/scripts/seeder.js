require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');

const products = [
    {
        name: "MacBook Pro 14\" - Apple M4 chip",
        description: "Liquid Retina XDR Pro motion 14.2\", keyboard - indian",
        category: "MacBook",
        brand: "Apple",
        rentalPrice: 5000,
        securityDeposit: 10000,
        stock: 5,
        condition: "New",
        city: "Mumbai",
        state: "Maharashtra",
        images: ["https://res.cloudinary.com/dgkckcdk8/image/upload/v1769946716/indian-rentals/fj8ptqbhppbstdd0hs4i.png"]
    },
    {
        name: "Sony Alpha 7 IV Camera Kit",
        description: "Hybrid 33MP up to 10FPS, upto 4k 60p, 7k oversampled for 4K 30p, 5-axis stabilization, Lens included",
        category: "DSLR",
        brand: "Sony",
        rentalPrice: 5000,
        securityDeposit: 15000,
        stock: 3,
        condition: "New",
        city: "Delhi",
        state: "Delhi",
        images: []
    },
    {
        name: "iPhone Pro Max - A17 chip",
        description: "6.9\" OLED Super Retina XDR, Triple Rear Camera, 8GB RAM, Apple A18 Pro, 5G",
        category: "SmartPhone",
        brand: "Apple",
        rentalPrice: 5000,
        securityDeposit: 20000,
        stock: 8,
        condition: "New",
        city: "Bangalore",
        state: "Karnataka",
        images: []
    },
    {
        name: "Sony Playstation 5 Pro Console",
        description: "Sony PlayStation 5 Pro Console 4K graphics, 120 hz, 2tb ssd storage drive, built-in wifi",
        category: "Gaming",
        brand: "Sony",
        rentalPrice: 5000,
        securityDeposit: 10000,
        stock: 4,
        condition: "New",
        city: "Mumbai",
        state: "Maharashtra",
        images: []
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Clear existing products - COMMENTED OUT TO PROTECT USER DATA
        // await Product.deleteMany({});
        // console.log('Cleared existing products');

        // Insert new products - COMMENTED OUT TO PROTECT USER DATA
        // const createdProducts = await Product.insertMany(products);
        // console.log(`Imported ${createdProducts.length} products`);

        // Ensure Categories exist
        const productCategories = [...new Set(products.map(p => p.category))];

        // Add specific design categories
        const designCategories = [
            "Apple Products",
            "IT Products",
            "AV Products",
            "Office Equipment",
            "DSLR Cameras"
        ];

        // Specific categories requested by user for the homepage
        const targetCategories = [
            "MacBook",
            "DSLR",
            "All in One",
            "iPad",
            "SmartPhone",
            "Desktop",
            "Gaming"
        ];

        // NEW: Subcategories for inner pages
        const subCategories = [
            // IT Products
            "Laptop", "Computer", "Server", "Workstation", "Storage", "Monitor / TFT", "UPS", "Printer & Scanner", "All In One", "Computer Accessories",
            // AV Products
            "Projector", "Television", "Sound System", "Touch Screen", "Conferencing Device", "KIOSK", "Microphone", "Panaboard", "DVD Player", "LED Wall",
            // Office Equipment
            "Paper Shredder", "Note Counting Machine", "Lamination Machine", "FAX Machine", "Barcode Scanner", "Barcode Printer", "PVC Card Printer", "POS Bill Printer",
            // DSLR
            "Video Camera", "Instant Camera", "Go-Pro", "Camera Lenses", "Photo Printer"
        ];

        // Merge with existing but ensure targets are present
        const allCategories = [...new Set([...productCategories, ...designCategories, ...targetCategories, ...subCategories])];

        console.log("\n--- Category IDs for Image Upload ---");
        for (const catName of allCategories) {
            let image = "";
            if (catName === "MacBook" || catName === "Apple Products") {
                image = "https://res.cloudinary.com/dgkckcdk8/image/upload/v1769946716/indian-rentals/fj8ptqbhppbstdd0hs4i.png";
            }

            // Construct update object
            const updateFields = {
                name: catName,
                description: `${catName} category`,
                isActive: true
            };

            // CRITICAL: Only update image if we have a specific one in this script.
            // This prevents wiping out images the user manually uploaded.
            if (image) {
                updateFields.image = image;
            }

            // Use findOneAndUpdate with upsert
            category = await Category.findOneAndUpdate(
                { name: catName },
                { $set: updateFields },
                { upsert: true, new: true }
            );
            console.log(`Processed: ${catName}`);

            // Log ID for the user's specific list
            if (targetCategories.includes(catName)) {
                console.log(`${catName}: ${category._id}`);
            }
        }
        console.log("-------------------------------------\n");

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

seedDB();
