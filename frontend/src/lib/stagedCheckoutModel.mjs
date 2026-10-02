// These projections describe server records; no browser flag can settle a payment.
export function stagedCheckoutError(path, status, data = {}) {
    const missingRoute = status === 404 && (
        data.message === `Not Found - /api${path}` ||
        data.message === 'Resource not found' || !data.message
    );
    const error = new Error(missingRoute
        ? 'Connected checkout is unavailable because its backend has not been updated. You can explore the simulated checkout preview while it is being connected.'
        : data.message || 'We could not update your booking. Please try again.');
    error.status = status;
    error.quote = data.quote;
    if (missingRoute) error.code = 'CHECKOUT_API_UNAVAILABLE';
    return error;
}

export function stagedCheckoutView(state) {
    const rental = state?.rental;
    const staged = rental?.staged;
    const advancePaid = staged?.advance?.state === 'paid';
    const paidPaise = state?.paidPaise ?? staged?.paidPaise ?? 0;
    const quote = state?.finalQuote || staged?.finalQuote || rental?.pricingSnapshot;
    const totalPaise = quote?.totalPaise ?? 0;
    const balancePaise = state?.balancePaise ?? Math.max(0, totalPaise - paidPaise);
    const blocked = rental?.status === 'Cancelled' || rental?.refundReviewRequired || rental?.paymentState === 'manual_review';
    const complete = rental?.isPaid === true && balancePaise === 0;
    return { advancePaid, paidPaise, balancePaise, quote, blocked, complete,
        advancePaise: state?.advancePaise ?? staged?.advancePaise ?? 0,
        canPayBalance: state?.canPayBalance === true && !blocked && !complete,
        step: complete ? 4 : !advancePaid ? 1 : state?.kycStatus !== 'approved' ? 2 : 3 };
}

export function checkoutSelections(items, address, couponCode) {
    if (!items.length || items.some(item => !/^[a-f\d]{24}$/i.test(item.id))) throw new Error('Add a current catalogue product to your cart before continuing.');
    if (!address) throw new Error('Choose a delivery address first.');
    return { orderItems: items.map(item => ({ product: item.id, qty: item.quantity, tenureMonths: item.duration || 1 })),
        shippingAddress: { address: address.addressLine, city: address.city, postalCode: address.pincode, country: address.country || 'India', phone: address.phone }, couponCode };
}
