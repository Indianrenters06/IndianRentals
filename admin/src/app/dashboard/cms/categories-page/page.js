'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Spinner, Button } from '@heroui/react';
import { FloppyDisk, CheckCircle, Plus, Trash, ArrowRight, Image as PhosphorImage, Link as LinkIcon, TextT } from '@phosphor-icons/react';
import ImageUploader from '@/components/ImageUploader';
import Image from 'next/image';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

// Default empty state
const DEFAULTS = {
    categoriesPageTitle: 'All Categories',
    categoriesPageSubtitle: 'Lorem ipsum dolor sit amet consectetur. Vel libero cras laoreet ut dignissim eget. Scelerisque mauris pharetra tristique cras sit malesuada. Egestas pulvinar interdum sapien et. Consequat neque at donec turpis leo. Quis at.',
    categoriesGrid: [
        { title: "Apple Products", image: "/macbook-pro-new.jpg", href: "/category/apple" },
        { title: "IT Products", image: "/it-products-new.jpg", href: "/category/it-products" },
        { title: "AV Products", image: "/it-products-new.jpg", href: "/category/av-products" },
        { title: "Office Equipment", image: "/office-equipment-new.jpg", href: "/category/office-equipment" },
        { title: "DSLR Cameras", image: "https://res.cloudinary.com/dgkckcdk8/image/upload/v1769967871/indian-rentals/ea5ryxbvie8spmdb9slz.jpg", href: "/category/dslr" }
    ],
    metaTitle: '', metaDescription: '', publishStatus: 'published',
};

// ── Reusable Form Components ───────────────────────────────────────────────────
const Label = ({ children }) => (
    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">{children}</label>
);

const TextInput = ({ label, value, onChange, placeholder, icon: Icon }) => (
    <div>
        {label && <Label>{label}</Label>}
        <div className="relative">
            {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />}
            <input
                type="text"
                value={value || ''}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className={`w-full h-10 ${Icon ? 'pl-9' : 'px-3'} pr-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all`}
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
            className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all resize-none"
        />
    </div>
);

