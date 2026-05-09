'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardBody, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Skeleton } from "@heroui/react";
import { CurrencyInr, Calendar, WarningCircle, CheckCircle, ArrowDownRight, DownloadSimple } from "@phosphor-icons/react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function UserPayments() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const token = localStorage.getItem("adminToken");
                const res = await fetch(`${API}/api/admin/rentals`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Failed to fetch payments");
                const data = await res.json();
                // Map rentals → payment records
                const paymentList = data.map(r => ({
                    _id: r._id,
                    txnId: `TXN-${r._id.toString().slice(-8).toUpperCase()}`,
                    user: r.user?.name || "Unknown",
                    email: r.user?.email || "",
                    amount: r.totalPrice || 0,
                    method: r.paymentMethod || "Razorpay",
                    status: r.isPaid ? "Success" : "Pending",
                    date: new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
                }));
                setPayments(paymentList);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPayments();
    }, []);

    const exportCSV = () => {
        const headers = "Transaction ID,User,Email,Amount,Method,Status,Date\n";
        const rows = payments.map(p =>
            `${p.txnId},${p.user},${p.email},₹${p.amount},${p.method},${p.status},${p.date}`
        ).join("\n");
        const blob = new Blob([headers + rows], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url; a.download = "payment_history.csv"; a.click();
    };

    const totalPaid = payments.filter(p => p.status === "Success").reduce((s, p) => s + p.amount, 0);

    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Payment <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">History</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Complete audit log of all financial transactions on the platform.</p>
                </motion.div>
                <div className="flex items-center gap-3">
                    {!loading && (
                        <Chip size="lg" color="success" variant="flat" className="font-bold text-sm px-3">
                            ₹{totalPaid.toLocaleString("en-IN")} Collected
                        </Chip>
                    )}
                    <button type="button" onClick={exportCSV} className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors">
                        <DownloadSimple size={15} />
                        Export Report
                    </button>
                </div>
            </div>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <CardBody className="p-0">
                    {error ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3 text-rose-500">
                            <WarningCircle size={40} weight="bold" />
                            <p className="font-semibold">{error}</p>
                        </div>
                    ) : loading ? (
                        <div className="p-6 space-y-4">
                            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-xl" />)}
                        </div>
                    ) : (
                        <Table
                            aria-label="Payment history table"
                            classNames={{
                                wrapper: "p-0 rounded-none shadow-none bg-transparent",
                                th: "bg-slate-50 dark:bg-slate-950/80 uppercase text-xs font-bold h-12 pt-0 px-6",
                                td: "py-4 px-6 border-b border-slate-100 dark:border-slate-800/50"
                            }}
                        >
                            <TableHeader>
                                <TableColumn>TXN ID</TableColumn>
                                <TableColumn>PAYMENT FROM</TableColumn>
                                <TableColumn>AMOUNT</TableColumn>
                                <TableColumn>METHOD</TableColumn>
                                <TableColumn>DATE</TableColumn>
                                <TableColumn align="center">STATUS</TableColumn>
                            </TableHeader>
                            <TableBody items={payments} emptyContent="No transactions found.">
                                {(item) => (
                                    <TableRow key={item._id}>
                                        <TableCell>
                                            <span className="font-mono text-xs font-bold text-slate-500 tracking-wider">{item.txnId}</span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.user}</span>
                                                <span className="text-xs text-slate-500">{item.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-bold text-slate-900 dark:text-white">₹{parseFloat(item.amount).toLocaleString("en-IN")}</span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                                <CurrencyInr className="text-indigo-500" /> {item.method}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-slate-500">{item.date}</TableCell>
                                        <TableCell>
                                            <div className="flex justify-center">
                                                <Chip
                                                    size="sm"
                                                    color={item.status === "Success" ? "success" : "warning"}
                                                    variant="flat"
                                                    className="font-bold"
                                                    startContent={item.status === "Success" ? <CheckCircle weight="bold" /> : <ArrowDownRight weight="bold" />}
                                                >
                                                    {item.status}
                                                </Chip>
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
