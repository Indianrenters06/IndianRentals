'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const FALLBACK = `
<h2>1. Cancellation Prior to Dispatch</h2>
<p>We understand that project requirements and schedules can change. You may cancel your rental order at any time before dispatch:</p>
<ul>
  <li><strong>100% Full Refund:</strong> If you cancel your order prior to device packaging and logistics dispatch confirmation, you will receive a 100% refund of all advance rental payments and security deposits.</li>
  <li><strong>Turnaround Time:</strong> Pre-dispatch refunds are initiated within 24 hours of cancellation and credited to your original payment method (Bank Account / UPI / Card) within 3–5 business days.</li>
</ul>

<h2>2. Doorstep Inspection & Instant Replacement</h2>
<p>Every product dispatched by IndianRenters is benchmarked, tested, and sealed. However, to guarantee total satisfaction:</p>
<ul>
  <li><strong>Doorstep Quality Check:</strong> You have the right to inspect the cosmetic condition and power-on functionality of the device upon arrival with our delivery representative.</li>
  <li><strong>Transit Damage or Spec Discrepancy:</strong> If you identify any cosmetic crack, transit damage, or specification mismatch, you may reject the delivery immediately with zero financial liability.</li>
  <li><strong>Priority Swap:</strong> Our logistics hub will dispatch a replacement unit within 24–48 business hours at no extra cost, or issue a 100% refund if you choose to cancel.</li>
</ul>

<h2>3. Early Rental Termination (Mid-Tenure Returns)</h2>
<p>We offer industry-leading flexibility for changing enterprise and freelance demands:</p>
<ul>
  <li><strong>Notice Period:</strong> If you wish to return a device prior to the expiration of your booked rental tenure, please notify us at least 5 business days in advance via your dashboard or customer support.</li>
  <li><strong>Slab Recalculation:</strong> Rental fees for the period utilized will be adjusted retroactively according to the actual tenure slab completed (for example, if a 6-month rental is terminated at month 2, rental is calculated at the prevailing 2-month monthly rate).</li>
  <li><strong>Balance Refund:</strong> Any surplus advance rental paid will be credited back to your account alongside your security deposit.</li>
</ul>

<h2>4. Security Deposit Refund Protocol</h2>
<p>We believe in transparent, frictionless deposit refunds:</p>
<ul>
  <li><strong>Step 1 — Return Pickup:</strong> Our logistics associate collects the device from your registered address and issues a digital pickup acknowledgment.</li>
  <li><strong>Step 2 — Lab Quality Check (QC):</strong> Within 24–48 hours of arriving at our central service depot, certified technicians inspect hardware integrity, display status, ports, and accessories.</li>
  <li><strong>Step 3 — Settlement & Release:</strong> Once QC is cleared and any outstanding rental fees are settled, the full security deposit is automatically released to your original source account or verified bank account within 5–7 business days.</li>
</ul>

<h2>5. Damage Deductions & Assessment Guidelines</h2>
<p>We distinguish strictly between normal wear and tear and accidental damage:</p>
<ul>
  <li><strong>Normal Wear & Tear (Zero Deduction):</strong> Minor faint surface scuffs from everyday handling, natural battery degradation through ordinary charging cycles, and keyboard keycap shine are considered normal wear and tear and are <strong>never penalized</strong>.</li>
  <li><strong>Assessed Physical Damages:</strong> Broken or cracked display panels, bent or dented chassis caused by drops, missing keys, burnt ports from unstable electrical circuits, motherboard liquid exposure, and missing power adapters/cables will be assessed at actual OEM component repair/replacement cost.</li>
  <li><strong>Fair Transparency:</strong> In any damage scenario, our team provides high-resolution photographic proof and an itemized repair estimate before any deduction from your security deposit is made.</li>
</ul>

<h2>6. Renter Return Checklist</h2>
<p>To ensure prompt processing and avoid deposit delays, please ensure the following before pickup:</p>
<ul>
  <li>Back up all personal, confidential, and corporate data.</li>
  <li>Log out of Apple ID / iCloud, Google Accounts, Microsoft Office, and Adobe Creative Cloud.</li>
  <li>Disable Windows BitLocker, Apple "Find My", and any BIOS administrator passwords.</li>
  <li>Hand over all original accessories including charger, power cable, adapter, and protective sleeve.</li>
