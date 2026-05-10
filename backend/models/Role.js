const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a role name'],
        unique: true,
        trim: true
    },
    id: {
        type: String,
        required: [true, 'Please provide a role id'],
        unique: true,
        lowercase: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    permissions: {
        type: [String],
        default: []
    },
    isPredefined: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Role', roleSchema);
