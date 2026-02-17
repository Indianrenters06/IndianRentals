require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const newProducts = [
    {
        name: "Mac Studio M2 Max",
        description: "Apple M2 Max chip with 12‑core CPU, 30‑core GPU, 16‑core Neural Engine",
        category: "Mac Studio",
        brand: "Apple",
        rentalPrice: 12999,
        securityDeposit: 25000,
        stock: 5,
        condition: "New",
        city: "Mumbai",
        state: "Maharashtra",
        images: ["https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mac-studio-202306-gallery-1?wid=4000&hei=3072&fmt=jpeg&qlt=90&.v=1683842369680"]
    },
    {
        name: "Mac Studio M2 Ultra",
        description: "Apple M2 Ultra chip with 24‑core CPU, 60‑core GPU, 32‑core Neural Engine",
        category: "Mac Studio",
        brand: "Apple",
        rentalPrice: 24999,
        securityDeposit: 50000,
        stock: 2,
        condition: "New",
        city: "Delhi",
        state: "Delhi",
        images: ["https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mac-studio-202306-gallery-1?wid=4000&hei=3072&fmt=jpeg&qlt=90&.v=1683842369680"]
    },
    {
        name: "iMac 24-inch",
        description: "Apple M3 chip, 8-core CPU, 10-core GPU, 24-inch 4.5K Retina display",
        category: "iMac",
        brand: "Apple",
        rentalPrice: 6000,
        securityDeposit: 15000,
        stock: 10,
        condition: "New",
        city: "Bangalore",
        state: "Karnataka",
        images: ["https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/imac-24-blue-selection-hero-202310?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1697303721865"]
    },
    {
        name: "Mac mini M2",
        description: "Apple M2 chip with 8‑core CPU and 10‑core GPU, 8GB Unified Memory",
        category: "Mac Mini",
        brand: "Apple",
        rentalPrice: 2000,
        securityDeposit: 5000,
        stock: 15,
        condition: "New",
        city: "Pune",
        state: "Maharashtra",
        images: ["https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mac-mini-202301-gallery-1?wid=4000&hei=3072&fmt=jpeg&qlt=90&.v=1670631023187"]
    },
    {
        name: "Mac Pro Rack",
        description: "Rack-mountable Mac Pro with Apple M2 Ultra chip",
        category: "Mac Pro",
        brand: "Apple",
        rentalPrice: 45000,
        securityDeposit: 100000,
        stock: 1,
        condition: "New",
        city: "Mumbai",
        state: "Maharashtra",
        images: ["https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mac-pro-rack-2023-gallery-1?wid=4000&hei=3072&fmt=jpeg&qlt=90&.v=1683842369680"]
    }
];

const seedNewProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        for (const p of newProducts) {
            const exists = await Product.findOne({ name: p.name });
            if (!exists) {
                await Product.create(p);
                console.log(`Added: ${p.name}`);
            } else {
                console.log(`Skipped (Exists): ${p.name}`);
            }
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

seedNewProducts();
