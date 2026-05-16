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

            {/* ── 1. Banner ─────────────────────────────────────────────────── */}
            <section className="w-full max-w-[1440px] mx-auto mt-8 mb-16">
                <div className="max-w-[1200px] mx-auto px-4 md:px-8">
                    <div className="w-full h-[500px] relative bg-gray-200 overflow-hidden rounded-3xl">
                        <Image src={c.bannerImage} alt={c.bannerTitle} fill className="object-cover object-center" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <h1 className="text-white text-4xl md:text-6xl font-semibold drop-shadow-lg font-sans">
                                {c.bannerTitle}
                            </h1>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 2. Our Story ──────────────────────────────────────────────── */}
            <section className="w-full max-w-[1440px] mx-auto mb-24">
                <div className="max-w-[1200px] mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-[57px] items-center">
                    {/* Left */}
                    <div className="flex flex-col gap-[27px]">
                        <h2 className="text-4xl md:text-5xl font-semibold leading-tight font-sans text-gray-900">
                            {c.aboutStoryTitle}
                        </h2>
                        <div className="text-gray-900 font-sans font-normal flex flex-col gap-6">
                            <p className="leading-relaxed text-[16px]">{c.aboutStoryPara1}</p>
                            <p className="leading-relaxed text-[16px]">{c.aboutStoryPara2}</p>
                        </div>
                        {/* Stats */}
                        <div className="flex flex-wrap gap-8 md:gap-12 mt-4">
                            {[
                                { value: c.aboutStat1Value, label: c.aboutStat1Label, Icon: PiGauge },
                                { value: c.aboutStat2Value, label: c.aboutStat2Label, Icon: PiSmiley },
                            ].map(({ value, label, Icon }) => (
                                <div key={label} className="flex flex-col">
                                    <div className="w-[76px] h-[76px] bg-[#FF8A00] rounded-xl flex items-center justify-center text-white mb-3 shadow-sm">
                                        <Icon size={50} />
                                    </div>
                                    <h3 className="text-3xl font-bold font-sans text-gray-900">{value}</h3>
                                    <p className="text-sm font-medium text-gray-500 font-sans mt-1">{label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Right Image */}
                    <div className="relative w-full aspect-[581/625] max-h-[625px] rounded-3xl overflow-hidden bg-gray-100 shadow-sm">
                        <Image src={c.aboutStoryImage} alt={c.aboutStoryTitle} fill className="object-cover object-center" />
                    </div>
                </div>
            </section>

            {/* ── 3. Vision / Mission Tabs ──────────────────────────────────── */}
            <section className="w-full max-w-[1440px] mx-auto mb-24">
                <div className="max-w-[1200px] mx-auto px-4 md:px-8">
                    <div className="w-full bg-[#FDE68A] rounded-3xl pt-10 pb-14 px-10 flex flex-col lg:flex-row gap-12 items-start">
                        {/* Tab Buttons */}
                        <div className="flex gap-4 w-full lg:w-[350px] shrink-0">
                            {[
                                { key: 'vision',  label: c.aboutVisionTabLabel },
                                { key: 'mission', label: c.aboutMissionTabLabel },
                            ].map(({ key, label }) => (
                                <button key={key} onClick={() => setActiveTab(key)}
                                    className={`h-[45px] px-8 rounded-full font-medium font-sans text-lg transition-all hover:scale-[1.02] active:scale-95 ${activeTab === key ? 'bg-black text-white shadow-lg' : 'border-2 border-black/10 text-gray-800 hover:bg-black/5'}`}>
                                    {label}
                                </button>
                            ))}
                        </div>
                        {/* Content Items */}
                        <div className="flex-1 flex flex-col gap-8">
                            {activeItems.map(({ title, text }, i) => (
                                <div key={i} className={`flex flex-col md:flex-row items-start gap-4 ${i < activeItems.length - 1 ? 'border-b border-black/10 pb-6' : ''}`}>
                                    <h3 className="text-[20px] font-bold text-gray-900 font-sans md:w-[220px] shrink-0">{title}</h3>
                                    <p className="text-gray-800 font-sans leading-relaxed text-[15px]">{text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 4. Why Choose Us ──────────────────────────────────────────── */}
            <WhyChooseUs cmsData={c} />

            {/* ── 5. FAQ ────────────────────────────────────────────────────── */}
            <FaqSection pageName="about" />

            {/* ── 6. Best Rented Products ───────────────────────────────────── */}
            <BestRentedProducts />
        </div>
    );
}
