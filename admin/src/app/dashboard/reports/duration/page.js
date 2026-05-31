'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardBody, Skeleton } from '@heroui/react';
import { Calendar, ChartBar, Timer, CurrencyInr } from '@phosphor-icons/react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function RentalDurationReport() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        fetch(`${API}/api/reports/rental-duration`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.ok ? r.json() : null)
            .then(d => { setData(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const kpis = data ? [
        { label: 'Total Rentals',      value: data.avg?.total || 0,                                                      icon: ChartBar,    color: 'indigo' },
        { label: 'Avg Duration',       value: data.avg?.avg ? `${data.avg.avg.toFixed(1)} mo` : '—',                     icon: Timer,       color: 'blue'   },
        { label: 'Most Popular',       value: data.durations?.reduce((a, b) => b.count > a.count ? b : a, {})?.label || '—', icon: Calendar, color: 'emerald' },
        { label: 'Top Duration Rev.',  value: `₹${Number(data.durations?.reduce((a, b) => b.revenue > a.revenue ? b : a, {})?.revenue || 0).toLocaleString('en-IN')}`, icon: CurrencyInr, color: 'amber' },
    ] : [];

    const barData = data ? {
        labels: data.durations.map(d => d.label),
        datasets: [
            { label: 'Rentals', data: data.durations.map(d => d.count), backgroundColor: 'rgba(240,140,0,0.75)', borderRadius: 6 },
            { label: 'Revenue (₹)', data: data.durations.map(d => d.revenue), backgroundColor: 'rgba(34,197,94,0.65)', borderRadius: 6, yAxisID: 'y1' },
        ],
    } : null;

    const barOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'top', labels: { color: '#94a3b8', font: { size: 12 } } }, tooltip: { mode: 'index' } },
        scales: {
            x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
            y: { grid: { color: 'rgba(148,163,184,0.1)' }, ticks: { color: '#94a3b8' } },
            y1: { position: 'right', grid: { display: false }, ticks: { color: '#94a3b8', callback: v => `₹${Number(v).toLocaleString('en-IN')}` } },
        },
    };

    return (
        <div className="w-full space-y-6 pb-12">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                    Rental <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">Duration</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400">Analyse average rental periods and duration trends.</p>
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
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">Rentals & Revenue by Duration Bucket</p>
                    <p className="text-xs text-slate-400 mb-4">Purple = rentals (left) · Green = revenue (right)</p>
                    <div className="h-64">
                        {loading ? <Skeleton className="h-full rounded-xl" /> : barData && <Bar data={barData} options={barOptions} />}
                    </div>
                </CardBody>
            </Card>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <CardBody className="p-6">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Duration Breakdown</p>
                    {loading ? [...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 rounded-lg mb-2" />) : (
                        <div className="space-y-3">
                            {data?.durations.map(d => {
                                const total = data.durations.reduce((s, x) => s + x.count, 0);
                                const pct = total > 0 ? Math.round(d.count / total * 100) : 0;
                                return (
                                    <div key={d.label}>
                                        <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                                            <span>{d.label}</span>
                                            <span>{d.count} rentals · ₹{Number(d.revenue).toLocaleString('en-IN')} ({pct}%)</span>
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
