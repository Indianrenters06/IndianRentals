'use client';

import { useEffect, useState } from 'react';
import { formatPaise, stagedFinancials } from '@/utils/stagedPayments.mjs';
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function StagedOrderPayment({ order, onUpdated }) {
    const [context, setContext] = useState(null);
    const [error, setError] = useState('');
    const [delivery, setDelivery] = useState('');
    const [reason, setReason] = useState('');
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);
    const [refresh, setRefresh] = useState(0);
    useEffect(() => {
        let active = true;
        fetch(`${API}/api/rentals/${order._id}/staged`, { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }, cache: 'no-store' })
            .then(async response => {
                const body = await response.json();
                if (!response.ok) throw new Error(body.message || 'Could not load staged payment details');
                if (active) { setContext({ ...body, sourceVersion: order.updatedAt }); setError(''); setDelivery(String((body.finalQuote?.deliveryPaise ?? body.rental?.pricingSnapshot?.deliveryPaise ?? 0) / 100)); }
            }).catch(failure => { if (active) setError(failure.message); });
        return () => { active = false; };
    }, [order._id, order.updatedAt, refresh]);
    const freshContext = context?.sourceVersion === order.updatedAt ? context : null;
    const current = { ...(freshContext?.rental || order), kycStatus: freshContext?.kycStatus || order.kycStatus };
    const finance = stagedFinancials(current);
    const canEdit = freshContext && finance.kycStatus === 'approved' && current.staged?.advance?.state === 'paid'
        && !current.staged?.balance?.providerOrderId && !current.refundReviewRequired && current.status !== 'Cancelled';
    async function save(event) {
        event.preventDefault();
        const deliveryPaise = Math.round(Number(delivery) * 100);
        if (!Number.isSafeInteger(deliveryPaise) || deliveryPaise < 0 || !reason.trim()) { setError('Enter a valid non-negative delivery charge and a reason.'); return; }
        setSaving(true); setError('');
        try {
            const response = await fetch(`${API}/api/rentals/${order._id}/staged/final-quote`, {
                method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
                body: JSON.stringify({ deliveryPaise, reason: reason.trim() }),
            });
            const body = await response.json();
            if (!response.ok) throw new Error(body.message || 'Could not update final quote');
            setEditing(false); setReason(''); setRefresh(value => value + 1); onUpdated?.();
        } catch (failure) { setError(failure.message); }
        finally { setSaving(false); }
    }
    return <section className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-800 dark:bg-amber-900/10" aria-label="Staged payment">
        <h3 className="mb-3 text-sm font-bold">Advance and final balance</h3>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {[
                ['Current total', formatPaise(finance.totalPaise)], ['Advance received', formatPaise(finance.advancePaidPaise)],
                ['Balance received', formatPaise(finance.balancePaidPaise)], ['Outstanding', formatPaise(finance.balancePaise)],
                ['Current KYC', finance.kycStatus], ['Payment status', finance.fullyPaid ? 'Fully paid' : finance.paidPaise ? 'Partially paid' : 'Unpaid'],
            ].map(([label, value]) => <div key={label}><dt className="text-slate-500">{label}</dt><dd className="mt-1 font-semibold">{value}</dd></div>)}
        </dl>
        <p className="mt-3 text-sm font-medium">Next: {finance.nextAction}</p>
        {current.refundReviewRequired && <p role="status" className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/10 dark:text-red-300">Received payments require manual review. Check the advance and balance transaction IDs in Payments before arranging a refund. Cancellation does not automatically refund the customer.</p>}
        {current.staged?.finalQuote?.adjustmentReason && <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">Quote revision {current.staged.finalQuote.revision}: {current.staged.finalQuote.adjustmentReason}</p>}
        {!freshContext && !error && <p role="status" className="mt-3 text-sm">Checking current payment and KYC…</p>}
        {error && <div className="mt-3"><p role="alert" className="text-sm text-red-700 dark:text-red-300">{error}</p><button type="button" onClick={() => setRefresh(value => value + 1)} className="min-h-10 text-sm font-semibold underline">Retry payment details</button></div>}
        {canEdit && !editing && <button type="button" onClick={() => { setError(''); setEditing(true); }} className="mt-4 min-h-10 rounded-full border border-slate-300 px-4 text-sm font-semibold">Review final delivery charge</button>}
        {!canEdit && freshContext && <p className="mt-3 text-xs text-slate-500">Final delivery charges can be reviewed after the advance and KYC approval, before balance payment starts.</p>}
        {editing && <form onSubmit={save} className="mt-4 space-y-3 border-t border-amber-200 pt-4">
            <label className="block text-sm">Delivery charge (₹)<input type="number" min="0" step="0.01" required value={delivery} onChange={event => setDelivery(event.target.value)} className="mt-1 block min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900" /></label>
            <label className="block text-sm">Reason shown to the customer<textarea required minLength={3} maxLength={500} value={reason} onChange={event => setReason(event.target.value)} className="mt-1 block min-h-20 w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900" /></label>
            <p className="text-xs text-slate-500">The final amount is recalculated and the verified advance is deducted. The customer must review this quote before paying.</p>
            <div className="flex gap-3"><button type="submit" disabled={saving} className="min-h-11 rounded-full bg-indigo-600 px-5 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Saving…' : 'Save final quote'}</button><button type="button" disabled={saving} onClick={() => setEditing(false)} className="min-h-11 px-3 text-sm">Cancel</button></div>
        </form>}
    </section>;
}
