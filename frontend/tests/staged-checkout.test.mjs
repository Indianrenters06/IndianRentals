import test from 'node:test';
import assert from 'node:assert/strict';
import { checkoutSelections, stagedCheckoutView, stagedCheckoutError } from '../src/lib/stagedCheckoutModel.mjs';

test('missing staged API gives an explicit preview option without replacing booking errors', () => {
    const missing = stagedCheckoutError('/rentals/quote', 404, { message: 'Not Found - /api/rentals/quote' });
    assert.equal(missing.code, 'CHECKOUT_API_UNAVAILABLE');
    assert.match(missing.message, /simulated checkout preview/);
    const missingBooking = stagedCheckoutError('/rentals/example/staged', 404, { message: 'Rental not found' });
    assert.equal(missingBooking.code, undefined);
    assert.equal(missingBooking.message, 'Rental not found');
    const changedQuote = { hash: 'updated' };
    const conflict = stagedCheckoutError('/rentals/staged', 409, { message: 'Quote changed', quote: changedQuote });
    assert.equal(conflict.status, 409);
    assert.equal(conflict.quote, changedQuote);
    assert.equal(conflict.code, undefined);
});

const booking = (changes = {}) => ({ rental: { checkoutFlow: 'staged', status: 'Pending', isPaid: false,
    pricingSnapshot: { totalPaise: 2012300 }, staged: { advancePaise: 201230, paidPaise: 201230, advance: { state: 'paid' } }, ...changes },
    kycStatus: 'pending', paidPaise: 201230, balancePaise: 1811070, canPayBalance: false });
test('captured advance remains a partial payment while KYC is pending', () => {
    const view = stagedCheckoutView(booking());
    assert.equal(view.advancePaid, true); assert.equal(view.complete, false); assert.equal(view.step, 2);
    assert.equal(view.paidPaise + view.balancePaise, 2012300); assert.equal(view.canPayBalance, false);
});
test('refund hold blocks balance even if server capability is stale', () => {
    const state = booking({ refundReviewRequired: true }); state.canPayBalance = true;
    const view = stagedCheckoutView(state); assert.equal(view.blocked, true); assert.equal(view.canPayBalance, false);
});
test('completion requires confirmed full collection and zero remaining balance', () => {
    const state = booking({ isPaid: true });
    assert.equal(stagedCheckoutView(state).complete, false);
    state.balancePaise = 0; state.paidPaise = 2012300;
    assert.equal(stagedCheckoutView(state).complete, true);
});
test('checkout selections carry identifiers and saved address, never browser prices', () => {
    const selections = checkoutSelections([{ id: 'a'.repeat(24), quantity: 1, duration: 3, price: 1 }],
        { addressLine: '12 Main road', city: 'Noida', pincode: '201301', phone: '9999999999' }, null);
    assert.deepEqual(selections.orderItems, [{ product: 'a'.repeat(24), qty: 1, tenureMonths: 3 }]);
    assert.equal(selections.shippingAddress.address, '12 Main road');
    assert.throws(() => checkoutSelections([{ id: 'example' }], {}), /catalogue product/);
});
