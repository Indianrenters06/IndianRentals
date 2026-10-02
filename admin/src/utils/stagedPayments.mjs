const money = value => Math.max(0, Math.round(Number(value) || 0));
export const isStagedOrder = order => order?.checkoutFlow === 'staged';
const settled = payment => payment?.state === 'paid';

export function stagedFinancials(order) {
    const staged = order?.staged || {};
    const totalPaise = money(staged.finalQuote?.totalPaise ?? order?.pricingSnapshot?.totalPaise ?? Number(order?.totalPrice || 0) * 100);
    const advancePaidPaise = settled(staged.advance) ? money(staged.advance.amountPaise ?? staged.advancePaise) : 0;
    const balancePaidPaise = settled(staged.balance) ? money(staged.balance.amountPaise) : 0;
    const paidPaise = advancePaidPaise + balancePaidPaise;
    const balancePaise = Math.max(0, totalPaise - paidPaise);
    const kycStatus = order?.kycStatus || 'unknown';
    const fullyPaid = order?.isPaid === true && settled(staged.advance) && settled(staged.balance) && paidPaise === totalPaise;
    const nextAction = order?.refundReviewRequired ? 'Payment needs manual review'
        : order?.status === 'Cancelled' ? 'Cancelled — review any received payment'
        : fullyPaid && kycStatus === 'approved' ? 'Ready for fulfilment'
        : !advancePaidPaise ? 'Await booking advance'
        : kycStatus === 'rejected' ? 'Customer must resubmit KYC'
        : kycStatus !== 'approved' ? 'Await KYC approval'
        : !staged.finalQuote ? 'Review final quote'
        : 'Customer pays the remaining balance';
    return { totalPaise, advancePaidPaise, balancePaidPaise, paidPaise, balancePaise, kycStatus, fullyPaid, nextAction };
}

export function canFulfilOrder(order) {
    if (!isStagedOrder(order)) return true; // Legacy transitions remain server governed.
    const financials = stagedFinancials(order);
    return financials.fullyPaid && financials.kycStatus === 'approved' && order.status !== 'Cancelled' && !order.refundReviewRequired;
}

export function rentalTransactions(rentals) {
    return rentals.flatMap(order => {
        const base = { user: order.user?.name || 'Unknown', email: order.user?.email || '', method: order.paymentMethod || 'Cashfree', orderId: order._id };
        if (!isStagedOrder(order)) {
            if (!order.payment?.providerOrderId && !order.paymentResult?.id) return [];
            const when = order.paidAt || order.createdAt;
            return [{ ...base, _id: order._id, txnId: order.paymentResult?.id || order.payment?.providerOrderId,
                stage: 'Full payment', amount: Number(order.totalPrice) || 0, status: order.isPaid ? 'Success' : order.paymentState === 'payment_failed' ? 'Failed' : 'Pending',
                date: new Date(when).toLocaleDateString('en-IN'), createdAt: new Date(when).getTime() }];
        }
        return ['advance', 'balance'].flatMap(stage => {
            const payment = order.staged?.[stage];
            if (!payment?.providerOrderId && !payment?.providerPaymentId) return [];
            const when = payment.paidAt || order.createdAt;
            return [{ ...base, _id: `${order._id}:${stage}`, txnId: payment.providerPaymentId || payment.providerOrderId,
                stage: stage === 'advance' ? 'Booking advance' : 'Final balance', amount: money(payment.amountPaise) / 100,
                status: settled(payment) ? 'Success' : ['failed', 'payment_failed', 'cancelled'].includes(payment.state) ? 'Failed' : 'Pending',
                date: new Date(when).toLocaleDateString('en-IN'), createdAt: new Date(when).getTime() }];
        });
    });
}

export const formatPaise = amount => `₹${(money(amount) / 100).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
