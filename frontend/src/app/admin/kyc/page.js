"use client";
import React, { useEffect, useState } from 'react';
import { getAllKYC, updateKYCStatus } from '../../../services/kycService';
import { API_BASE_URL } from '../../../services/apiConfig';
import Swal from 'sweetalert2';

const KYCPage = () => {
    const [kycRequests, setKycRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchKYC();
    }, []);

    const fetchKYC = async () => {
        try {
            setLoading(true);
            const data = await getAllKYC();
            setKycRequests(data);
        } catch (error) {
            console.error("Failed to fetch KYC requests:", error);
            Swal.fire('Error', 'Failed to fetch KYC requests', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            // Confirm first
            const result = await Swal.fire({
                title: 'Approve KYC?',
                text: "User will be verified immediately.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, Approve!'
            });

            if (result.isConfirmed) {
                await updateKYCStatus(id, { status: 'approved' });
                Swal.fire('Approved!', 'User KYC has been approved.', 'success');
                fetchKYC(); // Refresh list
            }
        } catch (error) {
            console.error("Approval failed", error);
            Swal.fire('Error', 'Failed to approve KYC', 'error');
        }
    };

    const handleReject = async (id) => {
        try {
            const { value: reason } = await Swal.fire({
                title: 'Reject KYC',
                input: 'textarea',
                inputLabel: 'Reason for rejection',
                inputPlaceholder: 'Enter reason here...',
                showCancelButton: true,
                inputValidator: (value) => {
                    if (!value) {
                        return 'You need to write a reason!'
                    }
                }
            });

            if (reason) {
                await updateKYCStatus(id, { status: 'rejected', rejectionReason: reason });
                Swal.fire('Rejected!', 'User KYC has been rejected.', 'success');
                fetchKYC();
            }
        } catch (error) {
            console.error("Rejection failed", error);
            Swal.fire('Error', 'Failed to reject KYC', 'error');
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading KYC Requests...</div>;

    return (
        <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">KYC Verification Requests</h2>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Submitted At
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Documents
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {kycRequests.map((req) => (
                                <tr key={req._id}>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <div className="flex items-center">
                                            <div className="ml-3">
                                                <p className="text-gray-900 whitespace-no-wrap font-semibold">
                                                    {req.user?.name || 'Unknown User'}
                                                </p>
                                                <p className="text-gray-600 whitespace-no-wrap text-xs">
                                                    {req.user?.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <span className={`relative inline-block px-3 py-1 font-semibold leading-tight rounded-full 
                                            ${req.status === 'approved' ? 'bg-green-100 text-green-900' :
                                                req.status === 'rejected' ? 'bg-red-100 text-red-900' :
                                                    'bg-yellow-100 text-yellow-900'}`}>
                                            <span aria-hidden className="absolute inset-0 opacity-50 rounded-full"></span>
                                            <span className="relative capitalize">{req.status}</span>
                                        </span>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">
                                            {new Date(req.createdAt).toLocaleDateString()}
                                        </p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <div className="flex flex-col space-y-1">
                                            {req.documents && Object.entries(req.documents).map(([key, path]) => (
                                                <a
                                                    key={key}
                                                    href={`${API_BASE_URL}/${path}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-900 text-xs underline"
                                                >
                                                    View {key.replace(/([A-Z])/g, ' $1').trim()}
                                                </a>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <div className="flex space-x-2">
                                            {req.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(req._id)}
                                                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded text-xs transition duration-150"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(req._id)}
                                                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-xs transition duration-150"
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {kycRequests.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center text-gray-500">
                                        No KYC requests found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default KYCPage;
