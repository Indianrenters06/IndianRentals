const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const updateCMSImages = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/indian_rentals');
        console.log('MongoDB Connected');

        const homepage = await mongoose.connection.db.collection('cms').findOne({ pageName: 'homepage' });
        
        if (!homepage) {
            console.log('Homepage CMS not found');
            process.exit(1);
        }

        const images = [
            'https://res.cloudinary.com/dpu9ikeqe/image/upload/v1769200258/WhatsApp_Image_2026-01-23_at_ahuj83.jpg', // Step 1
            'https://res.cloudinary.com/dpu9ikeqe/image/upload/v1773311179/f5d05a49c7a9e513697df5b39fc826c8e9635182_bau9ky.png', // Step 2: KYC
            'https://res.cloudinary.com/dpu9ikeqe/image/upload/v1773311180/c853e25515c331bf8956b228e04cd4b22e0b91d3_d7oqzx.png', // Step 3: Payment
            'https://res.cloudinary.com/dpu9ikeqe/image/upload/v1773311190/7376ef09ee50f329f3115a2bdec517818465c5a3_fzsfya.png'  // Step 4: Delivery
        ];

        const updatedSteps = (homepage.rentalProcessSteps || []).map((step, idx) => ({
            ...step,
            image: images[idx] || step.image
        }));

        await mongoose.connection.db.collection('cms').updateOne(
            { _id: homepage._id },
            { $set: { rentalProcessSteps: updatedSteps } }
        );

        console.log('CMS Steps updated with new images successfully');
        process.exit(0);
    } catch (err) {
        console.error('Error updating CMS images:', err);
        process.exit(1);
    }
};

updateCMSImages();
