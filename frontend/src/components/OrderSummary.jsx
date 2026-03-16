import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { BsCreditCard } from 'react-icons/bs';

const OrderSummary = ({
    securityAmount,
    deliveryCharges,
    monthlyRentTotal,
    totalGST,
    totalOneTime,
    payToday,
    savedAmount,
    onCheckout,
    btnText = "Continue to checkout",
    showButton = true,
    paymentConfirmed = false,
}) => {
    return (
        <div className="w-full bg-white rounded-2xl shadow-[0_6px_24px_rgba(0,0,0,0.08)] px-3.5 py-4 font-sans">

            {/* Header */}
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Order Summary
            </h2>

            {/* Summary Box */}
            <div className="border border-gray-200 rounded-lg px-3 py-2">

                {/* One Time Payment */}
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    One Time Payment
                </h3>

                <div className="flex justify-between text-sm text-gray-900 mb-1">
                    <span>Security Amount</span>
                    <span>₹{securityAmount}</span>
                </div>

                <div className="flex justify-between text-sm text-gray-900">
                    <span>Delivery Charges</span>
                    <span>₹{deliveryCharges}</span>
                </div>

                <div className="border-t border-gray-500 my-3" />

                {/* Monthly Rental */}
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Monthly Rental Breakdown
                </h3>

                <div className="flex justify-between text-sm text-gray-900 mb-1">
                    <span>Monthly Rent</span>
                    <span>₹{monthlyRentTotal}/mo</span>
                </div>

                <div className="flex justify-between text-sm text-gray-900">
                    <span>GST*</span>
                    <span>₹{totalGST}/mo</span>
                </div>

                <div className="border-t border-gray-500 my-3" />

                <div className="flex justify-between text-sm font-semibold text-gray-900">
                    <span>Subtotal (incl. GST)</span>
                    <span>₹{totalOneTime}</span>
                </div>
            </div>

            {/* PAYMENT CONFIRMED */}
            {paymentConfirmed ? (
                <>
                    {/* Paid Card */}
                    <div className="mt-2.5 flex justify-between items-center  border border-gray-300 rounded-lg px-5 py-4">
                        <div className="flex items-start gap-3">
                            <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-bold">
                                ✓
                            </span>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">
                                    Total Amount Paid
                                </p>
                                <p className="text-xs text-gray-600">
                                    Partial Monthly Rental Fees
                                </p>
                            </div>
                        </div>

                        <p className="text-2xl font-semibold text-emerald-600">
                            ₹{payToday}
                        </p>
                    </div>

                    {/* Yellow Info Box */}
                    {/* Yellow Info Box */}
                    <div className="
  max-w-[420px]
  bg-yellow-50
  border border-dashed border-yellow-400
  rounded-2xl
  px-5 py-4
  text-sm
  text-gray-700
  leading-relaxed">
                        <div className="flex items-start gap-2">
                            <div className="text-[#9A7F40]">
                                <BsCreditCard size={20} />
                            </div>

                            <div className="text-[12px] font-medium text-gray-500">
                                <p className="mb-4">
                                    You&apos;re all set! We&apos;ve received your payment, and your product is securely reserved. The last step before we can get your rental to you is a quick identity verification.
                                </p>
                                <p>
                                    Please fill out the KYC form to get started. Don&apos;t worry, your rental billing only kicks off once everything is approved. We&apos;ll be in touch soon to schedule your delivery!
                                </p>
                            </div>
                        </div>
                    </div>


                    {/* Confirmed Button */}
                    <button
                        disabled
                        className="mt-5 w-full rounded-xl border border-emerald-400 bg-emerald-100 text-emerald-700 font-semibold py-3 text-sm cursor-default"
                    >
                        🎉 Woohoo! Your Payment is Confirmed.
                    </button>
                </>
            ) : (
                <>
                    {/* Pending Payment */}
                    <div className="mt-5 flex justify-between items-center bg-gray-50 border border-gray-200 rounded-xl px-5 py-4">
                        <div className="flex items-start gap-3">
                            <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold">
                                ✓
                            </span>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">
                                    Total Amount To Pay
                                </p>
                                <p className="text-xs text-gray-600">
                                    Partial Monthly Rental Fees
                                </p>
                            </div>
                        </div>

                        <p className="text-2xl font-bold text-emerald-600">
                            ₹{payToday}
                        </p>
                    </div>

                    {/* Info */}
                    <div className="mt-5 bg-yellow-50 border border-dashed border-yellow-400 rounded-xl px-5 py-4 text-sm text-gray-800">
                        By paying this amount, you are securing your order and proceeding to KYC
                        verification. The remaining balance will be charged only after approval.
                    </div>

                    {/* Savings */}
                    {savedAmount > 0 && (
                        <div className="mt-4 bg-green-50 border border-green-200 rounded-xl py-2 px-4 text-center">
                            <span className="text-sm font-medium text-green-800">
                                🎉 You saved ₹{savedAmount.toFixed(2)} on this order
                            </span>
                        </div>
                    )}

                    {/* CTA */}
                    {showButton && (
                        <button
                            onClick={onCheckout}
                            className="mt-5 w-full rounded-xl bg-[#FFD740] hover:bg-[#FFC400] text-[#1D1D1F] font-bold py-3 text-sm flex items-center justify-center gap-2 shadow-sm transition"
                        >
                            {btnText} <FaArrowRight className="text-xs" />
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

export default OrderSummary;
