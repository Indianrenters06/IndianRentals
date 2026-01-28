'use client';

import React, { useState } from 'react';
import { FaFingerprint, FaCheck } from 'react-icons/fa';

export default function KYCPage() {
    const [customerType, setCustomerType] = useState('Customer'); // Customer | Company
    const [currentStep, setCurrentStep] = useState(1);

    const handleNext = () => {
        if (currentStep < 4) setCurrentStep(currentStep + 1);
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    return (
        <div className="relative rounded-2xl p-6 bg-white shadow-sm border border-gray-100">

            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-medium text-gray-700">KYC & Documentation</h1>
            </div>

            {/* Customer Type Toggle */}
            <div className="flex bg-gray-100 p-1 rounded-full w-fit mb-8">
                <button
                    onClick={() => setCustomerType('Customer')}
                    className={`px-8 py-2 rounded-full text-sm font-medium transition-all ${customerType === 'Customer' ? 'bg-[#333] text-white shadow-sm' : 'text-gray-600 hover:text-gray-800'
                        }`}
                >
                    Customer
                </button>
                <button
                    onClick={() => setCustomerType('Company')}
                    className={`px-8 py-2 rounded-full text-sm font-medium transition-all ${customerType === 'Company' ? 'bg-[#333] text-white shadow-sm' : 'text-gray-600 hover:text-gray-800'
                        }`}
                >
                    Company
                </button>
            </div>

            {/* Green Banner */}
            <div className="bg-[#e8f5e9] border border-[#a5d6a7] rounded-lg p-4 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#c8e6c9] flex items-center justify-center text-[#2e7d32]">
                    <FaFingerprint size={16} />
                </div>
                <span className="text-[#1b5e20] font-medium">Complete KYC to complete your order</span>
            </div>

            {/* Orange Warning Box */}
            <div className="bg-[#fff8e1] border border-[#ffe082] rounded-xl p-5 mb-8">
                <h3 className="text-gray-800 font-medium mb-3">Keep your documents handy (physical or digital)</h3>
                <ul className="text-gray-600 text-sm space-y-2 pl-1">
                    <li>1. Aadhar Card / Voter ID / Passport</li>
                    <li>2. Rental Agreement / House Electricity Bill</li>
                    <li>3. Bank Statement → 3 Months</li>
                </ul>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select an order to view its documentation process <span className="text-red-500">*</span></label>
                <select className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-white">
                    <option>Select Order</option>
                </select>
                <p className="text-[10px] text-gray-400 mt-1">Message</p>
            </div>

            <div className="h-px bg-gray-200 w-full mb-8 mt-8"></div>

            {/* Form Container */}
            <div className="bg-white rounded-3xl p-1 border border-gray-100">

                {/* Stepper */}
                <div className="flex justify-center mb-10 mt-4">
                    <div className="flex items-center w-full max-w-xl relative">
                        {/* Line */}
                        <div className="absolute left-0 top-1/2 w-full h-px bg-gray-200 -z-10"></div>
                        <div
                            className="absolute left-0 top-1/2 h-px bg-[#00c853] -z-10 transition-all duration-300"
                            style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                        ></div>

                        {/* Steps */}
                        {[1, 2, 3, 4].map((step) => {
                            const isCompleted = step < currentStep;
                            const isActive = step === currentStep;

                            return (
                                <div key={step} className="flex-1 flex justify-center first:justify-start last:justify-end">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium z-10 border transition-all duration-300
                                        ${isCompleted ? 'bg-[#00c853] border-[#00c853] text-white' :
                                                isActive ? 'bg-white border-gray-800 text-gray-900 shadow-sm' :
                                                    'bg-white border-gray-300 text-gray-400'}`}
                                    >
                                        {isCompleted ? <FaCheck size={14} /> : step}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Step 1: Personal Details */}
                {currentStep === 1 && (
                    <>
                        <div className="mb-8">
                            <h2 className="text-2xl font-medium text-gray-700 mb-2">Personal Details</h2>
                            <div className="h-px bg-gray-200 w-full"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 mb-8">
                            <div className="md:col-span-2">
                                <TextInput label="Name" required placeholder="Enter Your Full Name" />
                            </div>
                            <TextInput label="Father's / Mother's Name" required placeholder="" />
                            <TextInput label="Father's / Mother's Number" required placeholder="Placeholder" isSelect />

                            <div className="md:col-span-2">
                                <TextInput label="Personal Email" required placeholder="Placeholder" isSelect />
                            </div>
                            <div className="md:col-span-2">
                                <TextInput label="Mobile Number" required placeholder="Placeholder" isSelect />
                            </div>
                            <div className="md:col-span-2">
                                <TextInput label="Permanent Address" required placeholder="Placeholder" isSelect />
                            </div>

                            <TextInput label="City" required placeholder="" />
                            <TextInput label="State" required placeholder="" />
                            <TextInput label="Pincode" required placeholder="" />
                            <TextInput label="Country" required placeholder="" isSelect />
                        </div>

                        <button
                            onClick={handleNext}
                            className="w-full bg-[#333] hover:bg-black text-white font-medium py-3 rounded-xl transition-all text-lg shadow-lg"
                        >
                            Start my KYC process
                        </button>
                    </>
                )}

                {/* Step 2: Company Details */}
                {currentStep === 2 && (
                    <>
                        <div className="mb-8">
                            <h2 className="text-2xl font-medium text-gray-700 mb-2">Company Details</h2>
                            <div className="h-px bg-gray-200 w-full"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 mb-8">
                            <div className="md:col-span-2">
                                <TextInput label="Company Name" required placeholder="" />
                            </div>

                            <TextInput label="Type of Company" required placeholder="Placeholder" isSelect />
                            <TextInput label="Approx no. of employee" required placeholder="Message" />

                            <div className="md:col-span-2">
                                <TextInput label="Your Designation" required placeholder="" />
                            </div>

                            <TextInput label="Duration of Service in the company" required placeholder="Placeholder" />
                            <TextInput label="Official Company email" required placeholder="Placeholder" />

                            <div className="md:col-span-2">
                                <TextInput label="Reference Address" required placeholder="Placeholder" isSelect />
                            </div>

                            <TextInput label="City" required placeholder="" />
                            <TextInput label="State" required placeholder="" />
                            <TextInput label="Pincode" required placeholder="" />
                            <TextInput label="Country" required placeholder="" isSelect />
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handleBack}
                                className="w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 rounded-xl transition-all text-lg"
                            >
                                Start my KYC process
                            </button>
                            <button
                                onClick={handleNext}
                                className="w-1/2 bg-[#333] hover:bg-black text-white font-medium py-3 rounded-xl transition-all text-lg shadow-lg"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
}

const TextInput = ({ label, required, placeholder, isSelect }) => (
    <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-2">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
            {isSelect ? (
                <div className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white text-gray-400 text-sm flex justify-between items-center cursor-pointer hover:border-gray-300 transition-colors">
                    <span>{placeholder || 'Select'}</span>
                    <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            ) : (
                <input
                    type="text"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors placeholder-gray-300"
                    placeholder={placeholder}
                />
            )}
        </div>
        <p className="text-[10px] text-gray-400 mt-1 font-medium">Message</p>
    </div>
);
