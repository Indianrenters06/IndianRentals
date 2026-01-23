'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { HiOutlineSparkles } from 'react-icons/hi';
import { BsCheckCircleFill, BsCreditCard } from 'react-icons/bs';
import { FaArrowRight, FaShoppingCart } from 'react-icons/fa';
import { IoIosArrowDown } from "react-icons/io";
import { AiOutlineClose } from "react-icons/ai";

import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, updateCartItem, removeFromCart } from '../../redux/features/cartSlice';
import OrderSummary from '../../components/OrderSummary';

const CartItem = ({ item, onUpdate, onRemove }) => {
    const [isDurationOpen, setIsDurationOpen] = useState(false);
    const tenureOptions = [1, 3, 6, 9, 12];

    return (
        <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-sm relative">
            {/* Top Section: Image and Details */}
            <div className="flex items-start gap-4 mb-4">
                {/* Image */}
                <div className="w-16 h-16 relative shrink-0 rounded-lg overflow-hidden bg-white border border-gray-100">
                    {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50 text-[10px]">No Img</div>
                    )}
                </div>

                {/* Title & Desc */}
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <h3 className="text-base font-bold text-gray-900 leading-tight mt-2">{item.name}</h3>
                        <button
                            onClick={() => onRemove(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                        >
                            <RiDeleteBin6Line size={18} />
                        </button>
                    </div>
                    <p className="text-gray-800 font-medium text-sm mt-1 leading-relaxed">{item.description}</p>
                </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-200 w-full mb-4"></div>

            {/* Bottom Section: Controls & Pricing */}
            <div className="flex flex-wrap items-center justify-between gap-4">

                {/* Left Controls: Duration & Quantity */}
                <div className="flex items-center gap-4">
                    {/* Duration Dropdown Look-alike */}
                    <div className="relative">
                        <button
                            onClick={() => setIsDurationOpen(!isDurationOpen)}
                            className="flex items-center justify-between gap-3 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 font-medium min-w-[110px]"
                        >
                            <span>{item.duration} months</span>
                            <IoIosArrowDown className={`text-gray-400 transition-transform ${isDurationOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {isDurationOpen && (
                            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                                {tenureOptions.map((months) => (
                                    <button
                                        key={months}
                                        onClick={() => {
                                            // We just update the duration here. In a real app, price should update too.
                                            onUpdate(item.id, { duration: months });
                                            setIsDurationOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between"
                                    >
                                        <span>{months} Months</span>
                                        {item.duration === months && <BsCheckCircleFill className="text-[#00C853] text-xs" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Vertical Divider */}
                    <div className="h-8 w-px bg-gray-300"></div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-gray-300 rounded-lg h-[38px] px-3 bg-white">
                        <button
                            onClick={() => onUpdate(item.id, { quantity: Math.max(1, item.quantity - 1) })}
                            className="text-gray-500 hover:text-black px-2 disabled:opacity-30"
                            disabled={item.quantity <= 1}
                        >
                            <span className="text-lg leading-none mb-0.5 block">–</span>
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-gray-900">{item.quantity}</span>
                        <button
                            onClick={() => onUpdate(item.id, { quantity: item.quantity + 1 })}
                            className="text-gray-500 hover:text-black px-2"
                        >
                            <span className="text-lg leading-none mb-0.5 block">+</span>
                        </button>
                    </div>
                </div>

                {/* Vertical Divider (Hidden on mobile) */}
                <div className="hidden md:block h-8 w-px bg-gray-300 mx-2"></div>

                {/* Right Pricing */}
                <div className="flex items-center gap-6 md:gap-8 ml-auto md:ml-0">
                    <div className="flex flex-col items-center">
                        <span className="text-sm text-gray-500 font-medium">Monthly Rent</span>
                        <span className="font-bold text-gray-900 text-lg">₹{(item.monthlyRent || item.price) * item.quantity}</span>
                    </div>

                    <div className="h-8 w-px bg-gray-300"></div>

                    <div className="flex flex-col items-center">
                        <span className="text-sm text-gray-500 font-medium">Refundable Amount</span>
                        <span className="font-bold text-gray-900 text-lg">₹{item.refundableAmount * item.quantity}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function CartPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const cartItems = useSelector(selectCartItems);

    const [couponCode, setCouponCode] = useState("");
    const [isCouponApplied, setIsCouponApplied] = useState(false);

    const handleApplyCoupon = () => {
        if (couponCode.trim()) {
            setIsCouponApplied(true);
        }
    };

    const handleRemoveCoupon = () => {
        setIsCouponApplied(false);
        setCouponCode("");
    };

    const updateItem = (id, updates) => {
        let finalUpdates = { ...updates };

        // If updating duration, try to find new price from item's tenures
        if (updates.duration) {
            const item = cartItems.find(i => i.id === id);
            if (item && item.tenures) {
                const newPlan = item.tenures.find(t => updates.duration <= t.months) || item.tenures[item.tenures.length - 1];
                if (newPlan) {
                    finalUpdates.monthlyRent = newPlan.price;
                }
            }
        }

        dispatch(updateCartItem({ id, ...finalUpdates }));
    };

    const removeItem = (id) => {
        dispatch(removeFromCart(id));
    };

    // Calculations
    const securityAmount = cartItems.reduce((acc, item) => acc + (item.refundableAmount * item.quantity), 0);
    const deliveryCharges = cartItems.length > 0 ? 400 : 0;

    const monthlyRentTotal = cartItems.reduce((acc, item) => acc + ((item.monthlyRent || item.price) * item.quantity), 0);
    const totalGST = Math.round(monthlyRentTotal * 0.18);

    const totalOneTime = securityAmount + deliveryCharges + monthlyRentTotal + totalGST;

    // Partial Logic - adjusted for demo or logic
    const payToday = cartItems.length > 0 ? 600 : 0;
    const savedAmount = 4030.00;

    return (
        <div className="min-h-screen bg-gray-50 py-4 px-4 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column: Cart Items */}
                    <div className="lg:w-2/3">
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3 mb-6">
                            Your Cart <FaShoppingCart className="text-gray-600 text-3xl" />
                        </h1>

                        {/* Dashed Box Container */}
                        <div className="border-2 border-dashed border-gray-300 rounded-[30px] p-6 lg:p-8">
                            <div className="space-y-4">
                                {cartItems.map(item => (
                                    <CartItem
                                        key={item.id}
                                        item={item}
                                        onUpdate={updateItem}
                                        onRemove={removeItem}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sidebar */}
                    <div className="lg:w-1/3 flex flex-col gap-6 mt-14.5">

                        {/* Coupon Section */}
                        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                            <div className="flex gap-3 mb-4">
                                <input
                                    type="text"
                                    placeholder="Enter Your Coupon Code"
                                    className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-1 text-l font-med outline-none focus:border-black transition-colors text-gray-900"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                />
                                <button
                                    onClick={handleApplyCoupon}
                                    className="bg-[#2D2D2D] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors shadow-sm"
                                >
                                    Apply
                                </button>
                            </div>
                            <button className="w-full bg-[#FFC72C] text-black font-semibold py-2 rounded-full flex items-center justify-center gap-2 hover:bg-[#FFD740] transition-colors text-sm shadow-sm">
                                View All Coupons <FaArrowRight size={14} className="mt-0.5" />
                            </button>
                        </div>

                        {/* Coupon Activated Message */}
                        {isCouponApplied && (
                            <div className="bg-[#E8F8F0] border border-[#d0f0e0] rounded-l p-3 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-black font-bold">
                                    <HiOutlineSparkles className="text-lg text-[#007F5F]" />
                                    <span>“{couponCode}” Activated</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[#007F5F] font-medium text-sm">Applied</span>
                                    <button
                                        onClick={handleRemoveCoupon}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <AiOutlineClose />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Order Summary */}
                        <OrderSummary
                            securityAmount={securityAmount}
                            deliveryCharges={deliveryCharges}
                            monthlyRentTotal={monthlyRentTotal}
                            totalGST={totalGST}
                            totalOneTime={totalOneTime}
                            payToday={payToday}
                            savedAmount={savedAmount}
                            onCheckout={() => router.push('/checkout/address')}
                        />

                    </div>
                </div>
            </div>
        </div>
    );
}
