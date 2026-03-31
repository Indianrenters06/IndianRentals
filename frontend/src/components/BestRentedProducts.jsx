"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaRegHeart, FaStar, FaBolt, FaTruck, FaInfoCircle } from "react-icons/fa";
import { motion } from "framer-motion";

import { API } from "@/services/apiConfig";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/features/cartSlice";

const ProductCard = ({ product, index, isDesktop, handleAddToCart }) => {
    const [isHovered, setIsHovered] = useState(false);
    const router = useRouter();

    return (
        <div
            className="relative group h-full flex-1"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onClick={() => router.push(`/products/${product.id}`)}
        >
            <motion.div
                animate={isHovered ? "hover" : "initial"}
                initial="initial"
                className="bg-white flex flex-col overflow-hidden relative mx-auto w-full rounded-[16px]"
                style={{ 
                    height: isDesktop ? '387px' : '256px',
                    width: isDesktop ? '285px' : '170px',
                    border: "1px solid hsla(0, 0%, 89%, 1)",
                    boxShadow: "0px 1px 2px 0px hsla(0, 0%, 0%, 0.05)",
                    willChange: "transform, height",
                    cursor: "pointer",
                    backgroundColor: "hsla(0, 0%, 100%, 1)",
                    borderRadius: isDesktop ? "16px" : "8px",
                    opacity: 1
                }}
                variants={{
                    initial: { height: isDesktop ? 387 : 256 },
                    hover: { 
                        height: isDesktop ? 440 : 330,
                        transition: { duration: 0.3, ease: [0.45, 1.45, 0.8, 1] }
                    }
                }}
            >
                {/* Image Section */}
                <div
                    className="relative bg-white group-hover:bg-[#F9F9F9] transition-colors duration-500 flex items-center justify-center overflow-hidden shrink-0 h-[184px] md:h-[282px]"
                    style={{
                        width: isDesktop ? '285px' : '170px',
                        borderRadius: isDesktop ? "16px" : "8px",
                        borderWidth: "0px 1px 1px 1px",
                        borderStyle: "solid",
                        borderColor: "hsla(0, 0%, 93%, 1)",
                        backgroundColor: "hsla(0, 0%, 100%, 1)",
                        opacity: 1,
                        boxShadow: "0px 4px 8px 0px hsla(0, 0%, 87%, 0.1), 0px 15px 15px 0px hsla(0, 0%, 87%, 0.09), 0px 33px 20px 0px hsla(0, 0%, 87%, 0.05), 0px 59px 23px 0px hsla(0, 0%, 87%, 0.01), 0px 91px 26px 0px hsla(0, 0%, 87%, 0)"
                    }}
                >
                    <div 
                        className="absolute z-20 flex items-center" 
                        style={{ 
                            top: "19.57px", 
                            left: "13.49px", 
                            gap: "4px",
                            width: "92px",
                            height: "22px"
                        }}
                    >
                        <span className="bg-[#FF3B30] text-white text-[10px] font-bold px-2 py-[4px] rounded-[4px] shadow-sm leading-none flex items-center justify-center h-full">
                            -20% off
                        </span>
                        {product.isNew && (
                            <span 
                                className="text-white text-[10px] font-bold shadow-sm leading-none flex items-center justify-center h-full translate-x-1.5"
                                style={{
                                    width: "34px",
                                    height: "22px",
                                    paddingTop: "4px",
                                    paddingRight: "5px",
                                    paddingBottom: "4px",
                                    paddingLeft: "5px",
                                    borderRadius: "6px",
                                    backgroundColor: "hsla(122, 100%, 35%, 1)",
                                    boxShadow: "0px 0px 1px 0px hsla(0, 0%, 47%, 0.1), 0px 1px 1px 0px hsla(0, 0%, 47%, 0.09), 0px 3px 2px 0px hsla(0, 0%, 47%, 0.05), 0px 5px 2px 0px hsla(0, 0%, 47%, 0.01), 0px 9px 2px 0px hsla(0, 0%, 47%, 0)"
                                }}
                            >
                                New
                            </span>
                        )}
                    </div>
                    
                    <button
                        className="absolute z-20 flex items-center justify-center rounded-full shadow-sm hover:scale-110 transition-all duration-300"
                        style={{ width: "28px", height: "28px", top: "8px", right: "8px", backgroundColor: "white", border: "1px solid #E5E5EA" }}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    >
                        <FaRegHeart size={14} color="#8E8E93" />
                    </button>
                    
                    <div className="relative w-full h-full p-4 flex items-center justify-center">
                        <motion.img
                            variants={{ initial: { scale: 1 }, hover: { scale: 1.05 } }}
                            src={product.image}
                            alt={product.name}
                            className="max-w-full max-h-full object-contain mix-blend-multiply transition-transform duration-700 ease-out"
                        />
                    </div>
                </div>

                {/* Text Section */}
                <div
                    className="flex flex-col relative font-manrope bg-white"
                    style={{ 
                        width: isDesktop ? '285px' : '100%',
                        height: isDesktop ? (isHovered ? '158px' : '105px') : '72px',
                        paddingTop: isDesktop ? '8px' : '4px',
                        paddingRight: isDesktop ? '12px' : '8px',
                        paddingBottom: isDesktop ? '12px' : '8px',
                        paddingLeft: isDesktop ? '12px' : '8px',
                        gap: isDesktop ? '8px' : '4px',
                        opacity: 1,
                        transition: 'height 0.3s ease'
                    }}
                >
                    <h3 
                        className="font-manrope line-clamp-1 group-hover:text-[#FF3B30] transition-colors duration-300 shrink-0"
                        style={{ 
                            width: isDesktop ? "261px" : "100%",
                            height: isDesktop ? "25px" : "auto",
                            fontSize: isDesktop ? "18px" : "15px", 
                            fontWeight: 600, 
                            lineHeight: isDesktop ? "25px" : "normal", 
                            letterSpacing: isDesktop ? "-0.4px" : "normal",
                            color: "hsla(0, 0%, 16%, 1)"
                        }}
                    >
                        {product.name}
                    </h3>
                    
                    <div 
                        className="flex items-center justify-between shrink-0"
                        style={{
                            width: isDesktop ? "261px" : "154px",
                            height: "16px"
                        }}
                    >
                        <div className="flex items-center gap-1">
                            {!isDesktop ? (
                                <FaStar size={10} className="text-[#FF9F0A]" />
                            ) : (
                                <div className="flex text-[#FF9F0A]">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <FaStar key={s} size={11} className={s <= Math.round(product.rating || 4) ? "" : "opacity-20"} />
                                    ))}
                                </div>
                            )}
                            <span className="text-[12px] font-medium text-[#1D1D1F] ml-0.5">
                                {product.rating || "4.5"} <span className="text-[#8E8E93]">({product.reviews || 12})</span>
                            </span>
                        </div>
                        <div className="flex items-center gap-1 text-[#8E8E93]">
                            <FaTruck size={13} />
                            <span className="text-[12px] font-medium">2-4 days</span>
                            <FaInfoCircle size={10} className="ml-0.5 opacity-40 hidden md:block" />
                        </div>
                    </div>

                    <div 
                        className="flex items-center shrink-0"
                        style={{
                            width: isDesktop ? "209px" : "100%",
                            height: isDesktop ? "28px" : "auto",
                            gap: isDesktop ? "3px" : "6px",
                            opacity: 1,
                            marginTop: "-4px"
                        }}
                    >
                        <span className="text-[10px] md:text-[11px] font-semibold text-[#1D1D1F]">from</span>
                        {product.originalPrice && (
                            <span className="text-[12px] md:text-[17px] font-bold text-[#8E8E93] line-through">₹{product.originalPrice}</span>
                        )}
                        <span className="text-[16px] md:text-[22px] font-bold text-[#FF3B30]">₹{product.rentPrice}</span>
                        <span className="text-[10px] md:text-[11px] font-semibold text-[#1D1D1F]">/month</span>
                    </div>

                    {/* Rent Now Button Entrance */}
                    <div 
                        className="relative w-full z-30 overflow-hidden flex items-center transition-all duration-300 ease-out"
                        style={{
                            height: isHovered ? (isDesktop ? '50px' : '44px') : '0px',
                            opacity: isHovered ? 1 : 0,
                            paddingTop: isHovered ? '8px' : '0px'
                        }}
                    >
                        <button 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart(e, product); }}
                            className="w-full h-full rounded-full bg-[#FFCF46] text-[#1D1D1F] font-bold text-[14px] shadow-sm transform transition-all duration-300 ease-out active:scale-95 hover:brightness-105"
                            style={{ transform: isHovered ? 'translateY(0)' : 'translateY(15px)' }}
                        >
                            Rent Now
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Scrollbar } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';

