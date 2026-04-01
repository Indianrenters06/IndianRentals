"use client";
import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { CaretRight, CaretLeft } from "@phosphor-icons/react";
import "swiper/css";

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
        <section className="py-20 bg-white">
            <div
                className="max-w-[1200px] mx-auto px-4 sm:px-6"
                style={{ height: "300px" }}
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
                                    className="flex items-center justify-center select-none transition-all hover:scale-[1.02] duration-300 shadow-sm hover:shadow-md"
                                    style={{ 
                                        height: "300px",
                                        borderRadius: "18px",
                                        background: "hsla(44, 100%, 64%, 1)",
                                        opacity: 1
                                    }}
                                >
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-20 h-20 rounded-full bg-black/10 flex items-center justify-center text-black font-black text-3xl border border-black/5">
                                            {client.logo[0]}
                                        </div>
                                        <span className="text-black font-manrope font-bold text-[32px] tracking-tight">
                                            {client.name}
                                        </span>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <button
                        className="client-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center hover:shadow-lg hover:border-gray-300 transition-all"
                        ref={prevRef}
                    >
                        <CaretLeft size={20} weight="regular" className="text-gray-800" />
                    </button>
                    <button
                        className="client-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center hover:shadow-lg hover:border-gray-300 transition-all"
                        ref={nextRef}
                    >
                        <CaretRight size={20} weight="regular" className="text-gray-800" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ClientSection;
