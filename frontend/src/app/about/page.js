'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { PiGauge, PiSmiley } from 'react-icons/pi';
import BestRentedProducts from '../../components/BestRentedProducts';
import FaqSection from '../../components/FaqSection';
import WhyChooseUs from '../../components/WhyChooseUs';
import { API } from '@/services/apiConfig';

// ── Defaults (exact same content currently hardcoded) ─────────────────────────
const D = {
    bannerImage: 'https://res.cloudinary.com/dgkckcdk8/image/upload/v1776716131/e92cf0b55a28cc573a6ad7b73d746dd47431bb2e_1_jlph2i.png',
    bannerTitle: 'About Us',
    aboutStoryTitle: 'Our Story',
    aboutStoryPara1: "From a small computer training room in 1992 to India's go-to rental partner, this journey has been about making access smarter than ownership. The promise stays simple: rent anything needed, when it's needed, anywhere it's needed—without friction.",
    aboutStoryPara2: "Today, a 100+ product catalog powers startups, enterprises, and events across major cities, backed by fast delivery, clean gear, and dependable support. The focus is outcomes — setups that just work, terms that fit, and service that shows up.",
    aboutStoryImage: 'https://res.cloudinary.com/dgkckcdk8/image/upload/v1769946716/indian-rentals/fj8ptqbhppbstdd0hs4i.png',
    aboutStat1Value: '4.8/5.0', aboutStat1Label: 'Customer Satisfaction',
    aboutStat2Value: '10,000+', aboutStat2Label: 'Happy Clients',
    aboutVisionTabLabel: 'Our Vision',
    aboutVision1Title: 'Rent Anything', aboutVision1Text: "Laptops, Macs, mobiles, AV, cameras, medical and more—if it's not listed, it's sourced on request.",
    aboutVision2Title: 'Rent Anytime',  aboutVision2Text: 'Tenures that fit the job: 1, 3, 6, or 12 months, with easy extensions and mid-term upgrades.',
    aboutVision3Title: 'Rent Anywhere', aboutVision3Text: 'Rapid delivery and support across major Indian cities through a reliable partner network.',
    aboutMissionTabLabel: 'Our Mission',
    aboutMission1Title: 'Awesome Service',  aboutMission1Text: "Laptops, Macs, mobiles, AV, cameras, medical and more—if it's not listed, it's sourced on request.",
    aboutMission2Title: 'Awesome Quality',  aboutMission2Text: 'Tenures that fit the job: 1, 3, 6, or 12 months, with easy extensions and mid-term upgrades.',
    aboutMission3Title: 'Happy Customers',  aboutMission3Text: 'Rapid delivery and support across major Indian cities through a reliable partner network.',
    aboutWhyTitle: 'Why Choose Us?',
    aboutWhyText: "Join thousands who've switched to the flexible, affordable way to access high-end tech. IndianRenters delivers AI-ready workstations, laptops, and IT gear with zero ownership hassle and instant support.",
    aboutWhyImage: 'https://res.cloudinary.com/dgkckcdk8/image/upload/v1769961565/indian-rentals/anmpufdlxxxblkxqxpds.jpg',
    aboutWhyStat1Value: '90k+', aboutWhyStat1Label: 'Devices in Stock',
    aboutWhyStat2Value: '30k+', aboutWhyStat2Label: 'Happy Customers',
    aboutWhyStat3Value: '401+', aboutWhyStat3Label: 'Cities Covered',
};

// Merge CMS data with defaults — CMS values win if non-empty
const merge = (cms) => {
    if (!cms) return D;
    const out = {};
    Object.keys(D).forEach(k => {
        out[k] = (cms[k] !== undefined && cms[k] !== '') ? cms[k] : D[k];
    });
    return out;
};

