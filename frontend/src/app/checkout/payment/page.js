'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaCreditCard, FaRegCheckCircle, FaLock } from 'react-icons/fa';
import { BsBank, BsPhone, BsWallet2 } from 'react-icons/bs';
import { SiPaytm, SiGooglepay, SiPhonepe } from 'react-icons/si';
import OrderSummary from '../../../components/OrderSummary';

export default function PaymentPage() {
    const router = useRouter();
    const [selectedMethod, setSelectedMethod] = useState('card');

    const handlePay = () => {
        // Handle payment processing logic here
        alert(`Processing payment via ${selectedMethod}... Success! Order Placed.`);
        router.push('/order-confirmation'); // Navigate to success page
    };

    // Mock calculations
    const securityAmount = 5000;
    const deliveryCharges = 400;
    const monthlyRentTotal = 1100;
    const totalGST = 120;
    const totalOneTime = 6620;
    const payToday = 600;
    const savedAmount = 4030.00;

    const paymentMethods = [
        {
            id: 'card',
            title: 'Credit / Debit Card',
            icon: <FaCreditCard size={20} />,
            description: 'Visa, Mastercard, RuPay'
        },
        {
            id: 'upi',
            title: 'UPI',
            icon: <BsPhone size={20} />,
            description: 'Google Pay, PhonePe, Paytm',
            logos: [<SiGooglepay key="gpay" />, <SiPhonepe key="phonepe" />, <SiPaytm key="paytm" />]
        },
        {
            id: 'netbanking',
            title: 'Net Banking',
            icon: <BsBank size={20} />,
            description: 'All major banks supported'
        },
        {
            id: 'wallet',
            title: 'Wallets',
            icon: <BsWallet2 size={20} />,
            description: 'Amazon Pay, MobiKwik, Freecharge'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="text-xs text-gray-500 mb-6 flex items-center gap-2">
                    <Link href="/checkout/kyc" className="hover:text-black">KYC</Link>
                    <span>›</span>
                    <span className="text-black font-medium">Payment</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column: Payment Methods */}
                    <div className="lg:w-2/3">
                        <h1 className="text-3xl font-medium text-gray-900 mb-6">Payment Method</h1>

                        <div className="space-y-4">
                            {paymentMethods.map((method) => (
                                <div
                                    key={method.id}
                                    onClick={() => setSelectedMethod(method.id)}
                                    className={`bg-white p-6 rounded-2xl border cursor-pointer transition-all flex items-start gap-4 ${selectedMethod === method.id ? 'border-black ring-1 ring-black shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
                                >
                                    <div className={`mt-1 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${selectedMethod === method.id ? 'border-black' : 'border-gray-300'}`}>
                                        {selectedMethod === method.id && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <div className="text-gray-700">{method.icon}</div>
                                            <h3 className="text-lg font-medium text-gray-900">{method.title}</h3>
                                        </div>
                                        <p className="text-gray-500 text-sm">{method.description}</p>

                                        {method.logos && (
                                            <div className="flex gap-3 mt-3 text-gray-600">
                                                {method.logos.map((logo, idx) => (
                                                    <span key={idx} className="text-xl">{logo}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pay Button */}
                        <div className="mt-8 p-6 bg-gray-100 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-2 text-gray-600 text-sm">
                                <FaLock />
                                <span>Payments are 100% secure and encrypted</span>
                            </div>
                            <button
                                onClick={handlePay}
                                className="bg-[#FFD740] hover:bg-[#FFC400] text-[#1D1D1F] px-10 py-3.5 rounded-full text-lg font-medium shadow-md transition-all hover:scale-105"
                            >
                                Pay ₹{payToday}
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:w-1/3 mt-6 lg:mt-14">
                        <OrderSummary
                            securityAmount={securityAmount}
                            deliveryCharges={deliveryCharges}
                            monthlyRentTotal={monthlyRentTotal}
                            totalGST={totalGST}
                            totalOneTime={totalOneTime}
                            payToday={payToday}
                            savedAmount={savedAmount}
                            showButton={false}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
