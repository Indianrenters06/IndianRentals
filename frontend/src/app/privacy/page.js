'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const FALLBACK_CONTENT = `
<h2>1. Introduction & Regulatory Scope</h2>
<p>At <strong>AAA Rental LLP</strong> (operating as "Indian Renters" / "IndianRentals", "we", "us", or "our"), we place the highest priority on safeguarding your personal information and respecting your data privacy. This Privacy Policy sets forth our practices regarding the collection, storage, processing, and protection of personal data in compliance with the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>, the <strong>Information Technology Act, 2000</strong>, and the <strong>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</strong>.</p>
<p>By browsing our website, registering an account, completing KYC verification, or entering into an equipment rental agreement with us, you consent to the collection, transfer, and processing of your personal data as described herein.</p>

<h2>2. Categories of Information We Collect</h2>
<p>To facilitate secure device rentals and comply with Indian statutory requirements, we collect the following categories of data:</p>
<ul>
  <li><strong>Direct Identification & Contact Data:</strong> Full legal name, personal and official email addresses, mobile telephone numbers, delivery addresses, and billing addresses.</li>
  <li><strong>Know Your Customer (KYC) Documentation:</strong> Permanent Account Number (PAN) card details, government identity documents (Aadhaar with UID masked as per UIDAI directives, Passport, or Voter ID), corporate GSTIN registration certificates, and company incorporation credentials for enterprise accounts.</li>
  <li><strong>Transaction & Payment Information:</strong> Payment mode references, UPI IDs, transaction tokens, and billing history. All card transactions are executed through PCI-DSS Level 1 certified payment aggregators (e.g., Razorpay, Cashfree). <em>We never store raw credit/debit card numbers, CVVs, or online banking passwords on our internal servers.</em></li>
  <li><strong>Technical & Telemetry Data:</strong> IP addresses, browser types, operating systems, session timestamps, device identifiers, and referral URLs gathered via automated cookies and server logs during your visit.</li>
</ul>

<h2>3. Purpose & Lawful Basis of Processing</h2>
<p>We process your personal information strictly for legitimate commercial, operational, and legal purposes:</p>
<ul>
  <li><strong>Rental Order Fulfillment:</strong> Processing bookings, verifying device compatibility, coordinating doorstep delivery, and managing physical return pickups.</li>
  <li><strong>Fraud Prevention & Identity Verification:</strong> Validating identity, mitigating equipment theft or unauthorized resale, and ensuring authentic commercial leasing.</li>
  <li><strong>Financial Accounting & Taxation:</strong> Generating GST-compliant tax invoices, recording payment reconciliations, and fulfilling statutory audits required under Indian tax laws.</li>
  <li><strong>Customer Care & Critical Notifications:</strong> Providing dispatch tracking, service tickets, hardware maintenance alerts, return reminders, and warranty notifications via SMS, WhatsApp, or email.</li>
</ul>

<h2>4. Non-Disclosure & Third-Party Sharing</h2>
<p><strong>We do not sell, rent, or trade your personal data to third-party marketing companies or data brokers under any circumstances.</strong></p>
<p>Information is shared solely on a restricted, need-to-know basis with vetted service partners:</p>
<ul>
  <li><strong>Logistics & Courier Providers:</strong> Verified logistics partners receive your delivery name, address, and mobile number strictly for device drop-off and pickup.</li>
  <li><strong>Payment Gateways & Banking Networks:</strong> RBI-authorized payment processors handle transactional funds in encrypted environments.</li>
  <li><strong>Statutory & Law Enforcement Authorities:</strong> When formally subpoenaed, requested by court order, or mandated by Indian judicial or regulatory enforcement authorities under applicable laws.</li>
</ul>

<h2>5. Data Privacy on Rented Devices (Sanitization Protocol)</h2>
<p>We recognize that workstations, laptops, and storage devices rented for business or personal use may hold confidential data:</p>
<ul>
  <li><strong>Customer Responsibility:</strong> You are solely responsible for logging out of all personal or corporate cloud accounts (iCloud, Google, OneDrive, Microsoft 365) and performing an initial factory reset or file backup prior to returning equipment.</li>
  <li><strong>Automated Laboratory Sanitization:</strong> Upon intake at our technical hub, every return drive undergoes an automated, certified multi-pass wipe following DoD 5220.22-M data sanitization protocols. We ensure that no previous renter's files or system histories survive on any re-deployed machine.</li>
</ul>

<h2>6. Data Security & Storage Architecture</h2>
<p>We enforce rigorous technical and organizational controls to safeguard your data against loss, unauthorized access, alteration, or disclosure:</p>
<ul>
  <li><strong>Encryption in Transit & At Rest:</strong> All web traffic is secured with TLS 1.3 encryption. Internal database records and uploaded KYC documents are stored with AES-256 encryption within ISO 27001-certified Indian data centers.</li>
  <li><strong>Strict Access Boundaries:</strong> Access to customer KYC and identity records is restricted solely to authorized compliance personnel through multi-factor authentication (MFA).</li>
