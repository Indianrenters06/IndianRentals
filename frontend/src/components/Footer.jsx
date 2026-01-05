"use client";
import React from 'react';
import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Brand Column */}
                    <div>
                        <Link href="/" className="flex items-center gap-1 mb-6">
                            {/* Logo Icon logic if needed, or just text */}
                            <span className="text-2xl font-bold text-[#FF3B30]">
                                Indian
                            </span>
                            <span className="text-2xl font-bold text-[#0071E3]">
                                Renters
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            IndianRenters provides premium IT equipment on rent. From MacBooks to Servers, we enable businesses and individuals to scale effortlessly.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-indigo-600 transition-colors">
                                <FaFacebookF size={16} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-indigo-600 transition-colors">
                                <FaTwitter size={16} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-indigo-600 transition-colors">
                                <FaInstagram size={16} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-indigo-600 transition-colors">
                                <FaLinkedinIn size={16} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Quick Links</h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="/products" className="hover:text-white transition-colors">Products</Link></li>
                            <li><Link href="/rental-process" className="hover:text-white transition-colors">Rental Process</Link></li>
                            <li><Link href="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Categories</h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link href="/category/apple" className="hover:text-white transition-colors">Apple Products</Link></li>
                            <li><Link href="/category/laptops" className="hover:text-white transition-colors">Laptops & Workstations</Link></li>
                            <li><Link href="/category/servers" className="hover:text-white transition-colors">Servers</Link></li>
                            <li><Link href="/category/tablets" className="hover:text-white transition-colors">Tablets & iPads</Link></li>
                            <li><Link href="/category/audio-visual" className="hover:text-white transition-colors">Audio Visual</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Contact Us</h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li>
                                <span className="block text-gray-500 text-xs uppercase tracking-wide mb-1">Address</span>
                                123, Tech Park, Sector 62, Noida, UP, India
                            </li>
                            <li>
                                <span className="block text-gray-500 text-xs uppercase tracking-wide mb-1">Phone</span>
                                +91 98765 43210
                            </li>
                            <li>
                                <span className="block text-gray-500 text-xs uppercase tracking-wide mb-1">Email</span>
                                support@indianrenters.com
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} IndianRenters. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
