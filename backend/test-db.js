const mongoose = require('mongoose');
const Product = require('./models/Product');
const Rental = require('./models/Rental');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/indian_rentals')
  .then(async () => {
    console.log('Connected to DB');
    const available = await Product.find({ stock: { $gt: 0 }, isActive: true });
    console.log('Available Stock:', available.length);
    const rentals = await Rental.find({ status: { $in: ['Active', 'Delivered', 'Shipped', 'Approved'] } });
    console.log('Assigned Stock (Rentals):', rentals.length);
    const damaged = await Product.find({ condition: 'Fair' });
    console.log('Damaged Stock:', damaged.length);
    process.exit(0);
  })
  .catch(console.error);
