'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { FaCheck } from 'react-icons/fa';
import { Plus, UserCircle, Trash } from '@phosphor-icons/react';
import { selectCartTotals } from '../../../redux/features/cartSlice';
import OrderSummary from '../../../components/OrderSummary';
import AddressModal from '../../../components/AddressModal';
import { getAddresses, addAddress, updateAddress, deleteAddress } from '../../../services/addressService';

export default function AddressPage() {
    const router = useRouter();
    const totals = useSelector(selectCartTotals);
    const { securityAmount, deliveryCharges, monthlyRentTotal, totalGST, totalOneTime, payToday, savedAmount, couponDiscount, couponCode } = totals;

    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // Load the user's saved addresses on mount
    useEffect(() => {
        let active = true;
        getAddresses()
            .then((list) => {
                if (!active) return;
                setAddresses(list);
                // Pre-select the default address if one exists
                const def = list.find(a => a.isDefault) || list[0];
                if (def) setSelectedAddressId(def.id);
            })
            .catch((err) => console.error('Failed to load addresses:', err));
        return () => { active = false; };
    }, []);

    const handleAddClick = () => {
        setEditingAddress(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (e, addr) => {
        e.stopPropagation();
        setEditingAddress(addr);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this address?')) return;
        try {
            const list = await deleteAddress(id);
            setAddresses(list);
            if (selectedAddressId === id) {
                setSelectedAddressId(list[0] ? list[0].id : null);
            }
        } catch (err) {
            console.error('Failed to delete address:', err);
            alert('Could not delete the address. Please try again.');
        }
    };

    const handleSaveAddress = async (formData) => {
        setIsSaving(true);
        try {
            let list;
            if (editingAddress) {
                list = await updateAddress(editingAddress.id, formData);
            } else {
                const before = new Set(addresses.map(a => a.id));
                list = await addAddress(formData);
                // Auto-select the newly added address
                const added = list.find(a => !before.has(a.id));
                if (added) setSelectedAddressId(added.id);
            }
            setAddresses(list);
            setIsModalOpen(false);
            setEditingAddress(null);
        } catch (err) {
            console.error('Failed to save address:', err);
            alert('Could not save the address. Please make sure you are logged in and try again.');
        } finally {
            setIsSaving(false);
        }
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
                    {/* Left Column: Addresses (Figma 23228:13247) */}
                    <div
                        className="relative flex flex-col w-full lg:w-[746px] gap-[12px] rounded-[8px] border border-dashed border-[#cbcbcb] px-[20px] py-[30px]"
                        style={{ minHeight: addresses.length > 0 ? '487px' : '200px' }}
                    >
                        {/* Header group (title + divider, then Add button — Figma gap-32) */}
                        <div className="flex flex-col gap-[32px] w-full">
                            <div className="flex flex-col gap-[12px] w-full">
                                <h1 className="font-semibold text-[27px] text-[#333] tracking-[-0.8px] leading-[35px]" style={{ fontFamily: "'Mona Sans', sans-serif" }}>
                                    Your Addresses
                                </h1>
                                <div className="w-full h-px bg-[#e2e2e2]" />
                            </div>

                            {/* Add New Address */}
                            <button
                                onClick={handleAddClick}
                                className="self-start flex items-center justify-center gap-[5px] rounded-[28px] px-[20px] py-[6px] bg-[#333] text-white transition-all active:scale-95"
                                style={{
                                    fontFamily: "'Mona Sans', sans-serif",
                                    boxShadow: '0px 1px 2px 0px hsla(0,0%,55%,0.1), 0px 3px 3px 0px hsla(0,0%,55%,0.09), 0px 8px 5px 0px hsla(0,0%,55%,0.05), 0px 14px 5px 0px hsla(0,0%,55%,0.01), 0px 21px 6px 0px hsla(0,0%,55%,0)'
                                }}
                            >
                                <Plus size={20} weight="bold" />
                                <span className="font-medium text-[16px] tracking-[-0.4px] leading-[23px]">Add New Address</span>
                            </button>
                        </div>

                        {/* Address cards */}
                        {addresses.map((addr) => {
                            const isSelected = selectedAddressId === addr.id;
                            return (
                                <div
                                    key={addr.id}
                                    onClick={() => setSelectedAddressId(addr.id)}
                                    className="relative flex items-center justify-between overflow-hidden rounded-[12px] px-[16px] py-[20px] w-full bg-white cursor-pointer transition-all hover:shadow-md shrink-0"
                                    style={{ border: isSelected ? '1.5px solid #0075ff' : '1.5px solid #e2e2e2' }}
                                >
                                    {/* Selected corner tab */}
                                    {isSelected && (
                                        <div className="absolute top-[-0.75px] right-[-0.75px] w-[35px] h-[25px] bg-[#0075ff] rounded-bl-[12px] flex items-center justify-center z-10">
                                            <FaCheck className="text-white text-[11px]" />
                                        </div>
                                    )}

                                    {/* Left: icon + details */}
                                    <div className="flex gap-[12px] items-start min-w-0">
                                        <UserCircle size={40} weight="fill" className="text-[#1f1f1f] shrink-0" />
                                        <div className="flex flex-col gap-[6px] min-w-0">
                                            <p className="font-medium text-[16px] text-[#333] tracking-[-0.4px] leading-[23px]">{addr.name}</p>
                                            <div className="flex items-center gap-[8px] text-[16px] font-medium text-[#333] tracking-[-0.4px] leading-[23px] flex-wrap">
                                                <span>{addr.addressLine}</span>
                                                <span className="w-px h-[16px] bg-[#cbcbcb]" />
                                                <span>{addr.city}</span>
                                                <span className="w-px h-[16px] bg-[#cbcbcb]" />
                                                <span>{addr.pincode}</span>
                                                <span className="w-px h-[16px] bg-[#cbcbcb]" />
                                                <span>{addr.country || 'India'}</span>
                                            </div>
                                            <p className="font-medium text-[16px] text-[#757575] tracking-[-0.4px] leading-[23px]">{addr.phone}</p>
                                        </div>
                                    </div>

                                    {/* Right: trash + edit */}
                                    <div className="flex flex-col items-center justify-center gap-[5px] shrink-0">
                                        <button
                                            onClick={(e) => handleDeleteClick(e, addr.id)}
                                            className="text-[#333] hover:text-red-500 transition-colors"
                                            title="Delete address"
                                        >
                                            <Trash size={26} />
                                        </button>
                                        <button onClick={(e) => handleEditClick(e, addr)}>
                                            <span className="font-bold text-[12px] text-[#333] underline tracking-[-0.4px] leading-[16px] whitespace-nowrap">Click to Edit</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Continue */}
                        <button
                            onClick={handleContinue}
                            disabled={!selectedAddressId}
                            className="self-start flex items-center justify-center h-[35px] rounded-full px-[20px] py-[6px] bg-[#ffcf46] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="font-medium text-[16px] text-[#1f1f1f] tracking-[-0.4px] leading-[23px]" style={{ fontFamily: "'Mona Sans', sans-serif" }}>Continue for KYC process</span>
                        </button>
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
                        isSubmitting={isSaving}
                    />
                </div>
            </div>
        </div>
    );
}
