'use client';

import { useState, useEffect } from 'react';
import {
    FiSearch, FiFilter, FiDownload, FiEye, FiCheck, FiX,
    FiUser, FiCalendar, FiFileText, FiAlertCircle, FiClock
} from 'react-icons/fi';

export default function KYCManagement() {
    const [kycList, setKycList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedKYC, setSelectedKYC] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionRemarks, setRejectionRemarks] = useState('');

    useEffect(() => {
        fetchKYCList();
    }, []);

    const fetchKYCList = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            const token = userInfo.token;

            if (!token) {
                console.error('No token found');
                setLoading(false);
                return;
            }

            const response = await fetch('http://localhost:5000/api/admin/kyc', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            // Ensure data is an array
            setKycList(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching KYC list:', error);
            setKycList([]);
            setLoading(false);
        }
    };

    const handleApprove = async (kycId) => {
        if (!confirm('Are you sure you want to approve this KYC?')) return;

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            const token = userInfo.token;
            const response = await fetch(`http://localhost:5000/api/admin/kyc/${kycId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: 'approved' })
            });

            if (response.ok) {
                fetchKYCList();
                alert('KYC approved successfully!');
            }
        } catch (error) {
            console.error('Error approving KYC:', error);
            alert('Failed to approve KYC');
        }
    };

    const handleReject = async () => {
        if (!rejectionRemarks.trim()) {
            alert('Please provide rejection remarks');
            return;
        }

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            const token = userInfo.token;
            const response = await fetch(`http://localhost:5000/api/admin/kyc/${selectedKYC._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    status: 'rejected',
                    remarks: rejectionRemarks
                })
            });

            if (response.ok) {
                fetchKYCList();
                setShowRejectModal(false);
                setRejectionRemarks('');
                setSelectedKYC(null);
                alert('KYC rejected successfully!');
            }
        } catch (error) {
            console.error('Error rejecting KYC:', error);
            alert('Failed to reject KYC');
        }
    };

    const openRejectModal = (kyc) => {
        setSelectedKYC(kyc);
        setShowRejectModal(true);
    };

    const openDetailsModal = (kyc) => {
        setSelectedKYC(kyc);
        setShowDetailsModal(true);
    };

    const filteredKYC = kycList.filter(kyc => {
        const matchesSearch = kyc.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            kyc.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || kyc.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status) => {
        const badges = {
            pending: <span className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">Pending</span>,
            approved: <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">Approved</span>,
            rejected: <span className="px-3 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">Rejected</span>,
            incomplete: <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">Incomplete</span>,
        };
        return badges[status] || badges.incomplete;
    };

    const DetailsModal = () => {
        if (!showDetailsModal || !selectedKYC) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Modal Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between rounded-t-2xl">
                        <h2 className="text-2xl font-bold text-gray-900">KYC Details</h2>
                        <button
                            onClick={() => setShowDetailsModal(false)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <FiX className="w-6 h-6 text-gray-500" />
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className="p-8">
                        {/* User Info */}
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">User Information</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Name</p>
                                    <p className="font-semibold text-gray-900">{selectedKYC.user?.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Email</p>
                                    <p className="font-semibold text-gray-900">{selectedKYC.user?.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Phone</p>
                                    <p className="font-semibold text-gray-900">{selectedKYC.user?.phone || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Status</p>
                                    <div className="mt-1">{getStatusBadge(selectedKYC.status)}</div>
                                </div>
                            </div>
                        </div>

                        {/* Personal Details */}
                        {selectedKYC.personalDetails && (
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Personal Details</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">PAN Card</p>
                                        <p className="font-semibold text-gray-900">{selectedKYC.personalDetails.panCard || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Aadhar Card</p>
                                        <p className="font-semibold text-gray-900">{selectedKYC.personalDetails.aadharCard || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Date of Birth</p>
                                        <p className="font-semibold text-gray-900">
                                            {selectedKYC.personalDetails.dob ? new Date(selectedKYC.personalDetails.dob).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Gender</p>
                                        <p className="font-semibold text-gray-900">{selectedKYC.personalDetails.gender || 'N/A'}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm text-gray-600">Permanent Address</p>
                                        <p className="font-semibold text-gray-900">{selectedKYC.personalDetails.permanentAddress || 'N/A'}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm text-gray-600">Current Address</p>
                                        <p className="font-semibold text-gray-900">{selectedKYC.personalDetails.currentAddress || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Company Details */}
                        {selectedKYC.companyDetails && (
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Company Details</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Company Name</p>
                                        <p className="font-semibold text-gray-900">{selectedKYC.companyDetails.companyName || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">GST Number</p>
                                        <p className="font-semibold text-gray-900">{selectedKYC.companyDetails.gstNumber || 'N/A'}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm text-gray-600">Company Address</p>
                                        <p className="font-semibold text-gray-900">{selectedKYC.companyDetails.companyAddress || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Company Email</p>
                                        <p className="font-semibold text-gray-900">{selectedKYC.companyDetails.companyEmail || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Reference Details */}
                        {selectedKYC.referenceDetails && (
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Reference Details</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Name</p>
                                        <p className="font-semibold text-gray-900">{selectedKYC.referenceDetails.name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Relation</p>
                                        <p className="font-semibold text-gray-900">{selectedKYC.referenceDetails.relation || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Phone</p>
                                        <p className="font-semibold text-gray-900">{selectedKYC.referenceDetails.phone || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Documents */}
                        {selectedKYC.documents && (
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Documents</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {Object.entries(selectedKYC.documents).map(([key, value]) => (
                                        value && (
                                            <div key={key}>
                                                <p className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                                <a
                                                    href={value}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                                                >
                                                    View Document →
                                                </a>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Remarks */}
                        {selectedKYC.remarks && (
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Remarks</h3>
                                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedKYC.remarks}</p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        {selectedKYC.status === 'pending' && (
                            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
                                <button
                                    onClick={() => {
                                        setShowDetailsModal(false);
                                        openRejectModal(selectedKYC);
                                    }}
                                    className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
                                >
                                    <FiX className="w-4 h-4" />
                                    Reject
                                </button>
                                <button
                                    onClick={() => {
                                        handleApprove(selectedKYC._id);
                                        setShowDetailsModal(false);
                                    }}
                                    className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                                >
                                    <FiCheck className="w-4 h-4" />
                                    Approve
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const RejectModal = () => {
        if (!showRejectModal) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                    <div className="p-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-red-100 rounded-full">
                                <FiAlertCircle className="w-6 h-6 text-red-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Reject KYC</h2>
                        </div>
                        <p className="text-gray-600 mb-6">Please provide a reason for rejecting this KYC submission.</p>

                        <textarea
                            value={rejectionRemarks}
                            onChange={(e) => setRejectionRemarks(e.target.value)}
                            placeholder="Enter rejection reason..."
                            rows="4"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-6"
                        />

                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setRejectionRemarks('');
                                }}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                            >
                                Reject KYC
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
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
                            <h1 className="text-3xl font-bold text-gray-900">KYC Management</h1>
                            <p className="text-sm text-gray-600 mt-1">Review and approve KYC submissions</p>
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
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="incomplete">Incomplete</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* KYC Table */}
            <div className="px-8 py-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Submitted On
                                    </th>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Documents
                                    </th>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredKYC.map((kyc) => (
                                    <tr key={kyc._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                                    {kyc.user?.name?.charAt(0).toUpperCase() || 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{kyc.user?.name || 'Unknown'}</p>
                                                    <p className="text-sm text-gray-500">{kyc.user?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                                <FiCalendar className="w-4 h-4 text-gray-400" />
                                                {new Date(kyc.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            {getStatusBadge(kyc.status)}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                                <FiFileText className="w-4 h-4 text-gray-400" />
                                                {kyc.documents ? Object.keys(kyc.documents).filter(k => kyc.documents[k]).length : 0} files
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => openDetailsModal(kyc)}
                                                    className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <FiEye className="w-4 h-4" />
                                                </button>
                                                {kyc.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(kyc._id)}
                                                            className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-1"
                                                        >
                                                            <FiCheck className="w-3 h-3" />
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => openRejectModal(kyc)}
                                                            className="px-3 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-1"
                                                        >
                                                            <FiX className="w-3 h-3" />
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                    {filteredKYC.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FiFileText className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No KYC submissions found</h3>
                            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {filteredKYC.length > 0 && (
                        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
                            <p className="text-sm text-gray-600">
                                Showing <span className="font-semibold">{filteredKYC.length}</span> of <span className="font-semibold">{kycList.length}</span> submissions
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

            {/* Modals */}
            <DetailsModal />
            <RejectModal />
        </div>
    );
}
