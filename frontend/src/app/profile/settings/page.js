'use client';

import React from 'react';
import { PiInfo, PiUserCircleFill, PiCaretRightBold } from 'react-icons/pi';
import { GoChevronDown } from 'react-icons/go';

export default function ProfileSettingsPage() {
    return (
        <div className="bg-white min-h-screen rounded-2xl p-8 border border-gray-100">
            <h1 className="text-3xl font-medium text-gray-800 mb-6">Profile Settings</h1>

            <div className="h-px bg-gray-200 w-full mb-6"></div>

            {/* Privacy Notice */}
            <div className="bg-gray-100 rounded-lg p-3 mb-8 flex items-center gap-2 text-xs text-gray-600">
                <PiInfo size={16} className="flex-shrink-0" />
                <p>
                    In accordance with our privacy policy, your information is safe with us and will never be sold to third parties <span className="font-semibold underline cursor-pointer">Learn More</span>
                </p>
            </div>

            {/* Profile Picture Section */}
            <div className="flex items-center gap-6 mb-10">
                <div className="w-20 h-20 text-gray-600 rounded-full overflow-hidden">
                    <PiUserCircleFill className="w-full h-full" />
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-gray-600 font-medium">Change Profile Pic</span>
                    <button className="bg-[#333] hover:bg-black text-white px-6 py-2 rounded-full text-sm font-medium transition-colors">
                        Update
                    </button>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-xl space-y-6">
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        defaultValue="Aryton Senna"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-black transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        Contact Number
                    </label>
                    <input
                        type="text"
                        placeholder="+91-99XXXXXX9"
                        disabled
                        className="w-full border border-gray-200 bg-gray-200/50 rounded-lg px-4 py-3 text-sm text-gray-500 cursor-not-allowed"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-black transition-colors"
                        />
                        <GoChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">Message</p>
                </div>

                <div className="pt-4">
                    <button className="bg-[#facc15] hover:bg-[#fde047] text-gray-900 font-bold py-3 px-8 rounded-full transition-colors flex items-center gap-2 shadow-sm">
                        Save Changes
                        <PiCaretRightBold />
                    </button>
                </div>
            </div>
        </div>
    );
}
