'use client';
import toast from 'react-hot-toast';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Chip, Spinner } from '@heroui/react';
import {
    FileText, LinkSimple, FloppyDisk, PencilSimple,
    ArrowLeft, CheckCircle, Globe, Warning,
    Image as PhosphorImage, TextB, TextItalic, TextUnderline,
    ListBullets, ListNumbers, Quotes, Link as LinkIcon,
    Eye, Code, ArrowCounterClockwise
} from '@phosphor-icons/react';
import Toggle from '@/components/Toggle';
import ImageUploader from '@/components/ImageUploader';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

const PAGES = [
    { key: 'about', label: 'About Us', slug: '/about', specialized: true },
    { key: 'rental-process', label: 'Rental Process', slug: '/rental-process', specialized: true },
    { key: 'terms', label: 'Rental Terms', slug: '/terms' },
    { key: 'privacy', label: 'Privacy Policy', slug: '/privacy' },
    { key: 'kyc-policy', label: 'KYC Policy', slug: '/kyc-policy' },
    { key: 'shipping', label: 'Shipping & Delivery', slug: '/shipping' },
    { key: 'refund', label: 'Return & Refund Policy', slug: '/refund-policy' },
    { key: 'faq', label: 'FAQ / Help Center', slug: '/faq', specialized: true },
    { key: 'contact', label: 'Contact Us', slug: '/contact', specialized: true },
    { key: 'delivery-charges', label: 'Delivery Charges', slug: '/delivery-charges' },
    { key: 'late-fee-rules', label: 'Late Fee Rules', slug: '/late-fee-rules' },
    { key: 'cancellation-rules', label: 'Cancellation Rules', slug: '/cancellation-rules' },
    { key: 'subscription-rules', label: 'Subscription Rules', slug: '/subscription-rules' },
];

const PAGE_ICONS = {
    'about': '🏢', 'rental-process': '🔄', 'terms': '📋',
    'privacy': '🔒', 'shipping': '🚚', 'refund': '↩️', 'faq': '❓', 'contact': '📞',
    'kyc-policy': '🆔', 'rules': '📜',
    'delivery-charges': '🚚', 'late-fee-rules': '⏰', 'cancellation-rules': '❌', 'subscription-rules': '🔄',
};

const DEFAULTS = {
    bannerImage: '', bannerTitle: '', pageContent: '',
    metaTitle: '', metaDescription: '', publishStatus: 'published'
};

// ── Field ──────────────────────────────────────────────────────────────────────
const Field = ({ label, value, onChange, placeholder, rows, type = 'text' }) => (
    <div className="flex flex-col gap-1.5">
        {label && <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>}
        {rows ? (
            <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
                className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all resize-none font-mono" />
        ) : (
            <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
                className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all" />
        )}
    </div>
);

