'use client';

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FaCheckCircle, FaHome, FaShoppingBag } from 'react-icons/fa';
import confetti from 'canvas-confetti';

export const dynamic = 'force-dynamic';

function OrderConfirmationContent() {
    const searchParams = useSearchParams();

    // Read real data from URL params (populated by the checkout/payment page)
    const orderId = searchParams.get('orderId') || null;
    const amount = searchParams.get('amount') || null;
    const productName = searchParams.get('product') || null;

    useEffect(() => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: Math.random() * 0.3 + 0.1, y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: Math.random() * 0.2 + 0.7, y: Math.random() - 0.2 } });
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
                <p className="text-gray-500 mb-8">
                    Thank you for choosing IndianRenters! We received your order and will begin processing it right away.
                </p>

                <div className="bg-gray-50 rounded-xl p-4 mb-8 text-left space-y-3">
                    {orderId && (
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Order ID</span>
                            <span className="text-sm font-semibold text-gray-900 font-mono">
                                #{orderId.toString().slice(-8).toUpperCase()}
                            </span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Date</span>
                        <span className="text-sm font-medium text-gray-900">
                            {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </span>
                    </div>
                    {productName && (
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Product</span>
                            <span className="text-sm font-medium text-gray-900 max-w-[60%] text-right">{productName}</span>
                        </div>
                    )}
                    {amount && (
                        <div className="flex justify-between border-t border-gray-100 pt-3 mt-2">
                            <span className="text-sm font-semibold text-gray-700">Amount Paid</span>
                            <span className="text-sm font-bold text-gray-900">₹{Number(amount).toLocaleString('en-IN')}</span>
                        </div>
                    )}
                </div>

                <div className="bg-blue-50 rounded-xl px-4 py-3 mb-8 text-left">
                    <p className="text-xs text-blue-700 font-medium">📦 Delivery in 2-3 business days across India</p>
                    <p className="text-xs text-blue-600 mt-1">Our team will call you to confirm delivery slot.</p>
                </div>

                <div className="flex gap-4 flex-col sm:flex-row">
                    <Link
                        href="/"
                        className="flex-1 flex items-center justify-center gap-2 bg-[#FFD740] hover:bg-[#FFC400] text-[#1D1D1F] px-6 py-3.5 rounded-full font-medium transition-colors"
                    >
                        <FaHome /> Back to Home
                    </Link>
                    <Link
                        href="/profile/orders"
                        className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3.5 rounded-full font-medium transition-colors"
                    >
                        <FaShoppingBag /> View Orders
                    </Link>
                </div>
            </div>

            <p className="mt-8 text-sm text-gray-400">
                Need help?{' '}
                <Link href="/contact" className="underline hover:text-gray-600">Contact Support</Link>
            </p>
        </div>
    );
}

export default function OrderConfirmationPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-400 text-sm">Loading…</div>
            </div>
        }>
            <OrderConfirmationContent />
        </Suspense>
    );
}
