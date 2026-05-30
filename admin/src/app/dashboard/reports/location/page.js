'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardBody, Skeleton } from '@heroui/react';
import { MapPin, CurrencyInr, ShoppingCart, Users } from '@phosphor-icons/react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const CITY_COLORS = [
    'rgba(99,102,241,0.8)', 'rgba(34,197,94,0.8)', 'rgba(245,158,11,0.8)',
    'rgba(59,130,246,0.8)', 'rgba(139,92,246,0.8)', 'rgba(20,184,166,0.8)',
    'rgba(249,115,22,0.8)', 'rgba(236,72,153,0.8)', 'rgba(16,185,129,0.8)', 'rgba(239,68,68,0.8)',
];

export default function LocationReport() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        fetch(`${API}/api/reports/location`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.ok ? r.json() : null)
            .then(d => { setData(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const cities = data?.byCity || [];
    const top = cities[0] || {};

    const kpis = data ? [
        { label: 'Cities Served',   value: data.totals?.citiesCount || cities.length,                       icon: MapPin,      color: 'indigo'  },
        { label: 'Top City',        value: top.city || '—',                                                  icon: MapPin,      color: 'blue'    },
        { label: 'Top City Revenue', value: `₹${Number(top.revenue || 0).toLocaleString('en-IN')}`,        icon: CurrencyInr, color: 'emerald' },
        { label: 'Top City Orders', value: top.orders || 0,                                                  icon: ShoppingCart, color: 'amber'  },
    ] : [];

    const barData = data ? {
        labels: cities.map(c => c.city || 'Unknown'),
        datasets: [
            { label: 'Revenue (₹)', data: cities.map(c => c.revenue), backgroundColor: cities.map((_, i) => CITY_COLORS[i % CITY_COLORS.length]), borderRadius: 6 },
        ],
    } : null;

    const barOptions = {
        indexAxis: 'y',
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => `₹${Number(ctx.raw).toLocaleString('en-IN')} · ${cities[ctx.dataIndex]?.orders} orders · ${cities[ctx.dataIndex]?.customers} customers` } } },
        scales: {
            x: { grid: { color: 'rgba(148,163,184,0.1)' }, ticks: { color: '#94a3b8', callback: v => `₹${Number(v).toLocaleString('en-IN')}` } },
            y: { grid: { display: false }, ticks: { color: '#94a3b8' } },
        },
    };

    const chartHeight = Math.max(300, (cities.length || 5) * 44);
    const totalRevenue = cities.reduce((s, c) => s + c.revenue, 0);

    return (
        <div className="w-full space-y-6 pb-12">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                    Location <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">Analytics</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400">Find top cities and regions driving your rental business.</p>
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
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">Revenue by City</p>
                    <p className="text-xs text-slate-400 mb-4">Hover to see orders and unique customers per city</p>
                    <div style={{ height: `${chartHeight}px` }}>
                        {loading ? <Skeleton className="h-full rounded-xl" /> : barData && <Bar data={barData} options={barOptions} />}
                    </div>
                </CardBody>
            </Card>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <CardBody className="p-6">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">City Details</p>
                    {loading ? [...Array(6)].map((_, i) => <Skeleton key={i} className="h-10 rounded-lg mb-2" />) : (
                        <div className="space-y-3">
                            {cities.map((c, i) => {
                                const pct = totalRevenue > 0 ? Math.round(c.revenue / totalRevenue * 100) : 0;
                                return (
                                    <div key={c.city || i}>
                                        <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                                            <span className="flex items-center gap-1.5">
                                                <span className="text-slate-400">{i + 1}</span>
                                                <MapPin size={12} className="text-indigo-400" />
                                                {c.city || 'Unknown'}
                                            </span>
                                            <span>₹{Number(c.revenue).toLocaleString('en-IN')} · {c.orders} orders · {c.customers} customers ({pct}%)</span>
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
        </div>
    );
}
