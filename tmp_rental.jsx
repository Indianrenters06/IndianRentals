"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  PiLaptop as DeviceLaptop, 
  PiUserCheck as UserCheck, 
  PiShoppingCartSimple as ShoppingCartSimple, 
  PiBoxArrowUp as BoxArrowUp,
  PiCheckCircle
} from 'react-icons/pi';

import { API } from '../services/apiConfig';

const FALLBACK_STEPS = [
    { title: "Choose Your Tech", description: "Browse our curated selection of premium, performance\ntested devices. Use the search or categories to find the\nperfect tool for your needs.", icon: "Laptop", highlight: true },
    { title: "Complete KYC", description: "Pick a flexible rental tenure from 1 to 12 months. Then, complete our KYC process online with your basic documents (PAN and Address Proof).", icon: "IdentificationCard", highlight: false },
    { title: "Secure Your Order", description: "Confirm your rental and complete the payment online. This includes the first month's rent and a fully refundable security deposit.", icon: "ShoppingCart", highlight: false },
    { title: "Receive & Create", description: "We deliver your tech right to your doorstep, typically within 2-3 business days. It arrives fully charged, sanitized, and ready to use straight out of the box. Now, go build something amazing!", icon: "Package", highlight: false }
];

const ICON_MAP = {
    "Laptop": DeviceLaptop,
    "IdentificationCard": UserCheck,
    "ShoppingCart": ShoppingCartSimple,
    "Package": BoxArrowUp,
};

const DynamicIcon = ({ name, size = 24, className = "" }) => {
    const IconComponent = ICON_MAP[name] || PiCheckCircle;
    return <IconComponent size={size} className={className} />;
};

const STEP_IMAGES = [
    "https://res.cloudinary.com/dpu9ikeqe/image/upload/v1769200258/WhatsApp_Image_2026-01-23_at_ahuj83.jpg",
    "https://res.cloudinary.com/dpu9ikeqe/image/upload/v1773311179/f5d05a49c7a9e513697df5b39fc826c8e9635182_bau9ky.png",
    "https://res.cloudinary.com/dpu9ikeqe/image/upload/v1773311180/c853e25515c331bf8956b228e04cd4b22e0b91d3_d7oqzx.png",
    "https://res.cloudinary.com/dpu9ikeqe/image/upload/v1773311190/7376ef09ee50f329f3115a2bdec517818465c5a3_fzsfya.png",
];

