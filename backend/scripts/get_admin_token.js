const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
};

const generateToken = (id) => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const createAdminToken = async () => {
    await connectDB();

    const email = 'admin@example.com';
    const password = 'Admin@123';

    let user = await User.findOne({ email });

    if (!user) {
        console.log('Creating new admin user...');
        user = await User.create({
            name: 'Admin User',
            email,
            password,
            phone: '9999999999',
            role: 'admin',
            isEmailVerified: true,
            isPhoneVerified: true
        });
    } else {
        console.log('Admin user found.');
    }

    const token = generateToken(user._id);
    const fs = require('fs');
    fs.writeFileSync('token.txt', token);
    console.log('Token written to token.txt');

    process.exit(0);
};

createAdminToken();
