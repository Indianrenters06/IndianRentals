'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const FALLBACK = `<h2>Shipping &amp; Delivery</h2>
<p>We deliver rental products across major Indian cities within 48–72 hours of order confirmation and KYC approval.</p>
<h3>Delivery Timeline</h3>
<p>Metro cities: 24–48 hours. Tier-2 cities: 48–72 hours. Remote areas: 72–96 hours.</p>
<h3>Delivery Charges</h3>
<p>Free delivery on all rental orders above ₹500/month. A nominal delivery fee applies for smaller orders.</p>
<h3>Product Condition</h3>
<p>All products are professionally cleaned, tested, and packed before dispatch. You will receive a condition report with your delivery.</p>
<h3>Reverse Logistics</h3>
<p>At the end of your rental period, we arrange a pickup from your registered address at no extra cost.</p>`;

export default function ShippingPage() {
    const [cms, setCms] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        window.fetch(`${API}/api/cms/shipping?t=${Date.now()}`)
            .then(r => r.ok ? r.json() : null)
            .then(d => { setCms(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);
    const bannerImage = cms?.bannerImage || 'https://res.cloudinary.com/dpu9ikeqe/image/upload/v1770802400/ae1488b221c19db77a3c781e4313273ed5449f17_xdpggg.jpg';
    const bannerTitle = cms?.bannerTitle || 'Shipping & Delivery';
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
