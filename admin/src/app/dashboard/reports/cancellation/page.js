'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardBody, Skeleton, Select, SelectItem } from '@heroui/react';
import { XCircle, CurrencyInr, ChartPie, Percent } from '@phosphor-icons/react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const YEARS = Array.from({ length: 4 }, (_, i) => String(new Date().getFullYear() - i));

const STATUS_COLORS = {
    Active: '#f08c00', Delivered: '#22c55e', Returned: '#94a3b8',
    Pending: '#f59e0b', Approved: '#3b82f6', Shipped: '#8b5cf6', Cancelled: '#ef4444',
};

export default function CancellationReport() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [year, setYear] = useState(String(new Date().getFullYear()));

    useEffect(() => {
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        fetch(`${API}/api/reports/cancellations?year=${year}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.ok ? r.json() : null)
            .then(d => { setData(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, [year]);

    const kpis = data ? [
        { label: 'Total Cancelled',    value: data.totalCancelled,                                                      icon: XCircle,    color: 'red'    },
        { label: 'Cancellation Rate',  value: `${data.cancellationRate}%`,                                              icon: Percent,    color: 'amber'  },
        { label: 'Lost Revenue',       value: `₹${Number(data.lostRevenue || 0).toLocaleString('en-IN')}`,             icon: CurrencyInr, color: 'rose'  },
        { label: 'Total Orders',       value: data.totalOrders,                                                          icon: ChartPie,   color: 'indigo' },
    ] : [];

    const barData = data ? {
        labels: data.monthly.map(m => m.month),
        datasets: [
            { label: 'Cancelled',    data: data.monthly.map(m => m.cancelled),    backgroundColor: 'rgba(239,68,68,0.75)',   borderRadius: 6 },
            { label: 'Lost Revenue', data: data.monthly.map(m => m.lostRevenue),  backgroundColor: 'rgba(245,158,11,0.65)', borderRadius: 6, yAxisID: 'y1' },
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

    const donutData = data ? {
        labels: data.totals.map(s => s._id),
        datasets: [{ data: data.totals.map(s => s.count), backgroundColor: data.totals.map(s => STATUS_COLORS[s._id] || '#94a3b8'), borderWidth: 0 }],
    } : null;

    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Cancellation <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">Report</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">Analyze failed bookings and lost revenue.</p>
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
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">Monthly Cancellations & Lost Revenue — {year}</p>
                    <p className="text-xs text-slate-400 mb-4">Red = cancellations (left) · Amber = lost revenue (right)</p>
                    <div className="h-64">
                        {loading ? <Skeleton className="h-full rounded-xl" /> : barData && <Bar data={barData} options={barOptions} />}
                    </div>
                </CardBody>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <CardBody className="p-6">
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Orders by Status</p>
                        <div className="h-48 flex items-center justify-center">
                            {loading ? <Skeleton className="h-full w-full rounded-xl" /> :
                                donutData && <Doughnut data={donutData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { color: '#94a3b8', font: { size: 11 } } } } }} />}
                        </div>
                    </CardBody>
                </Card>
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <CardBody className="p-6">
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Monthly Breakdown</p>
                        {loading ? [...Array(6)].map((_, i) => <Skeleton key={i} className="h-8 rounded-lg mb-2" />) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-xs text-slate-400 border-b border-slate-100 dark:border-slate-800">
                                            <th className="text-left pb-2 font-medium">Month</th>
                                            <th className="text-right pb-2 font-medium">Cancelled</th>
                                            <th className="text-right pb-2 font-medium">Lost Revenue</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data?.monthly.filter(m => m.cancelled > 0).map(m => (
                                            <tr key={m.month} className="border-b border-slate-50 dark:border-slate-800/50">
                                                <td className="py-2 text-slate-700 dark:text-slate-300">{m.month}</td>
                                                <td className="py-2 text-right text-red-500 font-medium">{m.cancelled}</td>
                                                <td className="py-2 text-right text-amber-600 dark:text-amber-400">₹{Number(m.lostRevenue).toLocaleString('en-IN')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
