'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardBody, Skeleton, Select, SelectItem } from '@heroui/react';
import { ArrowCounterClockwise, CurrencyInr, Percent, ShoppingCart } from '@phosphor-icons/react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const YEARS = Array.from({ length: 4 }, (_, i) => String(new Date().getFullYear() - i));

export default function RefundReport() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [year, setYear] = useState(String(new Date().getFullYear()));

    useEffect(() => {
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        fetch(`${API}/api/reports/refunds?year=${year}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.ok ? r.json() : null)
            .then(d => { setData(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, [year]);

    const kpis = data ? [
        { label: 'Total Refunds',   value: data.refundCount,                                                        icon: ArrowCounterClockwise, color: 'red'    },
        { label: 'Refund Amount',   value: `₹${Number(data.totalRefunds || 0).toLocaleString('en-IN')}`,           icon: CurrencyInr,           color: 'rose'   },
        { label: 'Refund Rate',     value: `${data.refundRate}%`,                                                   icon: Percent,               color: 'amber'  },
        { label: 'Paid Orders',     value: data.paidOrders,                                                         icon: ShoppingCart,          color: 'indigo' },
    ] : [];

    const barData = data ? {
        labels: data.monthly.map(m => m.month),
        datasets: [
            { label: 'Refunds',        data: data.monthly.map(m => m.count),  backgroundColor: 'rgba(239,68,68,0.75)',  borderRadius: 6 },
            { label: 'Amount (₹)',     data: data.monthly.map(m => m.amount), backgroundColor: 'rgba(245,158,11,0.65)', borderRadius: 6, yAxisID: 'y1' },
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
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Refund <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">Report</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">Track refunds and revenue losses from cancelled paid orders.</p>
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
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">Monthly Refunds & Amounts — {year}</p>
                    <p className="text-xs text-slate-400 mb-4">Red = refund count (left) · Amber = refund amount (right)</p>
                    <div className="h-64">
                        {loading ? <Skeleton className="h-full rounded-xl" /> : barData && <Bar data={barData} options={barOptions} />}
                    </div>
                </CardBody>
            </Card>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <CardBody className="p-6">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Most Refunded Products</p>
                    {loading ? [...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 rounded-lg mb-2" />) : (
                        data?.topRefunded?.length ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-xs text-slate-400 border-b border-slate-100 dark:border-slate-800">
                                            <th className="text-left pb-3 font-medium">#</th>
                                            <th className="text-left pb-3 font-medium">Product</th>
                                            <th className="text-right pb-3 font-medium">Refunds</th>
                                            <th className="text-right pb-3 font-medium">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.topRefunded.map((p, i) => (
                                            <tr key={i} className="border-b border-slate-50 dark:border-slate-800/50">
                                                <td className="py-3 text-slate-400 text-xs">{i + 1}</td>
                                                <td className="py-3 font-medium text-slate-800 dark:text-slate-200">{p.name}</td>
                                                <td className="py-3 text-right text-red-500">{p.count}</td>
                                                <td className="py-3 text-right text-amber-600 dark:text-amber-400">₹{Number(p.amount).toLocaleString('en-IN')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400 text-center py-8">No refund data available</p>
                        )
                    )}
                </CardBody>
            </Card>
        </div>
    );
}
