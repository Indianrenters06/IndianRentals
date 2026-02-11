'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    FaLaptop,
    FaUserCheck,
    FaShoppingCart,
    FaBoxOpen,
    FaClock,
    FaCalendarAlt,
    FaTruck,
    FaRupeeSign
} from 'react-icons/fa';
import Testimonials from '../../components/Testimonials';

export default function RentalProcessPage() {
    return (
        <div className="font-sans text-gray-800 pb-20">
            {/* 1. Header Hero Banner */}
            <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-16">
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
            <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-8 mb-24">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="max-w-2xl">
                        <div className="inline-block bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
                            Rental Process
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-manrope mb-4">
                            Rental Process
                        </h2>
                        <p className="text-gray-600 font-manrope text-lg">
                            Choose, secure, receive, and create with zero hassle. <br className="hidden md:block" />
                            No installation, no configuration, no delay.
                        </p>
                    </div>
                    <div>
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center px-8 py-3 bg-[#333] text-white font-bold rounded-full hover:bg-black transition-transform hover:-translate-y-1"
                        >
                            Contact
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Step 1 */}
                    <div className="bg-[#FFC107] p-8 rounded-[2rem] relative min-h-[320px] flex flex-col group transition-transform hover:-translate-y-1">
                        <div className="w-10 h-10 mb-6 text-gray-900">
                            <FaLaptop size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 font-manrope">Choose Your Tech</h3>
                        <p className="text-gray-800 text-sm leading-relaxed font-manrope">
                            Browse our curated selection of premium, performance tested devices. Use the search or categories to find the perfect tool for your needs.
                        </p>
                        <span className="absolute bottom-4 right-8 text-8xl font-bold text-black/10 font-manrope select-none">1</span>
                    </div>

                    {/* Step 2 */}
                    <div className="bg-gray-50 p-8 rounded-[2rem] relative min-h-[320px] flex flex-col group transition-transform hover:-translate-y-1">
                        <div className="w-10 h-10 mb-6 text-gray-900">
                            <FaUserCheck size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 font-manrope">Complete KYC</h3>
                        <p className="text-gray-500 text-sm leading-relaxed font-manrope">
                            Pick a flexible rental tenure from 1 to 12 months. Then, complete our KYC process online with your basic documents (PAN and Address Proof).
                        </p>
                        <span className="absolute bottom-4 right-8 text-8xl font-bold text-gray-200 font-manrope select-none">2</span>
                    </div>

                    {/* Step 3 */}
                    <div className="bg-gray-50 p-8 rounded-[2rem] relative min-h-[320px] flex flex-col group transition-transform hover:-translate-y-1">
                        <div className="w-10 h-10 mb-6 text-gray-900">
                            <FaShoppingCart size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 font-manrope">Secure Your Order</h3>
                        <p className="text-gray-500 text-sm leading-relaxed font-manrope">
                            Confirm your rental and complete the payment online. This includes the first month's rent and a fully refundable security deposit.
                        </p>
                        <span className="absolute bottom-4 right-8 text-8xl font-bold text-gray-200 font-manrope select-none">3</span>
                    </div>

                    {/* Step 4 */}
                    <div className="bg-gray-50 p-8 rounded-[2rem] relative min-h-[320px] flex flex-col group transition-transform hover:-translate-y-1">
                        <div className="w-10 h-10 mb-6 text-gray-900">
                            <FaBoxOpen size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 font-manrope">Receive & Create</h3>
                        <p className="text-gray-500 text-sm leading-relaxed font-manrope">
                            We deliver your tech right to your doorstep, typically within 2-3 business days. It arrives fully charged, sanitized, and ready to use straight out of the box.
                        </p>
                        <span className="absolute bottom-4 right-8 text-8xl font-bold text-gray-200 font-manrope select-none">4</span>
                    </div>
                </div>
            </div>

            {/* 3. Features Section */}
            <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-8 mb-24">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-manrope">Features</h2>
                    <p className="text-gray-600 font-manrope text-lg">
                        Rent with confidence. Every product comes with transparent pricing, flexible terms, and reliable support—so you focus on your work, not equipment hassles.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                    {/* Feature 1 */}
                    <div className="flex flex-col items-center text-center p-6">
                        <div className="w-16 h-16 rounded-full bg-white border-2 border-gray-900 flex items-center justify-center mb-6">
                            <FaClock size={28} className="text-gray-900" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 font-manrope">Quick Support</h3>
                        <p className="text-gray-500 text-sm font-manrope">Get expert help fast</p>
                    </div>

                    {/* Feature 2 */}
                    <div className="flex flex-col items-center text-center p-6">
                        <div className="w-16 h-16 rounded-full bg-white border-2 border-gray-900 flex items-center justify-center mb-6">
                            <FaCalendarAlt size={24} className="text-gray-900" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 font-manrope">Rental Flexibility</h3>
                        <p className="text-gray-500 text-sm font-manrope">Choose your rental plan</p>
                    </div>

                    {/* Feature 3 */}
                    <div className="flex flex-col items-center text-center p-6">
                        <div className="w-16 h-16 rounded-full bg-white border-2 border-gray-900 flex items-center justify-center mb-6">
                            <FaTruck size={28} className="text-gray-900" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 font-manrope">Fast Delivery</h3>
                        <p className="text-gray-500 text-sm font-manrope">We deliver quickly across India within 48-72 hour</p>
                    </div>

                    {/* Feature 4 */}
                    <div className="flex flex-col items-center text-center p-6">
                        <div className="w-16 h-16 rounded-full bg-white border-2 border-gray-900 flex items-center justify-center mb-6">
                            <div className="relative">
                                <FaRupeeSign size={24} className="text-gray-900" />
                                {/* Shield outline effect simulated with border if needed, but icon is clean */}
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 font-manrope">No Hidden Charges</h3>
                        <p className="text-gray-500 text-sm font-manrope">One transparent invoice</p>
                    </div>
                </div>
            </div>

            {/* 4. Why Choose Us Section */}
            <div className="bg-[#FFFDF7] py-24 mb-16">
                <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Left Content */}
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-manrope text-gray-900">Why Choose Us?</h2>
                            <p className="text-gray-600 mb-10 leading-relaxed font-manrope max-w-lg text-lg">
                                Join thousands who've switched to the flexible, affordable way to access
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

                        {/* Right Image */}
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

            {/* 5. Testimonials Section */}
            <Testimonials />
        </div>
    );
}
