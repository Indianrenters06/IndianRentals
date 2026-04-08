"use client";
import React, { useEffect, useState } from 'react';
import { PiStarFill, PiStarHalfFill } from 'react-icons/pi';
import { getTestimonials } from '../services/testimonialService';
import { API } from '../services/apiConfig';
import Link from 'next/link';

const GoogleLogo = () => (
    <div className="flex items-center gap-1.5 transform scale-90 origin-left">
        <span className="font-bold text-[15px] tracking-tight">
            <span className="text-[#4285F4]">G</span>
            <span className="text-[#EA4335]">o</span>
            <span className="text-[#FBBC05]">o</span>
            <span className="text-[#4285F4]">g</span>
            <span className="text-[#34A853]">l</span>
            <span className="text-[#EA4335]">e</span>
        </span>
    </div>
);

const staticReviews = [
    { id: 1, name: "John Doe", role: "AI Engineer", text: "Lorem ipsum dolor sit amet consectetur. Eget pretium risus odio eu commodo amet pretium. Interdum purus sapien facilisi at senectus tempus nisi nulla. Ultricies condimentum mi ultrices integer.", bgColor: "hsla(208, 100%, 92%, 1)", textColor: "text-[#0A4BB3]", stars: 4.5 },
    { id: 2, name: "John Doe", role: "AI Engineer", text: "Lorem ipsum dolor sit amet consectetur. Eget pretium risus odio eu commodo amet pretium. Interdum purus sapien facilisi at senectus tempus nisi nulla. Ultricies condimentum mi ultrices integer.", bgColor: "hsla(167, 85%, 89%, 1)", textColor: "text-[#216436]", stars: 4.5 },
    { id: 3, name: "John Doe", role: "AI Engineer", text: "Lorem ipsum dolor sit amet consectetur. Eget pretium risus odio eu commodo amet pretium. Interdum purus sapien facilisi at senectus tempus nisi nulla. Ultricies condimentum mi ultrices integer.", bgColor: "hsla(250, 100%, 95%, 1)", textColor: "text-[#553C9A]", stars: 4.5 },
    { id: 4, name: "John Doe", role: "AI Engineer", text: "Lorem ipsum dolor sit amet consectetur. Eget pretium risus odio eu commodo amet pretium. Interdum purus sapien facilisi at senectus tempus nisi nulla. Ultricies condimentum mi ultrices integer.", bgColor: "hsla(46, 100%, 89%, 1)", textColor: "text-[#995D00]", stars: 4.5 },
    { id: 5, name: "John Doe", role: "AI Engineer", text: "Lorem ipsum dolor sit amet consectetur. Eget pretium risus odio eu commodo amet pretium. Interdum purus sapien facilisi at senectus tempus nisi nulla. Ultricies condimentum mi ultrices integer.", bgColor: "hsla(322, 93%, 95%, 1)", textColor: "text-[#B83280]", stars: 4.5 },
    { id: 6, name: "John Doe", role: "AI Engineer", text: "Lorem ipsum dolor sit amet consectetur. Eget pretium risus odio eu commodo amet pretium. Interdum purus sapien facilisi at senectus tempus nisi nulla. Ultricies condimentum mi ultrices integer.", bgColor: "hsla(46, 100%, 89%, 1)", textColor: "text-[#995D00]", stars: 4.5 },
];

