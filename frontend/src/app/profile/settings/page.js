'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { PiUserCircleFill, PiSpinnerGap, PiArrowLeft } from 'react-icons/pi';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import InfoIcon from '../../../components/common/InfoIcon';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const getToken = () => {
    if (typeof window === 'undefined') return null;
    try {
        const userInfo = localStorage.getItem('userInfo');
        return userInfo ? JSON.parse(userInfo).token : null;
    } catch { return null; }
};

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

const Field = ({ label, required, children, message }) => (
    <div className="flex w-full max-w-[347px] flex-col gap-1">
        <div className="flex w-full items-start gap-px">
            <p className="text-[12px] font-semibold leading-4 tracking-[-0.4px] text-[#545454]">{label}</p>
            {required && <p className="text-[12px] font-medium leading-4 tracking-[-0.4px] text-[#ed2115]">*</p>}
        </div>
        <div className="flex w-full flex-col gap-[2px]">
            {children}
            {message !== undefined && (
                <p className="text-[10px] font-normal leading-4 tracking-[-0.4px] text-[#333333]">{message}</p>
            )}
        </div>
    </div>
);

const inputBox = 'h-[39px] w-full rounded-[8px] border border-[#e2e2e2] pl-[7px] pr-[8px] text-[12px] font-medium leading-4 tracking-[-0.4px] placeholder:text-[#afafaf] focus:outline-none';

