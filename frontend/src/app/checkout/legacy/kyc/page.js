'use client';

import Link from 'next/link';
import { useSelector } from 'react-redux';
import { selectCartTotals, selectCartItems } from '@/redux/features/cartSlice';
import OrderSummary from '@/components/OrderSummary';
import KYCExperience from '@/components/KYCExperience';

export default function CheckoutKYCPage() {
    const totals = useSelector(selectCartTotals);
    const cartItems = useSelector(selectCartItems);
    const firstItem = cartItems[0];
    const productPageUrl = firstItem?.sourceUrl || (firstItem?.id ? `/products/${firstItem.id}` : '/products');
    const productPageLabel = firstItem?.name || 'Product Page';
    const { securityAmount, deliveryCharges, monthlyRentTotal, totalGST, totalOneTime, payToday, savedAmount, couponDiscount, couponCode } = totals;

    return (
        <main className="min-h-screen bg-[#f6f6f6] py-8 sm:py-12">
            <div className="mx-auto max-w-[1200px] px-5 md:px-8">
                <nav aria-label="Checkout progress" className="mb-7 flex flex-wrap items-center gap-2 text-[13px] text-[#555555]">
                    <Link href={productPageUrl} className="max-w-[200px] truncate hover:text-[#141414] hover:underline" title={productPageLabel}>{productPageLabel}</Link>
                    <span aria-hidden="true">›</span>
                    <Link href="/checkout/legacy/cart" className="hover:text-[#141414] hover:underline">Cart</Link>
                    <span aria-hidden="true">›</span>
                    <Link href="/checkout/legacy/address" className="hover:text-[#141414] hover:underline">Address</Link>
                    <span aria-hidden="true">›</span>
                    <span aria-current="page" className="font-semibold text-[#141414]">Verification</span>
                </nav>
                <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_350px] xl:grid-cols-[minmax(0,1fr)_370px]">
                    <div className="min-w-0 rounded-2xl border border-[#e2e2e2] bg-white p-5 sm:p-8">
                        <KYCExperience mode="checkout" approvedHref="/checkout/legacy/payment" loginReturnHref="/checkout/legacy/kyc" />
                    </div>
                    <aside aria-label="Order summary" className="min-w-0 lg:sticky lg:top-6">
                        <OrderSummary
                            securityAmount={securityAmount}
                            deliveryCharges={deliveryCharges}
                            monthlyRentTotal={monthlyRentTotal}
                            totalGST={totalGST}
                            totalOneTime={totalOneTime}
                            payToday={payToday}
                            savedAmount={savedAmount}
                            couponDiscount={couponDiscount}
                            couponCode={couponCode}
                            paymentConfirmed={true}
                            showButton={false}
                        />
                    </aside>
                </div>
            </div>
        </main>
    );
}