export default function CategoriesPageCMS() {
    const [data, setData] = useState(DEFAULTS);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [activeTab, setActiveTab] = useState('preview'); // 'form' or 'preview'
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const set = (k, v) => setData(p => ({ ...p, [k]: v }));

    const load = useCallback(async () => {
        try {
            const res = await window.fetch(`${API}/api/cms/categories-page?t=${Date.now()}`);
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
            const res = await window.fetch(`${API}/api/cms/categories-page`, {
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

    const addCard = () => {
        set('categoriesGrid', [...(data.categoriesGrid || []), { title: 'New Category', image: '', href: '' }]);
    };

    const removeCard = (i) => {
        const next = [...data.categoriesGrid];
        next.splice(i, 1);
        set('categoriesGrid', next);
    };

    const updateCard = (i, k, v) => {
        const next = [...data.categoriesGrid];
        next[i] = { ...next[i], [k]: v };
        set('categoriesGrid', next);
    };

    if (!mounted || loading) return (
        <div className="flex items-center justify-center gap-3 py-24 text-slate-400">
            <Spinner size="sm" color="secondary" /> Loading Categories Page CMS…
        </div>
    );

    return (
        <div className="space-y-6 pb-16">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        🗂️ Categories Page <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">CMS</span>
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Manage the &quot;All Categories&quot; frontend page layout and cards.</p>
                </div>
                <div className="flex items-center gap-4">
                    {/* View Toggle */}
                    <div className="flex bg-slate-200/50 dark:bg-slate-800 p-1 rounded-xl">
                        <button 
                            onClick={() => setActiveTab('form')}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'form' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            Data Editor
                        </button>
                        <button 
                            onClick={() => setActiveTab('preview')}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'preview' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            Visual Preview
                        </button>
                    </div>

                    <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1"></div>

                    {saved && (
                        <span className="flex items-center gap-1.5 text-emerald-600 text-sm font-semibold bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5">
                            <CheckCircle size={14} weight="fill" /> Saved!
                        </span>
                    )}
                    <button onClick={save} disabled={saving}
                        className="flex items-center gap-2 h-10 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold text-sm shadow-lg shadow-indigo-500/20 transition-all">
                        {saving ? <Spinner size="sm" color="white" /> : <FloppyDisk size={15} weight="bold" />} Save Page
                    </button>
                </div>
            </div>

            {/* Split View Container */}
            {activeTab === 'form' ? (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Left Column: Page Metadata */}
                    <div className="xl:col-span-1 space-y-6">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-5 flex items-center gap-2">
                                <TextT className="text-indigo-500" /> Header Text
                            </h3>
                            <div className="space-y-4">
                                <TextInput 
                                    label="Page Title" 
                                    value={data.categoriesPageTitle} 
                                    onChange={v => set('categoriesPageTitle', v)} 
                                    placeholder="All Categories"
                                />
                                <TextArea 
                                    label="Page Description" 
                                    value={data.categoriesPageSubtitle} 
                                    onChange={v => set('categoriesPageSubtitle', v)} 
                                    rows={5}
                                />
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-5 flex items-center gap-2">
                                🔍 SEO Settings
                            </h3>
                            <div className="space-y-4">
                                <TextInput label="Meta Title" value={data.metaTitle} onChange={v => set('metaTitle', v)} />
                                <TextArea label="Meta Description" value={data.metaDescription} onChange={v => set('metaDescription', v)} rows={3} />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Grid Cards */}
                    <div className="xl:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-5">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                    <PhosphorImage className="text-indigo-500" /> Category Cards
                                </h3>
                                <span className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-full">
                                    {(data.categoriesGrid || []).length} Cards Total
                                </span>
                            </div>

                            <div className="space-y-4">
                                <AnimatePresence>
                                    {(data.categoriesGrid || []).map((card, i) => (
                                        <motion.div 
                                            key={i} 
                                            initial={{ opacity: 0, height: 0 }} 
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 relative group"
                                        >
                                            <button onClick={() => removeCard(i)}
                                                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-red-500 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 transition-all z-10">
                                                <Trash size={16} />
                                            </button>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <TextInput 
                                                        label={`Card ${i + 1} Title`}
                                                        value={card.title} 
                                                        onChange={v => updateCard(i, 'title', v)} 
                                                        icon={TextT}
                                                    />
                                                    <TextInput 
                                                        label="Target Link" 
                                                        value={card.href} 
                                                        onChange={v => updateCard(i, 'href', v)} 
                                                        placeholder="/category/example"
                                                        icon={LinkIcon}
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Card Image</Label>
                                                    <ImageUploader 
                                                        existingUrl={card.image} 
                                                        onUpload={url => updateCard(i, 'image', url)} 
                                                        label="Upload Category Image"
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                <button onClick={addCard}
                                    className="w-full py-4 border-2 border-dashed border-indigo-200 dark:border-indigo-500/30 rounded-xl flex items-center justify-center gap-2 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all font-semibold text-sm">
                                    <Plus size={18} weight="bold" /> Add Category Card
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* Interactive Frontend Preview */
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden relative">
                    <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center gap-3 relative">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                        <div className="absolute left-1/2 -translate-x-1/2 text-xs font-semibold text-slate-400 font-mono bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                            Frontend Visual Preview (Editable)
                        </div>
                    </div>

                    <div className="p-8 md:p-12 w-full flex flex-col items-center min-h-[600px]" style={{ backgroundColor: '#ffffff' }}>
                        <div className="w-full max-w-[1200px] flex flex-col gap-[30px]">
                            
                            {/* Header Preview - Editable Inline */}
                            <div className="flex flex-col gap-[12px] w-full relative group">
                                <div className="absolute -left-6 top-0 bottom-0 w-1 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                
                                <div className="flex items-center gap-[8px] text-[12px] font-medium text-[#64748B]">
                                    <span style={{ fontFamily: "'Mona Sans', sans-serif", color: "hsla(0, 0%, 33%, 1)" }}>Homepage</span>
                                    <ArrowRight size={10} className="text-gray-400" />
                                    <span className="text-[#1E293B] font-bold">All Categories</span>
                                </div>

                                <input
                                    value={data.categoriesPageTitle}
                                    onChange={e => set('categoriesPageTitle', e.target.value)}
                                    className="bg-transparent border-none outline-none focus:ring-2 focus:ring-indigo-500/20 rounded-lg -ml-2 px-2"
                                    style={{
                                        fontFamily: "'Mona Sans', sans-serif", fontWeight: 600, fontSize: "44px",
                                        lineHeight: "58px", letterSpacing: "-0.01em", color: "hsla(0, 0%, 12%, 1)",
                                    }}
                                />

                                <textarea
                                    value={data.categoriesPageSubtitle}
                                    onChange={e => set('categoriesPageSubtitle', e.target.value)}
                                    className="bg-transparent border-none outline-none focus:ring-2 focus:ring-indigo-500/20 rounded-lg -ml-2 px-2 w-full resize-none"
                                    rows={3}
                                    style={{
                                        fontFamily: "'Mona Sans', sans-serif", fontWeight: 400, fontSize: "14px",
                                        lineHeight: "1.5", color: "hsla(0, 0%, 46%, 1)",
                                    }}
                                />
                            </div>

                            {/* Grid Preview */}
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-[24px] w-full">
                                {(data.categoriesGrid || []).map((card, i) => (
                                    <div
                                        key={i}
                                        className="flex flex-col group overflow-hidden transition-all duration-300 relative"
                                        style={{
                                            width: "100%", height: "276px", borderRadius: "12px",
                                            border: "1px solid hsla(0, 0%, 89%, 1)", backgroundColor: "hsla(0, 0%, 100%, 1)",
                                            boxShadow: "0px 1px 3px 0px hsla(0, 0%, 87%, 0.08), 0px 6px 6px 0px hsla(0, 0%, 87%, 0.07)"
                                        }}
                                    >
                                        {/* Overlay to edit image */}
                                        <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-white/60 backdrop-blur-sm transition-all duration-300">
                                            <div className="bg-white p-4 rounded-xl shadow-xl border border-slate-200 flex flex-col gap-3 w-[80%] max-w-[250px]">
                                                <ImageUploader 
                                                    existingUrl={card.image} 
                                                    onUpload={url => updateCard(i, 'image', url)} 
                                                    label="Change Banner"
                                                />
                                            </div>
                                        </div>

                                        {/* Image Container */}
                                        <div className="relative w-full flex-1 flex items-center justify-center p-6">
                                            <div className="relative w-full h-[180px]">
                                                {card.image ? (
                                                    <Image src={card.image} alt={card.title} fill unoptimized className="object-contain" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300 rounded-lg">
                                                        <PhosphorImage size={32} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Footer Label */}
                                        <div
                                            className="flex items-center shrink-0 w-full z-30"
                                            style={{ height: "52px", justifyContent: "space-between", padding: "12px 18px", backgroundColor: '#fff', borderTop: '1px solid #f1f5f9' }}
                                        >
                                            <input 
                                                value={card.title}
                                                onChange={e => updateCard(i, 'title', e.target.value)}
                                                className="font-semibold text-[17px] tracking-tight text-[#1E293B] bg-transparent outline-none focus:ring-2 focus:ring-indigo-500/20 rounded px-1 flex-1"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <ArrowRight weight="regular" className="text-[#000000] flex-shrink-0 ml-2" size={24} />
                                        </div>
                                    </div>
                                ))}

                                {/* Add Card Button inside preview */}
                                <div 
                                    onClick={addCard}
                                    className="flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all duration-300"
                                    style={{
                                        width: "100%", height: "276px", borderRadius: "12px",
                                        border: "2px dashed hsla(0, 0%, 89%, 1)", backgroundColor: "hsla(0, 0%, 100%, 0.5)",
                                    }}
                                >
                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                                        <Plus size={24} weight="bold" />
                                    </div>
                                    <span className="text-slate-500 font-semibold">Add New Card</span>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
