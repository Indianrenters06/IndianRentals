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

const GoogleGLogo = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

const staticReviews = [
    { id: 1, name: "John Doe", role: "AI Engineer", text: "Lorem ipsum velit laoreet tincidunt dolor donec at urna vestibulum nunc accumsan porttitor consequat tellus lectus adipiscing risus ultrices pulvinar duis amet sed in fermentum sed sit ut egestas mattis risus amet odio purus neque egestas pellentesque eget egestas pretium orci vel magna vulputate egestas amet vestibulum dictum sapien rhoncus nibh enim lacus a sapien ultrices dui ipsum pharetra odio scelerisque quis felis nibh integer enim eu mauris tellus neque sit.", bgColor: "hsla(46, 100%, 89%, 1)", textColor: "text-[#BB4A02]", stars: 5 },
    { id: 2, name: "John Doe", role: "AI Engineer", text: "Lorem ipsum dolor sit amet consectetur. Eget pretium risus odio eu commodo amet pretium. Interdum purus sapien facilisi at senectus tempus nisi nulla. Ultricies condimentum mi ultrices integer.", bgColor: "hsla(250, 100%, 95%, 1)", textColor: "text-[#5718BF]", stars: 5 },
    { id: 3, name: "John Doe", role: "AI Engineer", text: "Lorem ipsum dolor sit amet consectetur. Eget pretium risus odio eu commodo amet pretium. Interdum purus sapien facilisi at senectus tempus nisi nulla. Ultricies condimentum mi ultrices integer.", bgColor: "hsla(208, 100%, 92%, 1)", textColor: "text-[#13309C]", stars: 5 },
    { id: 4, name: "John Doe", role: "AI Engineer", text: "Lorem ipsum pharetra a at quam ipsum lobortis vestibulum eu egestas habitant ipsum magna tempus auctor laoreet justo elementum et sit posuere fermentum sed sit ut egestas mattis risus amet odio purus neque egestas pellentesque eget egestas pretium orci vel magna vulputate egestas amet vestibulum dictum sapien rhoncus nibh enim lacus a sapien ultrices dui ipsum pharetra odio scelerisque quis felis nibh integer enim eu mauris tellus neque sit.", bgColor: "hsla(208, 100%, 92%, 1)", textColor: "text-[#13309C]", stars: 5 },
    { id: 5, name: "John Doe", role: "AI Engineer", text: "Lorem ipsum elementum rhoncus sed vulputate mattis accumsan duis laoreet eu laoreet risus cursus in ridiculus amet sollicitudin lectus sed ullamcorper leo massa risus libero pellentesque pretium ut arcu cursus risus ultrices vulputate volutpat vulputate molestie sagittis aenean faucibus commodo nisi purus enim proin facilisis sed at porttitor posuere morbi morbi in cursus posuere diam a tortor lorem posuere sed.", bgColor: "hsla(322, 93%, 95%, 1)", textColor: "text-[#AD0755]", stars: 5 },
    { id: 6, name: "John Doe", role: "AI Engineer", text: "Lorem ipsum volutpat placerat sem turpis ipsum massa cras non ultrices eu id viverra lectus enim leo adipiscing sem rhoncus ligula augue sit id ante eget eget diam egestas in sit urna hendrerit cum scelerisque tortor pellentesque ut donec diam lacus massa sed fermentum nunc egestas semper tempus augue nunc.", bgColor: "hsla(250, 100%, 95%, 1)", textColor: "text-[#5718BF]", stars: 5 },
    { id: 7, name: "John Doe", role: "AI Engineer", text: "Lorem ipsum dolor sit amet consectetur. Eget pretium risus odio eu commodo amet pretium. Interdum purus sapien facilisi at senectus tempus nisi nulla. Ultricies condimentum mi ultrices integer.", bgColor: "hsla(167, 85%, 89%, 1)", textColor: "text-[#115E59]", stars: 5 },
    { id: 8, name: "John Doe", role: "AI Engineer", text: "Lorem ipsum quisque gravida volutpat volutpat adipiscing quam senectus aenean semper turpis nulla arcu in mauris augue odio netus tellus aliquet lectus mauris est id eleifend elit sed porta lobortis quis ut tristique ut et dui orci risus tellus nibh fames aliquam odio eget ullamcorper res conconvallis porttitor eu posuere viverra arcu ridiculis in ut ultrices egestas at ac sit enim dolor arcu integer vitae bibindum sit sed mauris est arcu malesuada porta eros eu vel mi pretium habitasse.", bgColor: "hsla(208, 100%, 92%, 1)", textColor: "text-[#13309C]", stars: 5 },
    { id: 9, name: "John Doe", role: "AI Engineer", text: "Lorem ipsum nunc tortor viverra condimentum faucibus pharetra nunc turpis consequat gravida suspendisse ullamcorper elit ut dignissim mattis egestas odio facilisi sagittis integer morbi dignissim quam risus tellus cras ut ac ornare felis duis et donec et sed tincidunt.", bgColor: "hsla(46, 100%, 89%, 1)", textColor: "text-[#BB4A02]", stars: 5 },
];

