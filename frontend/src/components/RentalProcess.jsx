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
    { title: "Receive & Create", description: "We deliver your tech right to your doorstep, typically within 2-3 business days. It arrives fully charged, sanitized, and ready to use straight out of the box. Now, go build something amazing!", icon: "Package", highlight: false }
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
    const IconComponent = ICON_MAP[name] || CheckCircle;
    return <IconComponent size={size} className={className} weight={weight} />;
};

const STEP_IMAGES = [
    "https://res.cloudinary.com/dpu9ikeqe/image/upload/v1769200258/WhatsApp_Image_2026-01-23_at_ahuj83.jpg",
    "https://res.cloudinary.com/dpu9ikeqe/image/upload/v1773311179/f5d05a49c7a9e513697df5b39fc826c8e9635182_bau9ky.png",
    "https://res.cloudinary.com/dpu9ikeqe/image/upload/v1773311180/c853e25515c331bf8956b228e04cd4b22e0b91d3_d7oqzx.png",
    "https://res.cloudinary.com/dpu9ikeqe/image/upload/v1773311190/7376ef09ee50f329f3115a2bdec517818465c5a3_fzsfya.png",
];

const RentalProcess = () => {
    const [cms, setCms] = useState({ enabled: true, title: "How It Works", subtitle: "Choose, secure, receive, and create with zero hassle. No installation, no configuration, no delay.", steps: FALLBACK_STEPS });
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

        return () => window.removeEventListener('resize', checkRes);
    }, []);

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
                            <Link href="/rental-process" className="btn-primary flex items-center justify-center !w-[124px] !h-[35px] !px-0 text-[13px]" style={{
                                textDecoration: 'none', border: 'none'
                            }}>Rental Process</Link>
                            <Link href="/contact" style={{
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                width: '90px', height: '35px', borderRadius: '9999px',
                                background: '#fff', color: '#1D1D1F',
                                fontSize: '13px', fontWeight: 600,
                                textDecoration: 'none', border: '2px solid #1D1D1F'
                            }}>Contact</Link>
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
                        <Link href="/rental-process" className="btn-primary !w-[124px] !h-[35px] !px-0 text-[13px] border-b border-black/10">Rental Process</Link>
                        <Link href="/contact" className="inline-flex items-center justify-center hover:bg-gray-50 transition-all text-black font-semibold text-[13px] w-[124px] h-[35px] rounded-full bg-white border-2 border-black">Contact</Link>
                    </div>
                </div>

                <div className="w-full flex flex-row items-stretch mx-auto font-sans gap-[32px] max-w-[1200px]">
                    <div className="flex flex-col" style={{ width: '590px', height: '500px', gap: '12px' }}>
                        {cms.steps.map((step, index) => {
                            const isActive = activeStep === index;
                            return (
                                <div
                                    key={`desktop-step-${index}`}
                                    onClick={() => setActiveStep(index)}
                                    className={`relative cursor-pointer transition-all duration-300 rounded-2xl overflow-hidden ${isActive ? "" : "bg-white border-[1.2px] border-[hsla(0,0%,93%,1)]"}`}
                                    style={{
                                        width: '590px',
                                        height: isActive ? (index === 3 ? '236px' : '213px') : '92px',
                                        background: isActive ? 'linear-gradient(125.34deg, rgba(255, 207, 70, 0.5) 1.25%, rgba(255, 185, 27, 0.9) 98.94%)' : 'hsla(0,0%,100%,1)',
                                        boxShadow: isActive ? '-3px -3px 15px -2px hsla(29, 100%, 44%, 0.26) inset' : undefined,
                                        border: isActive ? 'none' : undefined,
                                    }}
                                >
                                    <div className={`flex flex-col h-full ${isActive ? 'justify-between' : 'justify-center'}`}>
                                        <div style={{ width: '590px', height: '94px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', opacity: 1, boxSizing: 'border-box' }}>
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
                                            <div className="animate-fadeIn" style={{ width: '590px', height: index === 3 ? '101px' : '78px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', opacity: 1, background: 'hsla(46, 100%, 89%, 1)' }}>
                                                <p style={{ width: '558px', height: index === 3 ? '69px' : '46px', opacity: 0.8, fontFamily: '"Mona Sans", sans-serif', fontWeight: 400, fontSize: '16px', lineHeight: '23px', letterSpacing: '-0.04em', color: 'hsla(21, 89%, 15%, 1)', margin: 0, whiteSpace: 'pre-line' }}>{step.description}</p>
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

                    <div className="relative flex flex-1 rounded-[2rem] overflow-hidden bg-white shadow-sm" style={{ height: '500px' }}>
                        {cms.steps[activeStep] && <Image key={activeStep} src={cms.steps[activeStep].image || STEP_IMAGES[activeStep] || STEP_IMAGES[0]} alt={cms.steps[activeStep].title} fill className="object-cover animate-fadeIn" priority />}
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
