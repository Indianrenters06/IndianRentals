"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
// Switch to react-icons/pi for better build compatibility
import { 
  PiLaptop as DeviceLaptop, 
  PiUserCheck as UserCheck, 
  PiShoppingCartSimple as ShoppingCartSimple, 
  PiBoxArrowUp as BoxArrowUp,
  PiCheckCircle
} from 'react-icons/pi';

import { API } from '../services/apiConfig';

const FALLBACK_STEPS = [
    {
        title: "Choose Your Tech",
        description: "Browse our curated selection of premium, performance tested devices. Use the search or categories to find the perfect tool for your needs.",
        icon: "Laptop",
        highlight: true,
    },
    {
        title: "Complete KYC",
        description: "Pick a flexible rental tenure from 1 to 12 months. Then, complete our KYC process.",
        icon: "IdentificationCard",
        highlight: false,
    },
    {
        title: "Secure Your Order",
        description: "Confirm your rental and complete the payment online. This includes a fully refundable security deposit.",
        icon: "ShoppingCart",
        highlight: false,
    },
    {
        title: "Receive & Create",
        description: "We deliver your tech right to your doorstep, typically within 2-3 business days.",
        icon: "Package",
        highlight: false,
    }
];

// Map CMS string names to actual Pi icons
const ICON_MAP = {
    "Laptop": DeviceLaptop,
    "IdentificationCard": UserCheck,
    "ShoppingCart": ShoppingCartSimple,
    "Package": BoxArrowUp,
};

// Helper to safely render dynamic icons
const DynamicIcon = ({ name, size = 24, className = "" }) => {
    const IconComponent = ICON_MAP[name] || PiCheckCircle;
    return <IconComponent size={size} className={className} />;
};


// Image mapping for each step
const STEP_IMAGES = [
    "https://res.cloudinary.com/dpu9ikeqe/image/upload/v1769200258/WhatsApp_Image_2026-01-23_at_ahuj83.jpg", // Step 1: Browse
    "https://res.cloudinary.com/dpu9ikeqe/image/upload/v1773311179/f5d05a49c7a9e513697df5b39fc826c8e9635182_bau9ky.png", // Step 2: KYC
    "https://res.cloudinary.com/dpu9ikeqe/image/upload/v1773311180/c853e25515c331bf8956b228e04cd4b22e0b91d3_d7oqzx.png", // Step 3: Payment
    "https://res.cloudinary.com/dpu9ikeqe/image/upload/v1773311190/7376ef09ee50f329f3115a2bdec517818465c5a3_fzsfya.png", // Step 4: Delivery
];

