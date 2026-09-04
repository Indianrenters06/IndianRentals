"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Laptop,
    UserFocus,
    ShoppingCart,
    Package,
    CheckCircle,
    CaretRight,
    Dot
} from '@phosphor-icons/react';

import { API } from '../services/apiConfig';

const FIGMA_STEP_ICONS = [
    "https://www.figma.com/api/mcp/asset/38c00429-01b9-40a1-9cde-8fb957737f0a.svg",
    "https://www.figma.com/api/mcp/asset/20761547-612e-482c-88fc-1842f084cab3.svg",
    "https://www.figma.com/api/mcp/asset/d16debc3-42ef-4743-bc5a-f382e6877d4e.svg",
    "https://www.figma.com/api/mcp/asset/3531f122-a21a-49ad-961f-179efdff0d40.svg",
];

const CLOUDINARY_STEP_ICONS = [
    "https://res.cloudinary.com/dgkckcdk8/image/upload/v1780664193/Layer_1_zh0doe.svg",
    "https://res.cloudinary.com/dgkckcdk8/image/upload/v1780664193/Group_hss8ee.svg",
    "https://res.cloudinary.com/dgkckcdk8/image/upload/v1780664191/Layer_1_2_glmfc6.svg",
    "https://res.cloudinary.com/dgkckcdk8/image/upload/v1780664543/Layer_1_3_nxnmvx.svg",
];

const FALLBACK_STEPS = [
    { title: "Choose Your Tech", description: "Browse our curated selection of premium, performance\ntested devices. Use the search or categories to find the\nperfect tool for your needs.", icon: FIGMA_STEP_ICONS[0], highlight: true },
    { title: "Complete KYC", description: "Pick a flexible rental tenure from 1 to 12 months. Then, complete our KYC process online with your basic documents (PAN and Address Proof).", icon: FIGMA_STEP_ICONS[1], highlight: false },
    { title: "Secure Your Order", description: "Confirm your rental and complete the payment online. This includes the first month's rent and a fully refundable security deposit.", icon: FIGMA_STEP_ICONS[2], highlight: false },
    { title: "Receive & Create", description: "We deliver your tech right to your doorstep, typically within 2-3 business days. It arrives fully charged, sanitized, and ready to use straight out of the box. Now, go build something amazing!", icon: FIGMA_STEP_ICONS[3], highlight: false }
];

const ICON_MAP = {
    "Laptop": Laptop,
    "IdentificationCard": UserFocus,
    "ShoppingCart": ShoppingCart,
    "Package": Package,
    "Arrow": CaretRight,
    "Dot": Dot
};

const DynamicIcon = ({ name, index = 0, size = 32, className = "", isActive = false }) => {
    let src = (typeof name === 'string' && name.startsWith('http')) ? name : (FIGMA_STEP_ICONS[index % 4] || CLOUDINARY_STEP_ICONS[index % 4]);

    // Override if generic icon string or missing unique icon
    if (!name || name === 'Laptop' || name === 'CheckCircle') {
        src = FIGMA_STEP_ICONS[index % 4] || CLOUDINARY_STEP_ICONS[index % 4];
    }

    return (
        <div className={className} style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <img
                src={src}
                alt=""
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    filter: isActive ? 'none' : 'grayscale(100%) brightness(0.25)',
                    transition: 'filter 0.3s ease'
                }}
                onError={(e) => {
                    if (CLOUDINARY_STEP_ICONS[index % 4]) {
                        e.currentTarget.src = CLOUDINARY_STEP_ICONS[index % 4];
                    }
                }}
            />
        </div>
    );
};

// Fallback images from the main Cloudinary account (dgkckcdk8)
const STEP_IMAGES = [
    "https://res.cloudinary.com/dgkckcdk8/image/upload/v1769946716/indian-rentals/fj8ptqbhppbstdd0hs4i.png",
    "https://res.cloudinary.com/dgkckcdk8/image/upload/v1769961565/indian-rentals/anmpufdlxxxblkxqxpds.jpg",
    "https://res.cloudinary.com/dgkckcdk8/image/upload/v1769961205/indian-rentals/gfjrzgp5llzcjap30wkt.png",
    "https://res.cloudinary.com/dgkckcdk8/image/upload/v1769946716/indian-rentals/fj8ptqbhppbstdd0hs4i.png",
];

