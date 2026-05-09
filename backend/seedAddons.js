const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Addon = require('./models/Addon');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/indian_rentals';

const addons = [
    {
        name: "Delivery & Pickup",
        description: "Standard delivery and pickup service to your doorstep.",
        price: "₹499/order",
        category: "Delivery",
        stock: "Unlimited"
    },
    {
        name: "Express Delivery",
        description: "Same day or priority delivery within 24 hours.",
        price: "₹999/order",
        category: "Delivery",
        stock: "Unlimited"
    },
    {
        name: "Relocation / Reinstallation",
        description: "Relocate and reinstall rented items to a new address within the same city.",
        price: "₹1499/request",
        category: "Service",
        stock: "Unlimited"
    },
    {
        name: "Extra Accessories",
        description: "Additional cables, memory cards, mounts, or specialized connectors.",
        price: "Varies",
        category: "Accessories",
        stock: "Variable"
    },
    {
        name: "Upgrade Option",
        description: "Switch to a newer or higher-spec model of your current rental.",
        price: "Conditional",
        category: "Subscription",
        stock: "Unlimited",
        isConditional: true,
        conditionRule: "Users can upgrade if they have rented for 6 months or more."
    }
];

const seedAddons = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB for seeding addons...');

        // Clear existing addons to avoid duplicates during this task
        await Addon.deleteMany({ name: { $in: addons.map(a => a.name) } });
        
        await Addon.insertMany(addons);
        console.log('Addons seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding addons:', error);
        process.exit(1);
    }
};

seedAddons();
