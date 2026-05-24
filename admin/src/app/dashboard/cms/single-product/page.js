'use client';
import toast from 'react-hot-toast';
import { useState, useEffect, useCallback } from 'react';
import { Spinner } from '@heroui/react';
import {
    FloppyDisk, PencilSimple, CheckCircle, Plus, Trash, X,
    Star, CaretRight, Heart, ShareNetwork, Package, Truck, MapPin
} from '@phosphor-icons/react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

const DEFAULTS = {
    benefits: [
        { id: 1, title: 'Fully Functional' },
        { id: 2, title: 'Accessories Included' },
        { id: 3, title: 'Free Repairs & Maintenance' },
        { id: 4, title: 'Professionally Sanitized' },
    ],
    policyLinks: [
        { id: 1, question: 'What if I cancel or return before 6 months?', linkText: 'View Details' },
        { id: 2, question: 'How do I extend tenure after 6 months?', linkText: 'View Details' },
    ],
    depositLabel: '100% Refundable Deposit',
    kycNote: 'Place Order & complete KYC anytime to get your items the next day',
    reviewsTitle: 'What Our Customers Say',
    reviewsSubtitle: 'Real experiences from innovators, businesses, and creators powering their ambitions with IndianRenters.',
    googleReviewCount: '5000+',
    googleRating: '4.9',
    reviews: [
        { id: 1, name: 'John Doe', role: 'AI Engineer', text: 'Lorem ipsum velit laoreet tincidunt dolor donec at urna vestibulum nunc accumsan porttitor consequat tellus.', stars: 5, color: 'yellow' },
        { id: 2, name: 'Jane Smith', role: 'Product Designer', text: 'Amazing service! The products are always in great condition and delivery is super fast.', stars: 5, color: 'blue' },
        { id: 3, name: 'Raj Kumar', role: 'Startup Founder', text: 'IndianRenters helped us scale our office setup without huge upfront costs. Highly recommend!', stars: 5, color: 'green' },
        { id: 4, name: 'Priya Sharma', role: 'Freelancer', text: 'The rental process is smooth and customer support is excellent throughout.', stars: 5, color: 'pink' },
    ],
    faqTitle: 'FAQs',
    faqSubtitle: 'Everything you need to know about renting with IndianRenters.com',
    faqs: [
        { id: 1, question: 'What is the minimum rental period?', answer: 'The minimum rental period is 1 day. You can choose from flexible tenures of 1 day, 1 week, 1 month, 3 months, 6 months, or 12 months. Longer commitments come at lower monthly rates.' },
        { id: 2, question: 'Is maintenance included?', answer: 'Yes. Maintenance and support are included for the full rental period. For any technical issues, contact our support team.' },
        { id: 3, question: 'What if I want to extend my rental?', answer: 'Contact us at least 3-5 days before your scheduled return date. We will adjust your plan and billing from there.' },
        { id: 4, question: 'What happens if the product gets damaged?', answer: 'Normal wear and tear is accepted. For accidental damage, contact us right away — do not attempt repairs yourself.' },
    ],
    bestProductsTitle: 'Best Rented Products',
    bestProductsButtonText: 'View All',
};

const REVIEW_COLORS = ['yellow', 'blue', 'green', 'pink', 'purple', 'white'];

function cardBg(color) {
    return color === 'yellow' ? 'bg-yellow-50 border-yellow-100'
        : color === 'blue' ? 'bg-blue-50 border-blue-100'
        : color === 'green' ? 'bg-green-50 border-green-100'
        : color === 'pink' ? 'bg-pink-50 border-pink-100'
        : color === 'purple' ? 'bg-purple-50 border-purple-100'
        : 'bg-white border-slate-100';
}

function nameColor(color) {
    return color === 'yellow' ? 'text-amber-600'
        : color === 'blue' ? 'text-blue-600'
        : color === 'green' ? 'text-green-600'
        : color === 'pink' ? 'text-pink-600'
        : color === 'purple' ? 'text-purple-600'
        : 'text-slate-800';
}

