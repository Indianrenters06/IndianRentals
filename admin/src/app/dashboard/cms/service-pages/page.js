'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FloppyDisk, Plus, Trash } from '@phosphor-icons/react';
import ImageUploader from '@/components/ImageUploader';
import { decodeLegacyServiceContent, encodeLegacyServiceContent } from '@/lib/legacyCmsContent';
import defaults from './serviceDefaults.json';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const STOREFRONT = process.env.NEXT_PUBLIC_STOREFRONT_URL || (process.env.NODE_ENV === 'production' ? 'https://indianrenters.com' : 'http://localhost:3000');
const imagePreview = value => value?.startsWith('/') ? new URL(value, STOREFRONT).toString() : value;
const SERVICES = Object.entries(defaults);
const inputClass = 'mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white';
const panelClass = 'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-6';

function Field({ label, value, onChange, rows, hint }) {
    const control = rows
        ? <textarea rows={rows} className={inputClass} value={value || ''} onChange={event => onChange(event.target.value)} />
        : <input className={inputClass} value={value || ''} onChange={event => onChange(event.target.value)} />;
    return <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">{label}{control}{hint && <span className="mt-1 block text-xs font-normal text-slate-500">{hint}</span>}</label>;
}

function Repeater({ title, items, onChange, fields, blank }) {
    return <section className={panelClass}>
        <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
            <button type="button" onClick={() => onChange([...items, blank])} className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-white dark:hover:bg-slate-800"><Plus size={15} weight="bold" /> Add</button>
        </div>
        <div className="space-y-4">{items.map((item, index) => <div key={index} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <div className="mb-3 flex items-center justify-between"><span className="text-xs font-semibold text-slate-500">{index + 1} of {items.length}</span><button type="button" aria-label={`Remove ${title.toLowerCase()} item ${index + 1}`} onClick={() => onChange(items.filter((_, i) => i !== index))} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"><Trash size={16} /></button></div>
            <div className="grid gap-4 md:grid-cols-2">{fields.map(([key, label, rows]) => <Field key={key} label={label} rows={rows} value={item[key]} onChange={value => onChange(items.map((current, i) => i === index ? { ...current, [key]: value } : current))} />)}</div>
        </div>)}</div>
    </section>;
}

