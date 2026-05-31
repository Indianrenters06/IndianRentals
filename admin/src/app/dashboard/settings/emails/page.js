'use client';
import { useState, useEffect, useCallback } from 'react';
import { Spinner } from '@heroui/react';
import toast from 'react-hot-toast';
import {
    EnvelopeSimple, Plus, PencilSimple, Trash, X, FloppyDisk,
    MagnifyingGlass, Tag, CheckCircle, XCircle, Eye, Code, Info,
    UploadSimple, Lightning
} from '@phosphor-icons/react';
import { EMAIL_PRESETS } from './presets';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

const TYPES = ['all', 'auth', 'order', 'kyc', 'rental', 'payment', 'promotional', 'other'];

const TYPE_COLORS = {
    auth: 'bg-purple-100 text-purple-700',
    order: 'bg-blue-100 text-blue-700',
    kyc: 'bg-yellow-100 text-yellow-700',
    rental: 'bg-green-100 text-green-700',
    payment: 'bg-emerald-100 text-emerald-700',
    promotional: 'bg-pink-100 text-pink-700',
    other: 'bg-slate-100 text-slate-600',
};

const SUGGESTED_VARS = ['{{userName}}', '{{email}}', '{{otp}}', '{{orderId}}', '{{productName}}', '{{amount}}', '{{link}}', '{{date}}', '{{siteName}}', '{{phoneNumber}}'];

const EMPTY_FORM = { name: '', type: 'auth', subject: '', body: '', variables: [], isActive: true };

