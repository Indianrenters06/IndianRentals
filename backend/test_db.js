const mongoose = require('mongoose');
const Settings = require('./models/Settings');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    let settings = await Settings.findOne();
    console.log(settings.allowRegistrations, settings.requireKYC, settings.maintenanceMode);
    process.exit(0);
});
