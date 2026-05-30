'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardBody, Skeleton } from '@heroui/react';
import { Cube, ChartBar, Package, ArrowUp } from '@phosphor-icons/react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function InventoryReport() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        fetch(`${API}/api/reports/inventory-utilization`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.ok ? r.json() : null)
            .then(d => { setData(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const items = data?.inventory || [];
    const top = items[0] || {};
    const totalRented = items.reduce((s, i) => s + i.currentRented, 0);

    const kpis = data ? [
        { label: 'Total Products',   value: data.totalProducts,                        icon: Package,  color: 'indigo'  },
        { label: 'Avg Utilization',  value: `${data.avgUtilization}%`,                 icon: ChartBar, color: 'blue'    },
        { label: 'Highest Utilized', value: top.name ? `${top.utilization}% — ${top.name.substring(0, 14)}…` : '—', icon: ArrowUp, color: 'emerald' },
        { label: 'Currently Rented', value: totalRented,                               icon: Cube,     color: 'amber'   },
    ] : [];

    const barData = data ? {
        labels: items.slice(0, 12).map(i => i.name.length > 16 ? i.name.substring(0, 16) + '…' : i.name),
        datasets: [{
            label: 'Utilization %',
            data: items.slice(0, 12).map(i => i.utilization),
            backgroundColor: items.slice(0, 12).map(i =>
                i.utilization >= 80 ? 'rgba(239,68,68,0.75)' :
                i.utilization >= 50 ? 'rgba(245,158,11,0.75)' :
                                      'rgba(99,102,241,0.75)'
            ),
            borderRadius: 6,
        }],
    } : null;

    const barOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => `${ctx.raw}% utilized` } } },
        scales: {
            x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 } } },
            y: { grid: { color: 'rgba(148,163,184,0.1)' }, ticks: { color: '#94a3b8', callback: v => `${v}%` }, max: 100 },
        },
    };

    const utilColor = (pct) => pct >= 80 ? 'text-red-500' : pct >= 50 ? 'text-amber-500' : 'text-emerald-500';
    const utilBarColor = (pct) => pct >= 80 ? 'bg-red-500' : pct >= 50 ? 'bg-amber-500' : 'bg-emerald-500';

    return (
        <div className="w-full space-y-6 pb-12">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                    Inventory <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">Utilization</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400">Track how efficiently your product catalogue is being used.</p>
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
                                    <p className="text-base font-black text-slate-900 dark:text-slate-100 mt-0.5 leading-tight">{k.value}</p>
                                </CardBody>
                            </Card>
                        </motion.div>
                    ))}
            </div>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <CardBody className="p-6">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">Top 12 Products by Utilization %</p>
                    <p className="text-xs text-slate-400 mb-4">
                        <span className="text-red-400">Red ≥ 80%</span> · <span className="text-amber-400">Amber ≥ 50%</span> · <span className="text-indigo-400">Purple below 50%</span>
                    </p>
                    <div className="h-64">
                        {loading ? <Skeleton className="h-full rounded-xl" /> : barData && <Bar data={barData} options={barOptions} />}
                    </div>
                </CardBody>
            </Card>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <CardBody className="p-6">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">All Products</p>
                    {loading ? [...Array(6)].map((_, i) => <Skeleton key={i} className="h-10 rounded-lg mb-2" />) : (
                        <div className="space-y-3">
                            {items.map(item => (
                                <div key={item._id}>
                                    <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                                        <span className="truncate max-w-[60%]">{item.name}</span>
                                        <span className={`font-bold ${utilColor(item.utilization)}`}>
                                            {item.utilization}% · {item.currentRented}/{item.totalStock} rented
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                                        <div className={`h-1.5 rounded-full transition-all ${utilBarColor(item.utilization)}`} style={{ width: `${item.utilization}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardBody>
            </Card>
        </div>
    );
}
