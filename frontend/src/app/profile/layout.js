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
        <div className="min-h-screen bg-gray-50 font-sans pt-8 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="lg:w-64 flex-shrink-0">
                        <div className="bg-white/50 rounded-2xl p-6 mb-6 flex items-center gap-4">
                            <div className="text-gray-600">
                                <FaUserCircle size={48} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Your Account,</p>
                                <p className="font-bold text-gray-800">{userInfo?.name || 'Hello User'}</p>
                                <p className="text-xs text-gray-400">#100023</p>
                            </div>
                        </div>

                        <nav className="space-y-8 pl-2">
                            {sidebarSections.map((section, idx) => (
                                <div key={idx}>
                                    {section.label && (
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                                            {section.label}
                                        </h3>
                                    )}
                                    <ul className="space-y-1">
                                        {section.items.map((item) => (
                                            <li key={item.name}>
                                                <Link
                                                    href={item.href}
                                                    className={`block px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive(item.href)
                                                            ? 'text-indigo-600 bg-indigo-50/50'
                                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
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
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
