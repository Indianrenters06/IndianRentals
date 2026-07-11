import React from "react";
import { BsCreditCard } from 'react-icons/bs';
import { SealCheck } from '@phosphor-icons/react';

const OrderSummary = ({
    securityAmount,
    deliveryCharges,
    monthlyRentTotal,
    totalGST,
    totalOneTime,
    payToday,
    savedAmount,
    couponDiscount = 0,
    couponCode = '',
    onCheckout,
    btnText = "Continue to checkout",
    showButton = true,
    paymentConfirmed = false,
}) => {
    const netPayToday = Math.max(0, payToday - couponDiscount);
    return (
        <div className="w-full bg-white border-2 border-[#eee] rounded-[16px] px-[18px] py-[20px] font-sans flex flex-col gap-[20px]">

            {/* Header + summary group (Figma 23226:12509, gap-11) */}
            <div className="flex flex-col gap-[11px] w-full">
                <h2 className="text-[21px] font-semibold text-black tracking-[-0.8px] leading-[28px] w-full">
                    Order Summary
                </h2>

                <div className="flex flex-col gap-[11px] w-full">
                    {/* Summary Box */}
                    <div className="border border-[#e2e2e2] rounded-[8px] px-[18px] py-[20px] flex flex-col gap-[12px] w-full">

                        {/* One Time Payment */}
                        <div className="flex flex-col gap-[2px] w-full">
                            <p className="font-bold text-[14px] text-[#333] tracking-[-0.4px] leading-[20px]">One Time Payment</p>
                            <div className="flex flex-col gap-[8px] w-full text-[12px] leading-[16px] tracking-[-0.4px]">
                                <div className="flex items-center justify-between w-full">
                                    <span className="font-medium text-[#545454]">Security Amount</span>
                                    <span className="font-bold text-[#333]">₹{securityAmount}</span>
                                </div>
                                <div className="flex items-center justify-between w-full">
                                    <span className="font-medium text-[#545454]">Delivery Charges</span>
                                    <span className="font-bold text-[#333]">₹{deliveryCharges}</span>
                                </div>
                            </div>
                        </div>

                        <div className="h-px w-full bg-[#e2e2e2]" />

                        {/* Monthly Rental Breakdown */}
                        <div className="flex flex-col gap-[2px] w-full">
                            <p className="font-bold text-[14px] text-[#333] tracking-[-0.4px] leading-[20px]">Monthly Rental Breakdown</p>
                            <div className="flex flex-col gap-[8px] w-full text-[12px] leading-[16px] tracking-[-0.4px]">
                                <div className="flex items-center justify-between w-full">
                                    <span className="font-medium text-[#545454]">Monthly Rent</span>
                                    <span className="font-bold text-[#333]">₹{monthlyRentTotal}/mo</span>
                                </div>
                                <div className="flex items-center justify-between w-full">
                                    <span className="font-medium text-[#545454]">GST*</span>
                                    <span className="font-bold text-[#333]">₹{totalGST}/mo</span>
                                </div>
                            </div>
                        </div>

                        <div className="h-px w-full bg-[#e2e2e2]" />

                        {/* Subtotal */}
                        <div className="flex items-start justify-between w-full">
                            <span className="font-bold text-[14px] text-[#333] tracking-[-0.4px] leading-[20px]">Subtotal (incl. GST)</span>
                            <span className="font-medium text-[12px] text-[#333] tracking-[-0.4px] leading-[16px]">₹{totalOneTime}</span>
                        </div>

                        {/* Coupon Discount Line */}
                        {couponDiscount > 0 && (
                            <>
                                <div className="h-px w-full border-t border-dashed border-green-300" />
                                <div className="flex items-center justify-between w-full text-[12px] font-semibold text-[#028907] tracking-[-0.4px]">
                                    <span>🎟️ Coupon {couponCode && `(${couponCode})`}</span>
                                    <span>-₹{couponDiscount}</span>
                                </div>
                                <div className="flex items-center justify-between w-full text-[12px] font-bold text-[#333] tracking-[-0.4px]">
                                    <span>Net Payable</span>
                                    <span>₹{netPayToday}</span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Default: Total Amount To Pay Today + info (hidden when payment confirmed) */}
                    {!paymentConfirmed && (
                        <div className="w-full">
                            {/* White total box — rounded top only so the yellow note stacks below */}
                            <div className="bg-white border border-[#e2e2e2] rounded-t-[8px] flex items-center justify-between gap-3 w-full px-[18px] py-[20px]">
                                <div className="flex flex-col gap-[2px] flex-1 min-w-0">
                                    <div className="flex items-start gap-[3px]">
                                        <SealCheck size={20} weight="fill" color="#00b505" className="shrink-0" />
                                        <p className="font-bold text-[16px] text-[#333] tracking-[-0.4px] leading-[23px]">Total Amount To Pay Today</p>
                                    </div>
                                    <p className="font-medium text-[12px] text-[#545454] tracking-[-0.4px] leading-[16px]">Partial Monthly Rental Fees</p>
                                </div>
                                <span className="font-semibold text-[21px] text-[#00b505] tracking-[-0.8px] leading-[28px] whitespace-nowrap">₹{netPayToday}</span>
                            </div>
                            {/* Yellow dashed KYC note */}
                            <div className="bg-[#ffffe7] border-l border-r border-b border-dashed border-[#d19d00] rounded-b-[8px] flex gap-[8px] pt-[16px] pb-[8px] px-[18px] w-full">
                                <BsCreditCard size={15} className="shrink-0 mt-0.5 text-[#9A7F40]" />
                                <p className="font-bold text-[12px] text-[#545454] tracking-[-0.4px] leading-[16px] flex-1">
                                    By paying this amount, you are securing your order and proceeding to KYC verification. The remaining balance of your monthly rental will be charged only after your KYC is approved.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Payment confirmed flow (separate screen) ── */}
            {paymentConfirmed ? (
                <>
                    {/* Paid Card + Info Box */}
                    <div className="w-full">
                        <div
                            className="bg-white border border-[#e3e3e3] flex justify-between items-center w-full rounded-t-[8px]"
                            style={{ padding: '20px 18px', gap: '12px' }}
                        >
                            <div className="flex items-center gap-3">
                                <SealCheck size={20} weight="fill" color="hsla(161, 94%, 30%, 1)" className="shrink-0" />
                                <div className="flex flex-col">
                                    <p className="font-bold text-[16px] leading-[23px] text-[#333] tracking-[-0.4px] whitespace-nowrap">Total Amount Paid</p>
                                    <p className="font-medium text-[12px] leading-[16px] text-[#545454] tracking-[-0.4px] whitespace-nowrap">Partial Monthly Rental Fees</p>
                                </div>
                            </div>
                            <span className="font-semibold text-[21px] text-[#00b505] tracking-[-0.8px] whitespace-nowrap">₹{payToday}</span>
                        </div>
                        <div className="bg-[#ffffe7] border-l border-r border-b border-dashed border-[#d19d00] rounded-b-[8px] flex gap-[8px] pt-[16px] pb-[8px] px-[18px] w-full">
                            <BsCreditCard size={15} className="shrink-0 mt-0.5 text-[#9A7F40]" />
                            <div className="flex flex-col gap-1 flex-1">
                                <p className="font-bold text-[12px] leading-[16px] text-[#545454] tracking-[-0.4px]">
                                    You&apos;re all set! We&apos;ve received your payment, and your product is securely reserved. The last step before we can get your rental to you is a quick identity verification.
                                </p>
                                <p className="font-bold text-[12px] leading-[16px] text-[#545454] tracking-[-0.4px]">
                                    Please fill out the KYC form to get started. Don&apos;t worry, your rental billing only kicks off once everything is approved. We&apos;ll be in touch soon to schedule your delivery!
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Confirmed Banner */}
                    <div className="bg-[#cbffc5] border border-[#00b505] rounded-[8px] px-[16px] py-[8px] flex items-center justify-center w-full">
                        <span className="font-semibold text-[12px] leading-[16px] tracking-[-0.4px] text-[#028907] whitespace-nowrap">
                            🎉 Woohoo! Your Payment is Confirmed.
                        </span>
                    </div>
                </>
            ) : (
                <>
                    {/* Savings */}
                    {savedAmount > 0 && (
                        <div className="bg-[#cbffc5] border border-[#00b505] rounded-[8px] px-[16px] py-[8px] flex items-center justify-center w-full">
                            <span className="flex items-center gap-[5px] font-semibold text-[12px] leading-[16px] tracking-[-0.4px]">
                                <span className="text-black">🎉</span>
                                <span className="text-[#028907]">You saved ₹{savedAmount.toFixed(2)} on this order</span>
                            </span>
                        </div>
                    )}

                    {/* CTA */}
                    {showButton && (
                        <button
                            onClick={onCheckout}
                            className="w-full h-[40px] rounded-full flex items-center justify-center bg-[#ffcf46] px-[20px] py-[6px] transition-all"
                        >
                            <span className="font-medium text-[16px] leading-[23px] text-[#1f1f1f] tracking-[-0.4px]">{btnText}</span>
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

export default OrderSummary;
