'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardBody, Chip, Skeleton } from "@heroui/react";
import { ChartBar, TrendUp, CurrencyInr, ShoppingCart, Users, Calendar } from "@phosphor-icons/react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function RevenueReport() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch_ = async () => {
            try {
                const token = localStorage.getItem("adminToken");
                const res = await fetch(`${API}/api/admin/stats`, { headers: { Authorization: `Bearer ${token}` } });
                if (res.ok) setStats(await res.json());
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetch_();
    }, []);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonth = new Date().getMonth();
    const mockMonthlyBar = months.map((m, i) => ({ month: m, value: i <= currentMonth ? Math.floor(Math.random() * 80 + 20) : 0 }));

    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Revenue <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Report</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Revenue trends, order volume, and financial performance overview.</p>
                </motion.div>
                <Chip size="lg" color="success" variant="flat" startContent={<TrendUp weight="bold" />} className="font-bold text-sm px-3">Live Data</Chip>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Revenue", value: stats ? `₹${Number(stats.totalRevenue || 0).toLocaleString("en-IN")}` : "₹0", icon: CurrencyInr, color: "emerald" },
                    { label: "Total Orders", value: stats?.totalRentals || 0, icon: ShoppingCart, color: "indigo" },
                    { label: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "purple" },
                    { label: "Avg. Order Value", value: stats && stats.totalRentals > 0 ? `₹${Math.round((stats.totalRevenue || 0) / stats.totalRentals).toLocaleString("en-IN")}` : "₹0", icon: ChartBar, color: "amber" },
                ].map((kpi, i) => (
                    <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 h-full">
                            <CardBody className="p-5">
                                <div className={`w-10 h-10 rounded-xl bg-${kpi.color}-100 dark:bg-${kpi.color}-500/10 flex items-center justify-center text-${kpi.color}-600 dark:text-${kpi.color}-400 mb-3`}>
                                    <kpi.icon weight="bold" size={20} />
                                </div>
                                <p className="text-xs text-slate-500 font-medium mb-1">{kpi.label}</p>
                                {loading ? <Skeleton className="h-8 w-24 rounded-lg" /> : (
                                    <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{kpi.value}</p>
                                )}
                            </CardBody>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Monthly Revenue Bar Chart (visual) */}
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <CardBody className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Monthly Revenue Trend</p>
                            <p className="text-xs text-slate-500">{new Date().getFullYear()} Performance Overview</p>
                        </div>
                        <Calendar className="text-indigo-500" size={20} weight="bold" />
                    </div>
                    <div className="flex items-end gap-2 h-40">
                        {mockMonthlyBar.map((bar, i) => (
                            <div key={bar.month} className="flex-1 flex flex-col items-center gap-1">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${bar.value}%` }}
                                    transition={{ delay: i * 0.05, duration: 0.5, ease: "easeOut" }}
                                    className={`w-full rounded-t-lg ${i <= currentMonth
                                        ? i === currentMonth
                                            ? "bg-indigo-500"
                                            : "bg-indigo-200 dark:bg-indigo-900/60"
                                        : "bg-slate-100 dark:bg-slate-800"
                                        }`}
                                    style={{ minHeight: bar.value > 0 ? "4px" : "0" }}
                                />
                                <span className="text-[10px] text-slate-400 font-medium">{bar.month}</span>
                            </div>
                        ))}
                    </div>
                </CardBody>
            </Card>

            {/* Revenue breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <CardBody className="p-6 space-y-4">
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Revenue by Status</p>
                        {[
                            { label: "Paid Orders", pct: 72, color: "bg-emerald-500" },
                            { label: "Pending Payment", pct: 18, color: "bg-amber-500" },
                            { label: "Cancelled / Refunded", pct: 10, color: "bg-rose-500" },
                        ].map(item => (
                            <div key={item.label}>
                                <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                                    <span>{item.label}</span><span>{item.pct}%</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${item.pct}%` }} transition={{ duration: 0.8, ease: "easeOut" }} className={`${item.color} h-2 rounded-full`} />
                                </div>
                            </div>
                        ))}
                    </CardBody>
                </Card>
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <CardBody className="p-6 space-y-4">
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Quick Metrics</p>
                        {[
                            { label: "Active Rentals", value: stats?.activeRentals || 0, color: "text-indigo-500" },
                            { label: "Pending Orders", value: stats?.pendingRentals || 0, color: "text-amber-500" },
                            { label: "Returned Items", value: stats?.returnedRentals || 0, color: "text-slate-500" },
                            { label: "New Users (30d)", value: stats?.newUsersThisMonth || 0, color: "text-emerald-500" },
                        ].map(m => (
                            <div key={m.label} className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                                <span className="text-sm text-slate-600 dark:text-slate-400">{m.label}</span>
                                {loading ? <Skeleton className="h-5 w-10 rounded" /> : (
                                    <span className={`text-lg font-black ${m.color}`}>{m.value}</span>
                                )}
                            </div>
                        ))}
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
