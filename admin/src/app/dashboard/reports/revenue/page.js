'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardBody, Skeleton, Select, SelectItem } from '@heroui/react';
import { TrendUp, CurrencyInr, ShoppingCart, Users, ChartBar } from '@phosphor-icons/react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const YEARS = Array.from({ length: 4 }, (_, i) => String(new Date().getFullYear() - i));

const STATUS_COLORS = {
    Active: '#6366f1', Delivered: '#22c55e', Returned: '#94a3b8',
    Pending: '#f59e0b', Approved: '#3b82f6', Shipped: '#8b5cf6',
    Cancelled: '#ef4444',
};

export default function RevenueReport() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [year, setYear] = useState(String(new Date().getFullYear()));

    useEffect(() => {
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        fetch(`${API}/api/reports/revenue?year=${year}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.ok ? r.json() : null)
            .then(d => { setData(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, [year]);

    const kpis = data ? [
        { label: 'Total Revenue',   value: `₹${Number(data.totals?.totalRevenue || 0).toLocaleString('en-IN')}`, icon: CurrencyInr, color: 'emerald' },
        { label: 'Total Orders',    value: data.totals?.totalOrders || 0,                                          icon: ShoppingCart, color: 'indigo'  },
        { label: 'Paid Orders',     value: data.totals?.paidOrders  || 0,                                          icon: ChartBar,    color: 'blue'    },
        { label: 'Avg Order Value', value: data.totals?.totalOrders > 0 ? `₹${Math.round((data.totals.totalRevenue || 0) / data.totals.totalOrders).toLocaleString('en-IN')}` : '₹0', icon: TrendUp, color: 'amber' },
    ] : [];

    const barData = data ? {
        labels: data.monthly.map(m => m.month),
        datasets: [
            { label: 'Revenue (₹)', data: data.monthly.map(m => m.revenue), backgroundColor: 'rgba(99,102,241,0.75)', borderRadius: 6 },
            { label: 'Orders',       data: data.monthly.map(m => m.orders),  backgroundColor: 'rgba(34,197,94,0.65)',  borderRadius: 6, yAxisID: 'y1' },
        ],
    } : null;

    const barOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'top', labels: { font: { size: 12 }, color: '#94a3b8' } }, tooltip: { mode: 'index' } },
        scales: {
            x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
            y: { grid: { color: 'rgba(148,163,184,0.1)' }, ticks: { color: '#94a3b8', callback: v => `₹${Number(v).toLocaleString('en-IN')}` } },
            y1: { position: 'right', grid: { display: false }, ticks: { color: '#94a3b8' } },
        },
    };

    const donutData = data ? {
        labels: data.byStatus.map(s => s._id),
        datasets: [{ data: data.byStatus.map(s => s.count), backgroundColor: data.byStatus.map(s => STATUS_COLORS[s._id] || '#94a3b8'), borderWidth: 0 }],
    } : null;

    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Revenue <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">Report</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">Monthly revenue trends, order volume, and payment breakdown.</p>
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
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">Monthly Revenue & Orders — {year}</p>
                    <p className="text-xs text-slate-400 mb-4">Blue bars = revenue (left axis) · Green bars = orders (right axis)</p>
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
                    <CardBody className="p-6 space-y-3">
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">Status Breakdown</p>
                        {loading ? [...Array(5)].map((_, i) => <Skeleton key={i} className="h-8 rounded-lg" />) :
                            data?.byStatus.sort((a, b) => b.count - a.count).map(s => {
                                const total = data.byStatus.reduce((sum, x) => sum + x.count, 0);
                                const pct = total > 0 ? Math.round(s.count / total * 100) : 0;
                                return (
                                    <div key={s._id}>
                                        <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                                            <span>{s._id}</span><span>{s.count} ({pct}%)</span>
                                        </div>
                                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                                            <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: STATUS_COLORS[s._id] || '#94a3b8' }} />
                                        </div>
                                    </div>
                                );
                            })}
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
