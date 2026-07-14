'use client';

import React, { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { FaCreditCard, FaRegCheckCircle, FaLock, FaSpinner } from 'react-icons/fa';
import { BsBank, BsPhone, BsWallet2 } from 'react-icons/bs';
import { SiPaytm, SiGooglepay, SiPhonepe } from 'react-icons/si';
import { selectCartTotals, selectCartItems, clearCart } from '../../../redux/features/cartSlice';
import OrderSummary from '../../../components/OrderSummary';
import { API_BASE_URL } from '../../../services/apiConfig';
import { getCashfree } from '../../../services/cashfree';

export default function PaymentPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const totals = useSelector(selectCartTotals);
    const cartItems = useSelector(selectCartItems);
    const { securityAmount, deliveryCharges, monthlyRentTotal, totalGST, totalOneTime, payToday, savedAmount, couponDiscount, couponCode, netPayToday } = totals;

    const [selectedMethod, setSelectedMethod] = useState('card');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handlePay = async () => {
        if (!cartItems || cartItems.length === 0) {
            alert('Your cart is empty');
            return;
        }

        // Guard: cart items must carry a valid Mongo ObjectId (24-hex) for `product`.
        // Stale/mock items (e.g. slug ids like "macbook-pro-14-m4") saved in localStorage
        // would otherwise blow up server-side with a cryptic BSONError.
        const isValidObjectId = (id) => typeof id === 'string' && /^[a-f\d]{24}$/i.test(id);
        const invalidItems = cartItems.filter(item => !isValidObjectId(item.id));
        if (invalidItems.length > 0) {
            setError(
                `Some items in your cart are outdated and can no longer be ordered: ` +
                `${invalidItems.map(i => i.name).join(', ')}. ` +
                `Please remove them from the cart (or clear the cart) and add the product again.`
            );
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            if (!userInfo.token) {
                alert('Please log in to place an order');
                router.push('/login');
                return;
            }

            const shippingAddressRaw = localStorage.getItem('shippingAddress');
            if (!shippingAddressRaw) {
                alert('Shipping address is missing. Please go back and select an address.');
                return;
            }
            const shippingAddress = JSON.parse(shippingAddressRaw);

            const orderItems = cartItems.map(item => ({
                name: item.name,
                qty: item.quantity,
                image: item.image,
                price: item.monthlyRent || item.price,
                securityDeposit: item.refundableAmount || 0,
                product: item.id
            }));

            const maxDuration = Math.max(...cartItems.map(item => item.duration || 1));
            const startDate = new Date();
            const endDate = new Date();
            endDate.setMonth(startDate.getMonth() + maxDuration);

            const orderData = {
                orderItems,
                shippingAddress: {
                    address: shippingAddress.addressLine,
                    city: shippingAddress.city,
                    postalCode: shippingAddress.pincode,
                    country: shippingAddress.country || 'India',
                    phone: shippingAddress.phone
                },
                paymentMethod: selectedMethod,
                itemsPrice: monthlyRentTotal,
                taxPrice: totalGST,
                shippingPrice: deliveryCharges,
                couponCode,
                couponDiscount,
                totalPrice: netPayToday,
                rentalPeriod: {
                    startDate,
                    endDate,
                    durationMonths: maxDuration
                }
            };

            // 1) Create the rental (unpaid) in our backend.
            const res = await fetch(`${API_BASE_URL}/api/rentals`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`
                },
                body: JSON.stringify(orderData)
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Failed to create order');
            }

            const rentalId = data._id;

            // 2) Create a Cashfree order for this rental.
            const orderRes = await fetch(`${API_BASE_URL}/api/payments/cashfree/order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`
                },
                body: JSON.stringify({ rentalId })
            });
            const orderInfo = await orderRes.json();
            if (!orderRes.ok) {
                throw new Error(orderInfo.message || 'Failed to start payment');
            }

            const goToConfirmation = () => {
                dispatch(clearCart());
                const params = new URLSearchParams({
                    amount: String(netPayToday),
                    orderId: rentalId
                });
                router.push(`/order-confirmation?${params.toString()}`);
            };

            // Rental was already settled (e.g. a retried, already-paid order).
            if (orderInfo.alreadyPaid) {
                goToConfirmation();
                return;
            }

            // 3) Open the Cashfree checkout modal.
            const cashfree = await getCashfree(orderInfo.mode);
            const result = await cashfree.checkout({
                paymentSessionId: orderInfo.paymentSessionId,
                redirectTarget: '_modal',
            });

            if (result?.error) {
                // User closed the modal or payment failed — keep the cart/order intact.
                throw new Error(result.error.message || 'Payment was cancelled or failed.');
            }

            // 4) Confirm the payment server-side (authoritative check with Cashfree).
            const verifyRes = await fetch(`${API_BASE_URL}/api/payments/cashfree/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`
                },
                body: JSON.stringify({ rentalId })
            });
            const verifyInfo = await verifyRes.json();

            if (verifyRes.ok && verifyInfo.paid) {
                goToConfirmation();
            } else {
                throw new Error('We could not confirm your payment. If money was debited, it will be verified shortly — please check your orders.');
            }

        } catch (err) {
            console.error('Payment error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

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

                        {error && (
                            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl border border-red-200">
                                {error}
                            </div>
                        )}

                        {/* Pay Button */}
                        <div className="mt-8 p-6 bg-gray-100 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-2 text-gray-600 text-sm">
                                <FaLock />
                                <span>Payments are 100% secure and encrypted</span>
                            </div>
                            <button
                                onClick={handlePay}
                                disabled={loading}
                                className="bg-[#FFD740] hover:bg-[#FFC400] disabled:opacity-70 disabled:hover:scale-100 text-[#1D1D1F] px-10 py-3.5 rounded-full text-lg font-medium shadow-md transition-all hover:scale-105 flex items-center gap-2"
                            >
                                {loading ? <FaSpinner className="animate-spin" /> : null}
                                {loading ? 'Processing...' : `Pay ₹${netPayToday}`}
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
                            couponDiscount={couponDiscount}
                            couponCode={couponCode}
                            showButton={false}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