const BackArrowIcon = () => (
    <svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const ShieldIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 1.16669L2.33334 3.50002V6.41669C2.33334 9.38585 4.3225 12.1334 7 12.8334C9.6775 12.1334 11.6667 9.38585 11.6667 6.41669V3.50002L7 1.16669Z" stroke="#757575" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const SaveArrowIcon = () => (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.54166 8.5H13.4583M13.4583 8.5L9.20833 4.25M13.4583 8.5L9.20833 12.75" stroke="#1F1F1F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export default function ProfileSettingsPage() {
    const router = useRouter();
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
        <>
            {/* Hidden file input shared by both views */}
            <input
                type="file"
                ref={fileInputRef}
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={handleAvatarChange}
            />

            {/* ── DESKTOP VIEW (Original, untouched) ── */}
            <div className="hidden lg:flex flex-col items-start gap-3">
                <div className="flex items-center gap-3">
                    <h1 className="text-[27px] font-semibold leading-[35px] tracking-[-0.8px] text-[#333333]">Profile Settings</h1>
                </div>

                <div className="h-px w-full bg-[#afafaf]" />

                <div className="flex items-center gap-[5px] rounded-[6px] border border-[#e2e2e2] bg-[#f6f6f6] px-[10px] py-[5px]">
                    <InfoIcon />
                    <p className="text-[12px] font-semibold leading-4 tracking-[-0.4px] text-[#757575]">
                        In accordance with our privacy policy, your information is safe with us and will never be sold to third parties
                    </p>
                    <button className="text-[12px] font-bold leading-4 tracking-[-0.4px] text-[#757575] underline">Learn More</button>
                </div>

                <div className="flex items-center gap-4 px-3 py-[14px]">
                    <div className="size-[70px] shrink-0 overflow-hidden rounded-full border-[0.986px] border-[#e2e2e2] text-[#545454]">
                        {avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={avatar} alt="Your profile" className="size-full object-cover" />
                        ) : (
                            <PiUserCircleFill className="size-full" />
                        )}
                    </div>
                    <div className="flex items-center gap-5">
                        <span className="text-[16px] font-semibold leading-[23px] tracking-[-0.4px] text-[#757575]">Change Profile Pic</span>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="flex items-center justify-center rounded-[28px] bg-[#333333] py-1 pl-3 pr-2 text-[14px] font-medium leading-5 tracking-[-0.4px] text-white disabled:opacity-60"
                        >
                            {uploading ? 'Uploading…' : 'Update'}
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center gap-3 py-6 text-[#757575]">
                        <PiSpinnerGap className="animate-spin" size={22} />
                        <span className="text-[14px] font-medium leading-5 tracking-[-0.4px]">Loading your profile…</span>
                    </div>
                ) : (
                    <>
                        <Field label="Full Name" required>
                            <input
                                type="text"
                                value={form.name}
                                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                                placeholder="Your full name"
                                className={`${inputBox} bg-white text-[#333333]`}
                            />
                        </Field>

                        <Field label="Contact Number">
                            <input
                                type="text"
                                value={form.phone}
                                disabled
                                placeholder="+91-99XXXXXX9"
                                className={`${inputBox} cursor-not-allowed bg-[#eeeeee] text-[#afafaf]`}
                            />
                        </Field>

                        <Field label="Email" required message={msg}>
                            <input
                                type="email"
                                value={form.email}
                                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                                placeholder="Enter your email"
                                className={`${inputBox} bg-white text-[#333333]`}
                            />
                        </Field>

                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="btn-primary h-[35px] px-5 text-[16px] leading-[23px] tracking-[-0.4px] text-[#1f1f1f] disabled:opacity-60"
                        >
                            {saving ? 'Saving…' : 'Save Changes'}
                        </button>
                    </>
                )}
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
                        Profile Settings
                    </h1>
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-[#e2e2e2]" />

                {/* Privacy note */}
                <div className="bg-[#f6f6f6] border border-[#e2e2e2] rounded-[6px] px-[10px] py-[5px] flex items-center justify-start gap-[8px] w-full">
                    <div className="shrink-0">
                        <ShieldIcon />
                    </div>
                    <p className="text-[8px] font-semibold leading-[14px] tracking-[-0.4px] text-[#757575]">
                        In accordance with our privacy policy, your information is safe with us and will never be sold to third parties
                    </p>
                </div>

                {/* Avatar change section */}
                <div className="flex items-center gap-[16px] px-[12px] py-[14px]">
                    <div className="size-[70px] shrink-0 overflow-hidden rounded-full border-[0.986px] border-[#e2e2e2] text-[#545454]">
                        {avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={avatar} alt="Your profile" className="size-full object-cover" />
                        ) : (
                            <PiUserCircleFill className="size-full" />
                        )}
                    </div>
                    <div className="flex items-center gap-[20px]">
                        <span className="text-[16px] font-semibold leading-[23px] tracking-[-0.4px] text-[#757575]">
                            Change Profile Pic
                        </span>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="bg-[#333333] text-white text-[14px] font-medium tracking-[-0.4px] leading-[20px] pl-[12px] pr-[8px] py-[4px] rounded-[28px] shrink-0 disabled:opacity-60"
                        >
                            {uploading ? 'Uploading…' : 'Update'}
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center gap-3 py-6 text-[#757575]">
                        <PiSpinnerGap className="animate-spin" size={22} />
                        <span className="text-[14px] font-medium leading-5 tracking-[-0.4px]">Loading your profile…</span>
                    </div>
                ) : (
                    <div className="flex flex-col gap-[12px] w-full">
                        {/* Full Name */}
                        <div className="flex flex-col gap-[4px] w-full">
                            <div className="flex gap-px items-start text-[12px] tracking-[-0.4px] leading-[16px]">
                                <span className="font-semibold text-[#545454]">Full Name</span>
                                <span className="font-medium text-[#ed2115]">*</span>
                            </div>
                            <div className="bg-white border border-[#e2e2e2] h-[39px] rounded-[8px] px-[7px] flex items-center w-full">
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                                    placeholder="Your full name"
                                    className="w-full text-[12px] font-medium text-[#333333] bg-transparent focus:outline-none placeholder:text-[#afafaf]"
                                />
                            </div>
                        </div>

                        {/* Contact Number */}
                        <div className="flex flex-col gap-[4px] w-full">
                            <div className="flex gap-px items-start text-[12px] tracking-[-0.4px] leading-[16px]">
                                <span className="font-semibold text-[#545454]">Contact Number</span>
                            </div>
                            <div className="bg-[#eee] border border-[#e2e2e2] h-[39px] rounded-[8px] px-[7px] flex items-center w-full">
                                <input
                                    type="text"
                                    value={form.phone}
                                    disabled
                                    placeholder="+91-99XXXXXX9"
                                    className="w-full text-[12px] font-medium text-[#afafaf] bg-transparent focus:outline-none cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-[4px] w-full">
                            <div className="flex gap-px items-start text-[12px] tracking-[-0.4px] leading-[16px]">
                                <span className="font-semibold text-[#545454]">Email</span>
                                <span className="font-medium text-[#ed2115]">*</span>
                            </div>
                            <div className="bg-white border border-[#e2e2e2] h-[39px] rounded-[8px] px-[7px] flex items-center w-full">
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                                    placeholder="Enter your email"
                                    className="w-full text-[12px] font-medium text-[#333333] bg-transparent focus:outline-none placeholder:text-[#afafaf]"
                                />
                            </div>
                            {msg && (
                                <p className="text-[10px] font-normal leading-[16px] tracking-[-0.4px] text-[#333333]">
                                    {msg}
                                </p>
                            )}
                        </div>

                        {/* Save Changes Button — Yellow gradient pill with arrow */}
                        <div className="mt-1">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="bg-gradient-to-b from-[#ffcf46] to-[#ffb91b] border-b border-[#f08c00] rounded-[28px] px-[20px] py-[6px] flex items-center justify-center gap-[2px] text-[12px] font-medium text-[#1f1f1f] tracking-[-0.4px] leading-[18px] disabled:opacity-60 shadow-sm"
                            >
                                <span>{saving ? 'Saving…' : 'Save Changes'}</span>
                                <SaveArrowIcon />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

