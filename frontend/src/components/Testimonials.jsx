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
    { id: 1, name: "John Doe", role: "AI Engineer", text: "Lorem ipsum velit laoreet tincidunt dolor donec at urna vestibulum nunc accumsan porttitor consequat tellus lectus adipiscing risus ultrices pulvinar duis amet sed in fermentum sed sit ut egestas mattis risus amet odio purus neque egestas pellentesque eget egestas pretium orci vel magna vulputate egestas amet vestibulum dictum sapien rhoncus nibh enim lacus a sapien ultrices dui ipsum pharetra odio scelerisque quis felis nibh integer enim eu mauris tellus neque sit.", bgColor: "hsla(46, 100%, 89%, 1)", textColor: "text-[#995D00]", stars: 5 },
    { id: 2, name: "John Doe", role: "AI Engineer", text: "Lorem ipsum dolor sit amet consectetur. Eget pretium risus odio eu commodo amet pretium. Interdum purus sapien facilisi at senectus tempus nisi nulla. Ultricies condimentum mi ultrices integer.", bgColor: "hsla(250, 100%, 95%, 1)", textColor: "text-[#553C9A]", stars: 5 },
    { id: 3, name: "John Doe", role: "AI Engineer", text: "Lorem ipsum dolor sit amet consectetur. Eget pretium risus odio eu commodo amet pretium. Interdum purus sapien facilisi at senectus tempus nisi nulla. Ultricies condimentum mi ultrices integer.", bgColor: "hsla(208, 100%, 92%, 1)", textColor: "text-[#0A4BB3]", stars: 5 },
    { id: 4, name: "John Doe", role: "AI Engineer", text: "Lorem ipsum pharetra a at quam ipsum lobortis vestibulum eu egestas habitant ipsum magna tempus auctor laoreet justo elementum et sit posuere fermentum sed sit ut egestas mattis risus amet odio purus neque egestas pellentesque eget egestas pretium orci vel magna vulputate egestas amet vestibulum dictum sapien rhoncus nibh enim lacus a sapien ultrices dui ipsum pharetra odio scelerisque quis felis nibh integer enim eu mauris tellus neque sit.", bgColor: "hsla(208, 100%, 92%, 1)", textColor: "text-[#0A4BB3]", stars: 5 },
    { id: 5, name: "John Doe", role: "AI Engineer", text: "Lorem ipsum elementum rhoncus sed vulputate mattis accumsan duis laoreet eu laoreet risus cursus in ridiculus amet sollicitudin lectus sed ullamcorper leo massa risus libero pellentesque pretium ut arcu cursus risus ultrices vulputate volutpat vulputate molestie sagittis aenean faucibus commodo nisi purus enim proin facilisis sed at porttitor posuere morbi morbi in cursus posuere diam a tortor lorem posuere sed.", bgColor: "hsla(322, 93%, 95%, 1)", textColor: "text-[#B83280]", stars: 5 },
    { id: 6, name: "John Doe", role: "AI Engineer", text: "Lorem ipsum volutpat placerat sem turpis ipsum massa cras non ultrices eu id viverra lectus enim leo adipiscing sem rhoncus ligula augue sit id ante eget eget diam egestas in sit urna hendrerit cum scelerisque tortor pellentesque ut donec diam lacus massa sed fermentum nunc egestas semper tempus augue nunc.", bgColor: "hsla(250, 100%, 95%, 1)", textColor: "text-[#553C9A]", stars: 5 },
    { id: 7, name: "John Doe", role: "AI Engineer", text: "Lorem ipsum dolor sit amet consectetur. Eget pretium risus odio eu commodo amet pretium. Interdum purus sapien facilisi at senectus tempus nisi nulla. Ultricies condimentum mi ultrices integer.", bgColor: "hsla(167, 85%, 89%, 1)", textColor: "text-[#216436]", stars: 5 },
    { id: 8, name: "John Doe", role: "AI Engineer", text: "Lorem ipsum quisque gravida volutpat volutpat adipiscing quam senectus aenean semper turpis nulla arcu in mauris augue odio netus tellus aliquet lectus mauris est id eleifend elit sed porta lobortis quis ut tristique ut et dui orci risus tellus nibh fames aliquam odio eget ullamcorper res conconvallis porttitor eu posuere viverra arcu ridiculis in ut ultrices egestas at ac sit enim dolor arcu integer vitae bibindum sit sed mauris est arcu malesuada porta eros eu vel mi pretium habitasse.", bgColor: "hsla(208, 100%, 92%, 1)", textColor: "text-[#0A4BB3]", stars: 5 },
    { id: 9, name: "John Doe", role: "AI Engineer", text: "Lorem ipsum nunc tortor viverra condimentum faucibus pharetra nunc turpis consequat gravida suspendisse ullamcorper elit ut dignissim mattis egestas odio facilisi sagittis integer morbi dignissim quam risus tellus cras ut ac ornare felis duis et donec et sed tincidunt.", bgColor: "hsla(46, 100%, 89%, 1)", textColor: "text-[#995D00]", stars: 5 },
];

