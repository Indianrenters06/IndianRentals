'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaWhatsapp, FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon } from '@heroicons/react/24/outline';

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ContactPage() {
    const [selectedCity, setSelectedCity] = React.useState('Delhi');
    const [cms, setCms] = useState(null);

    useEffect(() => {
        window.fetch(`${API}/api/cms/contact?t=${Date.now()}`)
            .then(r => r.ok ? r.json() : null)
            .then(d => { if (d) setCms(d); })
            .catch(() => { });
    }, []);

    const bannerImage = cms?.bannerImage || "https://res.cloudinary.com/dgkckcdk8/image/upload/v1770615662/indian-rentals/ythxavcpd8hd4yerh8y0.jpg";
    const bannerTitle = cms?.bannerTitle || "Contact Us";
    const contactTitle = cms?.contactTitle || "We are here to help";
    const contactSubtitle = cms?.contactSubtitle || "Want us to Call you back, Please fill in the form Below and our Executive will reach you as soon as possible.";


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

    // Shared contact-detail row — icon badge + label/value
    const ContactRow = ({ Icon, label, children }) => (
        <div className="flex items-center gap-5 w-full">
            <div className="rounded-full flex items-center justify-center shrink-0 w-[45px] h-[45px] bg-[#d6f1ff]">
                <div className="rounded-full flex items-center justify-center w-[34px] h-[34px] bg-[#edfaff]">
                    <Icon className="w-4 h-4 text-[#0d4e9b]" strokeWidth={2} />
                </div>
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="font-sans font-semibold text-[#333] text-[10px] md:text-[12px] leading-4 mb-1">{label}</h3>
                {children}
            </div>
        </div>
    );

    return (
        <div className="font-sans text-gray-800 bg-white">
            {/* Outer Page Wrapper */}
            <div className="w-full flex flex-col pt-5 md:pt-7 bg-white">

                {/* Banner */}
                <div className="w-full max-w-[1200px] mx-auto px-5 md:px-8">
                    <div className="relative overflow-hidden flex items-center justify-center w-full mx-auto rounded-2xl md:rounded-[32px] h-[197px] md:h-[500px]">
                        <Image src={bannerImage} alt={bannerTitle} fill className="object-cover object-top" />
                        <div className="absolute inset-0 bg-black/20 md:bg-transparent" />
                        <h1 className="relative z-10 text-white drop-shadow-md font-semibold font-sans text-base md:text-5xl">
                            {bannerTitle}
                        </h1>
                    </div>
                </div>

                {/* Contact Content Section */}
                <section className="w-full mx-auto max-w-[1440px] pt-12 pb-12 md:pb-24 bg-white">
                    <div className="max-w-[1200px] mx-auto w-full px-5 md:px-8">
                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

                            {/* Left Column: Contact Info */}
                            <div className="flex flex-col w-full lg:max-w-[576px] gap-5 py-4">
                                {/* City Pills */}
                                <div className="grid grid-cols-4 gap-x-1 gap-y-2.5 w-full">
                                    {Object.keys(cityDetails).map((city) => (
                                        <button
                                            key={city}
                                            onClick={() => setSelectedCity(city)}
                                            className={`flex items-center justify-center rounded-[59px] font-sans font-light whitespace-nowrap overflow-hidden transition-all text-[10px] md:text-[13px] px-1 md:px-10 py-[7px] ${selectedCity === city ? 'bg-[#333] text-white' : 'bg-[#eee] text-black hover:bg-gray-200'}`}
                                        >
                                            {city}
                                        </button>
                                    ))}
                                </div>

                                {/* Contact Details */}
                                <div className="flex flex-col gap-5 w-full mt-2 md:mt-3.5">
                                    <ContactRow Icon={MapPinIcon} label="Address">
                                        <p className="font-sans font-normal text-[#0d4e9b] text-xs md:text-[14px] leading-[18px] md:leading-5">
                                            {cms?.contactAddress || cityDetails[selectedCity].address}
                                        </p>
                                    </ContactRow>

                                    <ContactRow Icon={PhoneIcon} label="Phone">
                                        <p className="font-sans font-normal text-[#0d4e9b] text-xs md:text-[14px] leading-[18px] md:leading-5">
                                            {cms?.contactPhone || cityDetails[selectedCity].phone} (Support)
                                        </p>
                                    </ContactRow>

                                    <ContactRow Icon={EnvelopeIcon} label="Email">
                                        <a href={`mailto:${cms?.contactEmail || cityDetails[selectedCity].email}`} className="block font-sans font-normal text-[#0d4e9b] hover:underline text-xs md:text-[14px] leading-[18px] md:leading-5 break-all">
                                            {cms?.contactEmail || cityDetails[selectedCity].email}
                                        </a>
                                    </ContactRow>

                                    <ContactRow Icon={ClockIcon} label="Timings">
                                        <p className="font-sans font-normal text-[#0d4e9b] text-xs md:text-[14px] leading-[18px] md:leading-5">
                                            <span className="font-bold">Monday – Saturday:</span> 10:00 AM – 07:30 PM
                                        </p>
                                        <p className="font-sans font-normal text-[#0d4e9b] text-xs md:text-[14px] leading-[18px] md:leading-5">
                                            <span className="font-bold">Sunday:</span> Closed
                                        </p>
                                    </ContactRow>
                                </div>

                                {/* Social Icons */}
                                <div className="flex items-center gap-2.5 mt-4 md:mt-20">
                                    <span className="text-gray-500 font-bold text-xs">Follow Us</span>
                                    <a href={`https://wa.me/${cms?.contactWhatsApp || '911234567890'}`} className="w-9 h-9 rounded-full bg-white shadow border border-gray-100 flex items-center justify-center text-green-500 hover:scale-110 transition-transform">
                                        <FaWhatsapp size={18} />
                                    </a>
                                    <a href="#" className="w-9 h-9 rounded-full bg-white shadow border border-gray-100 flex items-center justify-center text-blue-600 hover:scale-110 transition-transform">
                                        <FaFacebookF size={16} />
                                    </a>
                                    <a href="#" className="w-9 h-9 rounded-full bg-white shadow border border-gray-100 flex items-center justify-center text-pink-600 hover:scale-110 transition-transform">
                                        <FaInstagram size={18} />
                                    </a>
                                    <a href="#" className="w-9 h-9 rounded-full bg-white shadow border border-gray-100 flex items-center justify-center text-blue-700 hover:scale-110 transition-transform">
                                        <FaLinkedinIn size={16} />
                                    </a>
                                </div>
                            </div>

                            {/* Right Column: Form */}
                            <div className="flex flex-col flex-1 w-full lg:max-w-[576px] gap-6">
                                {/* Headers */}
                                <div className="flex flex-col w-full gap-3">
                                    <h2 className="font-semibold text-[#1A1A1A] tracking-[-0.02em] font-sans text-xl md:text-[40px] leading-[26px] md:leading-[48px]">
                                        {contactTitle}
                                    </h2>
                                    <p className="text-[#4D4D4D] font-sans font-normal max-w-[500px] text-[10px] md:text-[16px] leading-[14px] md:leading-6">
                                        {contactSubtitle}
                                    </p>
                                </div>

                                <form className="flex flex-col gap-6">
                                    <div className="flex flex-col gap-4 md:gap-6 w-full">
                                        <div className="flex flex-col w-full gap-1">
                                            <label className="text-[10px] md:text-[12px] leading-[16px] font-semibold text-[#545454] font-sans">
                                                Full Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Enter Your Name"
                                                className="w-full rounded-md px-4 h-[39px] text-xs md:text-sm font-sans border border-[#e2e2e2] bg-white focus:outline-none focus:border-blue-500 transition-colors"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 md:gap-6">
                                            <div className="flex flex-col w-full gap-1">
                                                <label className="text-[10px] md:text-[12px] leading-[16px] font-semibold text-[#545454] font-sans">
                                                    Mobile No. <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="+91-9XXXXXXX"
                                                    className="w-full rounded-md px-4 h-[39px] text-xs md:text-sm font-sans border border-[#e2e2e2] bg-white focus:outline-none focus:border-blue-500 transition-colors"
                                                />
                                            </div>
                                            <div className="flex flex-col w-full gap-1">
                                                <label className="text-[10px] md:text-[12px] leading-[16px] font-semibold text-[#545454] font-sans">
                                                    Email ID <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    placeholder="hemxxx@gmail.com"
                                                    className="w-full rounded-md px-4 h-[39px] text-xs md:text-sm font-sans border border-[#e2e2e2] bg-white focus:outline-none focus:border-blue-500 transition-colors"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 md:gap-6">
                                            <div className="flex flex-col w-full gap-1">
                                                <label className="text-[10px] md:text-[12px] leading-[16px] font-semibold text-[#545454] font-sans">
                                                    Rental Product <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative w-full h-[39px]">
                                                    <select className="w-full h-full rounded-md px-4 text-xs md:text-sm text-gray-400 font-sans border border-[#e2e2e2] bg-white focus:outline-none focus:border-blue-500 transition-colors appearance-none">
                                                        <option>macbook pro m4</option>
                                                    </select>
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col w-full gap-1">
                                                <label className="text-[10px] md:text-[12px] leading-[16px] font-semibold text-[#545454] font-sans">
                                                    Requirement City <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative w-full h-[39px]">
                                                    <select className="w-full h-full rounded-md px-4 text-xs md:text-sm text-gray-400 font-sans border border-[#e2e2e2] bg-white focus:outline-none focus:border-blue-500 transition-colors appearance-none">
                                                        <option>Delhi....</option>
                                                    </select>
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col w-full gap-1">
                                            <label className="text-[10px] md:text-[12px] leading-[16px] font-semibold text-[#545454] font-sans">
                                                Message
                                            </label>
                                            <textarea
                                                placeholder="Write to us......"
                                                className="w-full h-[74px] rounded-md px-2 pt-3 text-xs md:text-sm font-sans border border-[#cbcbcb] bg-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                                            ></textarea>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" id="privacy" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                        <label htmlFor="privacy" className="text-[10px] md:text-xs text-gray-600">
                                            You agree to our friendly <span className="font-bold underline">privacy policy</span>
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-[#0075ff] hover:bg-[#0069d9] text-white font-normal transition-colors shadow-lg rounded-[28px] md:rounded-[32px] py-1.5 px-5 text-xs md:text-[16px]"
                                    >
                                        Submit
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
