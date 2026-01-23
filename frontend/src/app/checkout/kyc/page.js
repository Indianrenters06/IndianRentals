'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowRight, FaCloudUploadAlt, FaCheckCircle } from 'react-icons/fa';
import OrderSummary from '../../../components/OrderSummary';

export default function KYCPage() {
    const router = useRouter();
    const [documents, setDocuments] = useState({
        aadharFront: null,
        aadharBack: null,
        panCard: null
    });

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            setDocuments(prev => ({ ...prev, [type]: file }));
        }
    };

    const handleContinue = () => {
        if (!documents.aadharFront || !documents.aadharBack) {
            alert("Please upload mandatory KYC documents (Aadhar Card).");
            return;
        }
        router.push('/checkout/payment');
    };

    // Mock calculations
    const securityAmount = 5000;
    const deliveryCharges = 400;
    const monthlyRentTotal = 1100;
    const totalGST = 120;
    const totalOneTime = 6620;
    const payToday = 600;
    const savedAmount = 4030.00;

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="text-xs text-gray-500 mb-6 flex items-center gap-2">
                    <Link href="/cart" className="hover:text-black">Cart</Link>
                    <span>›</span>
                    <Link href="/checkout/address" className="hover:text-black">Address</Link>
                    <span>›</span>
                    <span className="text-black font-medium">KYC</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column: KYC Form */}
                    <div className="lg:w-2/3">
                        <h1 className="text-3xl font-medium text-gray-900 mb-2">KYC Verification</h1>
                        <p className="text-gray-500 mb-8">Upload documents to verify your identity.</p>

                        <div className="space-y-6">
                            {/* Aadhar Front */}
                            <DocumentUpload
                                label="Aadhar Card (Front Side)"
                                id="aadharFront"
                                file={documents.aadharFront}
                                onChange={(e) => handleFileChange(e, 'aadharFront')}
                                required
                            />

                            {/* Aadhar Back */}
                            <DocumentUpload
                                label="Aadhar Card (Back Side)"
                                id="aadharBack"
                                file={documents.aadharBack}
                                onChange={(e) => handleFileChange(e, 'aadharBack')}
                                required
                            />

                            {/* PAN Card */}
                            <DocumentUpload
                                label="PAN Card (Optional)"
                                id="panCard"
                                file={documents.panCard}
                                onChange={(e) => handleFileChange(e, 'panCard')}
                            />
                        </div>

                        {/* Continue Button */}
                        <button
                            onClick={handleContinue}
                            className={`mt-10 bg-[#FFD740] hover:bg-[#FFC400] text-[#1D1D1F] px-8 py-3.5 rounded-full text-base font-medium flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                            disabled={!documents.aadharFront || !documents.aadharBack}
                        >
                            Continue to Payment <FaArrowRight className="text-sm" />
                        </button>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:w-1/3 mt-6 lg:mt-14">
                        <OrderSummary
                            securityAmount={securityAmount}
                            deliveryCharges={deliveryCharges}
                            monthlyRentTotal={monthlyRentTotal}
                            totalGST={totalGST}
                            totalOneTime={totalOneTime}
                            payToday={payToday}
                            savedAmount={savedAmount}
                            showButton={false}
                        />
                        <div className="mt-4 bg-blue-50 text-blue-800 text-xs p-4 rounded-xl border border-blue-100 flex gap-2 items-start">
                            <span className="text-lg">ℹ️</span>
                            <p>Your documents are securely stored and only used for identity verification as per government regulations.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const DocumentUpload = ({ label, id, file, onChange, required }) => {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
            <label className="block text-sm font-medium text-gray-900 mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            <div className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-colors ${file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-black'}`}>
                {file ? (
                    <div className="flex flex-col items-center text-green-700">
                        <FaCheckCircle size={32} className="mb-2" />
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs opacity-75">Click to change</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center text-gray-400">
                        <FaCloudUploadAlt size={32} className="mb-2" />
                        <p className="text-sm font-medium text-gray-600">Click to upload or drag and drop</p>
                        <p className="text-xs">SVG, PNG, JPG or PDF</p>
                    </div>
                )}
                <input
                    type="file"
                    id={id}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={onChange}
                    accept="image/*,.pdf"
                />
            </div>
        </div>
    );
};
