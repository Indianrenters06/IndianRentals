const Capture = require('../models/PaymentCapture');
async function registerCapture(rental, stage, providerOrderId, paymentId, amountPaise, session) {
    // Ensure the ledger collection/index exists before transactional inserts.
    if (Capture.init) await Capture.init();
    const expected = { _id: String(paymentId), rental: rental._id, stage, providerOrderId, amountPaise, currency: 'INR' };
    let existing = await Capture.findById(expected._id, null, { session });
    if (!existing) {
        try { existing = (await Capture.create([expected], { session }))[0]; }
        catch (error) {
            // Inside a transaction a duplicate key aborts the transaction; the
            // caller/provider retries against the already committed ledger.
            if (error.code !== 11000 || session) throw error;
            existing = await Capture.findById(expected._id);
        }
    }
    if (!existing || String(existing.rental) !== String(expected.rental) || existing.stage !== stage ||
        existing.providerOrderId !== providerOrderId || existing.amountPaise !== amountPaise || existing.currency !== 'INR') {
        const error = new Error('Captured transaction belongs to another payment association'); error.statusCode = 409; throw error;
    }
}
module.exports = { registerCapture };
