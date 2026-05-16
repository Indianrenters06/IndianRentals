'use client';

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, User, Skeleton, Pagination, Button, Spinner, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { ArrowUpRight, Clock, WarningCircle, CheckCircle, XCircle, DotsThreeVertical, MagnifyingGlass } from "@phosphor-icons/react";

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

export default function AssignedInventory() {
    const [assigned, setAssigned] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [rowsPerPage] = useState(10);
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "returnDate",
        direction: "ascending",
    });
    const [toasts, setToasts] = useState([]);
    const [updating, setUpdating] = useState(null);

    const addToast = useCallback((message, type = "success") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
    }, []);

    const fetchAssigned = useCallback(async () => {
        try {
            setLoading(true);
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
    }, []);

    useEffect(() => {
        fetchAssigned();
    }, [fetchAssigned]);

    const handleUpdateStatus = async (id, newStatus) => {
        setUpdating(id);
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API}/api/admin/inventory/assigned/${id}/status`, {
                method: "PATCH",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!res.ok) throw new Error("Failed to update status");
            
            addToast(`Status updated to ${newStatus}`, "success");
            fetchAssigned();
        } catch (err) {
            addToast(err.message, "error");
        } finally {
            setUpdating(null);
        }
    };

    const sortedItems = useMemo(() => {
        let list = [...assigned];
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(
                (item) =>
                    item.item?.toLowerCase().includes(q) ||
                    item.user?.toLowerCase().includes(q) ||
                    item.order?.toLowerCase().includes(q) ||
                    item.email?.toLowerCase().includes(q)
            );
        }

        return list.sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [assigned, search, sortDescriptor]);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return sortedItems.slice(start, end);
    }, [page, sortedItems, rowsPerPage]);

    const getStatusColor = (daysLeft) => {
        if (daysLeft === null) return "primary";
        if (daysLeft < 0) return "danger";
        if (daysLeft <= 3) return "warning";
        return "primary";
    };

    return (
        <div className="w-full space-y-6 pb-12">
            <Toast toasts={toasts} />
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
                    <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 bg-slate-50 dark:bg-slate-950/30">
                        <div className="relative group flex-1 max-w-md">
                            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by item, customer, or order ID..."
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
                            aria-label="Assigned stock table"
                            sortDescriptor={sortDescriptor}
                            onSortChange={setSortDescriptor}
                            bottomContent={
                                sortedItems.length > 0 ? (
                                    <div className="flex w-full justify-between items-center py-4 px-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30">
                                        <span className="text-sm text-slate-500">
                                            Showing {items.length} of {sortedItems.length} active assignments
                                        </span>
                                        <Pagination
                                            isCompact
                                            showControls
                                            showShadow
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
                                <TableColumn key="item" allowsSorting>PRODUCT</TableColumn>
                                <TableColumn key="user" allowsSorting>ASSIGNED TO</TableColumn>
                                <TableColumn key="order" allowsSorting>ORDER ID</TableColumn>
                                <TableColumn key="returnDate" allowsSorting>EXPECTED RETURN</TableColumn>
                                <TableColumn key="status" align="center" allowsSorting>STATUS</TableColumn>
                                <TableColumn align="center">ACTIONS</TableColumn>
                            </TableHeader>
                            <TableBody items={items} emptyContent="No assigned items currently.">
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
                                        <TableCell>
                                            <div className="flex justify-center">
                                                <Dropdown>
                                                    <DropdownTrigger>
                                                        <Button isIconOnly size="sm" variant="light" isLoading={updating === item._id}>
                                                            <DotsThreeVertical size={18} />
                                                        </Button>
                                                    </DropdownTrigger>
                                                    <DropdownMenu aria-label="Update status">
                                                        <DropdownItem key="returned" onPress={() => handleUpdateStatus(item._id, "Returned")}>Mark as Returned</DropdownItem>
                                                        <DropdownItem key="damaged" className="text-danger" color="danger" onPress={() => handleUpdateStatus(item._id, "Damaged")}>Mark as Damaged</DropdownItem>
                                                        <DropdownItem key="extended" onPress={() => handleUpdateStatus(item._id, "Extended")}>Extend Rental</DropdownItem>
                                                    </DropdownMenu>
                                                </Dropdown>
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
