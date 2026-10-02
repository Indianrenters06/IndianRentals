const test = require('node:test');
const assert = require('node:assert/strict');
const { loadSource, invoke } = require('./helpers');
const id = '697f5f7934195cb8014c8dbf';
const selection = () => ({ orderItems: [{ product: id, qty: 2, tenureMonths: 3 }],
    shippingAddress: { address: 'Synthetic address', city: 'Delhi', postalCode: '110001', country: 'India', phone: '9000000000' } });
function fixture() {
    const product = { _id: id, name: 'Test laptop', rentalPrice: 1000, securityDeposit: 2000, stock: 4, isActive: true, images: ['/test.webp'], variants: [] };
    const settings = { requireKYC: false, serviceablePincodes: ['110'], checkoutPricing: { taxRateBps: 1800, deliveryChargePaise: 40000 } };
    const cms = { productPageTenures: [{ months: 1, discountPercent: 0 }, { months: 3, discountPercent: 10 }] };
    let coupon = null;
    let reservations = 0;
    const coupons = { findOne: async () => coupon, findOneAndUpdate: async (filter, update, options) => {
        assert.equal(options.session, 'synthetic-session');
        assert.equal(filter.expiryDate.toISOString(), coupon.expiryDate.toISOString());
        if (coupon.usageLimit != null && coupon.usageCount >= coupon.usageLimit) return null;
        reservations++; coupon.usageCount++; return coupon;
    } };
    const dependencies = { '../models/Product': { findById: async () => product }, '../models/Settings': { findOne: async () => settings },
        '../models/CMS': { findOne: async () => cms }, '../models/Coupon': coupons,
        mongoose: { connection: { transaction: callback => callback('synthetic-session') } } };
    let quoteService;
    try { quoteService = loadSource('services/rentalQuote.js', dependencies); } catch (err) { if (err.code !== 'ENOENT') throw err; }
    const Rental = function(data) { Object.assign(this, data); this.isPaid = false; this.save = async () => ({ ...this, _id: 'new-rental' }); };
    let stored = null;
    Rental.findOne = async () => stored;
    const controller = loadSource('controllers/rentalController.js', { ...dependencies,
        ...(quoteService ? { '../services/rentalQuote': quoteService } : {}), '../models/Rental': Rental,
        '../utils/checkoutStorage': { assertCheckoutStorageReady: async () => {} },
        './notificationController': { createNotification: async () => {} }, '../utils/sendTemplatedEmail': { sendTemplatedEmail: async () => {} } });
    return { quoteService, product, settings, controller, Rental, reservations: () => reservations,
        setCoupon(value) { coupon = value; }, setStored(value) { stored = value; } };
}

test('S5: last-use coupon reservation replays without requoting or reserving a second time', async () => {
    const f = fixture();
    const coupon = { code: 'LAST', isActive: true, expiryDate: new Date('2099-01-01'), discountType: 'fixed', discountAmount: 100,
        minOrderAmount: 0, maxDiscountAmount: null, usageLimit: 1, usageCount: 0 };
    f.setCoupon(coupon);
    const body = { ...selection(), couponCode: 'LAST', checkoutKey: 'last-coupon-checkout-key' };
    body.quoteHash = (await f.quoteService.buildRentalQuote(body)).hash;
    const created = await invoke(f.controller.addRentalItems, { user: { _id: 'customer' }, body });
    assert.equal(created.statusCode, 201);
    assert.equal(f.reservations(), 1);
    f.setStored(created.body);
    await assert.rejects(() => f.quoteService.buildRentalQuote(body));
    const replay = await invoke(f.controller.addRentalItems, { user: { _id: 'customer' }, body });
    assert.equal(replay.statusCode, 200);
    assert.equal(f.reservations(), 1);
});

for (const scenario of ['quote error', 'changed quote']) {
    test(`S5: concurrent matching order replays after ${scenario}, without another coupon reservation`, async () => {
        const f = fixture();
        const body = { ...selection(), checkoutKey: 'concurrent-checkout-key' };
        body.quoteHash = (await f.quoteService.buildRentalQuote(body)).hash;
        const created = await invoke(f.controller.addRentalItems, { user: { _id: 'customer' }, body });
        assert.equal(created.statusCode, 201);
        let lookups = 0;
        f.Rental.findOne = async () => ++lookups === 1 ? null : created.body;
        if (scenario === 'quote error') f.product.isActive = false;
        else f.product.rentalPrice += 100;
        const replay = await invoke(f.controller.addRentalItems, { user: { _id: 'customer' }, body });
        assert.equal(replay.statusCode, 200);
        assert.equal(replay.body.totalPrice, created.body.totalPrice);
        assert.equal(lookups, 2);
    });
}

