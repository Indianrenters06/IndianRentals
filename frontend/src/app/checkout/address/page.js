'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { FaTrashAlt, FaArrowRight, FaCheck } from 'react-icons/fa';
import { Plus } from '@phosphor-icons/react';
import { BsCheckCircleFill } from 'react-icons/bs';
import { FiEdit2 } from 'react-icons/fi';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { selectCartTotals } from '../../../redux/features/cartSlice';
import OrderSummary from '../../../components/OrderSummary';
import AddressModal from '../../../components/AddressModal';

// Start with no pre-filled addresses — user must add their own
const initialAddresses = [];

export default function AddressPage() {
    const router = useRouter();
    const totals = useSelector(selectCartTotals);
    const { securityAmount, deliveryCharges, monthlyRentTotal, totalGST, totalOneTime, payToday, savedAmount, couponDiscount, couponCode } = totals;

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
        const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
        if (selectedAddress) {
            localStorage.setItem('shippingAddress', JSON.stringify(selectedAddress));
        }
        // Proceed to KYC
        router.push('/checkout/kyc');
    };


    return (
        <div className="min-h-screen bg-[hsla(0,0%,96%,1)] font-sans" style={{ opacity: 1 }}>
            {/* Header Section would be here or in layout */}
            {/* For now, we assume layout handles the main nav, but we might need the Steps Header */}

            {/* Main Content */}
            <div className="max-w-[1200px] mx-auto px-5 md:px-8 pt-5 md:pt-[48px] pb-12 md:pb-[48px]">
                {/* Breadcrumb - Mocked based on image */}
                <div className="text-xs text-gray-500 mb-6 flex items-center gap-2">
                    <Link href="/" className="hover:text-black font-medium font-sans">Product-Page</Link>
                    <span>›</span>
                    <Link href="/cart" className="hover:text-black font-medium font-sans">Cart</Link>
                    <span>›</span>
                    <span className="text-black font-medium font-sans">Address</span>
                </div>

                <div className="flex flex-col lg:flex-row items-start w-full min-h-[535px]" style={{ gap: '20px' }}>
                    {/* Left Column: Addresses */}
                    <div
                        className="relative bg-gray-50/50 flex flex-col transition-all duration-300 w-full lg:w-[746px]"
                        style={{
                            minHeight: addresses.length > 0 ? '487px' : '200px',
                            borderRadius: '8px', // rounded-md
                            border: '1px dashed hsla(0, 0%, 80%, 1)',
                            borderStyle: 'dashed',
                            padding: '30px 20px',
                            gap: '12px',
                            position: 'relative'
                        }}
                    >
                        <h1
                            className="mb-2"
                            style={{
                                fontFamily: "'Mona Sans', sans-serif",
                                fontWeight: 600,
                                fontSize: '24px',
                                lineHeight: '35px',
                                color: 'hsla(0, 0%, 20%, 1)',
                                width: '193px',
                                height: '35px'
                            }}
                        >
                            Your Addresses
                        </h1>

                        {/* Divider */}
                        <div
                            className="mb-6 font-sans"
                            style={{
                                width: '100%',
                                height: '0px',
                                borderTop: '1px solid hsla(0, 0%, 89%, 1)'
                            }}
                        ></div>

                        {/* Add Address Button */}
                        <button
                            onClick={handleAddClick}
                            className="flex items-center justify-center transition-all active:scale-95 mb-4 group"
                            style={{
                                width: '194px',
                                height: '35px',
                                opacity: 1,
                                borderRadius: '28px', // rounded-4xl
                                paddingTop: '6px',
                                paddingRight: '20px',
                                paddingBottom: '6px',
                                paddingLeft: '20px',
                                gap: '5px',
                                background: 'var(--color-grey-700, hsla(0, 0%, 20%, 1))',
                                border: 'none',
                                borderBottom: '1px solid hsla(0, 0%, 20%, 1)',
                                boxShadow: `
                                    0px 1px 2px 0px hsla(0, 0%, 55%, 0.1),
                                    0px 3px 3px 0px hsla(0, 0%, 55%, 0.09),
                                    0px 8px 5px 0px hsla(0, 0%, 55%, 0.05),
                                    0px 14px 5px 0px hsla(0, 0%, 55%, 0.01),
                                    0px 21px 6px 0px hsla(0, 0%, 55%, 0)
                                `,
                                color: '#FFFFFF',
                                fontSize: '14px',
                                fontWeight: '500',
                                fontFamily: "'Mona Sans', sans-serif",
                                cursor: 'pointer'
                            }}
                        >
                            <Plus size={18} weight="bold" />
                            <span>Add New Address</span>
                        </button>

                        {/* Address List Container */}
                        <div className="flex-1 flex flex-col gap-[12px] overflow-y-auto pr-1">
                            {addresses.map((addr) => (
                                <div
                                    key={addr.id}
                                    onClick={() => setSelectedAddressId(addr.id)}
                                    className="relative flex items-center justify-between transition-all cursor-pointer hover:shadow-md shrink-0 mb-1 w-full"
                                    style={{
                                        minHeight: '121px',
                                        background: 'hsla(0, 0%, 100%, 1)',
                                        borderRadius: '12px',
                                        border: selectedAddressId === addr.id
                                            ? '1.5px solid hsla(212, 100%, 50%, 1)'
                                            : '1.5px solid hsla(0, 0%, 89%, 1)',
                                        padding: '20px 16px',
                                        opacity: 1
                                    }}
                                >
                                    {/* Selection Mark */}
                                    {selectedAddressId === addr.id && (
                                        <div
                                            className="absolute top-0 right-0 flex items-center justify-center"
                                            style={{
                                                width: '35px',
                                                height: '25px',
                                                background: 'hsla(212, 100%, 50%, 1)',
                                                borderBottomLeftRadius: '12px',
                                                zIndex: 10
                                            }}
                                        >
                                            <FaCheck className="text-white text-[10px]" />
                                        </div>
                                    )}

                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            <UserCircleIcon className="w-8 h-8 text-gray-800" />
                                        </div>
                                        <div className="flex flex-col flex-1 min-w-0" style={{ minHeight: '81px', gap: '6px' }}>
                                            <h3 className="text-[15px] md:text-[17px] font-semibold text-gray-800 leading-tight">{addr.name}</h3>
                                            <p className="text-[12px] md:text-[14px] text-gray-700 font-medium truncate">{addr.addressLine}</p>
                                            <div className="flex items-center flex-wrap gap-x-2 text-[12px] md:text-[14px] text-gray-700 font-medium">
                                                <span>{addr.city}</span>
                                                <span className="text-gray-300">|</span>
                                                <span>{addr.pincode}</span>
                                                <span className="text-gray-300">|</span>
                                                <span>{addr.country || 'India'}</span>
                                            </div>
                                            <p className="text-gray-500 text-[12px] md:text-[14px] font-medium">{addr.phone}</p>
                                        </div>
                                    </div>

                                    {/* Actions Container */}
                                    <div
                                        className="flex flex-col items-center justify-center shrink-0"
                                        style={{
                                            width: '66px',
                                            height: '56.5px',
                                            gap: '5px'
                                        }}
                                    >
                                        <button
                                            onClick={(e) => handleDeleteClick(e, addr.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                            title="Delete address"
                                        >
                                            <FaTrashAlt size={18} />
                                        </button>
                                        <button
                                            onClick={(e) => handleEditClick(e, addr)}
                                            className="flex flex-col items-center"
                                        >
                                            <span
                                                className="text-gray-800 font-bold text-center leading-tight hover:underline cursor-pointer"
                                                style={{
                                                    fontSize: '11px',
                                                    fontFamily: 'sans-serif'
                                                }}
                                            >
                                                Click to Edit
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-auto pt-4">
                            <button
                                onClick={handleContinue}
                                className="hover:opacity-90 text-[#1D1D1F] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                style={{
                                    width: '227px',
                                    height: '35px',
                                    background: 'hsla(44, 100%, 64%, 1)',
                                    borderRadius: '9999px',
                                    padding: '6px 20px',
                                    gap: '2px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    fontFamily: 'sans-serif',
                                    border: 'none'
                                }}
                                disabled={!selectedAddressId}
                            >
                                Continue for KYC process
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Order Summary (Fixed Width: 402px) */}
                    <div className="w-full lg:w-[402px] shrink-0 lg:min-h-[535px]">
                        <OrderSummary
                            securityAmount={securityAmount}
                            deliveryCharges={deliveryCharges}
                            monthlyRentTotal={monthlyRentTotal}
                            totalGST={totalGST}
                            totalOneTime={totalOneTime}
                            payToday={payToday}
                            savedAmount={savedAmount}
                            couponDiscount={couponDiscount}
                            couponCode={couponCode}
                            onCheckout={handleContinue}
                            btnText="Continue for KYC process"
                            showButton={false}
                        />
                    </div>
                    <AddressModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSave={handleSaveAddress}
                        initialData={editingAddress}
                    />
                </div>
            </div>
        </div>
    );
}
