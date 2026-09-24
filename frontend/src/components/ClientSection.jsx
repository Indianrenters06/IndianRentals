"use client";
import React, { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import Link from "next/link";
import "swiper/css";
import "swiper/css/pagination";
import { API } from '@/services/apiConfig';

const isExternal = (href) => /^(https?:)?\/\//i.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");

const ClientSection = () => {
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const [clientSwiper, setClientSwiper] = useState(null);
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

    // Offers are stored under the legacy `clientLogos` key. Older entries are a
    // plain image URL string; newer ones are { image, link }.
    const rawOffers = (cms?.clientLogos || [])
        .map(o => (typeof o === "string" ? { image: o, link: "" } : { image: o?.image || "", link: o?.link || "" }))
        .filter(o => o.image);

    // No offers added yet — hide the section
    if (rawOffers.length === 0) return null;

    // Swiper loop needs enough slides to fill the viewport.
    // Duplicate offers until we have at least 6 so loop always works.
    const MIN_SLIDES = 6;
    const clients = rawOffers.length < MIN_SLIDES
        ? Array.from({ length: MIN_SLIDES }, (_, i) => ({ ...rawOffers[i % rawOffers.length], id: i }))
        : rawOffers.map((o, i) => ({ ...o, id: i }));

    return (
        <section className="bg-white">
            <style jsx global>{`
                /* Figma "dot-indicator": 4px #333 dots 8px apart, current = 6px #333 ring */
                .client-pagination .swiper-pagination-bullet {
                    width: 4px;
                    height: 4px;
                    background: #333333;
                    opacity: 1;
                    margin: 0 4px !important;
                    transition: all 0.3s ease;
                }
                .client-pagination .swiper-pagination-bullet-active {
                    opacity: 1;
                    background: transparent;
                    border: 1.2px solid #333333;
                    width: 6px;
                    height: 6px;
                }
            `}</style>
            <div
                className="max-w-[1200px] mx-auto px-4 sm:px-6 xl:px-0 py-12 border-b-[0.7px] border-[#E2E2E2]"
                style={{ height: "auto" }}
            >
                <div className="relative pb-10">
                    <Swiper
                        modules={[Navigation, Autoplay, Pagination]}
                        spaceBetween={20}
                        slidesPerView={2}
                        slidesPerGroup={1}
                        onSwiper={setClientSwiper}
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
                            768: { slidesPerView: 2, spaceBetween: 20 },
                        }}
                    >
                        {clients.map((client) => {
                            const card = (
                                <div
                                    className="flex items-center justify-center select-none overflow-hidden bg-white"
                                    style={{
                                        height: "300px",
                                        borderRadius: "18px"
                                    }}
                                >
                                    {/* Offer banners show in full colour — the greyscale-until-hover
                                        treatment here was a logo-wall convention. */}
                                    <img src={client.image} alt="Offer" className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.02]" />
                                </div>
                            );

                            return (
                                <SwiperSlide key={client.id}>
                                    {!client.link ? card
                                        : isExternal(client.link) ? (
                                            <a href={client.link} target="_blank" rel="noopener noreferrer" className="block">{card}</a>
                                        ) : (
                                            <Link href={client.link} className="block">{card}</Link>
                                        )}
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>

                    {/* Custom Pagination Container */}
                    <div className="client-pagination absolute bottom-0 left-0 right-0 h-5 flex items-center justify-center z-10" />

                    <button
                        className="client-prev group absolute left-0 top-[150px] -translate-y-1/2 -translate-x-[calc(100%+10px)] z-10 w-[26px] h-[40px] rounded-[9px] flex items-center justify-center bg-[#EEEEEE] hover:bg-[#E2E2E2] active:scale-95 transition-all cursor-pointer"
                        style={{ opacity: 1 }}
                        ref={prevRef}
                        onClick={() => clientSwiper?.slidePrev()}
                    >
                        <img src="/icons/chevron-left.svg" alt="" width={24} height={24} />
                    </button>
                    <button
                        className="client-next group absolute right-0 top-[150px] -translate-y-1/2 translate-x-[calc(100%+10px)] z-10 w-[26px] h-[40px] rounded-[9px] flex items-center justify-center bg-[#EEEEEE] hover:bg-[#E2E2E2] active:scale-95 transition-all cursor-pointer"
                        style={{ opacity: 1 }}
                        ref={nextRef}
                        onClick={() => clientSwiper?.slideNext()}
                    >
                        <img src="/icons/chevron-right.svg" alt="" width={24} height={24} />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ClientSection;