const RentalProcess = () => {
    const [cms, setCms] = useState({
        enabled: true,
        title: "Rental Process",
        subtitle: "Choose, secure, receive, and create with zero hassle. No installation, no configuration, no delay.",
        steps: FALLBACK_STEPS
    });

    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
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
    }, []);

    if (!cms.enabled) return null;

    return (
        <section 
            className="py-12 md:py-16 overflow-hidden"
            style={{ 
                minHeight: '738px',
                background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(255, 228, 133, 0.63) 100%)'
            }}
        >
            <div 
                className="mx-auto px-5 md:px-6"
                style={{ maxWidth: '1200px' }}
            >

                {/* Header Section */}
                <div 
                    className="w-full flex flex-col md:flex-row md:items-start justify-between mb-8 md:mb-16 max-w-[350px] md:max-w-none mx-auto md:mx-0 font-manrope"
                >
                    <div className="flex flex-col mb-4 md:mb-0" style={{ gap: '8px' }}>
                        <h2 
                            className="text-[28px] md:text-[36px] font-bold text-gray-900 tracking-tight leading-none"
                        >
                            {cms.title}
                        </h2>
                        <p className="text-gray-600 text-[13px] md:text-[18px] leading-[1.4] tracking-tight max-w-sm md:max-w-md">
                            {cms.subtitle}
                        </p>
                    </div>

                    <div
                        className="flex items-center gap-3"
                    >
                        <Link
                            href="/rental-process"
                            className="inline-flex items-center justify-center hover:brightness-105 transition-all text-black font-semibold text-[13px]"
                            style={{
                                width: '124px',
                                height: '35px',
                                borderRadius: '9999px',
                                background: '#FFCF46',
                                borderBottom: '1px solid rgba(0,0,0,0.10)',
                            }}
                        >
                            Rental Process
                        </Link>
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center hover:opacity-90 transition-all text-white font-semibold text-[13px]"
                            style={{
                                width: '124px',
                                height: '35px',
                                borderRadius: '9999px',
                                background: '#1D1D1F',
                            }}
                        >
                            Contact
                        </Link>
                    </div>
                </div>

                {/* Content Section: Steps (Mobile: List, Desktop: Steps+Image) */}
                <div 
                    className="w-full flex flex-col md:flex-row items-stretch font-manrope md:h-[500px] max-w-[350px] md:max-w-none mx-auto md:mx-0 gap-[10px] md:gap-12 min-h-[509px]"
                >
                    <div className="flex flex-col flex-1" style={{ gap: '10px' }}>
                        {cms.steps.map((step, index) => {
                            const isActive = activeStep === index;
                            const idxNum = index + 1;

                            return (
                                <div
                                    key={`rp-step-${index}`}
                                    className="relative overflow-hidden cursor-pointer"
                                    onClick={() => setActiveStep(index)}
                                >
                                    <div 
                                        className={`px-[16px] py-[20px] rounded-2xl relative z-10 ${
                                            isActive 
                                            ? "bg-gradient-to-br from-[#FFD66B] to-[#FFB323] text-[#6B4B18]" 
                                            : "bg-white border border-[#F2F2F7] text-gray-900"
                                        }`}
                                        style={{ 
                                            height: isActive ? '118px' : 'auto',
                                            minHeight: !isActive ? '110px' : 'auto',
                                            boxShadow: isActive ? '-3px -3px 15px -2px hsla(29, 100%, 44%, 0.26) inset' : '0px 2px 4px rgba(0,0,0,0.02)'
                                        }}
                                    >
                                        <div className="flex flex-col" style={{ gap: '5px', height: '78px' }}>
                                            <div className="flex items-start gap-3.5 pt-0.5">
                                                <div className={`${isActive ? 'text-[#6B4B18]' : 'text-gray-900'} shrink-0`}>
                                                    <DynamicIcon name={step.icon} size={18} />
                                                </div>
                                                <h3 className={`text-[17px] md:text-[22px] font-bold ${isActive ? 'text-[#6B4B18]' : 'text-gray-900'} tracking-[-0.02em] leading-tight`}>
                                                    {step.title}
                                                </h3>
                                            </div>
                                            
                                            <p 
                                                className={`font-manrope font-medium leading-[1.3] tracking-[-0.01em] ${isActive ? 'text-[#846221]' : 'text-[#8E8E93]'} overflow-hidden md:overflow-visible`}
                                                style={{ 
                                                    fontSize: '13px',
                                                    height: isActive ? '54px' : 'auto', 
                                                    color: isActive ? 'hsla(19, 84%, 26%, 1)' : undefined,
                                                    opacity: isActive ? 0.7 : 1,
                                                }}
                                            >
                                                {step.description}
                                            </p>
                                        </div>

                                        {/* Large Background Number */}
                                        <div 
                                            className={`absolute -right-2 top-1/2 -translate-y-1/2 text-[80px] md:text-[100px] font-black pointer-events-none select-none ${
                                                isActive ? 'text-black/5' : 'text-black/[0.03]'
                                            }`}
                                        >
                                            {idxNum}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Right side: Image Container - Desktop Only */}
                    <div className="hidden md:block w-full md:w-[590px] relative h-[300px] md:h-full rounded-[3rem] overflow-hidden shadow-xl bg-gray-100">
                        {cms.steps[activeStep] && (
                            <Image
                                key={`rp-img-${activeStep}`}
                                src={cms.steps[activeStep].image || STEP_IMAGES[activeStep] || STEP_IMAGES[0]}
                                alt={cms.steps[activeStep].title}
                                fill
                                className="object-cover object-center rounded-[3rem] animate-fadeIn"
                                priority
                            />
                        )}
                    </div>
                </div>

            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(4px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.4s ease-out forwards;
                }
            `}</style>
        </section>
    );
};

export default RentalProcess;