export default function ServicePagesEditor() {
    const [slug, setSlug] = useState(SERVICES[0][0]);
    const [data, setData] = useState(defaults[SERVICES[0][0]]);
    const [meta, setMeta] = useState({ metaTitle: '', metaDescription: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [compatibility, setCompatibility] = useState(false);
    const [error, setError] = useState('');
    const set = (key, value) => setData(current => ({ ...current, [key]: value }));

    useEffect(() => {
        const detail = { page: `service-${slug}`, path: `/services/${slug}`, mode: compatibility ? 'direct' : 'cms' };
        let active = true;
        queueMicrotask(() => { if (active) window.dispatchEvent(new CustomEvent('cms:active-page', { detail })); });
        return () => { active = false; window.dispatchEvent(new CustomEvent('cms:active-page', { detail: null })); };
    }, [slug, compatibility]);

    useEffect(() => {
        let active = true;
        const load = async () => {
            setLoading(true);
            setError('');
            try {
                const headers = { Authorization: `Bearer ${localStorage.getItem('adminToken')}` };
                let response = await fetch(`${API}/api/cms/service-${slug}/draft`, {
                    cache: 'no-store',
                    headers,
                });
                const legacy = response.status === 404;
                if (legacy) response = await fetch(`${API}/api/cms/service-${slug}`, { cache: 'no-store' });
                if (!response.ok) throw new Error('Could not load this service page');
                const cms = await response.json();
                if (active) {
                    setCompatibility(legacy);
                    setData({ ...defaults[slug], ...(cms.serviceContent || decodeLegacyServiceContent(cms.pageContent) || {}) });
                    setMeta({ metaTitle: cms.metaTitle || '', metaDescription: cms.metaDescription || '' });
                }
            } catch (cause) { if (active) setError(cause.message); }
            finally { if (active) setLoading(false); }
        };
        load();
        return () => { active = false; };
    }, [slug]);

    const save = async event => {
        event.preventDefault();
        if (!data.title.trim() || !data.headline.trim() || !data.description.trim()) return toast.error('Title, headline and introduction are required.');
        if (!data.categoryHref.startsWith('/') || data.categoryHref.startsWith('//')) return toast.error('Catalogue link must be a site path beginning with /.');
        setSaving(true);
        try {
            const response = await fetch(`${API}/api/cms/service-${slug}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
                body: JSON.stringify(compatibility ? { pageContent: encodeLegacyServiceContent(data), ...meta } : { serviceContent: data, ...meta }),
            });
            if (!response.ok) throw new Error((await response.json()).message || 'Could not save draft');
            if (!compatibility) window.dispatchEvent(new CustomEvent('cms:draft-saved', { detail: { page: `service-${slug}` } }));
            toast.success(compatibility ? 'Saved to CMS. Refresh the local service page to see it.' : 'Draft saved. Publish it when ready.');
        } catch (cause) { toast.error(cause.message); }
        finally { setSaving(false); }
    };

    return <form onSubmit={save} className="mx-auto max-w-6xl space-y-6 pb-20">
        <header className="flex flex-wrap items-end justify-between gap-4">
            <div><h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Service pages</h1><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{compatibility ? 'Edit content for the six rental pages. Changes saved here appear on your local storefront immediately.' : 'Edit one of the six rental service pages. Save a draft, preview it, then publish.'}</p></div>
            <button type="submit" disabled={saving || loading || Boolean(error)} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#ffcf46] px-5 text-sm font-semibold text-[#141414] transition-colors hover:bg-[#f5c236] disabled:opacity-50"><FloppyDisk size={18} weight="bold" />{saving ? 'Saving…' : compatibility ? 'Save changes' : 'Save draft'}</button>
        </header>
        <label className="block max-w-md text-sm font-semibold text-slate-700 dark:text-slate-200">Choose a page<select value={slug} onChange={event => setSlug(event.target.value)} className={inputClass}>{SERVICES.map(([key, value]) => <option key={key} value={key}>{value.title}</option>)}</select></label>
        {compatibility && !error && <p role="status" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">This API uses the earlier CMS format. Saving updates the connected CMS immediately, and your local storefront reads those changes. Draft preview and publish controls will become available when the updated backend is deployed.</p>}
        {error && <p role="alert" className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">{error}. Check the API connection and your admin access.</p>}
        {loading ? <p role="status" className="py-12 text-sm text-slate-500">Loading page content…</p> : !error && <>
            <section className={panelClass}><h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Hero and navigation</h2><div className="grid gap-4 md:grid-cols-2"><Field label="Page title" value={data.title} onChange={value => set('title', value)} /><Field label="Headline" value={data.headline} onChange={value => set('headline', value)} /><div className="md:col-span-2"><Field label="Introduction" rows={3} value={data.description} onChange={value => set('description', value)} /></div><ImageUploader label="Hero image" existingUrl={imagePreview(data.image)} onUpload={value => set('image', value)} /><div className="space-y-4"><Field label="Image URL" value={data.image} onChange={value => set('image', value)} /><Field label="Image description" value={data.imageAlt} onChange={value => set('imageAlt', value)} /></div></div></section>
            <section className={panelClass}><h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Catalogue and actions</h2><div className="grid gap-4 md:grid-cols-2"><Field label="Catalogue link" value={data.categoryHref} onChange={value => set('categoryHref', value)} hint="Use an existing site path, such as /category/apple." /><Field label="Link label" value={data.categoryLabel} onChange={value => set('categoryLabel', value)} /><Field label="Catalogue category" value={data.catalogueCategory} onChange={value => set('catalogueCategory', value)} /><Field label="Product search term" value={data.catalogueKeyword} onChange={value => set('catalogueKeyword', value)} /><label className="text-sm font-medium text-slate-700 dark:text-slate-200">Primary action<select className={inputClass} value={data.primaryAction} onChange={event => set('primaryAction', event.target.value)}><option value="browse">Browse products</option><option value="quote">Contact the team</option></select></label></div></section>
            <Repeater title="Use cases" items={data.useCases || []} onChange={value => set('useCases', value)} fields={[["title", "Title"], ["description", "Description", 3]]} blank={{ title: '', description: '' }} />
            <Repeater title="Frequently asked questions" items={data.faqs || []} onChange={value => set('faqs', value)} fields={[["q", "Question"], ["a", "Answer", 3]]} blank={{ q: '', a: '' }} />
            <section className={panelClass}><h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Search appearance</h2><div className="grid gap-4 md:grid-cols-2"><Field label="Meta title" value={meta.metaTitle} onChange={value => setMeta(current => ({ ...current, metaTitle: value }))} hint="Blank uses the page title." /><Field label="Meta description" rows={3} value={meta.metaDescription} onChange={value => setMeta(current => ({ ...current, metaDescription: value }))} hint="Blank uses the introduction." /><div className="md:col-span-2"><Field label="Search phrases, comma separated" value={(data.keywords || []).join(', ')} onChange={value => set('keywords', value.split(',').map(word => word.trim()).filter(Boolean))} /></div></div></section>
        </>}
    </form>;
}
