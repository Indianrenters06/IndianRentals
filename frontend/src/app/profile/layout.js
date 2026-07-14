'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

// Exact avatar vector from the Figma "side-bar-settings" component (node 23050:11078).
const AvatarIcon = () => (
    <svg width="65" height="65" viewBox="0 0 65 65" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M43.6719 30.4687C43.6719 32.6783 43.0166 34.8383 41.7891 36.6755C40.5615 38.5127 38.8167 39.9446 36.7753 40.7902C34.7339 41.6358 32.4876 41.857 30.3205 41.426C28.1533 40.9949 26.1627 39.9309 24.6003 38.3685C23.0379 36.806 21.9739 34.8154 21.5428 32.6483C21.1117 30.4811 21.333 28.2348 22.1785 26.1935C23.0241 24.1521 24.456 22.4073 26.2932 21.1797C28.1304 19.9521 30.2904 19.2969 32.5 19.2969C35.4619 19.3002 38.3016 20.4783 40.396 22.5728C42.4904 24.6672 43.6685 27.5068 43.6719 30.4687ZM58.9062 32.5C58.9062 37.7227 57.3575 42.828 54.456 47.1705C51.5544 51.513 47.4303 54.8976 42.6052 56.8962C37.7801 58.8948 32.4707 59.4177 27.3484 58.3989C22.2261 57.38 17.5209 54.865 13.828 51.172C10.135 47.4791 7.62003 42.7739 6.60114 37.6516C5.58225 32.5293 6.10518 27.2199 8.10381 22.3948C10.1024 17.5697 13.487 13.4456 17.8295 10.544C22.172 7.64245 27.2773 6.09375 32.5 6.09375C39.5011 6.10114 46.2133 8.8856 51.1639 13.8361C56.1144 18.7867 58.8989 25.4989 58.9062 32.5ZM54.8437 32.5C54.8405 29.4926 54.2308 26.5167 53.051 23.7503C51.8713 20.9839 50.1458 18.4838 47.9776 16.3996C45.8095 14.3154 43.2433 12.6899 40.4326 11.6202C37.6218 10.5505 34.6242 10.0586 31.6189 10.174C19.66 10.6361 10.1232 20.5969 10.1562 32.5635C10.1677 38.0111 12.1769 43.2653 15.8031 47.3307C17.2799 45.1887 19.1558 43.3516 21.3281 41.9199C21.5133 41.7976 21.7335 41.7393 21.955 41.754C22.1765 41.7687 22.387 41.8555 22.5545 42.0012C25.3149 44.3888 28.8426 45.7028 32.4924 45.7028C36.1421 45.7028 39.6699 44.3888 42.4303 42.0012C42.5977 41.8555 42.8083 41.7687 43.0298 41.754C43.2512 41.7393 43.4714 41.7976 43.6566 41.9199C45.8317 43.3509 47.7102 45.188 49.1893 47.3307C52.8334 43.2505 54.8465 37.9706 54.8437 32.5Z" fill="#545454" />
    </svg>
);

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
    // Sections that render with an UPPERCASE label + divider (everything except the standalone "Overview" link).
    const labeledSections = sidebarSections.filter((s) => s.label);

    return (
        <div className="w-full bg-white lg:bg-[#F5F5F5] min-h-screen" style={{ opacity: 1 }}>
            <div className="max-w-[1440px] mx-auto flex items-start justify-center py-0 lg:py-[10px] h-auto">
                <div className="max-w-[1200px] w-full mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-[20px] items-start">
                    {/* Sidebar (desktop only) — exact rebuild of Figma "side-bar-settings" (node 23050:11078) */}
                    <div className="hidden lg:block lg:w-[250px] flex-shrink-0 lg:self-start">
                        <div className="bg-white border border-[#e2e2e2] rounded-2xl px-[22px] py-8 flex items-center">
                            <div className="flex flex-col gap-[22px] w-[206px]">
                                {/* Profile header */}
                                <div className="flex items-center gap-[10px]">
                                    <div className="size-[55px] rounded-full bg-white border border-[#eeeeee] overflow-hidden relative shrink-0">
                                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[65px]">
                                            <AvatarIcon />
                                        </div>
                                    </div>
                                    <div className="flex flex-col w-[87px]">
                                        <p className="text-[14px] font-medium leading-5 tracking-[-0.4px] text-[#757575]">Your Account,</p>
                                        <p className="text-[14px] font-bold leading-5 tracking-[-0.4px] text-[#333333]">{userInfo?.name || 'Hello User'}</p>
                                        <p className="text-[12px] font-medium leading-4 tracking-[-0.4px] text-[#757575]">#100023</p>
                                    </div>
                                </div>

                                {/* Nav sections + Logout (80px gap between them, per Figma) */}
                                <div className="flex flex-col gap-20">
                                    <nav className="flex flex-col gap-[37px]">
                                        {/* Overview — standalone link, blue when active */}
                                        <Link
                                            href="/profile/overview"
                                            className={`text-[16px] font-semibold leading-[23px] tracking-[-0.4px] ${pathname.includes('/profile/overview') ? 'text-[#0d4e9b]' : 'text-[#333333] hover:text-[#0d4e9b]'}`}
                                        >
                                            Overview
                                        </Link>

                                        {/* Labeled sections */}
                                        {labeledSections.map((section) => (
                                            <div key={section.label} className="flex flex-col gap-2">
                                                <p className="text-[12px] font-bold leading-4 tracking-[-0.4px] text-[#757575] uppercase">
                                                    {section.label}
                                                </p>
                                                <div className="h-px w-full bg-[#e2e2e2]" />
                                                <div className="flex flex-col gap-[11px]">
                                                    {section.items.map((item) => (
                                                        <Link
                                                            key={item.name}
                                                            href={item.href}
                                                            className={`text-[14px] font-semibold leading-5 tracking-[-0.4px] ${isActive(item.href) ? 'text-[#0d4e9b]' : 'text-[#333333] hover:text-[#0d4e9b]'}`}
                                                        >
                                                            {item.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </nav>

                                    <button className="text-left text-[14px] font-medium leading-5 tracking-[-0.4px] text-[#ed2115] hover:opacity-80 transition-opacity w-[184px]">
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content — single dashed panel, exact match of Figma "Frame 237" (node 23050:11079):
                        1px #cbcbcb stroke, 10px dash / 10px gap, 20px radius, 20px horizontal / 40px vertical padding.
                        Drawn as an SVG stroke so the dash length matches Figma exactly (CSS border-dashed can't). */}
                    <div className="flex-1 bg-white rounded-none lg:rounded-[20px] py-5 lg:px-5 lg:py-10 h-auto lg:self-start relative overflow-visible">
                        <div className="hidden lg:block absolute inset-0 pointer-events-none">
                            <svg className="w-full h-full overflow-visible">
                                <rect
                                    x="0.5"
                                    y="0.5"
                                    width="calc(100% - 1px)"
                                    height="calc(100% - 1px)"
                                    rx="20"
                                    ry="20"
                                    fill="none"
                                    stroke="#cbcbcb"
                                    strokeWidth="1"
                                    strokeDasharray="10 10"
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
