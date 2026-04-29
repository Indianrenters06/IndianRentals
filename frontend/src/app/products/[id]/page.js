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
import Testimonials from '../../../components/Testimonials';
import CompareTenures from '../../../components/CompareTenures';
import CancellationSidebar from '../../../components/CancellationSidebar';

import { Heart, Export as ExportIcon, Sparkle, Package, Truck, CalendarDots, UserCircle, Bank, MapPin } from '@phosphor-icons/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

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
    const [isRentHovered, setIsRentHovered] = useState(false);
    const [isCompareOpen, setIsCompareOpen] = useState(false);
    const [isCancellationOpen, setIsCancellationOpen] = useState(false);

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
        <div className="w-full flex flex-col items-center bg-white font-sans text-[#1D1D1F] tracking-tight antialiased">
            <div
                style={{
                    maxWidth: '1440px',
                    width: '100%',
                    minHeight: '1415.73px',
                    paddingTop: '40px',
                    paddingBottom: '40px',
                    margin: '0 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                    background: 'hsla(0, 0%, 97%, 1)',
                    opacity: 1,
                    boxSizing: 'border-box'
                }}
            >
                {/* Breadcrumb */}
                <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-[14px] font-medium text-[#586A84]">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="hover:text-black transition-colors">Shop all</Link>
                        <span className="text-gray-300 text-[16px] leading-none mb-0.5">›</span>
                        <Link href={`/category/${product.category?.toLowerCase() || 'all'}`} className="hover:text-black transition-colors">{product.category || 'Category'}</Link>
                        <span className="text-gray-300 text-[16px] leading-none mb-0.5">›</span>
                        <span className="text-[#1D1D1F] font-bold truncate max-w-[300px]">{product.name}</span>
                    </div>
                </div>

                <main className="w-full max-w-[1200px] mx-auto px-4 md:px-8">
                    <div
                        className="grid grid-cols-1 lg:grid-cols-2 items-start"
                        style={{
                            width: '100%',
                            minHeight: '809.73px',
                            gap: '16px',
                            opacity: 1
                        }}
                    >

                        {/* Left Column - Images Gallery */}
                        <div
                            className="flex flex-col"
                            style={{
                                width: '100%',
                                maxWidth: '611px',
                                minHeight: '801.64px',
                                gap: '10px',
                                opacity: 1
                            }}
                        >

                            {/* Main Image Slider */}
                            <div
                                className="relative w-full bg-white rounded-xl flex items-center justify-center p-6 group overflow-hidden shrink-0"
                                style={{
                                    maxWidth: '611px',
                                    height: '611px',
                                    border: '1px solid hsla(0, 0%, 93%, 1)',
                                    opacity: 1
                                }}
                            >
                                <span className="absolute top-6 left-6 z-10 bg-[#FF3B30] text-white text-[12px] font-bold px-3 py-1 rounded-[6px] tracking-wide">20% off</span>

                                <div
                                    className="absolute z-10 flex flex-col"
                                    style={{
                                        width: '34px',
                                        height: '76px',
                                        gap: '8px',
                                        top: '24px',
                                        right: '12px',
                                        opacity: 1
                                    }}
                                >
                                    <button className="flex items-center justify-center rounded-full transition-colors border border-transparent hover:border-gray-200"
                                        style={{ width: '34px', height: '34px', background: 'hsla(0, 0%, 93%, 1)', color: 'hsla(0, 0%, 16%, 1)' }}>
                                        <Heart size={20} weight="regular" />
                                    </button>
                                    <button className="flex items-center justify-center rounded-full transition-colors border border-transparent hover:border-gray-200"
                                        style={{ width: '34px', height: '34px', background: 'hsla(0, 0%, 93%, 1)', color: 'hsla(0, 0%, 16%, 1)' }}>
                                        <ExportIcon size={20} />
                                    </button>
                                </div>

                                <Swiper
                                    navigation={{
                                        nextEl: '.swiper-button-next-custom',
                                        prevEl: '.swiper-button-prev-custom',
                                    }}
                                    style={{
                                        width: "100%",
                                        height: "100%"
                                    }}
                                    loop={true}
                                    spaceBetween={10}
                                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                                    modules={[FreeMode, Navigation, Thumbs]}
                                    className="main-image-swiper"
                                >
                                    {(product.images && product.images.length > 0 ? product.images : [mainImage, mainImage, mainImage, mainImage]).map((img, index) => (
                                        <SwiperSlide key={index} className="flex items-center justify-center">
                                            <div
                                                className="relative flex items-center justify-center object-contain mix-blend-darken brightness-[1.08] contrast-[1.04] group-hover:scale-105 transition-transform duration-700 ease-out"
                                                style={{
                                                    width: '100%',
                                                    maxWidth: '516px',
                                                    height: '397px',
                                                    opacity: 1
                                                }}
                                            >
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

                                {/* Custom Heroicon Caret Navigation */}
                                <div
                                    className="swiper-button-prev-custom absolute z-10 cursor-pointer hidden md:flex items-center justify-center hover:opacity-80 transition-opacity"
                                    style={{
                                        width: '34px',
                                        height: '34px',
                                        borderRadius: '69px',
                                        top: '305px',
                                        left: '12px',
                                        background: 'hsla(0, 0%, 93%, 1)',
                                        boxShadow: '0px 0px 1px 0px hsla(0, 0%, 52%, 0.1), 0px 1px 1px 0px hsla(0, 0%, 52%, 0.09), 0px 3px 2px 0px hsla(0, 0%, 52%, 0.05), 0px 5px 2px 0px hsla(0, 0%, 52%, 0.01), 0px 8px 2px 0px hsla(0, 0%, 52%, 0)'
                                    }}
                                >
                                    <ChevronLeftIcon className="w-[18px] h-[18px] text-gray-800" strokeWidth={2.5} />
                                </div>
                                <div
                                    className="swiper-button-next-custom absolute z-10 cursor-pointer flex items-center justify-center hover:opacity-80 transition-opacity"
                                    style={{
                                        width: '34px',
                                        height: '34px',
                                        borderRadius: '69px',
                                        top: '305px',
                                        right: '12px',
                                        background: 'hsla(0, 0%, 93%, 1)',
                                        boxShadow: '0px 0px 1px 0px hsla(0, 0%, 52%, 0.1), 0px 1px 1px 0px hsla(0, 0%, 52%, 0.09), 0px 3px 2px 0px hsla(0, 0%, 52%, 0.05), 0px 5px 2px 0px hsla(0, 0%, 52%, 0.01), 0px 8px 2px 0px hsla(0, 0%, 52%, 0)'
                                    }}
                                >
                                    <ChevronRightIcon className="w-[18px] h-[18px] text-gray-800" strokeWidth={2.5} />
                                </div>
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
                        </div>

                        {/* Right Column - Product Purchase Details */}
                        <div
                            className="flex flex-col w-full lg:justify-self-end"
                            style={{
                                maxWidth: '536.36px',
                                minHeight: '809.73px',
                                gap: '32px',
                                opacity: 1,
                                gridColumnStart: 'auto',
                                gridRowStart: 'auto'
                            }}
                        >

                            {/* Main White Card (Title, Rating, Slider, Price) */}
                            <div
                                className="bg-white rounded-xl flex flex-col overflow-hidden w-full"
                                style={{
                                    height: 'auto',
                                    minHeight: '333.73px',
                                    border: '1px solid var(--color-grey-grey-100, hsla(0, 0%, 93%, 1))',
                                    background: 'var(--color-grey-white, hsla(0, 0%, 100%, 1))',
                                    opacity: 1
                                }}
                            >
                                {/* Header Section (Title & Ratings) */}
                                <div
                                    className="flex flex-col"
                                    style={{
                                        width: '100%',
                                        height: '122px',
                                        borderBottom: '1px solid hsla(0, 0%, 93%, 1)',
                                        paddingTop: '20px',
                                        paddingRight: '20px',
                                        paddingBottom: '12px',
                                        paddingLeft: '20px',
                                        gap: '10px',
                                        opacity: 1
                                    }}
                                >
                                    {/* Title */}
                                    <h1 className="text-[22px] font-bold text-[#1D1D1F] leading-[1.3] tracking-tight pr-4">
                                        {product.name}
                                    </h1>

                                    {/* Rating & Stock */}
                                    <div
                                        className="flex items-center"
                                        style={{
                                            maxWidth: '227px',
                                            height: '24px',
                                            gap: '10px',
                                            opacity: 1
                                        }}
                                    >
                                        <div
                                            className="flex items-center"
                                            style={{
                                                width: '140px',
                                                height: '24px',
                                                borderRadius: '8px',
                                                padding: '4px 6px 4px 6px',
                                                gap: '4px',
                                                opacity: 1,
                                                background: 'hsla(44, 100%, 91%, 1)',
                                                border: '1px solid hsla(47, 100%, 76%, 1)'
                                            }}
                                        >
                                            <div className="flex gap-[2px]">
                                                {[1, 2, 3, 4, 5].map(s => (
                                                    <StarIcon
                                                        key={s}
                                                        style={{
                                                            width: '13.21px',
                                                            height: '12.65px',
                                                            color: 'var(--color-orange-orange-500, hsla(33, 100%, 52%, 1))',
                                                            opacity: s <= Math.round(product.rating || 4.5) ? 1 : 0.3
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-[11px] font-medium text-[#1D1D1F]">{product.rating || "4.5"} ({product.numReviews || 12})</span>
                                        </div>
                                        <div className="bg-[#00B200] text-white text-[11px] font-medium px-2 py-0.5 rounded-[6px] flex items-center justify-center gap-1.5 h-full whitespace-nowrap">
                                            <BsTruck size={13} className="stroke-[0.5]" />
                                            <span className="mt-[1px]">{product.deliveryTime || "2-4 days"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Interactive Slider Section */}
                                <div
                                    className="flex flex-col"
                                    style={{
                                        width: '100%',
                                        maxWidth: '509px',
                                        height: '132.73px',
                                        padding: '16px 12px 16px 12px',
                                        gap: '12px',
                                        background: 'hsla(0, 0%, 100%, 1)',
                                        opacity: 1
                                    }}
                                >
                                    {/* Rental Period Selection */}
                                    <div
                                        className="flex items-center"
                                        style={{
                                            width: '100%',
                                            height: '20px',
                                            justifyContent: 'space-between',
                                            opacity: 1
                                        }}
                                    >
                                        <h3
                                            style={{
                                                width: '216px',
                                                height: '20px',
                                                fontFamily: '"Mona Sans", sans-serif',
                                                fontWeight: 500,
                                                fontSize: 'var(--font-size-2, 14px)',
                                                lineHeight: 'var(--font-line-height-2, 20px)',
                                                letterSpacing: 'var(--font-letter-spacing-7, normal)',
                                                color: 'var(--color-grey-grey-800, hsla(0, 0%, 12%, 1))',
                                                opacity: 1,
                                                margin: 0,
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            Select your <span
                                                style={{
                                                    textDecoration: 'underline',
                                                    textDecorationStyle: 'solid',
                                                    textUnderlineOffset: '10%',
                                                    textDecorationThickness: '8%',
                                                    textDecorationSkipInk: 'auto'
                                                }}
                                            >
                                                minimum rental period
                                            </span>
                                        </h3>
                                        <span className="text-[14px] font-bold text-[#1D1D1F]">{duration === 1 ? '1 Month' : `${duration} Months`}</span>
                                    </div>

                                    {/* Tenure Slider */}
                                    <div
                                        className="relative flex flex-col"
                                        style={{
                                            width: '100%',
                                            height: '37.73px',
                                            gap: '11px',
                                            opacity: 1
                                        }}
                                    >
                                        {(() => {
                                            const currentStep = duration <= 1 ? 1 : duration <= 3 ? 2 : duration <= 6 ? 3 : duration <= 9 ? 4 : 5;
                                            const activePct = ((currentStep - 1) / 4) * 100;
                                            const labels = ["1+", "3+", "6+", "9+", "12+"];
                                            
                                            return (
                                                <>
                                                    {/* Track */}
                                                    <div className="relative w-full flex items-center" style={{ height: '4px' }}>
                                                        <div
                                                            className="absolute w-full rounded-none"
                                                            style={{
                                                                height: '3.73px',
                                                                background: `linear-gradient(to right, hsla(24, 91%, 48%, 1) ${activePct}%, hsla(0, 0%, 93%, 1) ${activePct}%)`
                                                            }}
                                                        />
                                                        
                                                        {/* Single Active Thumb */}
                                                        <div
                                                            className="absolute rounded-full bg-white transition-all duration-300 z-10"
                                                            style={{
                                                                width: '18px',
                                                                height: '18px',
                                                                border: '4px solid hsla(24, 91%, 48%, 1)',
                                                                left: `calc(${activePct}% - 9px)`
                                                            }}
                                                        />
                                                        
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
                                                            className="absolute w-full opacity-0 cursor-pointer z-20"
                                                            style={{ height: '24px', top: '-9px' }}
                                                        />
                                                    </div>

                                                    {/* Labels and Ticks */}
                                                    <div className="relative w-full" style={{ height: '20px' }}>
                                                        {[1, 2, 3, 4, 5].map(step => {
                                                            const pct = ((step - 1) / 4) * 100;
                                                            return (
                                                                <div
                                                                    key={step}
                                                                    className="absolute flex flex-col items-center pointer-events-none"
                                                                    style={{
                                                                        left: `calc(${pct}%)`,
                                                                        transform: 'translateX(-50%)',
                                                                        top: '0px'
                                                                    }}
                                                                >
                                                                    <div style={{ width: '1px', height: '6px', background: 'hsla(0, 0%, 75%, 1)', marginBottom: '5px' }} />
                                                                    <span
                                                                        style={{
                                                                            fontFamily: '"Mona Sans", sans-serif',
                                                                            fontSize: '13px',
                                                                            fontWeight: 400,
                                                                            color: 'hsla(0, 0%, 12%, 1)',
                                                                            lineHeight: '1'
                                                                        }}
                                                                    >
                                                                        {labels[step - 1]}
                                                                    </span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>

                                    {/* Links */}
                                    <div className="flex justify-between items-center">
                                        <Link
                                            href="#"
                                            style={{
                                                width: '89px',
                                                height: '16px',
                                                fontFamily: '"Mona Sans", sans-serif',
                                                fontWeight: 500,
                                                fontSize: 'var(--font-size-1, 12px)',
                                                lineHeight: 'var(--font-line-height-1, 16px)',
                                                letterSpacing: 'var(--font-letter-spacing-8, normal)',
                                                color: 'var(--color-orange-orange-600, hsla(29, 100%, 50%, 1))',
                                                textDecoration: 'underline',
                                                textDecorationStyle: 'solid',
                                                textUnderlineOffset: '8.5%',
                                                textDecorationThickness: '11%',
                                                opacity: 1,
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            price breakdown
                                        </Link>
                                        <button
                                            onClick={() => setIsCompareOpen(true)}
                                            style={{
                                                fontSize: 'var(--font-size-1, 12px)',
                                                lineHeight: 'var(--font-line-height-1, 16px)',
                                                letterSpacing: 'var(--font-letter-spacing-8, normal)',
                                                color: 'var(--color-orange-orange-600, hsla(29, 100%, 50%, 1))',
                                                textDecoration: 'underline',
                                                textDecorationStyle: 'solid',
                                                textUnderlineOffset: '8.5%',
                                                textDecorationThickness: '11%',
                                                opacity: 1,
                                                whiteSpace: 'nowrap',
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                padding: 0
                                            }}
                                        >
                                            compare all tenures
                                        </button>
                                    </div>
                                </div>

                                {/* Price & Quantity Footer Card */}
                                <div
                                    className="flex flex-col"
                                    style={{
                                        width: '509px',
                                        height: '79px',
                                        opacity: 1,
                                        borderTopLeftRadius: '0px',
                                        borderTopRightRadius: '0px',
                                        borderBottomRightRadius: '6px',
                                        borderBottomLeftRadius: '6px',
                                        borderTop: '1px solid hsla(0, 0%, 93%, 1)'
                                    }}
                                >
                                    {/* Price and Quantity Row */}
                                    <div
                                        className="flex justify-between items-center"
                                        style={{
                                            width: '509px',
                                            height: '55px',
                                            opacity: 1
                                        }}
                                    >
                                        <div
                                            className="flex items-center"
                                            style={{
                                                width: '302px',
                                                height: '55px',
                                                paddingRight: '20px',
                                                paddingLeft: '20px',
                                                gap: '18px',
                                                opacity: 1,
                                                borderRight: '1px solid hsla(0, 0%, 93%, 1)'
                                            }}
                                        >
                                            <div
                                                className="flex items-center gap-1"
                                                style={{
                                                    height: '23px',
                                                    opacity: 1
                                                }}
                                            >
                                                <span
                                                    className="shrink-0"
                                                    style={{
                                                        fontFamily: '"Mona Sans", sans-serif',
                                                        fontWeight: 600,
                                                        fontSize: 'var(--font-size-6, 24px)',
                                                        lineHeight: 1,
                                                        letterSpacing: 'var(--font-letter-spacing-4, -0.8px)',
                                                        color: 'var(--color-red-red-600, hsla(3, 86%, 51%, 1))',
                                                        opacity: 1
                                                    }}
                                                >
                                                    ₹{currentPlan.price * quantity}
                                                </span>
                                                <span
                                                    className="shrink-0"
                                                    style={{
                                                        fontFamily: 'Manrope, sans-serif',
                                                        fontWeight: 400,
                                                        fontSize: '16px',
                                                        lineHeight: 1,
                                                        letterSpacing: '-0.04em',
                                                        color: 'var(--color-grey-grey-500, hsla(0, 0%, 46%, 1))',
                                                        opacity: 1
                                                    }}
                                                >
                                                    /month
                                                </span>
                                            </div>

                                            <div
                                                className="flex items-center"
                                                style={{
                                                    height: '22px',
                                                    gap: '4px',
                                                    opacity: 1
                                                }}
                                            >
                                                <span className="text-[13px] font-medium text-gray-400 line-through shrink-0">
                                                    ₹{product.mrp ? product.mrp * quantity : Math.round(currentPlan.price * 1.5) * quantity}
                                                </span>
                                                <span
                                                    className="text-white text-[10px] font-bold flex items-center justify-center whitespace-nowrap shrink-0"
                                                    style={{
                                                        width: '59px',
                                                        height: '22px',
                                                        borderRadius: '27px',
                                                        padding: '4px 10px',
                                                        gap: '10px',
                                                        opacity: 1,
                                                        background: 'var(--color-red-red-600, hsla(3, 86%, 51%, 1))',
                                                        boxShadow: '0px 0px 1px 0px hsla(0, 0%, 47%, 0.1), 0px 1px 1px 0px hsla(0, 0%, 47%, 0.09), 0px 3px 2px 0px hsla(0, 0%, 47%, 0.05), 0px 5px 2px 0px hsla(0, 0%, 47%, 0.01), 0px 9px 2px 0px hsla(0, 0%, 47%, 0)'
                                                    }}
                                                >
                                                    {product.mrp 
                                                        ? `${Math.round(((product.mrp - currentPlan.price) / product.mrp) * 100)}% off`
                                                        : "20% off"
                                                    }
                                                </span>
                                            </div>
                                        </div>

                                        <div
                                            className="flex items-center justify-end"
                                            style={{
                                                width: '234.36px',
                                                height: '55px',
                                                paddingRight: '20px',
                                                paddingLeft: '20px',
                                                gap: '15px',
                                                opacity: 1
                                            }}
                                        >
                                            <span className="text-[13.5px] text-[#1D1D1F] font-medium">Quantity</span>
                                            <div className="flex items-center gap-4">
                                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-400 hover:text-black transition-colors">
                                                    <FaMinus size={10} />
                                                </button>
                                                <div className="w-[38px] h-[34px] bg-white border border-gray-100 rounded-[8px] flex items-center justify-center shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                                                    <span className="text-[14px] font-bold text-[#1D1D1F]">{quantity}</span>
                                                </div>
                                                <button onClick={() => setQuantity(quantity + 1)} className="text-gray-400 hover:text-black transition-colors">
                                                    <FaPlus size={10} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* View All Benefits Row */}
                                    <div
                                        className="flex items-center justify-center w-full grow"
                                        style={{ borderTop: '1px solid hsla(0, 0%, 93%, 1)' }}
                                    >
                                        <button
                                            className="hover:opacity-80 transition-opacity"
                                            style={{
                                                fontFamily: '"Mona Sans", sans-serif',
                                                fontWeight: 700,
                                                fontSize: '11px',
                                                lineHeight: '16px',
                                                color: 'hsla(29, 100%, 44%, 1)',
                                                textDecoration: 'underline',
                                                textDecorationStyle: 'solid',
                                                textUnderlineOffset: '6%',
                                                background: 'none',
                                                border: 'none',
                                                padding: 0,
                                                cursor: 'pointer'
                                            }}
                                        >
                                            View All Benefits
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* What's included in your plan Section */}
                            <div
                                className="flex flex-col mt-[-18px]"
                                style={{
                                    width: '536.36px',
                                    gap: '8px'
                                }}
                            >
                                <div style={{ height: '16px', display: 'flex', alignItems: 'center' }}>
                                    <h4
                                        className="px-1"
                                        style={{
                                            fontFamily: '"Mona Sans", sans-serif',
                                            fontWeight: 600,
                                            fontSize: '13px',
                                            lineHeight: '16px',
                                            letterSpacing: '-0.02em',
                                            color: 'hsla(0, 0%, 12%, 1)',
                                            opacity: 1
                                        }}
                                    >
                                        What’s included in your plan
                                    </h4>
                                </div>

                                <div
                                    className="flex gap-[4px] w-full overflow-x-auto hide-scrollbar items-center"
                                    style={{ height: '48px' }}
                                >
                                    {(product.benefits && product.benefits.length > 0 ? product.benefits : [
                                        "Fully Functional", "Accessories Included", "Free Repairs & Maintenance", "Professionally sanitized"
                                    ]).map((benefit, idx) => {
                                        const benefitText = benefit.type || benefit;
                                        const Icon = [Sparkle, Package, UserCircle, Bank][idx % 4];
                                        return (
                                            <div
                                                key={idx}
                                                className="rounded-lg flex items-center shrink-0"
                                                style={{
                                                    width: '131.09px',
                                                    height: '48px',
                                                    padding: '8px',
                                                    gap: '10px',
                                                    background: 'linear-gradient(89.92deg, #0689FF -1.19%, #0075FF 100.13%)',
                                                    border: '1px solid hsla(198, 100%, 85%, 1)'
                                                }}
                                            >
                                                <div className="shrink-0 text-white flex items-center justify-center"><Icon size={18} weight="bold" /></div>
                                                <span
                                                    style={{
                                                        width: '87.09px',
                                                        height: '32px',
                                                        fontFamily: '"Mona Sans", sans-serif',
                                                        fontWeight: 600,
                                                        fontSize: 'var(--font-size-1, 12px)',
                                                        lineHeight: 'var(--font-line-height-1, 16px)',
                                                        letterSpacing: 'var(--font-letter-spacing-8, normal)',
                                                        color: 'var(--color-grey-white, hsla(0, 0%, 100%, 1))',
                                                        whiteSpace: 'normal',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                        wordBreak: 'break-word'
                                                    }}
                                                >
                                                    {benefitText}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Deposit & KYC Information Row */}
                            <div
                                className="flex gap-[6px] items-center mt-[-24px]"
                                style={{
                                    width: '536.36px',
                                    height: '56px',
                                }}
                            >
                                {/* Refundable Deposit Card */}
                                <div
                                    className="h-full rounded-[12px] flex items-center justify-between px-[8px] py-[2px] shrink-0"
                                    style={{
                                        width: '264.18px',
                                        background: 'hsla(200, 100%, 92%, 1)',
                                        border: '1px solid hsla(198, 100%, 85%, 1)'
                                    }}
                                >
                                    <div className="flex items-center justify-between w-full" style={{ height: '23px' }}>
                                        <span
                                            style={{
                                                width: '139px',
                                                height: '16px',
                                                fontFamily: '"Mona Sans", sans-serif',
                                                fontWeight: 600,
                                                fontSize: '11px',
                                                lineHeight: '16px',
                                                letterSpacing: '-0.02em',
                                                color: 'hsla(214, 92%, 40%, 1)'
                                            }}
                                        >
                                            100% Refundable Deposit
                                        </span>
                                        <span
                                            style={{
                                                width: '61px',
                                                height: '23px',
                                                fontFamily: '"Mona Sans", sans-serif',
                                                fontWeight: 600,
                                                fontSize: '16px',
                                                lineHeight: '23px',
                                                letterSpacing: '-0.015em',
                                                color: 'hsla(214, 92%, 40%, 1)'
                                            }}
                                        >
                                            ₹{product.securityDeposit || '20,000'}
                                        </span>
                                    </div>
                                </div>

                                {/* KYC & Delivery Card */}
                                <div
                                    className="h-full flex items-center justify-between shrink-0"
                                    style={{
                                        width: '264.18px',
                                        height: '56px',
                                        background: 'var(--color-purple-purple-100, hsla(269, 100%, 95%, 1))',
                                        border: '1px solid hsla(272, 72%, 47%, 0.3)',
                                        borderRadius: '12px',
                                        paddingLeft: '12px',
                                        paddingTop: '4px',
                                        paddingBottom: '4px',
                                        paddingRight: '0px',
                                        opacity: 1,
                                        overflow: 'hidden'
                                    }}
                                >
                                    <div
                                        className="flex flex-col justify-center"
                                        style={{
                                            width: '207px',
                                            height: '32px',
                                            gap: '0px'
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontFamily: '"Mona Sans", sans-serif',
                                                fontWeight: 600,
                                                fontSize: '11px',
                                                lineHeight: '16px',
                                                letterSpacing: '-0.02em',
                                                color: 'hsla(272, 72%, 47%, 1)',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            Place Order & complete KYC anytime
                                        </div>
                                        <div
                                            style={{
                                                fontFamily: '"Mona Sans", sans-serif',
                                                fontWeight: 500,
                                                fontSize: '11px',
                                                lineHeight: '16px',
                                                letterSpacing: '-0.02em',
                                                color: 'hsla(272, 72%, 47%, 1)',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            to get your items the next day
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            width: '51px',
                                            height: '56px',
                                            background: 'hsla(0, 0%, 89%, 1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                            position: 'relative'
                                        }}
                                    >
                                        <span
                                            style={{
                                                position: 'absolute',
                                                top: '22px',
                                                left: '19px',
                                                fontFamily: '"Mona Sans", sans-serif',
                                                fontWeight: 600,
                                                fontSize: '11px',
                                                lineHeight: '16px',
                                                letterSpacing: '-0.02em',
                                                color: '#000000',
                                                width: '14px',
                                                height: '16px'
                                            }}
                                        >
                                            gif
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Primary CTA */}
                            <button
                                onClick={handleAddToCart}
                                onMouseEnter={() => setIsRentHovered(true)}
                                onMouseLeave={() => setIsRentHovered(false)}
                                style={{
                                    width: '536.36px',
                                    height: '45px',
                                    paddingLeft: '20px',
                                    paddingRight: '20px',
                                    paddingTop: '6px',
                                    paddingBottom: '6px',
                                    background: isRentHovered ? 'hsla(44, 100%, 60%, 1)' : 'hsla(44, 100%, 64%, 1)',
                                    borderRadius: '9999px',
                                    boxShadow: isRentHovered ? 'none' : '0px 3px 7px 0px hsla(0, 0%, 55%, 0.05), 0px 13px 13px 0px hsla(0, 0%, 55%, 0.04), 0px 28px 17px 0px hsla(0, 0%, 55%, 0.02), 0px 50px 20px 0px hsla(0, 0%, 55%, 0.01), 0px 78px 22px 0px hsla(0, 0%, 55%, 0)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '2px',
                                    marginTop: '-24px',
                                    border: 'none',
                                    borderBottom: isRentHovered ? 'none' : '1px solid hsla(44, 100%, 54%, 1)',
                                    cursor: 'pointer',
                                    transform: isRentHovered ? 'translateY(1px)' : 'none',
                                    transition: 'all 0.1s ease-out'
                                }}
                                className="active:scale-[0.98]"
                            >
                                <span style={{
                                    fontFamily: '"Mona Sans", sans-serif',
                                    fontWeight: 700,
                                    fontSize: '15px',
                                    color: '#1D1D1F'
                                }}>
                                    Rent Now
                                </span>
                            </button>

                            {/* High-Fidelity Info Row (Replaced Secondary Cards) */}
                            <div
                                className="flex gap-[10px] items-center"
                                style={{
                                    width: '536.36px',
                                    height: '56px',
                                    opacity: 1,
                                    marginTop: '-24px'
                                }}
                            >
                                {/* Cancel/Return Card */}
                                <div
                                    className="h-full flex items-center shrink-0"
                                    style={{
                                        width: '263.18px',
                                        height: '56px',
                                        paddingTop: '12px',
                                        paddingRight: '8px',
                                        paddingBottom: '12px',
                                        paddingLeft: '8px',
                                        borderRadius: '16px',
                                        background: 'var(--color-orange-orange-50, hsla(44, 100%, 96%, 1))',
                                        border: '1px solid hsla(47, 100%, 76%, 1)',
                                        opacity: 1
                                    }}
                                >
                                    <div
                                        className="flex items-center"
                                        style={{
                                            width: '247.18px',
                                            height: '32px',
                                            gap: '8px'
                                        }}
                                    >
                                        <div
                                            className="rounded-full flex items-center justify-center shrink-0"
                                            style={{
                                                width: '28px',
                                                height: '28px',
                                                background: 'hsla(44, 100%, 91%, 1)',
                                                position: 'relative',
                                                borderRadius: '33px'
                                            }}
                                        >
                                            <Truck
                                                style={{
                                                    position: 'absolute',
                                                    top: '4.27px',
                                                    left: '4.5px',
                                                    width: '20px',
                                                    height: '20px',
                                                    color: 'hsla(29, 100%, 44%, 1)'
                                                }}
                                            />
                                        </div>
                                        <div
                                            className="flex items-center justify-between shrink-0 h-full"
                                            style={{
                                                width: '211.18px',
                                                gap: '4px'
                                            }}
                                        >
                                            <div
                                                className="flex flex-col justify-center h-full"
                                                style={{ width: '140.18px' }}
                                            >
                                                <span
                                                    style={{
                                                        fontFamily: '"Mona Sans", sans-serif',
                                                        fontWeight: 600,
                                                        fontSize: '11px',
                                                        lineHeight: '13px',
                                                        color: 'hsla(29, 100%, 44%, 1)',
                                                        display: 'block'
                                                    }}
                                                >
                                                    What if I cancel or return
                                                </span>
                                                <span
                                                    style={{
                                                        fontFamily: '"Mona Sans", sans-serif',
                                                        fontWeight: 600,
                                                        fontSize: '11px',
                                                        lineHeight: '13px',
                                                        color: 'hsla(29, 100%, 44%, 1)',
                                                        display: 'block'
                                                    }}
                                                >
                                                    before 6 months?
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => setIsCancellationOpen(true)}
                                                style={{
                                                    fontSize: '11px',
                                                    fontWeight: 600,
                                                    color: 'hsla(3, 86%, 51%, 1)',
                                                    textDecoration: 'underline',
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    padding: 0
                                                }}
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Tenure Expansion Card */}
                                <div
                                    className="h-full flex items-center shrink-0"
                                    style={{
                                        width: '263.18px',
                                        height: '56px',
                                        paddingTop: '12px',
                                        paddingRight: '8px',
                                        paddingBottom: '12px',
                                        paddingLeft: '8px',
                                        borderRadius: '16px',
                                        background: 'var(--color-orange-orange-50, hsla(44, 100%, 96%, 1))',
                                        border: '1px solid hsla(47, 100%, 76%, 1)',
                                        opacity: 1
                                    }}
                                >
                                    <div
                                        className="flex items-center"
                                        style={{
                                            width: '247.18px',
                                            height: '32px',
                                            gap: '8px'
                                        }}
                                    >
                                        <div
                                            className="rounded-full flex items-center justify-center shrink-0"
                                            style={{
                                                width: '28px',
                                                height: '28px',
                                                background: 'hsla(44, 100%, 91%, 1)',
                                                position: 'relative',
                                                borderRadius: '33px'
                                            }}
                                        >
                                            <CalendarDots
                                                style={{
                                                    position: 'absolute',
                                                    top: '4.27px',
                                                    left: '4.5px',
                                                    width: '20px',
                                                    height: '20px',
                                                    color: 'hsla(29, 100%, 44%, 1)'
                                                }}
                                            />
                                        </div>
                                        <div
                                            className="flex items-center justify-between shrink-0 h-full"
                                            style={{
                                                width: '211.18px',
                                                gap: '4px'
                                            }}
                                        >
                                            <div
                                                className="flex flex-col justify-center h-full"
                                                style={{ width: '140.18px' }}
                                            >
                                                <span
                                                    style={{
                                                        fontFamily: '"Mona Sans", sans-serif',
                                                        fontWeight: 600,
                                                        fontSize: '11px',
                                                        lineHeight: '13px',
                                                        color: 'hsla(29, 100%, 44%, 1)',
                                                        display: 'block'
                                                    }}
                                                >
                                                    How do I extend tenure
                                                </span>
                                                <span
                                                    style={{
                                                        fontFamily: '"Mona Sans", sans-serif',
                                                        fontWeight: 600,
                                                        fontSize: '11px',
                                                        lineHeight: '13px',
                                                        color: 'hsla(29, 100%, 44%, 1)',
                                                        display: 'block'
                                                    }}
                                                >
                                                    after 6 months?
                                                </span>
                                            </div>
                                            <Link
                                                href="#"
                                                style={{
                                                    width: '67px',
                                                    height: '16px',
                                                    fontFamily: '"Mona Sans", sans-serif',
                                                    fontWeight: 600,
                                                    fontSize: '11px',
                                                    lineHeight: '13px',
                                                    color: 'hsla(3, 86%, 51%, 1)',
                                                    textDecoration: 'underline',
                                                    textDecorationStyle: 'solid',
                                                    textUnderlineOffset: '12.5%',
                                                    textDecorationThickness: '12%',
                                                    whiteSpace: 'nowrap',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'flex-end'
                                                }}
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Details */}
                            <div
                                style={{
                                    width: '536.36px',
                                    height: '59px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '10px',
                                    borderRadius: '12px',
                                    background: 'hsla(0, 0%, 100%, 1)',
                                    border: '1px solid hsla(0, 0%, 89%, 1)',
                                    marginTop: '-24px',
                                    opacity: 1
                                }}
                            >
                                <div
                                    className="flex items-center"
                                    style={{
                                        width: '356px',
                                        height: '39px',
                                        gap: '4px'
                                    }}
                                >
                                    <div
                                        className="rounded-full flex items-center justify-center shrink-0"
                                        style={{
                                            width: '32px',
                                            height: '32px',
                                            background: 'hsla(120, 100%, 95%, 1)'
                                        }}
                                    >
                                        <MapPin weight="fill" size={18} color="hsla(120, 100%, 35%, 1)" />
                                    </div>

                                    <span
                                        style={{
                                            fontFamily: '"Mona Sans", sans-serif',
                                            fontWeight: 600,
                                            fontSize: '14px',
                                            color: '#1D1D1F',
                                            paddingLeft: '4px'
                                        }}
                                    >
                                        Delivery
                                    </span>

                                    <div
                                        className="h-full flex items-center px-4 ml-2"
                                        style={{
                                            border: '1.5px solid hsla(0, 0%, 85%, 1)',
                                            borderRadius: '10px',
                                            flex: 1
                                        }}
                                    >
                                        <input
                                            type="text"
                                            placeholder="Enter your pincode"
                                            style={{
                                                border: 'none',
                                                outline: 'none',
                                                fontSize: '14px',
                                                fontFamily: '"Mona Sans", sans-serif',
                                                width: '100%',
                                                background: 'transparent',
                                                color: '#1D1D1F'
                                            }}
                                        />
                                    </div>
                                </div>

                                <button
                                    style={{
                                        width: '125px',
                                        height: '32px',
                                        fontFamily: '"Mona Sans", sans-serif',
                                        fontWeight: 700,
                                        fontSize: '11px',
                                        lineHeight: '13px',
                                        letterSpacing: '0.08em',
                                        color: 'hsla(0, 0%, 46%, 1)',
                                        textAlign: 'left',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        justifyContent: 'center',
                                        padding: 0
                                    }}
                                >
                                    <span>Check availability</span>
                                    <span>in your state</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* High-Fidelity Details Tabs Section */}
                    <div
                        style={{
                            width: '100%',
                            height: '462.0000915527344px',
                            marginTop: '24px',
                            background: 'hsla(0, 0%, 100%, 1)',
                            border: '1px solid var(--color-grey-grey-200, hsla(0, 0%, 89%, 1))',
                            borderRadius: '24px',
                            padding: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
                            opacity: 1,
                            boxSizing: 'border-box'
                        }}
                    >
                        {/* Tabs Header */}
                        <div
                            className="flex items-center"
                            style={{
                                width: '1160px',
                                height: '41px',
                                gap: '10px',
                                opacity: 1
                            }}
                        >
                            {['Product Details', 'Return Policy', 'Shipping Policy'].map((tab) => {
                                const isActive = activeTab === tab;
                                return (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        style={{
                                            width: isActive && tab === 'Product Details' ? '194px' : 'auto',
                                            height: '41px',
                                            padding: isActive ? '8px 35px' : '8px 24px',
                                            borderRadius: '59px',
                                            fontFamily: '"Mona Sans", sans-serif',
                                            fontWeight: 600,
                                            fontStyle: 'normal',
                                            fontSize: '14px',
                                            lineHeight: '25px',
                                            letterSpacing: '-0.01em',
                                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                            background: isActive ? 'hsla(0, 0%, 20%, 1)' : 'hsla(0, 0%, 100%, 1)',
                                            color: isActive ? 'white' : '#1D1D1F',
                                            border: isActive ? 'none' : '1px solid hsla(0, 0%, 89%, 1)',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        {tab}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Divider */}
                        <div style={{ width: '100%', height: '1px', background: 'hsla(0, 0%, 95%, 1)' }} />

                        {/* Content Area */}
                        <div className="flex-1 overflow-hidden" style={{ width: '100%' }}>
                            {activeTab === 'Product Details' && (
                                <div
                                    className="grid gap-y-8 gap-x-12 pt-4 overflow-x-auto overflow-y-hidden pr-2 no-scrollbar pb-4"
                                    style={{
                                        display: 'grid',
                                        gridTemplateRows: 'repeat(4, auto)',
                                        gridAutoFlow: 'column',
                                        gridAutoColumns: 'minmax(250px, 1fr)'
                                    }}
                                >
                                    {(product.specifications && product.specifications.length > 0 ? product.specifications : [
                                        { label: 'MODEL', value: product.name },
                                        { label: 'DISPLAY', value: '16.2 inches (3024 x 1964)' },
                                        { label: 'GRAPHICS', value: 'Apple Integrated 16-core GPU' },
                                        { label: 'DIMENSIONS', value: '35.57 x 35.57 x 1.68 cm * 2.14 kg' },
                                        { label: 'OPERATING SYSTEM', value: 'Mac OS' },
                                        { label: 'MEMORY', value: '24GB' },
                                        { label: 'PROCESSOR', value: 'Apple M4 Pro' },
                                        { label: 'STORAGE', value: '512GB SSD' }
                                    ]).map((item, idx) => (
                                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                            <h4
                                                style={{
                                                    fontFamily: '"Mona Sans", sans-serif',
                                                    fontWeight: 600,
                                                    fontSize: '13px',
                                                    lineHeight: '18px',
                                                    letterSpacing: '0.02em',
                                                    color: '#000000',
                                                    textTransform: 'uppercase'
                                                }}
                                            >
                                                {item.label}
                                            </h4>
                                            <p
                                                style={{
                                                    fontFamily: '"Mona Sans", sans-serif',
                                                    fontWeight: 400,
                                                    fontSize: '14px',
                                                    lineHeight: '1.4',
                                                    letterSpacing: '-0.01em',
                                                    color: 'hsla(0, 0%, 12%, 1)'
                                                }}
                                            >
                                                {item.value}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'Return Policy' && (
                                <div className="pt-4" style={{ fontFamily: '"Mona Sans", sans-serif', fontSize: '15px', color: '#4B4B4B', lineHeight: '1.6' }}>
                                    {product.returnPolicy || "Standard return policy applies. Please contact support for details."}
                                </div>
                            )}

                            {activeTab === 'Shipping Policy' && (
                                <div className="pt-4" style={{ fontFamily: '"Mona Sans", sans-serif', fontSize: '15px', color: '#4B4B4B', lineHeight: '1.6' }}>
                                    {product.shippingPolicy || "Standard shipping policy applies. Delivery usually takes 2-5 business days."}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            <Testimonials />
            {product.faqs && product.faqs.length > 0 ? (
                <FaqSection cmsData={{ faqItems: product.faqs, faqTitle: "Product FAQs", faqSubtitle: "Specific questions about this product." }} />
            ) : (
                <FaqSection limit={5} />
            )}
            <BestRentedProducts />

            {/* Side Drawers */}
            <CompareTenures
                isOpen={isCompareOpen}
                onClose={() => setIsCompareOpen(false)}
                selectedTenure={duration}
                onSelect={(val) => {
                    setDuration(val);
                }}
                tenures={tenures}
            />

            <CancellationSidebar
                isOpen={isCancellationOpen}
                onClose={() => setIsCancellationOpen(false)}
            />
        </div>
    );
}
