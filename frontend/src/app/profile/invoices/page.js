'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PiSpinnerGap, PiReceipt, PiArrowLeft } from 'react-icons/pi';
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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
    // Set by the "Invoices" button on an order card: /profile/invoices?order=XXXXXX
    const [orderFilter, setOrderFilter] = useState(null);

    useEffect(() => {
        // Read from location rather than useSearchParams so the page needs no Suspense boundary.
        setOrderFilter(new URLSearchParams(window.location.search).get('order'));
    }, []);

    useEffect(() => {
        const fetchRentals = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/rentals/myrentals`, {
                    headers: { Authorization: `Bearer ${getToken()}` }
                });
                const data = Array.isArray(res.data) ? res.data : [];
                const mapped = data.map((r, i) => ({
                    id: `DEL/25-26/${String(i + 1001)}`,
                    date: new Date(r.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).replace(/ /g, '-'),
                    orderNo: r._id.toString().slice(-6).toUpperCase(),
                    invoiceAmt: inr(r.totalPrice),
                    amountDue: r.isPaid ? inr(0) : inr(r.totalPrice),
                    status: r.isPaid ? 'Paid' : 'Pending',
                }));
                setInvoices(mapped);
            } catch (err) {
                console.error('Invoices fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchRentals();
    }, []);

    const visibleInvoices = orderFilter
        ? invoices.filter(inv => inv.orderNo === orderFilter)
        : invoices;

    return (
        <div className="flex flex-col gap-3">
            {/* Heading block — Figma "Frame 282": 32px down to the column headings, 12px inside. */}
            <div className="flex w-full flex-col gap-8">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                        <Link href="/profile" aria-label="Back to menu" className="shrink-0 text-[#333333] lg:hidden">
                            <PiArrowLeft size={24} />
                        </Link>
                        <h1 className="text-[27px] font-semibold leading-[35px] tracking-[-0.8px] text-[#333333]">My Invoices</h1>
                    </div>
                    <p className="text-[14px] font-medium leading-5 tracking-[-0.4px] text-[#757575]">All the invoices are listed below.</p>
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

                        {visibleInvoices.length === 0 ? (
                            <div className="py-20 text-center text-[#757575]">
                                <PiReceipt size={52} className="mx-auto mb-3 opacity-25" />
                                <p className="text-[14px] font-medium leading-5 tracking-[-0.4px]">No invoices found.</p>
                                <p className="mt-1 text-[12px] font-semibold leading-4 tracking-[-0.4px]">
                                    {orderFilter ? 'This order has no invoice yet.' : 'Once you place a rental order, invoices will appear here.'}
                                </p>
                            </div>
                        ) : (
                            /* Rows — Figma "Frame 283": 56px tall, 6px radius, #cbcbcb hairline */
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
                                            <button className="flex h-[24px] w-fit items-center justify-center rounded-[28px] bg-[#0075ff] px-3 py-1 text-[12px] font-semibold leading-4 tracking-[-0.4px] text-[#edfaff]">
                                                Download
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
