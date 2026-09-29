"use client";
import { cmsUrl } from '@/lib/cmsPreview';
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, A11y } from "swiper/modules";
import Link from "next/link";
import "swiper/css";
import { SwiperControls } from "./CarouselControls";
import { ArrowUpRight } from '@phosphor-icons/react';
import { resolveOfferCampaign } from '@/lib/offerCampaigns';

const isExternal = (href) => /^(https?:)?\/\//i.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");
const safeLink = (href) => /^(https?:\/\/|\/(?!\/)|mailto:|tel:)/i.test(href) ? href : '';

const ClientSection = () => {
    const [clientSwiper, setClientSwiper] = useState(null);
    const [cms, setCms] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(cmsUrl('homepage'))
            .then(res => res.ok ? res.json() : null)
            .then(data => { setCms(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return null;

    // Hidden by admin toggle
    if (cms?.clientSectionEnabled === false) return null;

    // Offers are stored under the legacy `clientLogos` key. Older entries are a
    // plain image URL string; newer ones contain the campaign copy as well.
    const rawOffers = (cms?.clientLogos || [])
        .map(o => resolveOfferCampaign(typeof o === "string"
            ? { image: o, link: "", altText: "" }
            : { image: o?.image || "", link: o?.link || "", altText: o?.altText || "", title: o?.title || "", subtitle: o?.subtitle || "", ctaText: o?.ctaText || "" }))
        .filter(o => o.image);

    // No offers added yet — hide the section
    if (rawOffers.length === 0) return null;

    const clients = rawOffers.map((o, i) => ({ ...o, link: safeLink(o.link), id: i }));

    return (
        <section className="bg-white">
            <div
                className="max-w-[1200px] mx-auto px-5 sm:px-6 xl:px-0 py-8 lg:py-12 border-b-[0.7px] border-[#E2E2E2]"
                style={{ height: "auto" }}
            >
                <div className="relative pb-14">
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
                                <div className="group relative select-none overflow-hidden rounded-[18px] bg-[#141414] h-[210px] sm:h-[240px] lg:h-[300px]">
                                    <img src={client.image} alt={client.title ? '' : (client.altText || `Offer ${client.id + 1}`)} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.025] motion-reduce:transition-none" />
                                    {client.title && <>
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/85 via-[#141414]/35 to-transparent" aria-hidden="true" />
                                        <div className="relative z-10 flex h-full max-w-[63%] flex-col justify-center px-5 py-5 sm:px-7 lg:px-9 text-white">
                                            <h3 className="text-[23px] leading-[1.04] sm:text-[27px] lg:text-[34px] font-semibold tracking-[-0.045em]">{client.title}</h3>
                                            {client.subtitle && <p className="mt-2 text-[12px] leading-[1.35] sm:text-[14px] lg:text-[15px] text-white/85">{client.subtitle}</p>}
                                            {client.link && <span className="mt-4 inline-flex w-fit items-center gap-1.5 border-b border-[#ffcf46] pb-1 text-[12px] sm:text-[13px] font-semibold text-[#ffcf46]">{client.ctaText || 'Explore rentals'} <ArrowUpRight size={16} aria-hidden="true" /></span>}
                                        </div>
                                    </>}
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

                    <SwiperControls swiper={clientSwiper} count={clients.length} label="Offers" variant="campaign" autoplay />
                </div>
            </div>
        </section>
    );
};

export default ClientSection;
