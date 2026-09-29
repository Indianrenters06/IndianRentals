'use client';

import { useSyncExternalStore } from 'react';

const subscribe = callback => { window.addEventListener('popstate', callback); return () => window.removeEventListener('popstate', callback); };
const getPage = () => {
    const params = new URLSearchParams(window.location.search);
    return params.has('cmsPreview') ? params.get('cmsPreviewPage') : null;
};
const getServerPage = () => null;

export default function CmsPreviewNotice() {
    const page = useSyncExternalStore(subscribe, getPage, getServerPage);
    if (!page) return null;
    return <div role="status" className="sticky top-0 z-[100] border-b border-[#141414] bg-[#ffcf46] px-4 py-2 text-center text-sm font-semibold text-[#141414]">Draft preview · {page.replace(/^service-/, '').replaceAll('-', ' ')} · Only people with this short-lived link can see these changes</div>;
}
