"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-white text-gray-700 pt-9 pb-0 border-t border-gray-100">
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

                {/* Links Section - Flex Row for Columns */}
                <div className="flex flex-col lg:flex-row w-full lg:w-[600px] h-auto lg:h-[156px] justify-between text-[13px]">
                    {/* Link Column 1 */}
                    <ul className="space-y-2.5 text-gray-600">
                        <li><Link href="/about" className="hover:text-gray-900 transition-colors">About Us</Link></li>
                        <li><Link href="/how-it-works" className="hover:text-gray-900 transition-colors">How It Works</Link></li>
                        <li><Link href="/careers" className="hover:text-gray-900 transition-colors">Jobs & Careers</Link></li>
                        <li><Link href="/contact" className="hover:text-gray-900 transition-colors">Contact</Link></li>
                        <li><Link href="/b2b" className="hover:text-gray-900 transition-colors">IndianRenters (B2B Link)</Link></li>
                    </ul>

                    {/* Link Column 2 */}
                    <ul className="space-y-2.5 text-gray-600">
                        <li><Link href="/kyc-policy" className="hover:text-gray-900 transition-colors">KYC Policy</Link></li>
                        <li><Link href="/shipping-policy" className="hover:text-gray-900 transition-colors">Shipping Policy</Link></li>
                        <li><Link href="/return-policy" className="hover:text-gray-900 transition-colors">Return Policy</Link></li>
                        <li><Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link></li>
                        <li><Link href="/terms" className="hover:text-gray-900 transition-colors">Rental Terms & Conditions</Link></li>
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
                <div className="flex items-center gap-3">
                    <p className="text-gray-500 text-[11px] text-center md:text-left">
                        © 2025 AAA Rental LLP. All Rights Reserved
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-7 px-2.5 bg-white border border-gray-200 rounded flex items-center justify-center">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" className="h-5 w-auto object-contain" />
                    </div>
                    <div className="h-7 px-2.5 bg-white border border-gray-200 rounded flex items-center justify-center">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-2.5 w-auto object-contain" />
                    </div>
                    <div className="h-7 px-2.5 bg-white border border-gray-200 rounded flex items-center justify-center">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Rupay-Logo.png" alt="RuPay" className="h-3.5 w-auto object-contain" />
                    </div>
                    <div className="h-7 px-2.5 bg-white border border-gray-200 rounded flex items-center justify-center">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4 w-auto object-contain" />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
