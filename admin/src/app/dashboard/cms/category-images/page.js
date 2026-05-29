'use client';
import toast from 'react-hot-toast';

import { useState, useEffect, useCallback } from 'react';
import { Spinner } from '@heroui/react';
import { CheckCircle, FloppyDisk, Images, CaretDown, CaretRight } from '@phosphor-icons/react';
import ImageUploader from '@/components/ImageUploader';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

export default function CategoryImagesCMS() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(null); // id of item being saved
    const [saved, setSaved] = useState(null);   // id of item just saved
    const [expanded, setExpanded] = useState(new Set());

    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API}/api/categories/admin`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (res.ok) {
                const data = await res.json();
                setCategories(Array.isArray(data) ? data : []);
                // Expand all by default
                setExpanded(new Set((Array.isArray(data) ? data : []).map(c => c._id)));
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchCategories(); }, [fetchCategories]);

    const toggleExpand = (id) => {
        setExpanded(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const saveImage = async (id, image) => {
        try {
            setSaving(id);
            const res = await fetch(`${API}/api/categories/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ image }),
            });
            if (!res.ok) throw new Error('Failed to save');
            setSaved(id);
            setTimeout(() => setSaved(null), 3000);
            // Update local state without full refetch
            setCategories(prev => prev.map(cat => {
                if (cat._id === id) return { ...cat, image };
                return {
                    ...cat,
                    subcategories: (cat.subcategories || []).map(sub =>
                        sub._id === id ? { ...sub, image } : sub
                    )
                };
            }));
        } catch (e) {
            toast.error(e.message);
        } finally {
            setSaving(null);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center gap-3 py-24 text-slate-400">
            <Spinner size="sm" color="secondary" /> Loading categories…
        </div>
    );

    return (
        <div className="space-y-6 pb-16">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Images className="text-indigo-500" size={32} weight="duotone" />
                    Category <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">Images</span>
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Upload images for each category and subcategory. Changes are saved instantly when you upload.
                </p>
            </div>

            {/* Category Cards */}
            <div className="space-y-4">
                {categories.map((cat) => {
                    const isOpen = expanded.has(cat._id);
                    return (
                        <div key={cat._id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                            {/* Category Header Row */}
                            <div className="flex items-center gap-4 px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
                                <button
                                    type="button"
                                    onClick={() => toggleExpand(cat._id)}
                                    className="text-slate-400 hover:text-indigo-500 transition-colors"
                                >
                                    {isOpen ? <CaretDown size={16} weight="bold" /> : <CaretRight size={16} weight="bold" />}
                                </button>

                                {/* Current image preview */}
                                <div className="w-12 h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden shrink-0">
                                    {cat.image ? (
                                        <img src={cat.image} alt={cat.name} className="w-full h-full object-contain p-1" />
                                    ) : (
                                        <Images size={20} className="text-slate-300" />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-slate-900 dark:text-white text-base truncate">{cat.name}</p>
                                    <p className="text-xs text-slate-400 font-mono">/{cat.slug} · {cat.subcategories?.length || 0} subcategories</p>
                                </div>

                                {saved === cat._id && (
                                    <span className="flex items-center gap-1 text-emerald-600 text-xs font-semibold bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
                                        <CheckCircle size={12} weight="fill" /> Saved!
                                    </span>
                                )}

                                {/* Upload for the category itself */}
                                <div className="w-48 shrink-0">
                                    <ImageUploader
                                        key={`cat-${cat._id}`}
                                        existingUrl={cat.image}
                                        onUpload={(url) => saveImage(cat._id, url)}
                                        label="Upload Category Image"
                                    />
                                </div>
                            </div>

                            {/* Subcategories */}
                            {isOpen && cat.subcategories && cat.subcategories.length > 0 && (
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {cat.subcategories.map((sub) => (
                                        <div key={sub._id} className="flex items-center gap-4 px-6 py-4 pl-14 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                            {/* Subcategory image preview */}
                                            <div className="w-14 h-14 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden shrink-0">
                                                {sub.image ? (
                                                    <img src={sub.image} alt={sub.name} className="w-full h-full object-contain p-1" />
                                                ) : (
                                                    <div className="flex flex-col items-center gap-1">
                                                        <Images size={18} className="text-slate-300" />
                                                        <span className="text-[9px] text-slate-400 font-bold uppercase">No img</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm truncate">{sub.name}</p>
                                                <p className="text-xs text-slate-400 font-mono">/{sub.slug}</p>
                                                {sub.image && (
                                                    <p className="text-[10px] text-emerald-500 font-semibold mt-0.5 flex items-center gap-0.5"><CheckCircle size={10} weight="fill" /> Has image</p>
                                                )}
                                            </div>

                                            {saved === sub._id && (
                                                <span className="flex items-center gap-1 text-emerald-600 text-xs font-semibold bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1 shrink-0">
                                                    <CheckCircle size={12} weight="fill" /> Saved!
                                                </span>
                                            )}

                                            {saving === sub._id && (
                                                <Spinner size="sm" color="secondary" />
                                            )}

                                            {/* Upload for subcategory */}
                                            <div className="w-56 shrink-0">
                                                <ImageUploader
                                                    key={`sub-${sub._id}-${sub.image}`}
                                                    existingUrl={sub.image}
                                                    onUpload={(url) => saveImage(sub._id, url)}
                                                    label={sub.image ? "Change Image" : "Upload Image"}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {isOpen && (!cat.subcategories || cat.subcategories.length === 0) && (
                                <div className="px-6 py-4 pl-14 text-sm text-slate-400 italic">
                                    No subcategories
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {categories.length === 0 && (
                <div className="text-center py-24 text-slate-400">
                    <Images size={48} className="mx-auto mb-3 opacity-30" />
                    <p>No categories found. Add categories first from Products → Categories.</p>
                </div>
            )}
        </div>
    );
}
