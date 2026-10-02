"use client";
import React from 'react';
import { socialDestination, whatsappDestination, footerDestination } from '@/lib/footerDestinations.mjs';
import styles from './Footer.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useConsent } from "./CookieConsent";
import { useSettings } from '../context/SettingsContext';

const DEFAULT_PAYMENT_LOGOS = [
    "https://res.cloudinary.com/dpu9ikeqe/image/upload/v1774477006/1ea1887d77efce07ed8c13aecef4c18d75fddf84_oq3qmc.png",
    "https://res.cloudinary.com/dpu9ikeqe/image/upload/v1774477006/43e892522e4d7cd8b9640d32b817ce5d99b2fd18_gfptzj.png",
    "https://res.cloudinary.com/dpu9ikeqe/image/upload/v1774477005/b5f5de03b48b1e4460cf20fd295ad96cc3c1fa35_sitcbh.png",
    "https://res.cloudinary.com/dpu9ikeqe/image/upload/v1774477006/2a84eda31c8a80fed3b9bc10e13d0243d2047d84_ewds3r.png"
];

const DEFAULT_FOOTER_COLUMNS = [
    {
        title: "Company", links: [
            { name: "About Us", href: "/about" },
            { name: "How It Works", href: "/rental-process" },
            { name: "Jobs & Careers", href: "/careers" },
            { name: "Contact", href: "/contact" },
            { name: "IndianRenters (B2B Link)", href: "/b2b" },
        ]
    },
    {
        title: "Services", links: [
            { name: "Laptop Rental", href: "/services/laptop-rental" },
            { name: "MacBook Rental", href: "/services/macbook-rental" },
            { name: "Camera Rental", href: "/services/camera-rental" },
            { name: "AV Equipment", href: "/services/av-equipment-rental" },
            { name: "Server Rental", href: "/services/server-rental" },
        ]
    },
    {
        title: "Locations", links: [
            { name: "Rentals in Delhi", href: "/locations/delhi" },
            { name: "Rentals in Mumbai", href: "/locations/mumbai" },
            { name: "Rentals in Bangalore", href: "/locations/bangalore" },
            { name: "Rentals in Hyderabad", href: "/locations/hyderabad" },
            { name: "Rentals in Pune", href: "/locations/pune" },
        ]
    },
    {
        title: "Policies", links: [
            { name: "KYC Policy", href: "/kyc-policy" },
            { name: "Shipping Policy", href: "/shipping" },
            { name: "Return & Refund Policy", href: "/return-policy" },
            { name: "Privacy Policy", href: "/privacy" },
            { name: "Terms & Conditions", href: "/terms" },
            { name: "FAQs", href: "/faq" },
            { name: "Customer Reviews", href: "/#customer-reviews" },
        ]
    },
];

