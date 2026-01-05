"use client";
import React from 'react';
import { FaStar } from 'react-icons/fa';

const GoogleLogo = () => (
    <span className="flex items-center font-bold text-xl font-product-sans leading-none tracking-tight">
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
        bg: "bg-[#FFF8E1]", // Lighter Yellow
        stars: 5,
    },
    {
        id: 2,
        name: "John Doe",
        role: "AI Engineer",
        text: "Lorem ipsum dolor sit amet consectetur. Eget pretium risus odio eu commodo amet pretium. Interdum purus sapien facilisi at senectus tempus nisi nulla. Ultricies condimentum mi ultrices integer.",
        bg: "bg-[#E3F2FD]", // Lighter Blue
        stars: 5,
    },
    {
        id: 3,
        name: "John Doe",
        role: "AI Engineer",
        text: "Lorem ipsum dolor sit amet consectetur. Eget pretium risus odio eu commodo amet pretium. Interdum purus sapien facilisi at senectus tempus nisi nulla. Ultricies condimentum mi ultrices integer.",
        bg: "bg-[#E8F5E9]", // Lighter Green
        stars: 5,
    },
    {
        id: 4,
        name: "John Doe",
        role: "AI Engineer",
        text: "Lorem ipsum dolor sit amet consectetur. Eget pretium risus odio eu commodo amet pretium. Interdum purus sapien facilisi at senectus tempus nisi nulla. Ultricies condimentum mi ultrices integer.",
        bg: "bg-[#F3E5F5]", // Lighter Purple
        stars: 5,
    },
    {
        id: 5,
        name: "John Doe",
        role: "AI Engineer",
        text: "Lorem ipsum dolor sit amet consectetur. Eget pretium risus odio eu commodo amet pretium. Interdum purus sapien facilisi at senectus tempus nisi nulla. Ultricies condimentum mi ultrices integer.",
        bg: "bg-[#FFF3E0]", // Lighter Orange
        stars: 5,
    },
    {
        id: 6,
        name: "John Doe",
        role: "AI Engineer",
        text: "Lorem ipsum dolor sit amet consectetur. Eget pretium risus odio eu commodo amet pretium. Interdum purus sapien facilisi at senectus tempus nisi nulla. Ultricies condimentum mi ultrices integer.",
        bg: "bg-[#FCE4EC]", // Lighter Pink
        stars: 4,
    },
];

const Testimonials = () => {
    return (
        <section className="py-20 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="space-y-4 max-w-2xl">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                            What Our <span className="text-[#0A99FF]">Customers</span> Say
                        </h2>
                        <p className="text-gray-600 text-lg">
                            Real experiences from innovators, businesses, and creators powering their ambitions with IndianRenters.
                        </p>
                    </div>

                    {/* Google Reviews Badge */}
                    <div className="flex items-center gap-4 bg-white border border-gray-100 px-6 py-3 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
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

                {/* Reviews Grid */}
                <div className="relative -mx-4 sm:-mx-0">

                    {/* Gradient Fades for Visual Flair */}
                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-white via-white/80 to-transparent z-20 pointer-events-none hidden md:block"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-white via-white/80 to-transparent z-20 pointer-events-none hidden md:block"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16 px-4 sm:px-0">
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className={`${review.bg} rounded-[2rem] p-6 lg:p-7 flex flex-col h-full transition-all hover:-translate-y-1 hover:shadow-lg duration-300`}
                            >
                                <div className="mb-4">
                                    <h3 className="text-lg font-bold text-gray-900 leading-none mb-1">{review.name}</h3>
                                    <p className="text-sm font-medium text-gray-500">{review.role}</p>
                                </div>

                                <p className="text-[#333] text-[15px] leading-[1.6] mb-8 grow font-medium">
                                    {review.text}
                                </p>

                                <div className="flex items-end justify-between mt-auto">
                                    <div className="translate-y-1">
                                        <GoogleLogo />
                                    </div>
                                    <div className="flex text-[#F4B400] gap-0.5 text-lg">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar key={i} className={i < review.stars ? "text-[#FAB005]" : "text-gray-300"} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Read All Reviews Button */}
                <div className="flex justify-center pt-4">
                    <button className="px-10 py-4 bg-[#007AFF] text-white font-bold rounded-full hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-200 hover:-translate-y-1">
                        Read All Reviews
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
