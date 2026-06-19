'use client';

import React, { useState, useEffect } from 'react';
import { FaCheck } from 'react-icons/fa';
import { PiTrash, PiUserCircle, PiPencilSimple, PiPlus } from 'react-icons/pi';
import { getAddresses, addAddress, updateAddress, deleteAddress } from '../../../services/addressService';

export default function AddressesPage() {
    const [addresses, setAddresses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        name: '', addressLine: '', city: '', pincode: '', state: '', phone: ''
    });

    // Load saved addresses on mount
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
        <div className="bg-white min-h-screen rounded-2xl p-8 shadow-sm border border-gray-100">
            <h1 className="text-3xl font-medium text-gray-800 mb-8">Your Addresses</h1>
            <div className="h-px bg-gray-200 w-full mb-8"></div>

            <button
                onClick={openAdd}
                className="flex items-center justify-center transition-all active:scale-95 mb-8 group"
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
    );
}
