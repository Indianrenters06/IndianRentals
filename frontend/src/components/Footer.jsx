"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa';

// Inline SVG payment logo components — no external URL dependencies
const PaymentUPI = () => (
    <svg height="20" viewBox="0 0 80 30" xmlns="http://www.w3.org/2000/svg" aria-label="UPI">
        <text x="0" y="22" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="22" fill="#097939" letterSpacing="-0.5">UPI</text>
        <polygon points="60,6 70,15 60,24 62,19 54,19 54,11 62,11" fill="#097939" />
    </svg>
);

const PaymentVisa = () => (
    <svg height="14" viewBox="0 0 75 24" xmlns="http://www.w3.org/2000/svg" aria-label="Visa">
        <text x="0" y="20" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="22" fill="#1A1F71" fontStyle="italic" letterSpacing="-1">VISA</text>
    </svg>
);

const PaymentRuPay = () => (
    <svg height="18" viewBox="0 0 80 24" xmlns="http://www.w3.org/2000/svg" aria-label="RuPay">
        <text x="0" y="18" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="17" fill="#005BAC">Ru</text>
        <text x="28" y="18" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="17" fill="#F47920">Pay</text>
        <polygon points="74,2 80,12 74,22 71,12" fill="#F47920" />
    </svg>
);

const PaymentMastercard = () => (
    <svg height="22" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" aria-label="Mastercard">
        <circle cx="13" cy="12" r="12" fill="#EB001B" />
        <circle cx="25" cy="12" r="12" fill="#F79E1B" />
        <path d="M19 3.8 A12 12 0 0 1 19 20.2 A12 12 0 0 1 19 3.8Z" fill="#FF5F00" />
    </svg>
);


