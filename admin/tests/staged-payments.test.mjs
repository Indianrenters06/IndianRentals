import test from 'node:test';
import assert from 'node:assert/strict';
import { stagedFinancials, canFulfilOrder, rentalTransactions } from '../src/utils/stagedPayments.mjs';
const order = { _id: 'rental', checkoutFlow: 'staged', status: 'Pending', totalPrice: 1000, isPaid: false, kycStatus: 'approved', staged: {
    advancePaise: 10000, advance: { state: 'paid', amountPaise: 10000, providerOrderId: 'a', providerPaymentId: 'paid-a' }, finalQuote: { totalPaise: 120000 }
} };
test('advance capture is credited once against changed final quote without allowing fulfilment', () => {
    assert.equal(stagedFinancials(order).paidPaise, 10000);
    assert.equal(stagedFinancials(order).balancePaise, 110000);
    assert.equal(canFulfilOrder(order), false);
});
test('full payment still requires current approved KYC', () => {
    const paid = { ...order, isPaid: true, staged: { ...order.staged, balance: { state: 'paid', amountPaise: 110000, providerOrderId: 'b' } } };
    assert.equal(canFulfilOrder(paid), true);
    assert.equal(canFulfilOrder({ ...paid, kycStatus: 'rejected' }), false);
});
test('transactions retain separate actual provider captures and no fake outstanding transaction', () => {
    const pending = { ...order, staged: { ...order.staged, balance: { state: 'created', amountPaise: 110000 } } };
    const tx = rentalTransactions([pending]);
    assert.equal(tx.length, 1);
    assert.equal(tx[0].txnId, 'paid-a');
    assert.equal(tx[0].amount, 100);
    assert.equal(tx[0].stage, 'Booking advance');
    assert.deepEqual(rentalTransactions([{ _id: 'legacy', totalPrice: 1000 }]), []);
});
test('unconfirmed amount and client isPaid flag alone never count as collected', () => {
    const malicious = { ...order, isPaid: true, staged: { ...order.staged, advance: { state: 'pending', amountPaise: 120000, providerOrderId: 'p' } } };
    assert.equal(stagedFinancials(malicious).paidPaise, 0);
    assert.equal(canFulfilOrder(malicious), false);
});
test('advance and balance records sum to actual collections, and manual review blocks fulfilment', () => {
    const paid = { ...order, isPaid: true, staged: { ...order.staged, balance: { state: 'paid', amountPaise: 110000, providerOrderId: 'b', providerPaymentId: 'paid-b' } } };
    const transactions = rentalTransactions([paid]);
    assert.equal(transactions.length, 2);
    assert.equal(new Set(transactions.map(record => record._id)).size, 2);
    assert.equal(transactions.filter(record => record.status === 'Success').reduce((sum, record) => sum + record.amount, 0), 1200);
    assert.equal(canFulfilOrder({ ...paid, refundReviewRequired: true }), false);
    assert.equal(canFulfilOrder({ ...paid, status: 'Cancelled' }), false);
});