test('S5: changed prices need a new review; retries reuse only the matching owner/selection/snapshot', async () => {
    const f = fixture(); assert.ok(f.quoteService);
    const body = { ...selection(), checkoutKey: 'test-checkout-key-retry' };
    body.quoteHash = (await f.quoteService.buildRentalQuote(body)).hash;
    f.product.rentalPrice += 100;
    const changed = await invoke(f.controller.addRentalItems, { user: { _id: 'customer' }, body });
    assert.equal(changed.statusCode, 409);
    assert.ok(changed.body.quote.hash !== body.quoteHash);
    body.quoteHash = changed.body.quote.hash;
    const created = await invoke(f.controller.addRentalItems, { user: { _id: 'customer' }, body });
    assert.equal(created.statusCode, 201);
    f.setStored(created.body); f.product.rentalPrice += 100;
    const replay = await invoke(f.controller.addRentalItems, { user: { _id: 'customer' }, body });
    assert.equal(replay.statusCode, 200);
    assert.equal(replay.body.totalPrice, created.body.totalPrice);
    body.orderItems[0].qty = 3;
    assert.equal((await invoke(f.controller.addRentalItems, { user: { _id: 'customer' }, body })).statusCode, 409);
});

test('S5: forged client money never becomes the stored rental total', async () => {
    const f = fixture();
    const body = { ...selection(), itemsPrice: 1, totalPrice: 1, taxPrice: 0, shippingPrice: 0, couponDiscount: 999999 };
    if (f.quoteService) {
        const quote = await f.quoteService.buildRentalQuote(body);
        body.quoteHash = quote.hash;
        body.checkoutKey = 'test-checkout-key-0001';
    }
    const result = await invoke(f.controller.addRentalItems, { user: { _id: 'customer' }, body });
    assert.equal(result.statusCode, 201);
    assert.equal(result.body.totalPrice, 6524); // 1800 rent + 324 GST + 400 delivery + 4000 deposit
    assert.equal(result.body.orderItems[0].price, 900);
    assert.equal(result.body.orderItems[0].name, 'Test laptop');
    assert.equal(result.body.pricingSnapshot.totalPaise, 652400);
    assert.equal(result.body.isPaid, false);
});

test('S5: invalid quantities, terms, products, options and destinations fail closed', async () => {
    const f = fixture();
    assert.ok(f.quoteService, 'server quote service required');
    for (const qty of [-1, 0, 1.2, '2', 1000]) {
        const input = selection(); input.orderItems[0].qty = qty;
        await assert.rejects(() => f.quoteService.buildRentalQuote(input));
    }
    const input = selection(); input.orderItems[0].tenureMonths = 2;
    await assert.rejects(() => f.quoteService.buildRentalQuote(input));
    input.orderItems[0].tenureMonths = 3; input.shippingAddress.postalCode = '560001';
    await assert.rejects(() => f.quoteService.buildRentalQuote(input));
    input.shippingAddress.postalCode = '110001'; input.orderItems[0].options = { unpriced: 'extra' };
    await assert.rejects(() => f.quoteService.buildRentalQuote(input));
    delete input.orderItems[0].options; f.product.isActive = false;
    await assert.rejects(() => f.quoteService.buildRentalQuote(input));
});

test('S5: quotes clamp and validate coupons using server rent, with stable fingerprints', async () => {
    const f = fixture(); assert.ok(f.quoteService);
    const input = { ...selection(), couponCode: 'TEST' };
    const coupon = { code: 'TEST', isActive: true, expiryDate: new Date('2099-01-01'), discountType: 'fixed', discountAmount: 99999, minOrderAmount: 1000, usageLimit: 2, usageCount: 0 };
    f.setCoupon(coupon);
    const quote = await f.quoteService.buildRentalQuote(input);
    assert.equal(quote.discountPaise, 180000);
    assert.equal(quote.taxPaise, 0);
    assert.equal(quote.totalPaise, 440000);
    assert.equal(quote.hash, (await f.quoteService.buildRentalQuote({ ...input, totalPrice: 0 })).hash);
    coupon.usageCount = 2;
    await assert.rejects(() => f.quoteService.buildRentalQuote(input));
    coupon.usageCount = 0; coupon.expiryDate = new Date('2000-01-01');
    await assert.rejects(() => f.quoteService.buildRentalQuote(input));
});
