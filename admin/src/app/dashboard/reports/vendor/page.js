'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardBody, Skeleton } from '@heroui/react';
import { Storefront, CurrencyInr, ShoppingCart, Trophy } from '@phosphor-icons/react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const BRAND_COLORS = [
    'rgba(240,140,0,0.8)', 'rgba(34,197,94,0.8)', 'rgba(245,158,11,0.8)',
    'rgba(239,68,68,0.8)', 'rgba(59,130,246,0.8)', 'rgba(139,92,246,0.8)',
    'rgba(20,184,166,0.8)', 'rgba(249,115,22,0.8)', 'rgba(236,72,153,0.8)', 'rgba(16,185,129,0.8)',
];

export default function VendorReport() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        fetch(`${API}/api/reports/vendors`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.ok ? r.json() : null)
            .then(d => { setData(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const brands = data?.byBrand || [];
    const top = brands[0] || {};
    const totalBrands = brands.filter(b => b._id !== 'Unbranded').length;

    const kpis = data ? [
        { label: 'Total Brands',    value: totalBrands,                                                      icon: Storefront,  color: 'indigo'  },
        { label: 'Top Brand',       value: top._id || '—',                                                   icon: Trophy,      color: 'amber'   },
        { label: 'Top Revenue',     value: `₹${Number(top.revenue || 0).toLocaleString('en-IN')}`,          icon: CurrencyInr, color: 'emerald' },
        { label: 'Top Brand Orders', value: top.orders || 0,                                                 icon: ShoppingCart, color: 'blue'   },
    ] : [];

    const barData = data ? {
        labels: brands.map(b => b._id),
        datasets: [{
            label: 'Revenue (₹)',
            data: brands.map(b => b.revenue),
            backgroundColor: brands.map((_, i) => BRAND_COLORS[i % BRAND_COLORS.length]),
            borderRadius: 6,
        }],
    } : null;

    const barOptions = {
        indexAxis: 'y',
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => `₹${Number(ctx.raw).toLocaleString('en-IN')} · ${brands[ctx.dataIndex]?.orders} orders` } } },
        scales: {
            x: { grid: { color: 'rgba(148,163,184,0.1)' }, ticks: { color: '#94a3b8', callback: v => `₹${Number(v).toLocaleString('en-IN')}` } },
            y: { grid: { display: false }, ticks: { color: '#94a3b8' } },
        },
    };

    const chartHeight = Math.max(300, (brands.length || 5) * 44);

    return (
        <div className="w-full space-y-6 pb-12">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                    Vendor <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">Performance</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400">Track revenue and orders by brand across your product catalogue.</p>
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
                                    <p className="text-xl font-black text-slate-900 dark:text-slate-100 mt-0.5 truncate">{k.value}</p>
                                </CardBody>
                            </Card>
                        </motion.div>
                    ))}
            </div>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <CardBody className="p-6">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">Revenue by Brand</p>
                    <p className="text-xs text-slate-400 mb-4">Sorted by highest revenue — hover for order count</p>
                    <div style={{ height: `${chartHeight}px` }}>
                        {loading ? <Skeleton className="h-full rounded-xl" /> : barData && <Bar data={barData} options={barOptions} />}
                    </div>
                </CardBody>
            </Card>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <CardBody className="p-6">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Top 10 Products</p>
                    {loading ? [...Array(6)].map((_, i) => <Skeleton key={i} className="h-10 rounded-lg mb-2" />) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-xs text-slate-400 border-b border-slate-100 dark:border-slate-800">
                                        <th className="text-left pb-3 font-medium">#</th>
                                        <th className="text-left pb-3 font-medium">Product</th>
                                        <th className="text-left pb-3 font-medium">Brand</th>
                                        <th className="text-right pb-3 font-medium">Revenue</th>
                                        <th className="text-right pb-3 font-medium">Orders</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.topProducts.map((p, i) => (
                                        <tr key={String(p._id)} className="border-b border-slate-50 dark:border-slate-800/50">
                                            <td className="py-3 text-slate-400 text-xs">{i + 1}</td>
                                            <td className="py-3 font-medium text-slate-800 dark:text-slate-200 max-w-[160px] truncate">{p.name}</td>
                                            <td className="py-3 text-slate-500">{p.brand}</td>
                                            <td className="py-3 text-right text-emerald-600 dark:text-emerald-400 font-medium">₹{Number(p.revenue).toLocaleString('en-IN')}</td>
                                            <td className="py-3 text-right text-slate-500">{p.orders}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardBody>
            </Card>
        </div>
    );
}
