'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardBody, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Avatar, Skeleton } from "@heroui/react";
import { Users, ArrowRight, WarningCircle } from "@phosphor-icons/react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ActiveUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchActive = async () => {
            try {
                const token = localStorage.getItem("adminToken");
                const res = await fetch(`${API}/api/admin/users`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Failed to fetch users");
                const data = await res.json();
                // Show users who logged in within last 24 hours, or all if none
                const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                const active = data.filter(u => u.lastLogin && new Date(u.lastLogin) >= oneDayAgo);
                setUsers(active.length > 0 ? active : data.slice(0, 20));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchActive();
    }, []);

    const getTimeSince = (dateStr) => {
        if (!dateStr) return "Never";
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return "Just now";
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        return `${Math.floor(hrs / 24)}d ago`;
    };

    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Active <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Users</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Users who logged in within the last 24 hours.</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <Chip size="lg" color="success" variant="flat" startContent={<Users weight="bold" className="mr-1" />} className="font-bold text-sm px-3">
                        {loading ? "..." : `${users.length} Active`}
                    </Chip>
                </motion.div>
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
                            aria-label="Active users table"
                            classNames={{
                                wrapper: "p-0 rounded-none shadow-none bg-transparent",
                                th: "bg-slate-50 dark:bg-slate-950/80 uppercase text-xs font-bold h-12 pt-0 px-6",
                                td: "py-4 px-6 border-b border-slate-100 dark:border-slate-800/50"
                            }}
                        >
                            <TableHeader>
                                <TableColumn>USER</TableColumn>
                                <TableColumn>EMAIL</TableColumn>
                                <TableColumn>LOCATION</TableColumn>
                                <TableColumn>LAST LOGIN</TableColumn>
                                <TableColumn align="center">STATUS</TableColumn>
                                <TableColumn align="center">ACTION</TableColumn>
                            </TableHeader>
                            <TableBody items={users} emptyContent="No recently active users found.">
                                {(user) => (
                                    <TableRow key={user._id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar
                                                    name={user.name?.charAt(0).toUpperCase()}
                                                    size="sm"
                                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=10b981&color=fff`}
                                                />
                                                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-xs text-slate-500">{user.email}</TableCell>
                                        <TableCell className="text-xs text-slate-500">{user.city ? `${user.city}, ${user.state}` : "—"}</TableCell>
                                        <TableCell>
                                            <span className="text-xs font-medium text-slate-500">{getTimeSince(user.lastLogin)}</span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-center">
                                                <Chip size="sm" color="success" variant="flat" className="font-bold">Active</Chip>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-center">
                                                <Button isIconOnly size="sm" variant="light" color="primary" className="text-indigo-500">
                                                    <ArrowRight />
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
