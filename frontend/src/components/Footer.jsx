"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa';
import { useSettings } from '../context/SettingsContext';

const paymentLogos = [
    "https://res.cloudinary.com/dpu9ikeqe/image/upload/v1774477006/1ea1887d77efce07ed8c13aecef4c18d75fddf84_oq3qmc.png",
    "https://res.cloudinary.com/dpu9ikeqe/image/upload/v1774477006/43e892522e4d7cd8b9640d32b817ce5d99b2fd18_gfptzj.png",
    "https://res.cloudinary.com/dpu9ikeqe/image/upload/v1774477005/b5f5de03b48b1e4460cf20fd295ad96cc3c1fa35_sitcbh.png",
    "https://res.cloudinary.com/dpu9ikeqe/image/upload/v1774477006/2a84eda31c8a80fed3b9bc10e13d0243d2047d84_ewds3r.png"
];

const Footer = () => {
    const { settings } = useSettings();
    const siteLogo = settings?.siteLogo || "https://res.cloudinary.com/dpu9ikeqe/image/upload/v1771271177/1d1f7c4e3c0490bcddb69ceb328c67be2f7cf361_cf3y9m.png";
    const siteName = settings?.siteName || "Indian Renters";
    const sitePhone = settings?.contactPhone || "+91 9999999999";
    const currentYear = new Date().getFullYear();
    const copyrightName = settings?.siteName || "AAA Rental LLP";

    return (
        <>
            {/* ── Desktop Footer ── */}
            <footer
                className="hidden md:flex flex-col w-full items-center"
                style={{
                    background: 'hsla(0, 0%, 96%, 1)',
                    borderTop: '1px solid hsla(0, 0%, 89%, 1)',
                    paddingTop: '36px',
                    paddingBottom: '0px',
                    gap: '20px'
                }}
            >
                {/* Inner container: 1200px wide, 176px height, space-between */}
                <div className="w-full max-w-[1200px] px-4 sm:px-6">
                    <div
                        className="flex flex-row items-start justify-between"
                        style={{ height: '176px', gap: '20px' }}
                    >
                        {/* Brand Column */}
                        <div className="flex flex-col gap-4 shrink-0">
                            <Link href="/" className="inline-block">
                                <Image
                                    src={siteLogo}
                                    alt={siteName}
                                    width={270}
                                    height={72}
                                    className="h-[72px] w-auto object-contain"
                                />
                            </Link>
                            <p className="text-gray-800 text-[13px] font-medium">
                                Rent Anything, Anytime, Anywhere
                            </p>
                            <div className="flex items-center gap-3">
                                <a href={`https://wa.me/${sitePhone.replace(/[^\d]/g, '')}`} className="transition-opacity hover:opacity-70" target="_blank" rel="noopener noreferrer">
                                    <FaWhatsapp size={22} className="text-[#25D366]" />
                                </a>
                                <a href="#" className="transition-opacity hover:opacity-70">
                                    <FaFacebookF size={20} className="text-[#1877F2]" />
                                </a>
                                <a href="#" className="transition-opacity hover:opacity-70">
                                    <FaInstagram size={22} className="text-[#E4405F]" />
                                </a>
                                <a href="#" className="transition-opacity hover:opacity-70">
                                    <FaLinkedinIn size={20} className="text-[#0A66C2]" />
                                </a>
                            </div>
                        </div>

                        {/* Links — 3 columns */}
                        <div 
                            className="flex flex-row justify-between"
                            style={{ width: '600px', height: '176px' }}
                        >
                            {/* Column 1 */}
                            <ul className="flex flex-col gap-5 text-[hsla(0,0%,0%,1)] font-manrope font-medium text-[14px] tracking-tight leading-none">
                                <li><Link href="/about" className="hover:opacity-70 transition-opacity">About Us</Link></li>
                                <li><Link href="/how-it-works" className="hover:opacity-70 transition-opacity">How It Works</Link></li>
                                <li><Link href="/careers" className="hover:opacity-70 transition-opacity">Jobs &amp; Careers</Link></li>
                                <li><Link href="/contact" className="hover:opacity-70 transition-opacity">Contact</Link></li>
                                <li><Link href="/b2b" className="hover:opacity-70 transition-opacity">IndianRenters (B2B Link)</Link></li>
                            </ul>
                            {/* Column 2 */}
                            <ul className="flex flex-col gap-5 text-[hsla(0,0%,0%,1)] font-manrope font-medium text-[14px] tracking-tight leading-none">
                                <li><Link href="/kyc-policy" className="hover:opacity-70 transition-opacity">KYC Policy</Link></li>
                                <li><Link href="/shipping-policy" className="hover:opacity-70 transition-opacity">Shipping Policy</Link></li>
                                <li><Link href="/return-policy" className="hover:opacity-70 transition-opacity">Return Policy</Link></li>
                                <li><Link href="/privacy" className="hover:opacity-70 transition-opacity">Privacy Policy</Link></li>
                                <li><Link href="/terms" className="hover:opacity-70 transition-opacity">Rental Terms &amp; Conditions</Link></li>
                            </ul>
                            {/* Column 3 */}
                            <ul className="flex flex-col gap-5 text-[hsla(0,0%,0%,1)] font-manrope font-medium text-[14px] tracking-tight leading-none">
                                <li><Link href="/faq" className="hover:opacity-70 transition-opacity">FAQs</Link></li>
                                <li><Link href="/ticket" className="hover:opacity-70 transition-opacity">Raise a Ticket</Link></li>
                                <li><Link href="/reviews" className="hover:opacity-70 transition-opacity">Customer Reviews</Link></li>
                                <li><Link href="/blog" className="hover:opacity-70 transition-opacity">Blog</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Copyright bar */}
                <div 
                    className="w-full max-w-[1200px] px-4 sm:px-6 flex flex-row items-center justify-between"
                    style={{ 
                        height: '77px', 
                        paddingTop: '16px', 
                        paddingBottom: '16px',
                        borderTop: '1px solid hsla(0, 0%, 89%, 1)'
                    }}
                >
                    <p className="text-[#666666] font-manrope text-[12.5px]">
                        © {currentYear} {copyrightName}. All Rights Reserved
                    </p>
                    <div className="flex items-center gap-[6px]">
                        {paymentLogos.map((url, i) => (
                            <img key={i} src={url} alt={`payment-method-${i}`} className="w-[45px] h-[45px] object-contain shrink-0" />
                        ))}
                    </div>
                </div>
            </footer>

            {/* ── Mobile Footer ── */}
            <footer className="md:hidden text-gray-700 pt-8 pb-4 border-t border-gray-200" style={{ background: 'hsla(0, 0%, 96%, 1)' }}>
                <div className="px-4">
                    <div className="mb-3">
                        <Link href="/" className="inline-block">
                            <Image src={siteLogo} alt={siteName} width={200} height={54} className="h-[54px] w-auto object-contain" />
                        </Link>
                    </div>
                    <p className="text-gray-700 text-sm font-medium mb-5">Rent Anything, Anytime, Anywhere</p>

                    <ul className="space-y-3 text-gray-600 text-sm mb-6">
                        <li><Link href="/about" className="hover:text-gray-900 transition-colors">About Us</Link></li>
                        <li><Link href="/how-it-works" className="hover:text-gray-900 transition-colors">How It Works</Link></li>
                        <li><Link href="/careers" className="hover:text-gray-900 transition-colors">Jobs &amp; Careers</Link></li>
                        <li><Link href="/contact" className="hover:text-gray-900 transition-colors">Contact</Link></li>
                        <li><Link href="/b2b" className="hover:text-gray-900 transition-colors">IndianRenters (B2B Link)</Link></li>
                    </ul>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-600 mb-6">
                        <Link href="/kyc-policy" className="hover:text-gray-900 transition-colors">KYC Policy</Link>
                        <Link href="/faq" className="hover:text-gray-900 transition-colors">FAQs</Link>
                        <Link href="/shipping-policy" className="hover:text-gray-900 transition-colors">Shipping Policy</Link>
                        <Link href="/ticket" className="hover:text-gray-900 transition-colors">Raise a Ticket</Link>
                        <Link href="/return-policy" className="hover:text-gray-900 transition-colors">Return Policy</Link>
                        <Link href="/reviews" className="hover:text-gray-900 transition-colors">Customer Reviews</Link>
                        <Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link>
                        <Link href="/blog" className="hover:text-gray-900 transition-colors">Blog</Link>
                        <Link href="/terms" className="hover:text-gray-900 transition-colors col-span-2">Rental Terms &amp; Conditions</Link>
                    </div>

                    <div className="flex items-center gap-5 mb-6">
                        <a href={`https://wa.me/${sitePhone.replace(/[^\d]/g, '')}`} className="transition-opacity hover:opacity-70" target="_blank" rel="noopener noreferrer"><FaWhatsapp size={22} className="text-[#25D366]" /></a>
                        <a href="#" className="transition-opacity hover:opacity-70"><FaFacebookF size={20} className="text-[#1877F2]" /></a>
                        <a href="#" className="transition-opacity hover:opacity-70"><FaInstagram size={22} className="text-[#E4405F]" /></a>
                        <a href="#" className="transition-opacity hover:opacity-70"><FaLinkedinIn size={20} className="text-[#0A66C2]" /></a>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                        <p className="text-gray-500 text-[11px] text-center mb-3">© {currentYear} {copyrightName}. All Rights Reserved</p>
                        <div className="flex items-center justify-center gap-[6px]">
                            {paymentLogos.map((url, i) => (
                                <img key={i} src={url} alt={`payment-method-mobile-${i}`} className="w-[45px] h-[45px] object-contain shrink-0" />
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;
