// Prototype only: integer paise keep the advance credit and remaining balance consistent.
export function previewPaymentAmounts({ rent = 0, deposit = 0, delivery = 0, tax = 0, discount = 0 }, adjustment = 0) {
    const paise = value => Math.max(0, Math.round((Number(value) || 0) * 100));
    const estimatedTotal = Math.max(0, paise(rent) + paise(deposit) + paise(delivery) + paise(tax) - paise(discount));
    const advance = Math.round(estimatedTotal * 0.1);
    const finalTotal = Math.max(0, estimatedTotal + Math.round(adjustment * 100));
    return { estimatedTotal, advance, finalTotal, balance: Math.max(0, finalTotal - advance) };
}
export const previewMoney = value => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value / 100);
