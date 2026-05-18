import React from "react";
import { FaArrowRight } from "react-icons/fa";
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

                {/* Coupon Discount Line */}
                {couponDiscount > 0 && (
                    <>
                        <div className="border-t border-dashed border-green-300 my-2" />
                        <div className="flex justify-between text-sm font-semibold text-green-600">
                            <span>🎟️ Coupon {couponCode && `(${couponCode})`}</span>
                            <span>-₹{couponDiscount}</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold text-gray-900 mt-1">
                            <span>Net Payable</span>
                            <span>₹{netPayToday}</span>
                        </div>
                    </>
                )}
            </div>

            {/* PAYMENT CONFIRMED */}
            {paymentConfirmed ? (
                <>
                    {/* Combined Paid Card + Info Box */}
                    <div
                        style={{
                            width: '366px',
                            height: '216px',
                            borderBottomRightRadius: '8px',
                            borderBottomLeftRadius: '8px',
                            marginTop: '10px'
                        }}
                    >
                        {/* Paid Card */}
                        <div
                            style={{
                                width: '374px',
                                height: '81px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                border: '1px solid hsla(0, 0%, 89%, 1)',
                                borderRadius: '8px',
                                padding: '20px 18px',
                                background: 'hsla(0, 0%, 100%, 1)',
                                gap: '12px',
                                boxSizing: 'border-box'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        position: 'relative',
                                        flexShrink: 0
                                    }}
                                >
                                    <SealCheck
                                        size={18}
                                        weight="fill"
                                        color="hsla(161, 94%, 30%, 1)"
                                        style={{
                                            width: '17.5px',
                                            height: '17.5px',
                                            position: 'absolute',
                                            top: '1.25px',
                                            left: '1.25px'
                                        }}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <p
                                        style={{
                                            width: '139px',
                                            height: '23px',
                                            fontFamily: 'Mona Sans, sans-serif',
                                            fontWeight: '700',
                                            fontSize: '16px',
                                            lineHeight: '23px',
                                            letterSpacing: '-0.1px',
                                            color: 'hsla(0, 0%, 20%, 1)',
                                            marginTop: 0,
                                            marginRight: 0,
                                            marginBottom: 0,
                                            marginLeft: 0,
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        Total Amount Paid
                                    </p>
                                    <p
                                        style={{
                                            width: '147px',
                                            height: '16px',
                                            fontFamily: 'Mona Sans, sans-serif',
                                            fontWeight: '500',
                                            fontSize: '10px',
                                            lineHeight: '16px',
                                            letterSpacing: '-0.2px',
                                            color: 'hsla(0, 0%, 33%, 1)',
                                            marginTop: 0,
                                            marginRight: 0,
                                            marginBottom: 0,
                                            marginLeft: 0,
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        Partial Monthly Rental Fees
                                    </p>
                                </div>
                            </div>
                            <p style={{ fontFamily: 'Mona Sans, sans-serif', fontWeight: '700', fontSize: '20px', color: 'hsla(122, 100%, 35%, 1)', margin: 0 }}>
                                ₹{payToday}
                            </p>
                        </div>

                        {/* Info Box */}
                        <div
                            style={{
                                width: '374px',
                                height: '130px',
                                backgroundColor: 'hsla(60, 100%, 95%, 1)',
                                padding: '16px 18px 8px 18px',
                                borderBottomRightRadius: '8px',
                                borderBottomLeftRadius: '8px',
                                borderLeft: '1px dashed hsla(45, 100%, 41%, 1)',
                                borderRight: '1px dashed hsla(45, 100%, 41%, 1)',
                                borderBottom: '1px dashed hsla(45, 100%, 41%, 1)',
                                borderTop: '0px',
                                display: 'flex',
                                gap: '8px',
                                boxSizing: 'border-box'
                            }}
                        >
                            <div style={{ flexShrink: 0, marginTop: '2px' }}>
                                <BsCreditCard size={18} style={{ color: 'hsla(45, 70%, 40%, 1)' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <p
                                    style={{
                                        width: '307px',
                                        height: '48px',
                                        fontFamily: 'Mona Sans, sans-serif',
                                        fontWeight: 700,
                                        fontSize: '10px',
                                        lineHeight: '14px',
                                        letterSpacing: '-0.2px',
                                        color: 'hsla(0, 0%, 33%, 1)',
                                        margin: 0,
                                        overflow: 'hidden'
                                    }}
                                >
                                    You&apos;re all set! We&apos;ve received your payment, and your product is securely reserved. The last step before we can get your rental to you is a quick identity verification.
                                </p>
                                <p
                                    style={{
                                        width: '307px',
                                        height: '50px',
                                        fontFamily: 'Mona Sans, sans-serif',
                                        fontWeight: 700,
                                        fontSize: '10px',
                                        lineHeight: '14px',
                                        letterSpacing: '-0.2px',
                                        color: 'hsla(0, 0%, 33%, 1)',
                                        margin: 0,
                                        overflow: 'hidden'
                                    }}
                                >
                                    Please fill out the KYC form to get started. Don&apos;t worry, your rental billing only kicks off once everything is approved. We&apos;ll be in touch soon to schedule your delivery!
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Confirmed Banner */}
                    <div
                        style={{
                            width: '366px',
                            height: '32px',
                            borderRadius: '8px',
                            border: '1px solid hsla(161, 94%, 30%, 1)',
                            gap: '12px',
                            padding: '8px 16px',
                            background: 'hsla(149, 80%, 90%, 1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: '8px',
                            boxSizing: 'border-box'
                        }}
                    >
                        <span
                            style={{
                                fontFamily: 'Mona Sans, sans-serif',
                                fontWeight: 600,
                                fontSize: '12px',
                                color: 'hsla(161, 94%, 30%, 1)',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            🎉 Woohoo! Your Payment is Confirmed.
                        </span>
                    </div>
                </>

            ) : (
                <>
                    {/* Total Amount & Info Container */}
                    <div className="mt-5 w-full">
                        {/* Header Box (White) */}
                        <div
                            className="bg-white border border-[#E3E3E3] flex justify-between items-center w-full"
                            style={{
                                height: '81px',
                                padding: '20px 18px',
                                borderRadius: '8px 8px 0 0', // Top rounded-8px, bottom 0 for stacking
                                border: '1px solid hsla(0, 0%, 89%, 1)',
                                gap: '12px'
                            }}
                        >
                            <div className="flex gap-3">
                                <div className="mt-[-4px]">
                                    <SealCheck
                                        size={32}
                                        weight="fill"
                                        color="hsla(122, 100%, 35%, 1)"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[14px] font-bold text-[#1D1D1F] leading-tight">Total Amount To Pay Today</span>
                                    <span className="text-[12px] text-[#6E6E73] mt-1">Partial Monthly Rental Fees</span>
                                </div>
                            </div>
                            <span className="text-[20px] font-bold text-[#17B31B]">₹{netPayToday}</span>
                        </div>

                        {/* Info Box (Yellow) */}
                        <div
                            className="p-4 flex gap-2 w-full"
                            style={{
                                height: '88px',
                                backgroundColor: 'hsla(60, 100%, 95%, 1)',
                                padding: '16px 18px 8px 18px',
                                borderBottomRightRadius: '8px',
                                borderBottomLeftRadius: '8px',
                                borderLeft: '1px dashed hsla(45, 100%, 41%, 1)',
                                borderRight: '1px dashed hsla(45, 100%, 41%, 1)',
                                borderBottom: '1px dashed hsla(45, 100%, 41%, 1)',
                                borderTop: '0px',
                                gap: '8px'
                            }}
                        >
                            <div className="shrink-0 mt-0.5">
                                <BsCreditCard size={18} className="text-[#9A7F40]" />
                            </div>
                            <p
                                className="tracking-tight"
                                style={{
                                    fontFamily: "'Mona Sans', sans-serif",
                                    fontWeight: 700,
                                    fontSize: '12px',
                                    lineHeight: '16px',
                                    color: 'hsla(0, 0%, 33%, 1)',
                                    flex: 1
                                }}
                            >
                                By paying this amount, you are securing your order and proceeding to KYC verification.
                                The remaining balance of your monthly rental will be charged only after your KYC is approved.
                            </p>
                        </div>
                    </div>

                    {/* Savings */}
                    {savedAmount > 0 && (
                        <div
                            className="mt-4 flex items-center justify-center w-full"
                            style={{
                                height: '32px',
                                backgroundColor: 'hsla(114, 100%, 89%, 1)',
                                border: '1px solid hsla(122, 100%, 35%, 1)',
                                borderRadius: '8px',
                                padding: '8px 16px',
                                gap: '12px'
                            }}
                        >
                            <span
                                className="font-medium text-center"
                                style={{
                                    fontFamily: "'Mona Sans', sans-serif",
                                    fontSize: '14px',
                                    lineHeight: '1',
                                    color: 'hsla(122, 100%, 35%, 1)'
                                }}
                            >
                                🎉 You saved ₹{savedAmount.toFixed(2)} on this order
                            </span>
                        </div>
                    )}

                    {/* CTA */}
                    {showButton && (
                        <button
                            onClick={onCheckout}
                            className="mt-5 w-full rounded-full flex items-center justify-center transition-all shadow-sm"
                            style={{
                                height: '40px',
                                backgroundColor: 'hsla(44, 100%, 64%, 1)',
                                padding: '6px 20px',
                                gap: '2px',
                                opacity: 1,
                                border: 'none',
                                fontFamily: "'Mona Sans', sans-serif",
                                fontWeight: 500,
                                fontSize: '16px',
                                lineHeight: '23px',
                                color: 'hsla(0, 0%, 12%, 1)'
                            }}
                        >
                            {btnText}
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

export default OrderSummary;