const Testimonials = () => {
    const [isDesktop, setIsDesktop] = useState(false);
    const [reviewsData, setReviewsData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkRes = () => setIsDesktop(window.innerWidth >= 1024);
        checkRes();
        window.addEventListener('resize', checkRes);
        return () => window.removeEventListener('resize', checkRes);
    }, []);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const tData = await getTestimonials();
                const processed = (tData && tData.length > 0 ? tData : staticReviews).map((rev, idx) => {
                    const template = staticReviews[idx % staticReviews.length];
                    return {
                        ...rev,
                        bgColor: rev.bgColor || template.bgColor,
                        textColor: rev.textColor || template.textColor
                    };
                });
                setReviewsData(processed);
            } catch (error) {
                console.error("Failed to fetch testimonials", error);
                setReviewsData(staticReviews);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const TestimonialCard = ({ review }) => (
        <div
            className="rounded-[2rem] p-7 md:p-8 flex flex-col h-[220px] transition-all hover:scale-[1.01] duration-300 min-w-[380px] md:min-w-[420px] lg:min-w-[385px] shadow-sm font-manrope"
            style={{ backgroundColor: review.bgColor || '#FFFFFF' }}
        >
            <div className="flex flex-col mb-4">
                <span className={`text-[18px] font-bold ${review.textColor || "text-[#1D1D1F]"} leading-tight`}>{review.name}</span>
                <span className={`text-[13px] ${review.textColor || "text-[#86868B]"} opacity-80`}>{review.role || "Verified User"}</span>
            </div>

            <p className={`text-[14px] ${review.textColor || "text-[#1D1D1F]"} leading-[1.4] mb-auto grow overflow-hidden line-clamp-4`}>
                {review.message || review.text}
            </p>

            <div className="flex items-center justify-between mt-4">
                <GoogleLogo />
                <div className="flex items-center gap-0.5 text-[#FFB323]">
                    {[...Array(4)].map((_, i) => (
                        <PiStarFill key={i} size={18} />
                    ))}
                    <PiStarHalfFill size={18} />
                </div>
            </div>
        </div>
    );

    if (loading) return null;

    // Row 1: Bright Sky Blue, Soft Teal Green, Vivid Violet
    const row1 = [
        { ...staticReviews[0] },
        { ...staticReviews[1] },
        { ...staticReviews[2] },
        { ...staticReviews[0] },
        { ...staticReviews[1] },
        { ...staticReviews[2] }
    ];

    // Row 2: Warm Gold Yellow, Luminous Magenta, Warm Gold Yellow
    const row2 = [
        { ...staticReviews[3] },
        { ...staticReviews[4] },
        { ...staticReviews[5] },
        { ...staticReviews[3] },
        { ...staticReviews[4] },
        { ...staticReviews[5] }
    ];

    return (
        <section 
            className="w-full flex flex-col items-center"
            style={{ 
                background: isDesktop ? '#F5F5F5' : 'hsla(0, 0%, 96%, 1)',
                width: isDesktop ? '100%' : '390px',
                height: isDesktop ? 'auto' : '404px',
                margin: '0 auto',
                overflow: 'hidden'
            }}
        >
            {/* Outer Frame */}
            <div 
                className="w-full h-full mx-auto flex flex-col items-center"
                style={{
                    maxWidth: isDesktop ? '1200px' : '100%',
                    paddingTop: isDesktop ? '96px' : '48px',
                    paddingBottom: isDesktop ? '96px' : '48px',
                    paddingLeft: isDesktop ? '24px' : '20px',
                    paddingRight: isDesktop ? '24px' : '20px',
                    gap: isDesktop ? '32px' : '10px'
                }}
            >
                
                {/* Header Row — Figma Width: 1200px, Height: 105px */}
                <div 
                    className="w-full flex flex-col md:flex-row md:items-end justify-between font-manrope mb-8 gap-6 md:gap-0" 
                >
                    <div 
                        className="flex flex-col md:w-[512px]" 
                        style={{ 
                            width: isDesktop ? '512px' : '350px',
                            height: isDesktop ? 'auto' : '81px',
                            justifyContent: isDesktop ? 'flex-start' : 'space-between',
                            gap: isDesktop ? '5px' : '0'
                        }}
                    >
                        <h2 
                            className="font-manrope font-semibold"
                            style={{
                                width: isDesktop ? 'auto' : '292px',
                                height: isDesktop ? 'auto' : '31px',
                                fontSize: isDesktop ? '36px' : '24px',
                                color: isDesktop ? '#1D1D1F' : 'hsla(0, 0%, 20%, 1)',
                                lineHeight: isDesktop ? '1.1' : '31px',
                                tracking: isDesktop ? 'tight' : 'normal'
                            }}
                        >
                            What Our Customers Say
                        </h2>
                        <p 
                            className="font-manrope"
                            style={{
                                width: isDesktop ? 'auto' : '350px',
                                height: isDesktop ? 'auto' : '36px',
                                fontSize: isDesktop ? '16px' : '13.5px',
                                fontWeight: '500',
                                color: 'hsla(0, 0%, 0%, 1)',
                                lineHeight: isDesktop ? '1.2' : '18px',
                                maxWidth: isDesktop ? '512px' : 'none'
                            }}
                        >
                            Real experiences from innovators, businesses, and creators powering their ambitions with IndianRenters.
                        </p>
                    </div>

                    {/* Google Badge (Hidden on Mobile) */}
                    <div className="hidden md:flex items-center gap-3 self-end mb-1">
                        <div className="bg-white border border-[#E5E5E7] rounded-full px-4 py-1.5 flex items-center gap-3 shadow-sm">
                            <div className="flex items-center bg-white">
                                <span className="font-bold text-[14px] tracking-tight">
                                    <span className="text-blue-500">G</span>
                                    <span className="text-red-500">o</span>
                                    <span className="text-yellow-500">o</span>
                                    <span className="text-blue-500">g</span>
                                    <span className="text-green-500">l</span>
                                    <span className="text-red-500">e</span>
                                </span>
                            </div>
                            <div className="h-4 w-[1px] bg-[#D2D2D7]" />
                            <span className="text-[12px] font-bold text-[#1D1D1F]">5000+ reviews</span>
                            <div className="flex items-center gap-1">
                                <div className="flex text-[#FFB323]">
                                    <PiStarFill size={12} /><PiStarFill size={12} /><PiStarFill size={12} /><PiStarFill size={12} /><PiStarFill size={12} />
                                </div>
                                <span className="text-[12px] font-bold text-[#1D1D1F]">4.9</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Inner Clipping Container - 1160px for Grid */}
                <div
                    className="w-full max-w-[1160px] flex flex-col overflow-hidden"
                    style={{ gap: '24px' }}
                >
                    {/* Desktop: Staggered Grid Container (lg:flex) */}
                    <div
                        className="hidden lg:flex flex-col relative"
                        style={{
                            width: '100%',
                            height: '460px',
                            marginTop: '8px'
                        }}
                    >
                        {/* Edge Fade Gradients */}
                        <div
                            className="absolute pointer-events-none z-10"
                            style={{
                                width: '26px',
                                height: '479px',
                                top: '-6px',
                                left: '-3px',
                                background: 'linear-gradient(270deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 100%)'
                            }}
                        />
                        <div
                            className="absolute pointer-events-none z-10"
                            style={{
                                width: '27px',
                                height: '479px',
                                top: '-6px',
                                left: '1134px',
                                transform: 'rotate(-180deg)',
                                background: 'linear-gradient(270deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 100%)'
                            }}
                        />

                        {/* Upper Row - Figma: left: -113.63px, top: 0px */}
                        <div
                            className="absolute flex flex-row opacity-100"
                            style={{
                                left: '-113.63px',
                                top: '0px',
                                width: '1195px',
                                gap: '20px'
                            }}
                        >
                            {row1.map((rev, i) => (
                                <TestimonialCard key={`r1-${i}`} review={rev} />
                            ))}
                        </div>

                        {/* Lower Row - Figma: left: 78.63px, top: 240px */}
                        <div
                            className="absolute flex flex-row opacity-100"
                            style={{
                                left: '78.63px',
                                top: '240px',
                                width: '1195px',
                                gap: '20px'
                            }}
                        >
                            {row2.map((rev, i) => (
                                <TestimonialCard key={`r2-${i}`} review={rev} />
                            ))}
                        </div>
                    </div>

                    {/* Mobile: Original Horizontal Scroll Snap Carousel (lg:hidden) */}
                    <div 
                        className="lg:hidden w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                        style={{ width: '350px', height: '203px' }}
                    >
                        <div className="flex gap-4 w-max px-2 h-full">
                            {reviewsData.map((review, i) => (
                                <div
                                    key={`mobile-rev-${i}`}
                                    className="snap-start rounded-xl flex flex-col shadow-sm transition-all duration-300 font-manrope"
                                    style={{ 
                                        backgroundColor: review.bgColor || '#FFFFFF',
                                        minWidth: '229px',
                                        height: '156px',
                                        padding: '8px 12px',
                                        gap: '20px'
                                    }}
                                >
                                    <div className="flex flex-col">
                                        <h3 className={`text-[15px] font-bold ${review.textColor || "text-[#1D1D1F]"} leading-none mb-0.5`}>{review.name}</h3>
                                        <p className={`text-[11px] ${review.textColor || "text-[#86868B]"} opacity-80`}>{review.role || "Verified User"}</p>
                                    </div>
                                    <p 
                                        className="font-manrope"
                                        style={{ 
                                            width: '205px',
                                            height: '56px',
                                            fontSize: '11px', 
                                            fontWeight: '500',
                                            color: 'hsla(23, 98%, 37%, 1)',
                                            lineHeight: '18px',
                                            overflow: 'hidden',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical'
                                        }}
                                    >
                                        {review.message || review.text}
                                    </p>
                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="scale-75 origin-left">
                                            <GoogleLogo />
                                        </div>
                                        <div className="flex text-[#FFB323] gap-0.5 scale-75 origin-right">
                                            {[...Array(5)].map((_, j) => (
                                                <PiStarFill key={`s-${i}-${j}`} size={16} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Read All Reviews Button (Hidden on Mobile) */}
                    <div className="hidden md:flex mt-8 md:mt-16 w-full justify-center z-10">
                        <Link
                            href="/testimonials"
                            className="bg-[#007AFF] hover:bg-[#0062CC] text-white font-semibold flex items-center justify-center transition-all shadow-md hover:shadow-lg"
                            style={{ width: '185px', height: '42.58px', borderRadius: '9999px', fontSize: '14px' }}
                        >
                            Read All Reviews
                        </Link>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </section>
    );
};

export default Testimonials;
