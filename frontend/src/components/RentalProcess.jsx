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

const FALLBACK_STEPS = [
    { title: "Choose Your Tech", description: "Browse our curated selection of premium, performance\ntested devices. Use the search or categories to find the\nperfect tool for your needs.", icon: "Dot", highlight: true },
    { title: "Complete KYC", description: "Pick a flexible rental tenure from 1 to 12 months. Then, complete our KYC process online with your basic documents (PAN and Address Proof).", icon: "IdentificationCard", highlight: false },
    { title: "Secure Your Order", description: "Confirm your rental and complete the payment online. This includes the first month's rent and a fully refundable security deposit.", icon: "ShoppingCart", highlight: false },
    { title: "Receive & Create", description: "We deliver your tech right to your doorstep, typically within 2-3 business days. It arrives fully charged, sanitized, and ready to use straight out of the box. Now, go build something amazing!", icon: "https://res.cloudinary.com/dgkckcdk8/image/upload/v1776112294/package_snga2a.svg", highlight: false }
];

const ICON_MAP = {
    "Laptop": Laptop,
    "IdentificationCard": UserFocus,
    "ShoppingCart": ShoppingCart,
    "Package": Package,
    "Arrow": CaretRight,
    "Dot": Dot
};

const DynamicIcon = ({ name, size = 32, className = "", weight = "bold" }) => {
    if (name && name.startsWith('http')) {
        return (
            <div className={className} style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={name} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
        );
    }
    const IconComponent = ICON_MAP[name] || CheckCircle;
    return <IconComponent size={size} className={className} weight={weight} />;
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
                                        border: isActive ? 'none' : '1px solid hsla(0,0%,89%,1)',
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
                                                <DynamicIcon name={step.icon} size={20} weight={isActive ? "regular" : "bold"} />
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
                className="w-full overflow-hidden bg-white"
                style={{
                    width: '100%',
                    minHeight: 'auto',
                    paddingTop: '48px',
                    paddingBottom: '48px',
                    background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(255, 228, 133, 0.63) 100%)'
                }}
            >
                <div
                    className="max-w-[1200px] mx-auto flex flex-col gap-[20px]"
                    style={{ paddingLeft: '16px', paddingRight: '16px' }}
                >
                    <div className="flex flex-col gap-[8px]">
                        <h2 className="text-[32px] font-bold tracking-tight leading-none" style={{ color: 'hsla(0, 0%, 20%, 1)' }}>{cms.title}</h2>
                        <p className="text-[#1D1D1F]/60 text-[14px] leading-[1.3] tracking-tight">{cms.subtitle}</p>
                    </div>

                    <div className="flex flex-col gap-[12px] relative">
                        {cms.steps.map((step, index) => {
                            const isActive = activeStep === index;
                            return (
                                <div
                                    key={`mobile-step-${index}`}
                                    onClick={() => setActiveStep(index)}
                                    className={`relative cursor-pointer transition-all duration-300 rounded-[1.2rem] overflow-hidden flex-1 flex flex-col justify-center ${isActive ? "" : "bg-white border border-[#E5E5E7]"}`}
                                    style={{
                                        height: isActive ? '118px' : 'auto',
                                        padding: '20px 16px',
                                        background: isActive ? 'linear-gradient(125.34deg, rgba(255,207,70,0.5) 1.25%, rgba(255,185,27,0.9) 98.94%)' : undefined,
                                        boxShadow: isActive ? '-3px -3px 15px -2px hsla(29, 100%, 44%, 0.26) inset' : undefined,
                                    }}
                                >
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-3 mb-1">
                                            <div className={isActive ? 'text-[#6B4B18]' : 'text-[#1D1D1F]'}><DynamicIcon name={step.icon} size={22} /></div>
                                            <h3 className={`text-[15px] font-bold ${isActive ? 'text-[#6B4B18]' : 'text-[#1D1D1F]'} leading-tight tracking-tight`}>{step.title}</h3>
                                        </div>
                                        <p className={`${isActive ? 'text-[#6B4B18]/90' : 'text-[#1D1D1F]/60'} text-[11px] leading-snug font-medium`}>{step.description}</p>
                                    </div>
                                    <div className={`absolute -right-2 top-1/2 -translate-y-1/2 text-[80px] font-black pointer-events-none select-none ${isActive ? 'text-[#6B4B18]/10' : 'text-black/[0.03]'}`}>{index + 1}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <style jsx>{`
                    @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
                    .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
                `}</style>
            </section>
        );
    }

    return (
        <section
            className="w-full overflow-hidden bg-white"
            style={{
                width: '100%',
                paddingTop: '96px',
                paddingBottom: '96px',
                background: '#FFFFFF',
            }}
        >
            <div
                className="max-w-[1200px] mx-auto flex flex-col gap-[32px]"
                style={{ paddingLeft: '24px', paddingRight: '24px' }}
            >
                <div className="w-full flex flex-row items-center justify-between mx-auto font-sans max-w-[1165px] h-[94px]">
                    <div className="flex flex-col h-full gap-[10px] justify-center">
                        <h2 className="text-[36px] font-semibold tracking-tight leading-none" style={{ color: 'hsla(0, 0%, 20%, 1)' }}>{cms.title}</h2>
                        <p className="text-[#1D1D1F] text-[16px] leading-[1.3] tracking-tight max-w-md opacity-80">{cms.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-3 self-end mb-1">
                        <Link href="/rental-process" className="btn-secondary text-[13px]">Rental Process</Link>
                        <Link href="/contact" className="btn-primary text-[13px]">Contact</Link>
                    </div>
                </div>

                <div className="w-full flex flex-row items-stretch mx-auto font-sans gap-[32px] max-w-[1200px]">
                    <div className="flex flex-col" style={{ width: '590px', height: 'auto', minHeight: '500px', gap: '12px' }}>
                        {cms.steps.map((step, index) => {
                            const isActive = activeStep === index;
                            return (
                                <div
                                    key={`desktop-step-${index}`}
                                    onClick={() => setActiveStep(index)}
                                    className={`relative cursor-pointer transition-all duration-300 rounded-2xl overflow-hidden ${isActive ? "" : "bg-white border-[1.2px] border-[hsla(0,0%,93%,1)]"}`}
                                    style={{
                                        width: '590px',
                                        height: isActive ? 'auto' : '92px',
                                        background: isActive ? 'linear-gradient(125.34deg, rgba(255, 207, 70, 0.5) 1.25%, rgba(255, 185, 27, 0.9) 98.94%)' : 'hsla(0,0%,100%,1)',
                                        boxShadow: isActive ? '-3px -3px 15px -2px hsla(29, 100%, 44%, 0.26) inset' : undefined,
                                        border: isActive ? 'none' : undefined,
                                    }}
                                >
                                    <div className={`flex flex-col h-full ${isActive ? 'justify-between' : 'justify-center'}`}>
                                        <div style={{ width: '590px', minHeight: '94px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', opacity: 1, boxSizing: 'border-box' }}>
                                            <div style={{ width: '170px', height: '62px', display: 'flex', flexDirection: 'column', gap: '9px' }}>
                                                <div className={isActive ? 'text-[#6B4B18]' : 'text-[#1D1D1F]'}><DynamicIcon name={step.icon} size={32} /></div>
                                                <h3 style={{ color: isActive ? 'hsla(19, 84%, 26%, 1)' : 'hsla(0, 0%, 20%, 1)', fontFamily: '"Mona Sans", sans-serif', fontWeight: 600, fontSize: '20px', lineHeight: '28px', whiteSpace: 'nowrap', letterSpacing: '-0.02em' }}>
                                                    {step.title}
                                                </h3>
                                            </div>
                                            <div style={{ width: '56px', height: '26px', borderRadius: '6px', border: isActive ? '1px solid hsla(19, 84%, 26%, 1)' : '1px solid #E5E5E7', background: isActive ? 'hsla(46, 100%, 89%, 1)' : '#F5F5F7', color: isActive ? 'hsla(19, 84%, 26%, 1)' : '#86868B', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0px', paddingRight: '4px' }}>
                                                <Dot size={32} weight="bold" style={{ marginLeft: '-11px' }} />
                                                <span style={{ letterSpacing: '-0.01em', lineHeight: 1, marginLeft: '-10px' }}>{'Step ' + (index + 1)}</span>
                                            </div>
                                        </div>
                                        {isActive && (
                                            <div className="animate-fadeIn" style={{ width: '590px', height: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', opacity: 1, background: 'hsla(46, 100%, 89%, 1)' }}>
                                                <p style={{ width: '558px', height: 'auto', opacity: 0.8, fontFamily: '"Mona Sans", sans-serif', fontWeight: 400, fontSize: '16px', lineHeight: '23px', letterSpacing: '-0.04em', color: 'hsla(21, 89%, 15%, 1)', margin: 0, whiteSpace: 'pre-line' }}>{step.description}</p>
                                                {step.link && (
                                                    <Link href={step.link} className="inline-flex items-center gap-1 text-[12px] font-bold text-[#6B4B18] hover:underline mt-1">
                                                        Learn More <DynamicIcon name="Arrow" size={12} />
                                                    </Link>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="relative flex flex-1 rounded-[2rem] overflow-hidden bg-white shadow-sm" style={{ height: 'auto', minHeight: '500px' }}>
                        {cms.steps[activeStep] && <Image key={activeStep} src={cms.steps[activeStep].image || STEP_IMAGES[activeStep] || STEP_IMAGES[0]} alt={cms.steps[activeStep].title} fill className="object-cover animate-fadeIn" priority unoptimized />}
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
