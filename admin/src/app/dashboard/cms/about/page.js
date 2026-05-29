'use client';
import toast from 'react-hot-toast';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Spinner } from '@heroui/react';
import {
    FloppyDisk, CheckCircle, ArrowLeft, Image as PhosphorImage,
    TextT, BookOpen, Eye, Star, Handshake, Target, ChartBar, Lightning, Smiley,
} from '@phosphor-icons/react';
import ImageUploader from '@/components/ImageUploader';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

// ── Reusable field components ─────────────────────────────────────────────────
const Label = ({ children }) => (
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{children}</label>
);

const TextInput = ({ label, value, onChange, placeholder }) => (
    <div>
        {label && <Label>{label}</Label>}
        <input
            type="text"
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
        />
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
            className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all resize-none"
        />
    </div>
);

const Card = ({ icon, title, children, accent = 'indigo' }) => {
    const accents = {
        indigo: 'from-indigo-50 to-white dark:from-indigo-950/20 dark:to-slate-900 border-indigo-100 dark:border-indigo-900/30',
        amber: 'from-amber-50 to-white dark:from-amber-950/20 dark:to-slate-900 border-amber-100 dark:border-amber-900/30',
        emerald: 'from-emerald-50 to-white dark:from-emerald-950/20 dark:to-slate-900 border-emerald-100 dark:border-emerald-900/30',
        violet: 'from-violet-50 to-white dark:from-violet-950/20 dark:to-slate-900 border-violet-100 dark:border-violet-900/30',
        rose: 'from-rose-50 to-white dark:from-rose-950/20 dark:to-slate-900 border-rose-100 dark:border-rose-900/30',
        sky: 'from-sky-50 to-white dark:from-sky-950/20 dark:to-slate-900 border-sky-100 dark:border-sky-900/30',
    };
    return (
        <div className={`rounded-2xl border bg-gradient-to-br ${accents[accent] || accents.indigo} p-6 space-y-5 shadow-sm`}>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">{title}</h3>
            {children}
        </div>
    );
};

const ItemRow = ({ n, titleKey, textKey, data, set }) => (
    <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 space-y-3">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Item {n}</p>
        <TextInput label="Heading" value={data[titleKey]} onChange={v => set(titleKey, v)} placeholder={`Item ${n} heading`} />
        <TextArea label="Text" value={data[textKey]} onChange={v => set(textKey, v)} placeholder={`Item ${n} description`} rows={2} />
    </div>
);

