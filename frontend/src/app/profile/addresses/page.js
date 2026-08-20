'use client';

import React, { useState, useEffect } from 'react';
import { FaCheck } from 'react-icons/fa';
import { PiTrash, PiUserCircle, PiPencilSimple, PiPlus } from 'react-icons/pi';
import { useRouter } from 'next/navigation';
import { getAddresses, addAddress, updateAddress, deleteAddress } from '../../../services/addressService';

const BackArrowIcon = () => (
    <svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const UserAvatarIcon = () => (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="15" cy="15" r="15" fill="#EEEEEE" />
        <path d="M15 14.5C16.933 14.5 18.5 12.933 18.5 11C18.5 9.067 16.933 7.5 15 7.5C13.067 7.5 11.5 9.067 11.5 11C11.5 12.933 13.067 14.5 15 14.5ZM15 16.5C12.33 16.5 7 17.84 7 20.5V22.5H23V20.5C23 17.84 17.67 16.5 15 16.5Z" fill="#757575"/>
    </svg>
);

const CheckIcon = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export default function AddressesPage() {
    const router = useRouter();
    const [addresses, setAddresses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        name: '', addressLine: '', city: '', pincode: '', state: '', phone: ''
    });

    useEffect(() => {
        let active = true;
        getAddresses()
            .then((list) => { if (active) setAddresses(list); })
            .catch((err) => console.error('Failed to load addresses:', err));
        return () => { active = false; };
    }, []);

    const openAdd = () => {
        setForm({ name: '', addressLine: '', city: '', pincode: '', state: '', phone: '' });
        setEditId(null);
        setShowForm(true);
    };

    const openEdit = (addr) => {
        setForm({ ...addr });
        setEditId(addr.id);
        setShowForm(true);
    };

    const handleSave = async () => {
        if (!form.name || !form.addressLine) return;
        setSaving(true);
        try {
            const list = editId
                ? await updateAddress(editId, form)
                : await addAddress(form);
            setAddresses(list);
            setShowForm(false);
        } catch (err) {
            console.error('Failed to save address:', err);
            alert('Could not save the address. Please make sure you are logged in and try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const list = await deleteAddress(id);
            setAddresses(list);
        } catch (err) {
            console.error('Failed to delete address:', err);
            alert('Could not delete the address. Please try again.');
        }
    };

    const setDefault = async (id) => {
        try {
            const list = await updateAddress(id, { isDefault: true });
            setAddresses(list);
        } catch (err) {
            console.error('Failed to set default address:', err);
            alert('Could not update the default address. Please try again.');
        }
    };

    return (
        <>
            {/* ── DESKTOP VIEW (Original, untouched) ── */}
            <div className="hidden lg:block bg-white min-h-screen rounded-2xl p-8 shadow-sm border border-gray-100">
                <h1 className="text-3xl font-medium text-gray-800 mb-8">Your Addresses</h1>
                <div className="h-px bg-gray-200 w-full mb-8"></div>

                <button
                    onClick={openAdd}
                    className="flex items-center justify-center transition-all active:scale-95 mb-8 group"
                    style={{
                        width: '194px',
                        height: '35px',
                        borderRadius: '28px',
                        padding: '6px 20px',
                        gap: '5px',
                        background: 'var(--color-grey-700, hsla(0, 0%, 20%, 1))',
                        border: 'none',
                        color: '#FFFFFF',
                        fontSize: '14px',
                        fontWeight: '500',
                        fontFamily: "'Mona Sans', sans-serif",
                        cursor: 'pointer'
                    }}
                >
                    <PiPlus size={18} weight="bold" /> 
                    <span>Add New Address</span>
                </button>

                {/* Inline form */}
                {showForm && (
                    <div className="mb-8 p-6 rounded-2xl border border-indigo-200 bg-indigo-50 space-y-4">
                        <h3 className="font-semibold text-gray-800">{editId ? 'Edit Address' : 'New Address'}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { label: 'Full Name', key: 'name' },
                                { label: 'Phone', key: 'phone' },
                                { label: 'Address Line', key: 'addressLine' },
                                { label: 'City', key: 'city' },
                                { label: 'State', key: 'state' },
                                { label: 'Pincode', key: 'pincode' },
                            ].map(({ label, key }) => (
                                <div key={key}>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                                    <input
                                        type="text"
                                        value={form[key]}
                                        onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="bg-[#333] hover:bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? 'Saving…' : 'Save Address'}
                            </button>
                            <button
                                onClick={() => setShowForm(false)}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2.5 rounded-full text-sm font-medium transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Empty state */}
                {addresses.length === 0 && !showForm && (
                    <div className="text-center py-16 text-gray-400">
                        <PiUserCircle size={52} className="mx-auto mb-3 opacity-30" />
                        <p className="text-sm font-medium">No addresses saved yet.</p>
                        <p className="text-xs mt-1">Click "Add New Address" to get started.</p>
                    </div>
                )}

                {/* Address list */}
                <div className="space-y-6">
                    {addresses.map((addr) => (
                        <div
                            key={addr.id}
                            className={`relative p-6 rounded-2xl border transition-all ${addr.isDefault
                                    ? 'border-blue-500 bg-white shadow-[0_0_0_1px_rgba(59,130,246,1)]'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                }`}
                        >
                            {addr.isDefault && (
                                <div className="absolute top-0 right-0 bg-blue-500 text-white p-1.5 rounded-bl-xl rounded-tr-xl">
                                    <FaCheck size={12} />
                                </div>
                            )}

                            <div className="flex items-start justify-between">
                                <div className="flex gap-4">
                                    <div className="mt-1 text-gray-700">
                                        <PiUserCircle size={40} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800 mb-1">{addr.name}</h3>
                                        <p className="text-gray-600 mb-1 text-sm">
                                            {addr.addressLine} | {addr.city} | {addr.pincode} | {addr.state}
                                        </p>
                                        <p className="text-gray-500 text-sm font-medium">{addr.phone}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {!addr.isDefault && (
                                        <button
                                            onClick={() => setDefault(addr.id)}
                                            className="text-xs text-blue-500 border border-blue-200 hover:bg-blue-50 px-3 py-1 rounded-full transition-colors"
                                        >
                                            Set Default
                                        </button>
                                    )}
                                    <button
                                        onClick={() => openEdit(addr)}
                                        className="text-gray-500 hover:text-blue-500 transition-colors"
                                    >
                                        <PiPencilSimple size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(addr.id)}
                                        className="text-gray-500 hover:text-red-500 transition-colors"
                                    >
                                        <PiTrash size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── MOBILE VIEW (Figma exact match) ── */}
            <div className="flex lg:hidden flex-col gap-[12px] bg-white rounded-[8px] p-0 py-[10px]">
                {/* Mobile Title with Back Arrow */}
                <div className="flex items-center gap-[12px]">
                    <button 
                        onClick={() => router.back()} 
                        className="p-1 -ml-1 text-[#333333] hover:opacity-75 transition-opacity"
                        aria-label="Go back"
                    >
                        <BackArrowIcon />
                    </button>
                    <h1 className="text-[20px] font-semibold tracking-[-0.8px] text-[#333333] leading-[26px]">
                        Your Addresses
                    </h1>
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-[#e2e2e2]" />

                {/* Add New Address Button */}
                <button
                    onClick={openAdd}
                    className="bg-[#333333] text-white px-[20px] py-[6px] rounded-[28px] flex items-center justify-center gap-[5px] text-[12px] font-medium tracking-[-0.4px] leading-[18px] self-start shadow-sm hover:bg-[#222222] transition-colors"
                >
                    <PiPlus size={16} weight="bold" />
                    <span>Add New Address</span>
                </button>

                {/* Mobile Form Modal / Inline Form */}
                {showForm && (
                    <div className="p-4 rounded-[12px] border border-[#e2e2e2] bg-[#f9f9f9] flex flex-col gap-3 w-full">
                        <h3 className="font-semibold text-sm text-[#333]">{editId ? 'Edit Address' : 'New Address'}</h3>
                        <div className="flex flex-col gap-2">
                            {[
                                { label: 'Full Name', key: 'name' },
                                { label: 'Phone', key: 'phone' },
                                { label: 'Address Line', key: 'addressLine' },
                                { label: 'City', key: 'city' },
                                { label: 'State', key: 'state' },
                                { label: 'Pincode', key: 'pincode' },
                            ].map(({ label, key }) => (
                                <div key={key}>
                                    <label className="block text-[10px] font-medium text-gray-600 mb-0.5">{label}</label>
                                    <input
                                        type="text"
                                        value={form[key]}
                                        onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                                        className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-xs bg-white focus:outline-none focus:border-black"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2 pt-1">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="bg-[#333] text-white px-4 py-1.5 rounded-full text-xs font-semibold"
                            >
                                {saving ? 'Saving…' : 'Save Address'}
                            </button>
                            <button
                                onClick={() => setShowForm(false)}
                                className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded-full text-xs font-semibold"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {addresses.length === 0 && !showForm && (
                    <div className="text-center py-10 text-gray-400">
                        <PiUserCircle size={40} className="mx-auto mb-2 opacity-30" />
                        <p className="text-xs font-medium">No addresses saved yet.</p>
                    </div>
                )}

                {/* Address Cards List */}
                <div className="flex flex-col gap-[12px] w-full">
                    {addresses.map((addr) => (
                        <div
                            key={addr.id}
                            className={`relative bg-white border-[1.5px] rounded-[12px] p-[12px] px-[16px] flex items-center justify-between overflow-hidden transition-colors ${
                                addr.isDefault ? 'border-[#0075ff]' : 'border-[#e2e2e2]'
                            }`}
                        >
                            {/* Default Check Badge (Top Right) */}
                            {addr.isDefault && (
                                <div className="absolute top-0 right-0 bg-[#0075ff] rounded-bl-[12px] px-2 py-1 flex items-center justify-center">
                                    <CheckIcon />
                                </div>
                            )}

                            {/* Left Side Details */}
                            <div className="flex flex-col items-start gap-[4px]">
                                <UserAvatarIcon />
                                <div className="flex flex-col gap-[6px] items-start">
                                    <p className="text-[12px] font-medium text-[#333333] leading-[18px] tracking-[-0.4px]">
                                        {addr.name}
                                    </p>
                                    <div className="flex flex-col gap-[8px] items-start">
                                        <p className="text-[12px] font-medium text-[#333333] leading-[18px] tracking-[-0.4px]">
                                            {addr.addressLine}
                                        </p>
                                        <div className="flex gap-[8px] items-center text-[12px] font-medium text-[#333333] leading-[18px] tracking-[-0.4px]">
                                            <span>{addr.city}</span>
                                            <span className="w-px h-3 bg-[#e2e2e2] inline-block" />
                                            <span>{addr.pincode}</span>
                                            <span className="w-px h-3 bg-[#e2e2e2] inline-block" />
                                            <span>{addr.state || 'India'}</span>
                                        </div>
                                    </div>
                                    <p className="text-[12px] font-medium text-[#757575] leading-[18px] tracking-[-0.4px]">
                                        {addr.phone}
                                    </p>
                                </div>
                            </div>

                            {/* Right Side Actions */}
                            <div className="flex flex-col items-center justify-center gap-[6px]">
                                {!addr.isDefault && (
                                    <button
                                        onClick={() => setDefault(addr.id)}
                                        className="text-[10px] text-[#0075ff] font-semibold underline mb-1"
                                    >
                                        Set Default
                                    </button>
                                )}
                                <button
                                    onClick={() => openEdit(addr)}
                                    className="flex flex-col items-center gap-[2px] text-[#333333] hover:opacity-75"
                                >
                                    <PiPencilSimple size={18} />
                                    <span className="text-[8px] font-bold underline leading-[14px] tracking-[-0.4px]">
                                        Click to Edit
                                    </span>
                                </button>
                                <button
                                    onClick={() => handleDelete(addr.id)}
                                    className="text-red-500 hover:opacity-75 mt-1"
                                    title="Delete Address"
                                >
                                    <PiTrash size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

