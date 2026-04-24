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

    return (
        <div className="font-sans text-gray-800 bg-white">
            {/* Outer Page Wrapper */}
            <div
                className="w-full flex flex-col"
                style={{
                    paddingTop: '28px',
                    gap: '0px',
                    background: 'var(--Color-Scheme-1-Background, hsla(0, 0%, 100%, 1))',
                    opacity: 1
                }}
            >
                {/* Banner Wrapper (Centered grid with responsive protection) */}
                <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8">
                    {/* Inner Banner Container */}
                    <div
                        className="relative overflow-hidden flex items-center justify-center shrink-0 w-full mx-auto"
                        style={{
                            height: '500px',
                            gap: '10px',
                            borderRadius: '32px',
                            opacity: 1
                        }}
                    >
                        <Image
                            src={bannerImage}
                            alt={bannerTitle}
                            fill
                            className="object-cover object-top"
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <h1
                                className="text-white drop-shadow-md relative z-10"
                                style={{
                                    fontFamily: '"Mona Sans", sans-serif',
                                    fontWeight: 600,
                                    fontSize: '48px',
                                    lineHeight: '1.2'
                                }}
                            >
                                {bannerTitle}
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Contact Content Section (1440px Outer Wrapper) */}
                <section
                    className="w-full relative mx-auto"
                    style={{
                        maxWidth: '1440px',
                        height: '676px',
                        paddingTop: '48px',
                        paddingBottom: '96px',
                        background: 'hsla(0, 0%, 100%, 1)',
                        opacity: 1,
                        angle: '0deg'
                    }}
                >
                    {/* Inner Alignment Wrapper (1200px Content Boundary with side gaps) */}
                    <div className="max-w-[1200px] mx-auto w-full px-4 md:px-8">
                        {/* Grid Layer */}
                        <div
                            className="flex flex-col lg:flex-row"
                            style={{
                                minHeight: '532px',
                                gap: '48px'
                            }}
                        >
                            {/* Left Column: Contact Info */}
                            <div
                                className="flex flex-col shrink-0"
                                style={{
                                    maxWidth: '576px',
                                    width: '100%',
                                    height: '516.900390625px',
                                    gap: '20px',
                                    paddingTop: '16px',
                                    paddingBottom: '16px',
                                    opacity: 1,
                                    angle: '0deg'
                                }}
                            >
                                {/* City Pills */}
                                <div className="grid grid-cols-4" style={{ maxWidth: '576px', width: '100%', height: '78px', rowGap: '10px', columnGap: '4px', opacity: 1 }}>
                                    {Object.keys(cityDetails).map((city) => (
                                        <button
                                            key={city}
                                            onClick={() => setSelectedCity(city)}
                                            className={`flex items-center justify-center font-sans font-light text-[13px] transition-all whitespace-nowrap ${selectedCity === city ? 'text-white' : 'text-black hover:bg-gray-200'
                                                }`}
                                            style={{
                                                width: '141px',
                                                height: '34px',
                                                gap: '10px',
                                                paddingTop: '7px',
                                                paddingRight: '40px',
                                                paddingBottom: '7px',
                                                paddingLeft: '40px',
                                                borderRadius: '59px',
                                                background: selectedCity === city ? 'hsla(0, 0%, 20%, 1)' : 'var(--color-grey-grey-100, #F3F4F6)',
                                                opacity: 1
                                            }}
                                        >
                                            {city}
                                        </button>
                                    ))}
                                </div>

                                {/* Contact Details Wrapper */}
                                <div
                                    className="flex flex-col flex-1"
                                    style={{
                                        width: '576px',
                                        height: '282px',
                                        gap: '20px',
                                        opacity: 1,
                                        angle: '0deg'
                                    }}
                                >
                                    {/* Address */}
                                    <div className="flex items-center" style={{ maxWidth: '576px', width: '100%', height: '66px', gap: '20px', marginTop: '14px', opacity: 1, angle: '0deg' }}>
                                        <div className="rounded-full flex items-center justify-center shrink-0 relative" style={{ width: '45px', height: '45px', background: 'hsla(200, 100%, 92%, 1)', opacity: 1, angle: '0deg' }}>
                                            <div className="rounded-full flex items-center justify-center text-[#024E82]" style={{ width: '34px', height: '34px', background: 'hsla(197, 100%, 96%, 1)', position: 'absolute', top: '6px', left: '6px', opacity: 1, angle: '0deg' }}>
                                                <MapPinIcon
                                                    className="text-[hsla(213, 85%, 33%, 1)]"
                                                    style={{
                                                        width: '16px',
                                                        height: '16px',
                                                        position: 'absolute',
                                                        top: '9px',
                                                        left: '9px',
                                                        strokeWidth: '2'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div style={{ width: '511px', height: '46px', opacity: 1 }}>
                                            <h3 className="font-sans" style={{ width: '511px', height: '20px', fontSize: '12px', lineHeight: '16px', fontWeight: 600, color: 'hsla(0, 0%, 20%, 1)', marginBottom: '4px' }}>Address</h3>
                                            <p className="font-sans" style={{ fontSize: '14px', lineHeight: '20px', color: 'hsla(213, 85%, 33%, 1)', fontWeight: 400 }}>
                                                {cms?.contactAddress || cityDetails[selectedCity].address}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div className="flex gap-6 items-center" style={{ maxWidth: '576px', width: '100%', minHeight: '66px', gap: '20px' }}>
                                        <div className="rounded-full flex items-center justify-center shrink-0 relative" style={{ width: '45px', height: '45px', background: 'hsla(200, 100%, 92%, 1)', opacity: 1, angle: '0deg' }}>
                                            <div className="rounded-full flex items-center justify-center text-[#024E82]" style={{ width: '34px', height: '34px', background: 'hsla(197, 100%, 96%, 1)', position: 'absolute', top: '6px', left: '6px', opacity: 1, angle: '0deg' }}>
                                                <PhoneIcon
                                                    className="text-[hsla(213, 85%, 33%, 1)]"
                                                    style={{
                                                        width: '16px',
                                                        height: '16px',
                                                        position: 'absolute',
                                                        top: '9px',
                                                        left: '9px',
                                                        strokeWidth: '2'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div style={{ width: '511px', height: '46px', opacity: 1 }}>
                                            <h3 className="font-sans" style={{ width: '511px', height: '20px', fontSize: '12px', lineHeight: '16px', fontWeight: 600, color: 'hsla(0, 0%, 20%, 1)', marginBottom: '6px' }}>Phone</h3>
                                            <p className="font-sans" style={{ fontSize: '14px', lineHeight: '20px', color: 'hsla(213, 85%, 33%, 1)', fontWeight: 400 }}>
                                                {cms?.contactPhone || cityDetails[selectedCity].phone} (Support)
                                            </p>
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="flex gap-6 items-center" style={{ maxWidth: '576px', width: '100%', minHeight: '66px', gap: '20px' }}>
                                        <div className="rounded-full flex items-center justify-center shrink-0 relative" style={{ width: '45px', height: '45px', background: 'hsla(200, 100%, 92%, 1)', opacity: 1, angle: '0deg' }}>
                                            <div className="rounded-full flex items-center justify-center text-[#024E82]" style={{ width: '34px', height: '34px', background: 'hsla(197, 100%, 96%, 1)', position: 'absolute', top: '6px', left: '6px', opacity: 1, angle: '0deg' }}>
                                                <EnvelopeIcon
                                                    className="text-[hsla(213, 85%, 33%, 1)]"
                                                    style={{
                                                        width: '16px',
                                                        height: '16px',
                                                        position: 'absolute',
                                                        top: '9px',
                                                        left: '9px',
                                                        strokeWidth: '2'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div style={{ width: '511px', height: '46px', opacity: 1 }}>
                                            <h3 className="font-sans" style={{ width: '511px', height: '20px', fontSize: '12px', lineHeight: '16px', fontWeight: 600, color: 'hsla(0, 0%, 20%, 1)', marginBottom: '4px' }}>Email</h3>
                                            <a href={`mailto:${cms?.contactEmail || cityDetails[selectedCity].email}`} className="font-sans hover:underline" style={{ fontSize: '14px', lineHeight: '20px', color: 'hsla(213, 85%, 33%, 1)', fontWeight: 400, display: 'block' }}>
                                                {cms?.contactEmail || cityDetails[selectedCity].email}
                                            </a>
                                        </div>
                                    </div>

                                    {/* Timings */}
                                    <div className="flex gap-6 items-center" style={{ maxWidth: '576px', width: '100%', minHeight: '66px', gap: '20px' }}>
                                        <div className="rounded-full flex items-center justify-center shrink-0 relative" style={{ width: '45px', height: '45px', background: 'hsla(200, 100%, 92%, 1)', opacity: 1, angle: '0deg' }}>
                                            <div className="rounded-full flex items-center justify-center text-[#024E82]" style={{ width: '34px', height: '34px', background: 'hsla(197, 100%, 96%, 1)', position: 'absolute', top: '6px', left: '6px', opacity: 1, angle: '0deg' }}>
                                                <ClockIcon
                                                    className="text-[hsla(213, 85%, 33%, 1)]"
                                                    style={{
                                                        width: '16px',
                                                        height: '16px',
                                                        position: 'absolute',
                                                        top: '9px',
                                                        left: '9px',
                                                        strokeWidth: '2'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div style={{ width: '511px', height: '46px', opacity: 1 }}>
                                            <h3 className="font-sans" style={{ width: '511px', height: '20px', fontSize: '12px', lineHeight: '16px', fontWeight: 600, color: 'hsla(0, 0%, 20%, 1)', marginBottom: '4px' }}>Timings</h3>
                                            <p className="font-sans" style={{ fontSize: '14px', lineHeight: '20px', color: 'hsla(213, 85%, 33%, 1)', fontWeight: 400 }}>
                                                <span style={{ fontWeight: 700 }}>Monday – Saturday:</span> 10:00 AM – 07:30 PM
                                            </p>
                                            <p className="font-sans" style={{ fontSize: '14px', lineHeight: '20px', color: 'hsla(213, 85%, 33%, 1)', fontWeight: 400 }}>
                                                <span style={{ fontWeight: 700 }}>Sunday:</span> Closed
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Social Icons */}
                                <div
                                    className="flex items-center"
                                    style={{
                                        width: '576px',
                                        height: '34.90039825439453px',
                                        gap: '10px',
                                        paddingLeft: '1px',
                                        marginTop: '80px',
                                        opacity: 1,
                                        angle: '0deg'
                                    }}
                                >
                                    <span className="text-gray-600 font-medium">Follow Us</span>
                                    <a href={`https://wa.me/${cms?.contactWhatsApp || '911234567890'}`} className="w-10 h-10 rounded-full bg-white shadow border border-gray-100 flex items-center justify-center text-green-500 hover:scale-110 transition-transform">
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
                            <div
                                className="flex flex-col flex-1"
                                style={{
                                    maxWidth: '576px',
                                    width: '100%',
                                    height: '532px',
                                    gap: '24px',
                                    opacity: 1,
                                    angle: '0deg'
                                }}
                            >
                                {/* Headers */}
                                <div
                                    className="flex flex-col w-full"
                                    style={{
                                        maxWidth: '576px',
                                        height: '103px',
                                        gap: '12px',
                                        opacity: 1
                                    }}
                                >
                                    <h1 className="text-[40px] leading-[48px] font-semibold text-[#1A1A1A] tracking-[-0.02em] font-sans">
                                        {contactTitle}
                                    </h1>
                                    <p className="text-[#4D4D4D] text-[16px] leading-[24px] max-w-[500px] font-sans font-normal">
                                        {contactSubtitle}
                                    </p>
                                </div>

                                <form className="flex flex-col flex-1" style={{ gap: '24px' }}>
                                    <div
                                        className="flex flex-col"
                                        style={{
                                            maxWidth: '576px',
                                            width: '100%',
                                            minHeight: '330px',
                                            gap: '24px',
                                            opacity: 1
                                        }}
                                    >
                                        <div className="flex flex-col w-full" style={{ height: '59px', gap: '4px', opacity: 1, angle: '0deg' }}>
                                            <label
                                                className="text-[12px] leading-[16px] font-[600] h-[16px]"
                                                style={{ fontFamily: '"Mona Sans", sans-serif', color: 'hsla(0, 0%, 33%, 1)' }}
                                            >
                                                Full Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Enter Your Name"
                                                className="w-full rounded-md px-4 h-[39px] text-sm font-sans focus:outline-none focus:border-blue-500 transition-colors"
                                                style={{ border: '1px solid hsla(0, 0%, 89%, 1)', background: 'hsla(0, 0%, 100%, 1)', opacity: 1 }}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '24px' }}>
                                            <div className="flex flex-col w-full" style={{ height: '59px', gap: '4px' }}>
                                                <label
                                                    className="text-[12px] leading-[16px] font-[600] h-[16px]"
                                                    style={{ fontFamily: '"Mona Sans", sans-serif', color: 'hsla(0, 0%, 33%, 1)' }}
                                                >
                                                    Mobile No. <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="+91-9XXXXXXX"
                                                    className="w-full rounded-md font-sans px-4 h-[39px] text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                                    style={{ border: '1px solid hsla(0, 0%, 89%, 1)', background: 'hsla(0, 0%, 100%, 1)', opacity: 1 }}
                                                />
                                            </div>
                                            <div className="flex flex-col w-full" style={{ height: '59px', gap: '4px' }}>
                                                <label
                                                    className="text-[12px] leading-[16px] font-[600] h-[16px]"
                                                    style={{ fontFamily: '"Mona Sans", sans-serif', color: 'hsla(0, 0%, 33%, 1)' }}
                                                >
                                                    Email ID <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    placeholder="hemxxx@gmail.com"
                                                    className="w-full rounded-md font-sans px-4 h-[39px] text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                                    style={{ border: '1px solid hsla(0, 0%, 89%, 1)', background: 'hsla(0, 0%, 100%, 1)', opacity: 1 }}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '24px' }}>
                                            <div className="flex flex-col w-full" style={{ height: '59px', gap: '4px' }}>
                                                <label
                                                    className="text-[12px] leading-[16px] font-[600] h-[16px]"
                                                    style={{ fontFamily: '"Mona Sans", sans-serif', color: 'hsla(0, 0%, 33%, 1)' }}
                                                >
                                                    Rental Product <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative w-full h-[39px]" style={{ opacity: 1 }}>
                                                    <select
                                                        className="w-full h-full rounded-md px-4 text-sm text-gray-400 focus:outline-none focus:border-blue-500 font-sans transition-colors appearance-none"
                                                        style={{ border: '1px solid hsla(0, 0%, 89%, 1)', background: 'hsla(0, 0%, 100%, 1)' }}
                                                    >
                                                        <option>macbook pro m4</option>
                                                    </select>
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col w-full" style={{ height: '59px', gap: '4px' }}>
                                                <label
                                                    className="text-[12px] leading-[16px] font-[600] h-[16px]"
                                                    style={{ fontFamily: '"Mona Sans", sans-serif', color: 'hsla(0, 0%, 33%, 1)' }}
                                                >
                                                    Requirement City <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative w-full h-[39px]" style={{ opacity: 1 }}>
                                                    <select
                                                        className="w-full h-full rounded-md px-4 text-sm text-gray-400 focus:outline-none focus:border-blue-500 font-sans transition-colors appearance-none"
                                                        style={{ border: '1px solid hsla(0, 0%, 89%, 1)', background: 'hsla(0, 0%, 100%, 1)' }}
                                                    >
                                                        <option>Delhi....</option>
                                                    </select>
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col" style={{ maxWidth: '576px', width: '100%', height: '93px', gap: '4px', opacity: 1, angle: '0deg' }}>
                                            <label
                                                className="text-[12px] leading-[16px] font-[600] h-[16px]"
                                                style={{ fontFamily: '"Mona Sans", sans-serif', color: 'hsla(0, 0%, 33%, 1)' }}
                                            >
                                                Message
                                            </label>
                                            <textarea
                                                placeholder="Write to us......"
                                                className="w-full h-[73px] rounded-md text-sm font-sans focus:outline-none focus:border-blue-500 transition-colors resize-none"
                                                style={{ border: '1px solid hsla(0, 0%, 89%, 1)', background: 'hsla(0, 0%, 100%, 1)', opacity: 1, paddingTop: '12px', paddingLeft: '8px' }}
                                            ></textarea>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" id="privacy" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                        <label htmlFor="privacy" className="text-xs text-gray-700">
                                            You agree to our friendly <span className="font-bold">privacy policy</span>
                                        </label>
                                    </div>

                                    <button
                                        className="w-full bg-[#007bff] hover:bg-[#0069d9] text-white font-normal transition-colors shadow-lg text-[16px]"
                                        style={{
                                            padding: '6px 20px',
                                            borderRadius: '32px',
                                            opacity: 1
                                        }}
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
