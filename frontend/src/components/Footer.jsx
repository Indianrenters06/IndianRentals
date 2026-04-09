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

    const [viewType, setViewType] = React.useState('mobile');

    React.useEffect(() => {
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
                            <p className="text-[#1D1D1F] text-[13px] font-medium leading-[20px] max-w-[200px]">
                                Rent Anything, Anytime,<br/>Anywhere
                            </p>
                            <div className="flex items-center gap-[10px] pt-1">
                                <a href={`https://wa.me/${sitePhone.replace(/[^\d]/g, '')}`} className="w-[36px] h-[36px] rounded-full bg-white flex items-center justify-center shadow-sm transition-opacity hover:opacity-70" target="_blank" rel="noopener noreferrer">
                                    <WhatsappLogo size={20} weight="fill" className="text-[#25D366]" />
                                </a>
                                <a href="#" className="w-[36px] h-[36px] rounded-full bg-white flex items-center justify-center shadow-sm transition-opacity hover:opacity-70">
                                    <FacebookLogo size={20} weight="fill" className="text-[#1877F2]" />
                                </a>
                                <a href="#" className="w-[36px] h-[36px] rounded-full bg-white flex items-center justify-center shadow-sm transition-opacity hover:opacity-70">
                                    <InstagramLogo size={20} weight="fill" className="text-[#E4405F]" />
                                </a>
                                <a href="#" className="w-[36px] h-[36px] rounded-full bg-white flex items-center justify-center shadow-sm transition-opacity hover:opacity-70">
                                    <LinkedinLogo size={20} weight="fill" className="text-[#0A66C2]" />
                                </a>
                            </div>
                        </div>

                        {/* Links — Columns */}
                        <div 
                            className="flex flex-row justify-between"
                            style={{ width: viewType === 'desktop' ? '600px' : '480px', maxWidth: '600px', height: viewType === 'desktop' ? '176px' : 'auto', gap: viewType === 'tablet' ? '12px' : '30px' }}
                        >
                            {/* Column 1 */}
                            <ul className="flex flex-col gap-[18px] text-[hsla(0,0%,0%,1)] font-sans font-medium text-[13px] tracking-tight leading-none">
                                <li><Link href="/about" className="hover:opacity-70 transition-opacity">About Us</Link></li>
                                <li><Link href="/how-it-works" className="hover:opacity-70 transition-opacity">How It Works</Link></li>
                                <li><Link href="/careers" className="hover:opacity-70 transition-opacity">Jobs &amp; Careers</Link></li>
                                <li><Link href="/contact" className="hover:opacity-70 transition-opacity">Contact</Link></li>
                                <li><Link href="/b2b" className="hover:opacity-70 transition-opacity">IndianRenters (B2B Link)</Link></li>
                            </ul>
                            {/* Column 2 */}
                            <ul className="flex flex-col gap-[18px] text-[hsla(0,0%,0%,1)] font-sans font-medium text-[13px] tracking-tight leading-none">
                                <li><Link href="/kyc-policy" className="hover:opacity-70 transition-opacity">KYC Policy</Link></li>
                                <li><Link href="/shipping-policy" className="hover:opacity-70 transition-opacity">Shipping Policy</Link></li>
                                <li><Link href="/return-policy" className="hover:opacity-70 transition-opacity">Return Policy</Link></li>
                                <li><Link href="/privacy" className="hover:opacity-70 transition-opacity">Privacy Policy</Link></li>
                                <li><Link href="/terms" className="hover:opacity-70 transition-opacity">Rental Terms &amp; Conditions</Link></li>
                            </ul>
                            {/* Column 3 */}
                            <ul className="flex flex-col gap-[18px] text-[hsla(0,0%,0%,1)] font-sans font-medium text-[13px] tracking-tight leading-none">
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
                className={`${viewType === 'mobile' ? 'block' : 'hidden'} w-full font-sans overflow-hidden`}
                style={{ 
                    background: 'hsla(0, 0%, 96%, 1)', 
                    borderTop: '1px solid hsla(0, 0%, 89%, 1)',
                    paddingTop: '36px',
                    paddingBottom: '24px',
                    minHeight: '575px'
                }}
            >
                <div className="mx-auto" style={{ width: '350px' }}>
                    {/* Logo Area */}
                    <div className="flex flex-col mb-8" style={{ width: '137px', gap: '10px' }}>
                        <Link href="/" className="inline-block">
                            <Image src={siteLogo} alt={siteName} width={137} height={40} className="h-[40px] w-auto object-contain" />
                        </Link>
                        <p className="text-[#1D1D1F] text-[10px] font-medium leading-none tracking-tight whitespace-nowrap">
                            Rent Anything, Anytime, Anywhere
                        </p>
                    </div>
                    {/* Primary Links */}
                    <div className="flex flex-col mb-8" style={{ gap: '8px' }}>
                        <Link href="/about" className="text-black font-semibold text-[14px] leading-tight transition-opacity hover:opacity-70">About Us</Link>
                        <Link href="/how-it-works" className="text-black font-semibold text-[14px] leading-tight transition-opacity hover:opacity-70">How It Works</Link>
                        <Link href="/careers" className="text-black font-semibold text-[14px] leading-tight transition-opacity hover:opacity-70">Jobs &amp; Careers</Link>
                        <Link href="/contact" className="text-black font-semibold text-[14px] leading-tight transition-opacity hover:opacity-70">Contact</Link>
                        <Link href="/b2b" className="text-black font-semibold text-[14px] leading-tight transition-opacity hover:opacity-70">IndianRenters (B2B Link)</Link>
                    </div>

                    <div className="h-[1px] w-full bg-[#E5E5EA] mb-8"></div>

                    {/* Secondary Links */}
                    <div className="grid grid-cols-2 mb-8" style={{ gap: '24px' }}>
                        <div className="flex flex-col gap-3 text-black text-[13px] font-medium tracking-tight">
                            <Link href="/kyc-policy" className="hover:opacity-70">KYC Policy</Link>
                            <Link href="/shipping-policy" className="hover:opacity-70">Shipping Policy</Link>
                            <Link href="/return-policy" className="hover:opacity-70">Return Policy</Link>
                            <Link href="/privacy" className="hover:opacity-70">Privacy Policy</Link>
                            <Link href="/terms" className="hover:opacity-70">Rental Terms</Link>
                        </div>
                        <div className="flex flex-col gap-3 text-black text-[13px] font-medium tracking-tight">
                            <Link href="/faq" className="hover:opacity-70">FAQs</Link>
                            <Link href="/ticket" className="hover:opacity-70">Raise Ticket</Link>
                            <Link href="/reviews" className="hover:opacity-70">Reviews</Link>
                            <Link href="/blog" className="hover:opacity-70">Blog</Link>
                        </div>
                    </div>

                    <div className="h-[1px] w-full bg-[#E5E5EA] mb-8"></div>

                    {/* Socials */}
                    <div className="flex items-center gap-4 mb-8">
                        <a href={`https://wa.me/${sitePhone.replace(/[^\d]/g, '')}`} className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm" target="_blank" rel="noopener noreferrer">
                            <WhatsappLogo size={20} weight="fill" className="text-[#25D366]" />
                        </a>
                        {/* ... other social icons ... */}
                        <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                            <FacebookLogo size={20} weight="fill" className="text-[#1877F2]" />
                        </a>
                    </div>

                    <div className="flex flex-col gap-4 pt-4 border-t border-gray-100">
                        <p className="text-[#86868B] text-[12px] font-medium">
                            © {currentYear} {copyrightName}. All Rights Reserved
                        </p>
                        <div className="flex gap-2">
                            {paymentLogos.map((url, i) => (
                                <img key={i} src={url} alt={`payment-${i}`} className="h-8 w-auto object-contain" />
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;
