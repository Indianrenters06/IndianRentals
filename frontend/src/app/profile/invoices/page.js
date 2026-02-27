'use client';

import React, { useState, useEffect } from 'react';
import { PiDownloadSimpleBold, PiSpinnerGap, PiReceipt } from 'react-icons/pi';
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const getToken = () => {
    if (typeof window === 'undefined') return null;
    try {
        const userInfo = localStorage.getItem('userInfo');
        return userInfo ? JSON.parse(userInfo).token : null;
    } catch { return null; }
};

export default function MyInvoicesPage() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRentals = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/rentals/myrentals`, {
                    headers: { Authorization: `Bearer ${getToken()}` }
                });
                const data = Array.isArray(res.data) ? res.data : [];
                // Map rentals to invoices
                const mapped = data.map((r, i) => ({
                    id: `INR/25-26/${String(i + 1001)}`,
                    date: new Date(r.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' }),
                    orderNo: r._id.toString().slice(-6).toUpperCase(),
                    invoiceAmt: r.totalPrice ? `₹${Number(r.totalPrice).toLocaleString('en-IN')}.00` : '—',
                    amountDue: r.totalPrice && !r.isPaid ? `₹${Number(r.totalPrice).toLocaleString('en-IN')}.00` : '₹0.00',
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

    return (
        <div className="bg-white min-h-screen rounded-2xl p-8 relative">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-medium text-gray-800 mb-2">My Invoices</h1>
                <p className="text-gray-500 text-sm">All your rental invoices are listed below.</p>
            </div>

            {loading ? (
                <div className="flex items-center gap-3 text-gray-400 py-10">
                    <PiSpinnerGap className="animate-spin" size={22} />
                    <span className="text-sm">Loading invoices…</span>
                </div>
            ) : invoices.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <PiReceipt size={52} className="mx-auto mb-3 opacity-25" />
                    <p className="text-sm font-medium">No invoices found.</p>
                    <p className="text-xs mt-1">Once you place a rental order, invoices will appear here.</p>
                </div>
            ) : (
                <>
                    {/* Table Header */}
                    <div className="grid grid-cols-7 gap-4 mb-4 text-sm font-medium text-gray-900 px-4">
                        <div className="col-span-1">Invoice Date</div>
                        <div className="col-span-2">Invoice Number</div>
                        <div className="col-span-1 text-center">Order No.</div>
                        <div className="col-span-1 text-right">Invoice Amt</div>
                        <div className="col-span-1 text-right">Amount Due</div>
                        <div className="col-span-1 text-center">Status</div>
                    </div>

                    <div className="h-px bg-gray-200 w-full mb-6"></div>

                    {/* Invoices List */}
                    <div className="space-y-4">
                        {invoices.map((invoice, index) => (
                            <div key={index} className="grid grid-cols-7 gap-4 items-center px-4 py-4 border border-gray-200 rounded-xl hover:shadow-sm transition-shadow">
                                <div className="col-span-1 text-gray-800 font-medium text-sm">{invoice.date}</div>
                                <div className="col-span-2 text-gray-800 font-medium text-sm">{invoice.id}</div>
                                <div className="col-span-1 text-center text-gray-800 font-medium text-sm">{invoice.orderNo}</div>
                                <div className="col-span-1 text-right text-gray-800 font-medium text-sm">{invoice.invoiceAmt}</div>
                                <div className="col-span-1 text-right text-gray-800 font-medium text-sm">{invoice.amountDue}</div>
                                <div className="col-span-1 flex justify-center">
                                    <span className={`text-xs px-3 py-1 rounded-full border font-medium ${invoice.status === 'Paid'
                                            ? 'bg-blue-50 text-blue-500 border-blue-200'
                                            : 'bg-orange-50 text-orange-500 border-orange-200'
                                        }`}>
                                        {invoice.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
