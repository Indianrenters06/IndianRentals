const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Category = require('../models/Category');

// Assuming you have a CMS model or similar. Let's find it.
// If I don't know the exact model name, I'll check the routes.
const cmsSchema = new mongoose.Schema({
    pageName: String,
    heroBgColor: String,
    heroSlides: Array,
    rentalProcessSteps: Array
}, { strict: false });

const CMS = mongoose.model('CMS', cmsSchema, 'cms'); // Usually the collection is 'cms' or 'homepages'

dotenv.config({ path: path.join(__dirname, '../.env') });

const fixCMSData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/indian_rentals');
        console.log('MongoDB Connected');

        // 1. Fix Rental Process Descriptions in DB
        const fullDescription = "Browse our curated selection of premium, performance tested devices. Use the search or categories to find the perfect tool for your needs.";
        
        // Find the homepage CMS document
        const homepage = await mongoose.connection.db.collection('cms').findOne({ pageName: 'homepage' });
        
        if (homepage) {
            console.log('Homepage CMS found in "cms" collection. Updating...');
            
            // Update the first step with full description
            const updatedSteps = [...homepage.rentalProcessSteps];
            if (updatedSteps[0]) {
                updatedSteps[0].description = fullDescription;
            }

            // 2. Fix Hero Background Color (set slides to blue)
            const updatedSlides = homepage.heroSlides.map(slide => ({
                ...slide,
                bgColor: "#00A8FF", // The blue you want
                title: slide.title || "The Tech That Powers Your Ambition. On Demand.",
                subtitle: slide.subtitle || "Get the latest MacBooks, Workstations, Cameras, and more."
            }));

            await mongoose.connection.db.collection('cms').updateOne(
                { _id: homepage._id },
                { 
                    $set: { 
                        rentalProcessSteps: updatedSteps,
                        heroSlides: updatedSlides,
                        heroBgColor: "#00A8FF" 
                    } 
                }
            );
            console.log('CMS Data Fixed successfully.');
        } else {
            console.log('Homepage CMS not found in "homepages" collection.');
        }
        
        process.exit(0);
    } catch (err) {
        console.error('Error fixing CMS data:', err);
        process.exit(1);
    }
};

fixCMSData();
