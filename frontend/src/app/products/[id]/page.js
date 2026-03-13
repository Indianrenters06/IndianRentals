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
    ];

    return (
        <div className="min-h-screen bg-white font-manrope text-[#1D1D1F] tracking-tight antialiased">
            {/* Breadcrumb */}
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 text-xs font-medium text-gray-500">
                <div className="flex items-center gap-2">
                    <Link href="/" className="hover:text-black">Shop all</Link>
                    <span className="text-gray-300">›</span>
                    <Link href={`/category/${product.category?.toLowerCase() || 'all'}`} className="hover:text-black">{product.category || 'Category'}</Link>
                    <span className="text-gray-300">›</span>
                    <span className="text-black font-bold truncate max-w-[200px]">{product.name}</span>
                </div>
            </div>

            <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex flex-col lg:flex-row gap-10">

                    {/* Left Column - Images */}
                    <div className="lg:w-[58%]">
                        <div className="relative mb-6 group">
                            <span className="absolute top-4 left-4 z-10 bg-[#FF3B30] text-white text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-wider">20% off</span>

                            {/* Action Buttons */}
                            <div className="absolute top-4 right-4 z-10 flex flex-col gap-3">
                                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md border border-gray-100 text-gray-400 hover:text-[#FF3B30] transition-colors">
                                    <FaHeart size={18} />
                                </button>
                                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md border border-gray-100 text-gray-400 hover:text-black transition-colors">
                                    <FaShareAlt size={16} />
                                </button>
                            </div>

                            {/* Main Image Box */}
                            <div className="border border-gray-100 rounded-[32px] bg-white p-10 relative flex items-center justify-center aspect-[4/3] w-full max-h-[500px] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                                <Image
                                    src={mainImage}
                                    alt={product.name}
                                    fill
                                    className="object-contain p-8 group-hover:scale-105 transition-transform duration-700 ease-out"
                                    priority
                                />

                                {/* Nav Arrows (Visible on Hover) */}
                                <button className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="sr-only">Prev</span>
                                    <span className="text-xl">‹</span>
                                </button>
                                <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="sr-only">Next</span>
                                    <span className="text-xl">›</span>
                                </button>
                            </div>
                        </div>

                        {/* Thumbnails */}
                        <div className="flex gap-4 px-2 overflow-x-auto pb-4 scrollbar-hide">
                            {[mainImage, mainImage, mainImage, mainImage].map((img, i) => (
                                <button key={i} className={`w-[110px] h-[110px] flex-shrink-0 bg-white border-2 ${i === 0 ? 'border-gray-200' : 'border-gray-50'} rounded-[24px] p-3 flex items-center justify-center hover:border-gray-300 transition-all shadow-sm`}>
                                    <div className="w-full h-full relative">
                                        <Image src={img} alt={`Thumb ${i}`} fill className="object-contain" />
                                    </div>
                                </button>
                            ))}
                            {/* Representative lifestyle image if available */}
                            <div className="w-[150px] h-[110px] flex-shrink-0 bg-gray-100 rounded-[24px] overflow-hidden relative">
                                <Image src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=400" alt="Lifestyle" fill className="object-cover" />
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Product Purchase Details */}
                    <div className="lg:w-[38%] flex flex-col pt-2">
                        <div className="mb-4">
                            <h1 className="text-[28px] font-bold text-[#1D1D1F] leading-[1.2] mb-2">{product.name}</h1>
                            <div className="flex items-center gap-1.5 mb-2">
                                <div className="flex text-[#FF9500]">
                                    {[1, 2, 3, 4, 5].map(s => <FaStar key={s} size={14} className={s === 5 ? "opacity-30" : ""} />)}
                                </div>
                                <span className="text-[14px] font-medium text-gray-500">4.5(12)</span>
                            </div>

                            <div className="inline-block border-b-2 border-gray-900 pb-0.5 mt-2">
                                <span className="text-[15px] font-bold">Refundable Amount - ₹{product.securityDeposit || 10000}</span>
                            </div>
                        </div>

                        {/* Rental Configuration Card */}
                        <div className="border border-gray-100 rounded-[32px] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] mb-4 p-5">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-[15px] font-bold">
                                    Select your <span className="underline decoration-gray-900 underline-offset-4">minimum rental period</span>
                                </h3>
                                <Link href="#" className="text-[12px] font-bold text-[#FF9500] hover:underline">compare all tenures</Link>
                            </div>

                            {/* Custom Slider */}
                            <div className="relative px-2 mb-10">
                                <div className="absolute top-[10px] left-2 right-2 h-[4px] bg-gray-100 rounded-full" />
                                <div
                                    className="absolute top-[10px] left-2 h-[4px] bg-[#FF4500] rounded-full transition-all duration-300"
                                    style={{ width: `${(((duration <= 1 ? 1 : duration <= 3 ? 2 : duration <= 6 ? 3 : duration <= 9 ? 4 : 5) - 1) / 4) * 100}%` }}
                                />
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
                                    className="relative w-full appearance-none bg-transparent h-6 cursor-pointer z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-[#FF4500] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md"
                                />
                                {/* Ticks */}
                                <div className="flex justify-between px-[1px] -mt-1 pb-4">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className={`w-[8px] h-[8px] rounded-full border-2 ${i <= (duration <= 1 ? 1 : duration <= 3 ? 2 : duration <= 6 ? 3 : duration <= 9 ? 4 : 5) ? 'bg-[#FF4500] border-[#FF4500]' : 'bg-gray-300 border-gray-300'}`} />
                                    ))}
                                </div>
                                <div className="flex justify-between text-[13px] font-bold text-gray-800">
                                    {tenures.map(t => (
                                        <span key={t.months} className={duration === t.months ? "text-[#FF4500]" : "text-gray-400"}>
                                            {t.label}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Quantity Selector */}
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-[14px] font-bold text-gray-900">Quantity</span>
                                <div className="flex items-center border border-gray-200 rounded-full h-10 px-2 gap-4 bg-white">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black transition-colors"><FaMinus size={10} /></button>
                                    <span className="text-[15px] font-bold w-4 text-center">{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black transition-colors"><FaPlus size={10} /></button>
                                </div>
                            </div>

                            {/* Price and Benefits Box */}
                            <div className="bg-gray-50/50 border border-gray-100 rounded-[20px] overflow-hidden">
                                <div className="flex p-4">
                                    <div className="flex-1 flex flex-col justify-center">
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="text-[28px] font-bold text-[#1D1D1F]">₹{currentPlan.price * quantity}</span>
                                            <span className="text-[14px] font-medium text-gray-500">/month</span>
                                            <span className="text-[16px] text-gray-400 line-through ml-2 font-medium">₹{Math.round(currentPlan.price * 1.5)}</span>
                                        </div>
                                    </div>

                                    <div className="w-[1px] bg-gray-200 mx-4" />

                                    <div className="flex-1 py-1">
                                        <ul className="space-y-1.5">
                                            <li className="flex items-center gap-2 text-[12px] font-bold text-gray-700">
                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                                                Free relocation
                                            </li>
                                            <li className="flex items-center gap-2 text-[12px] font-bold text-gray-700">
                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                                                Free upgrades
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <button className="w-full py-2 bg-gray-100/80 text-[12px] font-bold text-gray-600 hover:bg-gray-200 transition-colors uppercase tracking-widest border-t border-gray-100">
                                    View All Benefits
                                </button>
                            </div>
                        </div>

                        {/* Secondary Info Cards */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="border border-[#FFE0B2] bg-[#FFF8E1] p-4 rounded-2xl flex flex-col gap-1 cursor-pointer hover:shadow-sm transition-shadow">
                                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-100 mb-1">
                                    <BsBoxSeam className="text-orange-600" size={16} />
                                </div>
                                <span className="text-[11px] font-bold text-gray-800 leading-tight">What if I cancel or return before 6 months?</span>
                                <span className="text-[11px] font-bold text-[#FF4500] mt-auto">View Details</span>
                            </div>
                            <div className="border border-[#FFE0B2] bg-[#FFF8E1] p-4 rounded-2xl flex flex-col gap-1 cursor-pointer hover:shadow-sm transition-shadow">
                                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-100 mb-1">
                                    <BsTruck className="text-orange-600" size={16} />
                                </div>
                                <span className="text-[11px] font-bold text-gray-800 leading-tight">How do I extend tenure after 6 months?</span>
                                <span className="text-[11px] font-bold text-[#FF4500] mt-auto">View Details</span>
                            </div>
                        </div>

                        {/* Primary CTA */}
                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-[#FFB300] hover:bg-[#FFA000] active:scale-[0.98] text-white font-black py-4.5 rounded-2xl text-[17px] shadow-lg shadow-[#FFB300]/20 transition-all flex items-center justify-center gap-3 mb-8"
                        >
                            Book Your Plan <FaShoppingCart className="text-xl" />
                        </button>

                        {/* Assurance Cards */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-[#E3F2FD] p-3 rounded-2xl flex flex-col gap-3">
                                <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                    <FaStar size={14} />
                                </div>
                                <div>
                                    <h4 className="text-[11px] font-bold text-blue-900 leading-tight mb-1">Great Condition Promise</h4>
                                    <p className="text-[10px] font-medium text-blue-800/80 leading-snug">Product as good as new</p>
                                </div>
                            </div>
                            <div className="bg-[#E3F2FD] p-3 rounded-2xl flex flex-col gap-3">
                                <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                    <BsBoxSeam size={14} />
                                </div>
                                <div>
                                    <h4 className="text-[11px] font-bold text-blue-900 leading-tight mb-1">Support</h4>
                                    <p className="text-[10px] font-medium text-blue-800/80 leading-snug">Free Repairs & Maintenance</p>
                                </div>
                            </div>
                            <div className="bg-[#E3F2FD] p-3 rounded-2xl flex flex-col gap-3">
                                <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                    <BsCreditCard size={14} />
                                </div>
                                <div>
                                    <h4 className="text-[11px] font-bold text-blue-900 leading-tight mb-1">Easy Payments</h4>
                                    <p className="text-[10px] font-medium text-blue-800/80 leading-snug">No Deposits, Small, secure payments</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Technical Specs / Tabbed details */}
                <div className="mt-16 mb-20">
                    <div className="flex justify-center gap-3 mb-12">
                        {['Product Details', 'Return Policy', 'Shipping Policy'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-10 py-3.5 rounded-full text-[15px] font-bold transition-all ${activeTab === tab ? 'bg-gray-900 text-white shadow-xl translate-y-[-2px]' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="bg-white border border-gray-100 rounded-[40px] p-12 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-16">
                            {specs.map((item, i) => (
                                <div key={i} className="flex flex-col gap-2 group">
                                    <span className="text-[13px] font-black text-gray-400 uppercase tracking-[2px] mb-1 group-hover:text-black transition-colors">{item.label}</span>
                                    <div className="w-8 h-[2px] bg-gray-100 group-hover:w-full transition-all duration-500 mb-1" />
                                    <span className="text-[18px] font-bold text-gray-900">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
