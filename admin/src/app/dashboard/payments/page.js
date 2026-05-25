'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Card, CardBody, Button, Table, TableHeader, TableColumn, TableBody,
    TableRow, TableCell, Chip, Skeleton
} from "@heroui/react";
import { CurrencyInr, CheckCircle, XCircle, Clock, WarningCircle, DownloadSimple } from "@phosphor-icons/react";
import { downloadPDFReport } from "@/utils/pdfReport";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AllTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetch_ = async () => {
            try {
                const token = localStorage.getItem("adminToken");
                const res = await fetch(`${API}/api/admin/rentals`, { headers: { Authorization: `Bearer ${token}` } });
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();
                setTransactions(data.map(r => ({
                    _id: r._id,
                    txnId: `TXN-${r._id.toString().slice(-8).toUpperCase()}`,
                    user: r.user?.name || "Unknown",
                    email: r.user?.email || "",
                    amount: r.totalPrice || 0,
                    method: r.paymentMethod || "Razorpay",
                    status: r.isPaid ? "Success" : "Pending",
                    date: new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
                })));
            } catch (err) { setError(err.message); }
            finally { setLoading(false); }
        };
        fetch_();
    }, []);

    const total = transactions.filter(t => t.status === "Success").reduce((s, t) => s + t.amount, 0);

    const exportPDF = () => {
        const headers = ["TXN ID", "User", "Email", "Amount", "Method", "Status", "Date"];
        const data = transactions.map(t => [
            t.txnId, t.user, t.email, `Rs. ${t.amount}`, t.method, t.status, t.date
        ]);
        downloadPDFReport("Transactions Report", headers, data, "transactions_report");
    };

    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        All <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">Transactions</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-200">Complete financial audit log across all payment methods.</p>
                </motion.div>
                <div className="flex items-center gap-3">
                    {!loading && <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 rounded-full px-3 py-1.5 font-bold text-sm">₹{total.toLocaleString("en-IN")} Collected</div>}
                    <button type="button" onClick={exportPDF} className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:!bg-indigo-50 dark:hover:!bg-indigo-500/10 transition-colors">
                        <DownloadSimple size={15} />
                        Export PDF
                    </button>
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "Total Revenue", value: `₹${total.toLocaleString("en-IN")}`, icon: CurrencyInr, color: "text-emerald-500" },
                    { label: "Successful", value: transactions.filter(t => t.status === "Success").length, icon: CheckCircle, color: "text-emerald-500" },
                    { label: "Pending", value: transactions.filter(t => t.status === "Pending").length, icon: Clock, color: "text-amber-500" },
                ].map(s => (
                    <Card key={s.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <CardBody className="p-4 flex flex-row items-center gap-4">
                            <div className={`p-2 bg-slate-100 dark:bg-slate-800 rounded-xl ${s.color}`}>
                                <s.icon weight="bold" size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-medium">{s.label}</p>
                                <p className="text-xl font-black text-slate-900 dark:text-slate-100">{loading ? "..." : s.value}</p>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <CardBody className="p-0">
                    {error ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3 text-rose-500">
                            <WarningCircle size={40} weight="bold" /><p className="font-semibold">{error}</p>
                        </div>
                    ) : loading ? (
                        <div className="p-6 space-y-4">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-xl" />)}</div>
                    ) : (
                        <Table aria-label="Transactions table" classNames={{ wrapper: "p-0 rounded-none shadow-none bg-transparent", th: "bg-slate-50 dark:bg-slate-950/80 uppercase text-xs font-bold h-12 pt-0 px-6", td: "py-[1.2rem] px-6 border-b border-slate-100 dark:border-slate-800/50" }}>
                            <TableHeader>
                                <TableColumn>TXN ID</TableColumn>
                                <TableColumn>CUSTOMER</TableColumn>
                                <TableColumn>AMOUNT</TableColumn>
                                <TableColumn>METHOD</TableColumn>
                                <TableColumn>DATE</TableColumn>
                                <TableColumn align="center">STATUS</TableColumn>
                            </TableHeader>
                            <TableBody items={transactions} emptyContent="No transactions found.">
                                {(item) => (
                                    <TableRow key={item._id}>
                                        <TableCell><span className="font-mono text-xs font-bold text-slate-500">{item.txnId}</span></TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold">{item.user}</span>
                                                <span className="text-xs text-slate-500">{item.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-bold text-slate-900 dark:text-white">₹{parseFloat(item.amount).toLocaleString("en-IN")}</TableCell>
                                        <TableCell className="text-xs font-bold text-slate-500 uppercase">{item.method}</TableCell>
                                        <TableCell className="text-sm text-slate-500">{item.date}</TableCell>
                                        <TableCell>
                                            <div className="flex justify-center">
                                                <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-bold text-xs ${item.status === "Success"
                                                        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200"
                                                        : "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200"
                                                    }`}>
                                                    {item.status === "Success" ? <CheckCircle weight="bold" size={12} /> : <Clock weight="bold" size={12} />}
                                                    {item.status}
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardBody>
            </Card>
        </div>
    );
}
