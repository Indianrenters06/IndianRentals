'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BsCart3, BsPaperclip } from 'react-icons/bs';
import { PiMapPin, PiIdentificationBadge } from 'react-icons/pi';
import { RiHandCoinLine } from 'react-icons/ri';
import { GoInfo } from 'react-icons/go';
import { CiSearch } from 'react-icons/ci';
import { getKYCStatus } from '../../../services/kycService';

export default function OverviewPage() {
    const [kycStatus, setKycStatus] = useState('Not Submitted');

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const data = await getKYCStatus();
                if (data && data.status) {
                    setKycStatus(data.status); // Assuming dynamic status from backend
                } else if (data) {
                    setKycStatus('Under Review');
                }
            } catch (error) {
                console.error('Error fetching KYC status:', error);
            }
        };
        fetchStatus();
    }, []);

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'approved': return 'text-green-600 bg-green-50 border-green-200';
            case 'rejected': return 'text-red-600 bg-red-50 border-red-200';
            case 'pending':
            case 'under review': return 'text-orange-600 bg-orange-50 border-orange-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const cards = [
        {
            title: 'My Orders',
            description: 'Track, return, or buy things again.',
            icon: <BsCart3 size={24} />,
            href: '/profile/orders',
            active: true // Highlighted in blue in screenshot
        },
        {
            title: 'My Invoices',
            description: 'Download invoices for your orders.',
            icon: <BsPaperclip size={24} />,
            href: '/profile/invoices'
        },
        {
            title: 'Your Addresses',
            description: 'Edit addresses for orders and gifts.',
            icon: <PiMapPin size={24} />, // Approximation
            href: '/profile/addresses'
        },
        {
            title: 'KYC & Documentation',
            description: 'Complete your KYC to rent products.',
            icon: <PiIdentificationBadge size={24} />,
            href: '/profile/kyc',
            status: kycStatus
        },
        {
            title: 'Profile Settings',
            description: 'Edit login, name, and mobile number.',
            icon: <CiSearch size={24} />, // Looking like search on profile
            href: '/profile/settings'
        },
        {
            title: 'Payment Methods',
            description: 'Manage saved cards and UPI.',
            icon: <GoInfo size={24} />,
            href: '/profile/methods'
        },
        {
            title: 'Get In Touch',
            description: 'Contact customer support.',
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
                        className={`block p-6 rounded-xl border transition-all duration-200 group h-full relative
                            ${card.active
                                ? 'border-blue-500 bg-white ring-1 ring-blue-500 shadow-sm'
                                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                            }`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`${card.active ? 'text-gray-800' : 'text-gray-600'}`}>
                                {card.icon}
                            </div>
                            {card.status && (
                                <span className={`text-xs px-2 py-1 rounded-full font-medium border ${getStatusColor(card.status)}`}>
                                    {card.status}
                                </span>
                            )}
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
