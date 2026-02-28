'use client';

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Skeleton } from "@heroui/react";
import { Package, MagnifyingGlass, WarningCircle } from "@phosphor-icons/react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AvailableStock() {
    const [stock, setStock] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchStock = async () => {
            try {
                const token = localStorage.getItem("adminToken");
                const res = await fetch(`${API}/api/admin/inventory/available`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Failed to fetch available stock");
                const data = await res.json();
                setStock(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchStock();
    }, []);

    const filtered = useMemo(() => {
        if (!search.trim()) return stock;
        const q = search.toLowerCase();
        return stock.filter(
            (item) =>
                item.name?.toLowerCase().includes(q) ||
                item.sku?.toLowerCase().includes(q) ||
                item.location?.toLowerCase().includes(q)
        );
    }, [stock, search]);

    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Available <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Stock</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Inventory items currently ready for immediate fulfillment.</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <Chip
                        size="lg"
                        variant="flat"
                        color="success"
                        startContent={<Package weight="bold" className="mr-1" />}
                        className="font-bold text-sm px-3"
                    >
                        {loading ? "..." : `${stock.length} Products`}
                    </Chip>
                </motion.div>
            </div>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <CardBody className="p-0">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 bg-slate-50 dark:bg-slate-950/30">
                        <div className="relative group flex-1 max-w-md">
                            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name, SKU or location..."
                                className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 h-11"
                            />
                        </div>
                    </div>

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
                            aria-label="Available stock table"
                            classNames={{
                                wrapper: "p-0 rounded-none shadow-none bg-transparent",
                                th: "bg-slate-50 dark:bg-slate-950/80 uppercase text-xs font-bold h-12 pt-0 px-6",
                                td: "py-4 px-6 border-b border-slate-100 dark:border-slate-800/50"
                            }}
                        >
                            <TableHeader>
                                <TableColumn>ITEM NAME</TableColumn>
                                <TableColumn>SKU ID</TableColumn>
                                <TableColumn>LOCATION</TableColumn>
                                <TableColumn>STOCK</TableColumn>
                                <TableColumn>CONDITION</TableColumn>
                                <TableColumn align="center">STATUS</TableColumn>
                            </TableHeader>
                            <TableBody items={filtered} emptyContent="No available items found.">
                                {(item) => (
                                    <TableRow key={item._id}>
                                        <TableCell className="font-semibold text-slate-900 dark:text-slate-100">{item.name}</TableCell>
                                        <TableCell className="font-mono text-xs text-slate-500 tracking-wider font-bold uppercase">{item.sku}</TableCell>
                                        <TableCell className="text-sm font-medium text-slate-600 dark:text-slate-400">{item.location}</TableCell>
                                        <TableCell>
                                            <span className="font-bold text-indigo-600 dark:text-indigo-400">{item.stock}</span>
                                            <span className="text-xs text-slate-400 ml-1">units</span>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                size="sm"
                                                variant="flat"
                                                color={item.condition === 'New' ? 'success' : item.condition === 'Good' ? 'secondary' : 'warning'}
                                                className="font-bold"
                                            >
                                                {item.condition}
                                            </Chip>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-center">
                                                <Chip
                                                    size="sm"
                                                    color={item.status === 'Ready' ? 'success' : 'warning'}
                                                    variant="dot"
                                                    className="border-none"
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
