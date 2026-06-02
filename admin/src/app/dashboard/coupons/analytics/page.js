'use client';
import React, { useEffect, useState } from 'react';
import { TrendUp, ChartLineUp, CurrencyInr, Tag, ArrowUpRight } from '@phosphor-icons/react';
import { Spinner } from '@heroui/react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

export default function AnalyticsPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await window.fetch(`${API}/api/coupons/analytics`, {
                    headers: { 'Authorization': `Bearer ${getToken()}` }
                });
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-slate-400 gap-3">
                <Spinner color="primary" />
                <p>Loading Analytics...</p>
            </div>
        );
    }

    if (!data) return <div className="p-8 text-red-500">Failed to load analytics</div>;

    // Find max for bar charts
    const maxCodeCount = Math.max(...(data.topCoupons.length ? data.topCoupons.map(c => c.count) : [1]));
    const maxTimelineCount = Math.max(...(data.timelineData.length ? data.timelineData.map(t => t.count) : [1]));

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <TrendUp size={24} weight="bold" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Coupon Analytics</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Visualize coupon effectiveness and conversion rates.</p>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-4">
                    <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                        <Tag size={20} /> <span className="font-medium">Total Usage</span>
                    </div>
                    <div className="text-4xl font-bold text-slate-800 dark:text-slate-100">{data.totalCouponsUsed}</div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-4">
                    <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                        <CurrencyInr size={20} /> <span className="font-medium">Total Discount Given</span>
                    </div>
                    <div className="text-4xl font-bold text-slate-800 dark:text-slate-100">₹{data.totalDiscountGiven.toLocaleString()}</div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-4">
                    <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                        <ChartLineUp size={20} /> <span className="font-medium">Revenue (from Coupons)</span>
                    </div>
                    <div className="text-4xl font-bold text-[#00B200] dark:text-emerald-400">₹{data.revenueFromCoupons.toLocaleString()}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                {/* Top Coupons Chart */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                        <ArrowUpRight className="text-indigo-500" /> Top Performing Codes
                    </h3>
                    <div className="space-y-4">
                        {data.topCoupons.length === 0 ? (
                            <p className="text-slate-400 dark:text-slate-500 text-sm">No coupon data available yet.</p>
                        ) : (
                            data.topCoupons.map((item, idx) => {
                                const percentage = (item.count / maxCodeCount) * 100;
                                return (
                                    <div key={idx} className="flex items-center gap-4">
                                        <div className="w-24 text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{item.code}</div>
                                        <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-indigo-500 rounded-full"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <div className="w-12 text-right text-sm font-semibold text-slate-600 dark:text-slate-300">{item.count}</div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Timeline Chart */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                        <TrendUp className="text-[#FF5A00]" /> Usage Timeline (Days active)
                    </h3>
                    <div className="flex items-end gap-2 h-[200px] mt-4 border-b border-slate-200 dark:border-slate-800 pb-2">
                        {data.timelineData.length === 0 ? (
                            <p className="text-slate-400 dark:text-slate-500 text-sm">No timeline data available yet.</p>
                        ) : (
                            data.timelineData.map((item, idx) => {
                                const heightPercent = (item.count / maxTimelineCount) * 100;
                                return (
                                    <div key={idx} className="flex-1 flex flex-col justify-end items-center group relative">
                                        <div className="absolute -top-8 bg-slate-800 dark:bg-slate-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            {item.count} uses
                                        </div>
                                        <div
                                            className="w-full bg-orange-400 hover:bg-orange-500 rounded-t-sm transition-colors"
                                            style={{ height: `${heightPercent}%`, minHeight: '4px' }}
                                        />
                                        <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 rotate-45 origin-left truncate w-full">
                                            {item.date.slice(5)}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
