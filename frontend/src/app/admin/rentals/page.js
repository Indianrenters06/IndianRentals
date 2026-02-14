'use client';

import { useState, useEffect } from 'react';
import {
    FiSearch, FiFilter, FiDownload, FiEye, FiCheck, FiX,
    FiPackage, FiUser, FiCalendar, FiDollarSign, FiMapPin
} from 'react-icons/fi';

export default function RentalsManagement() {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchRentals();
    }, []);

    const fetchRentals = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            const token = userInfo.token;

            if (!token) {
                console.error('No token found');
                setLoading(false);
                return;
            }

            const response = await fetch('http://localhost:5000/api/admin/rentals', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setRentals(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching rentals:', error);
            setRentals([]);
            setLoading(false);
        }
    };

    const updateRentalStatus = async (rentalId, updates) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            const token = userInfo.token;

            const response = await fetch(`http://localhost:5000/api/admin/rentals/${rentalId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updates)
            });

            if (response.ok) {
                fetchRentals();
            }
        } catch (error) {
            console.error('Error updating rental:', error);
        }
    };

    const filteredRentals = rentals.filter(rental => {
        const matchesSearch = rental.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rental.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' ||
            (filterStatus === 'paid' && rental.isPaid) ||
            (filterStatus === 'pending' && !rental.isPaid);
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (rental) => {
        if (rental.isDelivered) {
            return <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">Delivered</span>;
        } else if (rental.isPaid) {
            return <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">Paid</span>;
        } else {
            return <span className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">Pending</span>;
        }
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
                            <h1 className="text-3xl font-bold text-gray-900">Rentals Management</h1>
                            <p className="text-sm text-gray-600 mt-1">Track and manage all rental orders</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                                <FiDownload className="w-4 h-4" />
                                Export Report
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-4 mt-6">
                        <div className="flex-1 max-w-md relative">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by customer name or email..."
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
                        </select>
                    </div>
                </div>
            </div>

            {/* Rentals Table */}
            <div className="px-8 py-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Order ID
                                    </th>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Total Amount
                                    </th>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Payment
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
                                {filteredRentals.map((rental) => (
                                    <tr key={rental._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6">
                                            <span className="font-mono text-sm text-gray-900">
                                                #{rental._id?.slice(-8).toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                                    {rental.user?.name?.charAt(0).toUpperCase() || 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{rental.user?.name || 'Unknown'}</p>
                                                    <p className="text-sm text-gray-500">{rental.user?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                                <FiCalendar className="w-4 h-4 text-gray-400" />
                                                {new Date(rental.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="font-bold text-gray-900">
                                                ₹{rental.totalPrice?.toLocaleString() || '0'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            {rental.isPaid ? (
                                                <div className="flex items-center gap-2">
                                                    <FiCheck className="w-4 h-4 text-green-600" />
                                                    <span className="text-sm text-green-600 font-medium">Paid</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <FiX className="w-4 h-4 text-red-600" />
                                                    <span className="text-sm text-red-600 font-medium">Unpaid</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-4 px-6">
                                            {getStatusBadge(rental)}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <FiEye className="w-4 h-4" />
                                                </button>
                                                {!rental.isPaid && (
                                                    <button
                                                        onClick={() => updateRentalStatus(rental._id, { isPaid: true, paidAt: new Date() })}
                                                        className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                                                    >
                                                        Mark Paid
                                                    </button>
                                                )}
                                                {rental.isPaid && !rental.isDelivered && (
                                                    <button
                                                        onClick={() => updateRentalStatus(rental._id, { isDelivered: true, deliveredAt: new Date() })}
                                                        className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                                                    >
                                                        Mark Delivered
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                    {filteredRentals.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FiPackage className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No rentals found</h3>
                            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {filteredRentals.length > 0 && (
                        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
                            <p className="text-sm text-gray-600">
                                Showing <span className="font-semibold">{filteredRentals.length}</span> of <span className="font-semibold">{rentals.length}</span> rentals
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
