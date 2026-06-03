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

    // Platform Identity extras
    currency: { type: String, default: 'INR' },
    timezone: { type: String, default: 'Asia/Kolkata' },

    // Platform behaviour flags
    maintenanceMode: { type: Boolean, default: false },
    allowRegistrations: { type: Boolean, default: true },
    requireKYC: { type: Boolean, default: true },

    // Gateway Keys (Mock)
    paymentGatewaySecret: { type: String, default: '' },

    // SEO — served by the public frontend at /robots.txt and /llms.txt
    // robots.txt: controls search-engine + AI/LLM crawlers. Default ALLOWS the
    // major LLM bots so the brand can surface in AI answers (ChatGPT, Claude,
    // Perplexity, Gemini), while blocking private/transactional routes.
    robotsTxt: {
        type: String,
        default: `# robots.txt — IndianRenters.com

User-agent: *
Allow: /
Disallow: /checkout
Disallow: /cart
Disallow: /profile
Disallow: /login
Disallow: /register
Disallow: /order-confirmation

# --- AI / LLM crawlers (allowed for AI SEO / GEO) ---
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: CCBot
Allow: /

Sitemap: https://indianrenters.com/sitemap.xml`,
    },

    // llms.txt: an LLM-friendly markdown summary of the site (the emerging
    // llms.txt standard) so AI assistants can understand and cite the brand.
    llmsTxt: {
        type: String,
        default: `# IndianRenters.com

> India's largest tech rental platform. Rent laptops, MacBooks, servers, DSLR cameras, AV equipment and office furniture for business and events — delivered to your door, without the full ownership cost.

## Key Pages
- [Home](https://indianrenters.com/): Overview of rental categories and featured products.
- [Products](https://indianrenters.com/products): Full catalogue of rentable tech and equipment.
- [Categories](https://indianrenters.com/categories): Browse by category (Apple, IT, AV, Office Equipment, DSLR Cameras).

## Categories
- [Apple Products](https://indianrenters.com/category/apple)
- [IT Products](https://indianrenters.com/category/it-products)
- [AV Products](https://indianrenters.com/category/av-products)
- [Office Equipment](https://indianrenters.com/category/office-equipment)
- [DSLR Cameras](https://indianrenters.com/category/dslr)

## Company
- [About Us](https://indianrenters.com/about)
- [Contact](https://indianrenters.com/contact)
- [Rental Process](https://indianrenters.com/rental-process)
- [Blog](https://indianrenters.com/blog)`,
    },

}, {
    timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema);
