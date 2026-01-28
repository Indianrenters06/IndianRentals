'use client';

import React from 'react';
import { PiDownloadSimpleBold } from 'react-icons/pi';

export default function MyInvoicesPage() {
    // Dummy Invoice Data matching the screenshot
    const invoices = [
        {
            id: 'DEL/25-26/1360',
            date: '21-Aug-25',
            orderNo: '4479',
            invoiceAmt: 'Rs. 5,3100.00',
            amountDue: 'Rs. 3,000.00',
            status: 'Paid',
        }
    ];

    return (
        <div className="bg-white min-h-screen rounded-2xl p-8 relative">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-medium text-gray-800 mb-2">My Invoices</h1>
                <p className="text-gray-500 text-sm">All the invoices are listed below.</p>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-7 gap-4 mb-4 text-sm font-medium text-gray-900 px-4">
                <div className="col-span-1">Invoice Date</div>
                <div className="col-span-2">Invoice Number</div>
                <div className="col-span-1 text-center">Order No.</div>
                <div className="col-span-1 text-right">Invoice Amt</div>
                <div className="col-span-1 text-right">Amount Due</div>
                <div className="col-span-1 text-center">Status</div>
                <div className="col-span-1 text-center">Action</div>
            </div>

            <div className="h-px bg-gray-200 w-full mb-6"></div>

            {/* Invoices List */}
            <div className="space-y-4">
                {invoices.map((invoice, index) => (
                    <div key={index} className="grid grid-cols-7 gap-4 items-center px-4 py-4 border border-gray-200 rounded-xl hover:shadow-sm transition-shadow">
                        <div className="col-span-1 text-gray-800 font-medium text-sm">
                            {invoice.date}
                        </div>
                        <div className="col-span-2 text-gray-800 font-medium text-sm">
                            {invoice.id}
                        </div>
                        <div className="col-span-1 text-center text-gray-800 font-medium text-sm">
                            {invoice.orderNo}
                        </div>
                        <div className="col-span-1 text-right text-gray-800 font-medium text-sm">
                            {invoice.invoiceAmt}
                        </div>
                        <div className="col-span-1 text-right text-gray-800 font-medium text-sm">
                            {invoice.amountDue}
                        </div>
                        <div className="col-span-1 flex justify-center">
                            <span className="bg-blue-50 text-blue-500 text-xs px-3 py-1 rounded-full border border-blue-200 font-medium">
                                {invoice.status}
                            </span>
                        </div>
                        <div className="col-span-1 flex justify-center">
                            <button className="bg-[#007bff] hover:bg-[#0069d9] text-white text-xs font-bold py-2 px-6 rounded-full transition-colors shadow-sm">
                                Download
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State (Optional, not shown in screenshot but good practice) */}
            {invoices.length === 0 && (
                <div className="text-center py-10 text-gray-400 text-sm">No invoices found</div>
            )}
        </div>
    );
}
