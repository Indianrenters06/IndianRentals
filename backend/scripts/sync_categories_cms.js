const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const CMS = mongoose.model('CMS', new mongoose.Schema({}, { strict: false }));

    const updatedGrid = [
        { title: 'Apple Products', image: 'https://res.cloudinary.com/dgkckcdk8/image/upload/v1769946716/indian-rentals/fj8ptqbhppbstdd0hs4i.png', href: '/category/apple' },
        { title: 'IT Products', image: 'https://res.cloudinary.com/dgkckcdk8/image/upload/v1778099153/indian-rentals/tqniq6juxhhf1j3svppm.png', href: '/category/it-products' },
        { title: 'AV Products', image: 'https://res.cloudinary.com/dgkckcdk8/image/upload/v1769967671/indian-rentals/ecmi4pwvqgqs0owaw4xi.jpg', href: '/category/av-products' },
        { title: 'Office Equipment', image: 'https://res.cloudinary.com/dgkckcdk8/image/upload/v1769967742/indian-rentals/bg4ktprnuvw0jf33m6wv.jpg', href: '/category/office-equipment' },
        { title: 'DSLR Cameras', image: 'https://res.cloudinary.com/dgkckcdk8/image/upload/v1789664661/indian-rentals/bwbf0rroyukoaqfcddla.png', href: '/category/dslr' }
    ];

    const res1 = await CMS.updateMany(
        { categoriesGrid: { $exists: true } },
        { $set: { categoriesGrid: updatedGrid } }
    );
    console.log("Updated CMS docs:", res1);

    const res2 = await CMS.updateOne(
        { pageName: 'categories-page' },
        { $set: { categoriesGrid: updatedGrid } },
        { upsert: true }
    );
    console.log("Updated categories-page:", res2);

    const doc = await CMS.findOne({ pageName: 'categories-page' });
    console.log("Current categories-page categoriesGrid in DB:", doc.categoriesGrid);

    await mongoose.disconnect();
    console.log("Done successfully!");
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
