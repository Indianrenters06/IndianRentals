"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaHeart, FaShareAlt, FaMinus, FaPlus, FaShoppingCart, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { BsTruck, BsBoxSeam, BsCreditCard } from 'react-icons/bs';

import { useDispatch } from 'react-redux';
import { addToCart } from '../../../redux/features/cartSlice';

export default function ProductPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [duration, setDuration] = useState(1);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('Product Details');

    // FAQ State
    const [openFaq, setOpenFaq] = useState(0);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? -1 : index);
    };

    const tenures = [
        { label: '1+', months: 1, price: 2560 },
        { label: '3+', months: 3, price: 2200 },
        { label: '6+', months: 6, price: 1800 },
        { label: '9+', months: 9, price: 1600 },
        { label: '12+', months: 12, price: 1480 },
    ];

    const currentPlan = tenures.find(t => duration <= t.months) || tenures[tenures.length - 1]; // Simplified logic

    // Find the closest tenure point for the slider
    const handleSliderChange = (e) => {
        const val = parseInt(e.target.value);
        // Snap to nearest available tenure
        // For simplicity, just set duration directly 
        setDuration(val);
    };

    const benefits = [
        "Free relocation",
        "Free upgrades"
    ];

    const specs = [
        { label: "MODEL", value: "MacBook Pro M4 Pro" },
        { label: "OPERATING SYSTEM", value: "Mac OS" },
        { label: "DISPLAY", value: "16.2 inches (3024 x 1964)" }, // Screenshot says 14" title but 16.2 specs? I'll stick to screenshot text which says 16.2 in specs section
        { label: "MEMORY", value: "24GB" },
        { label: "GRAPHICS", value: "Apple Integrated 16-core GPU" },
        { label: "PROCESSOR", value: "Apple M4 Pro" },
        { label: "DIMENSIONS", value: "35.57 x 35.57 x 1.68 cm * 2.14 kg" },
        { label: "STORAGE", value: "512GB SSD" },
        { label: "KEYBOARD LANGUAGE", value: "English (Qwerty)" },
    ];

    const faqs = [
        { question: "What is the minimum rental period?", answer: "The minimum rental period for this MacBook Pro is 1 month. You can choose from flexible tenures of 1, 3, 6, or 12 months." },
        { question: "Is maintenance included?", answer: "Yes, basic maintenance and support are included throughout your rental period. If you encounter any technical issues, simply reach out to our support team." },
        { question: "What if I want to extend my rental?", answer: "Extending your rental is easy! You can manage your rental period directly from your account dashboard or contact our customer service team before your current tenure ends." },
        { question: "What happens if the product gets damaged?", answer: "We understand accidents happen. Our rental agreement outlines policies for minor and major damages. We encourage you to review our full terms and conditions for details, or contact us for clarification." },
    ];

    const handleAddToCart = () => {
        const item = {
            id: 'macbook-pro-14-m4', // Unique ID for this product
            name: "MacBook Pro 14” - Apple M4 chip",
            image: "/images/macbook-pro-white.png",
            price: currentPlan.price,
            monthlyRent: currentPlan.price,
            duration: duration,
            quantity: quantity,
            refundableAmount: 10000,
            description: "16GB Memory 512GB SSD - Integrated 12-Core GPU",
            tenures: tenures
        };
        dispatch(addToCart(item));
        router.push('/cart');
    };

    return (
        <div className="min-h-screen bg-white font-sans text-[#1D1D1F] tracking-tight antialiased">
            {/* Breadcrumb */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 text-sm text-gray-500">
                <Link href="/" className="text-black hover:text-gray hover:underline">Shop all</Link>
                <span className="mx-2">›</span>
                <button onClick={() => router.back()} className="text-black hover:text-gray hover:underline">Category</button>
                <span className="mx-2">›</span>
                <span className="text-black font-medium">Macbook Pro</span>
            </div>

            <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left Column - Images */}
                    <div className="lg:w-[55%] ">
                        <div className="relative mb-6">
                            <span className="absolute top-5 left-0 z-10 bg-[#FF3B30] text-white text-[11px] font-medium px-2 py-0.5 ml-4 rounded-lg uppercase tracking-wider shadow-sm">20% off</span>
                            <div className="absolute top-4 right-4 flex flex-col gap-3 z-10">
                                <button className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-sm">
                                    <FaHeart size={14} />
                                </button>
                                <button className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-black transition-colors shadow-sm">
                                    <FaShareAlt size={14} />
                                </button>
                            </div>

                            {/* Main Image Container */}
                            <div className="border border-gray-200 rounded-[24px] bg-white p-6 relative mb-6 flex items-center justify-center h-[400px]">
                                <button className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:text-black transition-colors z-10"><FaChevronDown className="rotate-90" size={14} /></button>
                                <button className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:text-black transition-colors z-10"><FaChevronDown className="-rotate-90" size={14} /></button>

                                <Image
                                    src="/images/macbook-pro-white.png"
                                    alt="MacBook Pro 14 M4"
                                    width={700}
                                    height={500}
                                    className="object-contain max-h-full w-auto"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Thumbnails */}
                        <div className="flex gap-4 justify-center">
                            {[1, 2, 3, 4].map((i) => (
                                <button key={i} className="w-[153px] h-[153px] flex-shrink-0 bg-white border border-gray-200 rounded-[20px] p-4 flex items-center justify-center hover:border-gray-400 transition-all shadow-sm">
                                    <div className="w-full h-full relative">
                                        <Image
                                            src="/images/macbook-pro-white.png"
                                            alt={`View ${i}`}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="lg:w-[36%] pl-4 pt-0">
                        <h1 className="text-[22px] font-semibold text-[#1D1D1F] leading-tight mb-1 underline decoration-from-font underline-offset-2">MacBook Pro 14” - Apple M4 chip</h1>
                        <h2 className="text-[22px] text-[#1D1D1F] mb-3 font-semibold leading-snug underline decoration-from-font underline-offset-2">16GB Memory 512GB SSD - Integrated <br /> 12-Core GPU</h2>

                        <div className="text-[16px] font-medium text-[#1D1D1F] mb-4 inline-block underline decoration-from-font underline-offset-2">
                            Refundable Amount - <span className="font-bold">₹10000</span>
                        </div>

                        {/* Combined Rental Card */}
                        <div className="border border-gray-200 rounded-xl bg-white mb-2 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                            {/* Slider Section */}
                            <div className="p-2 pb-2">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[13px] font-semibold underline decoration-1 underline-offset-1 decoration-black/30">Select your minimum rental period</span>
                                    <a href="#" className="text-[11px] font-semibold text-[#FF8A00] underline decoration-1 ">compare all tenures</a>
                                </div>

                                <div className="relative px-2 mb-6">
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
                                        className="w-full relative z-20"
                                    />
                                    <div className="absolute top-4 left-0 w-full flex justify-between text-[10px] text-gray-400 font-medium px-1 mt-2">
                                        <span className={duration === 1 ? "text-black" : ""}>1+</span>
                                        <span className={duration === 3 ? "text-black" : ""}>3+</span>
                                        <span className={duration === 6 ? "text-black" : ""}>6+</span>
                                        <span className={duration === 9 ? "text-black" : ""}>9+</span>
                                        <span className={duration === 12 ? "text-black" : ""}>12+</span>
                                    </div>
                                    <div className="absolute top-[2px] left-[2px] right-[2px] flex justify-between h-2 pointer-events-none z-10 w-full px-1">
                                        {[0, 1, 2, 3, 4].map(i => <div key={i} className="w-[1px] h-2 bg-white/0"></div>)}
                                    </div>
                                </div>

                                {/* Quantity Row inside Card */}
                                <div className="flex items-center gap-6 ">
                                    <span className="text-[14px] italic text-[#1D1D1F] font-serif">Quantity</span>
                                    <div className="flex items-center border border-gray-300 rounded-lg h-4 px-2 gap-3 bg-white">
                                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-400 hover:text-black transition-colors"><FaMinus size={8} /></button>
                                        <span className="text-[14px] font-medium w-4 text-center text-[#1D1D1F]">{quantity}</span>
                                        <button onClick={() => setQuantity(quantity + 1)} className="text-gray-400 hover:text-black transition-colors"><FaPlus size={8} /></button>
                                    </div>
                                </div>
                            </div>

                            {/* Divider to Price Section */}
                            <div className="border-t border-gray-100"></div>

                            {/* Price & Benefits Row */}
                            <div className="flex flex-row">
                                <div className="p-4 pl-5 flex-1 flex flex-col justify-center">
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-[32px] font-bold text-[#1D1D1F]">₹{currentPlan.price * quantity}</span>
                                        <span className="text-xs text-gray-500 font-normal">/month</span>
                                        <span className="text-sm text-gray-400 line-through ml-1">₹{2560 * quantity}</span>
                                    </div>
                                </div>
                                <div className="p-4 border-l border-gray-100 flex flex-col justify-center min-w-[140px]">
                                    <div className="flex flex-col gap-1.5">
                                        {benefits.map((benefit, index) => (
                                            <div key={index} className="flex items-center gap-2 text-[12px] text-[#1D1D1F] font-semibold">
                                                <span className="w-1 h-1 bg-black rounded-full"></span>
                                                {benefit}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {/* Footer Bar */}
                            <div className="bg-gray-100  text-center border-t border-gray-200">
                                <button className="text-[12px] font-bold text-black  tracking-wider hover:text-black transition-colors">View All Benefits</button>
                            </div>
                        </div>

                        {/* Info Cards - Compact */}
                        <div className="grid grid-cols-2 gap-3 mb-2">
                            <div className="bg-[#FFF9E5] p-3 rounded-xl relative group cursor-pointer hover:bg-[#FFF5D6] transition-colors">
                                <div className="flex flex-col">
                                    <div className="flex flex-col ">
                                        <BsTruck className="text-lg text-black mt-0.5" />
                                        <span className="text-[13px] font-semibold leading-tight text-[#1D1D1F] underline decoration-1 underline-offset-1">What if I cancel or return before 6 months?</span>
                                    </div>
                                    <button className="text-[#E63E32] text-[14px] font-bold text-right underline decoration-1 underline-offset-1">View Details</button>
                                </div>
                            </div>
                            <div className="bg-[#FFF9E5] p-3 rounded-xl relative group cursor-pointer hover:bg-[#FFF5D6] transition-colors">
                                <div className="flex flex-col ">
                                    <div className="flex flex-col">
                                        <BsBoxSeam className="text-lg text-black" />
                                        <span className="text-[13px]  font-semibold leading-tight text-[#1D1D1F] underline decoration-1 underline-offset-1">How do I extend tenure after 6 months?</span>
                                    </div>
                                    <button className="text-[#E63E32] text-[14px] font-bold text-right underline decoration-1 underline-offset-1">View Details</button>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-[#FFC72C] hover:bg-[#FFD740] active:scale-[0.99] text-[#1D1D1F] font-bold py-3.5 rounded-full text-[16px] shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 mb-6"
                        >
                            Book Your Plan <FaShoppingCart className="text-lg" />
                        </button>

                        {/* Trust Badges - Compact */}
                        <div className="grid grid-cols-3 gap-2">
                            <div className="bg-[#F0F8FF] p-2.5 rounded-lg flex flex-col gap-1 h-full">
                                <div className="text-[#007AFF] mb-1"><FaHeart size={14} /></div>
                                <span className="text-[#0066CC] font-semibold text-[13px] leading-tight  underline decoration-1 underline-offset-1">Great Condition Promise</span>
                                <span className="text-[#5EA1D8] text-[12px] leading-tight font-medium  underline decoration-1 underline-offset-1">Product as good as new</span>
                            </div>
                            <div className="bg-[#F0F8FF] p-2.5 rounded-lg flex flex-col gap-1 h-full">
                                <div className="text-[#007AFF] mb-1"><BsBoxSeam size={14} /></div>
                                <span className="text-[#0066CC] font-semibold text-[13px] leading-tight  underline decoration-1 underline-offset-1">Support</span>
                                <span className="text-[#5EA1D8] text-[12px] leading-tight font-medium  underline decoration-1 underline-offset-1">Free Repairs & Maintenance</span>
                            </div>
                            <div className="bg-[#F0F8FF] p-2.5 rounded-lg flex flex-col gap-1 h-full">
                                <div className="text-[#007AFF] mb-1"><BsCreditCard size={14} /></div>
                                <span className="text-[#0066CC] font-semibold text-[13px] leading-tight  underline decoration-1 underline-offset-1">Easy Payments</span>
                                <span className="text-[#5EA1D8] text-[12px] leading-tight font-medium  underline decoration-1 underline-offset-1">No Deposits. Small, secure payments</span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Below Fold Content - Tabs Box */}
                <div className="mt-10">
                    <div className="border border-gray-200 rounded-[24px] p-8 bg-white">
                        {/* Tabs */}
                        <div className="flex justify-center gap-4 mb-8">
                            {['Product Details', 'Return Policy', 'Shipping Policy'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-8 py-3 rounded-full text-lg font-light transition-all underline decoration-1 underline-offset-1 ${activeTab === tab ? 'bg-[#333333] text-white' : 'bg-[#EBEBEB] text-[#1D1D1F] hover:bg-[#d6d6d6]'} font-normal`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Divider Line */}
                        <div className="border-b border-gray-300 mb-8 mx-0"></div>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-12 px-2">
                            {specs.map((item, i) => (
                                <div key={i} className="flex flex-col gap-1.5">
                                    <span className="text-[16px] font-semibold text-black uppercase underline decoration-1 underline-offset-1">{item.label}</span>
                                    <span className="text-lg text-[#1D1D1F] underline decoration-1 underline-offset-1 decoration-gray-300">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Best Rented Products */}
                <div className="mt-24 mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-[32px] font-medium text-[#1D1D1F] tracking-tight">Best Rented Products</h2>
                        <button className="bg-[#FFC72C] px-6 py-2.5 rounded-full text-[14px] font-semibold text-black hover:bg-[#FFD740] transition-colors">More Categories</button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Card 1 */}
                        <div className="border border-gray-100 rounded-[28px] p-4 bg-white hover:shadow-lg transition-shadow cursor-pointer group">
                            <div className="relative aspect-square mb-4 bg-[#F5F5F7] rounded-[20px] flex items-center justify-center p-6">
                                <span className="absolute top-4 left-4 bg-[#FF3B30] text-white text-[10px] font-medium px-2 py-1 rounded-[4px]">-20% off</span>
                                <button className="absolute top-4 right-4 text-black/50 hover:text-[#FF3B30] transition-colors"><FaHeart size={18} /></button>
                                <Image src="/images/macbook-pro.png" alt="MacBook Pro" width={200} height={200} className="object-contain" />
                            </div>
                            <h3 className="text-[15px] font-semibold text-[#1D1D1F] mb-1 leading-snug">MacBook Pro 14” - Apple M4 chip 1...</h3>
                            <p className="text-[11px] text-[#86868b] mb-1 leading-relaxed font-medium font-sans">Liquid Retina XDR Pro motion 14.2", keyboard - indian</p>
                            <div className="flex items-baseline gap-1.5 mt-auto">
                                <span className="text-[11px] text-[#86868b] font-medium">from</span>
                                <span className="text-[13px] text-[#1D1D1F] font-medium line-through">₹8999</span>
                                <span className="text-[15px] font-bold text-[#FF3B30]">₹5000</span>
                                <span className="text-[11px] text-[#86868b]">/month</span>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="border border-gray-100 rounded-[28px] p-4 bg-white hover:shadow-lg transition-shadow cursor-pointer group">
                            <div className="relative aspect-square mb-4 bg-[#F5F5F7] rounded-[20px] flex items-center justify-center p-6">
                                <span className="absolute top-4 left-4 bg-[#FF3B30] text-white text-[10px] font-medium px-2 py-1 rounded-[4px]">-20% off</span>
                                <button className="absolute top-4 right-4 text-black/50 hover:text-[#FF3B30] transition-colors"><FaHeart size={18} /></button>
                                {/* Placeholder for Camera */}
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center"><BsBoxSeam size={64} opacity={0.2} /></div>
                            </div>
                            <h3 className="text-[15px] font-semibold text-[#1D1D1F] mb-1 leading-snug">Sony Alpha 7 IV Camera Kit with FE...</h3>
                            <p className="text-[11px] text-[#86868b] mb-1 leading-relaxed font-medium font-sans">Hybrid 33MP up to 10FPS, upto 4k 60p, 7k oversampled for 4K 30p, 5-axis stabilization, Lens...</p>
                            <div className="flex items-baseline gap-1.5 mt-auto">
                                <span className="text-[11px] text-[#86868b] font-medium">from</span>
                                <span className="text-[13px] text-[#1D1D1F] font-medium line-through">₹8999</span>
                                <span className="text-[15px] font-bold text-[#FF3B30]">₹5000</span>
                                <span className="text-[11px] text-[#86868b]">/month</span>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="border border-gray-100 rounded-[28px] p-4 bg-white hover:shadow-lg transition-shadow cursor-pointer group">
                            <div className="relative aspect-square mb-4 bg-[#F5F5F7] rounded-[20px] flex items-center justify-center p-6">
                                <span className="absolute top-4 left-4 bg-[#FF3B30] text-white text-[10px] font-medium px-2 py-1 rounded-[4px]">-20% off</span>
                                <button className="absolute top-4 right-4 text-black/50 hover:text-[#FF3B30] transition-colors"><FaHeart size={18} /></button>
                                {/* Placeholder for iPhone */}
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center"><BsBoxSeam size={64} opacity={0.2} /></div>
                            </div>
                            <h3 className="text-[15px] font-semibold text-[#1D1D1F] mb-1 leading-snug">iPhone Pro Max - A17 chip</h3>
                            <p className="text-[11px] text-[#86868b] mb-1 leading-relaxed font-medium font-sans">6.9" OLED Super Retina XDR, Triple Rear Camera, 8GB RAM, Apple A18 Pro, 5G</p>
                            <div className="flex items-baseline gap-1.5 mt-auto">
                                <span className="text-[11px] text-[#86868b] font-medium">from</span>
                                <span className="text-[13px] text-[#1D1D1F] font-medium line-through">₹8999</span>
                                <span className="text-[15px] font-bold text-[#FF3B30]">₹5000</span>
                                <span className="text-[11px] text-[#86868b]">/month</span>
                            </div>
                        </div>

                        {/* Card 4 */}
                        <div className="border border-gray-100 rounded-[28px] p-4 bg-white hover:shadow-lg transition-shadow cursor-pointer group">
                            <div className="relative aspect-square mb-4 bg-[#F5F5F7] rounded-[20px] flex items-center justify-center p-6">
                                <span className="absolute top-4 left-4 bg-[#FF3B30] text-white text-[10px] font-medium px-2 py-1 rounded-[4px]">-20% off</span>
                                <button className="absolute top-4 right-4 text-black/50 hover:text-[#FF3B30] transition-colors"><FaHeart size={18} /></button>
                                {/* Placeholder for PS5 */}
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center"><BsBoxSeam size={64} opacity={0.2} /></div>
                            </div>
                            <h3 className="text-[15px] font-semibold text-[#1D1D1F] mb-1 leading-snug">Sony Playstation 5 Pro Console</h3>
                            <p className="text-[11px] text-[#86868b] mb-1 leading-relaxed font-medium font-sans">Sony PlayStation 5 Pro Console 4K graphics, 120 hz , 2tb ssd storage drive, built-...</p>
                            <div className="flex items-baseline gap-1.5 mt-auto">
                                <span className="text-[11px] text-[#86868b] font-medium">from</span>
                                <span className="text-[13px] text-[#1D1D1F] font-medium line-through">₹8999</span>
                                <span className="text-[15px] font-bold text-[#FF3B30]">₹5000</span>
                                <span className="text-[11px] text-[#86868b]">/month</span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Carousel Controls */}
                    <div className="flex items-center gap-6">
                        <div className="h-[2px] w-full bg-[#E5E5E5] relative rounded-full overflow-hidden">
                            <div className="absolute left-0 top-0 h-full w-2/3 bg-[#1D1D1F] rounded-full"></div>
                        </div>
                        <div className="flex gap-3 flex-shrink-0">
                            <button className="w-10 h-10 rounded-full bg-[#F5F5F7] flex items-center justify-center text-[#1D1D1F] hover:bg-[#E5E5E5] transition-colors">
                                <FaChevronDown className="rotate-90 text-sm" />
                            </button>
                            <button className="w-10 h-10 rounded-full bg-[#F5F5F7] flex items-center justify-center text-[#1D1D1F] hover:bg-[#E5E5E5] transition-colors">
                                <FaChevronDown className="-rotate-90 text-sm" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="flex flex-col lg:flex-row  pb-20  ">
                    <div className="lg:w-1/3 pr-12 mb-6 lg:mb-0">
                        <h2 className="text-4xl font-medium text-[#1D1D1F] mb-6">Welcome to FAQ!</h2>
                        <p className="text-3xl font-normal text-[#1D1D1F] leading-tight">Everything you need to know about renting with IndianRenters.com</p>
                    </div>
                    <div className="lg:w-2/3 border-t border-gray-500">
                        {faqs.map((faq, index) => (
                            <div key={index} className="border-b border-gray-500 last:border-0">
                                <button
                                    className="w-full text-left py-6 flex items-center justify-between group"
                                    onClick={() => toggleFaq(index)}
                                >
                                    <span className="text-lg font-medium text-[#1D1D1F]">{faq.question}</span>
                                    {openFaq === index ?
                                        <FaChevronUp className="text-gray-400 transition-transform group-hover:text-black" /> :
                                        <FaChevronDown className="text-gray-400 transition-transform group-hover:text-black" />
                                    }
                                </button>
                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-40 opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
                                    <p className="text-gray-500 leading-relaxed pr-8">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
