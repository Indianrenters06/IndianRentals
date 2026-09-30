'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { API_BASE_URL } from '@/lib/apiConfig';

const emptyReview = { name: '', role: '', message: '', rating: 5, image: '', source: 'indianrenters', sourceUrl: '', isApproved: false };
const inputClass = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 focus:outline-2 focus:outline-indigo-600 dark:border-slate-600 dark:bg-slate-800 dark:text-white';
const buttonClass = 'inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-4 text-sm font-semibold hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 dark:border-slate-600 dark:hover:bg-slate-800';

async function request(path = '', options = {}) {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('Sign in to the admin panel to manage testimonials.');
    const response = await fetch(`${API_BASE_URL}/api/testimonials${path}`, {
        ...options, cache: 'no-store',
        headers: { Authorization: `Bearer ${token}`, ...(options.body ? { 'Content-Type': 'application/json' } : {}) },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || (response.status === 403 ? 'Your account needs CMS permission.' : 'Could not save testimonials. Please try again.'));
    return data;
}

function Field({ label, children }) {
    return <label className="flex flex-col gap-2 text-sm font-medium">{label}{children}</label>;
}

export default function TestimonialsEditor() {
    const [reviews, setReviews] = useState([]);
    const [draft, setDraft] = useState(emptyReview);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');
    const load = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await request('/all');
            if (!Array.isArray(data)) throw new Error('Unexpected testimonial response. Please try again.');
            setReviews(data);
        } catch (err) { setError(err.message); }
        finally { setLoading(false); }
    }, []);
    useEffect(() => { load(); }, [load]);
    const set = (field, value) => setDraft(current => ({ ...current, [field]: value }));
    const reset = () => { setDraft({ ...emptyReview }); setEditingId(null); };

    const save = async event => {
        event.preventDefault();
        setBusy(true); setError(''); setNotice('');
        try {
            const saved = await request(editingId ? `/${editingId}` : '', { method: editingId ? 'PUT' : 'POST', body: JSON.stringify(draft) });
            setReviews(current => editingId ? current.map(item => item._id === saved._id ? saved : item) : [saved, ...current]);
            reset();
            setNotice(saved.isApproved ? 'Review published. It appears on storefront pages after they reload.' : 'Review saved as a draft. Publish it when ready.');
        } catch (err) { setError(err.message); }
        finally { setBusy(false); }
    };
    const publish = async review => {
        setBusy(true); setError(''); setNotice('');
        try {
            const saved = await request(`/${review._id}`, { method: 'PUT', body: JSON.stringify({ isApproved: !review.isApproved }) });
            setReviews(current => current.map(item => item._id === saved._id ? saved : item));
            if (editingId === saved._id) setDraft(current => ({ ...current, isApproved: saved.isApproved }));
            setNotice(saved.isApproved ? 'Review published.' : 'Review unpublished.');
        } catch (err) { setError(err.message); }
        finally { setBusy(false); }
    };
    const remove = async review => {
        if (!window.confirm(`Delete the testimonial from ${review.name}? This cannot be undone.`)) return;
        setBusy(true); setError(''); setNotice('');
        try {
            await request(`/${review._id}`, { method: 'DELETE' });
            setReviews(current => current.filter(item => item._id !== review._id));
            if (editingId === review._id) reset();
            setNotice('Review deleted.');
        } catch (err) { setError(err.message); }
        finally { setBusy(false); }
    };

    return <div className="mx-auto max-w-6xl space-y-6 p-4 text-slate-900 md:p-8 dark:text-slate-100">
        <header className="flex flex-wrap items-start justify-between gap-4">
            <div><h1 className="text-3xl font-semibold tracking-tight">Testimonials</h1><p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">Add real customer reviews, edit their content, and choose which reviews appear across storefront pages.</p></div>
            <Link href="/dashboard/cms/homepage" className={buttonClass}>Section title & rating settings</Link>
        </header>
        {error && <div role="alert" className="rounded-xl bg-red-50 p-4 text-red-800 dark:bg-red-950 dark:text-red-200">{error}<button type="button" disabled={busy || loading} className={`${buttonClass} ml-4`} onClick={load}>Reload reviews</button></div>}
        {notice && <p role="status" className="rounded-xl bg-emerald-50 p-4 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">{notice}</p>}
        <div className="grid items-start gap-6 lg:grid-cols-2">
            <form onSubmit={save} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
                <h2 className="text-xl font-semibold">{editingId ? 'Edit review' : 'Add review'}</h2>
                <fieldset disabled={busy} className="space-y-4">
                    <Field label="Customer name"><input required maxLength={120} value={draft.name} onChange={e => set('name', e.target.value)} className={inputClass} /></Field>
                    <Field label="Role or company (optional)"><input maxLength={200} value={draft.role} onChange={e => set('role', e.target.value)} className={inputClass} /></Field>
                    <Field label="Customer review"><textarea required maxLength={5000} rows={7} value={draft.message} onChange={e => set('message', e.target.value)} className={inputClass} /></Field>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Rating (1–5)"><input required type="number" min={1} max={5} step={0.1} value={draft.rating} onChange={e => set('rating', e.target.value)} className={inputClass} /></Field>
                        <Field label="Review source"><select value={draft.source} onChange={e => { set('source', e.target.value); if (e.target.value !== 'google') set('sourceUrl', ''); }} className={inputClass}><option value="indianrenters">IndianRenters customer</option><option value="google">Google review</option></select></Field>
                    </div>
                    {draft.source === 'google' && <Field label="Original Google review link (optional)"><input type="url" value={draft.sourceUrl} onChange={e => set('sourceUrl', e.target.value)} className={inputClass} /></Field>}
                    <Field label="Customer image URL (optional; retained for future layouts)"><input type="url" value={draft.image} onChange={e => set('image', e.target.value)} className={inputClass} /></Field>
                    <label className="flex min-h-11 items-center gap-3 text-sm"><input type="checkbox" checked={draft.isApproved} onChange={e => set('isApproved', e.target.checked)} className="h-5 w-5" />Publish on the storefront</label>
                    <p className="text-xs leading-5 text-slate-600 dark:text-slate-300">Select Google only for a review sourced from Google. Customer submissions start unpublished.</p>
                    <div className="flex flex-wrap gap-3"><button type="submit" className={`${buttonClass} border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700`}>{busy ? 'Saving…' : 'Save review'}</button>{editingId && <button type="button" onClick={reset} className={buttonClass}>Cancel edit</button>}</div>
                </fieldset>
            </form>
            <section aria-label="Saved testimonials" className="space-y-4">
                <div className="flex items-center justify-between gap-4"><h2 className="text-xl font-semibold">Saved reviews ({reviews.length})</h2><button type="button" disabled={busy || loading} onClick={load} className={buttonClass}>Refresh</button></div>
                {loading ? <p role="status">Loading reviews…</p> : !reviews.length && !error ? <p className="rounded-xl bg-slate-100 p-5 dark:bg-slate-800">No testimonials saved yet. Add a real customer review using the form.</p> : reviews.map(review => <article key={review._id} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
                    <div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold break-words">{review.name}</h3><p className="text-xs text-slate-600 dark:text-slate-300">{review.role} · {review.rating}/5 · {review.source === 'google' ? 'Google' : 'IndianRenters'}</p></div><span className="text-xs font-semibold">{review.isApproved ? 'Published' : 'Draft'}</span></div>
                    <p className="whitespace-pre-line break-words text-sm leading-6">{review.message}</p>
                    <div className="flex flex-wrap gap-2"><button type="button" disabled={busy} className={buttonClass} onClick={() => { setEditingId(review._id); setDraft({ ...emptyReview, ...review }); setError(''); setNotice(''); }}>Edit</button><button type="button" disabled={busy} className={buttonClass} onClick={() => publish(review)}>{review.isApproved ? 'Unpublish' : 'Publish'}</button><button type="button" disabled={busy} className={`${buttonClass} text-red-700 dark:text-red-300`} onClick={() => remove(review)}>Delete</button></div>
                </article>)}
            </section>
        </div>
    </div>;
}
