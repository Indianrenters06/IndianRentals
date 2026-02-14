'use client';

import { useState, useEffect } from 'react';
import {
    FiSearch, FiFilter, FiDownload, FiEye, FiPrinter, FiMail,
    FiCalendar, FiDollarSign, FiFileText, FiCheck, FiX
} from 'react-icons/fi';

export default function InvoicesManagement() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            const token = userInfo.token;

            if (!token) {
                console.error('No token found');
                setLoading(false);
                return;
            }

            const response = await fetch('http://localhost:5000/api/admin/invoices', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setInvoices(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching invoices:', error);
            setInvoices([]);
            setLoading(false);
        }
    };

    const filteredInvoices = invoices.filter(invoice => {
        const matchesSearch = invoice.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status) => {
        const badges = {
            paid: <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">Paid</span>,
            pending: <span className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">Pending</span>,
            overdue: <span className="px-3 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">Overdue</span>,
            cancelled: <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">Cancelled</span>,
        };
        return badges[status] || badges.pending;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
                            <p className="text-sm text-gray-600 mt-1">Manage and track all invoices</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                                <FiDownload className="w-4 h-4" />
                                Export
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                                <FiFileText className="w-4 h-4" />
                                New Invoice
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-4 mt-6">
                        <div className="flex-1 max-w-md relative">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by invoice number or customer..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                            <option value="all">All Status</option>
                            <option value="paid">Paid</option>
                            <option value="pending">Pending</option>
                            <option value="overdue">Overdue</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Invoices Table */}
            <div className="px-8 py-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Invoice #
                                    </th>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredInvoices.map((invoice) => (
                                    <tr key={invoice._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6">
                                            <span className="font-semibold text-indigo-600">#{invoice.invoiceNumber || 'INV-001'}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div>
                                                <p className="font-semibold text-gray-900">{invoice.customer?.name || 'Customer Name'}</p>
                                                <p className="text-sm text-gray-500">{invoice.customer?.email}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                                <FiCalendar className="w-4 h-4 text-gray-400" />
                                                {new Date(invoice.createdAt || Date.now()).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="font-semibold text-gray-900">₹{invoice.amount?.toLocaleString() || '0'}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            {getStatusBadge(invoice.status || 'pending')}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors"
                                                    title="View Invoice"
                                                >
                                                    <FiEye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition-colors"
                                                    title="Print Invoice"
                                                >
                                                    <FiPrinter className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                                                    title="Send Email"
                                                >
                                                    <FiMail className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                    {filteredInvoices.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FiFileText className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No invoices found</h3>
                            <p className="text-gray-600">Create your first invoice or adjust your filters</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {filteredInvoices.length > 0 && (
                        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
                            <p className="text-sm text-gray-600">
                                Showing <span className="font-semibold">{filteredInvoices.length}</span> of <span className="font-semibold">{invoices.length}</span> invoices
                            </p>
                            <div className="flex items-center gap-2">
                                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                                    Previous
                                </button>
                                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
