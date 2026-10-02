'use client';
import { API as API_BASE } from '@/services/apiConfig';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Receipt, ArrowClockwise } from '@phosphor-icons/react';
import { PiSpinnerGap } from 'react-icons/pi';
import axios from 'axios';
import { profileTitleClassName } from '../profileTitle';

const getToken = () => {
    if (typeof window === 'undefined') return null;
    try {
        const userInfo = localStorage.getItem('userInfo');
        return userInfo ? JSON.parse(userInfo).token : null;
    } catch { return null; }
};

// Figma "Frame 280" lays the headings out at a 10px inset with 50px gaps, measuring out to tracks
// of 142/167/120/138/144/100 + 69 for Action. Those are carried as proportions, not fixed pixels,
// for two reasons: the panel gives us ~826px rather than the design's 890px, and Action's 69px
// cannot hold the 80px Download button (Figma only fits it by pushing the button 27px left of its
// own heading). Fixed tracks therefore overflowed and forced a horizontal scrollbar.
// The rows reuse the same tracks so every value still sits under its heading.
const COLUMNS = 'grid grid-cols-[1.05fr_1.4fr_0.95fr_1.15fr_1.15fr_0.95fr_0.95fr] items-center';

// Figma "TAG" (node 22937:4500).
const Tag = ({ label, paid }) => (
    <span
        className={`w-fit rounded-full border-[0.5px] px-3 py-1 text-[12px] font-medium leading-4 tracking-[-0.4px] ${
            paid ? 'border-[#0689ff] bg-[#d6f1ff] text-[#0689ff]' : 'border-[#ff7a00] bg-[#fff3d3] text-[#ff7a00]'
        }`}
    >
        {label}
    </span>
);