const BestRentedProducts = ({ type = "bestRented", defaultTitle = "Curated Products" }) => {
    const [isDesktop, setIsDesktop] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        const checkRes = () => setIsDesktop(window.innerWidth >= 1024);
        checkRes();
        window.addEventListener('resize', checkRes);
        return () => window.removeEventListener('resize', checkRes);
    }, []);
    const [products, setProducts] = useState([]);
    const [addedStatus, setAddedStatus] = useState({});
    const [cmsConfig, setCmsConfig] = useState({
        enabled: true,
        title: defaultTitle,
        productIds: []
    });
    const [loading, setLoading] = useState(true);
    
    const handleAddToCart = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(addToCart({
            id: product.id,
            name: product.name,
            image: product.image,
            price: product.rentPrice,
            monthlyRent: product.rentPrice,
            quantity: 1,
            duration: 1,
            refundableAmount: 0,
            description: product.name
        }));
        setAddedStatus(prev => ({ ...prev, [product.id]: true }));
        setTimeout(() => setAddedStatus(prev => ({ ...prev, [product.id]: false })), 2000);
    };

    useEffect(() => {
        const fetchCMSAndProducts = async () => {
            try {
                const cmsRes = await fetch(`${API}/api/cms/homepage`);
                let isEnabled = true;
                let finalTitle = defaultTitle;
                let targetIds = [];

                if (cmsRes.ok) {
                    const cmsData = await cmsRes.json();
                    if (type === "bestRented") {
                        isEnabled = cmsData.bestRentedEnabled !== false;
                        finalTitle = cmsData.bestRentedTitle || "Best Rented Products";
                        targetIds = cmsData.bestRentedProductIds || [];
                    } else if (type === "newLaunches") {
                        isEnabled = cmsData.newLaunchEnabled !== false;
                        finalTitle = cmsData.newLaunchTitle || "New Launches This Week";
                        targetIds = cmsData.newLaunchProductIds || [];
                    }
                }

                setCmsConfig({ enabled: isEnabled, title: finalTitle, productIds: targetIds });

                if (!isEnabled) {
                    setLoading(false);
                    return;
                }

                let fetchedProducts = [];
                if (targetIds.length > 0) {
                    const prodPromises = targetIds.map(id => fetch(`${API}/api/products/${id}`).then(r => r.ok ? r.json() : null));
                    const responses = await Promise.all(prodPromises);
                    fetchedProducts = responses.filter(p => p !== null);
                } else {
                    const fallBackRes = await fetch(`${API}/api/products?limit=4`);
                    if (fallBackRes.ok) {
                        const fallbackData = await fallBackRes.json();
                        fetchedProducts = fallbackData.products || [];
                    }
                }

                const mappedProducts = fetchedProducts.map(p => ({
                    id: p._id,
                    name: p.name,
                    category: p.category,
                    image: (p.images && p.images.length > 0) ? p.images[0] : "/images/placeholder.png",
                    rating: p.rating || 4.5,
                    reviews: p.numReviews || 12,
                    originalPrice: Math.round((p.rentalPrice || 0) * 1.5),
                    rentPrice: p.rentalPrice,
                    discount: p.condition === 'New' ? "NEW" : "HOT",
                    isNew: p.condition === 'New',
                    tags: ["Quality tested", "Deep Cleaned"],
                    statusTags: ["Like New", "In Stock"],
                }));
                setProducts(mappedProducts);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch products or cms", error);
                setLoading(false);
            }
        };
        fetchCMSAndProducts();
    }, [type, defaultTitle]);

    if (loading) return <div className="h-48 w-full bg-slate-50 animate-pulse my-4" />;
    if (!cmsConfig.enabled) return null;

    // Use a unique selector suffix based on section type
    const sectionSuffix = type === 'bestRented' ? 'best' : 'launch';

    return (
        <section 
            className="overflow-hidden py-12 md:py-16"
            style={{ 
                minHeight: '449px',
                background: type === 'newLaunches' 
                    ? 'linear-gradient(180deg, #FFFFFF 0%, #EDF9FF 100%)' 
                    : '#FFFFFF'
            }}
        >
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
                <div className="flex flex-col mb-6 md:mb-10 max-w-[350px] md:max-w-none w-full mx-auto md:mx-0">
                    <div className="flex items-center justify-between">
                        <h2 className="font-manrope tracking-tight whitespace-nowrap text-[24px] md:text-[36px] font-semibold text-[#333] leading-tight md:leading-[48px]">
                            {cmsConfig.title}
                        </h2>
                        <Link
                            href="/products"
                            className="hidden md:inline-flex items-center justify-center gap-[2px] text-gray-900 group hover:brightness-105 transition-all text-[14px] font-semibold bg-[#FBC02D] px-5 py-2 rounded-full"
                        >
                            View All
                        </Link>
                    </div>
                </div>

                <div className="hidden md:block relative">
                    <Swiper
                        modules={[Navigation, Autoplay, Scrollbar]}
                        spaceBetween={24}
                        slidesPerView={'auto'}
                        navigation={{
                            nextEl: `.swiper-next-${sectionSuffix}`,
                            prevEl: `.swiper-prev-${sectionSuffix}`,
                        }}
                        scrollbar={{
                            el: `.swiper-scrollbar-${sectionSuffix}`,
                            draggable: true,
                            hide: false,
                        }}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                        }}
                        className="!pb-0"
                    >
                        {products.map((product, index) => (
                            <SwiperSlide key={product.id || index} style={{ width: '285px' }}>
                                <ProductCard 
                                    product={product}
                                    index={index}
                                    isDesktop={isDesktop}
                                    handleAddToCart={handleAddToCart}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Progress Bar & Navigation Arrows */}
                    <div className="flex items-center gap-6 mt-10">
                        <div
                            className={`swiper-scrollbar-${sectionSuffix} flex-1`}
                            style={{ height: '3.5px', position: 'relative' }}
                        />
                        <div className="flex items-center gap-3 shrink-0">
                            <button
                                className={`swiper-prev-${sectionSuffix} w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:shadow-md hover:border-gray-300 transition-all group`}
                                aria-label="Previous"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-400 group-hover:text-gray-800 transition-colors">
                                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                            <button
                                className={`swiper-next-${sectionSuffix} w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:shadow-md hover:border-gray-300 transition-all group`}
                                aria-label="Next"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-400 group-hover:text-gray-800 transition-colors">
                                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile View: static grid */}
                <div className="md:hidden grid grid-cols-2 gap-[10px]">
                    {products.map((product, index) => (
                        <ProductCard 
                            key={product.id || index}
                            product={product}
                            index={index}
                            isDesktop={isDesktop}
                            handleAddToCart={handleAddToCart}
                        />
                    ))}
                </div>

                <div className="mt-8 flex justify-center md:hidden">
                    <Link
                        href="/products"
                        className="bg-[#FBC02D] px-5 py-2 rounded-full text-[12px] font-bold text-[#1D1D1F] whitespace-nowrap shadow-sm"
                    >
                        View All Products
                    </Link>
                </div>
            </div>

            <style>{`
                .swiper-scrollbar-${sectionSuffix} {
                    background: hsla(0, 0%, 20%, 0.12) !important;
                    border-radius: 0 !important;
                    height: 3.5px !important;
                    overflow: hidden;
                    position: relative;
                }
                .swiper-scrollbar-${sectionSuffix} .swiper-scrollbar-drag {
                    background: hsla(0, 0%, 20%, 1) !important;
                    border-radius: 0 !important;
                    height: 100% !important;
                }
                .swiper-prev-${sectionSuffix}.swiper-button-disabled,
                .swiper-next-${sectionSuffix}.swiper-button-disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                    pointer-events: none;
                }
            `}</style>
        </section>
    );
};

export default BestRentedProducts;
