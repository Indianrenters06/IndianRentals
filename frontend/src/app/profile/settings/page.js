'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { PiUserCircleFill, PiSpinnerGap, PiArrowLeft } from 'react-icons/pi';
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

// Figma "Input Fields" (node 23060:15019): 347 wide, 12px semibold label, 39px box.
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
        <div className="flex flex-col items-start gap-3">
            <div className="flex items-center gap-3">
                <Link href="/profile" aria-label="Back to menu" className="shrink-0 text-[#333333] lg:hidden">
                    <PiArrowLeft size={24} />
                </Link>
                <h1 className="text-[27px] font-semibold leading-[35px] tracking-[-0.8px] text-[#333333]">Profile Settings</h1>
            </div>

            {/* Divider — Figma "Line 13" */}
            <div className="h-px w-full bg-[#afafaf]" />

            {/* Privacy note — Figma "Frame 253" */}
            <div className="flex items-center gap-[5px] rounded-[6px] border border-[#e2e2e2] bg-[#f6f6f6] px-[10px] py-[5px]">
                <InfoIcon />
                <p className="text-[12px] font-semibold leading-4 tracking-[-0.4px] text-[#757575]">
                    In accordance with our privacy policy, your information is safe with us and will never be sold to third parties
                </p>
                <button className="text-[12px] font-bold leading-4 tracking-[-0.4px] text-[#757575] underline">Learn More</button>
            </div>

            {/* Avatar — Figma "Frame 255" */}
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

                    {/* Figma puts the helper/error line ("Message") under this field only. */}
                    <Field label="Email" required message={msg}>
                        <input
                            type="email"
                            value={form.email}
                            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                            placeholder="Enter your email"
                            className={`${inputBox} bg-white text-[#333333]`}
                        />
                    </Field>

                    {/* Figma "Yellow-primary-btn" */}
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
    );
}
