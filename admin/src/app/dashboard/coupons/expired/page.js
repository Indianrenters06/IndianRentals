'use client';

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import {
    Card, CardBody, Table, TableHeader, TableColumn, TableBody,
    TableRow, TableCell, Input, Skeleton, Spinner
} from "@heroui/react";
import { Tag, Trash, Clock, MagnifyingGlass, ArrowClockwise } from "@phosphor-icons/react";
import toast from 'react-hot-toast';

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const getToken = () => localStorage.getItem("adminToken");

export default function ExpiredCoupons() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sortDescriptor, setSortDescriptor] = useState({ column: "expiryDate", direction: "descending" });
    const [deleting, setDeleting] = useState(null);

    // ── Fetch ──────────────────────────────────────────────────────────────────
    const fetchCoupons = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API}/api/coupons`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            if (res.ok) {
                const data = await res.json();
                setCoupons(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchCoupons(); }, [fetchCoupons]);

    const isExpired = (expires) => expires && new Date(expires) < new Date();

    const filtered = coupons.filter(c =>
        isExpired(c.expiryDate) &&
        (c.code?.toLowerCase().includes(search.toLowerCase()) ||
        c.description?.toLowerCase().includes(search.toLowerCase()))
    );

    const sortedItems = useMemo(() => {
        return [...filtered].sort((a, b) => {
            let first = a[sortDescriptor.column];
            let second = b[sortDescriptor.column];
            if (sortDescriptor.column === 'expiryDate') {
                first = first ? new Date(first).getTime() : 0;
                second = second ? new Date(second).getTime() : 0;
            }
            const cmp = (first ?? '') < (second ?? '') ? -1 : (first ?? '') > (second ?? '') ? 1 : 0;
            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [filtered, sortDescriptor]);

    // ── Delete ─────────────────────────────────────────────────────────────────
    const handleDelete = async (id) => {
        if (!confirm("Delete this expired coupon permanently?")) return;
        try {
            setDeleting(id);
            const res = await fetch(`${API}/api/coupons/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            if (res.ok) {
                setCoupons(prev => prev.filter(c => c._id !== id));
                toast.success("Coupon deleted");
            } else {
                const err = await res.json();
                toast.error(err.message || "Failed to delete");
            }
        } catch (err) {
            toast.error(err.message || "Delete failed");
        } finally {
            setDeleting(null);
        }
    };

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Expired <span className="text-rose-600 dark:text-rose-400 font-extrabold">Coupons</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-200">Review past and expired discount codes.</p>
                </motion.div>
                <div className="flex items-center gap-3">
                    <button type="button" onClick={fetchCoupons} className="inline-flex items-center justify-center w-9 h-9 rounded-xl !bg-slate-100 dark:!bg-slate-800 text-slate-500 hover:text-rose-500 transition-colors">
                        <ArrowClockwise size={16} />
                    </button>
                    <div className="inline-flex items-center gap-2 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 rounded-full px-3 py-1.5 font-bold text-sm">
                        {filtered.length} Expired
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="relative group max-w-sm">
                <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
                <Input
                    type="text"
                    placeholder="Search expired coupons..."
                    value={search}
                    onValueChange={setSearch}
                    variant="bordered"
                    radius="xl"
                    classNames={{ 
                        inputWrapper: "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 pl-10 h-11",
                        input: "text-sm placeholder:text-slate-500"
                    }}
                />
            </div>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <CardBody className="p-0">
                    {loading ? (
                        <div className="p-6 space-y-4">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-xl" />)}</div>
                    ) : (
                        <Table aria-label="Expired Coupons table" sortDescriptor={sortDescriptor} onSortChange={setSortDescriptor} classNames={{ wrapper: "p-0 rounded-none shadow-none bg-transparent", th: "bg-slate-50 dark:bg-slate-950/80 uppercase text-xs font-bold h-12 pt-0 px-6", td: "py-4 px-6 border-b border-slate-100 dark:border-slate-800/50" }}>
                            <TableHeader>
                                <TableColumn key="code" allowsSorting>CODE</TableColumn>
                                <TableColumn key="discountAmount" allowsSorting>DISCOUNT</TableColumn>
                                <TableColumn key="minOrderAmount">MIN ORDER</TableColumn>
                                <TableColumn key="expiryDate" allowsSorting>EXPIRED ON</TableColumn>
                                <TableColumn key="usageCount" allowsSorting>USES</TableColumn>
                                <TableColumn key="status" align="center">STATUS</TableColumn>
                                <TableColumn key="actions" align="center">ACTIONS</TableColumn>
                            </TableHeader>
                            <TableBody items={sortedItems} emptyContent="No expired coupons found.">
                                {(item) => (
                                    <TableRow key={item._id}>
                                        <TableCell>
                                            <span className="font-mono font-bold text-sm text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-2.5 py-1 rounded-lg tracking-widest">
                                                {item.code}
                                            </span>
                                        </TableCell>
                                        <TableCell className="font-bold text-slate-900 dark:text-slate-100">
                                            {item.discountType === "percentage" ? `${item.discountAmount}%` : `₹${item.discountAmount}`}
                                        </TableCell>
                                        <TableCell className="text-sm text-slate-500">{item.minOrderAmount > 0 ? `₹${item.minOrderAmount}` : "No minimum"}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={12} className="text-rose-500" />
                                                <span className="text-xs font-medium text-rose-500">
                                                    {new Date(item.expiryDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-bold text-slate-700 dark:text-slate-300">{item.usageCount || 0}</span>
                                            {item.usageLimit && <span className="text-xs text-slate-400 ml-1">/ {item.usageLimit}</span>}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-center">
                                                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-500/10 text-rose-600">
                                                    Expired
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-center">
                                                <button
                                                    disabled={deleting === item._id}
                                                    onClick={() => handleDelete(item._id)}
                                                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-40 transition-colors"
                                                >
                                                    {deleting === item._id ? <Spinner size="sm" /> : <Trash weight="bold" size={14} />}
                                                </button>
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
