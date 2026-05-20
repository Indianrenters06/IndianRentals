const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    // General
    siteName: { type: String, default: 'IndianRentals' },
    siteLogo: { type: String, default: 'https://res.cloudinary.com/dgkckcdk8/image/upload/v1776892240/1d1f7c4e3c0490bcddb69ceb328c67be2f7cf361_6_kufcee.png' },
    contactEmail: { type: String, default: 'support@indianrentals.com' },
    contactPhone: { type: String, default: '+91 1234567890' },
    address: { type: String, default: '' },
    
    // Theme & Branding
    theme: {
        activeTheme: { type: String, default: 'default', enum: ['default', 'oceanic', 'forest', 'sunset', 'midnight'] }
    },

    // Navbar
    navbarAnnouncements: { type: [String], default: ["♥ SAVE Extra 5% up to ₹100 on UPI Orders ♥", "♥ Free Delivery on orders above ₹500 ♥"] },
    navbarLinks: { 
        type: [{ name: String, href: String, separator: { type: Boolean, default: false } }], 
        default: [
            { name: "Apple Products", href: "/category/apple" },
            { name: "IT Products", href: "/category/it-products" },
            { name: "AV Products", href: "/category/av-products" },
            { name: "Office Equipment", href: "/category/office-equipment" },
            { name: "DSLR Cameras", href: "/category/dslr" },
            { name: "More", href: "/categories" },
            { name: "Latest Launch", href: "/products", separator: true },
            { name: "Deals %", href: "/products" }
        ] 
    },

    // Footer
    footerDescription: { type: String, default: "India's largest Tech Rental Platform. Rent Laptops, Macs, Servers, AV Equipments & More for your Business & Events." },
    socialLinks: {
        facebook: { type: String, default: '' },
        twitter: { type: String, default: '' },
        instagram: { type: String, default: '' },
        linkedin: { type: String, default: '' }
    },
    footerQuickLinks: {
        type: [{ name: String, href: String }],
        default: [
            { name: "About Us", href: "/about" },
            { name: "Contact Us", href: "/contact" },
            { name: "Blog", href: "/blog" },
            { name: "Rental Policy", href: "/rental-policy" },
            { name: "Delivery Policy", href: "/delivery-policy" }
        ]
    },

    // Platform behaviour flags
    maintenanceMode: { type: Boolean, default: false },
    allowRegistrations: { type: Boolean, default: true },
    requireKYC: { type: Boolean, default: true },

    // Gateway Keys (Mock)
    paymentGatewaySecret: { type: String, default: '' },

}, {
    timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema);