// ── DEFAULTS ─────────────────────────────────────────────────────────────────
const DEFAULTS = {
    bannerImage: '', bannerTitle: 'About Us',
    aboutStoryTitle: 'Our Story',
    aboutStoryPara1: "From a small computer training room in 1992 to India's go-to rental partner, this journey has been about making access smarter than ownership.",
    aboutStoryPara2: 'Today, a 100+ product catalog powers startups, enterprises, and events across major cities, backed by fast delivery, clean gear, and dependable support.',
    aboutStoryImage: 'https://res.cloudinary.com/dgkckcdk8/image/upload/v1769946716/indian-rentals/fj8ptqbhppbstdd0hs4i.png',
    aboutStat1Value: '4.8/5.0', aboutStat1Label: 'Customer Satisfaction',
    aboutStat2Value: '10,000+', aboutStat2Label: 'Happy Clients',
    aboutVisionTabLabel: 'Our Vision',
    aboutVision1Title: 'Rent Anything', aboutVision1Text: "Laptops, Macs, mobiles, AV, cameras, medical and more—if it's not listed, it's sourced on request.",
    aboutVision2Title: 'Rent Anytime', aboutVision2Text: 'Tenures that fit the job: 1, 3, 6, or 12 months, with easy extensions and mid-term upgrades.',
    aboutVision3Title: 'Rent Anywhere', aboutVision3Text: 'Rapid delivery and support across major Indian cities through a reliable partner network.',
    aboutMissionTabLabel: 'Our Mission',
    aboutMission1Title: 'Awesome Service', aboutMission1Text: "Top-tier rental service with end-to-end support from order to return.",
    aboutMission2Title: 'Awesome Quality', aboutMission2Text: 'Every device is quality-tested, deep-cleaned, and verified before dispatch.',
    aboutMission3Title: 'Happy Customers', aboutMission3Text: 'Thousands of satisfied customers across India trust us for their rental needs.',
    aboutWhyTitle: 'Why Choose Us?',
    aboutWhyText: "Join thousands who've switched to the flexible, affordable way to access high-end tech.",
    aboutWhyImage: 'https://res.cloudinary.com/dgkckcdk8/image/upload/v1769961565/indian-rentals/anmpufdlxxxblkxqxpds.jpg',
    aboutWhyStat1Value: '90k+', aboutWhyStat1Label: 'Devices in Stock',
    aboutWhyStat2Value: '30k+', aboutWhyStat2Label: 'Happy Customers',
    aboutWhyStat3Value: '401+', aboutWhyStat3Label: 'Cities Covered',
    metaTitle: '', metaDescription: '', publishStatus: 'published',
};

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AboutCMSPage() {
    const [data, setData] = useState(DEFAULTS);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const set = (k, v) => setData(p => ({ ...p, [k]: v }));

    const load = useCallback(async () => {
        try {
            const res = await fetch(`${API}/api/cms/about`);
            if (res.ok) setData({ ...DEFAULTS, ...(await res.json()) });
        } catch { }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { load(); }, [load]);

    const save = async () => {
        try {
            setSaving(true);
            const res = await fetch(`${API}/api/cms/about`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error((await res.json()).message || 'Failed to save');
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (e) { toast.error(e.message); }
        finally { setSaving(false); }
    };

    if (loading) return (
        <div className="flex items-center justify-center gap-3 py-24 text-slate-400">
            <Spinner size="sm" color="secondary" /> Loading About CMS…
        </div>
    );

    return (
        <div className="space-y-6 pb-16">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        About Us <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">CMS</span>
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Edit every section of the About page — changes go live instantly.</p>
                </div>
                <div className="flex items-center gap-3">
                    {saved && (
                        <span className="flex items-center gap-1.5 text-emerald-600 text-sm font-semibold bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5">
                            <CheckCircle size={14} weight="fill" /> Saved!
                        </span>
                    )}
                    <button onClick={save} disabled={saving}
                        className="flex items-center gap-2 h-10 px-5 rounded-xl !bg-indigo-600 hover:!bg-indigo-700 disabled:opacity-60 text-white font-semibold text-sm shadow-lg shadow-indigo-500/20 transition-all">
                        {saving ? <Spinner size="sm" color="white" /> : <FloppyDisk size={15} weight="bold" />} Save All
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

                {/* ── BANNER ── */}
                <Card title="Page Banner" accent="indigo">
                    <TextInput label="Banner Title (overlay text)" value={data.bannerTitle} onChange={v => set('bannerTitle', v)} placeholder="About Us" />
                    <ImageUploader label="Banner Image" existingUrl={data.bannerImage} onUpload={url => set('bannerImage', url)} />
                    {!data.bannerImage && (
                        <TextInput label="Or paste image URL" value={data.bannerImage} onChange={v => set('bannerImage', v)} placeholder="https://res.cloudinary.com/…" />
                    )}
                    {/* Preview */}
                    {data.bannerImage && (
                        <div className="h-32 rounded-xl overflow-hidden relative"
                            style={{ backgroundImage: `url(${data.bannerImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <p className="text-white font-bold text-lg">{data.bannerTitle || 'About Us'}</p>
                            </div>
                        </div>
                    )}
                </Card>

                {/* ── SEO ── */}
                <Card title="SEO Settings" accent="sky">
                    <div>
                        <TextInput label="Meta Title" value={data.metaTitle} onChange={v => set('metaTitle', v)} placeholder="About Us – IndianRentals" />
                        <p className="text-xs text-slate-400 mt-1">{(data.metaTitle || '').length}/60</p>
                    </div>
                    <div>
                        <TextArea label="Meta Description" value={data.metaDescription} onChange={v => set('metaDescription', v)} placeholder="A short description for search engines…" rows={3} />
                        <p className="text-xs text-slate-400 mt-1">{(data.metaDescription || '').length}/160</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1.5">Google Preview</p>
                        <p className="text-blue-600 text-sm font-medium truncate">{data.metaTitle || 'About Us – IndianRentals'}</p>
                        <p className="text-green-700 text-xs">indianrenters.com/about</p>
                        <p className="text-slate-600 text-xs mt-1 line-clamp-2">{data.metaDescription || 'No description set.'}</p>
                    </div>
                </Card>

                {/* ── OUR STORY ── */}
                <Card title="Our Story Section" accent="amber">
                    <TextInput label="Section Heading" value={data.aboutStoryTitle} onChange={v => set('aboutStoryTitle', v)} placeholder="Our Story" />
                    <TextArea label="Paragraph 1" value={data.aboutStoryPara1} onChange={v => set('aboutStoryPara1', v)} placeholder="First paragraph…" rows={4} />
                    <TextArea label="Paragraph 2" value={data.aboutStoryPara2} onChange={v => set('aboutStoryPara2', v)} placeholder="Second paragraph…" rows={3} />
                    <ImageUploader label="Story Image (right side)" existingUrl={data.aboutStoryImage} onUpload={url => set('aboutStoryImage', url)} />
                    {!data.aboutStoryImage && (
                        <TextInput label="Or paste story image URL" value={data.aboutStoryImage} onChange={v => set('aboutStoryImage', v)} placeholder="https://res.cloudinary.com/…" />
                    )}
                </Card>

                {/* ── STORY STATS ── */}
                <Card title="Story Stats (2 badges)" accent="emerald">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stat 1</p>
                            <TextInput label="Value" value={data.aboutStat1Value} onChange={v => set('aboutStat1Value', v)} placeholder="4.8/5.0" />
                            <TextInput label="Label" value={data.aboutStat1Label} onChange={v => set('aboutStat1Label', v)} placeholder="Customer Satisfaction" />
                        </div>
                        <div className="space-y-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stat 2</p>
                            <TextInput label="Value" value={data.aboutStat2Value} onChange={v => set('aboutStat2Value', v)} placeholder="10,000+" />
                            <TextInput label="Label" value={data.aboutStat2Label} onChange={v => set('aboutStat2Label', v)} placeholder="Happy Clients" />
                        </div>
                    </div>
                    {/* Live mini preview */}
                    <div className="flex gap-6 mt-2">
                        {[['aboutStat1Value', 'aboutStat1Label'], ['aboutStat2Value', 'aboutStat2Label']].map(([vk, lk], i) => (
                            <div key={i} className="flex flex-col">
                                <div className="w-14 h-14 bg-orange-400 rounded-xl flex items-center justify-center text-white mb-2">
                                    {i === 0 ? <Lightning size={24} weight="fill" /> : <Smiley size={24} weight="fill" />}
                                </div>
                                <p className="font-bold text-slate-800 dark:text-slate-100 text-lg">{data[vk]}</p>
                                <p className="text-xs text-slate-500">{data[lk]}</p>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* ── VISION TAB ── */}
                <Card title="Vision Tab (3 Items)" accent="violet">
                    <TextInput label="Tab Button Label" value={data.aboutVisionTabLabel} onChange={v => set('aboutVisionTabLabel', v)} placeholder="Our Vision" />
                    <ItemRow n={1} titleKey="aboutVision1Title" textKey="aboutVision1Text" data={data} set={set} />
                    <ItemRow n={2} titleKey="aboutVision2Title" textKey="aboutVision2Text" data={data} set={set} />
                    <ItemRow n={3} titleKey="aboutVision3Title" textKey="aboutVision3Text" data={data} set={set} />
                </Card>

                {/* ── MISSION TAB ── */}
                <Card title="Mission Tab (3 Items)" accent="rose">
                    <TextInput label="Tab Button Label" value={data.aboutMissionTabLabel} onChange={v => set('aboutMissionTabLabel', v)} placeholder="Our Mission" />
                    <ItemRow n={1} titleKey="aboutMission1Title" textKey="aboutMission1Text" data={data} set={set} />
                    <ItemRow n={2} titleKey="aboutMission2Title" textKey="aboutMission2Text" data={data} set={set} />
                    <ItemRow n={3} titleKey="aboutMission3Title" textKey="aboutMission3Text" data={data} set={set} />
                </Card>

                {/* ── WHY CHOOSE US ── */}
                <div className="xl:col-span-2">
                    <Card title="Why Choose Us Section" accent="emerald">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <TextInput label="Section Heading" value={data.aboutWhyTitle} onChange={v => set('aboutWhyTitle', v)} placeholder="Why Choose Us?" />
                                <TextArea label="Section Description" value={data.aboutWhyText} onChange={v => set('aboutWhyText', v)} placeholder="Supporting paragraph…" rows={3} />
                                <ImageUploader label="Right-side Image" existingUrl={data.aboutWhyImage} onUpload={url => set('aboutWhyImage', url)} />
                                {!data.aboutWhyImage && (
                                    <TextInput label="Or paste image URL" value={data.aboutWhyImage} onChange={v => set('aboutWhyImage', v)} placeholder="https://…" />
                                )}
                            </div>
                            <div className="space-y-4">
                                <Label>3 Statistics</Label>
                                {[
                                    ['aboutWhyStat1Value', 'aboutWhyStat1Label', 'Stat 1 (e.g. Devices)'],
                                    ['aboutWhyStat2Value', 'aboutWhyStat2Label', 'Stat 2 (e.g. Customers)'],
                                    ['aboutWhyStat3Value', 'aboutWhyStat3Label', 'Stat 3 (e.g. Cities)'],
                                ].map(([vk, lk, title]) => (
                                    <div key={vk} className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{title}</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            <TextInput value={data[vk]} onChange={v => set(vk, v)} placeholder="90k+" />
                                            <TextInput value={data[lk]} onChange={v => set(lk, v)} placeholder="Devices in Stock" />
                                        </div>
                                    </div>
                                ))}
                                {/* Preview */}
                                <div className="grid grid-cols-3 gap-4 mt-2">
                                    {[
                                        [data.aboutWhyStat1Value, data.aboutWhyStat1Label],
                                        [data.aboutWhyStat2Value, data.aboutWhyStat2Label],
                                        [data.aboutWhyStat3Value, data.aboutWhyStat3Label],
                                    ].map(([v, l], i) => (
                                        <div key={i} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center">
                                            <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{v}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">{l}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Save button at bottom */}
            <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
                <button onClick={save} disabled={saving}
                    className="flex items-center gap-2 h-11 px-8 rounded-xl !bg-indigo-600 hover:!bg-indigo-700 disabled:opacity-60 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all">
                    {saving ? <Spinner size="sm" color="white" /> : <FloppyDisk size={16} weight="bold" />}
                    {saving ? 'Saving…' : 'Save All Changes'}
                </button>
            </div>
        </div>
    );
}
