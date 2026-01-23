'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { FaCheckCircle, FaHome, FaShoppingBag } from 'react-icons/fa';
import confetti from 'canvas-confetti';

export default function OrderConfirmationPage() {

    useEffect(() => {
        // Fire confetti on mount
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min, max) => {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-10 max-w-lg w-full text-center shadow-xl border border-gray-100">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-50 text-green-500 mb-6 animate-bounce">
                    <FaCheckCircle size={60} />
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
                <p className="text-gray-500 mb-8">Thank you for ordering. We received your order and will begin processing it right away.</p>

                <div className="bg-gray-50 rounded-xl p-4 mb-8 text-left">
                    <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-500">Order ID</span>
                        <span className="text-sm font-medium text-gray-900">#ORD-2024-8839</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-500">Date</span>
                        <span className="text-sm font-medium text-gray-900">{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Amount Paid</span>
                        <span className="text-sm font-bold text-gray-900">₹600.00</span>
                    </div>
                </div>

                <div className="flex gap-4 flex-col sm:flex-row">
                    <Link
                        href="/"
                        className="flex-1 flex items-center justify-center gap-2 bg-[#FFD740] hover:bg-[#FFC400] text-[#1D1D1F] px-6 py-3.5 rounded-full font-medium transition-colors"
                    >
                        <FaHome /> Back to Home
                    </Link>
                    <Link
                        href="/orders"
                        className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3.5 rounded-full font-medium transition-colors"
                    >
                        <FaShoppingBag /> View Orders
                    </Link>
                </div>
            </div>

            <p className="mt-8 text-sm text-gray-400">Need help? <a href="#" className="underline">Contact Support</a></p>
        </div>
    );
}
