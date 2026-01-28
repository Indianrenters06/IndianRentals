'use client';

import React from 'react';
import Link from 'next/link';

export default function GetInTouchPage() {
    return (
        <div className="bg-white min-h-[500px] rounded-2xl p-8 border border-gray-100">
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
    );
}