const Testimonials = () => {
    const [viewType, setViewType] = useState('mobile');
    const [reviewsData, setReviewsData] = useState([]);
    const [loading, setLoading] = useState(true);

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
            className="rounded-2xl p-[20px] flex flex-col transition-all hover:scale-[1.01] duration-300 shadow-sm font-sans"
            style={{
                backgroundColor: review.bgColor || '#FFFFFF',
                width: '100%'
            }}
        >
            <div className="flex flex-col mb-4">
                <span className={`text-[18px] font-bold ${review.textColor || "text-[#1D1D1F]"} leading-tight`}>{review.name}</span>
                <span className={`text-[13px] ${review.textColor || "text-[#86868B]"} opacity-80`}>{review.role || "Verified User"}</span>
            </div>

            <p
                className={`grow mb-auto ${review.textColor || "text-[#1D1D1F]"}`}
                style={{
                    fontFamily: "'Mona Sans', sans-serif",
                    fontSize: "12.5px",
                    fontWeight: 500,
                    lineHeight: "1.4",
                    letterSpacing: "0.01em"
                }}
            >
                {review.message || review.text}
            </p>

            <div className="flex items-center justify-between mt-6">
                <GoogleGLogo />
                <div className="flex items-center gap-0.5 text-[#FFB323]">
                    {[...Array(5)].map((_, i) => (
                        <PiStarFill key={i} size={18} />
                    ))}
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
                background: viewType === 'desktop' ? '#F5F5F5' : (viewType === 'tablet' ? '#FFFFFF' : 'hsla(0, 0%, 96%, 1)'),
                width: '100%',
                height: 'auto',
                margin: '0 auto',
                overflow: 'hidden'
            }}
        >
            <div
                className="w-full h-full mx-auto flex flex-col items-center"
                style={{
                    maxWidth: viewType === 'desktop' ? '1200px' : (viewType === 'tablet' ? '768px' : '100%'),
                    paddingTop: viewType === 'desktop' ? '96px' : (viewType === 'tablet' ? '96px' : '48px'),
                    paddingBottom: viewType === 'desktop' ? '96px' : (viewType === 'tablet' ? '96px' : '48px'),
                    paddingLeft: viewType === 'desktop' ? '24px' : (viewType === 'tablet' ? '30px' : '20px'),
                    paddingRight: viewType === 'desktop' ? '24px' : (viewType === 'tablet' ? '30px' : '20px'),
                    gap: viewType === 'desktop' ? '24px' : (viewType === 'tablet' ? '16px' : '10px')
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
                    <div
                        className="flex flex-col"
                        style={{
                            width: viewType === 'mobile' ? '100%' : (viewType === 'desktop' ? '600px' : '100%'),
                            maxWidth: viewType === 'mobile' ? '350px' : undefined,
                            height: viewType === 'mobile' ? '81px' : 'auto',
                            justifyContent: 'flex-start',
                            gap: viewType === 'mobile' ? '5px' : '8px'
                        }}
                    >
                        <h2
                            className="text-[24px] md:text-[36px] leading-[32px] md:leading-[45px]"
                            style={{
                                fontFamily: '"Mona Sans", sans-serif',
                                fontWeight: 600,
                                letterSpacing: '-0.02em',
                                color: 'hsla(0, 0%, 20%, 1)',
                                margin: 0
                            }}
                        >
                            What Our Customers Say
                        </h2>
                        <p
                            style={{
                                width: '100%',
                                height: viewType === 'mobile' ? '36px' : 'auto',
                                fontFamily: '"Mona Sans", sans-serif',
                                fontSize: viewType === 'mobile' ? '14px' : '16px',
                                fontWeight: 500,
                                lineHeight: viewType === 'mobile' ? '18px' : '1.5',
                                letterSpacing: '0.01em',
                                color: viewType === 'mobile' ? 'hsla(0, 0%, 33%, 1)' : '#86868B',
                                margin: 0
                            }}
                        >
                            Real experiences from innovators, businesses, and creators powering their ambitions with IndianRenters.
                        </p>
                    </div>

                    {/* Google Badge */}
                    <div className={`${viewType === 'desktop' ? 'flex' : 'hidden'} items-center gap-2 self-end mb-2`}>
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
                </div>

                {/* Grid Container */}
                <div
                    className={`${viewType === 'desktop' ? 'grid-cols-3' : (viewType === 'tablet' ? 'grid-cols-2' : 'grid-cols-1')} grid w-full`}
                    style={{
                        minHeight: viewType === 'desktop' ? '869.95px' : 'auto',
                        width: viewType === 'mobile' ? '100%' : '100%',
                        maxWidth: viewType === 'mobile' ? '350px' : undefined,
                        margin: viewType === 'mobile' ? '0 auto' : undefined,
                        gap: viewType === 'desktop' ? '24px' : '20px',
                        opacity: 1
                    }}
                >
                    {/* Column 1 */}
                    <div className="flex flex-col" style={{ gap: viewType === 'desktop' ? '24px' : (viewType === 'mobile' ? '10px' : '24px') }}>
                        <TestimonialCard review={reviewsData[0] || staticReviews[0]} />
                        <TestimonialCard review={reviewsData[1] || staticReviews[1]} />
                        <TestimonialCard review={reviewsData[2] || staticReviews[2]} />
                    </div>

                    {/* Column 2 */}
                    <div className={`${viewType === 'mobile' ? 'hidden' : 'flex'} flex-col`} style={{ gap: viewType === 'desktop' ? '24px' : '20px' }}>
                        <TestimonialCard review={reviewsData[3] || staticReviews[3]} />
                        <TestimonialCard review={reviewsData[4] || staticReviews[4]} />
                        <TestimonialCard review={reviewsData[5] || staticReviews[5]} />
                    </div>

                    {/* Column 3 - Desktop Only */}
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
                            width: '163px',
                            height: '35px',
                            backgroundColor: 'hsla(212, 100%, 50%, 1)',
                            color: '#FFFFFF',
                            fontFamily: "'Mona Sans', sans-serif",
                            fontSize: "14px",
                            fontWeight: 500,
                            letterSpacing: "0.01em",
                            lineHeight: "35px"
                        }}
                    >
                        Read All Reviews
                    </Link>
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
