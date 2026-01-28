'use client';

import React from 'react';
import { PiAddressBook, PiPhone, PiEnvelope, PiClock } from 'react-icons/pi';
import Image from 'next/image';
import { FaWhatsapp, FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

export default function ContactPage() {
    return (
        <div className="font-sans text-gray-800">
            {/* Header Image/Banner - Assuming a banner image based on the first screenshot snippet */}
            <div className="w-full h-64 md:h-80 relative bg-gray-100 overflow-hidden">
                <Image
                    src="/contact-banner.jpg" // Placeholder path, user might need to upload exact one
                    alt="Contact Us"
                    fill
                    className="object-cover"
                />
                {/* Fallback if no image, using a gradient close to the screenshot appearance if possible, 
                    but screenshot shows a person/office image top. Using a simplified placeholder for now. */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center px-12">
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* City Pills */}
                <div className="flex flex-wrap gap-4 mb-16 justify-center md:justify-start">
                    {['Delhi', 'Noida', 'Bangalore', 'Hyderabad', 'Mumbai', 'Pune', 'Chennai', 'Kolkata'].map((city) => (
                        <button key={city} className={`px-8 py-2 rounded-full text-sm font-medium transition-all ${city === 'Delhi' ? 'bg-[#333] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}>
                            {city}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Left Column: Contact Info */}
                    <div className="lg:w-1/3 space-y-8">
                        {/* Address */}
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0">
                                <PiAddressBook size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-1">Address</h3>
                                <p className="text-sm text-blue-600 leading-relaxed">
                                    Unit No. 06, Jumbo Industrial Estate, Dr Jha Marg, Okhla Phase III, Okhla Industrial Estate, New Delhi - 1100020
                                </p>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0">
                                <PiPhone size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-1">Phone</h3>
                                <p className="text-sm text-blue-600">
                                    9870533392 (Support)
                                </p>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0">
                                <PiEnvelope size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-1">Email</h3>
                                <a href="mailto:itsupport@indianrenters.com" className="text-sm text-blue-600 hover:underline">
                                    itsupport@indianrenters.com
                                </a>
                            </div>
                        </div>

                        {/* Timings */}
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0">
                                <PiClock size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-1">Timings</h3>
                                <p className="text-sm text-blue-600">
                                    <span className="font-semibold text-gray-700">Monday - Saturday:</span> 10:00 AM - 07:30 PM
                                </p>
                                <p className="text-sm text-blue-600">
                                    <span className="font-semibold text-gray-700">Sunday:</span> Closed
                                </p>
                            </div>
                        </div>

                        {/* Social Icons */}
                        <div className="flex items-center gap-4 mt-8 pt-4">
                            <span className="text-gray-600 font-medium mr-2">Follow Us</span>
                            <a href="#" className="w-10 h-10 rounded-full bg-white shadow border border-gray-100 flex items-center justify-center text-green-500 hover:scale-110 transition-transform">
                                <FaWhatsapp size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white shadow border border-gray-100 flex items-center justify-center text-blue-600 hover:scale-110 transition-transform">
                                <FaFacebookF size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white shadow border border-gray-100 flex items-center justify-center text-pink-600 hover:scale-110 transition-transform">
                                <FaInstagram size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white shadow border border-gray-100 flex items-center justify-center text-blue-700 hover:scale-110 transition-transform">
                                <FaLinkedinIn size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="lg:w-2/3">
                        <h1 className="text-4xl font-normal text-gray-800 mb-4">We are here to help</h1>
                        <p className="text-gray-600 mb-8 max-w-2xl">
                            Want us to Call you back, Please fill in the form Below and our Executive will reach you as soon as possible.
                        </p>

                        <form className="space-y-6">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter Your Name"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                                        Mobile No. <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="+91-9XXXXXXX"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                                        Email ID <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="hemxxx@gmail.com"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                                        Rental Product <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <select className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-400 focus:outline-none focus:border-blue-500 transition-colors appearance-none bg-white">
                                            <option>macbook pro m4</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                                        Requirement City <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <select className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-400 focus:outline-none focus:border-blue-500 transition-colors appearance-none bg-white">
                                            <option>Delhi....</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                                    Message
                                </label>
                                <textarea
                                    rows="4"
                                    placeholder="Write to us......"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
                                ></textarea>
                            </div>

                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="privacy" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                <label htmlFor="privacy" className="text-xs text-gray-700">
                                    You agree to our friendly <span className="font-bold">privacy policy</span>
                                </label>
                            </div>

                            <button className="w-full bg-[#007bff] hover:bg-[#0069d9] text-white font-medium py-3 rounded-full transition-colors shadow-lg text-lg">
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
