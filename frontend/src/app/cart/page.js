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
import { selectCartItems, selectCartTotals, updateCartItem, removeFromCart } from '../../redux/features/cartSlice';
import OrderSummary from '../../components/OrderSummary';

const CartItem = ({ item, onUpdate, onRemove }) => {
    const [isDurationOpen, setIsDurationOpen] = useState(false);
    const tenureOptions = [1, 3, 6, 9, 12];

    return (
        <div className="bg-white p-5 rounded-[12px] border border-[#E3E3E3] shadow-[0px_2px_4px_rgba(0,0,0,0.02)] relative transition-all hover:shadow-md">
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
    const totals = useSelector(selectCartTotals);
    const { securityAmount, deliveryCharges, monthlyRentTotal, totalGST, totalOneTime, payToday, savedAmount } = totals;

    const [couponCode, setCouponCode] = useState('');
    const [isCouponApplied, setIsCouponApplied] = useState(false);

    const handleApplyCoupon = () => { if (couponCode.trim()) setIsCouponApplied(true); };
    const handleRemoveCoupon = () => { setIsCouponApplied(false); setCouponCode(''); };

    const updateItem = (id, updates) => {
        let finalUpdates = { ...updates };
        if (updates.duration) {
            const item = cartItems.find(i => i.id === id);
            if (item?.tenures) {
                const plan = item.tenures.find(t => updates.duration <= t.months) || item.tenures[item.tenures.length - 1];
                if (plan) finalUpdates.monthlyRent = plan.price;
            }
        }
        dispatch(updateCartItem({ id, ...finalUpdates }));
    };
    const removeItem = (id) => dispatch(removeFromCart(id));

    // Empty Cart State

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
                <div className="bg-white p-10 rounded-3xl shadow-lg text-center max-w-md w-full border border-gray-100">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaShoppingCart className="text-[#3B82F6] text-3xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Your Cart is Empty</h2>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                        Looks like you haven't added anything to your cart yet.
                        <br />
                        Click below to start shopping!
                    </p>
                    <Link
                        href="/categories"
                        className="inline-block bg-[#3B82F6] hover:bg-[#2563EB] text-white px-8 py-3 rounded-full font-medium transition-all shadow-md hover:shadow-lg w-full"
                    >
                        Click to order something
                    </Link>
                </div>
            </div>
        );
    }
    return (
        <div className="w-full bg-[#F5F5F5] min-h-screen font-sans" style={{ opacity: 1 }}>
            <div className="max-w-[1440px] mx-auto pt-[48px] pb-[48px]" style={{ height: '935px' }}>
                <div 
                    className="mx-auto flex flex-col gap-[16px] md:pr-[20px]" 
                    style={{ width: '1200px', height: '813px' }}
                >
                    {/* Breadcrumb */}
                    <nav
                        className="text-[12px] text-[#808080] flex items-center gap-[8px]"
                        style={{ width: '1200px', height: '16px' }}
                    >
                        <span>$[Product-Page]</span>
                        <Image src="/chevron-right.svg" width={12} height={12} alt=">" className="opacity-60" />
                        <span className="font-semibold text-[#1A1A1A] uppercase tracking-wider">Cart</span>
                    </nav>

                    <h1 className="text-[32px] font-bold text-gray-900 flex items-center gap-3 mb-4">
                        Your Cart <FaShoppingCart className="text-gray-600 pb-1" size={32} />
                    </h1>

                    <div className="flex flex-col lg:flex-row gap-[32px] items-start">
                        {/* Left Column: Cart Items */}
                        <div
                            className="flex-col gap-[12px] flex p-[20px] bg-white rounded-[12px] border border-[#F0F0F0] shadow-sm"
                            style={{ width: '746px', height: '632px' }}
                        >
                            {cartItems.map(item => (
                                <CartItem
                                    key={item.id}
                                    item={item}
                                    onUpdate={updateItem}
                                    onRemove={removeItem}
                                />
                            ))}
                        </div>

                        {/* Right Column: Sidebar */}
                        <div
                            className="flex flex-col gap-[20px]"
                            style={{ width: '402px', height: '813px' }}
                        >
                            {/* Coupon Section */}
                            <div className="bg-white p-5 rounded-2xl border border-[#E3E3E3] shadow-sm">
                                <div className="flex gap-2 mb-4">
                                    <input
                                        type="text"
                                        placeholder="Enter Your Coupon Code"
                                        className="flex-1 bg-white border border-[#D3D3D3] rounded-lg px-4 py-2 text-sm outline-none focus:border-black transition-colors text-gray-900 font-sans"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                    />
                                    <button
                                        onClick={handleApplyCoupon}
                                        className="bg-[#2D2D2D] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-black transition-colors"
                                    >
                                        Apply
                                    </button>
                                </div>
                                <button className="w-full bg-[#FFC72C] text-black font-bold py-2.5 rounded-full flex items-center justify-center gap-2 hover:bg-[#FFD740] transition-colors text-sm shadow-sm font-sans tracking-tight">
                                    View All Coupons
                                </button>
                            </div>

                            {/* Coupon Activated Message */}
                            {isCouponApplied && (
                                <div className="bg-[#E8F8F0] border border-[#C6EDD8] rounded-[10px] py-1 px-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-900 font-bold text-[15px] font-sans">
                                        <HiOutlineSparkles className="text-lg text-[#007F5F]" />
                                        <span>“{couponCode}” Activated</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[#00C853] font-bold text-sm font-sans">Applied</span>
                                        <button
                                            onClick={handleRemoveCoupon}
                                            className="text-gray-400 hover:text-gray-600 p-1"
                                        >
                                            <AiOutlineClose size={16} />
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
        </div>
    );
}
