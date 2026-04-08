"use client";
import React from 'react';
import Image from 'next/image';
import { FaHeart, FaStar } from 'react-icons/fa';
import Link from 'next/link';

import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/redux/features/cartSlice';
import Button from './common/Button';

const ProductCard = ({ product }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [added, setAdded] = React.useState(false);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(addToCart({
            id: product.id,
            name: product.name,
            image: product.image,
            price: product.rentPrice,
            monthlyRent: product.rentPrice,
            quantity: 1,
            duration: parseInt(product.selectedDurationStr) || 1,
            refundableAmount: 0,
            description: product.description
        }));
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const handleQuickView = (e) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/products/${product.id}`);
    };

    return (
        /* Card shell: no padding, overflow-hidden so image inherits top border-radius */
        <div
            className="group bg-white rounded-2xl flex flex-col overflow-hidden relative transition-all duration-500 hover:shadow-[0_8px_30px_rgba(0,0,0,0.10)] hover:-translate-y-1"
            style={{
                width: "285px",
                height: "391px",
                border: "1px solid hsla(0, 0%, 89%, 1)"
            }}
        >
            {/* ── Image Section (full-bleed, top of card) ─────────── */}
            <div
                className="relative rounded-2xl bg-[#F7F7F7] group-hover:bg-[#F0F0F0] transition-colors duration-500 flex items-center justify-center overflow-hidden flex-shrink-0"
                style={{
                    width: "285px",
                    height: "282px",
                    borderRight: "1px solid hsla(0, 0%, 89%, 1)",
                    borderBottom: "1px solid hsla(0, 0%, 89%, 1)",
                    borderLeft: "1px solid hsla(0, 0%, 89%, 1)"
                }}
            >
                {/* Badges — top-left */}
                <div className="absolute top-3 left-3 z-20 flex gap-1.5">
                    <span className="bg-[#FF3B30] text-white text-[11px] font-bold px-2 py-[3px] rounded-[4px] shadow-sm leading-none">
                        {product.discount || "-20% off"}
                    </span>
                    {product.isNew && (
                        <span className="bg-[#34C759] text-white text-[11px] font-bold px-2 py-[3px] rounded-[4px] shadow-sm leading-none">
                            New
                        </span>
                    )}
                </div>

                {/* Heart Button — top-right */}
                <button
                    className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center bg-white border border-gray-200 text-gray-400 rounded-full shadow-sm hover:text-[#FF3B30] hover:scale-110 transition-all duration-300"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                >
                    <FaHeart size={14} />
                </button>

                {/* Product Image */}
                <Link
                    href={`/products/${product.id}`}
                    className="flex items-center justify-center w-full h-full"
                >
                    <div className="w-[240px] h-[220px] relative transition-transform duration-700 ease-out group-hover:scale-105">
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-contain mix-blend-multiply"
                        />
                    </div>
                </Link>
            </div>

            {/* ── Text Section ──────────────────────────────────────── */}
            <Link
                href={`/products/${product.id}`}
                className="flex flex-col"
                style={{
                    width: "285px",
                    height: "105px",
                    gap: "8px",
                    paddingTop: "8px",
                    paddingRight: "12px",
                    paddingBottom: "12px",
                    paddingLeft: "12px"
                }}
            >
                {/* Product Name */}
                <h3
                    className="font-manrope text-[#1D1D1F] line-clamp-1 group-hover:text-[#FF3B30] transition-colors duration-300"
                    style={{ fontSize: "16px", fontWeight: 600, lineHeight: "23px", letterSpacing: "-0.4px" }}
                >
                    {product.name}
                </h3>

                {/* Rating + Delivery */}
                <div className="flex items-center justify-between transition-all duration-500 group-hover:opacity-0 group-hover:-translate-y-1">
                    <div className="flex items-center gap-0.5">
                        <div className="flex text-[#FF9F0A]">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <FaStar key={s} size={12} className={s <= Math.round(product.rating || 4) ? "" : "opacity-20"} />
                            ))}
                        </div>
                        <span className="text-[12px] font-semibold text-[#86868B] ml-1">
                            {product.rating || "4.5"}({product.numReviews || 12})
                        </span>
                    </div>
                    <div className="flex items-center gap-1 text-[#86868B]">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 110-4m14 4a2 2 0 104 0m-4 0a2 2 0 110-4" />
                        </svg>
                        <span className="text-[11px] font-medium">2-4 days</span>
                        <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="opacity-40">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>

                {/* Price + Hover Buttons */}
                <div className="relative">
                    {/* Price row */}
                    <div className="flex items-baseline gap-1.5 transition-all duration-500 group-hover:opacity-0 group-hover:-translate-y-2">
                        <span className="text-[12px] text-[#86868B] font-medium">from</span>
                        <span className="text-[14px] text-[#86868B] line-through font-medium opacity-60">₹{product.originalPrice}</span>
                        <span className="text-[20px] font-extrabold text-[#FF3B30] leading-none">₹{product.rentPrice}</span>
                        <span className="text-[12px] text-[#86868B] font-medium">/month</span>
                    </div>

                    {/* Hover buttons */}
                    <div className="absolute inset-x-0 bottom-0 flex gap-2 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out z-30">
                        <Button
                            variant="black"
                            size="md"
                            className="flex-1 h-[34px]! rounded-[10px]! text-[12px]! min-w-0! font-bold active:scale-95"
                            onClick={handleQuickView}
                        >
                            Quick View
                        </Button>
                        <Button
                            variant={added ? 'ghost' : 'yellow'}
                            size="md"
                            className={`flex-1 h-[34px]! rounded-[10px]! text-[12px]! min-w-0! font-bold active:scale-95 ${added ? 'bg-green-500 text-white! border-none' : ''}`}
                            onClick={handleAddToCart}
                        >
                            {added ? 'Added!' : 'Add to Cart'}
                        </Button>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
