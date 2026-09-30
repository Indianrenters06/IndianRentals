'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowSquareOut, Eye, PaperPlaneTilt, Trash } from '@phosphor-icons/react';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '@/lib/apiConfig';

const API = API_BASE_URL;
const STOREFRONT = process.env.NEXT_PUBLIC_STOREFRONT_URL || (process.env.NODE_ENV === 'production' ? 'https://indianrenters.com' : 'http://localhost:3000');
const PAGE_PATHS = {
    homepage: '/', about: '/about', blog: '/blog', 'categories-page': '/categories',
    'rental-process': '/rental-process', faq: '/faq', contact: '/contact',
    'product-page': '/products',
};

function CmsWorkflowBar() {
    const pathname = usePathname();
    const section = pathname?.split('/')[3];
    const [active, setActive] = useState(null);
    const [status, setStatus] = useState(null);
    const [busy, setBusy] = useState(false);
    const direct = active?.mode === 'direct' || section === 'layout' || section === 'careers';
    const hidden = active?.mode === 'hide';
    const page = pathname?.endsWith('/messages') || direct || hidden ? null : active?.page || (PAGE_PATHS[section] ? section : null);
    const storefrontPath = hidden ? null : active?.path || PAGE_PATHS[page] || (section === 'layout' ? '/' : section === 'careers' ? '/careers' : null);

    const refresh = useCallback(async () => {
        if (!page) { setStatus(null); return; }
        try {
            const response = await fetch(`${API}/api/cms/${page}/draft`, {
                cache: 'no-store', headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
            });
            if (!response.ok) throw new Error('Could not check CMS status');
            const data = await response.json();
            setStatus(data._workflow);
        } catch { setStatus(null); }
    }, [page]);

    useEffect(() => { refresh(); }, [refresh]);
    useEffect(() => {
        const onPage = event => setActive(event.detail?.page ? event.detail : null);
        const onSaved = event => { if (event.detail?.page === page) refresh(); };
        window.addEventListener('cms:active-page', onPage);
        window.addEventListener('cms:draft-saved', onSaved);
        window.addEventListener('focus', refresh);
        return () => {
            window.removeEventListener('cms:active-page', onPage);
            window.removeEventListener('cms:draft-saved', onSaved);
            window.removeEventListener('focus', refresh);
        };
    }, [page, refresh]);
    useEffect(() => { setActive(null); }, [pathname]);

    const request = async (path, method = 'POST') => {
        const response = await fetch(`${API}/api/cms/${page}/${path}`, {
            method, headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
        });
        const body = await response.json();
        if (!response.ok) throw new Error(body.message || 'CMS action failed');
        return body;
    };
    const preview = async () => {
        const previewTab = window.open('', '_blank');
        if (previewTab) previewTab.opener = null;
        setBusy(true);
        try {
            const { token } = await request('preview-token');
            const url = new URL(storefrontPath, STOREFRONT);
            url.searchParams.set('cmsPreview', token);
            url.searchParams.set('cmsPreviewPage', page);
            if (previewTab) previewTab.location.href = url.toString();
            else window.open(url.toString(), '_blank', 'noopener,noreferrer');
        } catch (error) { previewTab?.close(); toast.error(error.message); }
        finally { setBusy(false); }
    };
    const publish = async () => {
        setBusy(true);
        try {
            await request('publish');
            await refresh();
            toast.success('Published to the storefront.');
        } catch (error) { toast.error(error.message); }
        finally { setBusy(false); }
    };
    const discard = async () => {
        if (!window.confirm('Discard the saved draft for this page? Published content will remain unchanged.')) return;
        setBusy(true);
        try {
            await request('draft', 'DELETE');
            window.location.reload();
        } catch (error) { toast.error(error.message); setBusy(false); }
    };

    if (direct && storefrontPath) return <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900 md:px-5"><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Storefront {section === 'layout' ? 'layout' : section === 'careers' ? 'careers page' : section === 'service-pages' ? 'service page' : section === 'contact' ? 'contact page' : 'product'}</p><p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{section === 'service-pages' || section === 'contact' ? 'Changes save to the connected CMS and appear on your local storefront.' : 'This editor saves directly to the live site.'}</p></div><a href={new URL(storefrontPath, STOREFRONT).toString()} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold underline underline-offset-4">View page <ArrowSquareOut size={15} /></a></div>;
    if (!page || !storefrontPath) return null;
    const savedAt = status?.draftUpdatedAt || status?.publishedAt;
    return <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900 md:px-5">
        <div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Storefront page</p><a href={new URL(storefrontPath, STOREFRONT).toString()} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1.5 break-all text-sm font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900 dark:text-white">{storefrontPath}<ArrowSquareOut size={15} /></a><p role="status" className="mt-1 text-xs text-slate-600 dark:text-slate-300">{status?.hasDraft ? 'Unpublished draft' : 'Published version'}{savedAt ? ` · Last saved ${new Date(savedAt).toLocaleString('en-IN')}` : ''}</p></div>
        <div className="flex flex-wrap gap-2"><button type="button" onClick={preview} disabled={!status?.hasDraft || busy} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-300 px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45 dark:border-slate-600 dark:text-white dark:hover:bg-slate-800"><Eye size={17} weight="bold" />Preview saved draft</button><button type="button" onClick={discard} disabled={!status?.hasDraft || busy} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-300 px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45 dark:border-slate-600 dark:text-white dark:hover:bg-slate-800"><Trash size={16} weight="bold" />Discard</button><button type="button" onClick={publish} disabled={!status?.hasDraft || busy} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#ffcf46] px-4 text-sm font-semibold text-[#141414] hover:bg-[#f5c236] disabled:cursor-not-allowed disabled:opacity-45"><PaperPlaneTilt size={17} weight="bold" />Publish saved draft</button></div>
    </div>;
}

export default function CmsLayout({ children }) {
    return <><CmsWorkflowBar />{children}</>;
}
