'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const FALLBACK_CONTENT = `<h2>Late Fee Rules</h2>
<p>We understand that situations can arise. However, to ensure fair access for all customers, late returns are subject to the following fee structure.</p>
<h3>Grace Period</h3>
<p>A grace period of 1 day is provided after your rental end date at no additional cost.</p>
<h3>Late Fee Charges</h3>
<p>After the grace period, a late fee will be charged per day until the product is returned. The exact per-day charge is based on the product category.</p>
<h3>How to Avoid Late Fees</h3>
<p>You can extend your rental period directly from your account dashboard before the rental end date to avoid any late fee charges.</p>`;

export default function LateFeeRulesPage() {
    const [cms, setCms] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.fetch(`${API}/api/cms/late-fee-rules?t=${Date.now()}`)
            .then(r => r.ok ? r.json() : null)
            .then(d => { setCms(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const bannerImage = cms?.bannerImage || "https://res.cloudinary.com/dgkckcdk8/image/upload/v1776892240/1d1f7c4e3c0490bcddb69ceb328c67be2f7cf361_6_kufcee.png";
    const bannerTitle = cms?.bannerTitle || "Late Fee Rules";
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
