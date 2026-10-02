'use client';
import { useEffect, useState } from 'react';
import { isStagedOrder, stagedFinancials, formatPaise } from '@/utils/stagedPayments.mjs';
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function KYCBookingContext({ userId }) {
    const [orders, setOrders] = useState(null);
    const [unavailable, setUnavailable] = useState(false);
    useEffect(() => {
        let active = true;
        if (!userId) return;
        fetch(`${API}/api/admin/rentals`, { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }, cache: 'no-store' })
            .then(async response => {
                if (!response.ok) throw new Error('Order context unavailable');
                const rentals = await response.json();
                if (active) setOrders(rentals.filter(order => String(order.user?._id || order.user) === String(userId) && isStagedOrder(order)));
            }).catch(() => { if (active) setUnavailable(true); });
        return () => { active = false; };
    }, [userId]);
    if (!userId || orders?.length === 0) return null;
    return <section className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
        <h4 className="text-sm font-bold">Linked staged bookings</h4>
        {unavailable ? <p className="mt-2 text-sm text-slate-500">Order context is unavailable. Open Orders with the appropriate access to review payments.</p>
            : !orders ? <p role="status" className="mt-2 text-sm text-slate-500">Loading booking context…</p>
                : orders.map(order => {
                    const financials = stagedFinancials(order);
                    return <div key={order._id} className="mt-3 border-t border-slate-100 pt-3 text-sm dark:border-slate-700">
                        <p className="font-semibold">#{order._id.slice(-8).toUpperCase()} · {order.status}</p>
                        <p className="mt-1 text-slate-500">Advance received {formatPaise(financials.advancePaidPaise)} · Outstanding {formatPaise(financials.balancePaise)}</p>
                        <p className="mt-1 text-slate-500">{financials.nextAction}</p>
                    </div>;
                })}
        <p className="mt-3 text-xs text-slate-500">KYC approval permits balance review; it does not confirm payment or dispatch.</p>
    </section>;
}
