'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, User, Skeleton } from "@heroui/react";
import { ArrowUpRight, Clock, WarningCircle } from "@phosphor-icons/react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AssignedInventory() {
    const [assigned, setAssigned] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAssigned = async () => {
            try {
                const token = localStorage.getItem("adminToken");
                const res = await fetch(`${API}/api/admin/inventory/assigned`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Failed to fetch assigned inventory");
                const data = await res.json();
                setAssigned(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAssigned();
    }, []);

    const getStatusColor = (daysLeft) => {
        if (daysLeft === null) return "primary";
        if (daysLeft < 0) return "danger";
        if (daysLeft <= 3) return "warning";
        return "primary";
    };

    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Assigned <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Inventory</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Track items currently out on active rental orders.</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <Chip
                        size="lg"
                        variant="flat"
                        color="primary"
                        startContent={<ArrowUpRight weight="bold" className="mr-1" />}
                        className="font-bold text-sm px-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800"
                    >
                        {loading ? "..." : `${assigned.length} Active`}
                    </Chip>
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
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-12 w-full rounded-xl" />
                            ))}
                        </div>
                    ) : (
                        <Table
                            aria-label="Assigned stock table"
                            classNames={{
                                wrapper: "p-0 rounded-none shadow-none bg-transparent",
                                th: "bg-slate-50 dark:bg-slate-950/80 uppercase text-xs font-bold h-12 pt-0 px-6",
                                td: "py-4 px-6 border-b border-slate-100 dark:border-slate-800/50"
                            }}
                        >
                            <TableHeader>
                                <TableColumn>PRODUCT</TableColumn>
                                <TableColumn>ASSIGNED TO</TableColumn>
                                <TableColumn>ORDER ID</TableColumn>
                                <TableColumn>EXPECTED RETURN</TableColumn>
                                <TableColumn align="center">STATUS</TableColumn>
                            </TableHeader>
                            <TableBody items={assigned} emptyContent="No assigned items currently.">
                                {(item) => (
                                    <TableRow key={item._id}>
                                        <TableCell className="font-semibold text-slate-900 dark:text-slate-200">{item.item}</TableCell>
                                        <TableCell>
                                            <User
                                                name={item.user}
                                                description={item.email}
                                                avatarProps={{ size: "sm", radius: "full", src: `https://ui-avatars.com/api/?name=${encodeURIComponent(item.user)}&background=6366f1&color=fff` }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip size="sm" variant="flat" className="bg-slate-100 dark:bg-slate-800 text-slate-600 font-mono font-bold tracking-wider">
                                                {item.order}
                                            </Chip>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-sm font-semibold">{item.returnDate}</span>
                                                {item.daysLeft !== null && (
                                                    <span className={`text-[10px] flex items-center gap-1 uppercase font-bold tracking-widest ${item.daysLeft < 0 ? 'text-rose-500' : item.daysLeft <= 3 ? 'text-amber-500' : 'text-slate-500'}`}>
                                                        <Clock weight="bold" />
                                                        {item.daysLeft < 0 ? `${Math.abs(item.daysLeft)} days overdue` : item.daysLeft === 0 ? 'Due today' : `${item.daysLeft} days left`}
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-center">
                                                <Chip
                                                    size="sm"
                                                    color={getStatusColor(item.daysLeft)}
                                                    variant="flat"
                                                    className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800"
                                                    endContent={<ArrowUpRight weight="bold" className="ml-1" />}
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
