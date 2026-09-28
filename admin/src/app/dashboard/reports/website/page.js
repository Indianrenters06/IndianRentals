'use client';

import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const labels = {home:'Homepage',catalogue:'Catalogue',product:'Product pages',category:'Category pages',locations:'Locations',services:'Services',blog:'Blog',contact:'Contact',about:'About',careers:'Careers','rental-process':'Rental process',faq:'FAQs',mobile:'Mobile',tablet:'Tablet',desktop:'Desktop'};

function Breakdown({title,rows}) {
    return <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 text-lg font-semibold">{title}</h2>
        {rows.length ? <table className="w-full text-sm"><thead><tr className="border-b text-left text-slate-500"><th scope="col" className="pb-3 font-medium">{title === 'Daily views (India time)' ? 'Date' : 'Category'}</th><th scope="col" className="pb-3 text-right font-medium">Page views</th></tr></thead>
            <tbody>{rows.map(row=><tr key={row._id} className="border-b border-slate-100 last:border-0 dark:border-slate-800"><th scope="row" className="py-3 text-left font-normal">{labels[row._id] || row._id}</th><td className="py-3 text-right tabular-nums">{row.count.toLocaleString('en-IN')}</td></tr>)}</tbody></table>
            : <p className="text-sm text-slate-500">No consented page views recorded in this period.</p>}
    </section>;
}

export default function WebsiteReport() {
    const [days,setDays] = useState(30);
    const [data,setData] = useState(null);
    const [error,setError] = useState('');
    const [loading,setLoading] = useState(true);
    const [refresh,setRefresh] = useState(0);
    useEffect(()=>{
        const controller = new AbortController();
        const token = localStorage.getItem('adminToken');
        fetch(`${API}/api/privacy/report?days=${days}`,{headers:{Authorization:`Bearer ${token}`},signal:controller.signal,cache:'no-store'})
            .then(async response=>{ if (!response.ok) throw new Error(response.status===403 ? 'Your account needs Reports permission to view this data.' : 'Could not load analytics. Check that the backend and database are connected.'); return response.json(); })
            .then(setData)
            .catch(error=>{ if(error.name!=='AbortError') {setData(null);setError(error.message);} })
            .finally(()=>{if(!controller.signal.aborted)setLoading(false);});
        return ()=>controller.abort();
    },[days,refresh]);
    return <div className="space-y-6 pb-12 text-slate-900 dark:text-slate-100">
        <header className="flex flex-wrap items-end justify-between gap-4">
            <div><h1 className="text-3xl font-semibold tracking-tight">Website & consent</h1><p className="mt-2 text-sm text-slate-500">Public page views from visitors who accepted optional analytics.</p></div>
            <div className="flex items-center gap-3"><label className="text-sm">Period <select value={days} onChange={event=>{setLoading(true);setError('');setDays(Number(event.target.value));}} className="ml-2 min-h-11 rounded-lg border border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-slate-900">{[7,30,90].map(value=><option key={value} value={value}>Last {value} days</option>)}</select></label><button onClick={()=>{setLoading(true);setError('');setRefresh(value=>value+1);}} className="min-h-11 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700">Refresh</button></div>
        </header>
        {loading ? <p role="status" className="py-8">Loading analytics…</p> : error ? <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">{error}</p> : data && <>
            <div className="grid gap-4 sm:grid-cols-3">{[['Page views',data.pageViews],['Analytics accepted',data.consent.accepted],['Analytics rejected',data.consent.rejected]].map(([label,value])=><section key={label} className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"><h2 className="text-sm text-slate-500">{label}</h2><p className="mt-3 text-3xl font-semibold tabular-nums">{value.toLocaleString('en-IN')}</p></section>)}</div>
            <p className="text-sm text-slate-500">Consent totals show each browser reference’s latest choice made within this period. They are not unique people or an acceptance rate. Repeat visits count as separate page views.</p>
            <div className="grid gap-6 lg:grid-cols-2"><Breakdown title="Page categories" rows={data.pages}/><Breakdown title="Device categories" rows={data.devices}/></div>
            <Breakdown title="Daily views (India time)" rows={data.daily}/>
            <p className="text-xs text-slate-500">Updated {new Date(data.generatedAt).toLocaleString('en-IN')}. Analytics records expire after 90 days; consent records after 180 days. This report contains no names, contact details, full URLs, or individual browsing histories.</p>
        </>}
    </div>;
}
