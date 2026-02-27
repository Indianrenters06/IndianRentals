'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaWhatsapp, FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ContactPage() {
    const [selectedCity, setSelectedCity] = React.useState('Delhi');
    const [cmsBanner, setCmsBanner] = useState({ image: null, title: null });

    useEffect(() => {
        fetch(`${API}/api/cms/contact`)
            .then(r => r.ok ? r.json() : null)
            .then(d => { if (d) setCmsBanner({ image: d.bannerImage || null, title: d.bannerTitle || null }); })
            .catch(() => { });
    }, []);


    const cityDetails = {
        'Delhi': {
            address: 'Unit No. 06, Jumbo Industrial Estate, Dr Jha Marg, Okhla Phase III, Okhla Industrial Estate, New Delhi - 1100020',
            phone: '9870533392',
            email: 'itsupport@indianrenters.com'
        },
        'Noida': {
            address: 'L8-802, The Iconic Corenthum, Tower C, Sector 62, Noida, UP - 201301',
            phone: '91 9122234563',
            email: 'info@indianrenters.com'
        },
        'Bangalore': {
            address: '#1473, First Floor, 17th A Main Road, 2nd Phase, JP Nagar, Bangalore - 560078',
            phone: '9999501792',
            email: 'sale-bangalore@indianrenters.com'
        },
        'Hyderabad': {
            address: '11-6-837/C, Red Hills, Lakdi Ka Pul, Hyderabad, Telangana - 500004',
            phone: '8510842741',
            email: 'hyd-support@indianrenters.com'
        },
        'Mumbai': {
            address: '117 Sai Dham Building, MIDC Road No. 7, Andheri East, Mumbai, Maharashtra - 400093',
            phone: '9987534668',
            email: 'support@indianrenters.com'
        },
        'Pune': {
            address: 'Office No. 3, 1st Floor, Kajale Heights, Paud Phata, Karve Road, Kothrud, Pune, Maharashtra - 411038',
            phone: '9922800442',
            email: 'pune@indianrenters.com'
        },
        'Chennai': { // Fallback/Placeholder as no image provided for Chennai, using generic or empty
            address: 'Chennai Office Address Placeholder',
            phone: '9870533392',
            email: 'itsupport@indianrenters.com'
        },
        'Kolkata': { // Fallback/Placeholder
            address: 'Kolkata Office Address Placeholder',
            phone: '9870533392',
            email: 'itsupport@indianrenters.com'
        }
    };

    return (
        <div className="font-sans text-gray-800">
            {/* Header Image/Banner - Assuming a banner image based on the first screenshot snippet */}
            {/* Header Image/Banner */}
            <div className="max-w-[1150px] mx-auto px-3 sm:px-6 lg:px-8 mt-8">
                <div className="w-full h-[300px] md:h-[500px] relative bg-gray-100 overflow-hidden rounded-3xl">
                    <Image
                        src={cmsBanner.image || "https://res.cloudinary.com/dgkckcdk8/image/upload/v1770615662/indian-rentals/ythxavcpd8hd4yerh8y0.jpg"}
                        alt="Contact Us"
                        fill
                        className="object-cover object-center"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h1 className="text-white text-4xl md:text-6xl font-semibold drop-shadow-lg">
                            {cmsBanner.title || "Contact Us"}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-8 py-12">

                <div className="flex flex-col lg:flex-row gap-12 min-h-[532px]">
                    {/* Left Column: Contact Info */}
                    {/* Left Column: Contact Info */}
                    <div className="flex-1">
                        {/* City Pills moved inside left column */}
                        <div className="grid grid-cols-4 gap-3 mb-10">
                            {Object.keys(cityDetails).map((city) => (
                                <button
                                    key={city}
                                    onClick={() => setSelectedCity(city)}
                                    className={`px-3.5 py-1 rounded-full font-manrope font-light text-[13px] transition-all text-center ${selectedCity === city ? 'bg-[#333] text-white' : 'bg-gray-100 text-black hover:bg-gray-200'
                                        }`}
                                >
                                    {city}
                                </button>
                            ))}
                        </div>

                        {/* Contact Details Wrapper */}
                        <div className="flex flex-col gap-8 w-full max-w-[576px] min-h-[282px]">
                            {/* Address */}
                            <div className="flex gap-6 items-center">
                                <div className="w-[68px] h-[68px] rounded-full bg-[#E6F6FD] flex items-center justify-center shrink-0">
                                    <div className="w-[40px] h-[40px] rounded-full bg-white flex items-center justify-center text-[#024E82]">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 21C16 16.8 20 12.6 20 8.5C20 4.35786 16.4183 1 12 1C7.58172 1 4 4.35786 4 8.5C4 12.6 8 16.8 12 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M12 11C13.3807 11 14 10.1046 14 9C14 7.89543 13.3807 7 12 7C10.6193 7 10 7.89543 10 9C10 10.1046 10.6193 11 12 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold font-manrope  text-gray-900 mb-1">Address</h3>
                                    <p className="text-sm text-blue-600 leading-relaxed font-manrope ">
                                        {cityDetails[selectedCity].address}
                                    </p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex gap-6 items-center">
                                <div className="w-[68px] h-[68px] rounded-full bg-[#E6F6FD] flex items-center justify-center shrink-0">
                                    <div className="w-[40px] h-[40px] rounded-full bg-white flex items-center justify-center text-[#024E82]">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1 font-manrope ">Phone</h3>
                                    <p className="text-sm text-blue-600 font-manrope ">
                                        {cityDetails[selectedCity].phone} (Support)
                                    </p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex gap-6 items-center">
                                <div className="w-[68px] h-[68px] rounded-full bg-[#E6F6FD] flex items-center justify-center shrink-0">
                                    <div className="w-[40px] h-[40px] rounded-full bg-white flex items-center justify-center text-[#024E82]">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1 font-manrope ">Email</h3>
                                    <a href={`mailto:${cityDetails[selectedCity].email}`} className="text-sm text-blue-600 hover:underline font-manrope ">
                                        {cityDetails[selectedCity].email}
                                    </a>
                                </div>
                            </div>

                            {/* Timings */}
                            <div className="flex gap-6 items-center">
                                <div className="w-[68px] h-[68px] rounded-full bg-[#E6F6FD] flex items-center justify-center shrink-0">
                                    <div className="w-[40px] h-[40px] rounded-full bg-white flex items-center justify-center text-[#024E82]">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <polyline points="12 6 12 12 16 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1 font-manrope ">Timings</h3>
                                    <p className="text-sm text-blue-600 font-manrope ">
                                        <span className="font-semibold text-gray-700 font-manrope ">Monday - Saturday:</span> 10:00 AM - 07:30 PM
                                    </p>
                                    <p className="text-sm text-blue-600 font-manrope ">
                                        <span className="font-semibold text-gray-700 font-manrope ">Sunday:</span> Closed
                                    </p>
                                </div>
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
                    <div className="flex-1">
                        <h1 className="text-4xl font-semibold text-gray-800 mb-3 font-manrope">We are here to help</h1>
                        <p className="text-gray-900 mb-8 max-w-4xl font-manrope font-medium ">
                            Want us to Call you back, Please fill in the form Below and our Executive will reach you as soon as possible.
                        </p>

                        <form className="space-y-6">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1.5 font-manrope ">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter Your Name"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm font-manrope focus:outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 font-manrope ">
                                        Mobile No. <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="+91-9XXXXXXX"
                                        className="w-full border border-gray-300 rounded-lg font-manrope px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 font-manrope ">
                                        Email ID <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="hemxxx@gmail.com"
                                        className="w-full border border-gray-300 rounded-lg font-manrope px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 font-manrope ">
                                        Rental Product <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <select className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-400 focus:outline-none focus:border-blue-500 font-manrope transition-colors appearance-none bg-white">
                                            <option>macbook pro m4</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 font-manrope ">
                                        Requirement City <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <select className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-400 focus:outline-none focus:border-blue-500 font-manrope transition-colors appearance-none bg-white">
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
