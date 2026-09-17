'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Fallback static content shown if CMS is empty / not yet published
const FALLBACK_CONTENT = `
<h2>1. Agreement to Terms</h2>
<p>These Terms and Conditions constitute a legally binding agreement between you ("Customer", "User", "Lessee") and <strong>AAA Rental LLP</strong> (operating as "Indian Renters" / "IndianRentals", "we", "us", or "our"), governing your access to and use of the IndianRenters website, products, and equipment rental services across India.</p>
<p>By placing a rental order, making a deposit, or accepting delivery of any equipment, you acknowledge that you have read, understood, and agreed to be bound by all of these terms. If you do not agree, you must immediately refrain from using our services and reject equipment delivery.</p>

<h2>2. Eligibility & KYC Verification</h2>
<p>To hire IT and AV equipment through IndianRenters, you must satisfy our identity and risk assessment criteria:</p>
<ul>
  <li><strong>Individual Renters:</strong> Must be at least 18 years of age with legal contractual capacity under the Indian Contract Act, 1872. You must provide a valid government-issued photo ID (Aadhaar Card, Passport, or Voter ID) and a valid Permanent Account Number (PAN) card.</li>
  <li><strong>Corporate & Business Renters:</strong> Must provide a valid Goods and Services Tax (GSTIN) certificate, Company PAN, registered office address proof, and an authorization letter signed by a Director, Partner, or authorized signatory.</li>
  <li><strong>Verification Rights:</strong> IndianRenters reserves the unilateral right to approve, reject, or request additional financial collateral or security deposits based on internal risk verification.</li>
</ul>

<h2>3. Rental Tenure, Billing & Auto-Renewal</h2>
<p>Our rental periods and payment structures are designed for maximum commercial and individual flexibility:</p>
<ul>
  <li><strong>Tenure Commencement:</strong> The rental duration begins on the exact date and time of physical handover and delivery confirmation of the equipment.</li>
  <li><strong>Billing Cycle:</strong> Rental payments are payable strictly in advance on the 1st day of each subsequent monthly rental cycle via authorized online payment methods (UPI, Credit/Debit Cards, Net Banking, or Corporate NEFT/RTGS).</li>
  <li><strong>Extensions:</strong> If you wish to extend your rental tenure, you must inform us at least 5 business days prior to the expiration date. Extensions are billed at the prevailing slab rate.</li>
  <li><strong>Subscriptions:</strong> Long-term and month-to-month subscriptions automatically renew for successive periods unless a termination notice is submitted at least 7 days before the next billing date.</li>
  <li><strong>Late Payment Surcharge:</strong> Invoices outstanding beyond a 3-day grace period incur a late fee of ₹100 per day or 1.5% interest per week (whichever is greater) until full settlement.</li>
</ul>

<h2>4. Security Deposit & Refund Protocol</h2>
<p>A refundable security deposit is collected prior to product dispatch to ensure asset integrity:</p>
<ul>
  <li><strong>Separation of Funds:</strong> The security deposit cannot be adjusted or offset against monthly rental charges by the Customer, except at the sole written discretion of IndianRenters upon lease conclusion.</li>
  <li><strong>Refund Timeline:</strong> Upon equipment return, the product undergoes a physical and technical laboratory inspection within 24–48 hours. Subject to clearance of quality checks and absence of outstanding rental dues, the security deposit is refunded in full to the original source bank/UPI account within 5 to 7 business days.</li>
</ul>

<h2>5. Delivery, Handover & Acceptance</h2>
<p>Every device dispatched by IndianRenters is rigorously tested, benchmarked, and sanitized prior to shipping:</p>
<ul>
  <li><strong>Doorstep Inspection:</strong> The Customer must inspect the physical and aesthetic condition, screen integrity, peripherals, and technical specifications of the device upon delivery in the presence of the delivery associate.</li>
  <li><strong>Digital Challan:</strong> Delivery completion requires signature or OTP verification on the digital delivery challan. This constitutes conclusive proof that the device was received in optimal working condition.</li>
  <li><strong>Defect Reporting:</strong> Any transit damage, cosmetic discrepancy, or specification mismatch must be flagged within 24 hours of receipt. Reports submitted thereafter shall be deemed to have occurred while in the Renter's custody.</li>
</ul>

<h2>6. Permitted Use & Ownership Title</h2>
<p>All rented devices remain the exclusive proprietary capital asset of AAA Rental LLP throughout the rental tenure:</p>
<ul>
  <li><strong>No Transfer of Title:</strong> Under no circumstances does this agreement convey any ownership, proprietary right, title, or lien on the equipment to the Renter.</li>
  <li><strong>Prohibited Actions:</strong> The Renter shall not sub-lease, assign, pawn, sell, encumber, pledge, or transfer the equipment to any third party.</li>
  <li><strong>Geographic Relocation:</strong> Equipment must remain at the registered installation address provided during KYC and ordering. Rented gear may not be transported across state borders or outside the delivery city without prior written consent from IndianRenters.</li>
  <li><strong>Hardware Tampering:</strong> Opening device chassis, modifying internal components (e.g., swapping RAM, SSD, or graphics cards), altering BIOS firmware, or tampering with warranty seals is strictly prohibited and results in immediate lease cancellation and full deposit forfeiture.</li>
</ul>

<h2>7. Maintenance, Repairs & Free Swaps</h2>
<p>We pride ourselves on offering uninterrupted productivity for our customers:</p>
<ul>
  <li><strong>Manufacturer & Normal Wear:</strong> IndianRenters provides free replacement or repairs for any inherent hardware component fatigue, manufacturing defects, or technical faults that arise under normal, reasonable usage.</li>
  <li><strong>Fast Replacement Guarantee:</strong> In the event of a diagnosed hardware malfunction, our engineering team will provide remote troubleshooting or initiate an on-site device swap within 24–48 business hours.</li>
  <li><strong>No Unauthorized Third-Party Repairs:</strong> Customers must never submit rented equipment to unauthorized third-party technicians or service centers. Doing so breaches warranty protocols and renders the customer liable for full replacement value.</li>
</ul>

<h2>8. Accidental Damage, Liquid Spills & Loss</h2>
<p>Renters are expected to exercise the same degree of care with rented equipment as a prudent owner would with their own equipment:</p>
<ul>
  <li><strong>Normal Wear & Tear:</strong> Minor surface micro-scratches resulting from standard everyday handling are deemed normal wear and tear and will not attract penalties.</li>
  <li><strong>Major Physical Damage:</strong> Severe damages including cracked displays, dropped laptops, chassis deformation, burnt power circuits from erratic voltage, broken hinges, and liquid spills will be assessed at actual OEM component replacement cost and deducted from the deposit.</li>
  <li><strong>Total Loss / Theft:</strong> In the unfortunate event of theft, burglary, or fire, the Renter must file a First Information Report (FIR) with the local police station within 24 hours, furnish an official copy to IndianRenters, and pay the depreciated book replacement value of the device minus any held deposit.</li>
</ul>

<h2>9. Data Privacy, Account Logouts & Sanitization</h2>
<p>Protecting your corporate and personal digital security is our highest priority:</p>
<ul>
  <li><strong>Customer Responsibility:</strong> Prior to returning equipment, the Renter must back up all personal files, log out of all Apple iCloud, Google, Microsoft, and corporate VPN accounts, and remove all BIOS, BitLocker, or device administrator passwords.</li>
  <li><strong>Certified Sanitization:</strong> Once equipment arrives at our centralized depot, our engineers execute a multi-pass, DoD-compliant data wipe across all local storage media. IndianRenters shall not be liable for any data, files, or proprietary intellectual property left on the device after physical return.</li>
</ul>

<h2>10. Default, Repossession & Legal Remedies</h2>
<p>IndianRenters reserves the right to immediately terminate the rental contract, revoke equipment access, and repossess the assets under the following default events:</p>
<ul>
  <li>Failure to pay rental invoices for more than 14 consecutive calendar days.</li>
  <li>Refusal to surrender equipment upon completion or termination of the contracted tenure.</li>
  <li>Insolvency, bankruptcy, or deliberate concealment/misrepresentation during KYC verification.</li>
  <li>In the event of default, IndianRenters may remotely lock managed devices and initiate criminal and civil legal proceedings under applicable provisions of the Indian Penal Code / Bharatiya Nyaya Sanhita (including criminal breach of trust) and the Information Technology Act.</li>
</ul>

<h2>11. Governing Law & Dispute Resolution</h2>
<p>This agreement and any dispute or claim arising out of or in connection with it shall be governed by and construed in accordance with the laws of India. The courts located in New Delhi, India shall have exclusive jurisdiction to settle any disputes arising under or related to this agreement.</p>
`;

