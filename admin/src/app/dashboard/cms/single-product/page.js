'use client';
import toast from 'react-hot-toast';
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Spinner } from '@heroui/react';
import { FloppyDisk, CheckCircle, Plus, Trash, Star } from '@phosphor-icons/react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

const DEFAULTS = {
    // Benefits tiles
    benefits: [
        { id: 1, title: 'Fully Functional' },
        { id: 2, title: 'Accessories Included' },
        { id: 3, title: 'Free Repairs & Maintenance' },
        { id: 4, title: 'Professionally Sanitized' },
    ],
    // Policy banner links below "Rent Now"
    policyLinks: [
        { id: 1, question: 'What if I cancel or return before 6 months?', linkText: 'View Details' },
        { id: 2, question: 'How do I extend tenure after 6 months?', linkText: 'View Details' },
    ],
    // Deposit & KYC row
    depositLabel: '100% Refundable Deposit',
    kycNote: 'Place Order & complete KYC anytime to get your items the next day',
    // Reviews section
    reviewsTitle: 'What Our Customers Say',
    reviewsSubtitle: 'Real experiences from innovators, businesses, and creators powering their ambitions with IndianRenters.',
    googleReviewCount: '5000+',
    googleRating: '4.9',
    reviews: [
        { id: 1, name: 'John Doe', role: 'AI Engineer', text: 'Lorem ipsum velit laoreet tincidunt dolor donec at urna vestibulum nunc accumsan porttitor consequat tellus.', stars: 5, color: 'yellow' },
        { id: 2, name: 'Jane Smith', role: 'Product Designer', text: 'Amazing service! The products are always in great condition and delivery is super fast.', stars: 5, color: 'blue' },
        { id: 3, name: 'Raj Kumar', role: 'Startup Founder', text: 'IndianRenters helped us scale our office setup without huge upfront costs. Highly recommend!', stars: 5, color: 'green' },
    ],
    // FAQs section
    faqTitle: 'FAQs',
    faqSubtitle: 'Everything you need to know about renting with IndianRenters.com',
    faqs: [
        { id: 1, question: 'What is the minimum rental period?', answer: 'The minimum rental period is 1 day. You can choose from flexible tenures of 1 day, 1 week, 1 month, 3 months, 6 months, or 12 months. Longer commitments come at lower monthly rates.' },
        { id: 2, question: 'Is maintenance included?', answer: 'Yes. Maintenance and support are included for the full rental period. For any technical issues, contact our support team.' },
        { id: 3, question: 'What if I want to extend my rental?', answer: 'Contact us at least 3-5 days before your scheduled return date. We will adjust your plan and billing from there.' },
        { id: 4, question: 'What happens if the product gets damaged?', answer: 'Normal wear and tear is accepted. For accidental damage, contact us right away — do not attempt repairs yourself.' },
    ],
    // Best Rented Products section
    bestProductsTitle: 'Best Rented Products',
    bestProductsButtonText: 'View All',
};

// ── Shared field components ────────────────────────────────────────────────────
const Label = ({ children }) => (
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{children}</label>
);

const TextInput = ({ label, value, onChange, placeholder }) => (
    <div>
        {label && <Label>{label}</Label>}
        <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
            className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all" />
    </div>
);

const TextArea = ({ label, value, onChange, placeholder, rows = 3 }) => (
    <div>
        {label && <Label>{label}</Label>}
        <textarea value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
            className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all resize-none" />
    </div>
);

