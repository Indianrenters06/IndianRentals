'use client';

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardBody, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Avatar, Skeleton, Pagination } from "@heroui/react";
import { Prohibit, WarningCircle, ArrowCounterClockwise, MagnifyingGlass, CheckCircle, XCircle, DownloadSimple } from "@phosphor-icons/react";
import { downloadCustomerReport } from "@/utils/customerReport";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function Toast({ toasts }) {
    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
            <AnimatePresence>
                {toasts.map((t) => (
                    <motion.div key={t.id} initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.22 }}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold text-white pointer-events-auto min-w-[260px] ${t.type === "success" ? "bg-emerald-600" : "bg-red-600"}`}>
                        {t.type === "success" ? <CheckCircle size={18} weight="bold" /> : <XCircle size={18} weight="bold" />}
                        {t.message}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}

export default function BlockedUsers() {
    const [blocked, setBlocked] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [restoring, setRestoring] = useState({});
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [rowsPerPage] = useState(10);
    const [sortDescriptor, setSortDescriptor] = useState({ column: "createdAt", direction: "descending" });
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = "success") => {
        const id = Date.now();
        setToasts(p => [...p, { id, message, type }]);
        setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
    }, []);

    useEffect(() => {
        const fetchBlocked = async () => {
            try {
                const token = localStorage.getItem("adminToken");
                const res = await fetch(`${API}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } });
                if (!res.ok) throw new Error("Failed to fetch users");
                const data = await res.json();
                setBlocked(data.filter(u => u.isBlocked === true || u.isActive === false));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchBlocked();
    }, []);

    const handleRestore = async (user) => {
        setRestoring(prev => ({ ...prev, [user._id]: true }));
        try {
            const token = localStorage.getItem("adminToken");
            await fetch(`${API}/api/admin/users/${user._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ isBlocked: false, isActive: true }),
            });
            setBlocked(prev => prev.filter(u => u._id !== user._id));
            addToast(`${user.name}'s access restored successfully`, "success");
        } catch (err) {
            addToast("Failed to restore access", "error");
        } finally {
            setRestoring(prev => ({ ...prev, [user._id]: false }));
        }
    };

    const downloadUser = async (user) => {
        try {
            await downloadCustomerReport(user);
            addToast(`Report downloaded for ${user.name}`, "success");
        } catch (err) {
            console.error(err);
            addToast(err.message || "Failed to generate report", "error");
        }
    };

    const sortedItems = useMemo(() => {
        let list = [...blocked];
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(u => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
        }
        return list.sort((a, b) => {
            const first = a[sortDescriptor.column]; const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;
            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [blocked, search, sortDescriptor]);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        return sortedItems.slice(start, start + rowsPerPage);
    }, [page, sortedItems, rowsPerPage]);

    return (
        <div className="w-full space-y-6 pb-12">
            <Toast toasts={toasts} />
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Blocked <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">Accounts</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-200">Manage users who have been temporarily or permanently restricted.</p>
                </motion.div>
                {!loading && (
                    <div className="inline-flex items-center gap-2 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 rounded-full px-4 py-2 font-bold text-sm">
                        <Prohibit weight="bold" size={14} />
                        {blocked.length} Blocked
                    </div>
                )}
            </div>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <CardBody className="p-0">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30">
                        <div className="relative group max-w-md">
                            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
                                className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 h-11" />
                        </div>
                    </div>

                    {error ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3 text-rose-500">
                            <WarningCircle size={40} weight="bold" /><p className="font-semibold">{error}</p>
                        </div>
                    ) : loading ? (
                        <div className="p-6 space-y-4">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-xl" />)}</div>
                    ) : (
                        <Table aria-label="Blocked users table" sortDescriptor={sortDescriptor} onSortChange={setSortDescriptor}
                            bottomContent={sortedItems.length > 0 ? (
                                <div className="flex w-full justify-between items-center py-4 px-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30">
                                    <span className="text-sm text-slate-500">Showing {items.length} of {sortedItems.length} blocked accounts</span>
                                    <Pagination radius="md" variant="flat" showControls  color="primary" page={page} total={Math.ceil(sortedItems.length / rowsPerPage)} onChange={setPage} classNames={{ cursor: "bg-indigo-500 shadow-indigo-500/30" }} />
                                </div>
                            ) : null}
                            classNames={{ wrapper: "p-0 rounded-none shadow-none bg-transparent", th: "bg-slate-50 dark:bg-slate-950/80 uppercase text-xs font-bold h-12 pt-0 px-6", td: "py-4 px-6 border-b border-slate-100 dark:border-slate-800/50" }}>
                            <TableHeader>
                                <TableColumn key="name" allowsSorting>RESTRICTED USER</TableColumn>
                                <TableColumn key="email" allowsSorting>EMAIL</TableColumn>
                                <TableColumn key="isBlocked" allowsSorting>STATUS</TableColumn>
                                <TableColumn key="createdAt" allowsSorting>JOINED</TableColumn>
                                <TableColumn align="center">ACTIONS</TableColumn>
                            </TableHeader>
                            <TableBody items={items} emptyContent="No blocked accounts. Platform is fully open.">
                                {(user) => (
                                    <TableRow key={user._id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar name={user.name?.charAt(0)} size="sm" src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=ef4444&color=fff`} />
                                                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-xs text-slate-500">{user.email}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <WarningCircle className="text-rose-500" weight="bold" size={14} />
                                                <Chip size="sm" color={user.isBlocked ? "danger" : "warning"} variant="flat" className="font-bold">
                                                    {user.isBlocked ? "Blocked" : "Inactive"}
                                                </Chip>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                                            {new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-center items-center gap-1">
                                                <button type="button" disabled={restoring[user._id]} onClick={() => handleRestore(user)}
                                                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 font-bold text-xs disabled:opacity-50 hover:bg-emerald-100 transition-colors">
                                                    {restoring[user._id] ? (
                                                        <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
                                                    ) : <ArrowCounterClockwise size={13} />}
                                                    Restore
                                                </button>
                                                <button type="button" title="Download Report" onClick={() => downloadUser(user)}
                                                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors">
                                                    <DownloadSimple size={15} />
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
