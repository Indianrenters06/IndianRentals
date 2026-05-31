'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardBody, Skeleton } from '@heroui/react';
import { Users, CurrencyInr, ShoppingCart, TrendUp } from '@phosphor-icons/react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function CustomerLTVReport() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        fetch(`${API}/api/reports/customer-ltv`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.ok ? r.json() : null)
            .then(d => { setData(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const customers = data?.topCustomers || [];
    const top = customers[0] || {};
    const avgSpend = customers.length > 0 ? Math.round(customers.reduce((s, c) => s + c.totalSpend, 0) / customers.length) : 0;

    const kpis = data ? [
        { label: 'Top Customers Shown', value: customers.length,                                               icon: Users,       color: 'indigo'  },
        { label: 'Highest LTV',         value: `₹${Number(top.totalSpend || 0).toLocaleString('en-IN')}`,     icon: CurrencyInr, color: 'emerald' },
        { label: 'Avg Spend (Top 15)',  value: `₹${Number(avgSpend).toLocaleString('en-IN')}`,                icon: TrendUp,     color: 'blue'    },
        { label: 'Max Orders',          value: top.orderCount || 0,                                           icon: ShoppingCart, color: 'amber'  },
    ] : [];

    const barData = data ? {
        labels: customers.map(c => c.name?.split(' ')[0] || 'User'),
        datasets: [{
            label: 'Total Spend (₹)',
            data: customers.map(c => c.totalSpend),
            backgroundColor: customers.map((_, i) => i === 0 ? 'rgba(240,140,0,0.9)' : 'rgba(240,140,0,0.55)'),
            borderRadius: 6,
        }],
    } : null;

    const barOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => `₹${Number(ctx.raw).toLocaleString('en-IN')}` } } },
        scales: {
            x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 11 } } },
            y: { grid: { color: 'rgba(148,163,184,0.1)' }, ticks: { color: '#94a3b8', callback: v => `₹${Number(v).toLocaleString('en-IN')}` } },
        },
    };

    const SEGMENT_LABELS = { 0: '< ₹1K', 1000: '₹1K–5K', 5000: '₹5K–15K', 15000: '₹15K–50K', '₹50k+': '₹50K+' };

    return (
        <div className="w-full space-y-6 pb-12">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                    Customer <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">LTV</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400">Measure lifetime value and retention of your customers.</p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {loading ? [...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />) :
                    kpis.map((k, i) => (
                        <motion.div key={k.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                <CardBody className="p-5">
                                    <div className={`w-9 h-9 rounded-xl bg-${k.color}-100 dark:bg-${k.color}-500/10 flex items-center justify-center text-${k.color}-600 dark:text-${k.color}-400 mb-3`}>
                                        <k.icon weight="bold" size={18} />
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium">{k.label}</p>
                                    <p className="text-xl font-black text-slate-900 dark:text-slate-100 mt-0.5">{k.value}</p>
                                </CardBody>
                            </Card>
                        </motion.div>
                    ))}
            </div>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <CardBody className="p-6">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">Top 15 Customers by Lifetime Value</p>
                    <p className="text-xs text-slate-400 mb-4">Total revenue generated per customer</p>
                    <div className="h-64">
                        {loading ? <Skeleton className="h-full rounded-xl" /> : barData && <Bar data={barData} options={barOptions} />}
                    </div>
                </CardBody>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <CardBody className="p-6">
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Customer Segments by Spend</p>
                        {loading ? [...Array(5)].map((_, i) => <Skeleton key={i} className="h-8 rounded-lg mb-2" />) : (
                            <div className="space-y-3">
                                {data?.segments.map(s => {
                                    const label = SEGMENT_LABELS[s._id] || String(s._id);
                                    const total = data.segments.reduce((acc, x) => acc + x.count, 0);
                                    const pct = total > 0 ? Math.round(s.count / total * 100) : 0;
                                    return (
                                        <div key={String(s._id)}>
                                            <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                                                <span>{label}</span><span>{s.count} customers ({pct}%)</span>
                                            </div>
                                            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                                                <div className="h-1.5 rounded-full bg-indigo-500 transition-all" style={{ width: `${pct}%` }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardBody>
                </Card>

                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <CardBody className="p-6">
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Top Customers</p>
                        {loading ? [...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 rounded-lg mb-2" />) : (
                            <div className="space-y-3">
                                {customers.slice(0, 8).map((c, i) => (
                                    <div key={String(c._id)} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400">{i + 1}</span>
                                            <div>
                                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{c.name}</p>
                                                <p className="text-xs text-slate-400">{c.orderCount} orders</p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">₹{Number(c.totalSpend).toLocaleString('en-IN')}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
