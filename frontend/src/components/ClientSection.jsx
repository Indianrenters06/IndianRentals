"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, A11y } from "swiper/modules";
import Link from "next/link";
import "swiper/css";
import { SwiperControls } from "./CarouselControls";
import { API } from '@/services/apiConfig';

const isExternal = (href) => /^(https?:)?\/\//i.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");

const ClientSection = () => {
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
        .map(o => (typeof o === "string" ? { image: o, link: "", altText: "" } : { image: o?.image || "", link: o?.link || "", altText: o?.altText || "" }))
        .filter(o => o.image);

    // No offers added yet — hide the section
    if (rawOffers.length === 0) return null;

    const clients = rawOffers.map((o, i) => ({ ...o, id: i }));

    return (
        <section className="bg-white">
            <div
                className="max-w-[1200px] mx-auto px-5 sm:px-6 xl:px-0 py-8 lg:py-12 border-b-[0.7px] border-[#E2E2E2]"
                style={{ height: "auto" }}
            >
                <div className="relative pb-10">
                    <Swiper
                        modules={[Autoplay, A11y]}
                        spaceBetween={20}
                        slidesPerView={2}
                        slidesPerGroup={1}
                        onSwiper={setClientSwiper}
                        autoplay={clients.length > 1 ? {
                            delay: 4000,
                            disableOnInteraction: true,
                            pauseOnMouseEnter: true,
                        } : false}
                        loop={clients.length >= 3}
                        breakpoints={{
                            0: { slidesPerView: 1.15, spaceBetween: 12 },
                            768: { slidesPerView: 2, spaceBetween: 20 },
                        }}
                    >
                        {clients.map((client) => {
                            const card = (
                                <div
                                    className="flex items-center justify-center select-none overflow-hidden bg-[#FFCF46] h-[190px] lg:h-[300px]"
                                    style={{
                                        borderRadius: "18px"
                                    }}
                                >
                                    {/* Offer banners show in full colour — the greyscale-until-hover
                                        treatment here was a logo-wall convention. */}
                                    <img src={client.image} alt={client.altText || `Offer ${client.id + 1}`} className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.02]" />
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

                    <SwiperControls swiper={clientSwiper} count={clients.length} label="Offers" variant="offers" autoplay />
                </div>
            </div>
        </section>
    );
};

export default ClientSection;
