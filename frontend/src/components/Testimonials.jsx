"use client";
import React, { useEffect, useRef } from 'react';
import { FaStar } from 'react-icons/fa';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const GoogleLogo = () => (
    <span className="flex items-center font-bold text-xl leading-none tracking-tight">
        <span className="text-[#4285F4]">G</span>
        <span className="text-[#EA4335]">o</span>
        <span className="text-[#FBBC05]">o</span>
        <span className="text-[#4285F4]">g</span>
        <span className="text-[#34A853]">l</span>
        <span className="text-[#EA4335]">e</span>
    </span>
);

const reviews = [
    {
        id: 1,
        name: "John Doe",
        role: "AI Engineer",
        text: "Lorem ipsum dolor sit amet consectetur. Eget pretium risus odio eu commodo amet pretium. Interdum purus sapien facilisi at senectus tempus nisi nulla. Ultricies condimentum mi ultrices integer.",
        bg: "bg-[#FFF8E1]",
        stars: 5,
    },
    {
        id: 2,
        name: "Sarah Smith",
        role: "Creative Director",
        text: "Amazing service! The equipment was top-notch and the delivery was right on time. Highly recommended for any serious creative professional.",
        bg: "bg-[#E3F2FD]",
        stars: 5,
    },
    {
        id: 3,
        name: "Mike Johnson",
        role: "Photographer",
        text: "I was skeptical at first, but IndianRenters exceeded my expectations. The camera gear was in pristine condition.",
        bg: "bg-[#E8F5E9]",
        stars: 5,
    },
    {
        id: 4,
        name: "Emily Davis",
        role: "Startup Founder",
        text: "Renting laptops for my team was seamless. Saved us a ton of capital upfront. Great support team as well!",
        bg: "bg-[#F3E5F5]",
        stars: 5,
    },
    {
        id: 5,
        name: "David Wilson",
        role: "Freelancer",
        text: "The flexibility of renting for short projects is a game changer. I can take on more work without worrying about equipment costs.",
        bg: "bg-[#FFF3E0]",
        stars: 5,
    },
    {
        id: 6,
        name: "Lisa Anderson",
        role: "Event Planner",
        text: "Used their service for a corporate event. Projectors and screens were perfect. Setup assistance was very helpful.",
        bg: "bg-[#FCE4EC]",
        stars: 4,
    },
];

