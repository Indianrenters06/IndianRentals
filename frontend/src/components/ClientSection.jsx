"use client";
import React, { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import "swiper/css";
import "swiper/css/pagination";
import { API } from '@/services/apiConfig';

const ClientSection = () => {
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const [cms, setCms] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API}/api/cms/homepage?t=${Date.now()}`)
            .then(res => res.ok ? res.json() : null)
            .then(data => { setCms(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return null;

    // Hidden by admin toggle
    if (cms?.clientSectionEnabled === false) return null;

    // No logos uploaded yet — hide the section
    const rawLogos = cms?.clientLogos || [];
    if (rawLogos.length === 0) return null;

    // Swiper loop needs enough slides to fill the viewport.
    // Duplicate logos until we have at least 6 so loop always works.
    const MIN_SLIDES = 6;
    const clients = rawLogos.length < MIN_SLIDES
        ? Array.from({ length: MIN_SLIDES }, (_, i) => ({ id: i, image: rawLogos[i % rawLogos.length] }))
        : rawLogos.map((url, i) => ({ id: i, image: url }));

    return (
        <section className="py-12 bg-white">
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
                                    className="flex items-center justify-center select-none shadow-sm bg-white"
                                    style={{
                                        height: "280px",
                                        borderRadius: "24px",
                                        border: "1px solid hsla(0, 0%, 93%, 1)",
                                        padding: "32px"
                                    }}
                                >
                                    <img src={client.image} alt="Client Logo" className="w-full h-full object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Custom Pagination Container */}
                    <div className="client-pagination absolute bottom-0 left-0 right-0 flex justify-center z-10" />

                    <button
                        className="client-prev group absolute left-0 top-[140px] -translate-y-1/2 -translate-x-[calc(100%+12px)] z-10 w-[26px] h-[40px] rounded-[9px] flex items-center justify-center bg-[hsla(0,0%,93%,1)] hover:bg-[hsla(0,0%,85%,1)] hover:scale-110 active:scale-95 shadow-sm hover:shadow-md transition-all"
                        style={{ opacity: 1 }}
                        ref={prevRef}
                    >
                        <ChevronLeftIcon className="w-5 h-5 text-gray-800 group-hover:text-gray-900 transition-colors duration-200" />
                    </button>
                    <button
                        className="client-next group absolute right-0 top-[140px] -translate-y-1/2 translate-x-[calc(100%+12px)] z-10 w-[26px] h-[40px] rounded-[9px] flex items-center justify-center bg-[hsla(0,0%,93%,1)] hover:bg-[hsla(0,0%,85%,1)] hover:scale-110 active:scale-95 shadow-sm hover:shadow-md transition-all"
                        style={{ opacity: 1 }}
                        ref={nextRef}
                    >
                        <ChevronRightIcon className="w-5 h-5 text-gray-800 group-hover:text-gray-900 transition-colors duration-200" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ClientSection;
