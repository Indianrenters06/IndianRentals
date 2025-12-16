const User = require('../models/User');
const generateToken = require('../utils/generateToken');

//register
const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }


        const user = await User.create({
            name,
            email,
            password,
            phone,
            role: role || 'customer'
        });

        if (user) {
            const token = generateToken(res, user._id);
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                kycStatus: user.kycStatus,
                token: token
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

//login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            const token = generateToken(res, user._id);
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                kycStatus: user.kycStatus,
                token: token
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

//logout
const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
};
