const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const run = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const Category = mongoose.model('Category', new mongoose.Schema({
        name: String,
        parent: mongoose.Schema.Types.ObjectId,
    }));
    const Product = mongoose.model('Product', new mongoose.Schema({
        category: String,
    }, { strict: false }));
    
    const roots = await Category.find({ parent: null });
    console.log('Total Roots:', roots.length);
    console.log('Roots:', roots.map(r => r.name));
    
    const subcats = await Category.countDocuments({ parent: { $ne: null } });
    console.log('Total Subcategories:', subcats);
    
    const products = await Product.countDocuments();
    console.log('Total Products:', products);
    
    process.exit(0);
};

run();
