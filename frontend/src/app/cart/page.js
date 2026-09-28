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
import { ShoppingCartSimple, TrashSimple, Minus, Plus, ArrowRight } from '@phosphor-icons/react';

import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectCartTotals, updateCartItem, removeFromCart, setCoupon, removeCoupon } from '../../redux/features/cartSlice';
import OrderSummary from '../../components/OrderSummary';
import surface from '../../components/CheckoutSurface.module.css';
import { API_BASE_URL } from '../../services/apiConfig';

const CartItem = ({ item, onUpdate, onRemove }) => {
    const [isDurationOpen, setIsDurationOpen] = useState(false);
    const tenureOptions = [1, 3, 6, 9, 12];

    const mobileMonthlyRent = (item.monthlyRent || item.price) * item.quantity;
    const mobileRefundable = item.refundableAmount * item.quantity;

    return (
        <>
        {/* ─────────────── MOBILE CARD (Figma 23788:12072) ─────────────── */}
        <div className={`${surface.card} md:hidden px-3 py-4 flex flex-col gap-2 w-full`}>
            {/* Image + Trash */}
            <div className="flex items-start justify-between w-full">
                <div className="w-12 h-12 relative shrink-0 rounded-[5px] overflow-hidden bg-white">
                    {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50 text-[9px]">No Img</div>
                    )}
                </div>
                <button aria-label={`Remove ${item.name}`} onClick={() => onRemove(item.id)} className="text-gray-700 hover:text-red-500 transition-colors">
                    <RiDeleteBin6Line size={20} />
                </button>
            </div>

            {/* Title + Description */}
            <div className="flex flex-col w-full text-[#333] tracking-[-0.4px]">
                <p className="font-bold text-[12px] leading-[18px]">{item.name}</p>
            </div>

            <div className="h-px bg-gray-200 w-full" />

            {/* Duration + Quantity */}
            <div className="flex items-center justify-between w-full">
                <div className="relative">
                    <button
                        onClick={() => setIsDurationOpen(!isDurationOpen)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#CBCBCB] rounded-[8px] text-[14px] text-[#333]"
                    >
                        <span>{item.duration} {Number(item.duration) === 1 ? 'month' : 'months'}</span>
                        <IoIosArrowDown className={`text-gray-500 text-xs transition-transform ${isDurationOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isDurationOpen && (
                        <div className="absolute top-full left-0 mt-1 w-full min-w-[120px] bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                            {tenureOptions.map((months) => (
                                <button
                                    key={months}
                                    onClick={() => { onUpdate(item.id, { duration: months }); setIsDurationOpen(false); }}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between"
                                >
                                    <span>{months} Months</span>
                                    {item.duration === months && <BsCheckCircleFill className="text-[#00C853] text-xs" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="h-9 w-px bg-gray-200" />

                {/* Fixed Quantity Badge (Quantity cannot be changed) */}
                <div className="flex items-center gap-1.5 border border-[#CBCBCB] rounded-[8px] px-3 py-1.5 bg-[#f9f9f9]">
                    <span className="text-[11px] font-medium text-[#757575]">Qty:</span>
                    <span className="text-[11px] font-semibold text-[#333] min-w-[14px] text-center">1</span>
                </div>
            </div>

            <div className="h-px bg-gray-200 w-full" />

            {/* Monthly Rent | Refundable Amount */}
            <div className="flex items-center justify-between w-full">
                <div className="flex flex-col items-center gap-0.5 flex-1">
                    <p className="text-[10px] text-[#545454] font-medium">Monthly Rent</p>
                    <p className="text-[14px] font-bold text-[#333]">₹{mobileMonthlyRent}</p>
                </div>
                <div className="h-9 w-px bg-gray-200" />
                <div className="flex flex-col items-center gap-0.5 flex-1">
                    <p className="text-[10px] text-[#545454] font-medium">Refundable Amount</p>
                    <p className="text-[14px] font-bold text-[#333]">₹{mobileRefundable}</p>
                </div>
            </div>
        </div>

        {/* ─────────────── DESKTOP CARD (Figma 23212:7794) ─────────────── */}
        {/* No overflow-hidden here: the duration dropdown is absolutely positioned and would be
            clipped at the card's bottom edge (z-index can't escape an ancestor's clip). */}
        <div className={`${surface.card} hidden md:flex flex-col gap-[20px] px-[18px] py-[20px] w-full`}>
            {/* Top row: image + title/desc + trash */}
            <div className="flex items-center justify-between w-full gap-2">
                <div className="flex items-center gap-[8px] min-w-0 flex-1">
                    {/* Image 48×48, rounded-5, no border */}
                    <div className="size-[48px] relative shrink-0 rounded-[5px] overflow-hidden bg-white">
                        {item.image ? (
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50 text-[10px]">No Img</div>
                        )}
                    </div>
                    {/* Title & Desc */}
                    <div className="flex flex-col min-w-0 text-[#333] tracking-[-0.4px]">
                        <p className="font-bold text-[16px] leading-[23px]">{item.name}</p>
                    </div>
                </div>
                <button
                    onClick={() => onRemove(item.id)}
                    className="shrink-0 text-[#333] hover:text-red-500 transition-colors"
                    aria-label="Remove item"
                >
                    <TrashSimple size={20} />
                </button>
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-[#e2e2e2]" />

            {/* Controls + pricing row */}
            <div className="flex items-center justify-between w-full">
                {/* Left: Duration + Quantity */}
                <div className="flex items-center gap-[13px]">
                    {/* Duration */}
                    <div className="relative">
                        <button
                            onClick={() => setIsDurationOpen(!isDurationOpen)}
                            className="flex items-center gap-[5px] bg-white border border-[#cbcbcb] rounded-[8px] px-[12px] py-[6px]"
                        >
                            <span className="text-[14px] text-[#333] tracking-[-0.4px]">{item.duration} {Number(item.duration) === 1 ? 'month' : 'months'}</span>
                            <IoIosArrowDown className={`text-[#333] text-[15px] transition-transform ${isDurationOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isDurationOpen && (
                            <div className="absolute top-full left-0 mt-1 w-full min-w-[110px] bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                                {tenureOptions.map((months) => (
                                    <button
                                        key={months}
                                        onClick={() => { onUpdate(item.id, { duration: months }); setIsDurationOpen(false); }}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between"
                                    >
                                        <span>{months} Months</span>
                                        {item.duration === months && <BsCheckCircleFill className="text-[#00C853] text-xs" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Vertical divider */}
                    <div className="h-[36px] w-px bg-[#cbcbcb]" />

                    {/* Quantity stepper (Figma) — quantity is locked at 1, so the +/- controls are non-interactive */}
                    <div className="flex items-center gap-[8px] bg-white border border-[#cbcbcb] rounded-[8px] px-[12px] py-[6px]">
                        <Minus size={15} className="text-[#333] cursor-not-allowed" />
                        <span className="text-[14px] font-semibold text-[#333] tracking-[-0.4px]">{item.quantity}</span>
                        <Plus size={15} className="text-[#333] cursor-not-allowed" />
                    </div>
                </div>

                {/* Middle vertical divider */}
                <div className="h-[36px] w-px bg-[#cbcbcb]" />

                {/* Right: Pricing */}
                <div className="flex items-center gap-[13px]">
                    <div className="flex flex-col gap-[2px] items-center justify-center whitespace-nowrap">
                        <p className="text-[14px] font-medium text-[#545454] tracking-[-0.4px] leading-[20px]">Monthly Rent</p>
                        <p className="text-[18px] font-bold text-[#333] tracking-[-0.8px] leading-[25px]">₹{(item.monthlyRent || item.price) * item.quantity}</p>
                    </div>
                    <div className="h-[36px] w-px bg-[#cbcbcb]" />
                    <div className="flex flex-col gap-[2px] items-center justify-center whitespace-nowrap">
                        <p className="text-[14px] font-medium text-[#545454] tracking-[-0.4px] leading-[20px]">Refundable Amount</p>
                        <p className="text-[18px] font-bold text-[#333] tracking-[-0.8px] leading-[25px]">₹{item.refundableAmount * item.quantity}</p>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default function CartPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const cartItems = useSelector(selectCartItems);
    const totals = useSelector(selectCartTotals);
    const { securityAmount, deliveryCharges, monthlyRentTotal, totalGST, totalOneTime, payToday, savedAmount, couponDiscount, couponCode: appliedCouponCode } = totals;

    const firstItem = cartItems[0];
    const productPageUrl = firstItem?.sourceUrl || (firstItem?.id ? `/products/${firstItem.id}` : '/products');
    const productPageLabel = firstItem?.name || 'Product Page';

    const [couponCode, setCouponCodeInput] = useState('');
    const [couponError, setCouponError] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);

    // "View All Coupons" modal
    const [showCoupons, setShowCoupons] = useState(false);
    const [availableCoupons, setAvailableCoupons] = useState([]);
    const [couponsLoading, setCouponsLoading] = useState(false);
    const [couponsError, setCouponsError] = useState('');

    const handleApplyCoupon = async (overrideCode) => {
        const code = (typeof overrideCode === 'string' ? overrideCode : couponCode).trim();
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
            setShowCoupons(false);
        } catch (err) {
            setCouponError(err.message);
            dispatch(removeCoupon());
        } finally {
            setCouponLoading(false);
        }
    };

    const handleViewAllCoupons = async () => {
        setShowCoupons(true);
        setCouponsLoading(true);
        setCouponsError('');
        try {
            const res = await fetch(`${API_BASE_URL}/api/coupons/active`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to load coupons');
            setAvailableCoupons(Array.isArray(data) ? data : []);
        } catch (err) {
            setCouponsError(err.message || 'Failed to load coupons');
            setAvailableCoupons([]);
        } finally {
            setCouponsLoading(false);
        }
    };

    const handleRemoveCoupon = () => {
        dispatch(removeCoupon());
        setCouponCodeInput('');
        setCouponError('');
    };

    const updateItem = (id, updates) => {
        let finalUpdates = { ...updates };
        delete finalUpdates.quantity; // Quantity cannot be changed
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

    if (cartItems.length === 0) {
        return (
            <main className="min-h-[calc(100vh-104px)] bg-[#F6F6F6] px-5 py-10 font-sans md:px-8 md:py-16">
                <div className="mx-auto max-w-[1200px]">
                    <nav aria-label="Breadcrumb" className="mb-10 text-[12px] font-medium text-[#757575] md:mb-16">
                        <Link href="/" className="hover:text-[#141414]">Home</Link>
                        <span className="mx-2" aria-hidden="true">/</span>
                        <span aria-current="page" className="text-[#141414]">Cart</span>
                    </nav>
                    <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
                        <div className="max-w-[580px]">
                            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#D8D8D8] bg-white px-3 py-2 text-[13px] font-semibold text-[#333]">
                                <ShoppingCartSimple size={18} aria-hidden="true" /> Your cart
                            </span>
                            <h1 className="text-[38px] font-semibold leading-[1.1] tracking-[-1.6px] text-[#141414] sm:text-[52px] lg:text-[64px]">
                                Your cart is empty. Find your next setup.
                            </h1>
                            <p className="mt-5 max-w-[420px] text-[16px] leading-7 text-[#545454]">
                                Explore the collection and add the products you want to rent. They’ll appear here when you’re ready to check out.
                            </p>
                            <div className="mt-8 flex flex-wrap items-center gap-4">
                                <Link href="/categories" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#FFCF46] px-6 text-[15px] font-semibold text-[#141414] transition-colors hover:bg-[#FFC62B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]">
                                    Explore categories <ArrowRight size={18} aria-hidden="true" />
                                </Link>
                                <Link href="/products" className="inline-flex min-h-12 items-center justify-center px-2 text-[15px] font-semibold text-[#141414] underline underline-offset-4 hover:text-[#545454] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]">
                                    Browse all products
                                </Link>
                            </div>
                        </div>
                        <Link href="/category/apple" className="group relative block aspect-[4/3] overflow-hidden rounded-[24px] bg-[#E8E8E8] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#141414] lg:aspect-[5/4]">
                            <Image src="/macbook-placeholder.jpg" alt="MacBook ready to rent" fill priority sizes="(min-width: 1024px) 500px, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                            <span className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl bg-white/95 px-5 py-4 text-[15px] font-semibold text-[#141414] shadow-sm backdrop-blur-sm sm:bottom-6 sm:left-6 sm:right-6">
                                Explore MacBooks <ArrowRight size={20} aria-hidden="true" />
                            </span>
                        </Link>
                    </div>
                </div>
            </main>
        );
    }
    return (
        <div className="w-full bg-[#F5F5F5] min-h-screen font-sans" style={{ opacity: 1 }}>
            <div className="max-w-[1200px] mx-auto px-5 md:px-[30px] pt-5 lg:pt-[48px] pb-12 md:pb-[48px]">
                <div
                    className="flex flex-col gap-[16px]"
                >
                    {/* Breadcrumb */}
                    <nav
                        aria-label="Breadcrumb"
                        className="text-[10px] md:text-[12px] text-[#808080] flex items-center gap-[8px] mb-1 lg:mb-4"
                    >
                        <Link
                            href={productPageUrl}
                            className="text-[#808080] hover:text-black hover:underline transition-colors font-medium max-w-[240px] md:max-w-[420px] truncate"
                            title={productPageLabel}
                        >
                            {productPageLabel}
                        </Link>
                        <span className="text-[#808080] text-[12px]">›</span>
                        <span style={{
                            fontFamily: "'Mona Sans', sans-serif",
                            fontWeight: 600,
                            fontSize: '12px',
                            lineHeight: '16px',
                            color: '#000000',
                        }}>Cart</span>
                    </nav>

                    <div className="flex flex-col lg:flex-row gap-5 lg:gap-8 items-start">
                        {/* Left Column: Cart Items */}
                        <div
                            className="flex-1 flex flex-col w-full"
                        >
                            <h1 className="flex text-[27px] font-semibold text-[#545454] tracking-[-0.8px] leading-[35px] items-center gap-2 mb-3">
                                Your Cart <Image src="/icons/cart-heading.svg" alt="" width={26} height={26} aria-hidden="true" />
                            </h1>
                            <div className="flex flex-col gap-3 md:gap-[10px]">
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
                            <div className={`${surface.card} px-3 py-4`}>
                                <div
                                    className="flex mb-5 w-full"
                                    style={{ height: '39px', gap: '11px' }}
                                >
                                    <input
                                        type="text"
                                        placeholder="Enter Your Coupon Code"
                                        aria-label="Coupon code"
                                        className="min-w-0 flex-1 bg-white border border-[#E2E2E2] rounded-lg px-3 text-[14px] sm:text-[16px] outline-none focus:border-black transition-colors text-gray-900 font-sans"
                                        style={{ height: '39px' }}
                                        value={couponCode}
                                        onChange={(e) => { setCouponCodeInput(e.target.value.toUpperCase()); setCouponError(''); }}
                                        onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                                        disabled={!!appliedCouponCode}
                                    />
                                    <button
                                        onClick={handleApplyCoupon}
                                        disabled={couponLoading || !!appliedCouponCode}
                                        className="transition-colors shrink-0 rounded-lg flex items-center justify-center font-semibold disabled:opacity-60 shadow-sm"
                                        style={{
                                            width: '83px',
                                            height: '39px',
                                            backgroundColor: 'hsla(0, 0%, 20%, 1)',
                                            color: '#FFFFFF',
                                            padding: '6px 20px',
                                            gap: '2px',
                                            borderRadius: '8px',
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
                                    onClick={handleViewAllCoupons}
                                    className="w-full rounded-full flex items-center justify-center transition-colors tracking-tight hover:brightness-95"
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
                                            <span>&ldquo;{appliedCouponCode}&rdquo; Applied</span>
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

            {/* View All Coupons Modal */}
            {showCoupons && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
                    onClick={() => setShowCoupons(false)}
                >
                    <div
                        className="bg-white w-full max-w-[460px] max-h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                            <h3 className="font-semibold text-gray-900 text-[17px] font-sans flex items-center gap-2">
                                <HiOutlineSparkles className="text-[#d97706]" /> Available Coupons
                            </h3>
                            <button
                                onClick={() => setShowCoupons(false)}
                                className="text-gray-400 hover:text-gray-600 p-1"
                            >
                                <AiOutlineClose size={18} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-5 py-4 overflow-y-auto flex flex-col gap-3">
                            {couponsLoading && (
                                <div className="flex items-center justify-center py-10 text-gray-400">
                                    <FaSpinner className="animate-spin mr-2" /> Loading coupons…
                                </div>
                            )}

                            {!couponsLoading && couponsError && (
                                <p className="text-red-500 text-sm text-center py-8">{couponsError}</p>
                            )}

                            {!couponsLoading && !couponsError && availableCoupons.length === 0 && (
                                <p className="text-gray-500 text-sm text-center py-8">No coupons available right now.</p>
                            )}

                            {!couponsLoading && !couponsError && availableCoupons.map((c) => {
                                const discountLabel = c.discountType === 'percentage'
                                    ? `${c.discountAmount}% OFF`
                                    : `₹${c.discountAmount} OFF`;
                                return (
                                    <div
                                        key={c.code}
                                        className="border border-dashed border-[#E3B341] rounded-xl p-4 bg-[#FFFBF0] flex items-start justify-between gap-3"
                                    >
                                        <div className="flex flex-col min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-gray-900 text-[15px] font-sans tracking-wide">{c.code}</span>
                                                <span className="text-[#007F5F] text-xs font-semibold bg-[#E8F8F0] px-2 py-0.5 rounded-full">{discountLabel}</span>
                                            </div>
                                            {c.description && (
                                                <p className="text-gray-600 text-xs mt-1">{c.description}</p>
                                            )}
                                            {c.minOrderAmount > 0 && (
                                                <p className="text-gray-400 text-[11px] mt-1">Min. order ₹{c.minOrderAmount}</p>
                                            )}
                                            {c.expiryDate && (
                                                <p className="text-gray-400 text-[11px]">Valid till {new Date(c.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleApplyCoupon(c.code)}
                                            disabled={couponLoading || appliedCouponCode === c.code}
                                            className="shrink-0 text-sm font-semibold text-[#d97706] hover:text-[#b45309] disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {appliedCouponCode === c.code ? 'Applied' : 'Apply'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
