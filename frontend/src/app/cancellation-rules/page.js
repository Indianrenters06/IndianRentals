'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const FALLBACK_CONTENT = `<h2>Cancellation Rules</h2>
<p>We aim to make cancellations as easy as possible while maintaining fairness to our operations team.</p>
<h3>Free Cancellation</h3>
<p>Orders can be cancelled free of charge if the request is made before the product is dispatched for delivery.</p>
<h3>Cancellation After Dispatch</h3>
<p>If the product has already been dispatched, a cancellation fee may apply to cover delivery and restocking costs.</p>
<h3>How to Cancel</h3>
<p>You can cancel your order directly from your account under "My Orders". For urgent cancellations, please contact our support team immediately.</p>
<h3>Refunds on Cancellation</h3>
<p>Refunds for eligible cancellations will be processed within 5-7 business days to the original payment method.</p>`;

export default function CancellationRulesPage() {
    const [cms, setCms] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.fetch(`${API}/api/cms/cancellation-rules?t=${Date.now()}`)
            .then(r => r.ok ? r.json() : null)
            .then(d => { setCms(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const bannerImage = cms?.bannerImage || "https://res.cloudinary.com/dgkckcdk8/image/upload/v1776892240/1d1f7c4e3c0490bcddb69ceb328c67be2f7cf361_6_kufcee.png";
    const bannerTitle = cms?.bannerTitle || "Cancellation Rules";
    const pageContent = cms?.pageContent || FALLBACK_CONTENT;

    return (
        <div className="font-sans text-gray-800 pb-20">
            <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-16">
                <div className="w-full h-[300px] md:h-[400px] relative bg-gray-200 overflow-hidden rounded-3xl group">
                    <Image src={bannerImage} alt={bannerTitle} fill className="object-cover object-center brightness-75 transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h1 className="text-white text-5xl md:text-7xl font-semibold drop-shadow-lg font-sans text-center px-4">{bannerTitle}</h1>
                    </div>
                </div>
            </div>
            <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-8">
                {loading ? (
                    <div className="flex items-center justify-center py-24 text-gray-400">
                        <div className="animate-spin w-6 h-6 rounded-full border-2 border-gray-300 border-t-gray-600 mr-3" /> Loading…
                    </div>
                ) : (
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: pageContent }} />
                )}
            </div>
        </div>
    );
}
