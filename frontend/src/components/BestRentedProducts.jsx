"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Star, Lightning, Truck, Info } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon, HeartIcon } from "@heroicons/react/24/outline";

import { API } from "@/services/apiConfig";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/features/cartSlice";

const ProductCard = ({ product, index, isDesktop, handleAddToCart }) => {
    const [isHovered, setIsHovered] = useState(false);
    const router = useRouter();

    const CARD_W = isDesktop ? 285 : 170;
    const CARD_H = isDesktop ? 387 : 256;
    const HOVER_H = isDesktop ? 440 : 256;
    const LIFT = isDesktop ? 12 : 0;

    return (
        /*
         * Outer shell: FIXED size in Swiper — grid never changes.
         * overflow:visible lets card grow beyond it without layout impact.
         * Card lifts UP (y:-12) AND grows DOWN to reveal Rent Now.
         */
        <div
            style={{
                width: `${CARD_W}px`,
                height: `${CARD_H}px`,
                position: 'relative',
                flexShrink: 0,
                cursor: 'pointer',
                overflow: 'visible',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onClick={() => router.push(`/products/${product.id}`)}
        >
            <motion.div
                animate={isHovered ? "hover" : "initial"}
                initial="initial"
                className="absolute left-0 right-0 bg-white flex flex-col overflow-hidden"
                style={{
                    top: 0,
                    border: "1px solid hsla(0, 0%, 89%, 1)",
                    borderRadius: "20px",
                    backgroundColor: "hsla(0, 0%, 100%, 1)",
                    willChange: "height, transform, box-shadow",
                }}
                variants={{
                    initial: {
                        height: CARD_H,
                        y: 0,
                        boxShadow: "0px 1px 2px 0px hsla(0, 0%, 0%, 0.05)"
                    },
                    hover: {
                        height: HOVER_H,
                        y: -LIFT,
                        boxShadow: "0px 16px 32px -8px hsla(0, 0%, 0%, 0.14)",
                        transition: { duration: 0.3, ease: [0.33, 1, 0.68, 1] }
                    }
                }}
            >
                {/* Image Section */}
                <div
                    className="relative bg-white flex items-center justify-center overflow-hidden shrink-0"
                    style={{
                        width: `${CARD_W}px`,
                        height: isDesktop ? 282 : 184,
                        borderRadius: "20px",
                        borderBottom: "1px solid hsla(0, 0%, 93%, 1)",
                        backgroundColor: isHovered ? "hsla(0,0%,98%,1)" : "hsla(0, 0%, 100%, 1)",
                        transition: "background-color 0.4s",
                        boxShadow: "0px 4px 8px 0px hsla(0, 0%, 87%, 0.1)",
                    }}
                >
                    <div className="absolute z-20 flex items-center" style={{ top: isDesktop ? "14.57px" : "12.57px", left: isDesktop ? "14.49px" : "13.49px", gap: "4px" }}>
                        <span className="text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0"
                            style={{ height: "24px", background: "hsla(3, 86%, 51%, 1)", fontFamily: "'Mona Sans', sans-serif", fontSize: "10px", fontWeight: 600, paddingLeft: "10px", paddingRight: "10px", borderRadius: "27px" }}>
                            -20% off
                        </span>
                        {(isDesktop || product.isNew) && (
                            <span className="text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0"
                                style={{ height: "24px", paddingLeft: "10px", paddingRight: "10px", backgroundColor: "hsla(122, 100%, 35%, 1)", fontFamily: "'Mona Sans', sans-serif", fontSize: "10px", fontWeight: 600, borderRadius: "27px" }}>
                                New
                            </span>
                        )}
                    </div>

                    <button
                        className="absolute z-20 flex items-center justify-center rounded-full hover:scale-110 transition-all duration-300"
                        style={{ width: "36px", height: "36px", top: "10.57px", right: "12.51px", backgroundColor: "hsla(0, 0%, 96%, 1)", border: "0.2px solid hsla(0, 0%, 80%, 1)", borderRadius: "100%", padding: "4px" }}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    >
                        <HeartIcon className="w-[32px] h-[32px] text-black" strokeWidth={1} />
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
                        padding: isDesktop ? '8px 12px 12px' : '4px 8px 8px',
                        gap: isDesktop ? '8px' : '4px',
                    }}
                >
                    <h3 className="font-manrope line-clamp-1 shrink-0"
                        style={{ fontSize: isDesktop ? "18px" : "15px", fontWeight: 600, lineHeight: isDesktop ? "25px" : "22px", letterSpacing: isDesktop ? "-0.4px" : "normal", color: isHovered ? 'hsla(3, 100%, 56%, 1)' : "hsla(0, 0%, 16%, 1)", transition: 'color 0.3s' }}>
                        {product.name}
                    </h3>

                    <div className="flex items-center justify-between shrink-0" style={{ height: "16px" }}>
                        <div className="flex items-center gap-1">
                            <div className="flex text-[#FF9500]">
                                {isDesktop ? ([1, 2, 3, 4, 5].map(s => <Star key={s} size={14} weight="fill" className={s <= Math.round(product.rating || 4) ? "" : "opacity-20"} />)) : (<Star size={12} weight="fill" />)}
                            </div>
                            <span className="ml-1" style={{ fontFamily: "'Mona Sans', sans-serif", fontSize: "11px", fontWeight: 500, color: "hsla(0, 0%, 33%, 1)", letterSpacing: "-0.01em" }}>
                                {product.rating || "4.5"} ({product.reviews || 12})
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5" style={{ color: "hsla(0, 0%, 65%, 1)" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[16px] h-[16px]">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                            </svg>
                            <span style={{ fontSize: "12px", fontWeight: 400, letterSpacing: "-0.04em" }}>2-4 days</span>
                        </div>
                    </div>

                    <div className="flex items-center shrink-0" style={{ gap: "3px", marginTop: "-4px" }}>
                        <span style={{ fontFamily: "'Mona Sans', sans-serif", fontSize: isDesktop ? "11px" : "10px", fontWeight: 500, color: "hsla(0, 0%, 33%, 1)", letterSpacing: "-0.01em" }}>from</span>
                        {product.originalPrice && (
                            <span className="line-through decoration-[1.5px]" style={{ fontFamily: "'Mona Sans', sans-serif", fontSize: isDesktop ? "16px" : "12px", fontWeight: 600, color: "hsla(0, 0%, 46%, 1)", letterSpacing: "-0.04em" }}>₹{product.originalPrice}</span>
                        )}
                        <span className="font-bold tracking-tight ml-1" style={{ fontFamily: "'Mona Sans', sans-serif", fontSize: isDesktop ? "26px" : "16px", fontWeight: 600, color: "hsla(3, 100%, 56%, 1)", letterSpacing: isDesktop ? "-0.04em" : "-0.06em" }}>₹{product.rentPrice}</span>
                        <span style={{ fontFamily: "'Mona Sans', sans-serif", fontSize: isDesktop ? "11px" : "10px", fontWeight: 500, color: "hsla(0, 0%, 46%, 1)", letterSpacing: "-0.01em", marginLeft: "2px" }}>/month</span>
                    </div>

                    {/* Rent Now — slides in as card grows downward */}
                    {isDesktop && (
                        <div style={{ overflow: 'hidden', height: isHovered ? '43px' : '0px', opacity: isHovered ? 1 : 0, transition: 'height 0.28s ease, opacity 0.2s ease', display: 'flex', alignItems: 'flex-end' }}>
                            <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart(e, product); }}
                                className="btn-primary w-full text-[14px] active:scale-95"
                                style={{ height: '38px', borderRadius: '100px', flexShrink: 0 }}
                            >
                                Rent Now
                            </button>
                        </div>
                    )}
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
            className="w-full overflow-hidden bg-white"
            style={{
                paddingTop: '96px',
                paddingBottom: '96px',
                background: '#FFFFFF'
            }}
        >
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
                <div className="flex flex-col mb-[40px] max-w-[350px] md:max-w-none w-full mx-auto md:mx-0">
                    <div className="flex items-center justify-between">
                        <h2 className="font-manrope tracking-tight whitespace-nowrap text-[24px] md:text-[36px] font-semibold text-[#333] leading-tight md:leading-[48px]">
                            {cmsConfig.title}
                        </h2>
                        <Link
                            href="/products"
                            className="btn-primary hidden md:inline-flex gap-[2px] text-[14px]"
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
                        className="!pt-6 !pb-[65px] -mt-6 -mb-[65px] !overflow-visible"
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
                                <ChevronLeftIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-800 transition-colors" />
                            </button>
                            <button
                                className={`swiper-next-${sectionSuffix} w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:shadow-md hover:border-gray-300 transition-all group`}
                                aria-label="Next"
                            >
                                <ChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-800 transition-colors" />
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
                        className="btn-primary text-[12px]"
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