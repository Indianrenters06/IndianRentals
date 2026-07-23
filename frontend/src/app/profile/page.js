'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User } from '@phosphor-icons/react';
import { logout } from '../../services/authService';

const sections = [
    {
        label: 'SUBSCRIPTIONS',
        items: [
            { name: 'My Orders', href: '/profile/orders' },
            { name: 'My Invoices', href: '/profile/invoices' },
            { name: 'Most Liked', href: '/profile/liked' },
        ],
    },
    {
        label: 'ACCOUNT',
        items: [
            { name: 'Your Addresses', href: '/profile/addresses' },
            { name: 'KYC & Documentation', href: '/profile/kyc' },
            { name: 'Profile Settings', href: '/profile/settings' },
            { name: 'Payment Methods', href: '/profile/methods' },
        ],
    },
    {
        label: 'CONTACT',
        items: [
            { name: 'Get In Touch', href: '/profile/contact', color: 'text-[#007AFF]' },
        ],
    },
];

// On desktop the profile section opens straight into the Overview dashboard.
// On mobile this route is the account "menu" screen (matches Figma 24034:18722).
export default function ProfileHome() {
    const router = useRouter();
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem('userInfo');
        if (stored) setUserInfo(JSON.parse(stored));
        if (window.innerWidth >= 1024) router.replace('/profile/overview');
    }, [router]);

    return (
        <div className="lg:hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <div className="w-[60px] h-[60px] rounded-full bg-[#4B4B4B] flex items-center justify-center text-white shrink-0 overflow-hidden">
                    {userInfo?.avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={userInfo.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <User size={36} weight="fill" />
                    )}
                </div>
                <div>
                    <p className="text-[13px] text-gray-400 font-medium">Your Account,</p>
                    <p className="text-[16px] font-bold text-gray-900">{userInfo?.name || 'Hello User'}</p>
                    <p className="text-[12px] text-gray-400">#100023</p>
                </div>
            </div>

            {/* Overview → dashboard */}
            <Link href="/profile/overview" className="text-[22px] font-bold text-gray-900 mb-6 block">
                Overview
            </Link>

            {/* Sections */}
            <nav className="flex flex-col gap-6">
                {sections.map((sec) => (
                    <div key={sec.label}>
                        <h3 className="text-[12px] font-semibold text-gray-400 tracking-wider mb-2">{sec.label}</h3>
                        <div className="h-px bg-gray-200 w-full mb-3" />
                        <ul className="flex flex-col gap-4">
                            {sec.items.map((it) => (
                                <li key={it.name}>
                                    <Link href={it.href} className={`text-[16px] ${it.color || 'text-gray-900'}`}>
                                        {it.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </nav>

            <button
                onClick={() => logout()}
                className="text-[16px] font-medium text-red-500 mt-8 mb-4 text-left"
            >
                Logout
            </button>
        </div>
    );
}
