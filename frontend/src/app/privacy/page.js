'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const FALLBACK_CONTENT = `<h2>Privacy Policy</h2>
<p>We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our rental services.</p>
<h3>Information We Collect</h3>
<p>We may collect personal information that you voluntarily provide to us when registering, placing a rental order, or contacting us. This includes name, email, phone number, address, and payment information.</p>
<h3>How We Use Your Information</h3>
<p>We use the information we collect to process rentals, send transactional emails, provide customer support, comply with legal obligations, and improve our services.</p>
<h3>Sharing Your Information</h3>
<p>We do not sell your personal data. We may share information with trusted third-party service providers (logistics, payment gateways) strictly for fulfilling your rental orders.</p>
<h3>Data Security</h3>
<p>We implement technical and organizational measures to protect your data. However, no method of transmission over the internet is 100% secure.</p>
<h3>Contact Us</h3>
<p>If you have any questions about this Privacy Policy, please contact us at support@indianrenters.com.</p>`;

export default function PrivacyPage() {
    const [cms, setCms] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API}/api/cms/privacy`)
            .then(r => r.ok ? r.json() : null)
            .then(d => { setCms(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const bannerImage = cms?.bannerImage || "https://res.cloudinary.com/dpu9ikeqe/image/upload/v1770802400/ae1488b221c19db77a3c781e4313273ed5449f17_xdpggg.jpg";
    const bannerTitle = cms?.bannerTitle || "Privacy Policy";
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
