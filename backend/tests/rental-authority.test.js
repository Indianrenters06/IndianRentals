const test = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const { loadSource, invoke } = require('./helpers');

function fixture(owner = 'owner') {
    const rental = { _id: 'rental', user: { _id: { toString: () => owner, equals: id => String(id) === owner }, name: 'Private owner', email: 'owner@example.test' }, isPaid: false,
        orderItems: [], totalPrice: 10000, saves: 0, async save() { this.saves++; return this; } };
    const Rental = function (data) { Object.assign(this, data); this.isPaid = false; this.save = async () => ({ ...this, _id: 'new-rental' }); };
    Rental.findById = () => ({ populate: async () => rental });
    Rental.findOne = async () => null;
    const controller = loadSource('controllers/rentalController.js', {
        '../models/Rental': Rental,
        '../utils/checkoutStorage': { assertCheckoutStorageReady: async () => {} },
        '../services/rentalQuote': { fingerprint: () => 'selection', buildRentalQuote: async () => ({ hash: 'reviewed', lines: [{ product: 'product', qty: 1, tenureMonths: 1, name: 'Test', image: '/test.webp', unitRentPaise: 100, unitDepositPaise: 0 }],
            rentPaise: 100, depositPaise: 0, taxPaise: 0, deliveryPaise: 0, discountPaise: 0, totalPaise: 100 }) },
        '../models/Settings': { findOne: async () => ({ requireKYC: false }) },
        './notificationController': { createNotification: async () => {} },
        '../utils/sendTemplatedEmail': { sendTemplatedEmail: async () => {} },
    });
    return { rental, controller };
}

for (const owner of ['customer', 'foreign-customer']) {
    test(`S1: customer cannot fabricate payment on ${owner}'s order`, async (t) => {
        const { rental, controller } = fixture(owner);
        const router = loadSource('routes/rentalRoutes.js', {
            '../controllers/rentalController': controller,
            '../middleware/authMiddleware': {
                protect(req, res, next) { req.user = { _id: 'customer', role: 'customer' }; next(); },
                admin(req, res, next) { res.sendStatus(403); },
                hasPermission: () => (req, res, next) => next(),
            },
        });
        const app = express();
        app.use(express.json());
        app.use('/api/rentals', router);
        app.use((err, req, res, next) => res.status(500).json({ message: err.message }));
        const server = app.listen(0, '127.0.0.1');
        await new Promise(resolve => server.once('listening', resolve));
        t.after(() => new Promise(resolve => server.close(resolve)));
        const response = await fetch(`http://127.0.0.1:${server.address().port}/api/rentals/rental/pay`, {
            method: 'PUT', headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ id: 'invented', status: 'PAID', isPaid: true }),
        });
        assert.equal(response.status, 404);
        assert.equal(rental.isPaid, false);
        assert.equal(rental.saves, 0);
    });
}

test('S1: owner can read, foreign customer and unpermitted staff cannot read', async () => {
    const { controller } = fixture();
    const read = (user) => invoke(controller.getRentalById, { user, params: { id: 'rental' } });
    assert.equal((await read({ _id: 'owner', role: 'customer' })).statusCode, 200);
    assert.equal((await read({ _id: 'stranger', role: 'customer' })).statusCode, 403);
    assert.equal((await read({ _id: 'staff', role: 'staff', adminPermissions: [] })).statusCode, 403);
    assert.equal((await read({ _id: 'staff', role: 'staff', adminPermissions: ['orders'] })).statusCode, 200);
    assert.equal((await read({ _id: 'admin', role: 'admin' })).statusCode, 200);
});

test('S1: creation cannot accept client paid or settlement state', async () => {
    const { controller } = fixture();
    const result = await invoke(controller.addRentalItems, {
        user: { _id: 'owner' }, body: { orderItems: [{}], checkoutKey: 'test-checkout-key-01', quoteHash: 'reviewed', isPaid: true,
            paidAt: '2026-10-01', paymentResult: { status: 'PAID' } },
    });
    assert.equal(result.statusCode, 201);
    assert.equal(result.body.isPaid, false);
    assert.equal(result.body.paymentResult, undefined);
    assert.equal(result.body.paidAt, undefined);
});
