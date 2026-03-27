"use client";
import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import "swiper/css";

// Placeholder client logos — replace with real logos/images as needed
const clients = [
    { id: 1, name: "TechCorp India", logo: null, bg: "bg-[#F5F5F7]" },
    { id: 2, name: "StartupHub", logo: null, bg: "bg-[#F5F5F7]" },
    { id: 3, name: "CreativeStudio", logo: null, bg: "bg-[#F5F5F7]" },
    { id: 4, name: "MediaWorks", logo: null, bg: "bg-[#F5F5F7]" },
    { id: 5, name: "InnovateLab", logo: null, bg: "bg-[#F5F5F7]" },
    { id: 6, name: "BuildSpace", logo: null, bg: "bg-[#F5F5F7]" },
];

const ClientSection = () => {
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    return (
        <section className="py-12 md:py-16 bg-white overflow-hidden">
            <div
                className="max-w-[1200px] mx-auto px-4 sm:px-6"
            >
                <div className="relative">
                    <Swiper
                        modules={[Navigation, Autoplay]}
                        spaceBetween={20}
                        slidesPerView={2}
                        slidesPerGroup={1}
                        navigation={{
                            nextEl: ".client-next",
                            prevEl: ".client-prev",
                        }}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                        }}
                        loop={true}
                        breakpoints={{
                            0: { slidesPerView: 1, spaceBetween: 16 },
                            768: { slidesPerView: 2, spaceBetween: 20 },
                        }}
                    >
                        {clients.map((client) => (
                            <SwiperSlide key={client.id}>
                                <div
                                    className={`${client.bg} rounded-3xl flex items-center justify-center select-none`}
                                    style={{ height: "300px" }}
                                >
                                    <span className="text-[#999] font-manrope font-semibold text-xl tracking-wide">
                                        {client.name}
                                    </span>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <button className="client-prev hidden" ref={prevRef}><FaChevronLeft /></button>
                    <button
                        className="client-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center hover:shadow-lg hover:border-gray-300 transition-all group"
                        ref={nextRef}
                    >
                        <FaChevronRight size={13} className="text-gray-400 group-hover:text-gray-800 transition-colors" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ClientSection;
