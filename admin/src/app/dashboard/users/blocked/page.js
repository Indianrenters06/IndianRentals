'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardBody, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Avatar, Skeleton } from "@heroui/react";
import { Prohibit, WarningCircle, ArrowCounterClockwise, UserCircle } from "@phosphor-icons/react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function BlockedUsers() {
    const [blocked, setBlocked] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [restoring, setRestoring] = useState({});

    useEffect(() => {
        const fetchBlocked = async () => {
            try {
                const token = localStorage.getItem("adminToken");
                const res = await fetch(`${API}/api/admin/users`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Failed to fetch users");
                const data = await res.json();
                // Users who are not active / isBlocked flag
                const blockedUsers = data.filter(u => u.isBlocked === true || u.isActive === false);
                setBlocked(blockedUsers);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchBlocked();
    }, []);

    const handleRestore = async (userId) => {
        setRestoring(prev => ({ ...prev, [userId]: true }));
        try {
            const token = localStorage.getItem("adminToken");
            await fetch(`${API}/api/admin/users/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ isBlocked: false, isActive: true }),
            });
            setBlocked(prev => prev.filter(u => u._id !== userId));
        } catch (err) {
            console.error("Restore failed:", err);
        } finally {
            setRestoring(prev => ({ ...prev, [userId]: false }));
        }
    };

    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Blocked <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Accounts</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Manage users who have been temporarily or permanently restricted.</p>
                </motion.div>
                {!loading && (
                    <div className="inline-flex items-center gap-2 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 rounded-full px-3 py-1.5 font-bold text-sm">
                        <Prohibit weight="bold" size={14} />
                        {blocked.length} Blocked
                    </div>
                )}
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
                            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-xl" />)}
                        </div>
                    ) : (
                        <Table
                            aria-label="Blocked users table"
                            classNames={{
                                wrapper: "p-0 rounded-none shadow-none bg-transparent",
                                th: "bg-slate-50 dark:bg-slate-950/80 uppercase text-xs font-bold h-12 pt-0 px-6",
                                td: "py-4 px-6 border-b border-slate-100 dark:border-slate-800/50"
                            }}
                        >
                            <TableHeader>
                                <TableColumn>RESTRICTED USER</TableColumn>
                                <TableColumn>EMAIL</TableColumn>
                                <TableColumn>STATUS</TableColumn>
                                <TableColumn>JOINED</TableColumn>
                                <TableColumn align="center">ACTIONS</TableColumn>
                            </TableHeader>
                            <TableBody items={blocked} emptyContent="No blocked accounts. Platform is fully open.">
                                {(user) => (
                                    <TableRow key={user._id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar
                                                    name={user.name?.charAt(0)}
                                                    size="sm"
                                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=ef4444&color=fff`}
                                                />
                                                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-xs text-slate-500">{user.email}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <WarningCircle className="text-rose-500" weight="bold" />
                                                <Chip size="sm" color="danger" variant="flat" className="font-bold">Blocked</Chip>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                                            {new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-center">
                                                <button
                                                    type="button"
                                                    disabled={restoring[user._id]}
                                                    onClick={() => handleRestore(user._id)}
                                                    className="inline-flex items-center gap-1.5 h-7 px-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 font-bold text-xs disabled:opacity-50 hover:bg-emerald-100 transition-colors"
                                                >
                                                    {restoring[user._id] ? (
                                                        <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
                                                    ) : (
                                                        <ArrowCounterClockwise size={13} />
                                                    )}
                                                    Restore Access
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
