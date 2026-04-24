'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const FALLBACK = `<h2>KYC Verification Policy</h2>
<p>To ensure a secure and trusted rental experience, all customers are required to complete a one-time KYC (Know Your Customer) verification process.</p>
<h3>Required Documents</h3>
<ul>
  <li><strong>Identity Proof:</strong> Valid PAN Card (Mandatory).</li>
  <li><strong>Address Proof:</strong> Aadhaar Card, Passport, or Voter ID.</li>
  <li><strong>Additional Info:</strong> For corporate rentals, GST certificate and authorized signatory documents are required.</li>
</ul>
<h3>Verification Process</h3>
<p>Once you upload your documents, our team will verify them within 2–4 business hours. You will receive an email/SMS notification once your KYC is approved.</p>
<h3>Data Security</h3>
<p>Your documents are stored securely and encrypted. We do not share your KYC data with any third parties except as required by law.</p>`;

export default function KycPolicyPage() {
    const [cms, setCms] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        window.fetch(`${API}/api/cms/kyc-policy?t=${Date.now()}`)
            .then(r => r.ok ? r.json() : null)
            .then(d => { setCms(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);
    const bannerImage = cms?.bannerImage || 'https://res.cloudinary.com/dpu9ikeqe/image/upload/v1770802400/ae1488b221c19db77a3c781e4313273ed5449f17_xdpggg.jpg';
    const bannerTitle = cms?.bannerTitle || 'KYC Verification Policy';
    const pageContent = cms?.pageContent || FALLBACK;
    return (
        <div className="font-sans text-gray-800 pb-20">
            <div className="max-w-[1200px] mx-auto px-4 md:px-8 mt-8 mb-16">
                <div className="w-full h-[300px] md:h-[400px] relative bg-gray-200 overflow-hidden rounded-3xl group">
                    <Image src={bannerImage} alt={bannerTitle} fill className="object-cover object-center brightness-75 transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h1 className="text-white text-5xl md:text-7xl font-semibold drop-shadow-lg font-sans text-center px-4">{bannerTitle}</h1>
                    </div>
                </div>
            </div>
            <div className="max-w-[1200px] mx-auto px-4 md:px-8">
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
