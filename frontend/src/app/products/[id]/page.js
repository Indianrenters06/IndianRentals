"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { FaHeart, FaShareAlt, FaMinus, FaPlus, FaShoppingCart, FaStar, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { BsTruck, BsBoxSeam, BsCreditCard } from 'react-icons/bs';

import { useDispatch } from 'react-redux';
import { addToCart } from '../../../redux/features/cartSlice';
import { getProductById } from '../../../services/productService';

export default function ProductDetailPage() {
    const router = useRouter();
    const params = useParams(); // Get ID from URL
    const dispatch = useDispatch();

    // Product Data State
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // UI States
    const [duration, setDuration] = useState(1);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('Product Details');
    const [openFaq, setOpenFaq] = useState(0);

    // Fetch Product Data
    useEffect(() => {
        if (!params.id) return;

        const fetchProduct = async () => {
            try {
                setLoading(true);
                // The ID from URL might be a slug or actual ID. 
                // Since our backend uses MongoDB IDs, we hope the link passed the ID.
                const data = await getProductById(params.id);
                setProduct(data);
            } catch (err) {
                console.error("Failed to load product", err);
                setError("Product not found");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [params.id]);


    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? -1 : index);
    };

    const tenures = [
        { label: '1+', months: 1, price: product?.rentalPrice || 2560 }, // Use product price as base
        { label: '3+', months: 3, price: Math.round((product?.rentalPrice || 2560) * 0.9) },
        { label: '6+', months: 6, price: Math.round((product?.rentalPrice || 2560) * 0.8) },
        { label: '9+', months: 9, price: Math.round((product?.rentalPrice || 2560) * 0.75) },
        { label: '12+', months: 12, price: Math.round((product?.rentalPrice || 2560) * 0.7) },
    ];

    const currentPlan = tenures.find(t => duration <= t.months) || tenures[tenures.length - 1];

    const handleAddToCart = () => {
        if (!product) return;

        const item = {
            id: product._id,
            name: product.name,
            image: product.images?.[0] || "/images/placeholder.png",
            price: currentPlan.price,
            monthlyRent: currentPlan.price,
            duration: duration,
            quantity: quantity,
            refundableAmount: product.securityDeposit || 10000,
            description: product.description,
            tenures: tenures
        };
        dispatch(addToCart(item));
        router.push('/cart');
    };

    if (loading) return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
    if (error || !product) return <div className="min-h-screen flex justify-center items-center">Product not found</div>;

    // Derived Data
    const mainImage = product.images && product.images.length > 0 ? product.images[0] : "/images/placeholder.png";
    const specs = [
        { label: "BRAND", value: product.brand || "N/A" },
        { label: "CATEGORY", value: product.category || "N/A" },
        { label: "CONDITION", value: product.condition || "New" },
        { label: "STOCK", value: product.stock > 0 ? "In Stock" : "Out of Stock" },
        { label: "LOCATION", value: product.city || "All India" },
        { label: "DETAILS", value: product.description || "N/A" }
    ];

    return (
        <div className="min-h-screen bg-[#F7F7F7] font-manrope text-[#1D1D1F] tracking-tight antialiased pt-10 pb-10">
            {/* Breadcrumb */}
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-3 text-[14px] font-medium text-[#586A84]">
                <div className="flex items-center gap-2">
                    <Link href="/" className="hover:text-black transition-colors">Shop all</Link>
                    <span className="text-gray-300 text-[16px] leading-none mb-0.5">›</span>
                    <Link href={`/category/${product.category?.toLowerCase() || 'all'}`} className="hover:text-black transition-colors">{product.category || 'Category'}</Link>
                    <span className="text-gray-300 text-[16px] leading-none mb-0.5">›</span>
                    <span className="text-[#1D1D1F] font-bold truncate max-w-[300px]">{product.name}</span>
                </div>
            </div>

            <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-5 gap-y-12 items-start">

                    {/* Left Column - Images & Details */}
                    <div className="flex flex-col gap-5">
                        
                        {/* Main Image Area */}
                        <div className="relative w-full h-[523px] bg-white border border-[#EDEDED] rounded-xl flex items-center justify-center p-10 group overflow-hidden shrink-0">
                            <span className="absolute top-6 left-6 z-10 bg-[#FF3B30] text-white text-[12px] font-bold px-3 py-1 rounded-[6px] tracking-wide">20% off</span>

                            <div className="absolute top-6 right-6 z-10 flex flex-col gap-3">
                                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f6f6f6] text-[#555] hover:text-[#FF3B30] hover:bg-white transition-colors border border-transparent hover:border-gray-200">
                                    <FaHeart size={15} />
                                </button>
                                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f6f6f6] text-[#555] hover:text-black hover:bg-white transition-colors border border-transparent hover:border-gray-200">
                                    <FaShareAlt size={15} />
                                </button>
                            </div>
                            
                            <Image
                                src={mainImage}
                                alt={product.name}
                                fill
                                className="object-contain mix-blend-darken brightness-[1.08] contrast-[1.04] p-8 group-hover:scale-105 transition-transform duration-700 ease-out"
                                priority
                            />
                            
                            {/* Nav Arrows */}
                            <button className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-[#f6f6f6] text-[#666] hover:bg-gray-200 transition-colors">
                                <span className="text-[22px] leading-none -mt-[3px]">{"‹"}</span>
                            </button>
                            <button className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-[#f6f6f6] text-[#666] hover:bg-gray-200 transition-colors">
                                <span className="text-[22px] leading-none -mt-[3px]">{"›"}</span>
                            </button>
                        </div>

                        {/* Thumbnails */}
                        <div className="flex items-center gap-4 w-full">
                            {[mainImage, mainImage, mainImage, mainImage].map((img, i) => (
                                <button key={i} className={`w-[110px] h-[110px] flex-shrink-0 bg-white border ${i === 0 ? 'border-[#0F172A] border-[2px]' : 'border-[#EDEDED]'} rounded-xl p-3 flex items-center justify-center transition-all shadow-sm hover:border-gray-400`}>
                                    <div className="w-full h-full relative">
                                        <Image src={img} alt={`Thumb ${i}`} fill className="object-contain mix-blend-darken brightness-[1.08] contrast-[1.04]" />
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Tabs + Table Details */}
                        <div className="w-full mb-10">
                            <div className="border border-gray-200 rounded-[28px] overflow-hidden bg-white shadow-sm">
                                {/* Tabs Header */}
                                <div className="flex items-center gap-4 px-6 pt-5 pb-5 border-b border-gray-100">
                                    {['Product Details', 'Return Policy', 'Shipping Policy'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`text-[15px] font-bold transition-all px-[20px] py-[10px] rounded-[24px] ${activeTab === tab ? 'bg-[#333333] text-white shadow-sm' : 'text-gray-800 hover:bg-gray-50 bg-transparent'}`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>

                                {/* Tab Content */}
                                <div className="px-10 py-10 min-h-[300px]">
                                    {activeTab === 'Product Details' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-8">
                                            {specs.map((item, i) => (
                                                <div key={i} className="flex flex-col gap-2">
                                                    <span className="text-[13px] font-black text-[#1D1D1F] uppercase">{item.label}</span>
                                                    <span className="text-[15px] font-medium text-gray-600 whitespace-pre-line">{item.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {activeTab === 'Return Policy' && (
                                        <div className="prose max-w-none">
                                            <p className="text-[#1D1D1F] whitespace-pre-line leading-relaxed font-medium">
                                                {product.returnPolicy || "Standard return policy applies. Please contact support for details."}
                                            </p>
                                        </div>
                                    )}
                                    {activeTab === 'Shipping Policy' && (
                                        <div className="prose max-w-none">
                                            <p className="text-[#1D1D1F] whitespace-pre-line leading-relaxed font-medium">
                                                {product.shippingPolicy || "Standard shipping policy applies. Delivery usually takes 2-5 business days."}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Product Purchase Details */}
                    <div className="flex flex-col gap-[32px]">
                        <div className="flex flex-col gap-[8px] mx-2 shrink-0">
                            <h1 className="text-[24px] xl:text-[26px] font-bold text-[#1D1D1F] leading-[1.2]">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-2">
                                <div className="flex text-[#FF9500]">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <FaStar key={s} size={15} className={s <= Math.round(product.rating || 0) ? "" : "text-gray-200"} />
                                    ))}
                                </div>
                                <span className="text-[13px] font-medium text-gray-500">{product.rating || "4.5"} ({product.numReviews || 12})</span>
                            </div>
                        </div>

                        {/* Rental Configuration Card */}
                        <div className="flex flex-col bg-white border border-[#EDEDED] rounded-lg shrink-0 h-[333px] justify-between px-6 pt-6 pb-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                            
                            {/* Header */}
                            <div>
                                <h3 className="text-[14px] font-medium text-[#1D1D1F] mb-6">
                                    Select your <span className="underline decoration-gray-400 underline-offset-4 decoration-[1.5px]">minimum rental period</span>
                                </h3>

                                {/* Tenure Slider */}
                                <div className="relative mb-0 mt-4">
                                    {/* Track */}
                                    <div className="relative h-[8px] bg-[#FDE68A] rounded-full flex items-center">
                                        {[1, 2, 3, 4, 5].map(step => {
                                            const pct = ((step - 1) / 4) * 100;
                                            return (
                                                <div 
                                                    key={step} 
                                                    className="absolute w-[16px] h-[16px] rounded-full bg-white transition-colors duration-300 z-10 shadow-sm border border-gray-100" 
                                                    style={{ left: `calc(${pct}% - 8px)` }} 
                                                />
                                            );
                                        })}
                                        <input
                                            type="range"
                                            min="1"
                                            max="5"
                                            step="1"
                                            value={duration <= 1 ? 1 : duration <= 3 ? 2 : duration <= 6 ? 3 : duration <= 9 ? 4 : 5}
                                            onChange={(e) => {
                                                const step = parseInt(e.target.value);
                                                const months = [1, 3, 6, 9, 12];
                                                setDuration(months[step - 1]);
                                            }}
                                            className="absolute w-full h-full opacity-0 cursor-pointer z-20"
                                        />
                                    </div>
                                    
                                    {/* Labels Below */}
                                    <div className="flex justify-between mt-[16px] text-[13px] text-gray-500 font-medium">
                                        <span className="text-center w-6">1+</span>
                                        <span className="text-center w-6">3+</span>
                                        <span className="text-center w-6">6+</span>
                                        <span className="text-center w-6">9+</span>
                                        <span className="text-center w-8">12+</span>
                                    </div>
                                </div>
                            </div>

                            {/* Links */}
                            <div className="flex justify-between items-center text-[13px] font-medium text-[#EA580C] underline decoration-orange-200 underline-offset-4 mb-1">
                                <Link href="#" className="hover:text-orange-700 transition">price breakdown</Link>
                                <Link href="#" className="hover:text-orange-700 transition">compare all tenures</Link>
                            </div>

                            {/* Price Line (Full Width Borders) */}
                            <div className="border-t border-b border-[#EDEDED] py-5 flex justify-between items-center bg-white -mx-6 px-6">
                                <div className="flex items-end gap-[6px]">
                                    <span className="text-[34px] font-bold text-[#FF3B30] leading-[0.8] tracking-tight">₹{currentPlan.price}</span>
                                    <span className="text-[14px] font-medium text-gray-500 opacity-90 leading-[1.2]">/month</span>
                                    <span className="text-[14px] font-medium text-gray-400 line-through leading-[1.2] ml-1">₹{Math.round(currentPlan.price * 1.5)}</span>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className="text-[13px] text-[#1D1D1F] font-bold">Quantity</span>
                                    <div className="flex items-center gap-4 border border-[#EDEDED] rounded-lg px-3 py-1.5 bg-white shadow-sm">
                                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-400 hover:text-black w-4 h-4 flex items-center justify-center">
                                            <FaMinus size={10} />
                                        </button>
                                        <span className="text-[14px] font-medium w-3 text-center text-[#1D1D1F]">{quantity}</span>
                                        <button onClick={() => setQuantity(quantity + 1)} className="text-gray-400 hover:text-black w-4 h-4 flex items-center justify-center">
                                            <FaPlus size={10} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full pt-1 text-[12px] font-bold text-black bg-transparent hover:text-gray-700 transition-colors uppercase tracking-[0.08em] text-center">
                                VIEW ALL BENEFITS
                            </button>
                        </div>

                        {/* Refundable Deposit & Value Props Stack */}
                        <div className="flex flex-col gap-5 shrink-0 px-2 mt-[-6px]">
                            {/* Refundable Deposit Line */}
                            <div className="flex justify-between items-center px-1">
                                <span className="text-[12.5px] font-medium text-gray-600 tracking-tight">
                                    100% Refundable Deposit <span className="text-[13px] text-gray-400 line-through mx-[3px] decoration-gray-400">₹{product.securityDeposit ? product.securityDeposit + 4999 : '24,999'}</span> <span className="font-bold text-[#1D1D1F] text-[16px]">₹{product.securityDeposit || '20,000'}</span>
                                </span>
                                <div className="w-[15px] h-[15px] rounded-full border border-[#FF3B30] flex items-center justify-center text-[#FF3B30] text-[10px] font-bold font-serif leading-none opacity-80 cursor-pointer hover:opacity-100 transition-opacity">
                                    i
                                </div>
                            </div>

                            {/* Value Props */}
                            <div className="flex flex-col gap-[8px]">
                                {[
                                    { icon: <FaStar size={13}/>, text: 'Fully Functional (100% Tested)' },
                                    { icon: <BsBoxSeam size={13}/>, text: 'Original Accessories Included' },
                                    { icon: <BsTruck size={13}/>, text: 'Free Repairs & Maintenance' },
                                    { icon: <BsBoxSeam size={13}/>, text: 'Professionally sanitized' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 bg-[#F8F8F8] rounded-[10px] px-4 py-3.5">
                                        <div className="text-gray-500 opacity-90">
                                            {item.icon}
                                        </div>
                                        <span className="text-[12.5px] font-semibold text-gray-700 tracking-tight">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Secondary Info Cards */}
                        <div className="grid grid-cols-2 gap-4 shrink-0">
                            <div className="border border-[#FDE68A] bg-[#FFF8E1] px-5 py-6 rounded-2xl flex flex-col gap-2 cursor-pointer hover:shadow-sm transition-shadow opacity-90 hover:opacity-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <BsTruck className="text-gray-700" size={18} />
                                    <span className="text-[12px] font-bold text-gray-900 leading-snug">What if I cancel or return before 6 months?</span>
                                </div>
                                <span className="text-[12px] font-bold text-[#EA580C] self-end mt-auto xl:mr-1">View Details</span>
                            </div>
                            <div className="border border-[#FDE68A] bg-[#FFF8E1] px-5 py-6 rounded-2xl flex flex-col gap-2 cursor-pointer hover:shadow-sm transition-shadow opacity-90 hover:opacity-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <FaStar className="text-gray-700" size={18} />
                                    <span className="text-[12px] font-bold text-gray-900 leading-snug">How do I extend tenure after 6 months?</span>
                                </div>
                                <span className="text-[12px] font-bold text-[#EA580C] self-end mt-auto xl:mr-1">View Details</span>
                            </div>
                        </div>

                        {/* Primary CTA */}
                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-[#FFCC00] hover:bg-[#F5C200] active:scale-[0.99] text-[#1D1D1F] font-bold py-[18px] rounded-2xl text-[16px] transition-all flex items-center justify-center shrink-0 mt-2 shadow-[0_2px_12px_rgba(255,204,0,0.25)]"
                        >
                            Rent Now
                        </button>

                        {/* Delivery Details */}
                        <div className="flex justify-between items-start pt-[2px] shrink-0">
                            <div className="flex flex-col relative pl-3">
                                <div className="absolute left-0 top-[6px] w-[5px] h-[5px] bg-green-500 rounded-full" />
                                <span className="text-[12px] font-bold text-gray-900 leading-tight mb-[2px]">Delivery</span>
                                <span className="text-[11px] text-gray-500">Deliver to: <span className="text-gray-900 font-medium">[110001]</span></span>
                            </div>
                            <span className="text-[11.5px] font-bold text-[#EA580C] max-w-[130px] text-right font-manrope">Check availability in your state</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

// Force Next.js Fast Refresh
