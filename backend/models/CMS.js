const mongoose = require('mongoose');

const cmsSchema = new mongoose.Schema({
    pageName: {
        type: String,
        required: true,
        unique: true,
        default: 'homepage'
    },
    heroEnabled: {
        type: Boolean,
        default: true
    },
    heroTitle: {
        type: String,
        default: ''
    },
    heroSubtitle: {
        type: String,
        default: ''
    },
    heroImage: {
        type: String,
        default: ''
    },
    overlayColor: {
        type: String,
        default: 'rgba(0,0,0,0.5)'
    },
    pageContent: {
        type: String,
        default: ''
    },
    publishStatus: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    scheduledPublishTime: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('CMS', cmsSchema);