export default function TermsPage() {
    const [cms, setCms] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.fetch(`${API}/api/cms/terms?t=${Date.now()}`)
            .then(r => r.ok ? r.json() : null)
            .then(d => { setCms(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const bannerImage = cms?.bannerImage || "https://res.cloudinary.com/dpu9ikeqe/image/upload/v1770802400/ae1488b221c19db77a3c781e4313273ed5449f17_xdpggg.jpg";
    const bannerTitle = cms?.bannerTitle || "Terms & Conditions";
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
                            Legal & Transparency
                        </span>
                        <h1 className="text-white text-3xl sm:text-5xl md:text-6xl font-bold drop-shadow-md font-sans">
                            {bannerTitle}
                        </h1>
                        <p className="text-gray-300 text-sm sm:text-base mt-3 max-w-xl">
                            Clear, fair, and transparent guidelines governing tech rentals for businesses and individuals across India.
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Highlights Strip */}
            <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-gray-50 border border-gray-200/80 rounded-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-[#B45309] font-bold text-lg">
                            ✓
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Free Maintenance</p>
                            <p className="text-sm font-semibold text-gray-900">100% Coverage</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-[#0859C5] font-bold text-lg">
                            🛡
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Security Deposit</p>
                            <p className="text-sm font-semibold text-gray-900">Fully Refundable</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-lg">
                            ⚡
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Hardware Swap</p>
                            <p className="text-sm font-semibold text-gray-900">24–48h Dispatch</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-lg">
                            🔒
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Return Sanitization</p>
                            <p className="text-sm font-semibold text-gray-900">DoD Data Wipe</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-10 md:p-14 shadow-sm">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-8">
                        <div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Document Reference: IR-TOS-2026</span>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">Equipment Rental Agreement</h2>
                        </div>
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                            Last Updated: September 2026
                        </span>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-24 text-gray-400">
                            <div className="animate-spin w-6 h-6 rounded-full border-2 border-gray-300 border-t-gray-600 mr-3" />
                            Loading Agreement…
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
                            <h3 className="text-base font-bold text-gray-900">Have legal or contract queries?</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Our legal and enterprise leasing desk is available to assist enterprise procurement teams.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                            <a
                                href="mailto:support@indianrenters.com"
                                className="px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition shadow-sm"
                            >
                                Email Legal Desk
                            </a>
                            <a
                                href="/contact"
                                className="px-5 py-2.5 rounded-xl bg-[#0859C5] text-white text-sm font-semibold hover:bg-blue-700 transition shadow-sm"
                            >
                                Contact Us
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
