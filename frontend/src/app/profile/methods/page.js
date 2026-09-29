import Link from 'next/link';
import { CreditCardIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { profileTitleClassName } from '../profileTitle';

export default function PaymentMethodsPage() {
    return (
        <section className="w-full pb-12" aria-labelledby="payment-methods-title">
            <header className="border-b border-[#dedede] pb-5">
                <h1 id="payment-methods-title" className={profileTitleClassName}>Payment Methods</h1>
                <p className="mt-2 text-[15px] leading-6 text-[#545454]">How payments work for your rentals.</p>
            </header>

            <div className="mt-6 flex items-start gap-4 rounded-2xl border border-[#dedede] bg-white p-5 sm:p-6">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#f6f6f6] text-[#333333]">
                    <CreditCardIcon className="size-6" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                    <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-[#141414]">Choose your payment method at checkout</h2>
                    <p className="mt-2 max-w-[580px] text-[15px] leading-6 text-[#545454]">
                        You can select a payment option when you place an order. Saved payment methods are not available in your account yet.
                    </p>
                    <Link href="/cart" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#ffcf46] px-5 text-[14px] font-semibold text-[#141414] transition-colors hover:bg-[#f3bf35] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]">
                        Go to cart <ArrowRightIcon className="size-4" aria-hidden="true" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
