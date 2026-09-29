'use client';
import toast from 'react-hot-toast';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Spinner, Button } from '@heroui/react';
import {
    FloppyDisk, CheckCircle, Plus, Trash,
    Layout, ListChecks, Star, Image as PhosphorImage,
    TextT, BookOpen, Eye
} from '@phosphor-icons/react';
import ImageUploader from '@/components/ImageUploader';
import BannerAppearanceControls from '@/components/BannerAppearanceControls';
import Toggle from '@/components/Toggle';
import RentalStepsEditor from '@/components/RentalStepsEditor';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

// ── Reusable components ───────────────────────────────────────────────────────
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
        emerald:'from-emerald-50 to-white dark:from-emerald-950/20 dark:to-slate-900 border-emerald-100 dark:border-emerald-900/30',
        amber:  'from-amber-50 to-white dark:from-amber-950/20 dark:to-slate-900 border-amber-100 dark:border-amber-900/30',
    };
    return (
        <div className={`rounded-2xl border bg-gradient-to-br ${accents[accent] || accents.indigo} p-6 space-y-5 shadow-sm`}>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">{title}</h3>
            {children}
        </div>
    );
};

// ── DEFAULTS ─────────────────────────────────────────────────────────────────
const DEFAULTS = {
    bannerImage: 'https://res.cloudinary.com/dpu9ikeqe/image/upload/v1787305860/9f8d4d5a95b5ff564196928771ca74a7229121d9_jmb6yw.png', bannerTitle: 'Rental Process',
    rentalFeaturesTitle: 'Features',
    rentalFeaturesSubtitle: 'Rent with confidence. Every product comes with transparent pricing, flexible terms, and reliable support—so you focus on your work, not equipment hassles.',
    rentalFeatures: [
        { title: 'Quick Support', description: 'Get expert help fast', image: '' },
        { title: 'Rental Flexibility', description: 'Choose your rental plan', image: '' },
        { title: 'Fast Delivery', description: 'We deliver quickly across India', image: '' },
        { title: 'No Hidden Charges', description: 'One transparent invoice', image: '' },
    ],
    rentalProcessEnabled: true,
    rentalProcessTitle: "Rental Process",
    rentalProcessSubtitle: "Choose, secure, receive, and create with zero hassle. No installation, no configuration, no delay.",
    rentalProcessSteps: [
        { title: "Choose Your Tech", description: "Explore the catalogue and choose the equipment and rental duration you need.", icon: "Laptop", highlight: true, link: "" },
        { title: "Complete KYC", description: "Add your delivery details and submit the documents requested during verification.", icon: "IdentificationCard", highlight: false, link: "" },
        { title: "Secure Your Order", description: "Review your rental, deposit and payment details before confirming your order.", icon: "ShoppingCart", highlight: false, link: "" },
        { title: "Receive & Create", description: "Receive your equipment at the confirmed delivery address and get started.", icon: "Package", highlight: false, link: "" },
    ],
    metaTitle: '', metaDescription: '', publishStatus: 'published',
};

