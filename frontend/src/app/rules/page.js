'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const FALLBACK_CONTENT = `<h2>Rules & Charges</h2>
<h3>Delivery Charges</h3>
<p>Base delivery charge is ₹100. We offer free delivery on orders above ₹2000.</p>
<h3>Late Fee Rules</h3>
<p>If you fail to return the rented equipment on time, a late fee of ₹50 per day will be charged after a 1-day grace period.</p>
<h3>Cancellation Rules</h3>
<p>Orders can be cancelled free of charge up to 24 hours before the scheduled delivery. Late cancellations may incur a fee.</p>
<h3>Subscription Rules</h3>
<p>Monthly subscriptions auto-renew unless cancelled at least 7 days prior to the billing cycle.</p>`;

export default function RulesPage() {
    const [cms, setCms] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.fetch(`${API}/api/cms/rules?t=${Date.now()}`)
            .then(r => r.ok ? r.json() : null)
            .then(d => { setCms(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const bannerImage = cms?.bannerImage || "https://res.cloudinary.com/dgkckcdk8/image/upload/v1746200213/banner_placeholder_x2qzpf.jpg";
    const bannerTitle = cms?.bannerTitle || "Rules & Charges";
    const pageContent = cms?.pageContent || FALLBACK_CONTENT;

    return (
        <div className="font-sans text-gray-800 pb-20">
            {/* Banner */}
            <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-16">
                <div className="w-full h-[300px] md:h-[400px] relative bg-gray-200 overflow-hidden rounded-3xl group">
                    <Image
                        src={bannerImage}
                        alt={bannerTitle}
                        fill
                        className="object-cover object-center brightness-75 transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h1 className="text-white text-5xl md:text-7xl font-semibold drop-shadow-lg font-sans text-center px-4">
                            {bannerTitle}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-8">
                {loading ? (
                    <div className="flex items-center justify-center py-24 text-gray-400">
                        <div className="animate-spin w-6 h-6 rounded-full border-2 border-gray-300 border-t-gray-600 mr-3" />
                        Loading…
                    </div>
                ) : (
                    <div
                        className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: pageContent }}
                    />
                )}
            </div>
        </div>
    );
}