</ul>

<h2>7. Data Retention & Erasure</h2>
<p>We retain personal information only for as long as necessary to fulfill the purposes for which it was gathered, or as mandated by Indian statutory accounting and taxation guidelines (typically up to 7 financial years for transaction records).</p>
<p>Subject to the clearance of all active rentals, equipment returns, and financial liabilities, you may exercise your right to request account deactivation and data erasure by writing to our compliance desk.</p>

<h2>8. Cookies & Tracking Technologies</h2>
<p>We utilize cookies and similar telemetry tools to enhance site navigation, analyze user traffic, and remember your city selection:</p>
<ul>
  <li><strong>Essential Cookies:</strong> Required for authentication, cart retention, and secure checkout sessions.</li>
  <li><strong>Analytical Cookies:</strong> Help us understand popular rental categories and improve site performance. You may disable cookies via your browser settings at any time.</li>
</ul>

<h2>9. Your Rights as a Data Principal</h2>
<p>Under the Digital Personal Data Protection Act, 2023, you have the right to:</p>
<ul>
  <li>Request access to a summary of the personal data we hold about you.</li>
  <li>Request correction, updating, or rectification of inaccurate or outdated information.</li>
  <li>Nominate another individual to exercise your data rights in the event of incapacity.</li>
  <li>Withdraw consent for non-essential transactional communications.</li>
</ul>

<h2>10. Grievance Redressal Officer</h2>
<p>In accordance with the Information Technology Act, 2000 and the Rules made thereunder, the contact details of the designated Grievance Officer for IndianRenters are provided below:</p>
<p>
  <strong>Grievance Officer:</strong> Compliance & Legal Desk<br />
  <strong>Company:</strong> AAA Rental LLP (IndianRenters)<br />
  <strong>Email:</strong> <a href="mailto:grievance@indianrenters.com">grievance@indianrenters.com</a><br />
  <strong>Corporate Support:</strong> <a href="mailto:support@indianrenters.com">support@indianrenters.com</a><br />
  <strong>Response Window:</strong> We acknowledge all grievances within 48 hours and resolve verified queries within 30 days.
</p>
`;

export default function PrivacyPage() {
    const [cms, setCms] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.fetch(`${API}/api/cms/privacy?t=${Date.now()}`)
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
                            Data Protection & Trust
                        </span>
                        <h1 className="text-white text-3xl sm:text-5xl md:text-6xl font-bold drop-shadow-md font-sans">
                            {bannerTitle}
                        </h1>
                        <p className="text-gray-300 text-sm sm:text-base mt-3 max-w-xl">
                            How we protect your personal information, handle KYC records, and safeguard returned device storage under Indian data regulations.
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Highlights Strip */}
            <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-gray-50 border border-gray-200/80 rounded-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-lg">
                            🛡
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">DPDPA 2023</p>
                            <p className="text-sm font-semibold text-gray-900">Fully Compliant</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-[#0859C5] font-bold text-lg">
                            💳
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Payment Data</p>
                            <p className="text-sm font-semibold text-gray-900">PCI-DSS Level 1</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-lg">
                            🧹
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Device Returns</p>
                            <p className="text-sm font-semibold text-gray-900">DoD Data Wipe</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-[#B45309] font-bold text-lg">
                            🚫
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Zero Data Sale</p>
                            <p className="text-sm font-semibold text-gray-900">Never Monetized</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-10 md:p-14 shadow-sm">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-8">
                        <div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Legal Document: IR-PRIV-2026</span>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">Customer Privacy & Data Charter</h2>
                        </div>
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                            Last Updated: September 2026
                        </span>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-24 text-gray-400">
                            <div className="animate-spin w-6 h-6 rounded-full border-2 border-gray-300 border-t-gray-600 mr-3" />
                            Loading Privacy Policy…
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
                            <h3 className="text-base font-bold text-gray-900">Data Privacy or Redressal Question?</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Reach our designated Grievance Officer directly at <a href="mailto:grievance@indianrenters.com" className="text-[#0859C5] underline font-medium">grievance@indianrenters.com</a>.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                            <a
                                href="mailto:grievance@indianrenters.com"
                                className="px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition shadow-sm"
                            >
                                Contact Grievance Desk
                            </a>
                            <a
                                href="/contact"
                                className="px-5 py-2.5 rounded-xl bg-[#0859C5] text-white text-sm font-semibold hover:bg-blue-700 transition shadow-sm"
                            >
                                Support Center
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
