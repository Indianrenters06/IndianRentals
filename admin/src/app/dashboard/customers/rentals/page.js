'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardBody, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Avatar, Skeleton } from "@heroui/react";
import { ShoppingCart, Calendar, WarningCircle, CheckCircle, Clock, ArrowRight } from "@phosphor-icons/react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function RentalHistory() {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRentals = async () => {
            try {
                const token = localStorage.getItem("adminToken");
                const res = await fetch(`${API}/api/admin/rentals`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Failed to fetch rentals");
                const data = await res.json();
                setRentals(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchRentals();
    }, []);

    const getStatusColor = (status) => {
        const map = {
            Active: "success", Delivered: "success", Returned: "default",
            Pending: "warning", Approved: "primary", Shipped: "primary",
            Cancelled: "danger"
        };
        return map[status] || "default";
    };

    const getStatusIcon = (status) => {
        if (["Active", "Delivered"].includes(status)) return <CheckCircle weight="bold" />;
        if (["Pending", "Approved", "Shipped"].includes(status)) return <Clock weight="bold" />;
        return null;
    };

    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Rental <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">History</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Track all active and past rentals across the user base.</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="flex gap-3">
                        <Chip size="lg" color="success" variant="flat" className="font-bold text-sm px-3">
                            {loading ? "..." : `${rentals.filter(r => r.status === "Active" || r.status === "Delivered").length} Active`}
                        </Chip>
                        <Chip size="lg" color="warning" variant="flat" className="font-bold text-sm px-3">
                            {loading ? "..." : `${rentals.filter(r => r.status === "Pending").length} Pending`}
                        </Chip>
                    </div>
                </motion.div>
            </div>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <CardBody className="p-0">
                    {error ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3 text-rose-500">
                            <WarningCircle size={40} weight="bold" />
                            <p className="font-semibold">{error}</p>
                            <p className="text-sm text-slate-500">Check that the backend server is running.</p>
                        </div>
                    ) : loading ? (
                        <div className="p-6 space-y-4">
                            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-xl" />)}
                        </div>
                    ) : (
                        <Table
                            aria-label="Rental history table"
                            classNames={{
                                wrapper: "p-0 rounded-none shadow-none bg-transparent",
                                th: "bg-slate-50 dark:bg-slate-950/80 uppercase text-xs font-bold h-12 pt-0 px-6",
                                td: "py-4 px-6 border-b border-slate-100 dark:border-slate-800/50"
                            }}
                        >
                            <TableHeader>
                                <TableColumn>ORDER ID</TableColumn>
                                <TableColumn>CUSTOMER</TableColumn>
                                <TableColumn>ITEMS</TableColumn>
                                <TableColumn>RENTAL PERIOD</TableColumn>
                                <TableColumn>AMOUNT</TableColumn>
                                <TableColumn align="center">STATUS</TableColumn>
                            </TableHeader>
                            <TableBody items={rentals} emptyContent="No rental records found.">
                                {(rental) => (
                                    <TableRow key={rental._id}>
                                        <TableCell>
                                            <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                                ORD-{rental._id.toString().slice(-6).toUpperCase()}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Avatar
                                                    size="sm"
                                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(rental.user?.name || 'U')}&background=6366f1&color=fff`}
                                                />
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{rental.user?.name || "Unknown"}</p>
                                                    <p className="text-xs text-slate-500">{rental.user?.email || ""}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-slate-600 dark:text-slate-400">
                                                {rental.orderItems?.length || 0} item{rental.orderItems?.length !== 1 ? 's' : ''}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-0.5">
                                                {rental.rentalPeriod?.startDate ? (
                                                    <>
                                                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                                            {new Date(rental.rentalPeriod.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400">
                                                            → {rental.rentalPeriod?.endDate ? new Date(rental.rentalPeriod.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "N/A"}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-xs text-slate-400">Not specified</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-bold text-slate-900 dark:text-slate-100">
                                                ₹{parseFloat(rental.totalPrice || 0).toLocaleString("en-IN")}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-center">
                                                <Chip
                                                    size="sm"
                                                    color={getStatusColor(rental.status)}
                                                    variant="flat"
                                                    startContent={getStatusIcon(rental.status)}
                                                    className="font-bold"
                                                >
                                                    {rental.status}
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
