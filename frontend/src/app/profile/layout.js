'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaUserCircle } from 'react-icons/fa';

export default function ProfileLayout({ children }) {
    const pathname = usePathname();
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo));
        }
    }, []);

    const sidebarSections = [
        {
            title: 'Overview',
            items: [
                { name: 'Overview', href: '/profile/overview' }
            ]
        },
        {
            title: 'SCHEMES', // Based on screenshot 'SUBSCRIPTIONS' seems more appropriate but text is small
            label: 'SUBSCRIPTIONS',
            items: [
                { name: 'My Orders', href: '/profile/orders' },
                { name: 'My Invoices', href: '/profile/invoices' },
                { name: 'Most Liked', href: '/profile/liked' },
            ]
        },
        {
            title: 'ACCOUNT',
            label: 'ACCOUNT',
            items: [
                { name: 'Your Addresses', href: '/profile/addresses' },
                { name: 'KYC & Documentation', href: '/profile/kyc' },
                { name: 'Profile Settings', href: '/profile/settings' },
                { name: 'Payment Methods', href: '/profile/methods' },
            ]
        },
        {
            title: 'CONTACT',
            label: 'CONTACT',
            items: [
                { name: 'Get In Touch', href: '/profile/contact' },
            ]
        }
    ];

    const isActive = (path) => pathname === path;

    return (
        <div className="min-h-screen pt-2 pb-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="lg:w-64 flex-shrink-0">
                        <div className="bg-gray-100 border border-gray-300 rounded-[10px] p-5">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="text-gray-600">
                                    <FaUserCircle size={48} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Your Account,</p>
                                    <p className="font-bold text-gray-800">{userInfo?.name || 'Hello User'}</p>
                                </div>
                            </div>

                            <nav className="space-y-6">
                                {sidebarSections.map((section, idx) => (
                                    <div key={idx}>
                                        {section.label && (
                                            <div className="">
                                                <h3 className="text-[12px] font-bold text-gray-500  mb-1">
                                                    {section.label}
                                                </h3>
                                                <hr className="border-gray-300" />
                                            </div>
                                        )}
                                        <ul className="">
                                            {section.items.map((item) => (
                                                <li key={item.name}>
                                                    <Link
                                                        href={item.href}
                                                        className={`block py-2 text-sm transition-colors ${isActive(item.href)
                                                            ? 'text-blue-500 font-semibold'
                                                            : item.name === 'Overview'
                                                                ? 'text-black font-semibold text-[15px]'
                                                                : 'text-gray-600 font-medium hover:text-gray-900'
                                                            }`}
                                                    >
                                                        {item.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                                {/* Logout Button */}
                                <div>
                                    <button className="text-md font-normal text-red-500 hover:text-red-600 ">
                                        Logout
                                    </button>
                                </div>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 relative bg-white rounded-[32px] p-8 min-h-[600px]">
                        {/* Custom Dashed Border SVG */}
                        <div className="absolute inset-0 pointer-events-none rounded-[32px]">
                            <svg className="w-full h-full overflow-visible">
                                <rect
                                    x="1" y="1"
                                    width="calc(100% - 2px)"
                                    height="calc(100% - 2px)"
                                    rx="10" ry="10"
                                    stroke="#D3D3D3"
                                    strokeWidth="1"
                                    strokeDasharray="12 10"
                                    fill="none"
                                />
                            </svg>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
