'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { FaUserCircle, FaTrashAlt, FaPlus, FaArrowRight, FaCheck } from 'react-icons/fa';
import { BsCheckCircleFill } from 'react-icons/bs';
import { FiEdit2 } from 'react-icons/fi';
import { selectCartTotals } from '../../../redux/features/cartSlice';
import OrderSummary from '../../../components/OrderSummary';
import AddressModal from '../../../components/AddressModal';

// Start with no pre-filled addresses — user must add their own
const initialAddresses = [];

export default function AddressPage() {
    const router = useRouter();
    const totals = useSelector(selectCartTotals);
    const { securityAmount, deliveryCharges, monthlyRentTotal, totalGST, totalOneTime, payToday, savedAmount } = totals;

    const [addresses, setAddresses] = useState(initialAddresses);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);

    const handleAddClick = () => {
        setEditingAddress(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (e, addr) => {
        e.stopPropagation();
        setEditingAddress(addr);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (e, id) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this address?')) {
            setAddresses(prev => prev.filter(addr => addr.id !== id));
            if (selectedAddressId === id) {
                setSelectedAddressId(null);
            }
        }
    };

    const handleSaveAddress = (formData) => {
        if (editingAddress) {
            // Update existing
            setAddresses(prev => prev.map(addr =>
                addr.id === editingAddress.id ? { ...formData, id: addr.id } : addr
            ));
        } else {
            // Add new
            const newAddress = {
                ...formData,
                id: Date.now()
            };
            setAddresses(prev => [...prev, newAddress]);
            // Auto select new address
            setSelectedAddressId(newAddress.id);
        }
        setIsModalOpen(false);
        setEditingAddress(null);
    };

    const handleContinue = () => {
        if (!selectedAddressId) {
            alert("Please select an address to continue.");
            return;
        }
        // Proceed to KYC
        router.push('/checkout/kyc');
    };


    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Header Section would be here or in layout */}
            {/* For now, we assume layout handles the main nav, but we might need the Steps Header */}

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-8 py-4">
                {/* Breadcrumb - Mocked based on image */}
                <div className="text-xs text-gray-500 mb-6 flex items-center gap-2">
                    <Link href="/" className="hover:text-black font-medium font-sans">Product-Page</Link>
                    <span>›</span>
                    <Link href="/cart" className="hover:text-black font-medium font-sans">Cart</Link>
                    <span>›</span>
                    <span className="text-black font-medium font-sans">Address</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column: Addresses */}
                    <div className="lg:w-2/3">
                        <div className="relative rounded-2xl p-8 bg-gray-50/50">
                            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
                                <rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="16" ry="16" fill="none" stroke="#D1D5DB" strokeWidth="2" strokeDasharray="12 8" />
                            </svg>
                            <h1 className="text-2xl font-normal text-gray-900 mb-2">Your Addresses</h1>

                            {/* Divider */}
                            <div className="h-px bg-gray-300 w-full mb-6"></div>

                            {/* Add Address Button */}
                            <button
                                onClick={handleAddClick}
                                className="bg-[#2D2D2D] text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium hover:bg-black transition-colors mb-3"
                            >
                                <FaPlus /> Add New Address
                            </button>

                            {/* Address List */}
                            <div className="flex flex-col gap-4">
                                {addresses.map((addr) => (
                                    <div
                                        key={addr.id}
                                        className={`bg-white border-2 overflow-hidden ${selectedAddressId === addr.id ? 'border-[#007AFF]' : 'border-gray-200'} rounded-2xl p-2 relative cursor-pointer hover:shadow-sm transition-all`}
                                        onClick={() => setSelectedAddressId(addr.id)}
                                    >
                                        {selectedAddressId === addr.id && (
                                            <div className="absolute top-0 right-0 bg-[#007AFF] w-7 h-6 rounded-bl-[1rem] flex items-center-safe justify-center">
                                                <FaCheck className="text-white text-l translate-x-1.5 -translate-y-1.5" />
                                            </div>
                                        )}
                                        <div className="flex items-start gap-4">
                                            <div className="mt-1 text-gray-800">
                                                <FaUserCircle size={40} className="text-gray-600" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-l font-medium text-gray-700">{addr.name}</h3>
                                                <p className="text-gray-800 mt-1 text-[15px] leading-relaxed font-medium">
                                                    {addr.addressLine} <span className="text-gray-600 mx-1">|</span>
                                                    {addr.city} <span className="text-gray-600 mx-1">|</span>
                                                    {addr.pincode} <span className="text-gray-600 mx-1">|</span>
                                                    {addr.state}
                                                </p>
                                                <p className="text-gray-500 mt-2 text-sm font-semibold">{addr.phone}</p>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-col items-center gap-4 ml-4">
                                                <button
                                                    onClick={(e) => handleDeleteClick(e, addr.id)}
                                                    className="flex flex-col items-center gap-1 text-gray-400 hover:text-red-500 group transition-colors"
                                                >
                                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-red-50">
                                                        <FaTrashAlt size={14} />
                                                    </div>
                                                </button>
                                                <button
                                                    onClick={(e) => handleEditClick(e, addr)}
                                                    className="flex flex-col items-center gap-1 text-gray-800 hover:text-black group"
                                                >
                                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gray-100">
                                                        <FiEdit2 size={14} />
                                                    </div>
                                                    <span className="text-[10px] font-medium underline decoration-1">Click to Edit</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Continue Button */}
                            <button
                                onClick={handleContinue}
                                className="mt-8 bg-[#FFD740] hover:bg-[#FFC400] text-[#1D1D1F] px-8 py-3.5 rounded-full text-base font-medium flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!selectedAddressId}
                            >
                                Continue for KYC process <FaArrowRight className="text-sm" />
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:w-1/3 ">
                        <OrderSummary
                            securityAmount={securityAmount}
                            deliveryCharges={deliveryCharges}
                            monthlyRentTotal={monthlyRentTotal}
                            totalGST={totalGST}
                            totalOneTime={totalOneTime}
                            payToday={payToday}
                            savedAmount={savedAmount}
                            onCheckout={() => { }} // Already on checkout flow
                            btnText="Continue for KYC process"
                            showButton={false}
                        />
                        {/* Note: The OrderSummary component has "Continue to checkout" button by default, 
                             but here the button is actually on the LEFT side according to the screenshot?
                             Wait, the screenshot has "Continue to checkout" hidden or different in the summary card?
                             
                             Looking at the screenshot:
                             Right side card has "Total Amount to Pay Today", Yellow Disclaimer, "You saved..." box.
                             It DOES NOT have the "Continue to checkout" button inside the card at the bottom.
                             Instead, the main CTA "Continue for KYC process" is on the LEFT side below addresses.
                             
                             So `OrderSummary` needs to optionally HIDE the button.
                         */}
                    </div>
                </div>

                <AddressModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveAddress}
                    initialData={editingAddress}
                />
            </div>
        </div>
    );
}
