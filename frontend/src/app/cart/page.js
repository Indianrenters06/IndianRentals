'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { HiOutlineSparkles } from 'react-icons/hi';
import { BsCheckCircleFill, BsCreditCard } from 'react-icons/bs';
import { FaArrowRight, FaSpinner } from 'react-icons/fa';
import { IoIosArrowDown } from "react-icons/io";
import { AiOutlineClose } from "react-icons/ai";
import { ShoppingCartSimple } from '@phosphor-icons/react';

import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectCartTotals, updateCartItem, removeFromCart, setCoupon, removeCoupon } from '../../redux/features/cartSlice';
import OrderSummary from '../../components/OrderSummary';
import { API_BASE_URL } from '../../services/apiConfig';

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
    const { securityAmount, deliveryCharges, monthlyRentTotal, totalGST, totalOneTime, payToday, savedAmount, couponDiscount, couponCode: appliedCouponCode } = totals;

    const [couponCode, setCouponCodeInput] = useState('');
    const [couponError, setCouponError] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);

    const handleApplyCoupon = async () => {
        const code = couponCode.trim();
        if (!code) return;
        setCouponError('');
        setCouponLoading(true);
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            const token = userInfo?.token;
            const res = await fetch(`${API_BASE_URL}/api/coupons/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ code, orderAmount: payToday }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Invalid coupon');
            dispatch(setCoupon({ code: data.code, discountAmount: data.discountAmount, description: data.description }));
        } catch (err) {
            setCouponError(err.message);
            dispatch(removeCoupon());
        } finally {
            setCouponLoading(false);
        }
    };

    const handleRemoveCoupon = () => {
        dispatch(removeCoupon());
        setCouponCodeInput('');
        setCouponError('');
    };

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
                        <ShoppingCartSimple className="text-[#3B82F6]" size={36} weight="bold" />
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
            <div className="max-w-[1200px] mx-auto px-4 md:px-8 pt-[48px] pb-[48px]">
                <div
                    className="flex flex-col gap-[16px]"
                >
                    {/* Breadcrumb */}
                    <nav
                        className="text-[12px] text-[#808080] flex items-center gap-[8px] mb-[16px]"
                    >
                        <span>$[Product-Page]</span>
                        <span className="text-[#808080] text-[12px]">›</span>
                        <span style={{
                            fontFamily: "'Mona Sans', sans-serif",
                            fontWeight: 600,
                            fontSize: '12px',
                            lineHeight: '16px',
                            color: '#000000',
                        }}>Cart</span>
                    </nav>

                    <div className="flex flex-col lg:flex-row gap-[32px] items-start">
                        {/* Left Column: Cart Items */}
                        <div
                            className="flex-1 flex flex-col w-full"
                        >
                            <h1 className="text-[32px] font-bold text-gray-900 flex items-center gap-3 mb-4">
                                Your Cart <ShoppingCartSimple className="text-[#333C4E]" size={32} weight="fill" />
                            </h1>
                            <div className="flex flex-col gap-[12px] p-[20px] bg-white rounded-[12px] border border-[#F0F0F0] shadow-sm">
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

                        {/* Right Column: Sidebar */}
                        <div
                            className="flex flex-col gap-[20px] w-full lg:w-[402px] shrink-0"
                        >
                            {/* Coupon Section */}
                            <div className="bg-white p-5 rounded-2xl border border-[#E3E3E3] shadow-sm">
                                <div 
                                    className="flex mb-4"
                                    style={{ width: '362px', height: '39px', gap: '11px' }}
                                >
                                    <input
                                        type="text"
                                        placeholder="Enter Your Coupon Code"
                                        className="flex-1 bg-white border border-[#D3D3D3] rounded-lg px-4 text-sm outline-none focus:border-black transition-colors text-gray-900 font-sans uppercase"
                                        style={{ height: '39px' }}
                                        value={couponCode}
                                        onChange={(e) => { setCouponCodeInput(e.target.value.toUpperCase()); setCouponError(''); }}
                                        onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                                        disabled={!!appliedCouponCode}
                                    />
                                    <button
                                        onClick={handleApplyCoupon}
                                        disabled={couponLoading || !!appliedCouponCode}
                                        className="transition-all rounded-xl flex items-center justify-center font-semibold disabled:opacity-60"
                                        style={{
                                            width: '83px',
                                            height: '39px',
                                            backgroundColor: 'hsla(0, 0%, 20%, 1)',
                                            color: '#FFFFFF',
                                            padding: '6px 20px',
                                            gap: '2px',
                                            borderRadius: '12px',
                                            fontFamily: "'Mona Sans', sans-serif",
                                            fontWeight: 500,
                                            fontSize: '16px',
                                        }}
                                    >
                                        {couponLoading ? <FaSpinner className="animate-spin" /> : 'Apply'}
                                    </button>
                                </div>

                                {/* Error */}
                                {couponError && (
                                    <p className="text-red-500 text-xs font-medium mb-3 flex items-center gap-1">
                                        <AiOutlineClose size={12} /> {couponError}
                                    </p>
                                )}

                                <button 
                                    className="w-full rounded-full flex items-center justify-center transition-colors shadow-sm tracking-tight"
                                    style={{ 
                                        height: '40px',
                                        backgroundColor: 'hsla(44, 100%, 64%, 1)',
                                        padding: '6px 20px',
                                        gap: '2px',
                                        opacity: 1,
                                        fontFamily: "'Mona Sans', sans-serif",
                                        fontWeight: 500,
                                        fontSize: '16px',
                                        lineHeight: '23px',
                                        color: 'hsla(0, 0%, 12%, 1)'
                                    }}
                                >
                                    View All Coupons
                                </button>
                            </div>

                            {/* Coupon Applied Success */}
                            {appliedCouponCode && (
                                <div className="bg-[#E8F8F0] border border-[#C6EDD8] rounded-[10px] py-1 px-4 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2 text-gray-900 font-bold text-[15px] font-sans">
                                            <HiOutlineSparkles className="text-lg text-[#007F5F]" />
                                            <span>"{appliedCouponCode}" Applied</span>
                                        </div>
                                        <span className="text-[#007F5F] text-xs font-semibold ml-6">You save ₹{couponDiscount}!</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[#00C853] font-bold text-sm font-sans">-₹{couponDiscount}</span>
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
                                couponDiscount={couponDiscount || 0}
                                couponCode={appliedCouponCode || ''}
                                onCheckout={() => router.push('/checkout/address')}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
