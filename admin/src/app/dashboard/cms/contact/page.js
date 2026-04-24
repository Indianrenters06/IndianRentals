'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Spinner, Button } from '@heroui/react';
import {
    FloppyDisk, CheckCircle, Phone, EnvelopeSimple,
    MapPin, WhatsappLogo, Globe, Info, TextT
} from '@phosphor-icons/react';
import ImageUploader from '@/components/ImageUploader';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

// ── Reusable components ───────────────────────────────────────────────────────
const Label = ({ children }) => (
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{children}</label>
);

const TextInput = ({ label, value, onChange, placeholder, icon }) => (
    <div>
        {label && <Label>{label}</Label>}
        <div className="relative">
            {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>}
            <input
                type="text"
                value={value || ''}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className={`w-full h-10 ${icon ? 'pl-10' : 'px-3'} rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all`}
            />
        </div>
    </div>
);

const TextArea = ({ label, value, onChange, placeholder, rows = 3 }) => (
    <div>
        {label && <Label>{label}</Label>}
        <textarea
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all resize-none"
        />
    </div>
);

const Card = ({ icon, title, children, accent = 'indigo' }) => {
    const accents = {
        indigo: 'from-indigo-50 to-white dark:from-indigo-950/20 dark:to-slate-900 border-indigo-100 dark:border-indigo-900/30',
        sky:    'from-sky-50 to-white dark:from-sky-950/20 dark:to-slate-900 border-sky-100 dark:border-sky-900/30',
        emerald:'from-emerald-50 to-white dark:from-emerald-950/20 dark:to-slate-900 border-emerald-100 dark:border-emerald-900/30',
    };
    return (
        <div className={`rounded-2xl border bg-gradient-to-br ${accents[accent] || accents.indigo} p-6 space-y-5 shadow-sm`}>
            <div className="flex items-center gap-2.5">
                <span className="text-xl">{icon}</span>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">{title}</h3>
            </div>
            {children}
        </div>
    );
};

// ── DEFAULTS ─────────────────────────────────────────────────────────────────
const DEFAULTS = {
    bannerImage: '', bannerTitle: 'Contact Us',
    contactTitle: 'Contact Us',
    contactSubtitle: 'Have questions? We are here to help.',
    contactEmail: 'support@indianrentals.com',
    contactPhone: '+91 1234567890',
    contactAddress: 'New Delhi, India',
    contactWhatsApp: '+91 1234567890',
    contactMapUrl: '',
    metaTitle: '', metaDescription: '', publishStatus: 'published',
};

export default function ContactCMSPage() {
    const [data, setData] = useState(DEFAULTS);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const set = (k, v) => setData(p => ({ ...p, [k]: v }));

    const load = useCallback(async () => {
        try {
            const res = await fetch(`${API}/api/cms/contact`);
            if (res.ok) {
                const json = await res.json();
                setData({ ...DEFAULTS, ...json });
            }
        } catch { }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { load(); }, [load]);

    const save = async () => {
        try {
            setSaving(true);
            const res = await fetch(`${API}/api/cms/contact`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to save');
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (e) { alert(e.message); }
        finally { setSaving(false); }
    };

    if (loading) return (
        <div className="flex items-center justify-center gap-3 py-24 text-slate-400">
            <Spinner size="sm" color="secondary" /> Loading Contact CMS…
        </div>
    );

    return (
        <div className="space-y-6 pb-16">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        📞 Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">CMS</span>
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Manage contact information and map settings.</p>
                </div>
                <div className="flex items-center gap-3">
                    {saved && (
                        <span className="flex items-center gap-1.5 text-emerald-600 text-sm font-semibold bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5">
                            <CheckCircle size={14} weight="fill" /> Saved!
                        </span>
                    )}
                    <button onClick={save} disabled={saving}
                        className="flex items-center gap-2 h-10 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold text-sm shadow-lg shadow-indigo-500/20 transition-all">
                        {saving ? <Spinner size="sm" color="white" /> : <FloppyDisk size={15} weight="bold" />} Save Contact
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                <div className="space-y-5">
                    <Card icon="🖼️" title="Banner & Header" accent="indigo">
                        <TextInput label="Banner Title" value={data.bannerTitle} onChange={v => set('bannerTitle', v)} placeholder="Contact Us" />
                        <ImageUploader label="Banner Image" existingUrl={data.bannerImage} onUpload={url => set('bannerImage', url)} />
                        <hr className="border-slate-100 dark:border-slate-800" />
                        <TextInput label="Main Heading" value={data.contactTitle} onChange={v => set('contactTitle', v)} placeholder="Contact Us" />
                        <TextArea label="Sub-heading" value={data.contactSubtitle} onChange={v => set('contactSubtitle', v)} placeholder="Have questions?..." rows={2} />
                    </Card>

                    <Card icon="🔍" title="SEO Settings" accent="sky">
                        <TextInput label="Meta Title" value={data.metaTitle} onChange={v => set('metaTitle', v)} placeholder="Contact – IndianRentals" />
                        <TextArea label="Meta Description" value={data.metaDescription} onChange={v => set('metaDescription', v)} placeholder="Short SEO description..." rows={3} />
                    </Card>
                </div>

                <div className="space-y-5">
                    <Card icon="📞" title="Contact Details" accent="emerald">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TextInput label="Email Address" value={data.contactEmail} onChange={v => set('contactEmail', v)} placeholder="support@..." icon={<EnvelopeSimple size={16} />} />
                            <TextInput label="Phone Number" value={data.contactPhone} onChange={v => set('contactPhone', v)} placeholder="+91 ..." icon={<Phone size={16} />} />
                            <TextInput label="WhatsApp" value={data.contactWhatsApp} onChange={v => set('contactWhatsApp', v)} placeholder="+91 ..." icon={<WhatsappLogo size={16} />} />
                            <TextInput label="Map URL (Google Maps)" value={data.contactMapUrl} onChange={v => set('contactMapUrl', v)} placeholder="https://goo.gl/maps/..." icon={<Globe size={16} />} />
                        </div>
                        <TextArea label="Physical Address" value={data.contactAddress} onChange={v => set('contactAddress', v)} placeholder="Full office address..." rows={3} />
                    </Card>
                </div>
            </div>
        </div>
    );
}