const RentalProcess = () => {
    const [cms, setCms] = useState({ enabled: true, title: "Rental Process", subtitle: "Choose, secure, receive, and create with zero hassle. No installation, no configuration, no delay.", steps: FALLBACK_STEPS });
    const [activeStep, setActiveStep] = useState(0);
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const checkRes = () => setIsDesktop(window.innerWidth >= 768);
        checkRes();
        window.addEventListener('resize', checkRes);
        
        fetch(`${API}/api/cms/homepage`, { cache: 'no-store' })
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                if (!data) return;
                setCms({
                    enabled: data.rentalProcessEnabled !== false,
                    title: data.rentalProcessTitle || "Rental Process",
                    subtitle: data.rentalProcessSubtitle || "Choose, secure, receive, and create with zero hassle. No installation, no configuration, no delay.",
                    steps: data.rentalProcessSteps?.length > 0 ? data.rentalProcessSteps : FALLBACK_STEPS
                });
            })
            .catch(console.error);

        return () => window.removeEventListener('resize', checkRes);
    }, []);

    if (!cms.enabled) return null;

    return (
        <section 
            className="w-full overflow-hidden md:bg-[#F5F5F5]"
            style={{ 
                width: '100%',
                margin: '0 auto',
                minHeight: isDesktop ? '847px' : '752px',
                paddingTop: isDesktop ? '120px' : '48px',
                paddingBottom: isDesktop ? '120px' : '48px',
                background: isDesktop ? '#F5F5F5' : 'linear-gradient(180deg, #FFFFFF 0%, rgba(255, 228, 133, 0.63) 100%)',
                opacity: 1
            }}
        >
            <div 
                className="max-w-[1200px] mx-auto flex flex-col md:gap-[32px] gap-[20px]"
                style={{
                    paddingLeft: isDesktop ? '24px' : '16px',
                    paddingRight: isDesktop ? '24px' : '16px'
                }}
            >
                {/* Desktop Header Row */}
                <div className="w-full hidden md:flex flex-row items-center justify-between mx-auto font-manrope max-w-[1165px] h-[123px]">
                    <div className="flex flex-col gap-[10px]">
                        <div className="bg-[#1D1D1F]/70 text-white text-[10.61px] font-bold flex items-center justify-center rounded-full w-[82.72px] h-[19.45px]">
                            Rental Process
                        </div>
                        <h2 className="text-[36px] font-bold text-[#1D1D1F] tracking-tight leading-none">{cms.title}</h2>
                        <p className="text-[#86868B] text-[18px] leading-[1.3] tracking-tight max-w-md">{cms.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-3 self-end mb-2">
                        <Link href="/rental-process" className="inline-flex items-center justify-center hover:brightness-105 transition-all text-black font-semibold text-[13px] w-[124px] h-[35px] rounded-full bg-[#FFCF46] border-b border-black/10">Rental Process</Link>
                        <Link href="/contact" className="inline-flex items-center justify-center hover:opacity-90 transition-all text-white font-semibold text-[13px] w-[124px] h-[35px] rounded-full bg-[#1D1D1F]">Contact</Link>
                    </div>
                </div>
 
                {/* Mobile Header */}
                <div 
                    className="md:hidden flex flex-col pt-4 mx-auto" 
                    style={{ width: '100%', maxWidth: '358px', height: '113px', gap: '10px' }}
                >
                    <div className="flex flex-col" style={{ gap: '2px' }}>
                        <h2 className="text-[32px] font-bold text-[#1D1D1F] leading-[1.1] tracking-tight">{cms.title}</h2>
                        <p className="text-[#1D1D1F]/70 text-[11.5px] leading-tight font-medium max-w-[340px]">{cms.subtitle}</p>
                    </div>
                    <div className="flex items-center" style={{ width: '184px', height: '30px', gap: '10px' }}>
                        <Link href="/rental-process" className="inline-flex items-center justify-center rounded-full bg-[#FFCF46] shadow-sm font-manrope" style={{ width: '100px', height: '30px', color: 'hsla(0, 0%, 12%, 1)', fontWeight: '500', fontSize: '11px', lineHeight: '18px' }}>
                            <span style={{ width: '81px', height: '18px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', letterSpacing: '-0.01em' }}>Rental Process</span>
                        </Link>
                        <Link href="/contact" className="inline-flex items-center justify-center font-manrope text-white" style={{ width: '69px', height: '30px', padding: '6px 12px', background: 'var(--color-grey-grey-700, hsla(0, 0%, 20%, 1))', borderRadius: '32px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', fontWeight: '500', fontSize: '11px', lineHeight: '18px', gap: '2px', opacity: 1 }}>Contact</Link>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="w-full flex flex-col md:flex-row items-stretch mx-auto font-manrope md:gap-[20px] gap-[10px] max-w-[1200px]">
                    
                    {/* MOBILE VERSION (390px layout) */}
                    {!isDesktop && (
                        <div 
                            className="flex flex-col mx-auto"
                            style={{ 
                                width: '100%',
                                maxWidth: '358px',
                                height: '523px',
                                gap: '12px'
                            }}
                        >
                            {cms.steps.map((step, index) => {
                                const isActive = activeStep === index;
                                return (
                                    <div
                                        key={`mobile-step-${index}`}
                                        onClick={() => setActiveStep(index)}
                                        className={`relative cursor-pointer transition-all duration-300 rounded-2xl overflow-hidden flex flex-col justify-center ${isActive ? "" : "bg-white border border-[#E5E5E7]"}`}
                                        style={{ 
                                            width: '100%',
                                            maxWidth: '358px',
                                            height: isActive ? '118px' : 'auto',
                                            minHeight: isActive ? '118px' : '92px',
                                            padding: '20px 16px',
                                            background: isActive ? 'linear-gradient(125.34deg, rgba(255, 207, 70, 0.5) 1.25%, rgba(255, 185, 27, 0.9) 98.94%)' : undefined,
                                            boxShadow: isActive ? '-3px -3px 15px -2px hsla(29, 100%, 44%, 0.26) inset' : undefined,
                                        }}
                                    >
                                        <div 
                                            className="flex flex-col"
                                            style={{
                                                width: '100%',
                                                height: '78px',
                                                gap: '5px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <div className="flex items-center gap-3" style={{ height: '19px' }}>
                                                <div className={isActive ? 'text-[#6B4B18]' : 'text-[#1D1D1F]'}><DynamicIcon name={step.icon} size={22} /></div>
                                                <h3 className={`text-[15px] font-bold ${isActive ? 'text-[#6B4B18]' : 'text-[#1D1D1F]'} leading-tight tracking-tight`}>{step.title}</h3>
                                            </div>
                                            <p 
                                                className={`font-manrope ${isActive ? "" : "text-[#1D1D1F]"}`}
                                                style={{
                                                    fontSize: '11px',
                                                    fontWeight: '500',
                                                    width: '100%',
                                                    height: '54px',
                                                    color: isActive ? 'hsla(19, 84%, 26%, 0.7)' : 'rgba(29, 29, 31, 0.6)',
                                                    lineHeight: '18px',
                                                    letterSpacing: '-0.01em',
                                                    overflow: 'hidden',
                                                    whiteSpace: 'pre-line'
                                                }}
                                            >
                                                {step.description}
                                            </p>
                                        </div>
                                        <div className={`absolute -right-2 top-1/2 -translate-y-1/2 text-[80px] font-black pointer-events-none select-none ${isActive ? 'text-[#6B4B18]/10' : 'text-black/[0.03]'}`}>{index + 1}</div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* DESKTOP VERSION (1200px layout) */}
                    {isDesktop && (
                        <div 
                            className="flex flex-col" 
                            style={{ 
                                width: '590px', 
                                height: '500px', 
                                gap: '12px' 
                            }}
                        >
                            {cms.steps.map((step, index) => {
                                const isActive = activeStep === index;
                                return (
                                <div
                                    key={`desktop-step-${index}`}
                                    onClick={() => setActiveStep(index)}
                                    className={`relative cursor-pointer transition-all duration-300 rounded-2xl overflow-hidden ${
                                        isActive 
                                        ? "" 
                                        : "bg-white border-[1.2px] border-[hsla(0,0%,93%,1)]"
                                    }`}
                                    style={{ 
                                        height: isActive ? '184px' : '92px', 
                                        background: isActive 
                                            ? 'linear-gradient(125.34deg, rgba(255, 207, 70, 0.5) 1.25%, rgba(255, 185, 27, 0.9) 98.94%)' 
                                            : 'hsla(0,0%,100%,1)',
                                        boxShadow: isActive ? '-3px -3px 15px -2px hsla(29, 100%, 44%, 0.26) inset' : undefined,
                                        border: isActive ? 'none' : undefined
                                    }}
                                >
                                    <div className="flex flex-col h-full">
                                        {/* Top Section */}
                                        <div className="flex flex-col p-4" style={{ gap: isActive ? '5px' : '9px' }}>
                                            <div className="flex items-center justify-between">
                                                <div className={isActive ? 'text-[#6B4B18]' : 'text-[#1D1D1F]'}><DynamicIcon name={step.icon} size={22} /></div>
                                                <div className={`text-[12px] font-bold px-3 py-1 rounded-full border ${isActive ? 'bg-[#FFF9E9] border-[#6B4B18]/20 text-[#6B4B18]' : 'bg-[#F5F5F7] border-[#E5E5E7] text-[#86868B]'}`}>
                                                    {"ΓÇó Step " + (index + 1)}
                                                </div>
                                            </div>
                                            <h3 className={`text-[20px] font-bold ${isActive ? 'text-[#6B4B18]' : 'text-[#1D1D1F]'} leading-tight`}>{step.title}</h3>
                                        </div>

                                        {/* Bottom/Description Section (Two-tone effect) */}
                                        {isActive ? (
                                            <div className="flex-1 bg-white/30 border-t border-[#6B4B18]/10 p-4 pt-3 mt-auto">
                                                <p className="text-[#6B4B18]/90 text-[15px] leading-snug font-medium animate-fadeIn">{step.description}</p>
                                            </div>
                                        ) : (
                                            <div className="px-4 pb-4">
                                                <p className="text-[#1D1D1F]/40 text-[15px] leading-none font-medium line-clamp-1">Click to see details</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Image Column - Hidden on mobile to maintain 738px layout height */}
                    <div className="relative hidden md:flex flex-1 rounded-[2rem] overflow-hidden bg-white shadow-sm md:h-[500px]">
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
