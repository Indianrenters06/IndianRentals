'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Button, Skeleton } from "@heroui/react";
import { Warning, Wrench, WarningCircle } from "@phosphor-icons/react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function DamagedInventory() {
    const [damaged, setDamaged] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDamaged = async () => {
            try {
                const token = localStorage.getItem("adminToken");
                const res = await fetch(`${API}/api/admin/inventory/damaged`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Failed to fetch damaged inventory");
                const data = await res.json();
                setDamaged(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDamaged();
    }, []);

    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Damaged <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Inventory</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Manage assets requiring repair, insurance claims, or disposal.</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <Chip
                        size="lg"
                        variant="flat"
                        color="danger"
                        startContent={<Warning weight="bold" className="mr-1" />}
                        className="font-bold text-sm px-3"
                    >
                        {loading ? "..." : `${damaged.length} Items`}
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
                            {[...Array(4)].map((_, i) => (
                                <Skeleton key={i} className="h-12 w-full rounded-xl" />
                            ))}
                        </div>
                    ) : (
                        <Table
                            aria-label="Damaged items table"
                            classNames={{
                                wrapper: "p-0 rounded-none shadow-none bg-transparent",
                                th: "bg-slate-50 dark:bg-slate-950/80 uppercase text-xs font-bold h-12 pt-0 px-6",
                                td: "py-4 px-6 border-b border-slate-100 dark:border-slate-800/50"
                            }}
                        >
                            <TableHeader>
                                <TableColumn>DAMAGED PRODUCT</TableColumn>
                                <TableColumn>NATURE OF ISSUE</TableColumn>
                                <TableColumn>SEVERITY</TableColumn>
                                <TableColumn>EST. REPAIR COST</TableColumn>
                                <TableColumn align="center">REPAIR STATUS</TableColumn>
                            </TableHeader>
                            <TableBody items={damaged} emptyContent="No damaged items recorded. All inventory is in good condition.">
                                {(item) => (
                                    <TableRow key={item._id}>
                                        <TableCell className="font-semibold text-slate-900 dark:text-slate-200">{item.item}</TableCell>
                                        <TableCell className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                            <div className="flex items-center gap-2">
                                                <Warning className="text-rose-500 shrink-0" weight="bold" />
                                                {item.issue}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                size="sm"
                                                color={item.severity === 'High' ? 'danger' : item.severity === 'Medium' ? 'warning' : 'default'}
                                                variant="flat"
                                                className="font-bold"
                                            >
                                                {item.severity}
                                            </Chip>
                                        </TableCell>
                                        <TableCell className="font-bold text-slate-700 dark:text-slate-300">
                                            {item.estimate}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-center">
                                                <Button
                                                    size="sm"
                                                    color="secondary"
                                                    variant="flat"
                                                    startContent={<Wrench weight="bold" />}
                                                    className="font-bold h-7 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                                                >
                                                    {item.status}
                                                </Button>
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
