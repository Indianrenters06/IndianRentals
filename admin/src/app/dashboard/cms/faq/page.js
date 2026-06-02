'use client';
import toast from 'react-hot-toast';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Spinner, Chip } from '@heroui/react';
import {
    FloppyDisk, CheckCircle, Plus, Trash, CaretUp, CaretDown,
    Question, MagnifyingGlass, Globe, Warning, Image as PhosphorImage
} from '@phosphor-icons/react';
import Toggle from '@/components/Toggle';
import ImageUploader from '@/components/ImageUploader';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

const DEFAULTS = {
    bannerImage: '',
    bannerTitle: '',
    faqTitle: 'FAQs',
    faqSubtitle: 'Everything you need to know about renting with IndianRenters.com',
    faqItems: [],
    faqSectionEnabled: true,
    publishStatus: 'published',
};

// ── Small reusable inputs ─────────────────────────────────────────────────────
const TextInput = ({ label, value, onChange, placeholder }) => (
    <div>
        {label && <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>}
        <input
            type="text" value={value || ''} onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
        />
    </div>
);

const TextArea = ({ label, value, onChange, placeholder, rows = 2 }) => (
    <div>
        {label && <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>}
        <textarea
            value={value || ''} onChange={e => onChange(e.target.value)}
            placeholder={placeholder} rows={rows}
            className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all resize-none"
        />
    </div>
);

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function WebsiteFaqManager() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [search, setSearch] = useState('');
    const [data, setData] = useState(DEFAULTS);

    const set = (k, v) => setData(p => ({ ...p, [k]: v }));

    const load = useCallback(async () => {
        try {
            setLoading(true);
            const res = await window.fetch(`${API}/api/cms/faq?t=${Date.now()}`);
            if (res.ok) {
                const d = await res.json();
                setData({ ...DEFAULTS, ...d, faqItems: Array.isArray(d.faqItems) ? d.faqItems : [] });
            }
        } catch (e) {
            console.error('Failed to load FAQ page:', e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    // ── FAQ item helpers ──────────────────────────────────────────────────────
    const addFaq = () => set('faqItems', [...data.faqItems, { question: '', answer: '' }]);
    const removeFaq = (i) => set('faqItems', data.faqItems.filter((_, idx) => idx !== i));
    const updateFaq = (i, key, val) => set('faqItems', data.faqItems.map((it, idx) => idx === i ? { ...it, [key]: val } : it));
    const moveFaq = (i, dir) => {
        const j = i + dir;
        if (j < 0 || j >= data.faqItems.length) return;
        const next = [...data.faqItems];
        [next[i], next[j]] = [next[j], next[i]];
        set('faqItems', next);
    };

    const save = async () => {
        try {
            setSaving(true);
            const res = await window.fetch(`${API}/api/cms/faq`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error((await res.json()).message || 'Failed to save');
            setSaved(true);
            toast.success('FAQ page saved!');
            setTimeout(() => setSaved(false), 3000);
        } catch (e) {
            toast.error(e.message);
        } finally {
            setSaving(false);
        }
    };

    // Search only filters which items are shown for editing; it does not change the saved order/data.
    const term = search.trim().toLowerCase();
    const visibleItems = term
        ? data.faqItems
            .map((it, idx) => ({ it, idx }))
            .filter(({ it }) => (it.question || '').toLowerCase().includes(term) || (it.answer || '').toLowerCase().includes(term))
        : data.faqItems.map((it, idx) => ({ it, idx }));

    return (
        <div className="space-y-6 pb-16">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                        Website <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">FAQs</span>
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Manage the questions shown on your public FAQ page (<span className="font-mono">/faq</span>).</p>
                </div>
                <div className="flex items-center gap-3">
                    {saved && (
                        <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-semibold bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5">
                            <CheckCircle size={12} weight="fill" /> Saved!
                        </span>
                    )}
                    <Chip size="sm" color={data.faqSectionEnabled ? 'success' : 'warning'} variant="flat"
                        startContent={data.faqSectionEnabled ? <Globe size={11} /> : <Warning size={11} />}>
                        {data.faqSectionEnabled ? 'Live' : 'Hidden'}
                    </Chip>
                    <Chip color="secondary" variant="flat" size="sm">{data.faqItems.length} FAQ{data.faqItems.length !== 1 ? 's' : ''}</Chip>
                    <button onClick={save} disabled={saving || loading}
                        className="flex items-center gap-2 h-9 px-4 rounded-xl !bg-indigo-600 hover:!bg-indigo-700 disabled:opacity-60 text-white font-semibold text-sm shadow-lg shadow-indigo-500/20 transition-all">
                        {saving ? <Spinner size="sm" color="white" /> : <FloppyDisk size={15} weight="bold" />} Save
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center gap-3 py-24 text-slate-400">
                    <Spinner size="sm" color="secondary" /> Loading FAQ page…
                </div>
            ) : (
                <>
                    {/* Page settings: heading, banner, visibility */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-sm">
                        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Page Header</h4>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <TextInput label="Heading Title" value={data.faqTitle} onChange={v => set('faqTitle', v)} placeholder="FAQs" />
                                <TextArea label="Heading Subtitle" value={data.faqSubtitle} onChange={v => set('faqSubtitle', v)} placeholder="Everything you need to know about renting…" rows={2} />
                                <TextInput label="Banner Title" value={data.bannerTitle} onChange={v => set('bannerTitle', v)} placeholder="FAQs" />
                            </div>
                            <div className="space-y-3">
                                <ImageUploader label="Banner Image" existingUrl={data.bannerImage} onUpload={url => set('bannerImage', url)} />
                                {!data.bannerImage && (
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Or paste image URL</label>
                                        <div className="relative">
                                            <PhosphorImage size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                            <input type="url" value={data.bannerImage} onChange={e => set('bannerImage', e.target.value)}
                                                placeholder="https://res.cloudinary.com/..."
                                                className="w-full h-10 pl-9 pr-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <hr className="border-slate-100 dark:border-slate-800" />

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-slate-800 dark:text-slate-100">Show FAQ section</p>
                                <p className="text-xs text-slate-500">When off, the FAQ list is hidden on the public site.</p>
                            </div>
                            <Toggle isSelected={data.faqSectionEnabled} onValueChange={v => set('faqSectionEnabled', v)} />
                        </div>
                    </div>

                    {/* FAQ list */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Questions & Answers</h4>
                            <div className="relative group max-w-xs w-full">
                                <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="text" value={search} onChange={e => setSearch(e.target.value)}
                                    placeholder="Search FAQs…"
                                    className="w-full h-10 pl-10 pr-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
                                />
                            </div>
                        </div>

                        {data.faqItems.length === 0 ? (
                            <div className="py-12 text-center text-slate-400 text-sm border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                                No FAQs yet. Click “Add FAQ” below to create your first one.
                            </div>
                        ) : visibleItems.length === 0 ? (
                            <div className="py-12 text-center text-slate-400 text-sm">No FAQs match your search.</div>
                        ) : (
                            <div className="space-y-4">
                                <AnimatePresence>
                                    {visibleItems.map(({ it, idx }) => (
                                        <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                                            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3 relative group">
                                            <div className="flex items-center justify-between">
                                                <span className="flex items-center gap-2">
                                                    <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 flex items-center justify-center text-[10px] font-bold">{idx + 1}</span>
                                                    <Question size={14} className="text-indigo-400" />
                                                </span>
                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => moveFaq(idx, -1)} disabled={idx === 0 || !!term}
                                                        title={term ? 'Clear search to reorder' : 'Move up'}
                                                        className="p-1.5 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-transparent">
                                                        <CaretUp size={15} />
                                                    </button>
                                                    <button onClick={() => moveFaq(idx, 1)} disabled={idx === data.faqItems.length - 1 || !!term}
                                                        title={term ? 'Clear search to reorder' : 'Move down'}
                                                        className="p-1.5 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-transparent">
                                                        <CaretDown size={15} />
                                                    </button>
                                                    <button onClick={() => removeFaq(idx)}
                                                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all">
                                                        <Trash size={15} />
                                                    </button>
                                                </div>
                                            </div>
                                            <TextInput
                                                label="Question"
                                                value={it.question}
                                                onChange={v => updateFaq(idx, 'question', v)}
                                                placeholder="e.g. What is the minimum rental period?"
                                            />
                                            <TextArea
                                                label="Answer"
                                                value={it.answer}
                                                onChange={v => updateFaq(idx, 'answer', v)}
                                                placeholder="e.g. The minimum rental period is 1 month."
                                                rows={2}
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}

                        <button onClick={addFaq}
                            className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-center gap-2 text-slate-400 hover:text-indigo-500 hover:border-indigo-400 transition-all">
                            <Plus size={18} /> Add FAQ
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