const RentalProcess = ({ cmsData = null }) => {
    const [cms, setCms] = useState({
        enabled: true,
        title: "How It Works",
        subtitle: "Choose, secure, receive, and create with zero hassle. No installation, no configuration, no delay.",
        steps: FALLBACK_STEPS
    });
    const [activeStep, setActiveStep] = useState(0);
    const [viewType, setViewType] = useState('mobile');

    useEffect(() => {
        const checkRes = () => {
            const w = window.innerWidth;
            if (w >= 1024) setViewType('desktop');
            else if (w >= 768) setViewType('tablet');
            else setViewType('mobile');
        };
        checkRes();
        window.addEventListener('resize', checkRes);

        if (cmsData) {
            setCms({
                enabled: cmsData.rentalProcessEnabled !== false,
                title: cmsData.rentalProcessTitle || "How It Works",
                subtitle: cmsData.rentalProcessSubtitle || "Choose, secure, receive, and create with zero hassle. No installation, no configuration, no delay.",
                steps: cmsData.rentalProcessSteps?.length > 0 ? cmsData.rentalProcessSteps : FALLBACK_STEPS
            });
        } else {
            fetch(`${API}/api/cms/homepage`, { cache: 'no-store' })
                .then(r => r.ok ? r.json() : null)
                .then(data => {
                    if (!data) return;
                    setCms({
                        enabled: data.rentalProcessEnabled !== false,
                        title: data.rentalProcessTitle || "How It Works",
                        subtitle: data.rentalProcessSubtitle || "Choose, secure, receive, and create with zero hassle. No installation, no configuration, no delay.",
                        steps: data.rentalProcessSteps?.length > 0 ? data.rentalProcessSteps : FALLBACK_STEPS
                    });
                })
                .catch(console.error);
        }

        return () => window.removeEventListener('resize', checkRes);
    }, [cmsData]);

    // Auto-advance step every 5 seconds
    useEffect(() => {
        if (!cms.enabled || cms.steps.length <= 1) return;
        const interval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % cms.steps.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [cms.enabled, cms.steps.length, activeStep]);

    if (!cms.enabled) return null;

    // ─── TABLET VIEW ────────────────────────────────────────────────────────
    if (viewType === 'tablet') {
        return (
            <section
                style={{
                    width: '100%',
                    minHeight: '647px',
                    background: 'hsla(0, 0%, 96%, 1)',
                    paddingTop: '48px',
                    paddingBottom: '48px',
                    paddingLeft: '30px',
                    paddingRight: '30px',
                    boxSizing: 'border-box'
                }}
            >
                <div style={{ maxWidth: '708px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '380px' }}>
                            <h2 style={{
                                fontFamily: "'Mona Sans', sans-serif",
                                fontSize: '36px',
                                fontWeight: 700,
                                color: 'hsla(0, 0%, 20%, 1)',
                                letterSpacing: '-0.02em',
                                lineHeight: '1.1',
                                margin: 0
                            }}>
                                {cms.title}
                            </h2>
                            <p style={{
                                fontFamily: "'Mona Sans', sans-serif",
                                fontSize: '14px',
                                fontWeight: 400,
                                color: 'rgba(29,29,31,0.7)',
                                lineHeight: '1.4',
                                margin: 0
                            }}>
                                {cms.subtitle}
                            </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0, marginTop: '4px' }}>
                            <Link href="/rental-process" className="btn-secondary text-[13px]" style={{ textDecoration: 'none' }}>
                                Rental Process
                            </Link>
                            <Link href="/contact" className="btn-primary text-[13px]" style={{ textDecoration: 'none' }}>
                                Contact
                            </Link>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        {cms.steps.slice(0, 4).map((step, index) => {
                            const isActive = activeStep === index;
                            return (
                                <div
                                    key={index}
                                    onClick={() => setActiveStep(index)}
                                    className="cursor-pointer transition-all duration-300"
                                    style={{
                                        position: 'relative',
                                        borderRadius: '16px',
                                        paddingTop: '16px',
                                        paddingRight: '15px',
                                        paddingBottom: '16px',
                                        paddingLeft: '15px',
                                        background: isActive
                                            ? 'linear-gradient(125.34deg, rgba(255,207,70,0.5) 1.25%, rgba(255,185,27,0.9) 98.94%)'
                                            : '#FFFFFF',
                                        // Constant width, colour-only change: toggling the border off
                                        // let transition-all animate it back from currentColor (black)
                                        border: isActive ? '1px solid #FFCF46' : '1px solid #EEEEEE',
                                        boxShadow: isActive
                                            ? '-3px -3px 15px -2px hsla(29,100%,44%,0.26) inset'
                                            : '0px 1px 3px 0px rgba(0,0,0,0.04)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        height: '199px'
                                    }}
                                >
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '314px', height: '122px', justifyContent: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <div style={{ color: isActive ? '#6B4B18' : '#1D1D1F', flexShrink: 0, lineHeight: 0 }}>
                                                <DynamicIcon name={step.icon} index={index} size={20} isActive={isActive} />
                                            </div>
                                            <h3 style={{
                                                fontFamily: "'Mona Sans', sans-serif",
                                                fontSize: '18px',
                                                fontWeight: 600,
                                                color: isActive ? 'hsla(19,84%,26%,1)' : '#1D1D1F',
                                                letterSpacing: '-0.01em',
                                                lineHeight: '1.2',
                                                margin: 0
                                            }}>
                                                {step.title}
                                            </h3>
                                        </div>
                                        <p style={{
                                            fontFamily: "'Mona Sans', sans-serif",
                                            fontSize: '15px',
                                            fontWeight: 400,
                                            color: isActive ? 'hsla(19,84%,26%,0.7)' : 'rgba(29,29,31,0.7)',
                                            lineHeight: '1.45',
                                            margin: 0,
                                            width: '314px',
                                            height: '92px'
                                        }}>
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        );
    }

    if (viewType === 'mobile') {
        return (
            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '48px 20px',
                    gap: '20px',
                    width: '100%',
                    background: 'linear-gradient(180deg, #FFFFFF 0%, #FFE485 100%)',
                    boxSizing: 'border-box'
                }}
            >
                {/* Header — Frame 5 > Frame 151 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px', width: '100%', maxWidth: '350px' }}>
                    {/* Title + Subtitle */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '100%' }}>
                        <h2
                            style={{
                                fontFamily: "'Mona Sans', sans-serif",
                                fontWeight: 600,
                                fontSize: '25px',
                                lineHeight: '31px',
                                letterSpacing: '-0.8px',
                                color: '#333333',
                                margin: 0,
                                width: '100%'
                            }}
                        >
                            {cms.title}
                        </h2>
                        <p
                            style={{
                                fontFamily: "'Mona Sans', sans-serif",
                                fontWeight: 500,
                                fontSize: '12px',
                                lineHeight: '18px',
                                letterSpacing: '-0.4px',
                                color: '#545454',
                                margin: 0,
                                width: '100%'
                            }}
                        >
                            {cms.subtitle}
                        </p>
                    </div>

                    {/* CTA Buttons Row */}
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                        {/* Yellow primary button */}
                        <Link
                            href="/rental-process"
                            style={{
                                display: 'inline-flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '4px 12px',
                                gap: '2px',
                                height: '26px',
                                background: '#FFCF46',
                                borderRadius: '28px',
                                fontFamily: "'Mona Sans', sans-serif",
                                fontWeight: 500,
                                fontSize: '12px',
                                lineHeight: '18px',
                                letterSpacing: '-0.4px',
                                color: '#1F1F1F',
                                textDecoration: 'none',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            Rental Process
                        </Link>
                        {/* Dark secondary button */}
                        <Link
                            href="/contact"
                            style={{
                                display: 'inline-flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '4px 12px',
                                gap: '2px',
                                height: '26px',
                                background: '#333333',
                                borderRadius: '28px',
                                fontFamily: "'Mona Sans', sans-serif",
                                fontWeight: 500,
                                fontSize: '12px',
                                lineHeight: '18px',
                                letterSpacing: '-0.4px',
                                color: '#FFFFFF',
                                textDecoration: 'none',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            Contact
                        </Link>
                    </div>
                </div>

                {/* Steps — Frame 531 > Frame 523 */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        padding: '0px 10px',
                        gap: '12px',
                        width: '100%',
                        maxWidth: '350px',
                        boxSizing: 'border-box'
                    }}
                >
                    {cms.steps.slice(0, 4).map((step, index) => {
                        const isHighlight = index === 0;
                        return (
                            <div
                                key={index}
                                onClick={() => setActiveStep(index)}
                                style={{
                                    boxSizing: 'border-box',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-end',
                                    padding: '20px 16px',
                                    width: '100%',
                                    borderRadius: '20px',
                                    background: isHighlight
                                        ? 'linear-gradient(125.34deg, rgba(255, 207, 70, 0.5) 1.25%, rgba(255, 185, 27, 0.9) 98.94%)'
                                        : '#FFFFFF',
                                    boxShadow: isHighlight
                                        ? 'inset -3px -3px 15px -2px rgba(226, 110, 0, 0.26)'
                                        : undefined,
                                    border: isHighlight ? '1.2px solid #FFCF46' : '1.2px solid #EEEEEE',
                                    cursor: 'pointer'
                                }}
                            >
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '100%' }}>
                                    {/* Icon + Title row */}
                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
                                        <DynamicIcon
                                            name={step.icon}
                                            index={index}
                                            size={18}
                                            isActive={isHighlight}
                                        />
                                        <span
                                            style={{
                                                fontFamily: "'Mona Sans', sans-serif",
                                                fontWeight: 600,
                                                fontSize: '12px',
                                                lineHeight: '18px',
                                                letterSpacing: '-0.4px',
                                                color: isHighlight ? '#7C2F0B' : '#333333'
                                            }}
                                        >
                                            {step.title}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <p
                                        style={{
                                            fontFamily: "'Mona Sans', sans-serif",
                                            fontWeight: 500,
                                            fontSize: '12px',
                                            lineHeight: '18px',
                                            letterSpacing: '-0.4px',
                                            color: isHighlight ? '#7C2F0B' : '#AFAFAF',
                                            opacity: isHighlight ? 0.7 : 1,
                                            margin: 0,
                                            width: '100%'
                                        }}
                                    >
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        );
    }


    return (
        <section className="w-full bg-[#f6f6f6] py-12 px-4 md:px-8 lg:px-[120px] font-sans">
            <div className="max-w-[1200px] mx-auto flex flex-col gap-8">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 w-full">
                    <div className="flex flex-col gap-2.5 max-w-[500px]">
                        <h2 className="font-semibold text-[36px] leading-[45px] text-[#333] tracking-[-0.8px] m-0">
                            {cms.title}
                        </h2>
                        <p className="text-[16px] leading-[23px] text-[#545454] tracking-[-0.4px] m-0">
                            {cms.subtitle}
                        </p>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                        <Link
                            href="/rental-process"
                            className="border border-[#141414] rounded-[28px] px-5 py-[6px] text-[#141414] font-medium text-[16px] hover:bg-gray-100 transition-colors no-underline"
                        >
                            Rental Process
                        </Link>
                        <Link
                            href="/contact"
                            className="bg-[#ffcf46] rounded-full px-5 py-[6px] text-[#1f1f1f] font-medium text-[16px] hover:bg-[#f5c430] transition-colors no-underline"
                        >
                            Contact
                        </Link>
                    </div>
                </div>

                {/* Steps & Showcase Grid */}
                <div className="flex flex-col lg:flex-row items-stretch gap-5 w-full">
                    {/* Left Column — Steps List */}
                    <div className="flex-1 flex flex-col gap-3 min-w-0">
                        {cms.steps.slice(0, 4).map((step, index) => {
                            const isActive = activeStep === index;
                            return (
                                <div
                                    key={`desktop-step-${index}`}
                                    onClick={() => setActiveStep(index)}
                                    className={`relative cursor-pointer transition-all duration-300 rounded-[20px] overflow-hidden ${isActive
                                        ? 'bg-gradient-to-br from-[#ffcf46]/50 to-[#ffb91b]/90 shadow-[inset_-3px_-3px_15px_-2px_rgba(226,110,0,0.26)] border-[1.2px] border-[#ffcf46]'
                                        : 'bg-white border-[1.2px] border-[#eee] hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex flex-col w-full">
                                        {/* Card Header (Icon, Title, Step Badge) */}
                                        <div className="flex items-start justify-between p-4 w-full">
                                            <div className="flex flex-col gap-2 items-start">
                                                <div className={`rounded-lg size-[30px] flex items-center justify-center overflow-hidden transition-colors ${isActive ? 'bg-[#fff1c5]' : 'bg-[#f6f6f6]'}`}>
                                                    <DynamicIcon name={step.icon} index={index} size={20} isActive={isActive} />
                                                </div>
                                                <h3 className={`font-semibold text-[21px] leading-[28px] tracking-[-0.8px] whitespace-nowrap m-0 transition-colors ${isActive ? 'text-[#7c2f0b]' : 'text-[#333]'}`}>
                                                    {step.title}
                                                </h3>
                                            </div>
                                            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg shrink-0 transition-colors ${isActive
                                                ? 'bg-[#fff1c5] border border-[#7c2f0b]'
                                                : 'border border-[#afafaf]'
                                                }`}>
                                                <div className={`size-1.5 rounded-full transition-colors ${isActive ? 'bg-[#7c2f0b]' : 'bg-[#757575]'}`} />
                                                <span className={`text-[16px] font-medium tracking-[-0.4px] transition-colors ${isActive ? 'text-[#7c2f0b]' : 'text-[#757575]'}`}>
                                                    Step {index + 1}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Card Description (shows when active) */}
                                        {isActive && (
                                            <div className="bg-[#fff1c5] p-4 rounded-b-[20px] animate-fadeIn">
                                                <p className="text-[#7c2f0b] opacity-80 text-[16px] leading-[23px] tracking-[-0.4px] m-0">
                                                    {step.description}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Right Column — Showcase Image */}
                    <div className="flex-1 h-[500px] rounded-[32px] overflow-hidden relative bg-white shadow-sm shrink-0">
                        {cms.steps[activeStep] && (
                            <Image
                                key={activeStep}
                                src={cms.steps[activeStep].image || STEP_IMAGES[activeStep] || STEP_IMAGES[0]}
                                alt={cms.steps[activeStep].title}
                                fill
                                className="object-cover animate-fadeIn"
                                priority
                                unoptimized
                            />
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
            `}</style>
        </section>
    );
};

export default RentalProcess;
