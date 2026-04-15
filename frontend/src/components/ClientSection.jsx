"use client";
import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import "swiper/css";
import "swiper/css/pagination";

// Placeholder client logos — replace with real logos/images as needed
const clients = [
    { id: 1, name: "Reliance", logo: "RELIANCE" },
    { id: 2, name: "Tata", logo: "TATA" },
    { id: 3, name: "Adani", logo: "ADANI" },
    { id: 4, name: "Mahindra", logo: "MAHINDRA" },
    { id: 5, name: "Infosys", logo: "INFOSYS" },
    { id: 6, name: "Wipro", logo: "WIPRO" },
];

const ClientSection = () => {
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    return (
        <section className="py-24 bg-white">
            <style jsx global>{`
                .client-pagination .swiper-pagination-bullet {
                    width: 7px;
                    height: 7px;
                    background: #1D1D1F;
                    opacity: 0.3;
                    margin: 0 4px !important;
                    transition: all 0.3s ease;
                }
                .client-pagination .swiper-pagination-bullet-active {
                    opacity: 1;
                    background: transparent;
                    border: 1.5px solid #1D1D1F;
                    width: 7px;
                    height: 7px;
                }
            `}</style>
            <div
                className="max-w-[1200px] mx-auto px-4 sm:px-6"
                style={{ height: "auto" }}
            >
                <div className="relative pb-16">
                    <Swiper
                        modules={[Navigation, Autoplay, Pagination]}
                        spaceBetween={20}
                        slidesPerView={2}
                        slidesPerGroup={1}
                        navigation={{
                            nextEl: ".client-next",
                            prevEl: ".client-prev",
                        }}
                        pagination={{
                            clickable: true,
                            el: ".client-pagination"
                        }}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                        }}
                        loop={true}
                        breakpoints={{
                            0: { slidesPerView: 1.2, spaceBetween: 16 },
                            768: { slidesPerView: 2, spaceBetween: 32 },
                        }}
                    >
                        {clients.map((client) => (
                            <SwiperSlide key={client.id}>
                                <div
                                    className="flex items-center justify-center select-none transition-all hover:scale-[1.01] duration-300 shadow-sm"
                                    style={{ 
                                        height: "280px",
                                        borderRadius: "24px",
                                        background: "hsla(44, 100%, 64%, 1)",
                                        opacity: 1
                                    }}
                                >
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-black/10 flex items-center justify-center text-black font-black text-2xl border border-black/5">
                                            {client.logo[0]}
                                        </div>
                                        <span className="text-black font-sans font-extrabold text-[28px] tracking-tight">
                                            {client.name}
                                        </span>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Custom Pagination Container */}
                    <div className="client-pagination absolute bottom-0 left-0 right-0 flex justify-center z-10" />

                    <button
                        className="client-prev group absolute left-0 top-[140px] -translate-y-1/2 -translate-x-[calc(100%+12px)] z-10 w-[26px] h-[40px] rounded-[9px] flex items-center justify-center bg-[hsla(0,0%,93%,1)] hover:bg-[hsla(0,0%,20%,1)] hover:scale-110 active:scale-95 shadow-sm hover:shadow-md transition-all"
                        style={{ opacity: 1 }}
                        ref={prevRef}
                    >
                        <ChevronLeftIcon className="w-5 h-5 text-gray-800 group-hover:text-white transition-colors duration-200" />
                    </button>
                    <button
                        className="client-next group absolute right-0 top-[140px] -translate-y-1/2 translate-x-[calc(100%+12px)] z-10 w-[26px] h-[40px] rounded-[9px] flex items-center justify-center bg-[hsla(0,0%,93%,1)] hover:bg-[hsla(0,0%,20%,1)] hover:scale-110 active:scale-95 shadow-sm hover:shadow-md transition-all"
                        style={{ opacity: 1 }}
                        ref={nextRef}
                    >
                        <ChevronRightIcon className="w-5 h-5 text-gray-800 group-hover:text-white transition-colors duration-200" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ClientSection;
