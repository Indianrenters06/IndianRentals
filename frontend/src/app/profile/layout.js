'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { User } from '@phosphor-icons/react';

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
        <div className="w-full bg-[#F5F5F5] min-h-screen" style={{ opacity: 1 }}>
            <div className="max-w-[1440px] mx-auto flex items-start justify-center py-[10px]" style={{ height: '818px' }}>
                <div className="max-w-[1200px] w-full mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-[20px] h-full">
                    {/* Sidebar */}
                    <div className="lg:w-[245px] flex-shrink-0 h-full">
                        <div className="bg-white border border-[#E3E3E3] rounded-[10px] p-6 h-full flex flex-col">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-[60px] h-[60px] rounded-full bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden ring-1 ring-gray-100">
                                    <User size={40} weight="regular" />
                                </div>
                                <div>
                                    <p className="text-[11px] text-gray-400 font-sans font-medium uppercase tracking-wider">Your Account,</p>
                                    <p className="text-[15px] font-bold text-gray-900 font-sans">{userInfo?.name || 'Hello User'}</p>
                                    <p className="text-[11px] text-gray-400 font-sans">#100023</p>
                                </div>
                            </div>

                            <nav className="flex-1 space-y-7">
                                {sidebarSections.map((section, idx) => (
                                    <div key={idx}>
                                        {section.label && (
                                            <div className="mb-3">
                                                <h3 className="text-[12px] font-bold text-gray-400 mb-1 font-sans tracking-widest uppercase">
                                                    {section.label}
                                                </h3>
                                                <div className="h-[1px] bg-[#E5E5E5] w-full" />
                                            </div>
                                        )}
                                        <ul className="space-y-1">
                                            {section.items.map((item) => (
                                                <li key={item.name}>
                                                    <Link
                                                        href={item.href}
                                                        className={`block py-1.5 text-[15px] transition-all font-sans ${isActive(item.href)
                                                            ? 'text-[#007AFF] font-bold translate-x-1'
                                                            : item.name === 'Overview' && pathname.includes('overview')
                                                                ? 'text-[#007AFF] font-bold'
                                                                : 'text-gray-900 font-normal hover:text-blue-500'
                                                            }`}
                                                    >
                                                        {item.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </nav>

                            <div className="mt-auto pt-6 border-t border-gray-100">
                                <button className="text-[15px] font-bold text-red-500 hover:text-red-600 transition-colors font-sans">
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 bg-white border border-[#E3E3E3] rounded-[9px] p-10 h-full relative overflow-y-auto overflow-hidden">
                        {/* The dashed border inner wrapper as seen in screenshot */}
                        <div className="absolute inset-4 pointer-events-none rounded-[16px]">
                            <svg className="w-full h-full overflow-visible">
                                <rect
                                    x="0.5" y="0.5"
                                    width="calc(100% - 1px)"
                                    height="calc(100% - 1px)"
                                    rx="16" ry="16"
                                    stroke="#D3D3D3"
                                    strokeWidth="1"
                                    strokeDasharray="12 10"
                                    fill="none"
                                    style={{ opacity: 0.4 }}
                                />
                            </svg>
                        </div>
                        <div className="relative z-10 w-full">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