const inr = (n) => `Rs. ${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function MyInvoicesPage() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    // Set by the "Invoices" button on an order card: /profile/invoices?order=XXXXXX
    const [orderFilter, setOrderFilter] = useState(null);

    useEffect(() => {
        // Read from location rather than useSearchParams so the page needs no Suspense boundary.
        setOrderFilter(new URLSearchParams(window.location.search).get('order'));
    }, []);

    useEffect(() => {
        const fetchRentals = async () => {
            setLoading(true);
            setFetchError(false);
            try {
                const res = await axios.get(`${API_BASE}/api/rentals/myrentals`, {
                    headers: { Authorization: `Bearer ${getToken()}` }
                });
                const data = Array.isArray(res.data) ? res.data : [];
                const mapped = data.map((r, i) => ({
                    id: r.checkoutFlow === 'staged' ? `Booking ${r._id.toString().slice(-6).toUpperCase()}` : `DEL/25-26/${String(i + 1001)}`,
                    staged: r.checkoutFlow === 'staged',
                    fullId: r._id,
                    date: new Date(r.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).replace(/ /g, '-'),
                    orderNo: r._id.toString().slice(-6).toUpperCase(),
                    invoiceAmt: inr(r.checkoutFlow === 'staged' ? (r.staged?.finalQuote?.totalPaise ?? r.pricingSnapshot?.totalPaise ?? Math.round(r.totalPrice * 100)) / 100 : r.totalPrice),
                    amountDue: r.checkoutFlow === 'staged' ? inr(Math.max(0, (r.staged?.finalQuote?.totalPaise ?? r.pricingSnapshot?.totalPaise ?? Math.round(r.totalPrice * 100)) - (r.staged?.paidPaise || 0)) / 100) : r.isPaid ? inr(0) : inr(r.totalPrice),
                    status: r.refundReviewRequired ? 'Review' : r.isPaid ? 'Paid' : r.staged?.paidPaise > 0 ? 'Part paid' : 'Pending',
                }));
                setInvoices(mapped);
            } catch (err) {
                console.error('Invoices fetch error:', err);
                setFetchError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchRentals();
    }, [refreshKey]);

    const visibleInvoices = orderFilter
        ? invoices.filter(inv => inv.orderNo === orderFilter)
        : invoices;

    return (
        <div className="flex flex-col gap-3">
            {/* Heading block — Figma "Frame 282": 32px down to the column headings, 12px inside. */}
            <div className="flex w-full flex-col gap-8">
                <div className="flex flex-col gap-3">
                    <h1 className={profileTitleClassName}>My Invoices</h1>
                    <p className="text-[14px] font-medium leading-5 tracking-[-0.4px] text-[#757575]">Find invoices for your rental orders here.</p>
                    {invoices.some(invoice => invoice.staged) && <p className="text-sm text-[#545454]">Staged bookings show a payment statement here. The balance includes credit for payments already received.</p>}
                </div>

                {orderFilter && (
                    <div className="flex w-fit items-center gap-3 rounded-[6px] border border-[#e2e2e2] bg-[#f6f6f6] px-[10px] py-[5px]">
                        <span className="text-[12px] font-semibold leading-4 tracking-[-0.4px] text-[#757575]">
                            Showing invoices for order #{orderFilter}
                        </span>
                        <button onClick={() => setOrderFilter(null)} className="text-[12px] font-semibold leading-4 tracking-[-0.4px] text-[#0075ff] underline">
                            Show all
                        </button>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="flex items-center gap-3 py-10 text-[#757575]">
                    <PiSpinnerGap className="animate-spin" size={22} />
                    <span className="text-[14px] font-medium leading-5 tracking-[-0.4px]">Loading invoices…</span>
                </div>
            ) : fetchError ? (
                <section className="mt-4 flex min-h-[300px] flex-col items-center justify-center rounded-[24px] border border-[#e2e2e2] bg-[#f6f6f6] px-6 py-10 text-center" role="alert">
                    <span className="mb-5 flex size-20 items-center justify-center rounded-[22px] border border-[#e2e2e2] bg-white text-[#141414]"><Receipt size={38} weight="regular" aria-hidden="true" /></span>
                    <h2 className="text-[22px] font-semibold leading-tight tracking-[-0.03em] text-[#141414] sm:text-[28px]">We couldn’t load your invoices</h2>
                    <p className="mt-2 max-w-[400px] text-[14px] leading-6 text-[#545454] sm:text-[16px]">Please try again. If the problem continues, our team can help you find an invoice.</p>
                    <button type="button" onClick={() => setRefreshKey(key => key + 1)} className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#ffcf46] px-6 text-[14px] font-semibold text-[#141414] transition-colors hover:bg-[#f3bf35] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]"><ArrowClockwise size={18} weight="bold" aria-hidden="true" />Try again</button>
                </section>
            ) : visibleInvoices.length === 0 ? (
                <section className="mt-4 flex min-h-[340px] flex-col items-center justify-center rounded-[24px] border border-[#e2e2e2] bg-[#f6f6f6] px-6 py-10 text-center sm:min-h-[380px] sm:px-10">
                    <span className="mb-6 flex size-20 items-center justify-center rounded-[22px] border border-[#e2e2e2] bg-white text-[#141414] shadow-sm"><Receipt size={38} weight="regular" aria-hidden="true" /></span>
                    <h2 className="text-[22px] font-semibold leading-tight tracking-[-0.03em] text-[#141414] sm:text-[28px]">{orderFilter ? 'No invoice for this order yet' : 'No invoices yet'}</h2>
                    <p className="mt-2 max-w-[420px] text-[14px] leading-6 text-[#545454] sm:text-[16px]">{orderFilter ? 'We couldn’t find an invoice for this order. You can check your other invoices or come back later.' : 'After you place a rental order, its invoice will appear here.'}</p>
                    {orderFilter ? (
                        <button type="button" onClick={() => setOrderFilter(null)} className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#ffcf46] px-6 text-[14px] font-semibold text-[#141414] transition-colors hover:bg-[#f3bf35] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]">View all invoices<ArrowRight size={18} weight="bold" aria-hidden="true" /></button>
                    ) : (
                        <Link href="/products" className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#ffcf46] px-6 text-[14px] font-semibold text-[#141414] transition-colors hover:bg-[#f3bf35] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]">Explore rentals<ArrowRight size={18} weight="bold" aria-hidden="true" /></Link>
                    )}
                </section>
            ) : (
                // Scrolls within the panel; scrollbar left visible so the extra columns are findable.
                <div className="w-full overflow-x-auto">
                    {/* Floor, not target: below this the columns would crush, so let it scroll instead. */}
                    <div className="min-w-[720px]">
                        {/* Column headings — Figma "Frame 280" */}
                        <div className={`${COLUMNS} w-full pl-[10px] text-[14px] font-semibold leading-5 tracking-[-0.4px] text-[#1f1f1f]`}>
                            <p>Invoice Date</p>
                            <p>Invoice Number</p>
                            <p>Order No.</p>
                            <p>Invoice Amt</p>
                            <p>Amount Due</p>
                            <p>Status</p>
                            <p>Action</p>
                        </div>

                        {/* Divider — Figma "Line 13" */}
                        <div className="my-3 h-px w-full bg-[#afafaf]" />

                        {/* Rows — Figma "Frame 283": 56px tall, 6px radius, #cbcbcb hairline */}
                        <div className="flex flex-col gap-3">
                            {visibleInvoices.map((invoice) => (
                                <div key={invoice.id} className="h-[56px] w-full rounded-[6px] border border-[#cbcbcb]">
                                    <div className={`${COLUMNS} h-full w-full pl-[10px] text-[14px] font-semibold leading-5 tracking-[-0.4px] text-[#1f1f1f]`}>
                                        <p>{invoice.date}</p>
                                        <p>{invoice.id}</p>
                                        <p>{invoice.orderNo}</p>
                                        <p>{invoice.invoiceAmt}</p>
                                        <p>{invoice.amountDue}</p>
                                        <Tag label={invoice.status} paid={invoice.status === 'Paid'} />
                                        {invoice.staged ? <Link href={`/checkout/staged?orderId=${invoice.fullId}`} className="flex min-h-11 w-fit items-center justify-center rounded-full bg-[#ffcf46] px-3 text-xs font-semibold">View</Link> : <button className="flex h-[24px] w-fit items-center justify-center rounded-[28px] bg-[#0075ff] px-3 py-1 text-[12px] font-semibold leading-4 tracking-[-0.4px] text-[#edfaff]">
                                            Download
                                        </button>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