const Testimonials = () => {
    const wrapperRef = useRef(null);
    const row1Ref = useRef(null);
    const row2Ref = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            const rows = [
                { ref: row1Ref.current, dir: -1 },
                { ref: row2Ref.current, dir: 1 }
            ];

            rows.forEach((row, index) => {
                if (!row.ref) return;

                const content = row.ref;
                const totalWidth = content.scrollWidth;
                const uniqueWidth = totalWidth / 4;

                if (row.dir === 1) {
                    gsap.set(content, { x: -uniqueWidth * 2 });
                } else {
                    gsap.set(content, { x: 0 });
                }

                const tween = gsap.to(content, {
                    x: (row.dir === -1)
                        ? `-=${uniqueWidth}`
                        : `+=${uniqueWidth}`,
                    duration: 30 + (index * 5),
                    ease: "none",
                    repeat: -1,
                });

                ScrollTrigger.create({
                    trigger: wrapperRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    onUpdate: (self) => {
                        let v = self.getVelocity();
                        let timeScale = 1 + Math.abs(v) / 300;
                        gsap.to(tween, {
                            timeScale: timeScale,
                            duration: 0.5,
                            overwrite: true,
                            onComplete: () => gsap.to(tween, { timeScale: 1, duration: 0.5 })
                        });
                    }
                });
            });

        }, wrapperRef);

        return () => ctx.revert();
    }, []);

    const topReviews = reviews.slice(0, 3);
    const bottomReviews = reviews.slice(3, 6);
    const row1Items = [...topReviews, ...topReviews, ...topReviews, ...topReviews];
    const row2Items = [...bottomReviews, ...bottomReviews, ...bottomReviews, ...bottomReviews];

    const ReviewCard = ({ review }) => (
        <div
            className={`${review.bg} w-[250px] md:w-[400px] shrink-0 rounded-[2rem] p-6 lg:p-7 flex flex-col h-[230px] transition-all hover:-translate-y-1 hover:shadow-lg duration-300 select-none mr-6`}
        >
            <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 leading-none mb-1">{review.name}</h3>
                <p className="text-sm font-medium text-gray-500">{review.role}</p>
            </div>

            <p className="text-[#333] text-[15px] leading-[1.6] mb-4 grow font-medium line-clamp-4">
                {review.text}
            </p>

            <div className="flex items-end justify-between mt-auto">
                <div className="translate-y-1">
                    <GoogleLogo />
                </div>
                <div className="flex text-[#F4B400] gap-0.5 text-lg">
                    {[...Array(5)].map((_, j) => (
                        <FaStar key={j} className={j < review.stars ? "text-[#FAB005]" : "text-gray-300"} />
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <section ref={wrapperRef} className="py-10 md:py-20 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2 md:space-y-4 max-w-2xl">
                        <h2 className="text-2xl md:text-5xl font-bold text-gray-900 tracking-tight">
                            What Our <span className="text-[#0A99FF]">Customers</span> Say
                        </h2>
                        <p className="text-gray-600 text-sm md:text-lg">
                            Real experiences from innovators, businesses, and creators powering their ambitions with IndianRenters.
                        </p>
                    </div>

                    {/* Google Reviews Badge - desktop only */}
                    <div className="hidden md:flex items-center gap-4 bg-white border border-gray-100 px-6 py-3 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <GoogleLogo />
                        <div className="flex flex-col border-l border-gray-200 pl-4">
                            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">5000+ reviews</span>
                            <div className="flex items-center gap-2">
                                <div className="flex text-[#F4B400] text-sm">
                                    <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                                </div>
                                <span className="text-gray-900 font-bold text-sm">4.9</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop: Horizontal Marquee Rows */}
            <div className="relative w-full space-y-8 pb-8 hidden lg:block">
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-white to-transparent z-20 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-white to-transparent z-20 pointer-events-none"></div>

                <div className="w-full overflow-hidden">
                    <div ref={row1Ref} className="flex w-max pl-4">
                        {row1Items.map((review, i) => (
                            <ReviewCard key={`r1-${i}`} review={review} />
                        ))}
                    </div>
                </div>

                <div className="w-full overflow-hidden">
                    <div ref={row2Ref} className="flex w-max pl-4">
                        {row2Items.map((review, i) => (
                            <ReviewCard key={`r2-${i}`} review={review} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile: Horizontal scroll snap carousel - shows 1.5 cards */}
            <div className="lg:hidden px-4 mb-6">
                <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-3 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className={`${review.bg} min-w-[75vw] max-w-[75vw] snap-start rounded-3xl p-5 flex flex-col min-h-[200px] shadow-sm shrink-0`}
                        >
                            <div className="mb-3">
                                <h3 className="text-base font-bold text-gray-900 leading-none mb-0.5">{review.name}</h3>
                                <p className="text-xs font-medium text-gray-500">{review.role}</p>
                            </div>

                            <p className="text-[#333] text-xs leading-[1.6] mb-4 grow font-medium line-clamp-5">
                                {review.text}
                            </p>

                            <div className="flex items-end justify-between mt-auto">
                                <GoogleLogo />
                                <div className="flex text-[#FAB005] gap-0.5 text-base">
                                    {[...Array(5)].map((_, j) => (
                                        <FaStar key={j} className={j < review.stars ? "text-[#FAB005]" : "text-gray-300"} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Read All Reviews Button */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30 pt-2">
                <div className="flex justify-center">
                    <button className="px-8 py-3 md:px-10 md:py-4 bg-[#007AFF] text-white font-bold rounded-full hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-200 hover:-translate-y-1 text-sm md:text-base">
                        Read All Reviews
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