const Section = ({ title, description, children }) => (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">{title}</h3>
            {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
        </div>
        {children}
    </div>
);

const REVIEW_COLORS = ['yellow', 'blue', 'green', 'pink', 'purple', 'white'];

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function SingleProductPageCMS() {
    const [data, setData] = useState(DEFAULTS);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const set = (key, val) => setData(prev => ({ ...prev, [key]: val }));

    const updateItem = (key, id, field, val) =>
        set(key, data[key].map(item => item.id === id ? { ...item, [field]: val } : item));

    const removeItem = (key, id) =>
        set(key, data[key].filter(item => item.id !== id));

    const addItem = (key, newItem) =>
        set(key, [...data[key], { id: Date.now(), ...newItem }]);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API}/api/cms/single-product-page?t=${Date.now()}`);
            if (res.ok) setData({ ...DEFAULTS, ...(await res.json()) });
        } catch {
            // Use defaults if API unavailable
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const save = async () => {
        setSaving(true);
        try {
            const res = await fetch(`${API}/api/cms/single-product-page`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error((await res.json())?.message || 'Save failed');
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
            toast.success('Single Product Page saved!');
        } catch (e) {
            toast.error(e.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <Spinner color="primary" />
        </div>
    );

    return (
        <div className="space-y-6 max-w-5xl pb-12">

            {/* Header */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Single Product <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Page CMS</span>
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Edit every section of the product detail page template.</p>
                </div>
                <div className="flex items-center gap-3">
                    {saved && (
                        <span className="flex items-center gap-1.5 text-emerald-600 text-sm font-semibold bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5">
                            <CheckCircle size={14} weight="fill" /> Saved!
                        </span>
                    )}
                    <button onClick={save} disabled={saving}
                        className="flex items-center gap-2 h-10 px-5 rounded-xl !bg-indigo-600 disabled:opacity-60 text-white font-semibold text-sm shadow-lg shadow-indigo-500/20">
                        {saving ? <Spinner size="sm" color="white" /> : <FloppyDisk size={15} weight="bold" />} Save Changes
                    </button>
                </div>
            </motion.div>

            {/* 1. Benefits */}
            <Section title="What's Included — Benefit Tiles" description="The 4 blue benefit tiles shown below the pricing panel on every product page.">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.benefits.map((b, i) => (
                        <div key={b.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                            <Label>Benefit {i + 1}</Label>
                            <input type="text" value={b.title}
                                onChange={e => updateItem('benefits', b.id, 'title', e.target.value)}
                                placeholder={`Benefit ${i + 1} title`}
                                className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all" />
                        </div>
                    ))}
                </div>
            </Section>

            {/* 2. Policy Banner Links */}
            <Section title="Policy Banner Links" description='The two info boxes shown below the "Rent Now" button (cancel/return & tenure extension).'>
                <div className="space-y-4">
                    {data.policyLinks.map((p, i) => (
                        <div key={p.id} className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                            <div className="sm:col-span-2">
                                <TextInput label={`Policy ${i + 1} — Question Text`} value={p.question}
                                    onChange={v => updateItem('policyLinks', p.id, 'question', v)}
                                    placeholder="e.g. What if I cancel before 6 months?" />
                            </div>
                            <TextInput label="Link Label" value={p.linkText}
                                onChange={v => updateItem('policyLinks', p.id, 'linkText', v)}
                                placeholder="View Details" />
                        </div>
                    ))}
                </div>
            </Section>

            {/* 3. Deposit & KYC */}
            <Section title="Deposit & KYC Notice Row" description="The row showing refundable deposit amount and the KYC delivery note.">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextInput label="Refundable Deposit Label" value={data.depositLabel}
                        onChange={v => set('depositLabel', v)} placeholder="100% Refundable Deposit" />
                    <TextInput label="KYC Notice Text" value={data.kycNote}
                        onChange={v => set('kycNote', v)} placeholder="Place Order & complete KYC anytime..." />
                </div>
            </Section>

            {/* 4. Customer Reviews */}
            <Section title="Customer Reviews Section" description={'"What Our Customers Say" section with Google rating and review cards.'}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextInput label="Section Title" value={data.reviewsTitle} onChange={v => set('reviewsTitle', v)} placeholder="What Our Customers Say" />
                    <div className="grid grid-cols-2 gap-3">
                        <TextInput label="Google Review Count" value={data.googleReviewCount} onChange={v => set('googleReviewCount', v)} placeholder="5000+" />
                        <TextInput label="Google Rating" value={data.googleRating} onChange={v => set('googleRating', v)} placeholder="4.9" />
                    </div>
                </div>
                <TextArea label="Section Subtitle" value={data.reviewsSubtitle} onChange={v => set('reviewsSubtitle', v)} rows={2}
                    placeholder="Real experiences from innovators, businesses, and creators..." />

                <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
                    <div className="flex items-center justify-between mb-4">
                        <Label>Review Cards ({data.reviews.length})</Label>
                        <button onClick={() => addItem('reviews', { name: '', role: '', text: '', stars: 5, color: 'yellow' })}
                            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg !bg-indigo-600 text-white font-bold text-xs shadow-sm">
                            <Plus weight="bold" size={12} /> Add Review
                        </button>
                    </div>
                    <div className="space-y-4">
                        {data.reviews.map((r, i) => (
                            <div key={r.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Review {i + 1}</span>
                                    <button onClick={() => removeItem('reviews', r.id)}
                                        className="w-7 h-7 rounded-lg flex items-center justify-center text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
                                        <Trash weight="bold" size={13} />
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <TextInput label="Name" value={r.name} onChange={v => updateItem('reviews', r.id, 'name', v)} placeholder="John Doe" />
                                    <TextInput label="Role / Title" value={r.role} onChange={v => updateItem('reviews', r.id, 'role', v)} placeholder="AI Engineer" />
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="col-span-2">
                                        <TextArea label="Review Text" value={r.text} onChange={v => updateItem('reviews', r.id, 'text', v)} rows={3} placeholder="Review text..." />
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <Label>Stars (1–5)</Label>
                                            <input type="number" min={1} max={5} value={r.stars}
                                                onChange={e => updateItem('reviews', r.id, 'stars', Math.min(5, Math.max(1, Number(e.target.value))))}
                                                className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all" />
                                        </div>
                                        <div>
                                            <Label>Card Color</Label>
                                            <select value={r.color} onChange={e => updateItem('reviews', r.id, 'color', e.target.value)}
                                                className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all capitalize">
                                                {REVIEW_COLORS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                                            </select>
                                        </div>
                                        <div className="flex gap-0.5 mt-1">
                                            {[1,2,3,4,5].map(n => (
                                                <Star key={n} weight={n <= r.stars ? 'fill' : 'regular'} size={14}
                                                    className={n <= r.stars ? 'text-amber-400' : 'text-slate-300'} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Section>

            {/* 5. FAQs */}
            <Section title="FAQs Section" description="The expandable FAQ accordion shown at the bottom of the product page.">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextInput label="FAQ Section Title" value={data.faqTitle} onChange={v => set('faqTitle', v)} placeholder="FAQs" />
                    <TextArea label="FAQ Section Subtitle" value={data.faqSubtitle} onChange={v => set('faqSubtitle', v)} rows={2}
                        placeholder="Everything you need to know about renting with IndianRenters.com" />
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
                    <div className="flex items-center justify-between mb-4">
                        <Label>FAQ Items ({data.faqs.length})</Label>
                        <button onClick={() => addItem('faqs', { question: '', answer: '' })}
                            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg !bg-indigo-600 text-white font-bold text-xs shadow-sm">
                            <Plus weight="bold" size={12} /> Add FAQ
                        </button>
                    </div>
                    <div className="space-y-3">
                        {data.faqs.map((f, i) => (
                            <div key={f.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">FAQ {i + 1}</span>
                                    <button onClick={() => removeItem('faqs', f.id)}
                                        className="w-7 h-7 rounded-lg flex items-center justify-center text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
                                        <Trash weight="bold" size={13} />
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    <TextInput label="Question" value={f.question}
                                        onChange={v => updateItem('faqs', f.id, 'question', v)}
                                        placeholder="e.g. What is the minimum rental period?" />
                                    <TextArea label="Answer" value={f.answer}
                                        onChange={v => updateItem('faqs', f.id, 'answer', v)} rows={3}
                                        placeholder="Answer text shown when FAQ is expanded..." />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Section>

            {/* 6. Best Rented Products */}
            <Section title="Best Rented Products Section" description="The product carousel section shown at the bottom of every product page.">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextInput label="Section Title" value={data.bestProductsTitle}
                        onChange={v => set('bestProductsTitle', v)} placeholder="Best Rented Products" />
                    <TextInput label='"View All" Button Text' value={data.bestProductsButtonText}
                        onChange={v => set('bestProductsButtonText', v)} placeholder="View All" />
                </div>
            </Section>

        </div>
    );
}
