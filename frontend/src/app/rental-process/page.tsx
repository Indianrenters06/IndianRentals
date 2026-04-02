'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Laptop as PiLaptop, 
  UserFocus as PiUserFocus, 
  ShoppingCart as PiShoppingCart, 
  Package as PiBoxArrowUp, 
  Clock as PiClock, 
  Calendar as PiCalendar, 
  Truck as PiTruck, 
  CurrencyInr as PiCurrencyInr 
} from '@phosphor-icons/react';
import Testimonials from '@/components/Testimonials';

export default function RentalProcessPage() {
    const [activeStep, setActiveStep] = useState(0);

    const steps = [
        {
            title: "Choose Your Tech",
            description: "Browse our curated selection of premium, performance tested devices. Use the search or categories to find the perfect tool for your needs.",
            icon: PiLaptop,
        },
        {
            title: "Complete KYC",
            description: "Pick a flexible rental tenure from 1 to 12 months. Then, complete our KYC process online with your basic documents (PAN and Address Proof).",
            icon: PiUserFocus,
        },
        {
            title: "Secure Your Order",
            description: "Confirm your rental and complete the payment online. This includes the first month's rent and a fully refundable security deposit.",
            icon: PiShoppingCart,
        },
        {
            title: "Receive & Create",
            description: "We deliver your tech right to your doorstep, typically within 2-3 business days. It arrives fully charged, sanitized, and ready to use straight out of the box.",
            icon: PiBoxArrowUp,
        }
    ];

    return (
        <div className="font-sans text-gray-800 pb-20">
            {/* 1. Header Hero Banner */}
            <div className="max-w-[1200px] mx-auto px-4 mt-8 mb-16">
                <div className="w-full h-[300px] md:h-[400px] relative bg-gray-900 overflow-hidden rounded-3xl">
                    <Image
                        src="https://res.cloudinary.com/dpu9ikeqe/image/upload/v1770803847/9f8d4d5a95b5ff564196928771ca74a7229121d9_zzu2id.png"
                        alt="Rental Process Banner"
                        fill
                        className="object-cover object-center opacity-60"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h1 className="text-white text-5xl md:text-7xl font-semibold drop-shadow-lg font-manrope">Rental Process</h1>
                    </div>
                </div>
            </div>

            {/* 2. Rental Process Steps Section */}
            <div className="max-w-[1440px] mx-auto px-4 md:px-8 mb-24 font-manrope">
                <div style={{ width: '1200px' }} className="mx-auto flex flex-col md:flex-row md:items-start justify-between mb-12 gap-6">
                    <div className="max-w-2xl">
                        <div className="inline-block bg-[#333] font-manrope text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest leading-none">
                            Rental Process
                        </div>
                        <h2 className="text-3xl md:text-[36px] font-semibold text-gray-900 font-manrope mb-4 tracking-tight leading-[1.1]">
                            Rental Process
                        </h2>
                        <p className="text-gray-600 font-manrope text-lg">
                            Choose, secure, receive, and create with zero hassle. <br className="hidden md:block" />
                            No installation, no configuration, no delay.
                        </p>
                    </div>
                    <div className="pt-24 md:pr-12">
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center px-8 py-3 bg-[#333] text-white font-bold rounded-full hover:bg-black transition-transform hover:-translate-y-1 font-manrope"
                        >
                            Contact
                        </Link>
                    </div>
                </div>

                <div style={{ width: '1200px', height: '500px', gap: '20px' }} className="mx-auto flex flex-row items-stretch mb-24">

                    {/* Left side: Steps */}
                    <div className="w-[590px] flex flex-col gap-[20px] h-full">
                        {steps.map((step, index) => {
                            const isActive = activeStep === index;
                            const idxNum = index + 1;
                            const Icon = step.icon;

                            return (
                                <div
                                    key={step.title}
                                    onClick={() => setActiveStep(index)}
                                    className="cursor-pointer"
                                >
                                    {isActive ? (
                                        // Active Step Card
                                        <div 
                                            style={{ 
                                                height: '184px',
                                                background: 'linear-gradient(125.34deg, rgba(255, 207, 70, 0.5) 1.25%, rgba(255, 185, 27, 0.9) 98.94%)',
                                                boxShadow: '-3px -3px 15px -2px #E26E0042 inset'
                                            }}
                                            className="px-7 py-5 flex flex-col justify-between rounded-2xl"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="text-[#6B4B18] pt-1">
                                                    <Icon size={32} weight="bold" />
                                                </div>
                                                <div className="px-5 py-2 bg-white text-[13px] font-bold text-[#6B4B18] rounded-full tracking-tighter shadow-sm">
                                                    Step {idxNum}
                                                </div>
                                            </div>
                                            <div className="flex-1 flex flex-col justify-center gap-1.5 pt-2">
                                                <h3 className="text-[28px] font-semibold text-[#6B4B18] tracking-[-0.04em] leading-none font-manrope mb-2">
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
                                                <div className="text-gray-900 pt-1">
                                                    <Icon size={32} weight="bold" />
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
                    <div className="w-[590px] relative h-full rounded-[3rem] overflow-hidden shadow-xl">
                        <Image
                            src="https://res.cloudinary.com/dpu9ikeqe/image/upload/v1769200258/WhatsApp_Image_2026-01-23_at_ahuj83.jpg"
                            alt="Modern Tech Setup"
                            fill
                            className="object-cover object-center rounded-[3rem]"
                            priority
                        />
                    </div>
                </div>
            </div>

            {/* 3. Features Section */}
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mb-24">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-manrope">Features</h2>
                    <p className="text-gray-600 font-manrope text-lg">
                        Rent with confidence. Every product comes with transparent pricing, flexible terms, and reliable support—so you focus on your work, not equipment hassles.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                    <div className="flex flex-col items-center text-center p-6">
                        <div className="w-16 h-16 rounded-full bg-white border-2 border-gray-900 flex items-center justify-center mb-6">
                            <PiClock size={28} className="text-gray-900" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 font-manrope">Quick Support</h3>
                        <p className="text-gray-500 text-sm font-manrope">Get expert help fast</p>
                    </div>

                    <div className="flex flex-col items-center text-center p-6">
                        <div className="w-16 h-16 rounded-full bg-white border-2 border-gray-900 flex items-center justify-center mb-6">
                            <PiCalendar size={24} className="text-gray-900" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 font-manrope">Rental Flexibility</h3>
                        <p className="text-gray-500 text-sm font-manrope">Choose your rental plan</p>
                    </div>

                    <div className="flex flex-col items-center text-center p-6">
                        <div className="w-16 h-16 rounded-full bg-white border-2 border-gray-900 flex items-center justify-center mb-6">
                            <PiTruck size={28} className="text-gray-900" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 font-manrope">Fast Delivery</h3>
                        <p className="text-gray-500 text-sm font-manrope">We deliver quickly across India within 48-72 hour</p>
                    </div>

                    <div className="flex flex-col items-center text-center p-6">
                        <div className="w-16 h-16 rounded-full bg-white border-2 border-gray-900 flex items-center justify-center mb-6">
                            <PiCurrencyInr size={24} className="text-gray-900" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 font-manrope">No Hidden Charges</h3>
                        <p className="text-gray-500 text-sm font-manrope">One transparent invoice</p>
                    </div>
                </div>
            </div>

            {/* 4. Why Choose Us Section */}
            <div className="bg-[#FFFDF7] py-24 mb-16">
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-manrope text-gray-900">Why Choose Us?</h2>
                            <p className="text-gray-600 mb-10 leading-relaxed font-manrope max-w-lg text-lg">
                                Join thousands who&apos;ve switched to the flexible, affordable way to access
                                high-end tech. IndianRenters delivers AI-ready workstations, laptops, and IT
                                gear with zero ownership hassle and instant support.
                            </p>

                            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200/60">
                                <div>
                                    <h3 className="text-4xl md:text-5xl font-bold font-manrope text-gray-900 mb-2">90k+</h3>
                                    <p className="text-sm font-medium text-gray-500 font-manrope tracking-wide">Devices in Stock</p>
                                </div>
                                <div>
                                    <h3 className="text-4xl md:text-5xl font-bold font-manrope text-gray-900 mb-2">30k+</h3>
                                    <p className="text-sm font-medium text-gray-500 font-manrope tracking-wide">Happy Customers</p>
                                </div>
                                <div>
                                    <h3 className="text-4xl md:text-5xl font-bold font-manrope text-gray-900 mb-2">401+</h3>
                                    <p className="text-sm font-medium text-gray-500 font-manrope tracking-wide">Cities Covered</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative h-[400px] md:h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl">
                            <Image
                                src="https://res.cloudinary.com/dpu9ikeqe/image/upload/v1770800851/d271e76a95431ea60b52889370f378908ea28e43_qiucu1.jpg"
                                alt="Why Choose Us"
                                fill
                                className="object-cover object-center"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Testimonials />
        </div>
    );
}
