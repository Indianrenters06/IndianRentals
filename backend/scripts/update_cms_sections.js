const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const updateCMSForNewSections = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/indian_rentals');
        console.log('MongoDB Connected');

        // Update the homepage CMS document
        const result = await mongoose.connection.db.collection('cms').updateOne(
            { pageName: 'homepage' },
            { 
                $set: { 
                    categorySectionEnabled: true,
                    categorySectionTitle: "Rent by Category",
                    bestRentedEnabled: true,
                    bestRentedTitle: "Best Rented Products",
                    newLaunchEnabled: true,
                    newLaunchTitle: "New Launches This Week",
                    featureSectionEnabled: true,
                    featureSectionTitle: "MacBook Air",
                    featureSectionSubtitle: "Skip the setup hassle. Get high-performance workstations pre-configured with Ollama for instant AI development. Run large language models locally.",
                    featureSectionImage: "https://res.cloudinary.com/dgkckcdk8/image/upload/v1769961205/indian-rentals/gfjrzgp5llzcjap30wkt.png",
                    featureSectionCtaText: "Rent Now",
                    featureSectionCtaLink: "/store",
                    featureSectionStats: [
                        { value: '23x', label: 'Up to', sublabel: 'faster than the fastest Intel-based MacBook Air' },
                        { value: '2x', label: 'Up to', sublabel: 'faster than MacBook Air(M1)' },
                        { value: '18 hr', label: 'Up to', sublabel: 'battery life' }
                    ]
                } 
            },
            { upsert: false }
        );

        if (result.matchedCount > 0) {
            console.log('Homepage CMS updated successfully with all customization fields.');
        } else {
            console.log('Homepage CMS document not found.');
        }
        
        process.exit(0);
    } catch (err) {
        console.error('Error updating CMS:', err);
        process.exit(1);
    }
};

updateCMSForNewSections();