const Testimonials = ({ overrideBg, overridePadding, overrideHeight, titleOverride, subtitleOverride }) => {
    const [viewType, setViewType] = useState('mobile');
    const [reviewsData, setReviewsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [enabled, setEnabled] = useState(true);

    useEffect(() => {
        const checkRes = () => {
            const w = window.innerWidth;
            if (w >= 1024) setViewType('desktop');
            else if (w >= 768) setViewType('tablet');
            else setViewType('mobile');
        };
        checkRes();
        window.addEventListener('resize', checkRes);
        return () => window.removeEventListener('resize', checkRes);
    }, []);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [tData, cmsRes] = await Promise.all([
                    getTestimonials(),
                    fetch(`${API}/api/cms/homepage`).then(r => r.ok ? r.json() : null).catch(() => null),
                ]);
                if (cmsRes && cmsRes.testimonialsEnabled === false) {
                    setEnabled(false);
                    setLoading(false);
                    return;
                }
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
                console.warn("Failed to fetch testimonials - using static data");
                setReviewsData(staticReviews);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const TestimonialCard = ({ review, isMobile }) => (
        <div
            style={{
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '18px',
                gap: '10px',
                width: isMobile ? '100%' : '100%',
                borderRadius: '20px',
                backgroundColor: review.bgColor || '#FFFFFF',
                willChange: 'transform',
                backfaceVisibility: 'hidden',
                WebkitFontSmoothing: 'antialiased',
                transform: 'translateZ(0)'
            }}
        >
            {/* Name & Role */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', width: '100%' }}>
                <span
                    style={{
                        fontFamily: "'Mona Sans', sans-serif",
                        fontWeight: 500,
                        fontSize: '18px',
                        lineHeight: '25px',
                        letterSpacing: '-0.8px',
                        color: review.nameColor || (review.textColor?.includes('orange') ? '#7C2F0B' : (review.textColor?.includes('violet') || review.textColor?.includes('5718') ? '#000000' : (review.textColor?.includes('309C') ? '#0E206E' : '#333333')))
                    }}
                >{review.name}</span>
                <span
                    style={{
                        fontFamily: "'Mona Sans', sans-serif",
                        fontWeight: 400,
                        fontSize: '12px',
                        lineHeight: '16px',
                        letterSpacing: '-0.4px',
                        color: review.roleColor || (review.textColor?.includes('orange') ? '#7C2F0B' : (review.textColor?.includes('violet') || review.textColor?.includes('5718') ? '#000000' : (review.textColor?.includes('309C') ? '#0E206E' : '#545454')))
                    }}
                >{review.role || 'Verified User'}</span>
            </div>

            {/* Review Text */}
            <p
                className={review.textColor}
                style={{
                    fontFamily: "'Mona Sans', sans-serif",
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: '20px',
                    letterSpacing: '-0.4px',
                    width: '100%',
                    margin: 0
                }}
            >
                {review.message || review.text}
            </p>

            {/* Footer: Google logo + Stars */}
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '4px' }}>
                <GoogleGLogo />
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '3px' }}>
                    {[...Array(5)].map((_, i) => (
                        <PiStarFill key={i} size={18} style={{ color: '#FFAD32' }} />
                    ))}
                </div>
            </div>
        </div>
    );

    if (loading || !enabled) return null;

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

    // ─── Mobile Layout ────────────────────────────────────────────────────────
    if (viewType === 'mobile') {
        const mobileCards = (reviewsData.length > 0 ? reviewsData : staticReviews).slice(0, 3);
        return (
            <section
                style={{
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '40px 20px',
                    gap: '10px',
                    width: '100%',
                    background: overrideBg || '#FFFFFF',
                    position: 'relative',
                    isolation: 'isolate'
                }}
            >
                {/* Frame 158 — Inner container */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '0px',
                        gap: '24px',
                        width: '100%',
                        maxWidth: '350px'
                    }}
                >
                    {/* Header Row */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '14px', width: '100%' }}>
                        <h2
                            style={{
                                fontFamily: "'Mona Sans', sans-serif",
                                fontWeight: 600,
                                fontSize: '25px',
                                lineHeight: '31px',
                                letterSpacing: '-0.8px',
                                color: '#333333',
                                margin: 0
                            }}
                        >
                            {titleOverride || 'What Our Customers Say'}
                        </h2>
                        <p
                            style={{
                                fontFamily: "'Mona Sans', sans-serif",
                                fontWeight: 500,
                                fontSize: '12px',
                                lineHeight: '18px',
                                letterSpacing: '-0.4px',
                                color: '#545454',
                                margin: 0,
                                width: '100%'
                            }}
                        >
                            {subtitleOverride || 'Real experiences from innovators, businesses, and creators powering their ambitions with IndianRenters.'}
                        </p>
                    </div>

                    {/* Cards — with bottom fade overlay */}
                    <div style={{ position: 'relative', width: '100%', height: '590px', overflow: 'hidden' }}>
                        {/* Scrollable cards column */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
                            {mobileCards.map((review, i) => (
                                <TestimonialCard key={review.id || i} review={review} isMobile />
                            ))}
                        </div>

                        {/* Bottom gradient fade overlay */}
                        <div
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: '349px',
                                left: 0,
                                bottom: 0,
                                background: 'linear-gradient(0deg, #FFFFFF 25.84%, rgba(255, 255, 255, 0) 89.91%)',
                                pointerEvents: 'none',
                                zIndex: 1
                            }}
                        />
                    </div>

                    {/* Blue CTA Button */}
                    <Link
                        href="/reviews"
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '6px 20px',
                            gap: '2px',
                            width: '131px',
                            height: '30px',
                            background: '#0075FF',
                            borderRadius: '28px',
                            fontFamily: "'Mona Sans', sans-serif",
                            fontWeight: 500,
                            fontSize: '12px',
                            lineHeight: '18px',
                            letterSpacing: '-0.4px',
                            color: '#EDFAFF',
                            textDecoration: 'none',
                            flexShrink: 0
                        }}
                    >
                        Read All Reviews
                    </Link>
                </div>
            </section>
        );
    }

    // ─── Desktop / Tablet Layout ──────────────────────────────────────────────
    return (
        <section
            className="w-full flex flex-col items-center mx-auto"
            style={{
                background: overrideBg || '#FFFFFF',
                width: '100%',
                maxWidth: '1440px',
                minHeight: overrideHeight || 'auto',
                margin: '0 auto',
                overflow: 'visible'
            }}
        >
            <div
                className="w-full h-full mx-auto flex flex-col items-center px-4 sm:px-6"
                style={{
                    maxWidth: '1200px',
                    paddingTop: overridePadding || '40px',
                    paddingBottom: overridePadding || '40px',
                    gap: viewType === 'desktop' ? '24px' : '16px',
                    position: 'relative',
                    zIndex: 1
                }}
            >
                <div
                    className="w-full flex font-sans mb-2 gap-6"
                    style={{
                        flexDirection: viewType === 'desktop' ? 'row' : 'column',
                        alignItems: viewType === 'desktop' ? 'flex-end' : 'flex-start',
                        justifyContent: viewType === 'desktop' ? 'space-between' : 'flex-start'
                    }}
                >
                    <div className="flex flex-col" style={{ width: viewType === 'desktop' ? '600px' : '100%', gap: '8px' }}>
                        <h2
                            style={{
                                fontFamily: "'Mona Sans', sans-serif",
                                fontWeight: 600,
                                fontSize: viewType === 'desktop' ? '36px' : '28px',
                                lineHeight: viewType === 'desktop' ? '45px' : '36px',
                                letterSpacing: '-0.02em',
                                color: 'hsla(0, 0%, 20%, 1)',
                                margin: 0
                            }}
                        >
                            {titleOverride || 'What Our Customers Say'}
                        </h2>
                        <p
                            style={{
                                fontFamily: "'Mona Sans', sans-serif",
                                fontSize: '16px',
                                fontWeight: 500,
                                lineHeight: '1.4',
                                letterSpacing: '-0.02em',
                                color: '#545454',
                                margin: 0
                            }}
                        >
                            {subtitleOverride || 'Real experiences from innovators, businesses, and creators powering their ambitions with IndianRenters.'}
                        </p>
                    </div>

                    {/* Google Badge — desktop only */}
                    {viewType === 'desktop' && (
                        <div className="flex items-center gap-2 self-end mb-2">
                            <GoogleGLogo />
                            <span className="text-[13px] font-semibold text-[#1D1D1F]">5000+ reviews</span>
                            <div className="h-4 w-[1px] bg-[#D2D2D7] mx-1" />
                            <div className="flex items-center gap-1.5">
                                <div className="flex text-[#1D1D1F]">
                                    <PiStarFill size={14} /><PiStarFill size={14} /><PiStarFill size={14} /><PiStarFill size={14} /><PiStarHalfFill size={14} />
                                </div>
                                <span className="text-[13px] font-bold text-[#1D1D1F]">4.9</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Grid */}
                <div
                    className={`${viewType === 'desktop' ? 'grid-cols-3' : 'grid-cols-2'} grid w-full`}
                    style={{
                        gap: viewType === 'desktop' ? '24px' : '20px',
                        maskImage: viewType === 'desktop' ? 'linear-gradient(to bottom, #000 60%, transparent 100%)' : undefined,
                        WebkitMaskImage: viewType === 'desktop' ? 'linear-gradient(to bottom, #000 60%, transparent 100%)' : undefined
                    }}
                >
                    <div className="flex flex-col" style={{ gap: viewType === 'desktop' ? '24px' : '20px' }}>
                        <TestimonialCard review={reviewsData[0] || staticReviews[0]} />
                        <TestimonialCard review={reviewsData[1] || staticReviews[1]} />
                        <TestimonialCard review={reviewsData[2] || staticReviews[2]} />
                    </div>
                    <div className="flex flex-col" style={{ gap: viewType === 'desktop' ? '24px' : '20px' }}>
                        <TestimonialCard review={reviewsData[3] || staticReviews[3]} />
                        <TestimonialCard review={reviewsData[4] || staticReviews[4]} />
                        <TestimonialCard review={reviewsData[5] || staticReviews[5]} />
                    </div>
                    {viewType === 'desktop' && (
                        <div className="flex flex-col" style={{ gap: '24px' }}>
                            <TestimonialCard review={reviewsData[6] || staticReviews[6]} />
                            <TestimonialCard review={reviewsData[7] || staticReviews[7]} />
                            <TestimonialCard review={reviewsData[8] || staticReviews[8]} />
                        </div>
                    )}
                </div>

                <div className="flex mt-8 md:mt-12 w-full justify-center z-10">
                    <Link
                        href="/reviews"
                        className="inline-flex items-center justify-center rounded-full transition-all hover:brightness-110 shadow-md active:scale-95"
                        style={{
                            minWidth: '163px',
                            height: '40px',
                            padding: '6px 20px',
                            backgroundColor: '#0075FF',
                            color: '#EDFAFF',
                            fontFamily: "'Mona Sans', sans-serif",
                            fontSize: '16px',
                            fontWeight: 500,
                            letterSpacing: '-0.4px',
                            lineHeight: '23px'
                        }}
                    >
                        Read All Reviews
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
