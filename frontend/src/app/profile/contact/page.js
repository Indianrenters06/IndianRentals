'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const BackArrowIcon = () => (
    <svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export default function GetInTouchPage() {
    const router = useRouter();

    const touchCards = [
        {
            title: 'Chat With Us',
            description: 'Get quick resolution with the help of our Chat bot',
            buttonText: 'Chat With Us',
            href: '/contact'
        },
        {
            title: 'Contact Us',
            description: 'If you have any query, we will help you with it',
            buttonText: 'Submit Query',
            href: '/contact'
        },
        {
            title: 'FAQs',
            description: 'Find answers to your doubts at our help dashboard',
            buttonText: 'Help Center',
            href: '/contact'
        }
    ];

    return (
        <>
            {/* ── DESKTOP VIEW (Original, untouched) ── */}
            <div className="hidden lg:block bg-white min-h-[500px] rounded-2xl p-8 border border-gray-100">
                <h1 className="text-2xl font-medium text-gray-800 mb-6">Get In Touch</h1>

                <div className="h-px bg-gray-200 w-full mb-8"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Chat With Us Card */}
                    <div className="border border-gray-200 rounded-xl p-6 flex flex-col items-start hover:shadow-md transition-shadow">
                        <h3 className="text-base font-semibold text-gray-900 mb-2">Chat With Us</h3>
                        <p className="text-sm text-gray-500 mb-6 flex-grow">
                            Get quick resolution with the help of our Chat bot
                        </p>
                        <Link href="/contact" className="w-full">
                            <button className="w-full bg-[#007bff] hover:bg-[#0069d9] text-white font-medium py-2.5 rounded-full transition-colors shadow-sm text-sm">
                                Chat With Us
                            </button>
                        </Link>
                    </div>

                    {/* Contact Us Card */}
                    <div className="border border-gray-200 rounded-xl p-6 flex flex-col items-start hover:shadow-md transition-shadow">
                        <h3 className="text-base font-semibold text-gray-900 mb-2">Contact Us</h3>
                        <p className="text-sm text-gray-500 mb-6 flex-grow">
                            If you have any query, we will help you with it
                        </p>
                        <Link href="/contact" className="w-full">
                            <button className="w-full bg-[#007bff] hover:bg-[#0069d9] text-white font-medium py-2.5 rounded-full transition-colors shadow-sm text-sm">
                                Submit Query
                            </button>
                        </Link>
                    </div>

                    {/* FAQs Card */}
                    <div className="border border-gray-200 rounded-xl p-6 flex flex-col items-start hover:shadow-md transition-shadow">
                        <h3 className="text-base font-semibold text-gray-900 mb-2">FAQs</h3>
                        <p className="text-sm text-gray-500 mb-6 flex-grow">
                            Find answers to your doubts at our help dashboard
                        </p>
                        <Link href="/contact" className="w-full">
                            <button className="w-full bg-[#007bff] hover:bg-[#0069d9] text-white font-medium py-2.5 rounded-full transition-colors shadow-sm text-sm">
                                Help Center
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── MOBILE VIEW (Figma exact match) ── */}
            <div className="flex lg:hidden flex-col gap-[12px] bg-white rounded-[8px] p-0 py-[10px]">
                {/* Mobile Title with Back Arrow */}
                <div className="flex items-center gap-[4px]">
                    <button 
                        onClick={() => router.back()} 
                        className="p-1 -ml-1 text-[#333333] hover:opacity-75 transition-opacity"
                        aria-label="Go back"
                    >
                        <BackArrowIcon />
                    </button>
                    <h1 className="text-[20px] font-semibold tracking-[-0.8px] text-[#333333] leading-[26px]">
                        Get In Touch
                    </h1>
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-[#e2e2e2]" />

                {/* Cards Stack */}
                <div className="flex flex-col gap-[12px]">
                    {touchCards.map((card) => (
                        <div
                            key={card.title}
                            className="bg-white border border-[#e2e2e2] rounded-[8px] px-[20px] py-[32px] flex flex-col gap-[8px] items-start w-full"
                        >
                            <h3 className="text-[14px] font-bold text-black tracking-[-0.8px] leading-[20px]">
                                {card.title}
                            </h3>
                            <p className="text-[10px] font-medium text-[#757575] tracking-[-0.4px] leading-[16px] max-w-[201px]">
                                {card.description}
                            </p>
                            <Link href={card.href} className="w-full mt-1">
                                <button className="w-full h-[26px] bg-[#0075ff] hover:bg-[#0064dc] text-[#edfaff] text-[12px] font-semibold tracking-[-0.4px] leading-[18px] rounded-[28px] flex items-center justify-center transition-colors">
                                    {card.buttonText}
                                </button>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

