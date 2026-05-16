'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Spinner, Button } from '@heroui/react';
import {
    FloppyDisk, CheckCircle, Plus, Trash,
    Question, ChatText, TextT, Eye
} from '@phosphor-icons/react';
import ImageUploader from '@/components/ImageUploader';

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
            className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
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
            className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all resize-none"
        />
    </div>
);

const Card = ({ icon, title, children, accent = 'indigo' }) => {
    const accents = {
        indigo: 'from-indigo-50 to-white dark:from-indigo-950/20 dark:to-slate-900 border-indigo-100 dark:border-indigo-900/30',
        sky: 'from-sky-50 to-white dark:from-sky-950/20 dark:to-slate-900 border-sky-100 dark:border-sky-900/30',
        amber: 'from-amber-50 to-white dark:from-amber-950/20 dark:to-slate-900 border-amber-100 dark:border-amber-900/30',
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
    bannerImage: '', bannerTitle: 'FAQs',
    faqTitle: 'Everything you need to know about renting with IndianRenters.com',
    faqSubtitle: 'Welcome to FAQ!',
    faqItems: [
        { question: 'What is the minimum rental period?', answer: 'The minimum rental period for our products is 1 month.' },
    ],
    metaTitle: '', metaDescription: '', publishStatus: 'published',
};

export default function FaqCMSPage() {
    const [data, setData] = useState(DEFAULTS);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    const set = (k, v) => setData(p => ({ ...p, [k]: v }));

    const load = useCallback(async () => {
        const fetchUrl = `${API}/api/cms/faq?t=${Date.now()}`;
        try {
            setErrorMsg(null);
            // Use window.fetch to bypass Next.js fetch cache patches that cause TypeErrors in Turbopack
            const res = await window.fetch(fetchUrl);
            if (res.ok) {
                const json = await res.json();
                const mergedData = { ...DEFAULTS, ...json };
                if (json.faqItems) {
                    mergedData.faqItems = json.faqItems;
                }
                setData(mergedData);
            } else {
                setErrorMsg(`Failed to fetch CMS FAQ data: ${res.status} ${res.statusText}. URL: ${fetchUrl}`);
                console.warn("Failed to fetch CMS FAQ data:", res.status, res.statusText);
            }
        } catch (err) {
            setErrorMsg(`Error loading FAQ data: ${err.message}. URL: ${fetchUrl}`);
            console.warn("Error loading FAQ data:", err);
        }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { load(); }, [load]);

    const save = async () => {
        try {
            setSaving(true);
            const res = await window.fetch(`${API}/api/cms/faq`, {
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

    const addItem = () => {
        set('faqItems', [...(data.faqItems || []), { question: '', answer: '' }]);
    };

    const removeItem = (i) => {
        const next = [...data.faqItems];
        next.splice(i, 1);
        set('faqItems', next);
    };

    const updateItem = (i, k, v) => {
        const next = [...data.faqItems];
        next[i] = { ...next[i], [k]: v };
        set('faqItems', next);
    };

    if (loading) return (
        <div className="flex items-center justify-center gap-3 py-24 text-slate-400">
            <Spinner size="sm" color="secondary" /> Loading FAQ CMS…
        </div>
    );

    return (
        <div className="space-y-6 pb-16">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        ❓ FAQ <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">CMS</span>
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Manage frequently asked questions — changes go live instantly.</p>
                    {errorMsg && (
                        <div className="mt-2 p-3 bg-red-100 border border-red-200 text-red-600 rounded-lg text-sm font-semibold">
                            ⚠️ {errorMsg}
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    {saved && (
                        <span className="flex items-center gap-1.5 text-emerald-600 text-sm font-semibold bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5">
                            <CheckCircle size={14} weight="fill" /> Saved!
                        </span>
                    )}
                    <button onClick={save} disabled={saving}
                        className="flex items-center gap-2 h-10 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold text-sm shadow-lg shadow-indigo-500/20 transition-all">
                        {saving ? <Spinner size="sm" color="white" /> : <FloppyDisk size={15} weight="bold" />} Save FAQ
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                <div className="xl:col-span-1 space-y-5">
                    <Card icon="🖼️" title="Banner & SEO" accent="indigo">
                        <TextInput label="Banner Title" value={data.bannerTitle} onChange={v => set('bannerTitle', v)} placeholder="FAQs" />
                        <ImageUploader label="Banner Image" existingUrl={data.bannerImage} onUpload={url => set('bannerImage', url)} />
                        <hr className="border-slate-100 dark:border-slate-800" />
                        <TextInput label="Meta Title" value={data.metaTitle} onChange={v => set('metaTitle', v)} placeholder="FAQ – IndianRentals" />
                        <TextArea label="Meta Description" value={data.metaDescription} onChange={v => set('metaDescription', v)} placeholder="Short SEO description..." rows={2} />
                    </Card>

                    <Card icon="📝" title="Header Text" accent="sky">
                        <TextInput label="Small Heading" value={data.faqSubtitle} onChange={v => set('faqSubtitle', v)} placeholder="Welcome to FAQ!" />
                        <TextArea label="Main Heading" value={data.faqTitle} onChange={v => set('faqTitle', v)} placeholder="Everything you need to know..." rows={3} />
                    </Card>
                </div>

                <div className="xl:col-span-2 space-y-5">
                    <Card icon="💬" title="Question & Answer Items" accent="amber">
                        <div className="space-y-4">
                            {(data.faqItems || []).map((item, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3 relative group">
                                    <button onClick={() => removeItem(i)}
                                        className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all">
                                        <Trash size={16} />
                                    </button>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-600 flex items-center justify-center text-[10px] font-bold">{i + 1}</span>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">FAQ Item</p>
                                    </div>
                                    <TextInput label="Question" value={item.question} onChange={v => updateItem(i, 'question', v)} placeholder="What is..." />
                                    <TextArea label="Answer" value={item.answer} onChange={v => updateItem(i, 'answer', v)} placeholder="The answer is..." rows={2} />
                                </motion.div>
                            ))}

                            <button onClick={addItem}
                                className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center gap-2 text-slate-400 hover:text-indigo-500 hover:border-indigo-500 transition-all">
                                <Plus size={18} /> Add FAQ Item
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