export default function RentalProcessCMSPage() {
    const [data, setData] = useState(DEFAULTS);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const set = (k, v) => setData(p => ({ ...p, [k]: v }));

    const load = useCallback(async () => {
        try {
            const res = await window.fetch(`${API}/api/cms/rental-process/draft`, { headers: { Authorization: `Bearer ${getToken()}` }, cache: 'no-store' });
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
            const res = await window.fetch(`${API}/api/cms/rental-process`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to save');
            setSaved(true);
            window.dispatchEvent(new CustomEvent('cms:draft-saved', { detail: { page: 'rental-process' } }));
            setTimeout(() => setSaved(false), 3000);
        } catch (e) { toast.error(e.message); }
        finally { setSaving(false); }
    };

    const addFeature = () => {
        set('rentalFeatures', [...(data.rentalFeatures || []), { title: '', description: '', image: '' }]);
    };

    const removeFeature = (i) => {
        const next = [...data.rentalFeatures];
        next.splice(i, 1);
        set('rentalFeatures', next);
    };

    const updateFeature = (i, k, v) => {
        const next = [...data.rentalFeatures];
        next[i] = { ...next[i], [k]: v };
        set('rentalFeatures', next);
    };

    if (loading) return (
        <div className="flex items-center justify-center gap-3 py-24 text-slate-400">
            <Spinner size="sm" color="secondary" /> Loading Rental Process CMS…
        </div>
    );

    return (
        <div className="space-y-6 pb-16">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        Rental Process <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">CMS</span>
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Manage process page banners and feature grids.</p>
                </div>
                <div className="flex items-center gap-3">
                    {saved && (
                        <span className="flex items-center gap-1.5 text-emerald-600 text-sm font-semibold bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5">
                            <CheckCircle size={14} weight="fill" /> Saved!
                        </span>
                    )}
                    <button onClick={save} disabled={saving}
                        className="flex items-center gap-2 h-10 px-5 rounded-xl !bg-indigo-600 hover:!bg-indigo-700 disabled:opacity-60 text-white font-semibold text-sm shadow-lg shadow-indigo-500/20 transition-all">
                        {saving ? <Spinner size="sm" color="white" /> : <FloppyDisk size={15} weight="bold" />} Save draft
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                <div className="xl:col-span-1 space-y-5">
                    <Card title="Banner & SEO" accent="indigo">
                        <TextInput label="Banner Title" value={data.bannerTitle} onChange={v => set('bannerTitle', v)} placeholder="Rental Process" />
                        <BannerAppearanceControls data={data} set={set} defaultColor="#f9fafb" />
                        <ImageUploader label="Banner Image" existingUrl={data.bannerImage} onUpload={url => set('bannerImage', url)} />
                        <hr className="border-slate-100 dark:border-slate-800" />
                        <TextInput label="Meta Title" value={data.metaTitle} onChange={v => set('metaTitle', v)} placeholder="Rental Process – IndianRentals" />
                        <TextArea label="Meta Description" value={data.metaDescription} onChange={v => set('metaDescription', v)} placeholder="Short SEO description..." rows={2} />
                    </Card>

                    <Card title="Features Header" accent="emerald">
                        <TextInput label="Features Heading" value={data.rentalFeaturesTitle} onChange={v => set('rentalFeaturesTitle', v)} placeholder="Features" />
                        <TextArea label="Features Description" value={data.rentalFeaturesSubtitle} onChange={v => set('rentalFeaturesSubtitle', v)} placeholder="Rent with confidence..." rows={3} />
                    </Card>
                </div>

                <div className="xl:col-span-2 space-y-5">
                    <Card title="Rental Flow Steps" accent="indigo">
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 mb-4 space-y-4">
                            <div className="flex justify-between items-center">
                                <Label>Section Visibility</Label>
                                <Toggle isSelected={data.rentalProcessEnabled} onValueChange={v => set('rentalProcessEnabled', v)} size="sm" />
                            </div>
                            <TextInput label="Section Title" value={data.rentalProcessTitle} onChange={v => set('rentalProcessTitle', v)} />
                            <TextArea label="Section Subtitle" value={data.rentalProcessSubtitle} onChange={v => set('rentalProcessSubtitle', v)} rows={2} />
                        </div>

                        <RentalStepsEditor steps={data.rentalProcessSteps || []} onChange={steps => set('rentalProcessSteps', steps)} />
                    </Card>

                    <Card title="Feature Grid Items" accent="emerald">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(data.rentalFeatures || []).map((feature, i) => (
                                <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                    className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3 relative group">
                                    <button onClick={() => removeFeature(i)} aria-label={`Remove ${feature.title || `feature ${i + 1}`}`}
                                        className="absolute top-3 right-3 p-1.5 text-slate-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all">
                                        <Trash size={16} />
                                    </button>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 flex items-center justify-center text-[10px] font-bold">{i + 1}</span>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Feature Item</p>
                                    </div>
                                    <ImageUploader label="Icon/Image" existingUrl={feature.image} onUpload={url => updateFeature(i, 'image', url)} />
                                    <TextInput label="Title" value={feature.title} onChange={v => updateFeature(i, 'title', v)} placeholder="Feature Title" />
                                    <TextInput label="Description" value={feature.description} onChange={v => updateFeature(i, 'description', v)} placeholder="Short description" />
                                </motion.div>
                            ))}

                            <button onClick={addFeature}
                                className="col-span-1 md:col-span-2 py-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-indigo-500 hover:border-indigo-500 transition-all">
                                <Plus size={24} />
                                <span className="font-semibold">Add Feature Item</span>
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
