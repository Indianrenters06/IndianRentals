const crypto = require('node:crypto');
const Product = require('../models/Product');
const Settings = require('../models/Settings');
const CMS = require('../models/CMS');
const Coupon = require('../models/Coupon');

function invalid(message, status = 400) { const error = new Error(message); error.statusCode = status; throw error; }
function integer(value, label) {
    if (!Number.isSafeInteger(value) || value < 0) invalid(`Invalid ${label}`);
    return value;
}
function paise(value) {
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) invalid('Invalid catalogue price', 503);
    const result = Math.round(value * 100);
    if (Math.abs(value * 100 - result) > 0.00001) invalid('Catalogue price must have at most two decimals', 503);
    return integer(result, 'money');
}
const fingerprint = value => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');

// No side effects: preview and creation use exactly the same calculation.
async function buildRentalQuote(input) {
    if (!Array.isArray(input.orderItems) || !input.orderItems.length || input.orderItems.length > 30) invalid('Choose between 1 and 30 products');
    const settings = await Settings.findOne();
    const template = await CMS.findOne({ pageName: 'product-page' });
    const pricing = settings?.checkoutPricing;
    if (!pricing || !Array.isArray(template?.productPageTenures) || !template.productPageTenures.length) invalid('Checkout pricing is not configured', 503);
    const taxRateBps = integer(pricing.taxRateBps, 'tax configuration');
    if (taxRateBps > 10000) invalid('Invalid tax configuration', 503);
    const deliveryPaise = integer(pricing.deliveryChargePaise, 'delivery configuration');
    const sourceAddress = input.shippingAddress;
    const shippingAddress = {};
    for (const key of ['address', 'city', 'postalCode', 'country', 'phone']) {
        if (typeof sourceAddress?.[key] !== 'string' || !sourceAddress[key].trim() || sourceAddress[key].length > 300) invalid('Complete your delivery address');
        shippingAddress[key] = sourceAddress[key].trim();
    }
    if (!/^[1-9]\d{5}$/.test(shippingAddress.postalCode) || shippingAddress.country.toLowerCase() !== 'india' || !/^(?:\+91)?[6-9]\d{9}$/.test(shippingAddress.phone)) invalid('Invalid Indian delivery address or phone');
    const pincodes = settings.serviceablePincodes || [];
    if (pincodes.length && !pincodes.some(prefix => shippingAddress.postalCode.startsWith(String(prefix)))) invalid('Delivery is unavailable at this pincode');

    const lines = [];
    const quantities = new Map();
    for (const item of input.orderItems) {
        if (typeof item.product !== 'string' || !/^[a-f\d]{24}$/i.test(item.product)) invalid('Invalid product identifier');
        if (!Number.isSafeInteger(item.qty) || item.qty < 1 || item.qty > 99) invalid('Invalid quantity');
        const months = item.tenureMonths ?? input.rentalPeriod?.durationMonths;
        if (!Number.isSafeInteger(months) || months < 1 || months > 60) invalid('Invalid rental term');
        const term = template.productPageTenures.find(term => term.months === months);
        if (!term || !Number.isFinite(term.discountPercent) || term.discountPercent < 0 || term.discountPercent > 100) invalid('Rental term is unavailable');
        // Options/addons have no authoritative pricing contract in this model.
        // Refuse them instead of silently charging an unverified amount.
        if ((item.options && Object.keys(item.options).length) || item.addons?.length) invalid('Configured options require a reviewed quote');
        const product = await Product.findById(item.product);
        if (!product || product.isActive !== true) invalid('A selected product is unavailable');
        const qty = (quantities.get(item.product.toLowerCase()) || 0) + item.qty;
        quantities.set(item.product.toLowerCase(), qty);
        if (!Number.isSafeInteger(product.stock) || qty > product.stock) invalid('Requested quantity is unavailable');
        const basePaise = paise(product.rentalPrice);
        // Matches the catalogue's whole-rupee tenure rounding.
        const unitRentPaise = integer(Math.round(basePaise / 100 * (1 - term.discountPercent / 100)) * 100, 'term rent');
        const unitDepositPaise = paise(product.securityDeposit);
        lines.push({ product: String(product._id), name: product.name, image: product.images?.[0] || '/images/placeholder.png',
            qty: item.qty, tenureMonths: months, basePaise, discountPercent: term.discountPercent, unitRentPaise, unitDepositPaise });
    }
    const rentPaise = integer(lines.reduce((sum, line) => sum + line.unitRentPaise * line.qty, 0), 'rent total');
    const depositPaise = integer(lines.reduce((sum, line) => sum + line.unitDepositPaise * line.qty, 0), 'deposit total');
    let discountPaise = 0;
    let couponCode = null;
    let couponPolicy = null;
    if (input.couponCode != null && input.couponCode !== '') {
        if (typeof input.couponCode !== 'string' || !/^[A-Z0-9_-]{1,50}$/i.test(input.couponCode.trim())) invalid('Invalid coupon code');
        couponCode = input.couponCode.trim().toUpperCase();
        const coupon = await Coupon.findOne({ code: couponCode });
        if (coupon && (coupon.usageLimit != null && (!Number.isSafeInteger(coupon.usageLimit) || coupon.usageLimit < 0) ||
            !Number.isSafeInteger(coupon.usageCount) || coupon.usageCount < 0)) invalid('Invalid coupon usage configuration', 503);
        if (!coupon?.isActive || !Number.isFinite(new Date(coupon.expiryDate).getTime()) || new Date(coupon.expiryDate) <= new Date() ||
            (coupon.usageLimit != null && coupon.usageCount >= coupon.usageLimit) || rentPaise < paise(coupon.minOrderAmount || 0)) invalid('Coupon is unavailable for this rental');
        couponPolicy = { discountType: coupon.discountType, discountAmount: coupon.discountAmount,
            minOrderAmount: coupon.minOrderAmount || 0, maxDiscountAmount: coupon.maxDiscountAmount ?? null,
            usageLimit: coupon.usageLimit ?? null, expiryDate: new Date(coupon.expiryDate).toISOString() };
        if (coupon.discountType === 'percentage') {
            if (!Number.isFinite(coupon.discountAmount) || coupon.discountAmount < 0 || coupon.discountAmount > 100) invalid('Invalid coupon configuration', 503);
            discountPaise = Math.round(rentPaise * coupon.discountAmount / 100);
        } else if (coupon.discountType === 'fixed') discountPaise = paise(coupon.discountAmount);
        else invalid('Invalid coupon configuration', 503);
        if (coupon.maxDiscountAmount != null) discountPaise = Math.min(discountPaise, paise(coupon.maxDiscountAmount));
        discountPaise = Math.min(rentPaise, integer(discountPaise, 'discount'));
    }
    const taxPaise = integer(Math.round((rentPaise - discountPaise) * taxRateBps / 10000), 'tax');
    const totalPaise = integer(rentPaise + depositPaise + deliveryPaise + taxPaise - discountPaise, 'total');
    if (totalPaise < 100) invalid('Payable amount must be at least one rupee');
    const quote = { version: 1, currency: 'INR', lines, shippingAddress, rentPaise, depositPaise, deliveryPaise, taxRateBps, taxPaise, couponCode, couponPolicy, discountPaise, totalPaise };
    return { ...quote, hash: fingerprint(quote) };
}

module.exports = { buildRentalQuote, fingerprint, paise };
