'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FaCheckCircle, FaHome, FaShoppingBag } from 'react-icons/fa';
import confetti from 'canvas-confetti';
import { API_BASE_URL } from '../../services/apiConfig';

export const dynamic = 'force-dynamic';

function OrderConfirmationContent() {
    const searchParams = useSearchParams();

    const orderId = searchParams.get('orderId');
    const [rental, setRental] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [refresh, setRefresh] = useState(0);
    const paid = rental?.isPaid === true;
    const amount = paid ? rental.totalPrice : null;
    const productName = rental?.orderItems?.map(item => item.name).join(', ');

    useEffect(() => {
        let cancelled = false;
        async function loadOrder() {
            setLoading(true); setError('');
            try {
                if (!orderId || !/^[a-f\d]{24}$/i.test(orderId)) throw new Error('Open this page from your order to check its payment.');
                const user = JSON.parse(localStorage.getItem('userInfo') || '{}');
                if (!user.token) throw new Error('Please sign in to view your order.');
                const headers = { Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json' };
                const response = await fetch(`${API_BASE_URL}/api/rentals/${orderId}`, { headers, cache: 'no-store' });
                const current = await response.json();
                if (!response.ok) throw new Error(current.message || 'Unable to load your order');
                let verified = current;
                if (!current.isPaid && current.payment?.providerOrderId) {
                    const verification = await fetch(`${API_BASE_URL}/api/payments/cashfree/verify`, {
                        method: 'POST', headers, body: JSON.stringify({ rentalId: orderId }),
                    });
                    if (verification.ok) verified = (await verification.json()).rental || current;
                }
                if (!cancelled) setRental(verified);
            } catch (err) { if (!cancelled) { setRental(null); setError(err.message); } }
            finally { if (!cancelled) setLoading(false); }
        }
        loadOrder();
        return () => { cancelled = true; };
    }, [orderId, refresh]);

    useEffect(() => {
        if (!paid || rental?.refundReviewRequired) return;
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
    }, [paid, rental?.refundReviewRequired]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-10 max-w-lg w-full text-center shadow-xl border border-gray-100">
                {paid && !rental?.refundReviewRequired && <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-50 text-green-500 mb-6 animate-bounce">
                    <FaCheckCircle size={60} />
                </div>}

                <h1 className="text-3xl font-bold text-gray-900 mb-2">{loading ? 'Checking your payment' : error ? 'Unable to confirm your order' : rental?.refundReviewRequired ? 'Payment needs review' : paid ? 'Payment confirmed' : 'Payment not confirmed yet'}</h1>
                <p className="text-gray-500 mb-8">
                    {error || (loading ? 'Please wait while we check your order.' : rental?.refundReviewRequired ? 'Payment was received for a cancelled order. Please contact support for the next step.' : paid ? 'We received your payment. View your order for the next steps.' : 'Your order is awaiting payment confirmation. If your account was debited, check again before making another payment.')}
                </p>

                <div className="bg-gray-50 rounded-xl p-4 mb-8 text-left space-y-3">
                    {rental && orderId && (
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
                            {new Date(rental?.paidAt || rental?.createdAt || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </span>
                    </div>
                    {productName && (
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Product</span>
                            <span className="text-sm font-medium text-gray-900 max-w-[60%] text-right">{productName}</span>
                        </div>
                    )}
                    {paid && amount != null && (
                        <div className="flex justify-between border-t border-gray-100 pt-3 mt-2">
                            <span className="text-sm font-semibold text-gray-700">Amount Paid</span>
                            <span className="text-sm font-bold text-gray-900">₹{Number(amount).toLocaleString('en-IN')}</span>
                        </div>
                    )}
                </div>

                {!loading && !paid && !error && <button onClick={() => setRefresh(value => value + 1)} className="btn-primary px-6 py-3 mb-6">Check payment status</button>}

                <div className="flex gap-4 flex-col sm:flex-row">
                    <Link
                        href="/"
                        className="btn-primary flex-1 gap-2 px-6 py-3.5"
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
