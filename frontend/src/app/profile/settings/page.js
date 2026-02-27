'use client';

import React, { useState, useEffect } from 'react';
import { PiInfo, PiUserCircleFill, PiCaretRightBold, PiSpinnerGap } from 'react-icons/pi';
import { GoChevronDown } from 'react-icons/go';
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const getToken = () => {
    if (typeof window === 'undefined') return null;
    try {
        const userInfo = localStorage.getItem('userInfo');
        return userInfo ? JSON.parse(userInfo).token : null;
    } catch { return null; }
};

export default function ProfileSettingsPage() {
    const [form, setForm] = useState({ name: '', email: '', phone: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/users/profile`, {
                    headers: { Authorization: `Bearer ${getToken()}` }
                });
                const u = res.data;
                setForm({ name: u.name || '', email: u.email || '', phone: u.phone || '' });
            } catch (err) {
                console.error('Profile fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async () => {
        try {
            setSaving(true);
            setMsg('');
            await axios.put(`${API_BASE}/api/users/profile`, form, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            setMsg('Profile updated successfully!');
            setTimeout(() => setMsg(''), 3000);
        } catch (err) {
            setMsg(err.response?.data?.message || 'Failed to save. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white min-h-screen rounded-2xl p-8 border border-gray-100">
            <h1 className="text-3xl font-medium text-gray-800 mb-6">Profile Settings</h1>

            <div className="h-px bg-gray-200 w-full mb-6"></div>

            {/* Privacy Notice */}
            <div className="bg-gray-100 rounded-lg p-3 mb-8 flex items-center gap-2 text-xs text-gray-600">
                <PiInfo size={16} className="shrink-0" />
                <p>
                    In accordance with our privacy policy, your information is safe with us and will never be sold to third parties{' '}
                    <span className="font-semibold underline cursor-pointer">Learn More</span>
                </p>
            </div>

            {/* Profile Picture Section */}
            <div className="flex items-center gap-6 mb-10">
                <div className="w-20 h-20 text-gray-600 rounded-full overflow-hidden">
                    <PiUserCircleFill className="w-full h-full" />
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-gray-600 font-medium">Profile Picture</span>
                    <button className="bg-[#333] hover:bg-black text-white px-6 py-2 rounded-full text-sm font-medium transition-colors">
                        Update
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center gap-3 text-gray-400">
                    <PiSpinnerGap className="animate-spin" size={22} />
                    <span className="text-sm">Loading your profile…</span>
                </div>
            ) : (
                <>
                    {/* Form */}
                    <div className="max-w-xl space-y-6">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                                placeholder="Your full name"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-black transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                Contact Number
                            </label>
                            <input
                                type="text"
                                value={form.phone}
                                disabled
                                placeholder="+91-99XXXXXX9"
                                className="w-full border border-gray-200 bg-gray-200/50 rounded-lg px-4 py-3 text-sm text-gray-500 cursor-not-allowed"
                            />
                            <p className="text-[10px] text-gray-400 mt-1">Contact number cannot be changed for security reasons.</p>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                                    placeholder="Enter your email"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-black transition-colors"
                                />
                            </div>
                        </div>

                        {msg && (
                            <p className={`text-sm font-medium ${msg.includes('success') ? 'text-green-600' : 'text-red-500'}`}>
                                {msg}
                            </p>
                        )}

                        <div className="pt-4">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="bg-[#facc15] hover:bg-[#fde047] text-gray-900 font-bold py-3 px-8 rounded-full transition-colors flex items-center gap-2 shadow-sm disabled:opacity-60"
                            >
                                {saving ? 'Saving…' : 'Save Changes'}
                                {!saving && <PiCaretRightBold />}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
