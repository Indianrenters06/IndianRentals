'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const FALLBACK_CONTENT = `<h2>Subscription Rules</h2>
<p>Our subscription plans give you access to premium rental products at a predictable monthly cost. Please read the following rules carefully.</p>
<h3>Auto-Renewal</h3>
<p>Subscriptions automatically renew at the end of each billing cycle unless cancelled at least 7 days before the renewal date.</p>
<h3>Cancellation of Subscription</h3>
<p>You can cancel your subscription anytime from your account dashboard. The cancellation will take effect at the end of the current billing period and no further charges will be made.</p>
<h3>Plan Upgrades & Downgrades</h3>
<p>You may upgrade or downgrade your subscription plan at any time. Changes will be reflected in your next billing cycle.</p>
<h3>Pausing a Subscription</h3>
<p>Subscriptions can be paused once per billing cycle for up to 30 days. Pausing does not extend your billing cycle.</p>`;

export default function SubscriptionRulesPage() {
    const [cms, setCms] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.fetch(`${API}/api/cms/subscription-rules?t=${Date.now()}`)
            .then(r => r.ok ? r.json() : null)
            .then(d => { setCms(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const bannerImage = cms?.bannerImage || "https://res.cloudinary.com/dgkckcdk8/image/upload/v1776892240/1d1f7c4e3c0490bcddb69ceb328c67be2f7cf361_6_kufcee.png";
    const bannerTitle = cms?.bannerTitle || "Subscription Rules";
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