</ul>
`;

export default function ReturnPolicyPage() {
    const [cms, setCms] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.fetch(`${API}/api/cms/refund?t=${Date.now()}`)
            .then(r => r.ok ? r.json() : null)
            .then(d => { setCms(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const bannerImage = cms?.bannerImage || 'https://res.cloudinary.com/dpu9ikeqe/image/upload/v1770802400/ae1488b221c19db77a3c781e4313273ed5449f17_xdpggg.jpg';
    const bannerTitle = cms?.bannerTitle || 'Return, Cancellation & Refund Policy';
    const pageContent = cms?.pageContent || FALLBACK;

    return (
        <div className="font-sans text-gray-800 pb-20">
            {/* Banner */}
            <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-10">
                <div className="w-full h-[280px] md:h-[360px] relative bg-gray-900 overflow-hidden rounded-3xl group shadow-lg">
                    <Image
                        src={bannerImage}
                        alt={bannerTitle}
                        fill
                        priority
                        className="object-cover object-center brightness-[0.65] transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col items-center justify-center p-6 text-center">
                        <span className="inline-block text-xs uppercase tracking-widest font-semibold text-[#FFCF46] bg-black/40 px-3.5 py-1 rounded-full backdrop-blur-sm mb-3 border border-[#FFCF46]/20">
                            Hassle-Free Returns
                        </span>
                        <h1 className="text-white text-3xl sm:text-5xl md:text-6xl font-bold drop-shadow-md font-sans">
                            {bannerTitle}
                        </h1>
                        <p className="text-gray-300 text-sm sm:text-base mt-3 max-w-xl">
                            Fast deposit settlements, transparent damage evaluation, and flexible mid-tenure cancellation terms.
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Highlights Strip */}
            <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-gray-50 border border-gray-200/80 rounded-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-lg">
                            100%
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Pre-Dispatch</p>
                            <p className="text-sm font-semibold text-gray-900">Instant Refund</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-[#0859C5] font-bold text-lg">
                            ⏱
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Deposit Release</p>
                            <p className="text-sm font-semibold text-gray-900">5–7 Working Days</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-[#B45309] font-bold text-lg">
                            🔄
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Transit Damage</p>
                            <p className="text-sm font-semibold text-gray-900">24h Free Swap</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-lg">
                            ✨
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Fair Assessment</p>
                            <p className="text-sm font-semibold text-gray-900">Zero Wear Penalty</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-10 md:p-14 shadow-sm">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-8">
                        <div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Document Reference: IR-RET-2026</span>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">Return & Refund Standards</h2>
                        </div>
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                            Last Updated: September 2026
                        </span>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-24 text-gray-400">
                            <div className="animate-spin w-6 h-6 rounded-full border-2 border-gray-300 border-t-gray-600 mr-3" />
                            Loading Policy…
                        </div>
                    ) : (
                        <div
                            className="prose prose-lg max-w-none text-gray-700 leading-relaxed
                                       prose-headings:font-bold prose-headings:text-gray-900 prose-headings:tracking-tight
                                       prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-gray-100 prose-h2:pb-3
                                       prose-p:text-gray-600 prose-p:leading-relaxed
                                       prose-li:text-gray-600 prose-strong:text-gray-900
                                       prose-a:text-[#0859C5] hover:prose-a:underline"
                            dangerouslySetInnerHTML={{ __html: pageContent }}
                        />
                    )}

                    {/* Support Help Box */}
                    <div className="mt-14 p-6 sm:p-8 bg-gradient-to-r from-gray-50 to-blue-50/40 border border-blue-100 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div>
                            <h3 className="text-base font-bold text-gray-900">Need to schedule a pickup or track a deposit refund?</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Our returns coordination team is available Monday to Saturday, 9:30 AM to 7:00 PM IST.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                            <a
                                href="mailto:support@indianrenters.com"
                                className="px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition shadow-sm"
                            >
                                Track Refund
                            </a>
                            <a
                                href="/contact"
                                className="px-5 py-2.5 rounded-xl bg-[#0859C5] text-white text-sm font-semibold hover:bg-blue-700 transition shadow-sm"
                            >
                                Contact Support
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
