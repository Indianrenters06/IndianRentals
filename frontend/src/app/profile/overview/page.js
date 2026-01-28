'use client';

import React from 'react';
import Link from 'next/link';
import { BsCart3, BsPaperclip } from 'react-icons/bs';
import { PiMapPin, PiIdentificationBadge } from 'react-icons/pi';
import { RiHandCoinLine } from 'react-icons/ri';
import { GoInfo } from 'react-icons/go';
import { CiSearch } from 'react-icons/ci';

export default function OverviewPage() {
    const cards = [
        {
            title: 'My Orders',
            description: 'lorem ipsum dolor sit amet consectetur. Et habitasse odio.',
            icon: <BsCart3 size={24} />,
            href: '/profile/orders',
            active: true // Highlighted in blue in screenshot
        },
        {
            title: 'My Invoices',
            description: 'lorem ipsum dolor sit amet consectetur. Et habitasse odio.',
            icon: <BsPaperclip size={24} />,
            href: '/profile/invoices'
        },
        {
            title: 'Your Addresses',
            description: 'lorem ipsum dolor sit amet consectetur. Et habitasse odio.',
            icon: <PiMapPin size={24} />, // Approximation
            href: '/profile/addresses'
        },
        {
            title: 'KYC & Documentation',
            description: 'lorem ipsum dolor sit amet consectetur. Et habitasse odio.',
            icon: <PiIdentificationBadge size={24} />,
            href: '/profile/kyc'
        },
        {
            title: 'Profile Settings',
            description: 'lorem ipsum dolor sit amet consectetur. Et habitasse odio.',
            icon: <CiSearch size={24} />, // Looking like search on profile
            href: '/profile/settings'
        },
        {
            title: 'Payment Methods',
            description: 'lorem ipsum dolor sit amet consectetur. Et habitasse odio.',
            icon: <GoInfo size={24} />,
            href: '/profile/methods'
        },
        {
            title: 'Get In Touch',
            description: 'lorem ipsum dolor sit amet consectetur. Et habitasse odio.',
            icon: <RiHandCoinLine size={24} />, // Handshake/interaction
            href: '/profile/contact'
        }
    ];

    return (
        <div className="bg-white/50 min-h-full">
            <h1 className="text-3xl font-medium text-gray-800 mb-8">Overview</h1>

            <div className="h-px bg-gray-200 w-full mb-8"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((card, index) => (
                    <Link
                        key={index}
                        href={card.href}
                        className={`block p-6 rounded-xl border transition-all duration-200 group h-full
                            ${card.active
                                ? 'border-blue-500 bg-white ring-1 ring-blue-500 shadow-sm'
                                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                            }`}
                    >
                        <div className={`mb-4 ${card.active ? 'text-gray-800' : 'text-gray-600'}`}>
                            {card.icon}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {card.title}
                        </h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            {card.description}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
