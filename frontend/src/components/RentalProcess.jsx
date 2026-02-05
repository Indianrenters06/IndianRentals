"use client";
import React from 'react';
import Image from 'next/image';
import { FaLaptopCode, FaUserCheck, FaShieldAlt, FaBoxOpen, FaArrowRight } from 'react-icons/fa';

const steps = [
    {
        id: 1,
        title: "Choose Your Tech",
        description: "Browse our curated selection of premium performance laptops, devices. Use the search or categories to find the perfect tool for your needs.",
        icon: <FaLaptopCode size={24} />,
        bg: "bg-[#FFC107]",
        numberColor: "text-yellow-600"
    },
    {
        id: 2,
        title: "Complete KYC",
        description: "Pick a flexible rental tenure from 1 to 12 months. Then, complete our KYC process online with your basic documents (PAN and Address Proof).",
        icon: <FaUserCheck size={24} />,
        bg: "bg-white",
        numberColor: "text-gray-100"
    },
    {
        id: 3,
        title: "Secure Your Order",
        description: "Confirm your rental and complete the payment online. This includes the first month's rent and a fully refundable security deposit.",
        icon: <FaShieldAlt size={24} />,
        bg: "bg-white",
        numberColor: "text-gray-100"
    },
    {
        id: 4,
        title: "Receive & Create",
        description: "We deliver your tech right to your doorstep, typically within 2-3 business days. It arrives fully charged, sanitized, and ready to use straight out of the box.",
        icon: <FaBoxOpen size={24} />,
        bg: "bg-white",
        numberColor: "text-gray-100"
    }
];

const RentalProcess = () => {
    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <div className="inline-block px-3 py-1 bg-gray-200 text-gray-600 text-xs font-bold rounded-full mb-2 uppercase tracking-wider">
                            Rental Process
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Rental Process
                        </h2>
                        <p className="text-gray-600 max-w-2xl text-lg">
                            Choose, secure, receive, and create with zero hassle. No installation, no configuration, no delay.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="px-6 py-2.5 bg-[#FFC107] text-black font-bold rounded-full hover:bg-[#FFD54F] transition-colors shadow-lg">
                            Rental Process
                        </button>
                        <button className="px-6 py-2.5 bg-gray-800 text-white font-bold rounded-full hover:bg-gray-700 transition-colors">
                            Contact
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {steps.map((step) => (
                        <div
                            key={step.id}
                            className={`relative p-6 sm:p-8 rounded-[2rem] border border-transparent shadow-sm flex flex-col justify-between min-h-[320px] transition-all duration-300 ${step.id === 1 ? 'bg-[#FFC107] text-black' : 'bg-white text-gray-900 border-gray-100 hover:shadow-xl'
                                }`}
                        >
                            <div className="flex flex-col items-start gap-4">
                                <div className={`text-4xl mb-2 ${step.id === 1 ? 'text-black' : 'text-gray-900'}`}>
                                    {step.icon}
                                </div>

                                <div>
                                    <h3 className={`text-xl font-bold mb-3 ${step.id === 1 ? 'text-black' : 'text-gray-900'}`}>
                                        {step.title}
                                    </h3>

                                    <p className={`text-sm leading-relaxed ${step.id === 1 ? 'text-gray-900/80 font-medium' : 'text-gray-500'}`}>
                                        {step.description}
                                    </p>
                                </div>
                            </div>

                            {/* Big Number */}
                            <div className={`absolute bottom-4 right-6 text-7xl font-bold opacity-20 ${step.id === 1 ? 'text-black' : 'text-gray-300'}`}>
                                {step.id}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Image Placeholder */}
                <div className="mt-16 rounded-3xl overflow-hidden shadow-lg h-96 relative">
                    <Image
                        src="https://res.cloudinary.com/dgkckcdk8/image/upload/v1769959582/indian-rentals/zojf5e2uxucfqpju6qpa.jpg"
                        alt="Rental Process Lifestyle"
                        fill
                        className="object-cover"
                    />
                    {/* Decorative Gradients */}
                    <div className="absolute top-0 right-0 w-full h-full bg-linear-to-b from-transparent to-black/50"></div>
                </div>
            </div>
        </section>
    );
};

export default RentalProcess;
