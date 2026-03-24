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

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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
        <section className="py-12 md:py-24 bg-white overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">

                {/* Header Section */}
                <div style={{ width: '1192px' }} className="mx-auto flex flex-col md:flex-row md:items-start justify-between mb-10 gap-8 font-manrope">
                    <div className="max-w-2xl">
                        <div className="inline-block bg-black text-white text-[11px] font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-tight leading-none">
                            Rental Process
                        </div>
                        <h2 className="text-3xl md:text-[36px] font-semibold text-gray-900 font-manrope mb-4 tracking-tight leading-[1.1]">
                            {cms.title}
                        </h2>
                        <p className="text-gray-600 text-base md:text-[18px] leading-[1.3] tracking-tight max-w-md pt-1">
                            {cms.subtitle}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 pt-24 md:pr-12">
                        <Link href="/rental-process" className="btn-yellow-primary !py-4 !px-9 !rounded-full shadow-sm text-[16px] tracking-tight hover:scale-105">
                            Rental Process
                        </Link>
                        <Link href="/contact" className="px-9 py-4 bg-black text-white font-extrabold rounded-full hover:bg-grey-800 transition-all hover:scale-105 text-[16px] tracking-tight font-manrope">
                            Contact
                        </Link>
                    </div>
                </div>

                {/* Content Section: Steps and Image */}
                <div style={{ width: '1192px', height: '500px', gap: '12px' }} className="mx-auto flex flex-row items-stretch font-manrope">

                    {/* Left side: Steps */}
                    <div className="w-[590px] flex flex-col gap-[5px] h-full">
                        {cms.steps.map((step, index) => {
                            const isActive = activeStep === index;
                            const idxNum = index + 1;

                            return (
                                <div
                                    key={`rp-step-${index}`}
                                    onClick={() => setActiveStep(index)}
                                    className="cursor-pointer"
                                >
                                    {isActive ? (
                                        // Active Step Card
                                        <div 
                                            style={{ 
                                                height: '184px',
                                                boxShadow: '-3px -3px 15px -2px #E26E0042 inset'
                                            }}
                                            className="px-7 py-5 flex flex-col justify-between rounded-2xl bg-gradient-to-br from-orange-300/50 to-orange-400/90"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="text-[#6B4B18] scale-[1.3] origin-left pt-1">
                                                    <DynamicIcon name={step.icon} size={28} />
                                                </div>
                                                <div className="px-5 py-2 bg-white text-[13px] font-bold text-[#6B4B18] rounded-full tracking-tighter shadow-sm">
                                                    Step {idxNum}
                                                </div>
                                            </div>
                                            <div className="flex-1 flex flex-col justify-center gap-1.5 pt-2">
                                                <h3 className="text-[28px] font-semibold text-[#6B4B18] tracking-[-0.04em] leading-none font-manrope">
                                                    {step.title}
                                                </h3>
                                                <p className="text-[#846221] text-[16px] leading-[1.4] font-medium tracking-tight font-manrope opacity-95">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        // Inactive Step Card
                                        <div className="h-[100px] px-7 py-5 flex flex-col justify-center bg-white border border-gray-100 shadow-sm hover:border-gray-200 rounded-2xl">
                                            <div className="flex justify-between items-start mb-1.5">
                                                <div className="text-gray-900 scale-[1.2] origin-left pt-1">
                                                    <DynamicIcon name={step.icon} size={24} />
                                                </div>
                                                <div className="px-4 py-1.5 border border-gray-200 text-[12px] font-bold text-gray-400 rounded-full tracking-tighter bg-transparent">
                                                    Step {idxNum}
                                                </div>
                                            </div>
                                            <h3 className="text-[22px] font-semibold text-gray-900 tracking-[-0.04em] mt-1.5 leading-none font-manrope">
                                                {step.title}
                                            </h3>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    {/* Right side: Image Container */}
                    <div className="w-[590px] relative h-full rounded-[3rem] overflow-hidden shadow-xl bg-gray-100">
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
