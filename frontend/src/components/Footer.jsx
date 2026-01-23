"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp, FaCcVisa, FaCcMastercard } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-[#F9F9F9] text-black pt-12 pb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 ">

                    {/* Brand Column */}
                    <div>
                        <Link href="/" className="inline-block ">
                            <Image
                                src="https://res.cloudinary.com/dpu9ikeqe/image/upload/v1769063559/ChatGPT_Image_Jan_22_2026_12_00_17_PM_ohrzas.png"
                                alt="Indian Renters"
                                width={180}
                                height={60}
                                className="h-auto w-auto object-contain"
                            />
                        </Link>
                        <p className="text-gray-900 text-[13px] font-medium ">
                            Rent Anything, Anytime, Anywhere
                        </p>
                        <div className="flex items-center gap-3 pl-1">
                            <a href="#" className="w-9 h-9 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center transition-transform hover:scale-105 group">
                                <FaWhatsapp size={18} className="text-[#25D366]" />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center transition-transform hover:scale-105 group">
                                <FaFacebookF size={16} className="text-[#1877F2]" />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center transition-transform hover:scale-105 group">
                                <FaInstagram size={18} className="text-[#E4405F]" />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center transition-transform hover:scale-105 group">
                                <FaLinkedinIn size={16} className="text-[#0A66C2]" />
                            </a>
                        </div>
                    </div>

                    {/* Link Column 1 */}
                    <div className="pt-2">
                        <ul className="space-y-3 text-[14px] text-gray-700">
                            <li><Link href="/about" className="hover:text-black transition-colors">About Us</Link></li>
                            <li><Link href="/how-it-works" className="hover:text-black transition-colors">How It Works</Link></li>
                            <li><Link href="/careers" className="hover:text-black transition-colors">Jobs & Careers</Link></li>
                            <li><Link href="/contact" className="hover:text-black transition-colors">Contact</Link></li>
                            <li><Link href="/b2b" className="hover:text-black transition-colors">IndianRenters (B2B Link)</Link></li>
                        </ul>
                    </div>

                    {/* Link Column 2 */}
                    <div className="pt-2">
                        <ul className="space-y-3 text-[14px] text-gray-700">
                            <li><Link href="/kyc-policy" className="hover:text-black transition-colors">KYC Policy</Link></li>
                            <li><Link href="/shipping-policy" className="hover:text-black transition-colors">Shipping Policy</Link></li>
                            <li><Link href="/return-policy" className="hover:text-black transition-colors">Return Policy</Link></li>
                            <li><Link href="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-black transition-colors">Rental Terms & Conditions</Link></li>
                        </ul>
                    </div>

                    {/* Link Column 3 */}
                    <div className="pt-2">
                        <ul className="space-y-3 text-[14px] text-gray-700">
                            <li><Link href="/faq" className="hover:text-black transition-colors">FAQs</Link></li>
                            <li><Link href="/ticket" className="hover:text-black transition-colors">Raise a Ticket</Link></li>
                            <li><Link href="/reviews" className="hover:text-black transition-colors">Customer Reviews</Link></li>
                            <li><Link href="/blog" className="hover:text-black transition-colors">Blog</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-xs text-center md:text-left">
                        © 2025 AAA Rental LLP. All Rights Reserved
                    </p>
                    <div className="flex items-center gap-2 justify-center">
                        <div className="h-8 px-3 bg-white border border-gray-200 rounded flex items-center justify-center shadow-sm">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" className="h-6 w-auto object-contain" />
                        </div>
                        <div className="h-8 px-3 bg-white border border-gray-200 rounded flex items-center justify-center shadow-sm">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3 w-auto object-contain" />
                        </div>
                        <div className="h-8 px-3 bg-white border border-gray-200 rounded flex items-center justify-center shadow-sm">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Rupay-Logo.png" alt="RuPay" className="h-4 w-auto object-contain" />
                        </div>
                        <div className="h-8 px-3 bg-white border border-gray-200 rounded flex items-center justify-center shadow-sm">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5 w-auto object-contain" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
