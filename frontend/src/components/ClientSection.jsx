"use client";
import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import "swiper/css";

// Placeholder client logos — replace with real logos/images as needed
const clients = [
    {
        id: 1,
        name: "TechCorp India",
        logo: null,
        bg: "bg-[#F5F5F7]",
    },
    {
        id: 2,
        name: "StartupHub",
        logo: null,
        bg: "bg-[#F5F5F7]",
    },
    {
        id: 3,
        name: "CreativeStudio",
        logo: null,
        bg: "bg-[#F5F5F7]",
    },
    {
        id: 4,
        name: "MediaWorks",
        logo: null,
        bg: "bg-[#F5F5F7]",
    },
    {
        id: 5,
        name: "InnovateLab",
        logo: null,
        bg: "bg-[#F5F5F7]",
    },
    {
        id: 6,
        name: "BuildSpace",
        logo: null,
        bg: "bg-[#F5F5F7]",
    },
];

const ClientSection = () => {
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    return (
        <section className="py-12 md:py-16 bg-white">
            <div
                className="mx-auto px-4 sm:px-6"
                style={{ maxWidth: "1200px" }}
            >
                {/* Swiper carousel — 2 slides visible, gap 20px */}
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
                                    {client.logo ? (
                                        <img
                                            src={client.logo}
                                            alt={client.name}
                                            className="max-h-24 max-w-[60%] object-contain opacity-60 hover:opacity-90 transition-opacity duration-300"
                                        />
                                    ) : (
                                        <span className="text-[#999] font-manrope font-semibold text-xl tracking-wide">
                                            {client.name}
                                        </span>
                                    )}
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Prev arrow — hidden, just for structure */}
                    <button
                        className="client-prev hidden"
                        aria-label="Previous client"
                        ref={prevRef}
                    >
                        <FaChevronLeft />
                    </button>

                    {/* Next arrow — positioned right edge center */}
                    <button
                        className="client-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center hover:shadow-lg hover:border-gray-300 transition-all group"
                        aria-label="Next client"
                        ref={nextRef}
                    >
                        <FaChevronRight size={13} className="text-gray-400 group-hover:text-gray-800 transition-colors" />
                    </button>
                </div>
            </div>

            <style>{`
                .client-next.swiper-button-disabled,
                .client-prev.swiper-button-disabled {
                    opacity: 0.3;
                    pointer-events: none;
                }
            `}</style>
        </section>
    );
};

export default ClientSection;
