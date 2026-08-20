'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaWhatsapp, FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ContactPage() {
    const [selectedCity, setSelectedCity] = useState('Delhi');
    const [cms, setCms] = useState(null);

    const [form, setForm] = useState({
        fullName: '',
        mobile: '',
        email: '',
        product: 'macbook pro m4',
        city: 'Delhi',
        message: '',
        agree: false
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState('');

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
        'Hyderabad': {
            address: '11-6-837/C, Red Hills, Lakdi Ka Pul, Hyderabad, Telangana - 500004',
            phone: '8510842741',
            email: 'hyd-support@indianrenters.com'
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
        'Chennai': {
            address: 'No. 12, Nungambakkam High Road, Chennai, Tamil Nadu - 600034',
            phone: '9870533392',
            email: 'chennai@indianrenters.com'
        },
        'Kolkata': {
            address: 'Plot No. 5, Block BP, Sector V, Salt Lake, Kolkata, West Bengal - 700091',
            phone: '9870533392',
            email: 'kolkata@indianrenters.com'
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.agree) {
            setSubmitStatus('Please agree to the privacy policy before submitting.');
            return;
        }
        setSubmitting(true);
        setSubmitStatus('');
        try {
            await new Promise(r => setTimeout(r, 1000));
            setSubmitStatus('Thank you! Your query has been submitted successfully.');
            setForm({ fullName: '', mobile: '', email: '', product: 'macbook pro m4', city: 'Delhi', message: '', agree: false });
        } catch (err) {
            setSubmitStatus('Failed to submit form. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const ContactRow = ({ Icon, label, children }) => (
        <div className="flex items-center gap-5 w-full">
            <div className="rounded-full flex items-center justify-center shrink-0 w-[45px] h-[45px] bg-[#d6f1ff]">
                <div className="rounded-full flex items-center justify-center w-[34px] h-[34px] bg-[#edfaff]">
                    <Icon className="w-4 h-4 text-[#0d4e9b]" strokeWidth={2} />
                </div>
            </div>
            <div className="flex-1 min-w-0 tracking-[-0.4px]">
                <h3 className="font-sans font-semibold text-[#333333] text-[10px] md:text-[12px] leading-4 mb-1">{label}</h3>
                {children}
            </div>
        </div>
    );

    return (
        <div className="font-sans text-gray-800 bg-white">
            <div className="w-full flex flex-col pt-5 md:pt-7 bg-white">
                <div className="w-full max-w-[1200px] mx-auto px-5 md:px-8">
                    <div className="relative overflow-hidden flex items-center justify-center w-full mx-auto rounded-2xl md:rounded-[32px] h-[197px] md:h-[500px]">
                        <Image src={bannerImage} alt={bannerTitle} fill className="object-cover object-top" />
                        <div className="absolute inset-0 bg-black/20" />
                        <h1 className="relative z-10 text-white drop-shadow-md font-semibold text-[21px] md:text-5xl text-center tracking-[-0.8px]">
                            {bannerTitle}
                        </h1>
                    </div>
                </div>
                <section className="w-full mx-auto max-w-[1440px] pt-4 md:pt-12 pb-12 md:pb-24 bg-white">
                    <div className="max-w-[1200px] mx-auto w-full px-5 md:px-8">
                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                            <div className="flex flex-col w-full lg:max-w-[576px] gap-5 py-4">
                                <div className="grid grid-cols-4 gap-2 w-full">
                                    {Object.keys(cityDetails).map((city) => (
                                        <button
                                            key={city}
                                            type="button"
                                            onClick={() => {
                                                setSelectedCity(city);
                                                setForm(p => ({ ...p, city }));
                                            }}
                                            className={`flex items-center justify-center rounded-full font-sans font-normal whitespace-nowrap overflow-hidden transition-all text-[12px] tracking-[-0.4px] px-2 py-[7px] ${selectedCity === city
                                                    ? 'bg-[#333333] text-[#eeeeee]'
                                                    : 'bg-[#eeeeee] text-[#333333] hover:bg-gray-300'
                                                }`}
                                        >
                                            {city}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex flex-col gap-5 w-full mt-2 md:mt-3.5">
                                    <ContactRow Icon={MapPinIcon} label="Address">
                                        <p className="font-sans font-normal text-[#0d4e9b] text-[12px] md:text-[14px] leading-[18px] md:leading-5">
                                            {cms?.contactAddress || cityDetails[selectedCity]?.address}
                                        </p>
                                    </ContactRow>
                                    <ContactRow Icon={PhoneIcon} label="Phone">
                                        <p className="font-sans font-normal text-[#0d4e9b] text-[12px] md:text-[14px] leading-[18px] md:leading-5">
                                            {cms?.contactPhone || cityDetails[selectedCity]?.phone} (Support)
                                        </p>
                                    </ContactRow>
                                    <ContactRow Icon={EnvelopeIcon} label="Email">
                                        <a
                                            href={`mailto:${cms?.contactEmail || cityDetails[selectedCity]?.email}`}
                                            className="block font-sans font-normal text-[#0d4e9b] hover:underline text-[12px] md:text-[14px] leading-[18px] md:leading-5 break-all"
                                        >
                                            {cms?.contactEmail || cityDetails[selectedCity]?.email}
                                        </a>
                                    </ContactRow>
                                    <ContactRow Icon={ClockIcon} label="Timings">
                                        <p className="font-sans font-normal text-[#0d4e9b] text-[12px] md:text-[14px] leading-[18px] md:leading-5">
                                            <span className="font-bold">Monday – Saturday:</span> 10:00 AM – 07:30 PM
                                        </p>
                                        <p className="font-sans font-normal text-[#0d4e9b] text-[12px] md:text-[14px] leading-[18px] md:leading-5">
                                            <span className="font-bold">Sunday:</span> Closed
                                        </p>
                                    </ContactRow>
                                </div>
                                <div className="flex items-center gap-2.5 mt-2 md:mt-10">
                                    <span className="text-[#757575] font-bold text-[16px] tracking-[-0.4px] mr-1">Follow Us</span>
                                    <a
                                        href={`https://wa.me/${cms?.contactWhatsApp || '919870533392'}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-[35px] h-[35px] rounded-full bg-white border border-[#e2e2e2] flex items-center justify-center text-green-600 hover:scale-110 transition-transform"
                                    >
                                        <FaWhatsapp size={18} />
                                    </a>
                                    <a
                                        href="#"
                                        className="w-[35px] h-[35px] rounded-full bg-white border border-[#e2e2e2] flex items-center justify-center text-blue-600 hover:scale-110 transition-transform"
                                    >
                                        <FaFacebookF size={16} />
                                    </a>
                                    <a
                                        href="#"
                                        className="w-[35px] h-[35px] rounded-full bg-white border border-[#e2e2e2] flex items-center justify-center text-pink-600 hover:scale-110 transition-transform"
                                    >
                                        <FaInstagram size={18} />
                                    </a>
                                    <a
                                        href="#"
                                        className="w-[35px] h-[35px] rounded-full bg-white border border-[#e2e2e2] flex items-center justify-center text-blue-700 hover:scale-110 transition-transform"
                                    >
                                        <FaLinkedinIn size={16} />
                                    </a>
                                </div>
                            </div>
                            <div className="flex flex-col flex-1 w-full lg:max-w-[576px] gap-4">
                                <div className="flex flex-col w-full gap-3">
                                    <h2 className="font-semibold text-[#333333] tracking-[-0.8px] font-sans text-[27px] md:text-[40px] leading-[35px] md:leading-[48px]">
                                        {contactTitle}
                                    </h2>
                                    <p className="text-[#545454] font-sans font-medium text-[12px] md:text-[16px] leading-[16px] md:leading-6 tracking-[-0.4px]">
                                        {contactSubtitle}
                                    </p>
                                </div>
                                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-3 w-full">
                                        <div className="flex flex-col w-full gap-1">
                                            <div className="flex gap-px items-start text-[12px] tracking-[-0.4px] leading-4">
                                                <span className="font-semibold text-[#545454]">Full Name</span>
                                                <span className="font-medium text-[#ed2115]">*</span>
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                value={form.fullName}
                                                onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
                                                placeholder="Enter Your Name"
                                                className="w-full rounded-lg px-3 h-[39px] text-[12px] font-medium tracking-[-0.4px] text-[#333333] border border-[#e2e2e2] bg-white placeholder:text-[#afafaf] focus:outline-none focus:border-[#0075ff]"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="flex flex-col w-full gap-1">
                                                <div className="flex gap-px items-start text-[12px] tracking-[-0.4px] leading-4">
                                                    <span className="font-semibold text-[#545454]">Mobile No.</span>
                                                    <span className="font-medium text-[#ed2115]">*</span>
                                                </div>
                                                <input
                                                    type="text"
                                                    required
                                                    value={form.mobile}
                                                    onChange={e => setForm(p => ({ ...p, mobile: e.target.value }))}
                                                    placeholder="+91-9XXXXXXX"
                                                    className="w-full rounded-lg px-3 h-[39px] text-[12px] font-medium tracking-[-0.4px] text-[#333333] border border-[#e2e2e2] bg-white placeholder:text-[#afafaf] focus:outline-none focus:border-[#0075ff]"
                                                />
                                            </div>
                                            <div className="flex flex-col w-full gap-1">
                                                <div className="flex gap-px items-start text-[12px] tracking-[-0.4px] leading-4">
                                                    <span className="font-semibold text-[#545454]">Email ID</span>
                                                    <span className="font-medium text-[#ed2115]">*</span>
                                                </div>
                                                <input
                                                    type="email"
                                                    required
                                                    value={form.email}
                                                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                                                    placeholder="hemxxx@gmail.com"
                                                    className="w-full rounded-lg px-3 h-[39px] text-[12px] font-medium tracking-[-0.4px] text-[#333333] border border-[#e2e2e2] bg-white placeholder:text-[#afafaf] focus:outline-none focus:border-[#0075ff]"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="flex flex-col w-full gap-1">
                                                <div className="flex gap-px items-start text-[12px] tracking-[-0.4px] leading-4">
                                                    <span className="font-semibold text-[#545454]">Rental Product</span>
                                                    <span className="font-medium text-[#ed2115]">*</span>
                                                </div>
                                                <div className="relative w-full h-[39px]">
                                                    <select
                                                        value={form.product}
                                                        onChange={e => setForm(p => ({ ...p, product: e.target.value }))}
                                                        className="w-full h-full rounded-lg px-3 text-[12px] font-medium tracking-[-0.4px] text-[#333333] border border-[#e2e2e2] bg-white focus:outline-none focus:border-[#0075ff] appearance-none"
                                                    >
                                                        <option value="macbook pro m4">Macbook Pro M4</option>
                                                        <option value="macbook air">Macbook Air</option>
                                                        <option value="dell xps">Dell XPS</option>
                                                        <option value="gaming pc">Gaming PC</option>
                                                        <option value="ipad pro">iPad Pro</option>
                                                        <option value="other">Other Equipment</option>
                                                    </select>
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                        <ChevronDownIcon className="w-3.5 h-3.5 text-[#545454]" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col w-full gap-1">
                                                <div className="flex gap-px items-start text-[12px] tracking-[-0.4px] leading-4">
                                                    <span className="font-semibold text-[#545454]">Requirement City</span>
                                                    <span className="font-medium text-[#ed2115]">*</span>
                                                </div>
                                                <div className="relative w-full h-[39px]">
                                                    <select
                                                        value={form.city}
                                                        onChange={e => {
                                                            setForm(p => ({ ...p, city: e.target.value }));
                                                            setSelectedCity(e.target.value);
                                                        }}
                                                        className="w-full h-full rounded-lg px-3 text-[12px] font-medium tracking-[-0.4px] text-[#333333] border border-[#e2e2e2] bg-white focus:outline-none focus:border-[#0075ff] appearance-none"
                                                    >
                                                        {Object.keys(cityDetails).map(c => (
                                                            <option key={c} value={c}>{c}</option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                        <ChevronDownIcon className="w-3.5 h-3.5 text-[#545454]" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col w-full gap-1">
                                            <label className="text-[12px] leading-4 font-medium text-[#333333] tracking-[-0.4px]">
                                                Message
                                            </label>
                                            <textarea
                                                value={form.message}
                                                onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                                                placeholder="Write to us....."
                                                className="w-full h-[74px] rounded-lg p-3 text-[12px] font-medium text-[#333333] tracking-[-0.4px] border border-[#cbcbcb] bg-white placeholder:text-[#cbcbcb] focus:outline-none focus:border-[#0075ff] resize-none"
                                            />
                                        </div>
                                    </div>
                                    <label className="flex items-center gap-[7px] cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={form.agree}
                                            onChange={e => setForm(p => ({ ...p, agree: e.target.checked }))}
                                            className="size-[14px] rounded border-[#afafaf] text-[#ffcf46] focus:ring-[#ffcf46]"
                                        />
                                        <span className="text-[12px] font-normal text-[#545454] tracking-[-0.4px]">
                                            You agree to our friendly <a href="/privacy-policy" className="font-bold underline text-[#545454]">privacy policy</a>
                                        </span>
                                    </label>
                                    {submitStatus && (
                                        <p className={`text-xs font-medium ${submitStatus.includes('Thank') ? 'text-green-600' : 'text-red-600'}`}>
                                            {submitStatus}
                                        </p>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full h-[35px] bg-[#ffcf46] md:bg-[#0075ff] hover:opacity-90 text-[#1f1f1f] md:text-white font-medium text-[16px] tracking-[-0.4px] leading-[23px] rounded-[28px] flex items-center justify-center transition-all disabled:opacity-60 shadow-sm"
                                    >
                                        {submitting ? 'Submitting…' : 'Submit'}
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
