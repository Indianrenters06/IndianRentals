"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
// Import a bunch of icons to support dynamic string resolution from CMS
import * as FontAwesome from 'react-icons/fa';

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const FALLBACK_STEPS = [
    {
        title: "Choose Your Tech",
        description: "Browse our curated selection of premium, performance tested devices.",
        icon: "FaLaptopCode",
        highlight: true,
    },
    {
        title: "Complete KYC",
        description: "Pick a flexible rental tenure from 1 to 12 months. Then, complete our KYC process.",
        icon: "FaUserCheck",
        highlight: false,
    },
    {
        title: "Secure Your Order",
        description: "Confirm your rental and complete the payment online. This includes a fully refundable security deposit.",
        icon: "FaShieldAlt",
        highlight: false,
    },
    {
        title: "Receive & Create",
        description: "We deliver your tech right to your doorstep, typically within 2-3 business days.",
        icon: "FaBoxOpen",
        highlight: false,
    }
];

// Helper to safely render dynamic string icons from react-icons/fa
const DynamicIcon = ({ name, size = 24, className = "" }) => {
    // defaults to FaCheckCircle if not found
    const IconComponent = FontAwesome[name] || FontAwesome.FaCheckCircle;
    return <IconComponent size={size} className={className} />;
};


const RentalProcess = () => {
    const [cms, setCms] = useState({
        enabled: true,
        title: "Rental Process",
        subtitle: "Choose, secure, receive, and create with zero hassle. No installation, no configuration, no delay.",
        steps: FALLBACK_STEPS
    });

    useEffect(() => {
        fetch(`${API}/api/cms/homepage`)
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                if (!data) return;
                setCms({
                    enabled: data.rentalProcessEnabled !== false,
                    title: data.rentalProcessTitle || "Rental Process",
                    subtitle: data.rentalProcessSubtitle || "Choose, secure, receive, and create with zero hassle.",
                    steps: data.rentalProcessSteps?.length > 0 ? data.rentalProcessSteps : FALLBACK_STEPS
                });
            })
            .catch(console.error);
    }, []);

    if (!cms.enabled) return null;

    return (
        <section className="py-10 md:py-20 bg-gray-50">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4">
                    <div>
                        <h2 className="text-4xl font-semibold font-manrope text-gray-900 mb-2">
                            {cms.title}
                        </h2>
                        <p className="text-gray-600 max-w-2xl text-sm md:text-lg">
                            {cms.subtitle}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href="/rental-process" className="px-5 py-2 bg-[#FFC107] text-black font-bold rounded-full hover:bg-[#FFD54F] transition-colors shadow-sm text-sm">
                            Learn More
                        </Link>
                        <Link href="/contact" className="px-5 py-2 bg-gray-800 text-white font-bold rounded-full hover:bg-gray-700 transition-colors text-sm">
                            Contact Support
                        </Link>
                    </div>
                </div>

                {/* Mobile: Single column stacked cards */}
                <div className="md:hidden flex flex-col gap-3">
                    {cms.steps.map((step, index) => {
                        const isHighlighted = step.highlight;
                        const idxNum = index + 1;
                        return (
                            <div
                                key={index}
                                className={`relative p-5 rounded-2xl border border-transparent shadow-sm flex flex-col justify-between transition-all duration-300 ${isHighlighted ? 'bg-[#FFC107] text-black' : 'bg-white text-gray-900 border-gray-100'}`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`text-xl mt-0.5 ${isHighlighted ? 'text-black' : 'text-gray-700'}`}>
                                        <DynamicIcon name={step.icon} size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={`text-base font-bold mb-1.5 ${isHighlighted ? 'text-black' : 'text-gray-900'}`}>
                                            {step.title}
                                        </h3>
                                        <p className={`text-xs leading-relaxed ${isHighlighted ? 'text-gray-900/80 font-medium' : 'text-gray-500'}`}>
                                            {step.description}
                                        </p>
                                    </div>
                                    <span className={`text-5xl font-bold opacity-20 select-none mt-auto self-end ${isHighlighted ? 'text-black' : 'text-gray-300'}`}>
                                        {idxNum}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Desktop: Grid Layout */}
                <div className="hidden md:grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {cms.steps.map((step, index) => {
                        const isHighlighted = step.highlight;
                        const idxNum = index + 1;
                        return (
                            <div
                                key={index}
                                className={`relative p-6 sm:p-8 rounded-[2rem] border border-transparent shadow-sm flex flex-col justify-between min-h-[320px] transition-all duration-300 ${isHighlighted ? 'bg-[#FFC107] text-black hover:-translate-y-1' : 'bg-white text-gray-900 border-gray-100 hover:shadow-xl hover:-translate-y-1'}`}
                            >
                                <div className="flex flex-col items-start gap-4">
                                    <div className={`text-4xl mb-2 ${isHighlighted ? 'text-black' : 'text-gray-900'}`}>
                                        <DynamicIcon name={step.icon} size={36} />
                                    </div>

                                    <div>
                                        <h3 className={`text-xl font-bold mb-3 ${isHighlighted ? 'text-black' : 'text-gray-900'}`}>
                                            {step.title}
                                        </h3>
                                        <p className={`text-sm leading-relaxed ${isHighlighted ? 'text-gray-900/80 font-medium' : 'text-gray-500'}`}>
                                            {step.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Big Number */}
                                <div className={`absolute bottom-4 right-6 text-7xl font-bold opacity-20 ${isHighlighted ? 'text-black' : 'text-gray-300'}`}>
                                    {idxNum}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Bottom Image Placeholder */}
                <div className="hidden md:block mt-16 rounded-3xl overflow-hidden shadow-lg h-96 relative">
                    <Image
                        src="https://res.cloudinary.com/dgkckcdk8/image/upload/v1769959582/indian-rentals/zojf5e2uxucfqpju6qpa.jpg"
                        alt="Rental Process Lifestyle"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute top-0 right-0 w-full h-full bg-linear-to-b from-transparent to-black/50"></div>
                </div>

            </div>
        </section>
    );
};

export default RentalProcess;
