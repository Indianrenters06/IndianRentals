"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSettings } from '../context/SettingsContext';

const DEFAULT_PAYMENT_LOGOS = [
    "https://res.cloudinary.com/dpu9ikeqe/image/upload/v1774477006/1ea1887d77efce07ed8c13aecef4c18d75fddf84_oq3qmc.png",
    "https://res.cloudinary.com/dpu9ikeqe/image/upload/v1774477006/43e892522e4d7cd8b9640d32b817ce5d99b2fd18_gfptzj.png",
    "https://res.cloudinary.com/dpu9ikeqe/image/upload/v1774477005/b5f5de03b48b1e4460cf20fd295ad96cc3c1fa35_sitcbh.png",
    "https://res.cloudinary.com/dpu9ikeqe/image/upload/v1774477006/2a84eda31c8a80fed3b9bc10e13d0243d2047d84_ewds3r.png"
];

const DEFAULT_FOOTER_COLUMNS = [
    { title: "Company", links: [
        { name: "About Us", href: "/about" },
        { name: "How It Works", href: "/rental-process" },
        { name: "Jobs & Careers", href: "/careers" },
        { name: "Contact", href: "/contact" },
        { name: "IndianRenters (B2B Link)", href: "/b2b" },
    ] },
    { title: "Policies", links: [
        { name: "KYC Policy", href: "/kyc-policy" },
        { name: "Shipping Policy", href: "/shipping-policy" },
        { name: "Return Policy", href: "/return-policy" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Rental Terms & Conditions", href: "/terms" },
    ] },
    { title: "Support", links: [
        { name: "FAQs", href: "/faq" },
        { name: "Raise a Ticket", href: "/ticket" },
        { name: "Customer Reviews", href: "/reviews" },
        { name: "Blog", href: "/blog" },
    ] },
];

const Footer = () => {
    const { settings } = useSettings();
    const siteLogo = settings?.siteLogo || "https://res.cloudinary.com/dgkckcdk8/image/upload/v1776892240/1d1f7c4e3c0490bcddb69ceb328c67be2f7cf361_6_kufcee.png";
    const siteName = settings?.siteName || "Indian Renters";
    const sitePhone = settings?.contactPhone || "+91 9999999999";
    const currentYear = new Date().getFullYear();
    const copyrightName = settings?.footerCopyright || "AAA Rental LLP";

    const footerColumns = (settings?.footerColumns?.length ? settings.footerColumns : DEFAULT_FOOTER_COLUMNS);
    const paymentLogos = (settings?.paymentLogos?.length ? settings.paymentLogos : DEFAULT_PAYMENT_LOGOS);
    const primaryColumn = footerColumns[0];
    const secondaryColumns = footerColumns.slice(1);

    const [viewType, setViewType] = useState('mobile');

    useEffect(() => {
        const checkRes = () => {
            const w = window.innerWidth;
            if (w >= 1024) setViewType('desktop');
            else if (w >= 768) setViewType('tablet');
            else setViewType('mobile');
        };
        checkRes();
        window.addEventListener('resize', checkRes);
        return () => window.removeEventListener('resize', checkRes);
    }, []);

    return (
        <>
            {/* ── Desktop/Tablet Footer ── */}
            <footer
                className={`${viewType === 'mobile' ? 'hidden' : 'flex'} flex-col w-full items-center`}
                style={{
                    background: 'hsla(0, 0%, 96%, 1)',
                    borderTop: '1px solid hsla(0, 0%, 89%, 1)',
                    paddingTop: '36px',
                    paddingBottom: '0px',
                    gap: '20px'
                }}
            >
                {/* Inner container: 1200px wide, space-between */}
                <div className="w-full max-w-[1200px] mx-auto px-6 md:px-8">
                    <div
                        className="flex flex-row items-start justify-between"
                        style={{ height: viewType === 'desktop' ? '176px' : (viewType === 'tablet' ? '216px' : 'auto'), gap: viewType === 'tablet' ? '20px' : '40px' }}
                    >
                        {/* Brand Column */}
                        <div className="flex flex-col gap-4 shrink-0">
                            <Link href="/" className="inline-block">
                                <Image
                                    src={siteLogo}
                                    alt={siteName}
                                    width={270}
                                    height={72}
                                    className="h-[56px] md:h-[72px] w-auto object-contain"
                                />
                            </Link>
                            <p className="text-black text-[14px] font-medium leading-[20px] max-w-[600px]">
                                {settings?.footerDescription || "Rent Anything, Anytime, Anywhere"}
                            </p>
                            <div className="flex items-center gap-[5px] pt-1">
                                <a href={`https://wa.me/${sitePhone.replace(/[^\d]/g, '')}`} className="w-[35px] h-[35px] rounded-full bg-white flex items-center justify-center shrink-0 transition-opacity hover:opacity-70" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                                    <img src="/social/whatsapp.svg" alt="WhatsApp" className="w-5 h-5" />
                                </a>
                                <a href={settings?.socialLinks?.facebook || "#"} className="w-[35px] h-[35px] rounded-full bg-white flex items-center justify-center shrink-0 transition-opacity hover:opacity-70" aria-label="Facebook">
                                    <img src="/social/facebook.svg" alt="Facebook" className="w-5 h-5" />
                                </a>
                                <a href={settings?.socialLinks?.instagram || "#"} className="w-[35px] h-[35px] rounded-full bg-white flex items-center justify-center shrink-0 transition-opacity hover:opacity-70" aria-label="Instagram">
                                    <img src="/social/instagram.svg" alt="Instagram" className="w-5 h-5" />
                                </a>
                                <a href={settings?.socialLinks?.linkedin || "#"} className="w-[35px] h-[35px] rounded-full bg-white flex items-center justify-center shrink-0 transition-opacity hover:opacity-70" aria-label="LinkedIn">
                                    <img src="/social/linkedin.svg" alt="LinkedIn" className="w-5 h-5" />
                                </a>
                            </div>
                        </div>

                        {/* Links — Columns */}
                        <div
                            className="flex flex-row justify-between"
                            style={{ width: viewType === 'desktop' ? '600px' : '480px', maxWidth: '600px', height: viewType === 'desktop' ? '176px' : 'auto', gap: viewType === 'tablet' ? '12px' : '30px' }}
                        >
                            {footerColumns.map((col, ci) => (
                                <ul key={ci} className="flex flex-col gap-[18px] text-[hsla(0,0%,0%,1)] font-sans font-medium text-[13px] tracking-tight leading-none">
                                    {(col.links || []).map((link, li) => (
                                        <li key={li}>
                                            <Link href={link.href || "#"} className="hover:opacity-70 transition-opacity">{link.name}</Link>
                                        </li>
                                    ))}
                                </ul>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Copyright bar */}
                <div 
                    className="w-full max-w-[1200px] mx-auto px-6 md:px-8 flex flex-col md:flex-row items-center justify-between"
                    style={{ 
                        height: viewType === 'desktop' ? '77px' : 'auto', 
                        paddingTop: '24px', 
                        paddingBottom: '24px',
                        borderTop: '1px solid hsla(0, 0%, 89%, 1)',
                        gap: '16px'
                    }}
                >
                    <p className="text-[#666666] font-sans text-[12.5px]">
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
            <footer
                className={`${viewType === 'mobile' ? 'block' : 'hidden'} w-full font-sans`}
                style={{
                    background: 'hsla(0, 0%, 96%, 1)',
                    borderTop: '1px solid hsla(0, 0%, 89%, 1)',
                    paddingTop: '36px',
                    paddingBottom: '32px',
                }}
            >
                <div className="mx-auto w-full max-w-[390px] px-5">
                    {/* Logo Area */}
                    <div className="flex flex-col mb-8" style={{ gap: '10px' }}>
                        <Link href="/" className="inline-block">
                            <Image src={siteLogo} alt={siteName} width={160} height={44} className="h-[44px] w-auto object-contain" />
                        </Link>
                        <p className="text-[#1D1D1F] text-[12px] font-medium leading-snug tracking-tight">
                            {settings?.footerDescription || "Rent Anything, Anytime, Anywhere"}
                        </p>
                    </div>

                    {/* Primary Links (first column) */}
                    {primaryColumn && (
                        <div className="flex flex-col mb-8" style={{ gap: '12px' }}>
                            {(primaryColumn.links || []).map((link, li) => (
                                <Link key={li} href={link.href || "#"} className="text-black font-bold text-[15px] leading-tight transition-opacity hover:opacity-70">{link.name}</Link>
                            ))}
                        </div>
                    )}

                    {secondaryColumns.length > 0 && <div className="h-[1px] w-full bg-[#E5E5EA] mb-8"></div>}

                    {/* Secondary Links (remaining columns) */}
                    {secondaryColumns.length > 0 && (
                        <div className="grid grid-cols-2 mb-8" style={{ gap: '20px' }}>
                            {secondaryColumns.map((col, ci) => (
                                <div key={ci} className="flex flex-col gap-3 text-black text-[13px] font-medium tracking-tight">
                                    {(col.links || []).map((link, li) => (
                                        <Link key={li} href={link.href || "#"} className="hover:opacity-70">{link.name}</Link>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="h-[1px] w-full bg-[#E5E5EA] mb-8"></div>

                    {/* Socials */}
                    <div className="flex items-center gap-[6px] mb-8">
                        <a href={`https://wa.me/${sitePhone.replace(/[^\d]/g, '')}`} className="w-[40px] h-[40px] rounded-full bg-white flex items-center justify-center shrink-0 transition-opacity hover:opacity-70" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                            <img src="/social/whatsapp.svg" alt="WhatsApp" className="w-[22px] h-[22px]" />
                        </a>
                        <a href={settings?.socialLinks?.facebook || "#"} className="w-[40px] h-[40px] rounded-full bg-white flex items-center justify-center shrink-0 transition-opacity hover:opacity-70" aria-label="Facebook">
                            <img src="/social/facebook.svg" alt="Facebook" className="w-[22px] h-[22px]" />
                        </a>
                        <a href={settings?.socialLinks?.instagram || "#"} className="w-[40px] h-[40px] rounded-full bg-white flex items-center justify-center shrink-0 transition-opacity hover:opacity-70" aria-label="Instagram">
                            <img src="/social/instagram.svg" alt="Instagram" className="w-[22px] h-[22px]" />
                        </a>
                        <a href={settings?.socialLinks?.linkedin || "#"} className="w-[40px] h-[40px] rounded-full bg-white flex items-center justify-center shrink-0 transition-opacity hover:opacity-70" aria-label="LinkedIn">
                            <img src="/social/linkedin.svg" alt="LinkedIn" className="w-[22px] h-[22px]" />
                        </a>
                    </div>

                    <div className="h-[1px] w-full bg-[#E5E5EA] mb-6"></div>

                    {/* Copyright + Payment */}
                    <div className="flex flex-col gap-4">
                        <p className="text-[#86868B] text-[12px] font-medium">
                            © {currentYear} {copyrightName}. All Rights Reserved
                        </p>
                        <div className="flex items-center gap-2">
                            {paymentLogos.map((url, i) => (
                                <div key={i} className="bg-white rounded-xl flex items-center justify-center" style={{ width: '54px', height: '36px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                                    <img src={url} alt={`payment-${i}`} className="h-5 w-auto object-contain" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;
