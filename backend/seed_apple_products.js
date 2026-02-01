require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const appleProducts = [
    // iPad
    {
        name: "iPad Pro 12.9-inch (M2)",
        description: "Liquid Retina XDR display, M2 chip, 128GB, Wi-Fi",
        category: "iPad",
        brand: "Apple",
        rentalPrice: 3500,
        securityDeposit: 8000,
        stock: 8,
        condition: "New",
        city: "Mumbai",
        state: "Maharashtra",
        images: ["https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/ipad-pro-13-select-wifi-spaceblack-202405?wid=5120&hei=2880&fmt=p-jpg&qlt=95&.v=1713926639556"]
    },
    {
        name: "iPad Air",
        description: "10.9-inch Liquid Retina display, M1 chip, 64GB, Wi-Fi",
        category: "iPad",
        brand: "Apple",
        rentalPrice: 2000,
        securityDeposit: 5000,
        stock: 12,
        condition: "New",
        city: "Delhi",
        state: "Delhi",
        images: ["https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/ipad-air-select-wifi-blue-202203?wid=940&hei=1112&fmt=png-alpha&.v=1645065732688"]
    },
    // MacBook Air
    {
        name: "MacBook Air 15-inch (M2)",
        description: "Apple M2 chip, 8GB Unified Memory, 256GB SSD, Midnight",
        category: "MacBook Air",
        brand: "Apple",
        rentalPrice: 3000,
        securityDeposit: 7500,
        stock: 10,
        condition: "New",
        city: "Bangalore",
        state: "Karnataka",
        images: ["https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/macbook-air-midnight-select-20220606?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1653084303665"]
    },
    {
        name: "MacBook Air 13-inch (M1)",
        description: "Apple M1 chip, 8GB Unified Memory, 256GB SSD, Space Grey",
        category: "MacBook Air",
        brand: "Apple",
        rentalPrice: 2500,
        securityDeposit: 6000,
        stock: 15,
        condition: "New",
        city: "Pune",
        state: "Maharashtra",
        images: ["https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/macbook-air-space-gray-select-201810?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1633027804000"]
    },
    // Displays
    {
        name: "Apple Studio Display",
        description: "27-inch 5K Retina display, 12MP Ultra Wide camera, Six-speaker sound system",
        category: "Studio Display",
        brand: "Apple",
        rentalPrice: 4000,
        securityDeposit: 10000,
        stock: 3,
        condition: "New",
        city: "Mumbai",
        state: "Maharashtra",
        images: ["https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/studio-display-standard-glass-tilt-stand-202203?wid=3200&hei=2400&fmt=jpeg&qlt=90&.v=1645152226875"]
    },
    {
        name: "Pro Display XDR",
        description: "32-inch Retina 6K display, 1600 nits brightness, 1,000,000:1 contrast ratio",
        category: "XDR Display",
        brand: "Apple",
        rentalPrice: 15000,
        securityDeposit: 40000,
        stock: 1,
        condition: "New",
        city: "Delhi",
        state: "Delhi",
        images: ["https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/pro-display-xdr-standard-glass-stand-201909?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1592318043000"]
    }
];

const seedAppleDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        for (const p of appleProducts) {
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

seedAppleDB();
