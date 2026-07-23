'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { PiInfo, PiUserCircleFill, PiCaretRightBold, PiSpinnerGap, PiArrowLeft } from 'react-icons/pi';
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const getToken = () => {
    if (typeof window === 'undefined') return null;
    try {
        const userInfo = localStorage.getItem('userInfo');
        return userInfo ? JSON.parse(userInfo).token : null;
    } catch { return null; }
};

// Keep the cached session in sync with the profile the user just edited, so the
// navbar (which reads localStorage) doesn't keep showing the old name/picture.
const syncStoredUser = (patch) => {
    if (typeof window === 'undefined') return;
    try {
        const stored = localStorage.getItem('userInfo');
        if (!stored) return;
        localStorage.setItem('userInfo', JSON.stringify({ ...JSON.parse(stored), ...patch }));
        window.dispatchEvent(new Event('userInfoChanged'));
    } catch (err) {
        console.error('Could not update stored user info:', err);
    }
};

export default function ProfileSettingsPage() {
    const [form, setForm] = useState({ name: '', email: '', phone: '' });
    const [avatar, setAvatar] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [msg, setMsg] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/users/profile`, {
                    headers: { Authorization: `Bearer ${getToken()}` }
                });
                const u = res.data;
                setForm({ name: u.name || '', email: u.email || '', phone: u.phone || '' });
                setAvatar(u.avatar || '');
            } catch (err) {
                console.error('Profile fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        // Reset the input so picking the same file again still fires onChange.
        e.target.value = '';
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setMsg('Please choose a JPG or PNG image.');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setMsg('Image must be smaller than 10 MB.');
            return;
        }

        try {
            setUploading(true);
            setMsg('');

            const body = new FormData();
            body.append('avatar', file);

            const res = await axios.post(`${API_BASE}/api/users/profile/avatar`, body, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });

            setAvatar(res.data.avatar);
            syncStoredUser({ avatar: res.data.avatar });
            setMsg('Profile picture updated successfully!');
            setTimeout(() => setMsg(''), 3000);
        } catch (err) {
            setMsg(err.response?.data?.message || 'Could not upload the image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        if (!form.name.trim()) {
            setMsg('Please enter your full name.');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
            setMsg('Please enter a valid email address.');
            return;
        }

        try {
            setSaving(true);
            setMsg('');
            const res = await axios.put(
                `${API_BASE}/api/users/profile`,
                { name: form.name.trim(), email: form.email.trim() },
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            setForm(p => ({ ...p, name: res.data.name, email: res.data.email }));
            syncStoredUser({ name: res.data.name, email: res.data.email });
            setMsg('Profile updated successfully!');
            setTimeout(() => setMsg(''), 3000);
        } catch (err) {
            setMsg(err.response?.data?.message || 'Failed to save. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white min-h-screen rounded-2xl p-5 lg:p-8 border border-grey-100">
            <div className="flex items-center gap-3 mb-6">
                <Link href="/profile" aria-label="Back to menu" className="lg:hidden text-grey-700 shrink-0">
                    <PiArrowLeft size={24} />
                </Link>
                <h1 className="text-3xl font-medium text-grey-700">Profile Settings</h1>
            </div>

            <div className="h-px bg-grey-200 w-full mb-6"></div>

            {/* Privacy Notice */}
            <div className="bg-grey-50 rounded-lg p-3 mb-8 flex items-center gap-2 text-xs text-grey-600">
                <PiInfo size={16} className="shrink-0" />
                <p>
                    In accordance with our privacy policy, your information is safe with us and will never be sold to third parties{' '}
                    <span className="font-semibold underline cursor-pointer">Learn More</span>
                </p>
            </div>

            {/* Profile Picture Section */}
            <div className="flex items-center gap-4 mb-10">
                <div className="w-16 h-16 lg:w-20 lg:h-20 text-grey-600 rounded-full overflow-hidden shrink-0 bg-grey-100">
                    {avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={avatar} alt="Your profile" className="w-full h-full object-cover" />
                    ) : (
                        <PiUserCircleFill className="w-full h-full" />
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-grey-600 font-medium text-sm lg:text-base">Change Profile Pic</span>
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/png,image/jpeg"
                        className="hidden"
                        onChange={handleAvatarChange}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="bg-grey-800 hover:bg-black text-white px-5 py-2 rounded-full text-sm font-medium transition-colors shrink-0 disabled:opacity-60"
                    >
                        {uploading ? 'Uploading…' : 'Update'}
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center gap-3 text-grey-400">
                    <PiSpinnerGap className="animate-spin" size={22} />
                    <span className="text-sm">Loading your profile…</span>
                </div>
            ) : (
                <>
                    {/* Form */}
                    <div className="max-w-xl space-y-6">
                        <div>
                            <label className="block text-xs font-medium text-grey-600 mb-1.5">
                                Full Name <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                                placeholder="Your full name"
                                className="w-full border border-grey-200 rounded-lg px-4 py-3 text-sm text-grey-700 focus:outline-none focus:border-grey-700 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-grey-600 mb-1.5">
                                Contact Number
                            </label>
                            <input
                                type="text"
                                value={form.phone}
                                disabled
                                placeholder="+91-99XXXXXX9"
                                className="w-full border border-grey-200 bg-grey-50 rounded-lg px-4 py-3 text-sm text-grey-500 cursor-not-allowed"
                            />
                            <p className="text-[10px] text-grey-400 mt-1">Contact number cannot be changed for security reasons.</p>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-grey-600 mb-1.5">
                                Email <span className="text-red-600">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                                    placeholder="Enter your email"
                                    className="w-full border border-grey-200 rounded-lg px-4 py-3 text-sm text-grey-700 focus:outline-none focus:border-grey-700 transition-colors"
                                />
                            </div>
                        </div>

                        {msg && (
                            <p className={`text-sm font-medium ${msg.includes('success') ? 'text-green-700' : 'text-red-600'}`}>
                                {msg}
                            </p>
                        )}

                        <div className="pt-4">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="bg-orange-300 hover:bg-orange-400 text-grey-800 font-bold py-3 px-8 rounded-full transition-colors flex items-center gap-2 shadow-sm disabled:opacity-60"
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