// ── Editable section wrapper ───────────────────────────────────────────────────
function EditableSection({ children, panel, sectionId, activeEdit, setActiveEdit, label }) {
    const isActive = activeEdit === sectionId;
    return (
        <div>
            <div className={`relative group transition-all duration-150 ${isActive ? 'outline outline-2 outline-offset-2 outline-indigo-400 rounded-xl' : ''}`}>
                {children}
                <button
                    onClick={() => setActiveEdit(isActive ? null : sectionId)}
                    className="absolute top-3 right-4 z-20 opacity-0 group-hover:opacity-100 inline-flex items-center gap-1.5 h-7 px-3 rounded-lg bg-indigo-600 text-white text-[11px] font-bold shadow-lg transition-opacity"
                >
                    <PencilSimple weight="bold" size={11} /> {label}
                </button>
            </div>
            {isActive && (
                <div className="mx-2 mt-2 p-5 bg-white dark:bg-slate-900 border-2 border-indigo-300 dark:border-indigo-700 rounded-2xl shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Editing — {label}</span>
                        <button onClick={() => setActiveEdit(null)}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                            <X size={13} weight="bold" />
                        </button>
                    </div>
                    {panel}
                </div>
            )}
        </div>
    );
}

// ── Stars display ──────────────────────────────────────────────────────────────
function Stars({ count = 5, size = 12 }) {
    return (
        <span className="inline-flex gap-0.5">
            {[1,2,3,4,5].map(n => (
                <Star key={n} weight={n <= count ? 'fill' : 'regular'} size={size}
                    className={n <= count ? 'text-amber-400' : 'text-slate-300'} />
            ))}
        </span>
    );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function SingleProductPageCMS() {
    const [td, setTd] = useState(DEFAULTS);   // template data
    const [products, setProducts] = useState([]);
    const [selId, setSelId] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [activeEdit, setActiveEdit] = useState(null);
    const [activeTab, setActiveTab] = useState('details');
    const [openFaq, setOpenFaq] = useState(null);

    const set = (key, val) => setTd(prev => ({ ...prev, [key]: val }));
    const upd = (key, id, field, val) =>
        set(key, td[key].map(i => i.id === id ? { ...i, [field]: val } : i));
    const del = (key, id) => set(key, td[key].filter(i => i.id !== id));
    const add = (key, item) => set(key, [...td[key], { id: Date.now(), ...item }]);

    useEffect(() => {
        (async () => {
            try {
                const token = getToken();
                const [cmsRes, prodRes] = await Promise.all([
                    fetch(`${API}/api/cms/single-product-page?t=${Date.now()}`),
                    fetch(`${API}/api/admin/products`, { headers: { Authorization: `Bearer ${token}` } }),
                ]);
                if (cmsRes.ok) { const cmsJson = await cmsRes.json(); setTd({ ...DEFAULTS, ...cmsJson }); }
                if (prodRes.ok) {
                    const prods = await prodRes.json();
                    setProducts(prods);
                    if (prods.length > 0) setSelId(prods[0]._id);
                }
            } catch {}
            finally { setLoading(false); }
        })();
    }, []);

    const save = async () => {
        setSaving(true);
        try {
            const res = await fetch(`${API}/api/cms/single-product-page`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify(td),
            });
            if (!res.ok) throw new Error('Save failed');
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
            toast.success('Template saved!');
        } catch (e) {
            toast.error(e.message);
        } finally { setSaving(false); }
    };

    if (loading) return <div className="flex justify-center items-center h-64"><Spinner color="primary" /></div>;

    const product = products.find(p => p._id === selId) || products[0] || null;
    const price = product?.rentPrice || product?.price || 5000;
    const origPrice = product?.originalPrice || product?.mrp || Math.round(price * 1.5);
    const disc = product?.discount || Math.round((1 - price / origPrice) * 100);
    const images = product?.images || [];
    const specs = product?.specifications || product?.specs || [];

    // ── Edit panels ────────────────────────────────────────────────────────────
    const benefitsPanel = (
        <div className="grid grid-cols-2 gap-3">
            {td.benefits.map((b, i) => (
                <div key={b.id}>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tile {i+1}</label>
                    <input value={b.title} onChange={e => upd('benefits', b.id, 'title', e.target.value)}
                        className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/40" />
                </div>
            ))}
        </div>
    );

    const depositPanel = (
        <div className="grid grid-cols-2 gap-3">
            <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Deposit Label</label>
                <input value={td.depositLabel} onChange={e => set('depositLabel', e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/40" />
            </div>
            <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">KYC Notice Text</label>
                <input value={td.kycNote} onChange={e => set('kycNote', e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/40" />
            </div>
        </div>
    );

    const policyPanel = (
        <div className="space-y-3">
            {td.policyLinks.map((p, i) => (
                <div key={p.id} className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Policy {i+1} Text</label>
                        <input value={p.question} onChange={e => upd('policyLinks', p.id, 'question', e.target.value)}
                            className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/40" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Link Text</label>
                        <input value={p.linkText} onChange={e => upd('policyLinks', p.id, 'linkText', e.target.value)}
                            className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/40" />
                    </div>
                </div>
            ))}
        </div>
    );

    const reviewsPanel = (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Section Title</label>
                    <input value={td.reviewsTitle} onChange={e => set('reviewsTitle', e.target.value)}
                        className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/40" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Review Count</label>
                        <input value={td.googleReviewCount} onChange={e => set('googleReviewCount', e.target.value)}
                            className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/40" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Rating</label>
                        <input value={td.googleRating} onChange={e => set('googleRating', e.target.value)}
                            className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/40" />
                    </div>
                </div>
            </div>
            <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Subtitle</label>
                <textarea value={td.reviewsSubtitle} onChange={e => set('reviewsSubtitle', e.target.value)} rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400/40" />
            </div>
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Review Cards ({td.reviews.length})</span>
                    <button onClick={() => add('reviews', { name: '', role: '', text: '', stars: 5, color: 'yellow' })}
                        className="inline-flex items-center gap-1 h-7 px-2.5 rounded-lg !bg-indigo-600 text-white font-bold text-xs">
                        <Plus weight="bold" size={11} /> Add
                    </button>
                </div>
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {td.reviews.map((r, i) => (
                        <div key={r.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-400">Review {i+1}</span>
                                <button onClick={() => del('reviews', r.id)} className="text-rose-400 hover:text-rose-600 transition-colors"><Trash weight="bold" size={12} /></button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <input value={r.name} onChange={e => upd('reviews', r.id, 'name', e.target.value)} placeholder="Name"
                                    className="h-8 px-2 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-400" />
                                <input value={r.role} onChange={e => upd('reviews', r.id, 'role', e.target.value)} placeholder="Role"
                                    className="h-8 px-2 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-400" />
                            </div>
                            <textarea value={r.text} onChange={e => upd('reviews', r.id, 'text', e.target.value)} placeholder="Review text" rows={2}
                                className="w-full px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-xs resize-none focus:outline-none focus:ring-1 focus:ring-indigo-400" />
                            <div className="grid grid-cols-2 gap-2">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] text-slate-400 font-bold">Stars:</span>
                                    <input type="number" min={1} max={5} value={r.stars}
                                        onChange={e => upd('reviews', r.id, 'stars', Math.min(5, Math.max(1, Number(e.target.value))))}
                                        className="w-12 h-8 px-2 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-400" />
                                    <Stars count={r.stars} size={10} />
                                </div>
                                <select value={r.color} onChange={e => upd('reviews', r.id, 'color', e.target.value)}
                                    className="h-8 px-2 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-400 capitalize">
                                    {REVIEW_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const faqsPanel = (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">FAQ Title</label>
                    <input value={td.faqTitle} onChange={e => set('faqTitle', e.target.value)}
                        className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/40" />
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">FAQ Subtitle</label>
                    <input value={td.faqSubtitle} onChange={e => set('faqSubtitle', e.target.value)}
                        className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/40" />
                </div>
            </div>
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">FAQ Items ({td.faqs.length})</span>
                    <button onClick={() => add('faqs', { question: '', answer: '' })}
                        className="inline-flex items-center gap-1 h-7 px-2.5 rounded-lg !bg-indigo-600 text-white font-bold text-xs">
                        <Plus weight="bold" size={11} /> Add FAQ
                    </button>
                </div>
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {td.faqs.map((f, i) => (
                        <div key={f.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-400">FAQ {i+1}</span>
                                <button onClick={() => del('faqs', f.id)} className="text-rose-400 hover:text-rose-600 transition-colors"><Trash weight="bold" size={12} /></button>
                            </div>
                            <input value={f.question} onChange={e => upd('faqs', f.id, 'question', e.target.value)} placeholder="Question"
                                className="w-full h-8 px-2 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-400" />
                            <textarea value={f.answer} onChange={e => upd('faqs', f.id, 'answer', e.target.value)} placeholder="Answer" rows={2}
                                className="w-full px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-xs resize-none focus:outline-none focus:ring-1 focus:ring-indigo-400" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const bestPanel = (
        <div className="grid grid-cols-2 gap-3">
            <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Section Title</label>
                <input value={td.bestProductsTitle} onChange={e => set('bestProductsTitle', e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/40" />
            </div>
            <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Button Text</label>
                <input value={td.bestProductsButtonText} onChange={e => set('bestProductsButtonText', e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/40" />
            </div>
        </div>
    );

    return (
        <div className="w-full pb-12 space-y-4">

            {/* Admin toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Single Product <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Page CMS</span>
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Hover over any highlighted section and click the pencil to edit template content.</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    <select value={selId} onChange={e => setSelId(e.target.value)}
                        className="h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30 min-w-[180px]">
                        {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                        {products.length === 0 && <option value="">No products found</option>}
                    </select>
                    {saved && (
                        <span className="flex items-center gap-1.5 text-emerald-600 text-sm font-semibold bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5">
                            <CheckCircle size={14} weight="fill" /> Saved!
                        </span>
                    )}
                    <button onClick={save} disabled={saving}
                        className="flex items-center gap-2 h-10 px-5 rounded-xl !bg-indigo-600 disabled:opacity-60 text-white font-semibold text-sm shadow-lg shadow-indigo-500/20">
                        {saving ? <Spinner size="sm" color="white" /> : <FloppyDisk size={15} weight="bold" />} Save Template
                    </button>
                </div>
            </div>

            {/* ── Visual Page Replica ── */}
            <div className="bg-[#f2f2f2] rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden" style={{ fontFamily: 'system-ui, sans-serif' }}>

                {/* Breadcrumb */}
                <div className="bg-white px-8 py-3 border-b border-slate-100 text-sm text-slate-500 flex items-center gap-1.5">
                    <span className="hover:underline cursor-pointer">Shop all</span>
                    <CaretRight size={12} className="text-slate-400" />
                    <span className="hover:underline cursor-pointer">{product?.category || 'Category'}</span>
                    <CaretRight size={12} className="text-slate-400" />
                    <span className="font-semibold text-slate-900">{product?.name || 'Product Name'}</span>
                </div>

                {/* Hero */}
                <div className="bg-white px-6 lg:px-12 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto">

                        {/* Left — images */}
                        <div>
                            <div className="rounded-2xl border border-slate-100 bg-white flex items-center justify-center h-72 overflow-hidden">
                                {images[0]
                                    ? <img src={images[0]} alt={product?.name} className="max-h-full max-w-full object-contain p-4" />
                                    : <Package size={72} weight="thin" className="text-slate-300" />}
                            </div>
                            {images.length > 1 && (
                                <div className="flex gap-3 mt-3">
                                    {images.slice(1, 4).map((img, i) => (
                                        <div key={i} className="w-20 h-20 rounded-xl border-2 border-slate-200 bg-white flex items-center justify-center overflow-hidden cursor-pointer hover:border-orange-400 transition-colors">
                                            <img src={img} alt="" className="max-h-full max-w-full object-contain p-2" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right — details */}
                        <div className="space-y-4">
                            {/* Title */}
                            <div className="flex items-start justify-between gap-3">
                                <h1 className="text-2xl font-bold text-slate-900 leading-tight">{product?.name || 'Product Name'}</h1>
                                <div className="flex gap-2 shrink-0 mt-1">
                                    <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400"><Heart size={15} /></button>
                                    <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400"><ShareNetwork size={15} /></button>
                                </div>
                            </div>

                            {/* Rating + delivery */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
                                    <Stars count={5} size={11} />
                                    <span className="text-xs font-semibold text-amber-700">{product?.rating || '4.5'} ({product?.numReviews || 12})</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-3 py-1 text-xs font-semibold text-green-700">
                                    <Truck size={12} /> 2-4 days
                                </div>
                            </div>

                            {/* Rental period slider (visual only) */}
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-slate-700">Select your <u className="cursor-pointer">minimum rental period</u></span>
                                    <span className="text-sm font-bold text-slate-900">1 Month</span>
                                </div>
                                <div className="relative h-1 bg-slate-200 rounded-full my-4">
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-orange-500 border-2 border-white shadow-md" />
                                </div>
                                <div className="flex justify-between text-xs text-slate-500 font-medium">
                                    {['1+','3+','6+','9+','12+'].map(t => <span key={t}>{t}</span>)}
                                </div>
                                <div className="flex justify-between mt-2">
                                    <span className="text-xs text-orange-500 underline cursor-pointer">price breakdown</span>
                                    <span className="text-xs text-orange-500 underline cursor-pointer">compare all tenures</span>
                                </div>
                            </div>

                            {/* Price row */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-baseline gap-2 flex-wrap">
                                    <span className="text-2xl font-black text-orange-500">₹{price.toLocaleString('en-IN')}</span>
                                    <span className="text-sm text-slate-400">/month</span>
                                    <span className="text-sm text-slate-400 line-through">₹{origPrice.toLocaleString('en-IN')}</span>
                                    <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{disc}% off</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 shrink-0">
                                    <span>Quantity</span>
                                    <div className="flex items-center gap-2 border border-slate-200 rounded-full px-3 py-1">
                                        <button className="text-slate-400 font-bold">−</button>
                                        <span className="font-bold">1</span>
                                        <button className="text-slate-400 font-bold">+</button>
                                    </div>
                                </div>
                            </div>
                            <button className="text-orange-500 text-sm font-medium underline">View All Benefits</button>

                            {/* TEMPLATE: Benefits */}
                            <EditableSection sectionId="benefits" activeEdit={activeEdit} setActiveEdit={setActiveEdit} label="Benefits" panel={benefitsPanel}>
                                <div className="grid grid-cols-2 gap-2">
                                    {td.benefits.map(b => (
                                        <div key={b.id} className="bg-blue-600 text-white rounded-xl px-3 py-3 text-sm font-bold flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                                <CheckCircle size={11} weight="fill" />
                                            </div>
                                            {b.title}
                                        </div>
                                    ))}
                                </div>
                            </EditableSection>

                            {/* TEMPLATE: Deposit & KYC */}
                            <EditableSection sectionId="deposit" activeEdit={activeEdit} setActiveEdit={setActiveEdit} label="Deposit & KYC" panel={depositPanel}>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between">
                                        <span className="text-slate-600 text-sm font-medium">{td.depositLabel}</span>
                                        <span className="font-black text-slate-900">₹{(price * 2).toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="bg-purple-50 border border-purple-100 rounded-xl px-3 py-3">
                                        <span className="text-purple-700 text-xs leading-tight">{td.kycNote}</span>
                                    </div>
                                </div>
                            </EditableSection>

                            {/* Rent Now CTA */}
                            <button className="w-full py-4 rounded-2xl bg-yellow-400 text-slate-900 font-black text-lg shadow-lg">Rent Now</button>

                            {/* TEMPLATE: Policy links */}
                            <EditableSection sectionId="policy" activeEdit={activeEdit} setActiveEdit={setActiveEdit} label="Policy Links" panel={policyPanel}>
                                <div className="grid grid-cols-2 gap-3">
                                    {td.policyLinks.map(p => (
                                        <div key={p.id} className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-3 flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <Truck size={15} className="text-orange-500 shrink-0" />
                                                <span className="text-xs text-slate-700 font-medium leading-snug">{p.question}</span>
                                            </div>
                                            <span className="text-orange-500 text-xs font-bold whitespace-nowrap underline cursor-pointer">{p.linkText}</span>
                                        </div>
                                    ))}
                                </div>
                            </EditableSection>

                            {/* Delivery pincode */}
                            <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl bg-white text-sm">
                                <MapPin size={18} className="text-green-500 shrink-0" />
                                <span className="font-semibold text-slate-700">Delivery</span>
                                <div className="flex-1 h-9 bg-slate-50 border border-slate-200 rounded-lg px-3 flex items-center">
                                    <span className="text-slate-400 text-sm">Enter your pincode</span>
                                </div>
                                <span className="font-semibold text-slate-600 whitespace-nowrap text-xs">Check availability in your state</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Details Tabs */}
                <div className="bg-white mt-2 px-6 lg:px-12 py-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex gap-2 mb-8 flex-wrap">
                            {[['details','Product Details'],['return','Return Policy'],['shipping','Shipping Policy']].map(([key, label]) => (
                                <button key={key} onClick={() => setActiveTab(key)}
                                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${activeTab === key ? 'bg-slate-900 text-white' : 'border border-slate-200 text-slate-600 hover:border-slate-400'}`}>
                                    {label}
                                </button>
                            ))}
                        </div>
                        {activeTab === 'details' && (
                            <div className="grid grid-cols-2 gap-x-16 gap-y-5">
                                {specs.length > 0 ? specs.map((s, i) => (
                                    <div key={i} className="border-b border-slate-100 pb-4">
                                        <p className="text-xs font-black text-slate-800 uppercase tracking-wider">{s.key || s.label}</p>
                                        <p className="text-slate-600 mt-1">{s.value}</p>
                                    </div>
                                )) : [
                                    ['MODEL', product?.name || '—'],
                                    ['OPERATING SYSTEM', '—'],
                                    ['DISPLAY', '—'],
                                    ['MEMORY', '—'],
                                    ['GRAPHICS', '—'],
                                    ['PROCESSOR', '—'],
                                    ['DIMENSIONS', '—'],
                                    ['STORAGE', '—'],
                                ].map(([k, v]) => (
                                    <div key={k} className="border-b border-slate-100 pb-4">
                                        <p className="text-xs font-black text-slate-800 uppercase tracking-wider">{k}</p>
                                        <p className="text-slate-600 mt-1">{v}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        {activeTab !== 'details' && (
                            <p className="text-sm text-slate-400 italic">Policy content is managed in CMS → Static Pages.</p>
                        )}
                    </div>
                </div>

                {/* TEMPLATE: Customer Reviews */}
                <EditableSection sectionId="reviews" activeEdit={activeEdit} setActiveEdit={setActiveEdit} label="Customer Reviews" panel={reviewsPanel}>
                    <div className="bg-white px-6 lg:px-12 py-12 mt-2">
                        <div className="max-w-6xl mx-auto">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900">{td.reviewsTitle}</h2>
                                    <p className="text-slate-500 mt-2 max-w-lg leading-relaxed">{td.reviewsSubtitle}</p>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 shrink-0">
                                    <span className="text-blue-600 font-black text-2xl leading-none">G</span>
                                    <span>{td.googleReviewCount} reviews</span>
                                    <span className="text-slate-300 mx-1">|</span>
                                    <Stars count={5} size={14} />
                                    <span>{td.googleRating}</span>
                                </div>
                            </div>
                            <div className="columns-1 md:columns-3 gap-5 space-y-5">
                                {td.reviews.map(r => (
                                    <div key={r.id} className={`break-inside-avoid rounded-2xl p-5 border ${cardBg(r.color)}`}>
                                        <p className={`font-bold text-base ${nameColor(r.color)}`}>{r.name || 'Customer'}</p>
                                        <p className="text-slate-500 text-sm mb-3">{r.role || 'Role'}</p>
                                        <p className="text-slate-700 text-sm leading-relaxed mb-4">{r.text}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-blue-600 font-black text-xl leading-none">G</span>
                                            <Stars count={r.stars} size={14} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </EditableSection>

                {/* TEMPLATE: FAQs */}
                <EditableSection sectionId="faqs" activeEdit={activeEdit} setActiveEdit={setActiveEdit} label="FAQs" panel={faqsPanel}>
                    <div className="bg-[#f2f2f2] px-6 lg:px-12 py-14 mt-2">
                        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                            <div>
                                <h2 className="text-4xl font-black text-slate-900 mb-5">{td.faqTitle}</h2>
                                <p className="text-2xl font-black text-slate-900 leading-snug">{td.faqSubtitle}</p>
                            </div>
                            <div className="md:col-span-2 divide-y divide-slate-300">
                                {td.faqs.map(f => (
                                    <div key={f.id}>
                                        <button onClick={() => setOpenFaq(openFaq === f.id ? null : f.id)}
                                            className="w-full flex items-center justify-between py-5 text-left gap-4">
                                            <span className="font-bold text-slate-800 text-base">{f.question}</span>
                                            <span className="text-slate-500 text-sm font-bold shrink-0">{openFaq === f.id ? '∧' : '∨'}</span>
                                        </button>
                                        {openFaq === f.id && (
                                            <div className="pb-5 text-slate-600 text-sm leading-relaxed">{f.answer}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </EditableSection>

                {/* TEMPLATE: Best Rented Products */}
                <EditableSection sectionId="bestProducts" activeEdit={activeEdit} setActiveEdit={setActiveEdit} label="Best Rented Products" panel={bestPanel}>
                    <div className="bg-white px-6 lg:px-12 py-10 mt-2">
                        <div className="max-w-6xl mx-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-black text-slate-900">{td.bestProductsTitle}</h2>
                                <button className="px-5 py-2 rounded-full bg-yellow-400 text-slate-900 text-sm font-bold">
                                    {td.bestProductsButtonText}
                                </button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {(products.length > 0 ? products : Array(4).fill(null)).slice(0, 4).map((p, i) => (
                                    <div key={p?._id || i} className="rounded-2xl border border-slate-100 bg-white overflow-hidden">
                                        <div className="relative">
                                            <div className="absolute top-2 left-2 flex gap-1">
                                                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">-20% off</span>
                                                <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">New</span>
                                            </div>
                                            <div className="h-40 bg-slate-50 flex items-center justify-center p-4">
                                                {p?.images?.[0]
                                                    ? <img src={p.images[0]} alt={p.name} className="max-h-full max-w-full object-contain" />
                                                    : <Package size={40} weight="thin" className="text-slate-300" />}
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <p className="text-sm font-bold text-slate-800 truncate">{p?.name || 'Product Name'}</p>
                                            <div className="flex items-center gap-1 my-1">
                                                <Stars count={5} size={10} />
                                                <span className="text-[10px] text-slate-500">4.5 (12)</span>
                                                <span className="ml-auto text-[10px] text-slate-400 flex items-center gap-0.5"><Truck size={10} /> 2-4 days</span>
                                            </div>
                                            <div className="flex items-baseline gap-1 flex-wrap">
                                                <span className="text-[10px] text-slate-400">from</span>
                                                <span className="text-xs text-slate-400 line-through">₹{Math.round((p?.rentPrice || 5000) * 1.5).toLocaleString('en-IN')}</span>
                                                <span className="text-sm font-black text-orange-500">₹{(p?.rentPrice || 5000).toLocaleString('en-IN')}</span>
                                                <span className="text-[10px] text-slate-400">/month</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </EditableSection>

            </div>
        </div>
    );
}
