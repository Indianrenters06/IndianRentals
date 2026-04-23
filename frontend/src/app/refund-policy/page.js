'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const FALLBACK = `<h2>Cancellation &amp; Refund Policy</h2>
<p>We understand that plans change. Here's what you need to know about our cancellation and refund process.</p>
<h3>Pre-Delivery Cancellation</h3>
<p>You may cancel your order before it is dispatched with a full refund of any advance payment within 5–7 business days.</p>
<h3>Post-Delivery Cancellation</h3>
<p>If the product has been delivered, cancellation is subject to a minimum 1-month rental charge. Return the product in its original condition to initiate the refund process.</p>
<h3>Security Deposit Refund</h3>
<p>The refundable security deposit is returned within 7–10 business days after the product is received and inspected by our team.</p>
<h3>Damage Deductions</h3>
<p>Any damage beyond normal wear and tear will be assessed and deducted from the security deposit before the refund is processed.</p>
<h3>Contact Us</h3>
<p>For cancellations or refund queries, email us at support@indianrenters.com or call +91-XXXXXXXXXX.</p>`;

export default function RefundPage() {
    const [cms, setCms] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetch(`${API}/api/cms/refund`)
            .then(r => r.ok ? r.json() : null)
            .then(d => { setCms(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);
    const bannerImage = cms?.bannerImage || 'https://res.cloudinary.com/dpu9ikeqe/image/upload/v1770802400/ae1488b221c19db77a3c781e4313273ed5449f17_xdpggg.jpg';
    const bannerTitle = cms?.bannerTitle || 'Cancellation & Refund Policy';
    const pageContent = cms?.pageContent || FALLBACK;
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
                        <div className="animate-spin w-6 h-6 rounded-full border-2 border-gray-300 border-t-gray-600 mr-3" />Loading…
                    </div>
                ) : (
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: pageContent }} />
                )}
            </div>
        </div>
    );
}