const Footer = () => {
    const { settings } = useSettings();
    const { openSettings } = useConsent();
    const siteLogo = settings?.siteLogo || "https://res.cloudinary.com/dgkckcdk8/image/upload/v1776892240/1d1f7c4e3c0490bcddb69ceb328c67be2f7cf361_6_kufcee.png";
    const siteName = settings?.siteName || "Indian Renters";
    const whatsapp = whatsappDestination(settings?.contactPhone);
    const socialLinks = Object.fromEntries(['facebook', 'instagram', 'linkedin'].map(platform => [platform, socialDestination(settings?.socialLinks?.[platform], platform)]));
    const currentYear = new Date().getFullYear();
    const copyrightName = settings?.footerCopyright || "AAA Rental LLP";

    const configuredColumns = (settings?.footerColumns?.length ? settings.footerColumns : DEFAULT_FOOTER_COLUMNS);
    const missingCatalogColumns = DEFAULT_FOOTER_COLUMNS.slice(1, 3).filter(defaultColumn =>
        !configuredColumns.some(column =>
            column.title?.trim().toLowerCase() === defaultColumn.title.toLowerCase() ||
            column.links?.some(link => defaultColumn.links.some(defaultLink => defaultLink.href === link.href))
        )
    );
    const footerColumns = [configuredColumns[0], ...missingCatalogColumns, ...configuredColumns.slice(1)]
        .filter(Boolean).map(column => ({ ...column, links: (column.links || [])
            .map(link => ({ ...link, href: footerDestination(link.href) })).filter(link => link.href) }));
    const paymentLogos = (settings?.paymentLogos?.length ? settings.paymentLogos : DEFAULT_PAYMENT_LOGOS);
    const primaryColumn = footerColumns[0];
    const secondaryColumns = footerColumns.slice(1);

    return (
        <>
            {/* ── Desktop/Tablet Footer ── */}
            <footer
                className={`${styles.wide} flex-col w-full items-center`}
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
                        className={styles.wideTop}
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
                                {whatsapp && <a href={whatsapp} className="w-[35px] h-[35px] rounded-full bg-white flex items-center justify-center shrink-0 transition-opacity hover:opacity-70" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                                    <img src="/social/whatsapp.svg" alt="WhatsApp" className="w-5 h-5" />
                                </a>}
                                {socialLinks.facebook && <a href={socialLinks.facebook} className="w-[35px] h-[35px] rounded-full bg-white flex items-center justify-center shrink-0 transition-opacity hover:opacity-70" aria-label="Facebook">
                                    <img src="/social/facebook.svg" alt="Facebook" className="w-5 h-5" />
                                </a>}
                                {socialLinks.instagram && <a href={socialLinks.instagram} className="w-[35px] h-[35px] rounded-full bg-white flex items-center justify-center shrink-0 transition-opacity hover:opacity-70" aria-label="Instagram">
                                    <img src="/social/instagram.svg" alt="Instagram" className="w-5 h-5" />
                                </a>}
                                {socialLinks.linkedin && <a href={socialLinks.linkedin} className="w-[35px] h-[35px] rounded-full bg-white flex items-center justify-center shrink-0 transition-opacity hover:opacity-70" aria-label="LinkedIn">
                                    <img src="/social/linkedin.svg" alt="LinkedIn" className="w-5 h-5" />
                                </a>}
                            </div>
                        </div>

                        {/* Links — Columns */}
                        <div
                            className={`${styles.columns} min-w-0 w-full`}
                        >
                            {footerColumns.map((col, ci) => (
                                <ul key={ci} className="flex flex-col gap-[18px] text-[hsla(0,0%,0%,1)] font-sans font-medium text-[13px] tracking-tight leading-[1.5] min-w-0">
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
                        minHeight: '77px',
                        paddingTop: '24px',
                        paddingBottom: '24px',
                        borderTop: '1px solid hsla(0, 0%, 89%, 1)',
                        gap: '16px'
                    }}
                >
                    <p className="text-[#666666] font-sans text-[12.5px]">
                        © {currentYear} {copyrightName}. All Rights Reserved
                    </p>
                    <button type="button" className={styles.cookieSettings} onClick={openSettings}>Cookie settings</button>
                    <div className="flex items-center gap-[6px]">
                        {paymentLogos.map((url, i) => (
                            <img key={i} src={url} alt={`payment-method-${i}`} className="w-[45px] h-[45px] object-contain shrink-0" />
                        ))}
                    </div>
                </div>
            </footer>

            {/* ── Mobile Footer ── */}
            <footer
                className={`${styles.compact} flex-col items-start w-full font-sans`}
                style={{
                    padding: '32px 20px 0px',
                    gap: '20px',
                    background: '#F6F6F6',
                    borderTop: '1px solid #E2E2E2',
                    boxSizing: 'border-box'
                }}
            >
                <div className="flex flex-col items-start w-full max-w-[600px] gap-[20px] mx-auto">
                    {/* Logo + tagline */}
                    <div className="flex flex-col items-start gap-[10px] w-[137px]">
                        <Link href="/" className="inline-block">
                            <Image
                                src={siteLogo}
                                alt={siteName}
                                width={137}
                                height={37}
                                className="object-contain"
                                style={{ width: '137px', height: '37px' }}
                            />
                        </Link>
                        <p style={{
                            fontFamily: "'Mona Sans', sans-serif",
                            fontWeight: 500,
                            fontSize: '8px',
                            lineHeight: '14px',
                            letterSpacing: '-0.4px',
                            textAlign: 'center',
                            color: '#000000',
                            width: '119px',
                            margin: 0
                        }}>
                            {settings?.footerDescription || 'Rent Anything, Anytime, Anywhere'}
                        </p>
                    </div>

                    {/* Company links */}
                    {primaryColumn && (
                        <div className="flex flex-col items-start gap-[8px] w-full">
                            {(primaryColumn.links || []).map((link, li) => (
                                <Link
                                    key={li}
                                    href={link.href || '#'}
                                    style={{
                                        fontFamily: "'Mona Sans', sans-serif",
                                        fontWeight: 500,
                                        fontSize: '12px',
                                        lineHeight: '16px',
                                        letterSpacing: '-0.4px',
                                        color: '#000000',
                                        textDecoration: 'none'
                                    }}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Divider */}
                    <div className="w-full h-[1px] bg-[#EEEEEE] shrink-0" />

                    {/* Footer link groups */}
                    {secondaryColumns.length > 0 && (
                        <div className={styles.compactColumns}>
                            {secondaryColumns.map((col, ci) => (
                                <div key={ci} className="flex flex-col items-start gap-[8px] min-w-0">
                                    {col.title && <h3 className={styles.compactColumnTitle}>{col.title}</h3>}
                                    {(col.links || []).map((link, li) => (
                                        <Link
                                            key={li}
                                            href={link.href || '#'}
                                            style={{
                                                fontFamily: "'Mona Sans', sans-serif",
                                                fontWeight: 500,
                                                fontSize: '12px',
                                                lineHeight: '16px',
                                                letterSpacing: '-0.4px',
                                                color: '#000000',
                                                textDecoration: 'none'
                                            }}
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Divider */}
                    <div className="w-full h-[1px] bg-[#EEEEEE] shrink-0" />

                    {/* Social icons */}
                    <div className="flex flex-row items-center gap-[5px]">
                        {whatsapp && <a href={whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="WhatsApp"
                            className="flex items-center justify-center bg-white rounded-full shrink-0"
                            style={{ width: '34.9px', height: '34.9px' }}
                        >
                            <img src="/social/whatsapp.svg" alt="WhatsApp" style={{ width: '20px', height: '20px' }} />
                        </a>}
                        {socialLinks.facebook && <a href={socialLinks.facebook}
                            aria-label="Facebook"
                            className="flex items-center justify-center bg-white rounded-full shrink-0"
                            style={{ width: '34.9px', height: '34.9px' }}
                        >
                            <img src="/social/facebook.svg" alt="Facebook" style={{ width: '20px', height: '20px' }} />
                        </a>}
                        {socialLinks.instagram && <a href={socialLinks.instagram}
                            aria-label="Instagram"
                            className="flex items-center justify-center bg-white rounded-full shrink-0"
                            style={{ width: '34.9px', height: '34.9px' }}
                        >
                            <img src="/social/instagram.svg" alt="Instagram" style={{ width: '20px', height: '20px' }} />
                        </a>}
                        {socialLinks.linkedin && <a href={socialLinks.linkedin}
                            aria-label="LinkedIn"
                            className="flex items-center justify-center bg-white rounded-full shrink-0"
                            style={{ width: '34.9px', height: '34.9px' }}
                        >
                            <img src="/social/linkedin.svg" alt="LinkedIn" style={{ width: '20px', height: '20px' }} />
                        </a>}
                    </div>
                </div>

                {/* Copyright bar */}
                <div className="flex flex-col justify-center items-start w-full max-w-[600px] mx-auto border-t border-[#EEEEEE]" style={{ padding: '16px 0px', gap: '10px' }}>
                    <p style={{
                        fontFamily: "'Mona Sans', sans-serif",
                        fontWeight: 300,
                        fontSize: '10px',
                        lineHeight: '16px',
                        letterSpacing: '-0.4px',
                        color: '#000000',
                        margin: 0
                    }}>
                        © {currentYear} {copyrightName}. All Rights Reserved
                    </p>
                    <button type="button" className={styles.cookieSettings} onClick={openSettings}>Cookie settings</button>

                    {/* Payment logos */}
                    <div className="flex flex-row items-center isolate">
                        {paymentLogos.map((url, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-center bg-white border-2 border-[#F6F6F6] rounded-full shrink-0 relative"
                                style={{
                                    width: '45px',
                                    height: '45px',
                                    marginLeft: i === 0 ? '0' : '-10px',
                                    zIndex: paymentLogos.length - i
                                }}
                            >
                                <img src={url} alt={`payment-${i}`} style={{ maxWidth: '35px', maxHeight: '27px', objectFit: 'contain' }} />
                            </div>
                        ))}
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;
