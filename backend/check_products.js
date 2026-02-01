require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const checkProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const count = await Product.countDocuments();
        console.log(`Total Products: ${count}`);

        if (count > 0) {
            const products = await Product.find().limit(5);
            console.log('Sample Products:', JSON.stringify(products, null, 2));
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkProducts();
