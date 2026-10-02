'use client';
import { API as API_BASE } from '@/services/apiConfig';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { PiUserCircleFill, PiSpinnerGap } from 'react-icons/pi';
import axios from 'axios';

import { profileTitleClassName } from '../profileTitle';

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

const inputClassName = 'min-h-12 w-full rounded-xl border border-[#c9c9c9] bg-white px-4 text-[15px] text-[#141414] outline-none transition-colors placeholder:text-[#606060] focus:border-[#141414] focus-visible:ring-2 focus-visible:ring-[#ffcf46] focus-visible:ring-offset-2';
const saveButtonClassName = 'inline-flex min-h-11 items-center justify-center rounded-full bg-[#ffcf46] px-6 text-[14px] font-semibold text-[#141414] transition-colors duration-150 hover:bg-[#f3bf35] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414] disabled:cursor-not-allowed disabled:opacity-60';

export default function ProfileSettingsPage() {
    const [form, setForm] = useState({ name: '', email: '', phone: '' });
    const [avatar, setAvatar] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
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
                setLoadError(true);
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

        if (!['image/jpeg', 'image/png'].includes(file.type)) {
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
        <section className="w-full pb-12" aria-labelledby="profile-settings-title">
            <input
                type="file"
                ref={fileInputRef}
                accept="image/png,image/jpeg"
                className="hidden"
                tabIndex={-1}
                onChange={handleAvatarChange}
            />

            <header className="border-b border-[#dedede] pb-5">
                <div>
                    <h1 id="profile-settings-title" className={profileTitleClassName}>Profile Settings</h1>
                </div>
                <p className="mt-2 max-w-[650px] text-[15px] leading-6 text-[#545454]">
                    Manage the details and photo shown on your account.
                </p>
            </header>

            <div className="max-w-[680px]">
                <div className="flex flex-wrap items-center gap-4 border-b border-[#dedede] py-7">
                    <div className="size-[72px] shrink-0 overflow-hidden rounded-full border border-[#dedede] bg-[#f6f6f6] text-[#545454]">
                        {avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={avatar} alt="Your profile photo" className="size-full object-cover" />
                        ) : (
                            <PiUserCircleFill className="size-full" aria-hidden="true" />
                        )}
                    </div>
                    <div className="min-w-[180px] flex-1">
                        <h2 className="text-[16px] font-semibold text-[#141414]">Profile photo</h2>
                        <p className="mt-1 text-[13px] leading-5 text-[#545454]">JPG or PNG, up to 10 MB.</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading || loading || loadError}
                        className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#bdbdbd] bg-white px-5 text-[14px] font-semibold text-[#141414] transition-colors duration-150 hover:bg-[#f6f6f6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {uploading ? 'Uploading…' : 'Change photo'}
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center gap-3 py-8 text-[#545454]" role="status">
                        <PiSpinnerGap className="animate-spin" size={22} aria-hidden="true" />
                        <span className="text-[14px]">Loading your profile…</span>
                    </div>
                ) : loadError ? (
                    <div className="py-8" role="alert">
                        <p className="text-[14px] leading-6 text-[#333333]">We couldn’t load your account details. Please refresh and try again.</p>
                        <button type="button" onClick={() => window.location.reload()} className="mt-4 inline-flex min-h-11 items-center rounded-full border border-[#bdbdbd] px-5 text-[14px] font-semibold text-[#141414] hover:bg-[#f6f6f6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]">Refresh page</button>
                    </div>
                ) : (
                    <form onSubmit={(event) => { event.preventDefault(); handleSave(); }} className="space-y-5 pt-7">
                        <div>
                            <label htmlFor="profile-full-name" className="mb-2 block text-[14px] font-semibold text-[#333333]">
                                Full name <span className="text-[#b12216]">*</span>
                            </label>
                            <input
                                id="profile-full-name"
                                type="text"
                                autoComplete="name"
                                required
                                value={form.name}
                                onChange={(event) => setForm((previous) => ({ ...previous, name: event.target.value }))}
                                placeholder="Your full name"
                                className={inputClassName}
                            />
                        </div>

                        <div>
                            <label htmlFor="profile-email" className="mb-2 block text-[14px] font-semibold text-[#333333]">
                                Email address <span className="text-[#b12216]">*</span>
                            </label>
                            <input
                                id="profile-email"
                                type="email"
                                autoComplete="email"
                                required
                                value={form.email}
                                onChange={(event) => setForm((previous) => ({ ...previous, email: event.target.value }))}
                                placeholder="you@example.com"
                                className={inputClassName}
                            />
                            <p className="mt-2 text-[13px] leading-5 text-[#545454]">Changing your email will require verification again.</p>
                        </div>

                        <div>
                            <label htmlFor="profile-phone" className="mb-2 block text-[14px] font-semibold text-[#333333]">Mobile number</label>
                            <input
                                id="profile-phone"
                                type="tel"
                                autoComplete="tel"
                                value={form.phone}
                                disabled
                                placeholder="No mobile number on this account"
                                className={`${inputClassName} cursor-not-allowed border-[#e2e2e2] bg-[#f6f6f6] text-[#545454] disabled:opacity-100`}
                            />
                            <p className="mt-2 text-[13px] leading-5 text-[#545454]">Your mobile number can’t be changed here.</p>
                        </div>

                        {msg && (
                            <p role="status" aria-live="polite" className="rounded-lg bg-[#f6f6f6] px-4 py-3 text-[14px] leading-5 text-[#333333]">
                                {msg}
                            </p>
                        )}

                        <div className="flex flex-wrap items-center gap-4 border-t border-[#dedede] pt-6">
                            <button type="submit" disabled={saving} className={saveButtonClassName}>
                                {saving ? 'Saving…' : 'Save changes'}
                            </button>
                            <p className="text-[13px] leading-5 text-[#545454]">Your updates will appear across your account.</p>
                        </div>
                    </form>
                )}

                <p className="mt-7 max-w-[650px] text-[13px] leading-5 text-[#545454]">
                    We handle your details according to our{' '}
                    <Link href="/privacy" className="font-semibold text-[#141414] underline underline-offset-4 hover:text-[#545454] focus-visible:outline-2 focus-visible:outline-[#141414]">
                        Privacy Policy
                    </Link>.
                </p>
            </div>
        </section>
    );
}
