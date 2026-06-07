'use client';

import React from 'react';
import Link from 'next/link';
import { FaPlus, FaArrowLeft } from 'react-icons/fa';

export default function PaymentMethodsPage() {
    return (
        <div className="bg-white min-h-screen rounded-2xl p-5 lg:p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
                <Link href="/profile" aria-label="Back to menu" className="lg:hidden text-gray-800 shrink-0">
                    <FaArrowLeft size={20} />
                </Link>
                <h1 className="text-3xl font-medium text-gray-800">Payment Methods</h1>
            </div>

            <div className="h-px bg-gray-200 w-full mb-6"></div>

            <p className="text-gray-600 mb-8 font-medium">Review & update your payment details</p>

            <button className="flex items-center gap-2 bg-[#333] hover:bg-black text-white px-6 py-3 rounded-full text-sm font-medium shadow-sm transition-colors">
                <FaPlus size={12} />
                Add Payment Method
            </button>
        </div>
    );
}