const Footer = () => {
    return (
        <footer className="bg-white text-gray-700 pt-8 pb-4 border-t border-gray-100">

            {/* Mobile Layout */}
            <div className="md:hidden px-4">
                {/* Logo */}
                <div className="mb-3">
                    <Link href="/" className="inline-block">
                        <Image
                            src="https://res.cloudinary.com/dpu9ikeqe/image/upload/v1771271177/1d1f7c4e3c0490bcddb69ceb328c67be2f7cf361_cf3y9m.png"
                            alt="Indian Renters"
                            width={200}
                            height={54}
                            className="h-[54px] w-auto object-contain"
                        />
                    </Link>
                </div>

                {/* Tagline */}
                <p className="text-gray-700 text-sm font-medium mb-5">
                    Rent Anything, Anytime, Anywhere
                </p>

                {/* Primary Nav Links */}
                <ul className="space-y-3 text-gray-600 text-sm mb-6">
                    <li><Link href="/about" className="hover:text-gray-900 transition-colors">About Us</Link></li>
                    <li><Link href="/how-it-works" className="hover:text-gray-900 transition-colors">How It Works</Link></li>
                    <li><Link href="/careers" className="hover:text-gray-900 transition-colors">Jobs &amp; Careers</Link></li>
                    <li><Link href="/contact" className="hover:text-gray-900 transition-colors">Contact</Link></li>
                    <li><Link href="/b2b" className="hover:text-gray-900 transition-colors">IndianRenters (B2B Link)</Link></li>
                </ul>

                {/* Secondary Policy Links - 2 column grid */}
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

                {/* Social Icons */}
                <div className="flex items-center gap-5 mb-6">
                    <a href="#" className="transition-opacity hover:opacity-70">
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

                {/* Divider */}
                <div className="border-t border-gray-200 pt-4">
                    {/* Copyright */}
                    <p className="text-gray-500 text-[11px] text-center mb-3">
                        © 2025 AAA Rental LLP. All Rights Reserved
                    </p>

                    {/* Payment Methods */}
                    <div className="flex items-center justify-center gap-2">
                        <div className="h-7 px-2.5 bg-white border border-gray-200 rounded flex items-center justify-center">
                            <PaymentUPI />
                        </div>
                        <div className="h-7 px-2.5 bg-white border border-gray-200 rounded flex items-center justify-center">
                            <PaymentVisa />
                        </div>
                        <div className="h-7 px-2.5 bg-white border border-gray-200 rounded flex items-center justify-center">
                            <PaymentRuPay />
                        </div>
                        <div className="h-7 px-2.5 bg-white border border-gray-200 rounded flex items-center justify-center">
                            <PaymentMastercard />
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:block">
                {/* Main Footer Content */}
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16 flex flex-col lg:flex-row justify-between gap-5">

                    {/* Brand Column */}
                    <div className="flex flex-col gap-4">
                        <Link href="/" className="inline-block">
                            <Image
                                src="https://res.cloudinary.com/dpu9ikeqe/image/upload/v1771271177/1d1f7c4e3c0490bcddb69ceb328c67be2f7cf361_cf3y9m.png"
                                alt="Indian Renters"
                                width={270}
                                height={72}
                                className="h-[72px] w-auto object-contain"
                            />
                        </Link>
                        <p className="text-gray-800 text-[13px] font-medium">
                            Rent Anything, Anytime, Anywhere
                        </p>
                        <div className="flex items-center gap-3">
                            <a href="#" className="transition-opacity hover:opacity-70">
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

                    {/* Links Section */}
                    <div className="flex flex-col lg:flex-row w-full lg:w-[600px] h-auto lg:h-[156px] justify-between text-[13px]">
                        {/* Link Column 1 */}
                        <ul className="space-y-2.5 text-gray-600">
                            <li><Link href="/about" className="hover:text-gray-900 transition-colors">About Us</Link></li>
                            <li><Link href="/how-it-works" className="hover:text-gray-900 transition-colors">How It Works</Link></li>
                            <li><Link href="/careers" className="hover:text-gray-900 transition-colors">Jobs &amp; Careers</Link></li>
                            <li><Link href="/contact" className="hover:text-gray-900 transition-colors">Contact</Link></li>
                            <li><Link href="/b2b" className="hover:text-gray-900 transition-colors">IndianRenters (B2B Link)</Link></li>
                        </ul>

                        {/* Link Column 2 */}
                        <ul className="space-y-2.5 text-gray-600">
                            <li><Link href="/kyc-policy" className="hover:text-gray-900 transition-colors">KYC Policy</Link></li>
                            <li><Link href="/shipping-policy" className="hover:text-gray-900 transition-colors">Shipping Policy</Link></li>
                            <li><Link href="/return-policy" className="hover:text-gray-900 transition-colors">Return Policy</Link></li>
                            <li><Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-gray-900 transition-colors">Rental Terms &amp; Conditions</Link></li>
                        </ul>

                        {/* Link Column 3 */}
                        <ul className="space-y-2.5 text-gray-600">
                            <li><Link href="/faq" className="hover:text-gray-900 transition-colors">FAQs</Link></li>
                            <li><Link href="/ticket" className="hover:text-gray-900 transition-colors">Raise a Ticket</Link></li>
                            <li><Link href="/reviews" className="hover:text-gray-900 transition-colors">Customer Reviews</Link></li>
                            <li><Link href="/blog" className="hover:text-gray-900 transition-colors">Blog</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Copyright Section */}
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16 border-t border-gray-200 mt-8 pt-5 pb-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-[11px] text-center md:text-left">
                        © 2025 AAA Rental LLP. All Rights Reserved
                    </p>
                    <div className="flex items-center gap-2">
                        <div className="h-7 px-2.5 bg-white border border-gray-200 rounded flex items-center justify-center">
                            <PaymentUPI />
                        </div>
                        <div className="h-7 px-2.5 bg-white border border-gray-200 rounded flex items-center justify-center">
                            <PaymentVisa />
                        </div>
                        <div className="h-7 px-2.5 bg-white border border-gray-200 rounded flex items-center justify-center">
                            <PaymentRuPay />
                        </div>
                        <div className="h-7 px-2.5 bg-white border border-gray-200 rounded flex items-center justify-center">
                            <PaymentMastercard />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
