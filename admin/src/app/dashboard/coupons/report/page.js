'use client';
import toast from 'react-hot-toast';
import React, { useEffect, useState, useMemo } from 'react';
import { ChartBar, Download, User, Calendar, Tag, CurrencyInr, CheckCircle, Clock, ArrowUp, ArrowDown, ArrowsDownUp } from '@phosphor-icons/react';
import { Spinner } from '@heroui/react';
import { downloadPDFReport } from "@/utils/pdfReport";

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

export default function ReportPage() {
    const [report, setReport] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortField, setSortField] = useState("date");
    const [sortDir, setSortDir] = useState("descending");

    const toggleSort = (field) => {
        if (sortField === field) {
            setSortDir(d => d === "ascending" ? "descending" : "ascending");
        } else {
            setSortField(field);
            setSortDir("ascending");
        }
    };

    const SortIcon = ({ field }) => {
        if (sortField !== field) return <ArrowsDownUp size={13} className="text-slate-300 ml-1 inline" />;
        return sortDir === "ascending"
            ? <ArrowUp size={13} className="text-indigo-500 ml-1 inline" />
            : <ArrowDown size={13} className="text-indigo-500 ml-1 inline" />;
    };

    const sortedReport = useMemo(() => {
        return [...report].sort((a, b) => {
            let first = a[sortField];
            let second = b[sortField];
            if (sortField === 'date') {
                first = new Date(first).getTime();
                second = new Date(second).getTime();
            }
            const cmp = (first ?? '') < (second ?? '') ? -1 : (first ?? '') > (second ?? '') ? 1 : 0;
            return sortDir === "descending" ? -cmp : cmp;
        });
    }, [report, sortField, sortDir]);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const res = await window.fetch(`${API}/api/coupons/report`, {
                    headers: { 'Authorization': `Bearer ${getToken()}` }
                });
                if (res.ok) {
                    const json = await res.json();
                    setReport(json);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, []);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active': case 'delivered': return 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400';
            case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400';
            case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400';
            default: return 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300';
        }
    };

    const exportPDF = () => {
        if (report.length === 0) {
            toast.error("No data to export");
            return;
        }
        const headers = ["Order Date", "Customer", "Email", "Coupon Code", "Discount", "Order Total", "Status"];
        const data = report.map(item => [
            new Date(item.date).toLocaleDateString('en-GB'),
            item.user || "-",
            item.email || "-",
            item.couponCode || "-",
            `Rs. ${item.discount}`,
            `Rs. ${item.orderTotal}`,
            item.status || "-"
        ]);
        downloadPDFReport("Coupon Usage Report", headers, data, "coupon_usage_report");
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-slate-400 gap-3">
                <Spinner color="primary" />
                <p>Loading Usage Report...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-12">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400">
                        <ChartBar size={24} weight="bold" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Coupon Usage Report</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Detailed list of all orders that applied a discount code.</p>
                    </div>
                </div>
                <button
                    onClick={exportPDF}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                    <Download size={18} /> Export PDF
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                        <thead className="bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                            <tr>
                                <th className="px-6 py-4 font-semibold cursor-pointer select-none hover:text-indigo-600 transition-colors" onClick={() => toggleSort("date")}>
                                    Order / Date <SortIcon field="date" />
                                </th>
                                <th className="px-6 py-4 font-semibold cursor-pointer select-none hover:text-indigo-600 transition-colors" onClick={() => toggleSort("user")}>
                                    Customer <SortIcon field="user" />
                                </th>
                                <th className="px-6 py-4 font-semibold cursor-pointer select-none hover:text-indigo-600 transition-colors" onClick={() => toggleSort("couponCode")}>
                                    Coupon Used <SortIcon field="couponCode" />
                                </th>
                                <th className="px-6 py-4 font-semibold text-right cursor-pointer select-none hover:text-indigo-600 transition-colors" onClick={() => toggleSort("discount")}>
                                    Discount <SortIcon field="discount" />
                                </th>
                                <th className="px-6 py-4 font-semibold text-right cursor-pointer select-none hover:text-indigo-600 transition-colors" onClick={() => toggleSort("orderTotal")}>
                                    Order Total <SortIcon field="orderTotal" />
                                </th>
                                <th className="px-6 py-4 font-semibold text-center cursor-pointer select-none hover:text-indigo-600 transition-colors" onClick={() => toggleSort("status")}>
                                    Order Status <SortIcon field="status" />
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {sortedReport.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                                        No coupon usage data found yet.
                                    </td>
                                </tr>
                            ) : (
                                sortedReport.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-mono text-xs text-slate-400 dark:text-slate-500 mb-1">#{item.orderId?.slice(-6).toUpperCase()}</div>
                                            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
                                                <Calendar size={14} />
                                                {new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-800 dark:text-slate-100">{item.user}</div>
                                            <div className="text-xs text-slate-400 dark:text-slate-500">{item.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-400 font-bold text-xs">
                                                <Tag size={12} weight="fill" /> {item.couponCode}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right font-semibold text-[#00B200] dark:text-emerald-400">
                                            -₹{item.discount?.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-slate-800 dark:text-slate-100">
                                            ₹{item.orderTotal?.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
