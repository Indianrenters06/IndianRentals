'use client';
import toast from 'react-hot-toast';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Spinner, Chip } from '@heroui/react';
import {
    FloppyDisk, CheckCircle, Plus, Trash, CaretDown, CaretUp,
    Question, MagnifyingGlass, ArrowLeft, PencilSimple
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

const TextArea = ({ label, value, onChange, placeholder, rows = 2 }) => (
    <div>
        {label && <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>}
        <textarea
            value={value || ''} onChange={e => onChange(e.target.value)}
            placeholder={placeholder} rows={rows}
            className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all resize-none"
        />
    </div>
);

// ── Product FAQ Editor panel ──────────────────────────────────────────────────
function ProductFaqEditor({ product, onClose, onSaved }) {
    const [faqs, setFaqs] = useState(product.faqs || []);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const addFaq = () => setFaqs(prev => [...prev, { question: '', answer: '' }]);
    const removeFaq = (i) => setFaqs(prev => prev.filter((_, idx) => idx !== i));
    const updateFaq = (i, k, v) => setFaqs(prev => {
        const next = [...prev];
        next[i] = { ...next[i], [k]: v };
        return next;
    });

    const save = async () => {
        setSaving(true);
        try {
            const res = await window.fetch(`${API}/api/products/${product._id}/faqs`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify({ faqs }),
            });
            if (!res.ok) throw new Error((await res.json()).message || 'Failed to save');
            setSaved(true);
            onSaved(product._id, faqs);
            setTimeout(() => setSaved(false), 3000);
        } catch (e) {
            toast.error(e.message);
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
                        <p className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-0.5">Product FAQs</p>
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

                {/* FAQ list */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <AnimatePresence>
                        {faqs.map((item, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3 relative group">
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 flex items-center justify-center text-[10px] font-bold">{i + 1}</span>
                                        <Question size={14} className="text-indigo-400" />
                                    </span>
                                    <button onClick={() => removeFaq(i)}
                                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                        <Trash size={15} />
                                    </button>
                                </div>
                                <TextInput
                                    label="Question"
                                    value={item.question}
                                    onChange={v => updateFaq(i, 'question', v)}
                                    placeholder="e.g. What is the minimum rental period?"
                                />
                                <TextArea
                                    label="Answer"
                                    value={item.answer}
                                    onChange={v => updateFaq(i, 'answer', v)}
                                    placeholder="e.g. The minimum rental period is 1 month."
                                    rows={2}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    <button onClick={addFaq}
                        className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-center gap-2 text-slate-400 hover:text-indigo-500 hover:border-indigo-400 transition-all">
                        <Plus size={18} /> Add FAQ
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
                    <span className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-500"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256" fill="currentColor"><path d="M223.15,68.72l-88-48.18a14,14,0,0,0-14.3,0l-88,48.17a14,14,0,0,0-7.09,12.29V175a14,14,0,0,0,7.09,12.28l88,48.18a14,14,0,0,0,14.3,0l88-48.18A14,14,0,0,0,230.24,175V81A14,14,0,0,0,223.15,68.72ZM128,34l83.23,45.57L128,125.14,44.77,79.57ZM38,96.28l82,44.89V219.5L38,174.61Zm96,123.22V141.17l82-44.89V174.61Z"/></svg></span>
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
                                            color={prod.faqs?.length > 0 ? 'success' : 'warning'}
                                            variant="flat">
                                            {prod.faqs?.length > 0 ? `${prod.faqs.length} FAQ${prod.faqs.length > 1 ? 's' : ''}` : 'No FAQs'}
                                        </Chip>
                                        <button onClick={() => onEdit(prod)}
                                            className="flex items-center gap-1.5 h-8 px-3 rounded-lg !bg-indigo-50 dark:!bg-indigo-500/10 hover:!bg-indigo-100 dark:hover:!bg-indigo-500/20 text-indigo-600 font-semibold text-xs transition-all">
                                            <PencilSimple size={13} /> Edit FAQs
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
export default function ProductFaqManager() {
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

    const handleSaved = (productId, newFaqs) => {
        setProducts(prev => prev.map(p => p._id === productId ? { ...p, faqs: newFaqs } : p));
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
                        <Question size={28} className="text-indigo-500" />
                        Product <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">FAQs</span>
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Manage FAQs for each product, organised by category.</p>
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
                    <ProductFaqEditor
                        product={editingProduct}
                        onClose={() => setEditingProduct(null)}
                        onSaved={handleSaved}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
