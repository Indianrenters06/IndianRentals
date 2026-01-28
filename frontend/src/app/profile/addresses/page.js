'use client';

import React from 'react';
import { FaPlus, FaCheck } from 'react-icons/fa';
import { PiTrash, PiUserCircle } from 'react-icons/pi';

export default function AddressesPage() {
    const addresses = [
        {
            id: 1,
            name: 'Harshit Aggarwal',
            address: '3002/a street no. 4, Ghee Mandi | New Delhi | 110022 | India',
            phone: '+91-999XXXXXX9',
            isDefault: true
        },
        {
            id: 2,
            name: 'Leela Yadav',
            address: '3002/a street no. 4, Ghee Mandi | New Delhi | 110022 | India',
            phone: '+91-999XXXXXX9',
            isDefault: false
        }
    ];

    return (
        <div className="bg-white min-h-screen rounded-2xl p-8 shadow-sm border border-gray-100">
            <h1 className="text-3xl font-medium text-gray-800 mb-8">Your Addresses</h1>

            <div className="h-px bg-gray-200 w-full mb-8"></div>

            <button className="flex items-center gap-2 bg-[#333] hover:bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium mb-8 shadow-sm transition-colors">
                <FaPlus size={12} />
                Add New Address
            </button>

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
                                    <p className="text-gray-600 mb-1 text-sm">{addr.address}</p>
                                    <p className="text-gray-500 text-sm font-medium">{addr.phone}</p>
                                </div>
                            </div>

                            <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-red-500 transition-colors group">
                                <PiTrash size={24} className="group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] font-medium text-gray-900">Click to Edit</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