function TemplateModal({ template, onClose, onSave }) {
    const [form, setForm] = useState(template ? { ...template, variables: template.variables || [] } : { ...EMPTY_FORM });
    const [saving, setSaving] = useState(false);
    const [preview, setPreview] = useState(false);
    const [varInput, setVarInput] = useState('');

    const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

    const handleHtmlUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.name.endsWith('.html') && !file.name.endsWith('.htm')) {
            toast.error('Please upload a .html or .htm file');
            return;
        }
        const reader = new FileReader();
        reader.onload = (ev) => {
            set('body', ev.target.result);
            setPreview(true);
            toast.success(`Loaded "${file.name}"`);
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    const addVar = (v) => {
        const trimmed = v.trim();
        if (!trimmed) return;
        const formatted = trimmed.startsWith('{{') ? trimmed : `{{${trimmed}}}`;
        if (!form.variables.includes(formatted)) set('variables', [...form.variables, formatted]);
        setVarInput('');
    };

    const removeVar = (v) => set('variables', form.variables.filter(x => x !== v));

    const insertVar = (v) => {
        set('body', form.body + v);
    };

    const handleSave = async () => {
        if (!form.name.trim() || !form.subject.trim() || !form.body.trim()) {
            toast.error('Name, subject and body are required');
            return;
        }
        setSaving(true);
        try {
            const method = template?._id ? 'PUT' : 'POST';
            const url = template?._id
                ? `${API}/api/email-templates/${template._id}`
                : `${API}/api/email-templates`;
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error((await res.json()).message || 'Save failed');
            const saved = await res.json();
            toast.success(template?._id ? 'Template updated!' : 'Template created!');
            onSave(saved);
        } catch (e) {
            toast.error(e.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-slate-200 dark:border-slate-700">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                            <EnvelopeSimple size={18} className="text-indigo-600 dark:text-indigo-400" weight="bold" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                {template?._id ? 'Edit Email Template' : 'New Email Template'}
                            </h2>
                            <p className="text-xs text-slate-400">Use {'{{variableName}}'} for dynamic values</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <X size={16} weight="bold" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                    {/* Row 1: Name + Type + Active */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Template Name *</label>
                            <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. OTP Verification"
                                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-400/40" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Type</label>
                            <select value={form.type} onChange={e => set('type', e.target.value)}
                                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 capitalize">
                                {TYPES.filter(t => t !== 'all').map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Subject */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Subject Line *</label>
                        <input value={form.subject} onChange={e => set('subject', e.target.value)} placeholder="e.g. Your OTP for IndianRentals is {{otp}}"
                            className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-400/40" />
                    </div>

                    {/* Variables */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Template Variables</label>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                            {form.variables.map(v => (
                                <span key={v} className="inline-flex items-center gap-1 h-7 px-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-xs font-mono font-medium">
                                    {v}
                                    <button onClick={() => removeVar(v)} className="text-indigo-400 hover:text-indigo-700">
                                        <X size={10} weight="bold" />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2 mb-2">
                            <input value={varInput} onChange={e => setVarInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addVar(varInput))}
                                placeholder="Add variable (e.g. otp or {{otp}})"
                                className="flex-1 h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-400/40" />
                            <button onClick={() => addVar(varInput)}
                                className="h-9 px-3 rounded-xl bg-indigo-600 text-white text-xs font-bold">Add</button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            <span className="text-[10px] text-slate-400 font-medium mr-1 flex items-center">Suggestions:</span>
                            {SUGGESTED_VARS.map(v => (
                                <button key={v} onClick={() => { addVar(v); insertVar(v); }}
                                    className="h-6 px-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-mono hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                                    {v}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Body */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Body (HTML) *</label>
                            <div className="flex items-center gap-2">
                                {/* Upload HTML file */}
                                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 h-7 px-3 rounded-lg bg-slate-100 dark:bg-slate-700 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                                    <UploadSimple size={13} weight="bold" /> Upload HTML
                                    <input type="file" accept=".html,.htm" className="hidden" onChange={handleHtmlUpload} />
                                </label>
                                <button onClick={() => setPreview(p => !p)}
                                    className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 h-7 px-3 rounded-lg bg-indigo-50 dark:bg-indigo-500/10">
                                    {preview ? <><Code size={13} weight="bold" /> Edit</> : <><Eye size={13} weight="bold" /> Preview</>}
                                </button>
                            </div>
                        </div>
                        {preview ? (
                            <div className="min-h-[240px] border border-slate-200 dark:border-slate-700 rounded-xl bg-white p-4 overflow-auto"
                                dangerouslySetInnerHTML={{ __html: form.body }} />
                        ) : (
                            <textarea value={form.body} onChange={e => set('body', e.target.value)}
                                placeholder={`<p>Hi {{userName}},</p>\n<p>Your OTP is <strong>{{otp}}</strong></p>`}
                                rows={10}
                                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 font-mono resize-y focus:outline-none focus:ring-2 focus:ring-indigo-400/40" />
                        )}
                    </div>

                    {/* Active toggle */}
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                        <button onClick={() => set('isActive', !form.isActive)}
                            className={`relative w-11 h-6 rounded-full transition-colors ${form.isActive ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.isActive ? 'left-6' : 'left-1'}`} />
                        </button>
                        <div>
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                {form.isActive ? 'Active' : 'Inactive'}
                            </p>
                            <p className="text-xs text-slate-400">
                                {form.isActive ? 'This template will be used for sending emails.' : 'Template is disabled and will not be sent.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
                    <button onClick={onClose} className="h-10 px-5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300">
                        Cancel
                    </button>
                    <button onClick={handleSave} disabled={saving}
                        className="h-10 px-6 rounded-xl bg-indigo-600 text-white text-sm font-bold disabled:opacity-60 flex items-center gap-2">
                        {saving ? <Spinner size="sm" color="white" /> : <FloppyDisk size={15} weight="bold" />}
                        {template?._id ? 'Update Template' : 'Create Template'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function EmailTemplatesPage() {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [modal, setModal] = useState(null); // null | 'new' | template object
    const [deleting, setDeleting] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (typeFilter !== 'all') params.set('type', typeFilter);
            if (search) params.set('search', search);
            const res = await fetch(`${API}/api/email-templates?${params}`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (res.ok) setTemplates(await res.json());
        } catch {}
        finally { setLoading(false); }
    }, [typeFilter, search]);

    useEffect(() => { load(); }, [load]);

    const handleSave = (saved) => {
        setTemplates(prev => {
            const exists = prev.find(t => t._id === saved._id);
            return exists ? prev.map(t => t._id === saved._id ? saved : t) : [saved, ...prev];
        });
        setModal(null);
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this template?')) return;
        setDeleting(id);
        try {
            await fetch(`${API}/api/email-templates/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            setTemplates(prev => prev.filter(t => t._id !== id));
            toast.success('Deleted');
        } catch {
            toast.error('Failed to delete');
        } finally { setDeleting(null); }
    };

    const toggleActive = async (t) => {
        try {
            const res = await fetch(`${API}/api/email-templates/${t._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify({ ...t, isActive: !t.isActive }),
            });
            if (res.ok) setTemplates(prev => prev.map(x => x._id === t._id ? { ...x, isActive: !x.isActive } : x));
        } catch {}
    };

    // Presets filtered by the active type tab + search box.
    // "all" shows everything; any other type shows only that category.
    const q = search.trim().toLowerCase();
    const filteredPresets = EMAIL_PRESETS.filter(p => {
        const matchType = typeFilter === 'all' || p.type === typeFilter;
        const matchSearch = !q || p.name.toLowerCase().includes(q) || (p.subject || '').toLowerCase().includes(q);
        return matchType && matchSearch;
    });

    return (
        <div className="w-full pb-12 space-y-6">
            {/* Page header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Email <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">Templates</span>
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Manage transactional and marketing email templates.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative group">
                        <button className="flex items-center gap-2 h-10 px-4 rounded-xl border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-bold">
                            <Lightning size={15} weight="fill" /> Presets
                        </button>
                        <div className="absolute right-0 top-12 z-30 w-64 max-h-96 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-2 hidden group-hover:block">
                            {EMAIL_PRESETS.map((preset, i) => (
                                <button key={i} onClick={() => setModal({ ...preset, _id: null })}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors">
                                    <EnvelopeSimple size={14} className="text-indigo-500 shrink-0" weight="bold" />
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{preset.name}</p>
                                        <p className="text-[11px] text-slate-400 truncate capitalize">{preset.type}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                    <button onClick={() => setModal('new')}
                        className="flex items-center gap-2 h-10 px-5 rounded-xl bg-indigo-600 text-white text-sm font-bold shadow-lg shadow-indigo-500/20">
                        <Plus size={16} weight="bold" /> New Template
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <MagnifyingGlass size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search templates…"
                        className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-400/40" />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {TYPES.map(t => (
                        <button key={t} onClick={() => setTypeFilter(t)}
                            className={`h-10 px-4 rounded-xl text-sm font-semibold capitalize transition-colors ${typeFilter === t ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}>
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Preset Templates — always shown, filtered by the active type tab */}
            <div className="bg-gradient-to-br from-indigo-50 to-orange-50 dark:from-indigo-500/5 dark:to-orange-500/5 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                    <Lightning size={16} weight="fill" className="text-indigo-600 dark:text-indigo-400" />
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Preset Templates</span>
                    <span className="text-xs text-slate-400 ml-1">
                        {typeFilter === 'all' ? '— all ready-made templates' : `— ${typeFilter} templates`} ({filteredPresets.length})
                    </span>
                </div>
                {filteredPresets.length === 0 ? (
                    <p className="text-sm text-slate-400 py-4 text-center">No preset templates for this category.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {filteredPresets.map((preset, i) => (
                            <button key={i} onClick={() => setModal({ ...preset, _id: null })}
                                className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors group">
                                <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0">
                                    <EnvelopeSimple size={16} className="text-indigo-600 dark:text-indigo-400" weight="bold" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{preset.name}</p>
                                    <p className="text-xs text-slate-400 mt-0.5 truncate">{preset.subject}</p>
                                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${TYPE_COLORS[preset.type] || TYPE_COLORS.other}`}>{preset.type}</span>
                                        {preset.variables.map(v => (
                                            <span key={v} className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">{v}</span>
                                        ))}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Templates list */}
            {loading ? (
                <div className="flex justify-center py-20"><Spinner color="primary" /></div>
            ) : templates.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                        <EnvelopeSimple size={32} weight="thin" className="text-slate-400" />
                    </div>
                    <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-1">No templates yet</h3>
                    <p className="text-sm text-slate-400 mb-5">Create your first email template to get started.</p>
                    <button onClick={() => setModal('new')} className="flex items-center gap-2 h-9 px-5 rounded-xl bg-indigo-600 text-white text-sm font-bold">
                        <Plus size={14} weight="bold" /> Create Template
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {templates.map(t => (
                        <div key={t._id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 flex items-start gap-4">
                            {/* Icon */}
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0">
                                <EnvelopeSimple size={18} className="text-indigo-600 dark:text-indigo-400" weight="bold" />
                            </div>
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <span className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">{t.name}</span>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${TYPE_COLORS[t.type] || TYPE_COLORS.other}`}>{t.type}</span>
                                    {t.isActive
                                        ? <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-green-600 bg-green-50 px-2 py-0.5 rounded-full"><CheckCircle size={10} weight="fill" /> Active</span>
                                        : <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full"><XCircle size={10} weight="fill" /> Inactive</span>}
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 truncate mb-2">Subject: {t.subject}</p>
                                {t.variables?.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5">
                                        {t.variables.map(v => (
                                            <span key={v} className="h-5 px-2 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-[11px] font-mono">{v}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {/* Actions */}
                            <div className="flex items-center gap-2 shrink-0">
                                <button onClick={() => toggleActive(t)}
                                    className={`h-8 px-3 rounded-lg text-xs font-semibold transition-colors ${t.isActive ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                                    {t.isActive ? 'Active' : 'Inactive'}
                                </button>
                                <button onClick={() => setModal(t)}
                                    className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors">
                                    <PencilSimple size={14} weight="bold" />
                                </button>
                                <button onClick={() => handleDelete(t._id)} disabled={deleting === t._id}
                                    className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-400 hover:text-rose-600 transition-colors disabled:opacity-50">
                                    {deleting === t._id ? <Spinner size="sm" /> : <Trash size={14} weight="bold" />}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Stats footer */}
            {templates.length > 0 && (
                <div className="flex items-center gap-6 pt-2 text-sm text-slate-400">
                    <span>{templates.length} template{templates.length !== 1 ? 's' : ''}</span>
                    <span>{templates.filter(t => t.isActive).length} active</span>
                    <span>{templates.filter(t => !t.isActive).length} inactive</span>
                </div>
            )}

            {/* Modal */}
            {modal && (
                <TemplateModal
                    template={modal === 'new' ? null : modal}
                    onClose={() => setModal(null)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}
