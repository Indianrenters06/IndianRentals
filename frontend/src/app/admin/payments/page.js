'use client';

import { useState, useEffect } from 'react';
import {
    FiSearch, FiFilter, FiDownload, FiEye, FiCheck, FiX,
    FiCalendar, FiDollarSign, FiCreditCard, FiUser
} from 'react-icons/fi';

export default function PaymentsManagement() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterMethod, setFilterMethod] = useState('all');

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            const token = userInfo.token;

            if (!token) {
                console.error('No token found');
                setLoading(false);
                return;
            }

            const response = await fetch('http://localhost:5000/api/admin/payments', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setPayments(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching payments:', error);
            setPayments([]);
            setLoading(false);
        }
    };

    const filteredPayments = payments.filter(payment => {
        const matchesSearch = payment.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
        const matchesMethod = filterMethod === 'all' || payment.paymentMethod === filterMethod;
        return matchesSearch && matchesStatus && matchesMethod;
    });

    const getStatusBadge = (status) => {
        const badges = {
            completed: <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">Completed</span>,
            pending: <span className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">Pending</span>,
            failed: <span className="px-3 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">Failed</span>,
            refunded: <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">Refunded</span>,
        };
        return badges[status] || badges.pending;
    };

    const getPaymentMethodBadge = (method) => {
        const badges = {
            card: <span className="px-3 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">Card</span>,
            upi: <span className="px-3 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded-full">UPI</span>,
            netbanking: <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">Net Banking</span>,
            wallet: <span className="px-3 py-1 text-xs font-medium bg-pink-100 text-pink-700 rounded-full">Wallet</span>,
            cash: <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">Cash</span>,
        };
        return badges[method] || badges.card;
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
                            <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
                            <p className="text-sm text-gray-600 mt-1">Track and manage all payment transactions</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                                <FiDownload className="w-4 h-4" />
                                Export Report
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-green-700 font-medium">Total Received</p>
                                    <h3 className="text-2xl font-bold text-green-900 mt-1">₹2,45,000</h3>
                                </div>
                                <div className="p-3 bg-green-200 rounded-lg">
                                    <FiDollarSign className="w-6 h-6 text-green-700" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-yellow-700 font-medium">Pending</p>
                                    <h3 className="text-2xl font-bold text-yellow-900 mt-1">₹45,000</h3>
                                </div>
                                <div className="p-3 bg-yellow-200 rounded-lg">
                                    <FiCreditCard className="w-6 h-6 text-yellow-700" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-blue-700 font-medium">Refunded</p>
                                    <h3 className="text-2xl font-bold text-blue-900 mt-1">₹12,500</h3>
                                </div>
                                <div className="p-3 bg-blue-200 rounded-lg">
                                    <FiX className="w-6 h-6 text-blue-700" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-red-700 font-medium">Failed</p>
                                    <h3 className="text-2xl font-bold text-red-900 mt-1">₹8,200</h3>
                                </div>
                                <div className="p-3 bg-red-200 rounded-lg">
                                    <FiX className="w-6 h-6 text-red-700" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-4 mt-6">
                        <div className="flex-1 max-w-md relative">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by transaction ID or customer..."
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
                            <option value="completed">Completed</option>
                            <option value="pending">Pending</option>
                            <option value="failed">Failed</option>
                            <option value="refunded">Refunded</option>
                        </select>
                        <select
                            value={filterMethod}
                            onChange={(e) => setFilterMethod(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                            <option value="all">All Methods</option>
                            <option value="card">Card</option>
                            <option value="upi">UPI</option>
                            <option value="netbanking">Net Banking</option>
                            <option value="wallet">Wallet</option>
                            <option value="cash">Cash</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Payments Table */}
            <div className="px-8 py-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Transaction ID
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
                                        Method
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
                                {filteredPayments.map((payment) => (
                                    <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6">
                                            <span className="font-mono text-sm text-gray-900">{payment.transactionId || 'TXN-001'}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                                    {payment.customer?.name?.charAt(0).toUpperCase() || 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{payment.customer?.name || 'Customer Name'}</p>
                                                    <p className="text-sm text-gray-500">{payment.customer?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                                <FiCalendar className="w-4 h-4 text-gray-400" />
                                                {new Date(payment.createdAt || Date.now()).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="font-semibold text-gray-900">₹{payment.amount?.toLocaleString() || '0'}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            {getPaymentMethodBadge(payment.paymentMethod || 'card')}
                                        </td>
                                        <td className="py-4 px-6">
                                            {getStatusBadge(payment.status || 'pending')}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <FiEye className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                    {filteredPayments.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FiCreditCard className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No payments found</h3>
                            <p className="text-gray-600">No payment transactions match your filters</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {filteredPayments.length > 0 && (
                        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
                            <p className="text-sm text-gray-600">
                                Showing <span className="font-semibold">{filteredPayments.length}</span> of <span className="font-semibold">{payments.length}</span> payments
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
