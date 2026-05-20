'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Spinner, Chip } from '@heroui/react';
import {
    FloppyDisk, CheckCircle, Plus, Trash, CaretDown, CaretUp,
    ListDashes, MagnifyingGlass, PencilSimple
} from '@phosphor-icons/react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

// ── Small reusable components ─────────────────────────────────────────────────
const TextInput = ({ label, value, onChange, placeholder }) => (
    <div>
        {label && <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>}
        <input
            type="text" value={value || ''} onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
        />
    </div>
);

// ── Product Variant Editor panel ──────────────────────────────────────────────
function ProductVariantEditor({ product, onClose, onSaved }) {
    const [variants, setVariants] = useState(product.variants || []);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const addVariant = () => setVariants(prev => [...prev, { name: '', options: [] }]);
    const removeVariant = (i) => setVariants(prev => prev.filter((_, idx) => idx !== i));
    
    const updateVariantName = (i, name) => setVariants(prev => {
        const next = [...prev];
        next[i] = { ...next[i], name };
        return next;
    });

    const updateVariantOptions = (i, optionsString) => setVariants(prev => {
        const next = [...prev];
        // Split by comma and clean up whitespace
        const options = optionsString.split(',').map(s => s.trim()).filter(Boolean);
        next[i] = { ...next[i], options };
        return next;
    });

    const save = async () => {
        setSaving(true);
        try {
            const res = await window.fetch(`${API}/api/products/${product._id}/variants`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify({ variants }),
            });
            if (!res.ok) throw new Error((await res.json()).message || 'Failed to save');
            setSaved(true);
            onSaved(product._id, variants);
            setTimeout(() => setSaved(false), 3000);
        } catch (e) {
            alert(e.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-0.5">Product Variants</p>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate max-w-sm">{product.name}</h2>
                        <p className="text-xs text-slate-400 mt-0.5">{product.category}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {saved && (
                            <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-semibold bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5">
                                <CheckCircle size={12} weight="fill" /> Saved!
                            </span>
                        )}
                        <button onClick={save} disabled={saving}
                            className="flex items-center gap-2 h-9 px-4 rounded-xl !bg-indigo-600 hover:!bg-indigo-700 disabled:opacity-60 text-white font-semibold text-sm shadow-lg shadow-indigo-500/20 transition-all">
                            {saving ? <Spinner size="sm" color="white" /> : <FloppyDisk size={15} weight="bold" />} Save
                        </button>
                        <button onClick={onClose}
                            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-all">
                            ✕
                        </button>
                    </div>
                </div>

                {/* Variants list */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <AnimatePresence>
                        {variants.map((item, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3 relative group">
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 flex items-center justify-center text-[10px] font-bold">{i + 1}</span>
                                        <ListDashes size={14} className="text-indigo-400" />
                                    </span>
                                    <button onClick={() => removeVariant(i)}
                                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                        <Trash size={15} />
                                    </button>
                                </div>
                                <TextInput
                                    label="Variant Name"
                                    value={item.name}
                                    onChange={v => updateVariantName(i, v)}
                                    placeholder="e.g. Color, Storage, Size"
                                />
                                <TextInput
                                    label="Options (comma separated)"
                                    value={item.options ? item.options.join(', ') : ''}
                                    onChange={v => updateVariantOptions(i, v)}
                                    placeholder="e.g. Red, Black, Blue"
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    <button onClick={addVariant}
                        className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-center gap-2 text-slate-400 hover:text-indigo-500 hover:border-indigo-400 transition-all">
                        <Plus size={18} /> Add Variant Option
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

// ── Category accordion ────────────────────────────────────────────────────────
function CategoryGroup({ category, products, onEdit }) {
    const [open, setOpen] = useState(true);
    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <button onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all">
                <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-base">📦</span>
                    <div className="text-left">
                        <p className="font-bold text-slate-900 dark:text-slate-100">{category}</p>
                        <p className="text-xs text-slate-400">{products.length} product{products.length !== 1 ? 's' : ''}</p>
                    </div>
                </div>
                {open ? <CaretUp size={16} className="text-slate-400" /> : <CaretDown size={16} className="text-slate-400" />}
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                        className="overflow-hidden border-t border-slate-100 dark:border-slate-800">
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {products.map(prod => (
                                <div key={prod._id} className="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all">
                                    <div className="flex items-center gap-3">
                                        {prod.images?.[0] && (
                                            <img src={prod.images[0]} alt={prod.name} className="w-10 h-10 rounded-xl object-cover bg-slate-100 shrink-0" />
                                        )}
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{prod.name}</p>
                                            <p className="text-xs text-slate-400">{prod.brand || '—'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Chip size="sm"
                                            color={prod.variants?.length > 0 ? 'secondary' : 'default'}
                                            variant="flat">
                                            {prod.variants?.length > 0 ? `${prod.variants.length} Variant${prod.variants.length > 1 ? 's' : ''}` : 'No Variants'}
                                        </Chip>
                                        <button onClick={() => onEdit(prod)}
                                            className="flex items-center gap-1.5 h-8 px-3 rounded-lg !bg-indigo-50 dark:!bg-indigo-500/10 hover:!bg-indigo-100 dark:hover:!bg-indigo-500/20 text-indigo-600 font-semibold text-xs transition-all">
                                            <PencilSimple size={13} /> Edit Variants
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ProductVariantManager() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);

    const load = useCallback(async () => {
        try {
            setLoading(true);
            let allProducts = [];
            let page = 1;
            while (true) {
                const res = await window.fetch(`${API}/api/products?limit=100&pageNumber=${page}`);
                if (!res.ok) break;
                const data = await res.json();
                allProducts = [...allProducts, ...data.products];
                if (page >= data.pages) break;
                page++;
            }
            setProducts(allProducts);
        } catch (e) {
            console.error('Failed to load products:', e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleSaved = (productId, newVariants) => {
        setProducts(prev => prev.map(p => p._id === productId ? { ...p, variants: newVariants } : p));
    };

    // Filter by search
    const filtered = products.filter(p =>
        !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
    );

    // Group by category
    const byCategory = filtered.reduce((acc, p) => {
        const cat = p.category || 'Uncategorised';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(p);
        return acc;
    }, {});

    const categories = Object.keys(byCategory).sort();

    return (
        <div className="space-y-6 pb-16">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <ListDashes size={28} className="text-indigo-500" />
                        Product <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Variants</span>
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Manage variants like Color or Storage directly on each product.</p>
                </div>
                <Chip color="secondary" variant="flat" size="sm">{products.length} products</Chip>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text" value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search by product or category…"
                    className="w-full h-10 pl-9 pr-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
                />
            </div>

            {/* List */}
            {loading ? (
                <div className="flex items-center justify-center gap-3 py-24 text-slate-400">
                    <Spinner size="sm" color="secondary" /> Loading products…
                </div>
            ) : categories.length === 0 ? (
                <div className="py-24 text-center text-slate-400 text-sm">No products found.</div>
            ) : (
                <div className="space-y-4">
                    {categories.map(cat => (
                        <CategoryGroup
                            key={cat}
                            category={cat}
                            products={byCategory[cat]}
                            onEdit={setEditingProduct}
                        />
                    ))}
                </div>
            )}

            {/* Editor Modal */}
            <AnimatePresence>
                {editingProduct && (
                    <ProductVariantEditor
                        product={editingProduct}
                        onClose={() => setEditingProduct(null)}
                        onSaved={handleSaved}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
