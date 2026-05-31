'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardBody, Skeleton } from '@heroui/react';
import { Package, CurrencyInr, ShoppingCart, Stack } from '@phosphor-icons/react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function CategoryReport() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        fetch(`${API}/api/reports/category-performance`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.ok ? r.json() : null)
            .then(d => { setData(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const cats = data?.categories || [];
    const top = cats[0] || {};

    const kpis = data ? [
        { label: 'Total Categories', value: cats.length,                                                          icon: Package,     color: 'indigo'  },
        { label: 'Top Category',     value: top.name || '—',                                                      icon: Stack,       color: 'blue'    },
        { label: 'Top Revenue',      value: `₹${Number(top.revenue || 0).toLocaleString('en-IN')}`,               icon: CurrencyInr, color: 'emerald' },
        { label: 'Total Orders',     value: cats.reduce((s, c) => s + c.orders, 0),                               icon: ShoppingCart, color: 'amber'  },
    ] : [];

    const barData = data ? {
        labels: cats.map(c => c.name),
        datasets: [
            { label: 'Revenue (₹)', data: cats.map(c => c.revenue), backgroundColor: 'rgba(240,140,0,0.75)', borderRadius: 6 },
            { label: 'Orders',      data: cats.map(c => c.orders),  backgroundColor: 'rgba(34,197,94,0.65)',  borderRadius: 6 },
        ],
    } : null;

    const barOptions = {
        indexAxis: 'y',
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'top', labels: { color: '#94a3b8', font: { size: 12 } } }, tooltip: { mode: 'index' } },
        scales: {
            x: { grid: { color: 'rgba(148,163,184,0.1)' }, ticks: { color: '#94a3b8', callback: v => `₹${Number(v).toLocaleString('en-IN')}` } },
            y: { grid: { display: false }, ticks: { color: '#94a3b8' } },
        },
    };

    const chartHeight = Math.max(300, (cats.length || 5) * 48);

    return (
        <div className="w-full space-y-6 pb-12">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                    Category <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">Performance</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400">See which product categories drive the most revenue.</p>
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
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">Revenue by Category</p>
                    <p className="text-xs text-slate-400 mb-4">Horizontal bar — sorted by highest revenue</p>
                    <div style={{ height: `${chartHeight}px` }}>
                        {loading ? <Skeleton className="h-full rounded-xl" /> : barData && <Bar data={barData} options={barOptions} />}
                    </div>
                </CardBody>
            </Card>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <CardBody className="p-6">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Category Details</p>
                    {loading ? [...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 rounded-lg mb-2" />) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-xs text-slate-400 border-b border-slate-100 dark:border-slate-800">
                                        <th className="text-left pb-3 font-medium">Category</th>
                                        <th className="text-right pb-3 font-medium">Revenue</th>
                                        <th className="text-right pb-3 font-medium">Orders</th>
                                        <th className="text-right pb-3 font-medium">Items</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cats.map((c, i) => (
                                        <tr key={c.name} className="border-b border-slate-50 dark:border-slate-800/50">
                                            <td className="py-3 font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                                <span className="text-xs text-slate-400 w-5">{i + 1}</span>{c.name}
                                            </td>
                                            <td className="py-3 text-right text-slate-700 dark:text-slate-300">₹{Number(c.revenue).toLocaleString('en-IN')}</td>
                                            <td className="py-3 text-right text-slate-500">{c.orders}</td>
                                            <td className="py-3 text-right text-slate-500">{c.items}</td>
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