export default function AboutPage() {
    const [activeTab, setActiveTab] = useState('vision');
    const [c, setC] = useState(D); // c = merged CMS data

    useEffect(() => {
        window.fetch(`${API}/api/cms/about?t=${Date.now()}`)
            .then(r => r.ok ? r.json() : null)
            .then(d => { if (d) setC(merge(d)); })
            .catch(() => { });
    }, []);

    const visionItems = [
        { title: c.aboutVision1Title, text: c.aboutVision1Text },
        { title: c.aboutVision2Title, text: c.aboutVision2Text },
        { title: c.aboutVision3Title, text: c.aboutVision3Text },
    ];
    const missionItems = [
        { title: c.aboutMission1Title, text: c.aboutMission1Text },
        { title: c.aboutMission2Title, text: c.aboutMission2Text },
        { title: c.aboutMission3Title, text: c.aboutMission3Text },
    ];
    const activeItems = activeTab === 'vision' ? visionItems : missionItems;

    return (
        <div className="text-gray-800 pb-20">

            {/* On mobile, the banner + story + vision/mission sit on a continuous
                grey surface (#f6f6f6), matching the Figma mobile design. */}
            <div className="bg-[#f6f6f6] md:bg-transparent lg:bg-white pt-5 md:pt-0 lg:py-[84px]">

                {/* ── 1. Banner ─────────────────────────────────────────────────── */}
                <section className="w-full max-w-[1440px] mx-auto mb-6 md:mt-8 md:mb-16 lg:mt-0 lg:mb-24">
                    <div className="max-w-[1200px] mx-auto px-5 md:px-8 xl:px-0">
                        <div className="w-full h-[197px] md:h-[500px] relative bg-gray-200 overflow-hidden rounded-2xl md:rounded-3xl lg:rounded-[32px]">
                            <Image src={c.bannerImage} alt={c.bannerTitle} fill className="object-cover object-center" />
                            <div className="absolute inset-0 bg-black/25 md:bg-transparent lg:bg-black/25" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <h1 className="text-white text-base md:text-6xl lg:text-[62px] lg:leading-[60px] lg:tracking-[-2px] font-semibold drop-shadow-lg lg:drop-shadow-none font-sans">
                                    {c.bannerTitle}
                                </h1>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── 2. Our Story ──────────────────────────────────────────────── */}
                <section className="w-full max-w-[1440px] mx-auto mb-6 md:mb-24">
                    <div className="max-w-[1200px] mx-auto px-5 md:px-8 xl:px-0 grid grid-cols-1 lg:grid-cols-[1fr_581px] gap-6 lg:gap-[57px] items-center">
                        <div className="flex flex-col gap-3 md:gap-[27px]">
                            <h2
                                className="text-[25px] md:text-[36px] font-semibold leading-[31px] md:leading-[45px] font-sans tracking-[-0.8px] w-full md:w-[492px] max-w-full"
                                style={{
                                    color: 'var(--color-grey-grey-700, #333)',
                                    fontFamily: 'var(--font-family-Mona-Sans, "Mona Sans")',
                                    letterSpacing: 'var(--font-letter-spacing-3, -0.8px)',
                                }}
                            >
                                {c.aboutStoryTitle}
                            </h2>
                            {/* Figma: 16/23 medium, -0.4px, #757575, 17px apart */}
                            <div className="text-gray-600 md:text-gray-900 lg:text-[#757575] font-sans font-normal lg:font-medium flex flex-col gap-4 md:gap-6 lg:gap-[17px]">
                                <p className="leading-relaxed lg:leading-[23px] lg:tracking-[-0.4px] text-xs md:text-[16px]">{c.aboutStoryPara1}</p>
                                <p className="leading-relaxed lg:leading-[23px] lg:tracking-[-0.4px] text-xs md:text-[16px]">{c.aboutStoryPara2}</p>
                            </div>
                            {/* Stats */}
                            <div className="flex flex-wrap gap-12 lg:gap-[110px] mt-2 md:mt-4 lg:mt-0">
                                {[
                                    { value: c.aboutStat1Value, label: c.aboutStat1Label, Icon: PiGauge },
                                    { value: c.aboutStat2Value, label: c.aboutStat2Label, Icon: PiSmiley },
                                ].map(({ value, label, Icon }) => (
                                    // Figma: 76px #FF920A tile (radius 10), then value 27/35 medium black and
                                    // label 12/16 medium #545454 in a 146px column, 6px apart
                                    <div key={label} className="flex flex-col lg:gap-[6px] lg:w-[146px]">
                                        <div className="w-[76px] h-[76px] bg-[#FF8A00] lg:bg-[#FF920A] rounded-[10px] md:rounded-xl lg:rounded-[10px] flex items-center justify-center text-white mb-2 md:mb-3 lg:mb-0 shadow-sm lg:shadow-none">
                                            <Icon size={50} />
                                        </div>
                                        <h3 className="text-xl md:text-3xl lg:text-[27px] lg:leading-[35px] lg:tracking-[-0.8px] font-bold lg:font-medium font-sans text-gray-900 lg:text-black">{value}</h3>
                                        <p className="text-[10px] md:text-sm lg:text-[12px] lg:leading-[16px] lg:tracking-[-0.4px] font-medium text-gray-500 lg:text-[#545454] font-sans mt-1 lg:mt-0">{label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Right Image */}
                        <div className="relative w-full aspect-[581/625] lg:aspect-[581/431] max-h-[625px] lg:max-h-[431px] rounded-2xl md:rounded-3xl lg:rounded-[24px] overflow-hidden bg-gray-100 shadow-sm lg:shadow-none">
                            <Image src={c.aboutStoryImage} alt={c.aboutStoryTitle} fill className="object-cover object-center" />
                        </div>
                    </div>
                </section>

                {/* ── 3. Vision / Mission Tabs ──────────────────────────────────── */}
                <section className="w-full max-w-[1440px] mx-auto mb-10 md:mb-24 lg:mb-0">
                    <div className="max-w-[1200px] mx-auto px-5 md:px-8 xl:px-0">
                        <div className="w-full bg-[#FFE485] md:bg-[#FDE68A] lg:bg-[#FFE485] rounded-2xl md:rounded-3xl lg:rounded-[28px] pt-5 md:pt-10 lg:pt-9 pb-6 md:pb-14 lg:pb-9 px-5 md:px-10 lg:px-7 flex flex-col lg:flex-row gap-7 md:gap-12 lg:gap-24 items-start">
                            {/* Tab Buttons */}
                            <div className="flex gap-3 md:gap-4 lg:gap-5 w-full lg:w-[320px] shrink-0">
                                {[
                                    { key: 'vision',  label: c.aboutVisionTabLabel },
                                    { key: 'mission', label: c.aboutMissionTabLabel },
                                ].map(({ key, label }) => (
                                    <button key={key} onClick={() => setActiveTab(key)}
                                        // Mona Sans must be explicit (font-sans falls back to a wider face),
                                        // and the label must never wrap or the pill squashes.
                                        style={{ fontFamily: "'Mona Sans', sans-serif" }}
                                        className={`h-[36px] md:h-[45px] px-4 md:px-8 lg:px-[30px] whitespace-nowrap shrink-0 inline-flex items-center justify-center rounded-full font-medium lg:font-semibold font-sans text-sm md:text-lg lg:leading-[25px] lg:tracking-[-0.8px] transition-[background-color,color,border-color,transform] hover:scale-[1.02] lg:hover:scale-100 active:scale-95 ${activeTab === key ? 'bg-black lg:bg-[#333333] lg:border lg:border-[#333333] text-white shadow-lg lg:shadow-none' : 'border-2 lg:border border-black/10 lg:border-[#333333] text-gray-800 lg:text-[#333333] hover:bg-black/5'}`}>
                                        {label}
                                    </button>
                                ))}
                            </div>
                            {/* Content Items */}
                            <div className="flex-1 min-w-0 flex flex-col gap-4 md:gap-8 lg:gap-0">
                                {activeItems.map(({ title, text }, i) => (
                                    <div key={i} className={`flex flex-col md:flex-row items-start gap-1 md:gap-4 lg:justify-between lg:gap-6 ${i < activeItems.length - 1 ? 'border-b border-black/10 lg:border-[#545454]/50 pb-4 md:pb-6 lg:pb-5' : ''} ${i > 0 ? 'lg:pt-5' : ''}`}>
                                        <h3 className="text-sm md:text-[20px] lg:text-[21px] lg:leading-[28px] lg:tracking-[-0.8px] font-bold lg:font-semibold text-gray-900 lg:text-[#333333] font-sans md:w-[220px] lg:w-auto shrink-0">{title}</h3>
                                        <p className="text-gray-800 lg:text-[#545454] font-sans leading-relaxed lg:leading-[23px] lg:tracking-[-0.4px] lg:font-medium text-[10px] md:text-[15px] lg:text-[16px] lg:w-[500px] lg:shrink-0">{text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

            </div>

            {/* ── 4. Why Choose Us ──────────────────────────────────────────── */}
            <WhyChooseUs cmsData={c} />

            {/* ── 5. FAQ ────────────────────────────────────────────────────── */}
            <FaqSection pageName="about" />

            {/* ── 6. Best Rented Products ───────────────────────────────────── */}
            <BestRentedProducts />
        </div>
    );
}