// ── HTML Toolbar Button ────────────────────────────────────────────────────────
const ToolBtn = ({ icon, title, onClick, active }) => (
    <button type="button" title={title} onClick={onClick}
        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all ${active ? 'bg-indigo-100 dark:!bg-indigo-500/20 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:!bg-slate-100 dark:hover:!bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200'}`}>
        {icon}
    </button>
);

// ── Rich HTML Editor ───────────────────────────────────────────────────────────
function HtmlEditor({ value, onChange }) {
    const [preview, setPreview] = useState(false);
    const taRef = useRef(null);

    const wrap = (before, after = '') => {
        const ta = taRef.current;
        if (!ta) return;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const selected = value.substring(start, end);
        const newVal = value.substring(0, start) + before + selected + after + value.substring(end);
        onChange(newVal);
        setTimeout(() => {
            ta.focus();
            ta.setSelectionRange(start + before.length, end + before.length);
        }, 10);
    };

    const insertBlock = (tag) => {
        const ta = taRef.current;
        if (!ta) return;
        const pos = ta.selectionStart;
        const insert = `\n<${tag}></${tag}>\n`;
        const newVal = value.substring(0, pos) + insert + value.substring(pos);
        onChange(newVal);
        setTimeout(() => { ta.focus(); ta.setSelectionRange(pos + insert.length - `</${tag}>\n`.length, pos + insert.length - `</${tag}>\n`.length); }, 10);
    };

    const wrapBlock = (tag) => {
        const ta = taRef.current;
        if (!ta) return;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const selected = value.substring(start, end) || 'Your text here';
        const block = `<${tag}>${selected}</${tag}>`;
        const newVal = value.substring(0, start) + block + value.substring(end);
        onChange(newVal);
        setTimeout(() => { ta.focus(); }, 10);
    };

    const insertList = (tag) => {
        const ta = taRef.current;
        if (!ta) return;
        const pos = ta.selectionStart;
        const block = `\n<${tag}>\n  <li>Item 1</li>\n  <li>Item 2</li>\n  <li>Item 3</li>\n</${tag}>\n`;
        const newVal = value.substring(0, pos) + block + value.substring(pos);
        onChange(newVal);
        setTimeout(() => { ta.focus(); }, 10);
    };

    const formatInsert = (tag) => {
        const ta = taRef.current;
        if (!ta) return;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const selected = value.substring(start, end);
        const newVal = value.substring(0, start) + `<${tag}>${selected || 'text'}</${tag}>` + value.substring(end);
        onChange(newVal);
        setTimeout(() => { ta.focus(); }, 10);
    };

    const TOOLBAR = [
        { icon: <span className="font-black text-xs">H2</span>, title: 'Heading 2', fn: () => wrapBlock('h2') },
        { icon: <span className="font-black text-xs">H3</span>, title: 'Heading 3', fn: () => wrapBlock('h3') },
        { icon: <span className="font-black text-xs">H4</span>, title: 'Heading 4', fn: () => wrapBlock('h4') },
        { icon: <span className="font-bold text-xs">¶</span>, title: 'Paragraph', fn: () => wrapBlock('p') },
        { divider: true },
        { icon: <TextB size={14} weight="bold" />, title: 'Bold', fn: () => formatInsert('strong') },
        { icon: <TextItalic size={14} />, title: 'Italic', fn: () => formatInsert('em') },
        { icon: <TextUnderline size={14} />, title: 'Underline', fn: () => formatInsert('u') },
        { divider: true },
        { icon: <ListBullets size={14} />, title: 'Bullet List', fn: () => insertList('ul') },
        { icon: <ListNumbers size={14} />, title: 'Numbered List', fn: () => insertList('ol') },
        { divider: true },
        { icon: <Quotes size={14} />, title: 'Blockquote', fn: () => wrapBlock('blockquote') },
        { icon: <span className="text-xs font-mono">—</span>, title: 'Divider', fn: () => { const ta = taRef.current; if (!ta) return; const pos = ta.selectionStart; const newVal = value.substring(0, pos) + '\n<hr />\n' + value.substring(pos); onChange(newVal); } },
    ];

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Page Content (HTML)</label>
                <button type="button" onClick={() => setPreview(!preview)}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${preview ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}>
                    {preview ? <Code size={12} /> : <Eye size={12} />}
                    {preview ? 'Edit HTML' : 'Preview'}
                </button>
            </div>

            {!preview ? (
                <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                    {/* Toolbar */}
                    <div className="flex items-center gap-0.5 px-2 py-1.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex-wrap">
                        {TOOLBAR.map((btn, i) =>
                            btn.divider
                                ? <div key={i} className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1" />
                                : <ToolBtn key={i} icon={btn.icon} title={btn.title} onClick={btn.fn} />
                        )}
                        <div className="flex-1" />
                        <span className="text-[10px] text-slate-400">{value.length.toLocaleString()} chars</span>
                    </div>
                    {/* Textarea */}
                    <textarea
                        ref={taRef}
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        placeholder="Enter your page content as HTML. Use the toolbar above to insert elements, or type HTML directly."
                        rows={16}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none font-mono resize-y"
                        style={{ minHeight: '320px' }}
                    />
                </div>
            ) : (
                <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                    <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
                        <Eye size={12} className="text-slate-400" />
                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Live Preview</span>
                    </div>
                    <div
                        className="p-6 bg-white dark:bg-slate-950 min-h-[320px] text-sm text-slate-800 dark:text-slate-200 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1.5 [&_h4]:font-semibold [&_h4]:mt-2 [&_p]:mb-3 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3 [&_li]:mb-1 [&_blockquote]:border-l-4 [&_blockquote]:border-indigo-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-500 [&_hr]:border-slate-200 [&_hr]:my-4 [&_strong]:font-bold [&_a]:text-indigo-600 [&_a]:underline"
                        dangerouslySetInnerHTML={{ __html: value || '<p style="color:#9ca3af;font-style:italic">Nothing to preview yet…</p>' }}
                    />
                </div>
            )}
        </div>
    );
}

// ── Page Editor ────────────────────────────────────────────────────────────────
function PageEditor({ page, onBack }) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [data, setData] = useState(DEFAULTS);
    const set = (k, v) => setData(p => ({ ...p, [k]: v }));

    const fetch_ = useCallback(async () => {
        try {
            setLoading(true);
            const res = await window.fetch(`${API}/api/cms/${page.key}?t=${Date.now()}`);
            if (res.ok) setData({ ...DEFAULTS, ...(await res.json()) });
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }, [page.key]);

    useEffect(() => { fetch_(); }, [fetch_]);

    const save = async () => {
        try {
            setSaving(true);
            const res = await window.fetch(`${API}/api/cms/${page.key}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error((await res.json()).message || 'Failed');
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (e) { toast.error(e.message); }
        finally { setSaving(false); }
    };

    if (loading) return (
        <div className="flex items-center justify-center gap-3 py-24 text-slate-400">
            <Spinner size="sm" color="secondary" /> Loading {page.label}…
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            {/* Sub-header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="w-9 h-9 rounded-xl !bg-slate-100 dark:!bg-slate-800 flex items-center justify-center text-slate-500 hover:!bg-slate-200 dark:hover:!bg-slate-700 transition-all">
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-xl">{PAGE_ICONS[page.key] || '📄'}</span>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{page.label}</h2>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-400 font-mono mt-0.5">
                            <LinkSimple size={11} />{page.slug}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {saved && (
                        <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-semibold bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5">
                            <CheckCircle size={12} weight="fill" /> Saved!
                        </span>
                    )}
                    <Chip size="sm" color={data.publishStatus === 'published' ? 'success' : 'warning'} variant="flat"
                        startContent={data.publishStatus === 'published' ? <Globe size={11} /> : <Warning size={11} />}>
                        {data.publishStatus === 'published' ? 'Live' : 'Draft'}
                    </Chip>
                    <button onClick={save} disabled={saving}
                        className="flex items-center gap-2 h-9 px-4 rounded-xl !bg-indigo-600 hover:!bg-indigo-700 disabled:opacity-60 text-white font-semibold text-sm shadow-lg shadow-indigo-500/20 transition-all">
                        {saving ? <Spinner size="sm" color="white" /> : <FloppyDisk size={15} weight="bold" />} Save
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 space-y-8 shadow-sm">
                {/* Banner */}
                <div>
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-4">📸 Page Banner</h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <Field label="Banner Title" value={data.bannerTitle} onChange={v => set('bannerTitle', v)} placeholder={page.label} />
                            <ImageUploader label="Banner Image" existingUrl={data.bannerImage} onUpload={url => set('bannerImage', url)} />
                            {!data.bannerImage && (
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Or paste image URL</label>
                                    <div className="relative">
                                        <PhosphorImage size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                        <input type="url" value={data.bannerImage} onChange={e => set('bannerImage', e.target.value)}
                                            placeholder="https://res.cloudinary.com/..."
                                            className="w-full h-10 pl-9 pr-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all" />
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* Preview */}
                        <div className="h-40 rounded-2xl relative overflow-hidden border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 flex items-center justify-center"
                            style={data.bannerImage ? { backgroundImage: `url(${data.bannerImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                            {data.bannerImage ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                    <p className="text-white font-bold text-lg text-center px-4">{data.bannerTitle || page.label}</p>
                                </div>
                            ) : (
                                <span className="text-xs text-slate-400">Banner preview</span>
                            )}
                        </div>
                    </div>
                </div>

                <hr className="border-slate-100 dark:border-slate-800" />

                {/* HTML Content Editor */}
                <div>
                    <HtmlEditor value={data.pageContent} onChange={v => set('pageContent', v)} />
                    <p className="text-xs text-slate-400 mt-2">
                        💡 Tip: Use <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">&lt;h2&gt;</code>, <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">&lt;p&gt;</code>, <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">&lt;ul&gt;&lt;li&gt;</code> tags. This is rendered directly on the public page.
                    </p>
                </div>

                <hr className="border-slate-100 dark:border-slate-800" />

                {/* SEO */}
                <div>
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-4">🔍 SEO Settings</h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <Field label="Meta Title" value={data.metaTitle} onChange={v => set('metaTitle', v)} placeholder={`${page.label} – IndianRentals`} />
                            <p className="text-xs text-slate-400">{data.metaTitle.length}/60</p>
                        </div>
                        <div className="space-y-1">
                            <Field label="Meta Description" value={data.metaDescription} onChange={v => set('metaDescription', v)} placeholder="A short description for search engines." rows={3} />
                            <p className="text-xs text-slate-400">{data.metaDescription.length}/160</p>
                        </div>
                    </div>
                    {/* Google Preview */}
                    <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-2">Google Preview</p>
                        <p className="text-blue-600 text-sm font-medium truncate">{data.metaTitle || `${page.label} – IndianRentals`}</p>
                        <p className="text-green-700 text-xs">indianrenters.com{page.slug}</p>
                        <p className="text-slate-600 text-xs mt-1 line-clamp-2">{data.metaDescription || 'No description set. Add a meta description for better search visibility.'}</p>
                    </div>
                </div>

                <hr className="border-slate-100 dark:border-slate-800" />

                {/* Publish Toggle */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-100">Publish Status</p>
                        <p className="text-xs text-slate-500">When disabled the page returns a draft notice.</p>
                    </div>
                    <Toggle isSelected={data.publishStatus === 'published'} onValueChange={v => set('publishStatus', v ? 'published' : 'draft')} />
                </div>
            </div>
        </motion.div>
    );
}

// ── Pages List ─────────────────────────────────────────────────────────────────
export default function StaticPages() {
    const router = useRouter();
    const [selected, setSelected] = useState(null);
    const [statuses, setStatuses] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchStatuses = useCallback(async () => {
        try {
            setLoading(true);
            const token = getToken();
            if (!token) {
                router.replace('/login');
                return;
            }
            const res = await window.fetch(`${API}/api/cms?t=${Date.now()}`, { headers: { Authorization: `Bearer ${token}` } });
            if (res.status === 401) {
                // Token expired — clear it and redirect to login
                localStorage.removeItem('adminToken');
                router.replace('/login');
                return;
            }
            if (res.ok) {
                const list = await res.json();
                const map = {};
                list.forEach(p => { map[p.pageName] = p; });
                setStatuses(map);
            }
        } catch (e) { console.error('CMS fetch error:', e); }
        finally { setLoading(false); }
    }, [router]);

    useEffect(() => { fetchStatuses(); }, [fetchStatuses]);

    const editingPage = PAGES.find(p => p.key === selected);

    return (
        <div className="w-full space-y-6 pb-12">
            {!selected && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Static <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Pages</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Manage content, banners, and SEO for all informational pages.</p>
                </motion.div>
            )}

            <AnimatePresence mode="wait">
                {selected && editingPage ? (
                    <PageEditor key={selected} page={editingPage} onBack={() => { setSelected(null); fetchStatuses(); }} />
                ) : (
                    <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        {loading ? (
                            <div className="flex items-center justify-center gap-3 py-24 text-slate-400">
                                <Spinner size="sm" color="secondary" /> Loading…
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-3">
                                {PAGES.map((page, i) => {
                                    const info = statuses[page.key];
                                    const status = info?.publishStatus || 'published';
                                    const hasContent = !!(info?.pageContent);
                                    const hasBanner = !!(info?.bannerImage);
                                    const updated = info?.updatedAt
                                        ? new Date(info.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                                        : 'Never edited';
                                    return (
                                        <motion.div key={page.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400/50 rounded-2xl transition-all duration-200 shadow-sm group cursor-pointer"
                                                onClick={() => {
                                                    if (page.specialized) {
                                                        router.push(`/dashboard/cms/${page.key}`);
                                                    } else {
                                                        setSelected(page.key);
                                                    }
                                                }}>
                                                <div className="p-5 flex flex-row items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-2xl shrink-0">
                                                        {PAGE_ICONS[page.key] || '📄'}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">{page.label}</p>
                                                        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
                                                            <LinkSimple size={10} weight="bold" />{page.slug}
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-1.5">
                                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${hasContent ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-amber-50 text-amber-600 border border-amber-200'}`}>
                                                                {hasContent ? '✓ Has content' : '⚠ No content'}
                                                            </span>
                                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${hasBanner ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-slate-50 text-slate-400 border border-slate-200'}`}>
                                                                {hasBanner ? '🖼 Banner set' : '🖼 No banner'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="text-xs text-slate-400 hidden md:block shrink-0">{updated}</div>
                                                    <Chip size="sm" color={status === 'published' ? 'success' : 'warning'} variant="flat">
                                                        {status === 'published' ? 'Live' : 'Draft'}
                                                    </Chip>
                                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-indigo-500 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 transition-all">
                                                        <PencilSimple size={16} />
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
