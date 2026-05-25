'use client';

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Button, Skeleton, Pagination, Spinner } from "@heroui/react";
import { Warning, Wrench, WarningCircle, CheckCircle, XCircle, MagnifyingGlass } from "@phosphor-icons/react";

// ── Toast Notification ────────────────────────────────────────────────────────
function Toast({ toasts }) {
    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
            <AnimatePresence>
                {toasts.map((t) => (
                    <motion.div
                        key={t.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.22 }}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold text-white pointer-events-auto min-w-[260px] ${
                            t.type === "success" ? "bg-emerald-600" : "bg-red-600"
                        }`}
                    >
                        {t.type === "success"
                            ? <CheckCircle size={18} weight="bold" />
                            : <XCircle size={18} weight="bold" />}
                        {t.message}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function DamagedInventory() {
    const [damaged, setDamaged] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [rowsPerPage] = useState(10);
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "severity",
        direction: "descending",
    });
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = "success") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
    }, []);

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

    const sortedItems = useMemo(() => {
        let list = [...damaged];
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(
                (item) =>
                    item.item?.toLowerCase().includes(q) ||
                    item.issue?.toLowerCase().includes(q)
            );
        }

        return list.sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [damaged, search, sortDescriptor]);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return sortedItems.slice(start, end);
    }, [page, sortedItems, rowsPerPage]);

    return (
        <div className="w-full space-y-6 pb-12">
            <Toast toasts={toasts} />
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Damaged <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">Inventory</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-200">Manage assets requiring repair, insurance claims, or disposal.</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <Chip
                        size="lg"
                        variant="flat"
                        color="danger"
                        startContent={<Warning weight="bold" className="mr-1" />}
                        className="font-bold text-sm px-3 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800"
                    >
                        {loading ? "..." : `${damaged.length} Items`}
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
                                placeholder="Search by item name or issue..."
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
                            {[...Array(4)].map((_, i) => (
                                <Skeleton key={i} className="h-12 w-full rounded-xl" />
                            ))}
                        </div>
                    ) : (
                        <Table
                            aria-label="Damaged items table"
                            sortDescriptor={sortDescriptor}
                            onSortChange={setSortDescriptor}
                            bottomContent={
                                sortedItems.length > 0 ? (
                                    <div className="flex w-full justify-between items-center py-4 px-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30">
                                        <span className="text-sm text-slate-500">
                                            Showing {items.length} of {sortedItems.length} items
                                        </span>
                                        <Pagination
                                            radius="md" variant="flat"
                                            showControls
                                            
                                            color="primary"
                                            page={page}
                                            total={Math.ceil(sortedItems.length / rowsPerPage)}
                                            onChange={(page) => setPage(page)}
                                            classNames={{
                                                cursor: "bg-indigo-500 shadow-indigo-500/30",
                                            }}
                                        />
                                    </div>
                                ) : null
                            }
                            classNames={{
                                wrapper: "p-0 rounded-none shadow-none bg-transparent",
                                th: "bg-slate-50 dark:bg-slate-950/80 uppercase text-xs font-bold h-12 pt-0 px-6",
                                td: "py-4 px-6 border-b border-slate-100 dark:border-slate-800/50"
                            }}
                        >
                            <TableHeader>
                                <TableColumn key="item" allowsSorting>DAMAGED PRODUCT</TableColumn>
                                <TableColumn key="issue" allowsSorting>NATURE OF ISSUE</TableColumn>
                                <TableColumn key="severity" allowsSorting>SEVERITY</TableColumn>
                                <TableColumn key="estimate" allowsSorting>EST. REPAIR COST</TableColumn>
                                <TableColumn align="center">REPAIR STATUS</TableColumn>
                            </TableHeader>
                            <TableBody items={items} emptyContent="No damaged items recorded. All inventory is in good condition.">
                                {(item) => (
                                    <TableRow key={item._id}>
                                        <TableCell className="font-semibold text-slate-900 dark:text-slate-200">{item.item}</TableCell>
                                        <TableCell className="text-sm font-medium text-slate-600 dark:text-slate-200">
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
                                                    className="font-bold h-9 px-6 rounded-xl !bg-indigo-600 text-white shadow-md border-none"
                                                    startContent={<Wrench weight="bold" />}
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

