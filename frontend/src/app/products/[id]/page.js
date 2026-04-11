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
import BestRentedProducts from '../../../components/BestRentedProducts';
import FaqSection from '../../../components/FaqSection';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

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
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

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
        <div className="min-h-screen bg-[#F7F7F7] font-sans text-[#1D1D1F] tracking-tight antialiased pt-10 pb-10">
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

                        {/* Main Image Slider */}
                        <div className="relative w-full bg-white border border-[#EDEDED] rounded-xl flex items-center justify-center p-6 group overflow-hidden shrink-0 h-[350px] md:h-[523px]">
                            <span className="absolute top-6 left-6 z-10 bg-[#FF3B30] text-white text-[12px] font-bold px-3 py-1 rounded-[6px] tracking-wide">20% off</span>

                            <div className="absolute top-6 right-6 z-10 flex flex-col gap-3">
                                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f6f6f6] text-[#555] hover:text-[#FF3B30] hover:bg-white transition-colors border border-transparent hover:border-gray-200">
                                    <FaHeart size={15} />
                                </button>
                                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f6f6f6] text-[#555] hover:text-black hover:bg-white transition-colors border border-transparent hover:border-gray-200">
                                    <FaShareAlt size={15} />
                                </button>
                            </div>

                            <Swiper
                                style={{
                                    "--swiper-navigation-color": "#555",
                                    "--swiper-navigation-size": "20px",
                                    width: "100%",
                                    height: "100%"
                                }}
                                loop={true}
                                spaceBetween={10}
                                navigation={true}
                                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                                modules={[FreeMode, Navigation, Thumbs]}
                                className="main-image-swiper"
                            >
                                {(product.images && product.images.length > 0 ? product.images : [mainImage, mainImage, mainImage, mainImage]).map((img, index) => (
                                    <SwiperSlide key={index} className="flex items-center justify-center">
                                        <div className="relative w-full h-full flex items-center justify-center object-contain mix-blend-darken brightness-[1.08] contrast-[1.04] p-4 group-hover:scale-105 transition-transform duration-700 ease-out">
                                            <Image
                                                src={img}
                                                alt={`${product.name} - ${index}`}
                                                fill
                                                className="object-contain"
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                                priority={index === 0}
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>

                        {/* Thumbnails Slider */}
                        <div className="w-full h-[80px] md:h-[110px]">
                            <Swiper
                                onSwiper={setThumbsSwiper}
                                loop={true}
                                spaceBetween={12}
                                slidesPerView={4}
                                freeMode={true}
                                watchSlidesProgress={true}
                                modules={[FreeMode, Navigation, Thumbs]}
                                className="thumbs-swiper h-full"
                                breakpoints={{
                                    320: { slidesPerView: 3, spaceBetween: 10 },
                                    768: { slidesPerView: 4, spaceBetween: 12 }
                                }}
                            >
                                {(product.images && product.images.length > 0 ? product.images : [mainImage, mainImage, mainImage, mainImage]).map((img, i) => (
                                    <SwiperSlide key={i}>
                                        <div className="w-full h-full bg-white border border-[#EDEDED] rounded-xl p-2 flex items-center justify-center cursor-pointer transition-all hover:border-gray-400 overflow-hidden relative">
                                            <Image src={img} alt={`Thumb ${i}`} fill className="object-contain mix-blend-darken brightness-[1.08] contrast-[1.04]" />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>

                        {/* Tabs + Table Details */}
                        <div className="w-full mb-10 mt-2">
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
                    {/* Right Column - Product Purchase Details */}
                    <div className="flex flex-col gap-5">

                        {/* Main White Card (Title, Rating, Slider, Price) */}
                        <div className="bg-white rounded-[20px] p-6 shadow-[0_2px_12px_max(0,rgba(0,0,0,0.04))] border border-[#EDEDED] flex flex-col pt-7 pb-6">
                            {/* Title */}
                            <h1 className="text-[22px] font-bold text-[#1D1D1F] leading-[1.3] tracking-tight pr-4">
                                {product.name}
                            </h1>

                            {/* Rating & Stock */}
                            <div className="flex items-center gap-3 mt-3 mb-6">
                                <div className="flex items-center gap-1">
                                    <div className="flex text-[#FF9500]">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <FaStar key={s} size={14} className={s <= Math.round(product.rating || 0) ? "" : "text-gray-200"} />
                                        ))}
                                    </div>
                                    <span className="text-[13px] font-medium text-gray-500 ml-1">{product.rating || "4.5"} ({product.numReviews || 12})</span>
                                </div>
                                <div className="bg-green-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-[4px] tracking-wide flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-white rounded-full block"></span> In Stock
                                </div>
                            </div>

                            {/* Rental Period Selection */}
                            <div className="flex justify-between items-center mt-2 mb-1">
                                <h3 className="text-[13px] font-medium text-gray-800">
                                    Select your <span className="underline decoration-blue-500 underline-offset-4 decoration-[1.5px] decoration-dashed text-[#007AFF]">minimum rental period</span>
                                </h3>
                                <span className="text-[14px] font-bold text-[#1D1D1F]">{duration === 1 ? '1 Month' : `${duration} Months`}</span>
                            </div>

                            {/* Tenure Slider */}
                            <div className="relative mb-2 mt-4 ml-1 mr-1">
                                {/* Track */}
                                {(() => {
                                    const currentStep = duration <= 1 ? 1 : duration <= 3 ? 2 : duration <= 6 ? 3 : duration <= 9 ? 4 : 5;
                                    const activePct = ((currentStep - 1) / 4) * 100;
                                    return (
                                        <div
                                            className="relative h-[6px] rounded-full flex items-center"
                                            style={{ background: `linear-gradient(to right, #EA580C ${activePct}%, #E5E7EB ${activePct}%)` }}
                                        >
                                            {[1, 2, 3, 4, 5].map(step => {
                                                const pct = ((step - 1) / 4) * 100;
                                                const isActive = step <= currentStep;
                                                return (
                                                    <div
                                                        key={step}
                                                        className={`absolute w-[16px] h-[16px] rounded-full bg-white transition-colors duration-300 z-10 border-[3px] ${isActive ? 'border-[#EA580C]' : 'border-gray-300'}`}
                                                        style={{ left: `calc(${pct}% - 8px)` }}
                                                    />
                                                );
                                            })}
                                            <input
                                                type="range"
                                                min="1"
                                                max="5"
                                                step="1"
                                                value={currentStep}
                                                onChange={(e) => {
                                                    const step = parseInt(e.target.value);
                                                    const months = [1, 3, 6, 9, 12];
                                                    setDuration(months[step - 1]);
                                                }}
                                                className="absolute w-full h-full opacity-0 cursor-pointer z-20"
                                            />
                                        </div>
                                    );
                                })()}

                                {/* Labels Below */}
                                <div className="flex justify-between mt-[14px] text-[12px] text-gray-500 font-medium">
                                    <span className="text-left w-6">1+</span>
                                    <span className="text-center w-6">3+</span>
                                    <span className="text-center w-6">6+</span>
                                    <span className="text-center w-6">9+</span>
                                    <span className="text-right w-6">12+</span>
                                </div>
                            </div>

                            {/* Links */}
                            <div className="flex justify-between items-center text-[12px] font-bold text-[#EA580C] underline decoration-orange-200 underline-offset-4 mt-2">
                                <Link href="#" className="hover:text-orange-700 transition">price breakdown</Link>
                                <Link href="#" className="hover:text-orange-700 transition">compare all tenures</Link>
                            </div>

                            <div className="w-full h-[1px] bg-gray-100 my-5"></div>

                            {/* Price and Quantity */}
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-[8px]">
                                    <span className="text-[26px] font-bold text-[#FF3B30] tracking-tight leading-none">₹{currentPlan.price * quantity}</span>
                                    <span className="text-[13px] font-medium text-gray-500 self-end mb-0.5">/month</span>
                                    <div className="flex items-center gap-2 ml-2 self-end mb-0.5">
                                        <span className="text-[13px] font-medium text-gray-400 line-through">₹{Math.round(currentPlan.price * 1.5) * quantity}</span>
                                        <span className="bg-[#FF3B30] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-[4px]">20% off</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="text-[12px] text-[#1D1D1F] font-bold">Quantity</span>
                                    <div className="flex items-center gap-3 border border-gray-200 rounded-md px-2 py-1 bg-white">
                                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-400 hover:text-black w-4 h-4 flex items-center justify-center">
                                            <FaMinus size={9} />
                                        </button>
                                        <span className="text-[13px] font-medium w-3 text-center text-[#1D1D1F]">{quantity}</span>
                                        <button onClick={() => setQuantity(quantity + 1)} className="text-gray-400 hover:text-black w-4 h-4 flex items-center justify-center">
                                            <FaPlus size={9} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full pt-5 text-[11px] font-bold text-black uppercase tracking-widest text-center">
                                VIEW ALL BENEFITS
                            </button>
                        </div>

                        {/* What's included in your plan */}
                        <div>
                            <h4 className="text-[13px] font-bold text-gray-800 mb-3 px-1">What's included in your plan</h4>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 shrink-0">
                                <div className="bg-[#007AFF] text-white rounded-[8px] flex items-center gap-2 px-3 py-2.5 shadow-sm">
                                    <div className="shrink-0"><FaStar size={12} /></div>
                                    <span className="text-[11px] font-bold leading-tight">Fully Functional</span>
                                </div>
                                <div className="bg-[#007AFF] text-white rounded-[8px] flex items-center gap-2 px-3 py-2.5 shadow-sm">
                                    <div className="shrink-0"><BsBoxSeam size={12} /></div>
                                    <span className="text-[11px] font-bold leading-tight">Accessories Included</span>
                                </div>
                                <div className="bg-[#007AFF] text-white rounded-[8px] flex items-center gap-2 px-3 py-2.5 shadow-sm">
                                    <div className="shrink-0"><BsTruck size={12} /></div>
                                    <span className="text-[11px] font-bold leading-tight">Free Repairs & Maintenance</span>
                                </div>
                                <div className="bg-[#007AFF] text-white rounded-[8px] flex items-center gap-2 px-3 py-2.5 shadow-sm">
                                    <div className="shrink-0"><BsBoxSeam size={12} /></div>
                                    <span className="text-[11px] font-bold leading-tight">Professionally sanitized</span>
                                </div>
                            </div>
                        </div>

                        {/* Deposit & KYC Banner */}
                        <div className="bg-[#EBF3FF] rounded-[10px] flex overflow-hidden border border-blue-100 shadow-sm mt-1">
                            {/* Left part */}
                            <div className="bg-[#DEF8FA] flex flex-col justify-center px-4 py-3 min-w-[35%] shrink-0 border-r border-blue-100">
                                <span className="text-[12px] font-bold text-[#007AFF] mb-0.5">100% Refundable Deposit</span>
                                <span className="text-[16px] font-bold text-[#007AFF]">₹{product.securityDeposit || '20,000'}</span>
                            </div>
                            {/* Right part */}
                            <div className="flex items-center justify-between px-4 py-3 flex-1 bg-[#E8F0FE]">
                                <p className="text-[11px] font-bold text-[#0066CC] leading-tight pr-2">
                                    Place Order & complete KYC anytime<br />to get your item delivered fast
                                </p>
                                <div className="bg-white/80 p-1.5 rounded text-[#0066CC] shrink-0">
                                    <FaShareAlt size={12} />
                                </div>
                            </div>
                        </div>

                        {/* Primary CTA */}
                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-[#FFCC00] hover:bg-[#F5C200] active:scale-[0.99] text-[#1D1D1F] font-bold py-[16px] rounded-[12px] text-[15px] transition-all flex items-center justify-center shrink-0 mt-2 shadow-sm"
                        >
                            Rent Now
                        </button>

                        {/* Secondary Info Cards */}
                        <div className="grid grid-cols-2 gap-3 shrink-0 mt-1">
                            <div className="border border-[#FDE68A] bg-[#FFF9E6] px-4 py-4 rounded-[12px] flex flex-col gap-1.5 cursor-pointer hover:shadow-sm transition-shadow">
                                <div className="flex items-start gap-2 mb-1">
                                    <div className="mt-0.5 text-[#EA580C] shrink-0"><BsTruck size={14} /></div>
                                    <span className="text-[11px] font-bold text-gray-800 leading-snug">What if I cancel or return before 6 months?</span>
                                </div>
                                <span className="text-[11px] font-bold text-[#EA580C] self-end mt-auto underline underline-offset-2">View Details</span>
                            </div>
                            <div className="border border-[#FDE68A] bg-[#FFF9E6] px-4 py-4 rounded-[12px] flex flex-col gap-1.5 cursor-pointer hover:shadow-sm transition-shadow">
                                <div className="flex items-start gap-2 mb-1">
                                    <div className="mt-0.5 text-[#EA580C] shrink-0"><FaStar size={14} /></div>
                                    <span className="text-[11px] font-bold text-gray-800 leading-snug">How do I extend tenure after 6 months?</span>
                                </div>
                                <span className="text-[11px] font-bold text-[#EA580C] self-end mt-auto underline underline-offset-2">View Details</span>
                            </div>
                        </div>

                        {/* Delivery Details */}
                        <div className="flex items-center gap-3 pt-1 shrink-0 border border-gray-200 rounded-[12px] p-3 bg-white mt-1 shadow-sm">
                            <div className="flex items-center gap-1.5 min-w-max">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                <span className="text-[12px] font-bold text-gray-700">Delivery</span>
                            </div>

                            <div className="w-[1px] h-6 bg-gray-200"></div>

                            <input
                                type="text"
                                placeholder="Enter your pincode"
                                className="border border-gray-200 rounded-md px-2.5 py-1.5 text-[12px] flex-1 outline-none focus:border-blue-300 w-full"
                            />

                            <button className="text-[10px] font-medium text-gray-500 text-center leading-tight max-w-[100px] hover:text-gray-800">
                                Check availability in your state
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <BestRentedProducts />
            <FaqSection />
        </div>
    );
}

// Force Next.js Fast Refresh
