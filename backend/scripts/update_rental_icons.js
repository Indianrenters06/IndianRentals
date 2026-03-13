const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const updateCMSIcons = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/indian_rentals');
        console.log('MongoDB Connected');

        const homepage = await mongoose.connection.db.collection('cms').findOne({ pageName: 'homepage' });
        
        if (!homepage) {
            console.log('Homepage CMS not found');
            process.exit(1);
        }

        const icons = [
            'Laptop',             // Step 1
            'IdentificationCard', // Step 2
            'ShoppingCart',       // Step 3
            'Package'            // Step 4
        ];

        const updatedSteps = (homepage.rentalProcessSteps || []).map((step, idx) => ({
            ...step,
            icon: icons[idx] || step.icon
        }));

        await mongoose.connection.db.collection('cms').updateOne(
            { _id: homepage._id },
            { $set: { rentalProcessSteps: updatedSteps } }
        );

        console.log('CMS Steps updated with new icons successfully');
        process.exit(0);
    } catch (err) {
        console.error('Error updating CMS icons:', err);
        process.exit(1);
    }
};

updateCMSIcons();
