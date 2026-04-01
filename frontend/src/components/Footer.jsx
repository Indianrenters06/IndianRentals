"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FacebookLogo, InstagramLogo, LinkedinLogo, WhatsappLogo } from '@phosphor-icons/react';
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
                <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8">
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
                                    <WhatsappLogo size={22} weight="fill" className="text-[#25D366]" />
                                </a>
                                <a href="#" className="transition-opacity hover:opacity-70">
                                    <FacebookLogo size={22} weight="fill" className="text-[#1877F2]" />
                                </a>
                                <a href="#" className="transition-opacity hover:opacity-70">
                                    <InstagramLogo size={22} weight="fill" className="text-[#E4405F]" />
                                </a>
                                <a href="#" className="transition-opacity hover:opacity-70">
                                    <LinkedinLogo size={22} weight="fill" className="text-[#0A66C2]" />
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
                    className="w-full max-w-[1400px] mx-auto px-4 md:px-8 flex flex-row items-center justify-between"
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
            {/* ── Mobile Footer ── */}
            <footer 
                className="md:hidden w-full font-manrope overflow-hidden"
                style={{ 
                    background: 'hsla(0, 0%, 96%, 1)', 
                    borderTop: '1px solid hsla(0, 0%, 89%, 1)',
                    paddingTop: '32px',
                    paddingBottom: '24px',
                    minHeight: '575px'
                }}
            >
                <div className="mx-auto" style={{ width: '350px' }}>
                    {/* Logo Area (Target 137x61) */}
                    <div className="flex flex-col mb-8" style={{ width: '137px', height: '61px', gap: '10px' }}>
                        <Link href="/" className="inline-block">
                            <Image src={siteLogo} alt={siteName} width={137} height={40} className="h-[40px] w-auto object-contain" />
                        </Link>
                        <p className="text-[#1D1D1F] text-[10px] font-medium leading-none tracking-tight whitespace-nowrap">
                            Rent Anything, Anytime, Anywhere
                        </p>
                    </div>
                    {/* Primary Links (Target 134x112) */}
                    <div 
                        className="flex flex-col mb-8"
                        style={{ width: '134px', height: '112px', gap: '8px' }}
                    >
                        <Link href="/about" className="text-black font-manrope font-semibold text-[14px] leading-tight hover:opacity-70 transition-opacity whitespace-nowrap">About Us</Link>
                        <Link href="/how-it-works" className="text-black font-manrope font-semibold text-[14px] leading-tight hover:opacity-70 transition-opacity whitespace-nowrap">How It Works</Link>
                        <Link href="/careers" className="text-black font-manrope font-semibold text-[14px] leading-tight hover:opacity-70 transition-opacity whitespace-nowrap">Jobs &amp; Careers</Link>
                        <Link href="/contact" className="text-black font-manrope font-semibold text-[14px] leading-tight hover:opacity-70 transition-opacity whitespace-nowrap">Contact</Link>
                        <Link href="/b2b" className="text-black font-manrope font-semibold text-[14px] leading-tight hover:opacity-70 transition-opacity whitespace-nowrap">IndianRenters (B2B Link)</Link>
                    </div>

                    {/* Divider 1 */}
                    <div className="h-[1px] w-full bg-[#E5E5EA] mb-8"></div>

                    {/* Secondary Links - 2 Columns (Target 350x112) */}
                    <div 
                        className="grid grid-cols-2 mb-8"
                        style={{ width: '350px', height: '112px', gap: '24px' }}
                    >
                        <div className="flex flex-col justify-between text-black font-manrope font-medium text-[13px] tracking-tight py-0.5">
                            <Link href="/kyc-policy" className="hover:opacity-70 transition-opacity">KYC Policy</Link>
                            <Link href="/shipping-policy" className="hover:opacity-70 transition-opacity">Shipping Policy</Link>
                            <Link href="/return-policy" className="hover:opacity-70 transition-opacity">Return Policy</Link>
                            <Link href="/privacy" className="hover:opacity-70 transition-opacity">Privacy Policy</Link>
                            <Link href="/terms" className="hover:opacity-70 transition-opacity whitespace-nowrap">Rental Terms &amp; Conditions</Link>
                        </div>
                        <div className="flex flex-col justify-between text-black font-manrope font-medium text-[13px] tracking-tight py-0.5">
                            <Link href="/faq" className="hover:opacity-70 transition-opacity whitespace-nowrap">FAQs</Link>
                            <Link href="/ticket" className="hover:opacity-70 transition-opacity whitespace-nowrap">Raise a Ticket</Link>
                            <Link href="/reviews" className="hover:opacity-70 transition-opacity whitespace-nowrap">Customer Reviews</Link>
                            <Link href="/blog" className="hover:opacity-70 transition-opacity whitespace-nowrap">Blog</Link>
                            <div className="h-[20px]"></div> {/* Spacer for alignment */}
                        </div>
                    </div>

                    {/* Divider 2 */}
                    <div className="h-[1px] w-full bg-[#E5E5EA] mb-8"></div>

                    {/* Social Icons row */}
                    <div className="flex items-center gap-4 mb-8">
                        <a href={`https://wa.me/${sitePhone.replace(/[^\d]/g, '')}`} className="w-[42px] h-[42px] rounded-full bg-white flex items-center justify-center shadow-sm" target="_blank" rel="noopener noreferrer">
                            <WhatsappLogo size={22} weight="fill" className="text-[#25D366]" />
                        </a>
                        <a href="#" className="w-[42px] h-[42px] rounded-full bg-white flex items-center justify-center shadow-sm">
                            <FacebookLogo size={22} weight="fill" className="text-[#1877F2]" />
                        </a>
                        <a href="#" className="w-[42px] h-[42px] rounded-full bg-white flex items-center justify-center shadow-sm">
                            <InstagramLogo size={22} weight="fill" className="text-[#E4405F]" />
                        </a>
                        <a href="#" className="w-[42px] h-[42px] rounded-full bg-white flex items-center justify-center shadow-sm">
                            <LinkedinLogo size={22} weight="fill" className="text-[#0A66C2]" />
                        </a>
                    </div>

                    {/* Bottom Section Border Layer */}
                    <div 
                        className="flex flex-col items-start px-0"
                        style={{ 
                            width: '350px', 
                            height: '103px',
                            paddingTop: '16px',
                            paddingBottom: '16px',
                            borderTop: '1px solid hsla(0, 0%, 93%, 1)',
                            gap: '10px'
                        }}
                    >
                        <p className="text-[#86868B] text-[12px] font-medium font-manrope">
                            © 2025 {copyrightName}. All Rights Reserved
                        </p>
                        <div 
                            className="flex items-center justify-between"
                            style={{ width: '150px', height: '45px' }}
                        >
                            {paymentLogos.map((url, i) => (
                                <img key={i} src={url} alt={`payment-mobile-${i}`} className="h-[32px] w-auto object-contain shrink-0" />
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;
