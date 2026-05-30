'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardBody, Skeleton, Select, SelectItem } from '@heroui/react';
import { Users, TrendDown, UserMinus, UserCheck } from '@phosphor-icons/react';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const YEARS = Array.from({ length: 4 }, (_, i) => String(new Date().getFullYear() - i));

export default function ChurnReport() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [year, setYear] = useState(String(new Date().getFullYear()));

    useEffect(() => {
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        fetch(`${API}/api/reports/churn?year=${year}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.ok ? r.json() : null)
            .then(d => { setData(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, [year]);

    const kpis = data ? [
        { label: 'Total Customers', value: data.totalCustomers,                              icon: Users,      color: 'indigo'  },
        { label: 'Active (30 days)', value: data.active30,                                   icon: UserCheck,  color: 'emerald' },
        { label: 'Churn Rate',       value: `${data.churnRate}%`,                            icon: TrendDown,  color: 'red'     },
        { label: 'Active (90 days)', value: data.active90,                                   icon: UserMinus,  color: 'amber'   },
    ] : [];

    const lineData = data ? {
        labels: data.newUsers.map(m => m.month),
        datasets: [
            { label: 'New Users',     data: data.newUsers.map(m => m.count),      borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.1)', tension: 0.4, fill: true, pointRadius: 4 },
            { label: 'Monthly Active', data: data.monthlyActive.map(m => m.count), borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.1)',  tension: 0.4, fill: true, pointRadius: 4 },
        ],
    } : null;

    const lineOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'top', labels: { color: '#94a3b8', font: { size: 12 } } }, tooltip: { mode: 'index' } },
        scales: {
            x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
            y: { grid: { color: 'rgba(148,163,184,0.1)' }, ticks: { color: '#94a3b8' }, beginAtZero: true },
        },
    };

    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Churn <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">Report</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">Identify customers at risk of leaving the platform.</p>
                </motion.div>
                <Select size="sm" selectedKeys={[year]} onSelectionChange={k => setYear([...k][0])} className="w-32"
                    classNames={{ trigger: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 h-10' }}>
                    {YEARS.map(y => <SelectItem key={y}>{y}</SelectItem>)}
                </Select>
            </div>

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
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">New vs Active Users — {year}</p>
                    <p className="text-xs text-slate-400 mb-4">Purple = new signups · Green = placed an order that month</p>
                    <div className="h-64">
                        {loading ? <Skeleton className="h-full rounded-xl" /> : lineData && <Line data={lineData} options={lineOptions} />}
                    </div>
                </CardBody>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: 'Active last 30 days',  value: data?.active30,  pct: data ? Math.round(data.active30 / (data.totalCustomers || 1) * 100) : 0,  color: 'emerald' },
                    { label: 'Active last 60 days',  value: data?.active60,  pct: data ? Math.round(data.active60 / (data.totalCustomers || 1) * 100) : 0,  color: 'blue'    },
                    { label: 'Active last 90 days',  value: data?.active90,  pct: data ? Math.round(data.active90 / (data.totalCustomers || 1) * 100) : 0,  color: 'indigo'  },
                ].map(item => (
                    <Card key={item.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <CardBody className="p-6">
                            {loading ? <Skeleton className="h-16 rounded-xl" /> : (
                                <>
                                    <p className="text-xs text-slate-500 font-medium mb-2">{item.label}</p>
                                    <p className="text-3xl font-black text-slate-900 dark:text-slate-100">{item.value ?? '—'}</p>
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-3">
                                        <div className={`h-1.5 rounded-full bg-${item.color}-500 transition-all`} style={{ width: `${item.pct}%` }} />
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">{item.pct}% of total customers</p>
                                </>
                            )}
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    );
}
