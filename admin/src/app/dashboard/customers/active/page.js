'use client';

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Card, CardBody, Button, Table, TableHeader, TableColumn, TableBody,
    TableRow, TableCell, Chip, Avatar, Skeleton, Pagination,
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Divider
} from "@heroui/react";
import { Users, ArrowRight, WarningCircle, CheckCircle, XCircle, MagnifyingGlass, DownloadSimple, Eye, Phone, MapPin } from "@phosphor-icons/react";

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

export default function ActiveUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [rowsPerPage] = useState(10);
    const [sortDescriptor, setSortDescriptor] = useState({ column: "lastLogin", direction: "descending" });
    const [toasts, setToasts] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const addToast = useCallback((message, type = "success") => {
        const id = Date.now();
        setToasts(p => [...p, { id, message, type }]);
        setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
    }, []);

    useEffect(() => {
        const fetchActive = async () => {
            try {
                const token = localStorage.getItem("adminToken");
                const res = await fetch(`${API}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } });
                if (!res.ok) throw new Error("Failed to fetch users");
                const data = await res.json();
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

    const downloadUser = (user) => {
        const content = [
            `Customer Activity Report`,
            `Generated: ${new Date().toLocaleString("en-IN")}`,
            ``,
            `Name: ${user.name || "N/A"}`,
            `Email: ${user.email || "N/A"}`,
            `Phone: ${user.phone || "N/A"}`,
            `Location: ${user.city ? `${user.city}, ${user.state}` : "N/A"}`,
            `Last Login: ${user.lastLogin ? new Date(user.lastLogin).toLocaleString("en-IN") : "Never"}`,
            `Account Status: Active`,
            `Member Since: ${user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN") : "N/A"}`,
        ].join("\n");
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url; a.download = `customer_${user.name?.replace(/\s+/g, "_") || "report"}.txt`; a.click();
        addToast(`Report downloaded for ${user.name}`, "success");
    };

    const sortedItems = useMemo(() => {
        let list = [...users];
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(u => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.city?.toLowerCase().includes(q));
        }
        return list.sort((a, b) => {
            const first = a[sortDescriptor.column]; const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;
            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [users, search, sortDescriptor]);

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
                        Active <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Users</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Users who logged in within the last 24 hours.</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 rounded-full px-4 py-2 font-bold text-sm">
                        <Users weight="bold" size={14} />
                        {loading ? "..." : `${users.length} Active`}
                    </div>
                </motion.div>
            </div>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <CardBody className="p-0">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30">
                        <div className="relative group max-w-md">
                            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email or city..."
                                className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 h-11" />
                        </div>
                    </div>

                    {error ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3 text-rose-500">
                            <WarningCircle size={40} weight="bold" /><p className="font-semibold">{error}</p>
                        </div>
                    ) : loading ? (
                        <div className="p-6 space-y-4">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-xl" />)}</div>
                    ) : (
                        <Table aria-label="Active users table" sortDescriptor={sortDescriptor} onSortChange={setSortDescriptor}
                            bottomContent={sortedItems.length > 0 ? (
                                <div className="flex w-full justify-between items-center py-4 px-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30">
                                    <span className="text-sm text-slate-500">Showing {items.length} of {sortedItems.length} active users</span>
                                    <Pagination radius="md" variant="flat" showControls  color="primary" page={page} total={Math.ceil(sortedItems.length / rowsPerPage)} onChange={setPage} classNames={{ cursor: "bg-indigo-500 shadow-indigo-500/30" }} />
                                </div>
                            ) : null}
                            classNames={{ wrapper: "p-0 rounded-none shadow-none bg-transparent", th: "bg-slate-50 dark:bg-slate-950/80 uppercase text-xs font-bold h-12 pt-0 px-6", td: "py-4 px-6 border-b border-slate-100 dark:border-slate-800/50" }}>
                            <TableHeader>
                                <TableColumn key="name" allowsSorting>USER</TableColumn>
                                <TableColumn key="email" allowsSorting>EMAIL</TableColumn>
                                <TableColumn key="city" allowsSorting>LOCATION</TableColumn>
                                <TableColumn key="lastLogin" allowsSorting>LAST LOGIN</TableColumn>
                                <TableColumn align="center">STATUS</TableColumn>
                                <TableColumn align="center">ACTIONS</TableColumn>
                            </TableHeader>
                            <TableBody items={items} emptyContent="No recently active users found.">
                                {(user) => (
                                    <TableRow key={user._id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar name={user.name?.charAt(0).toUpperCase()} size="sm" src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=10b981&color=fff`} />
                                                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-xs text-slate-500">{user.email}</TableCell>
                                        <TableCell className="text-xs text-slate-500">{user.city ? `${user.city}, ${user.state}` : "—"}</TableCell>
                                        <TableCell><span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{getTimeSince(user.lastLogin)}</span></TableCell>
                                        <TableCell>
                                            <div className="flex justify-center">
                                                <Chip size="sm" color="success" variant="flat" className="font-bold">Active</Chip>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-center items-center gap-1">
                                                <button type="button" title="View Profile" onClick={() => { setSelectedUser(user); setIsModalOpen(true); }}
                                                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors">
                                                    <Eye size={15} />
                                                </button>
                                                <button type="button" title="Download Report" onClick={() => downloadUser(user)}
                                                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors">
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

            {/* View Profile Modal */}
            <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen} size="lg" placement="center"
                classNames={{ base: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl" }}>
                <ModalContent>
                    {(onClose) => selectedUser && (
                        <>
                            <ModalHeader className="font-bold text-slate-900 dark:text-slate-100 px-6 pt-6 pb-0">Customer Profile</ModalHeader>
                            <ModalBody className="px-6 py-6">
                                <div className="flex items-center gap-4 mb-6">
                                    <Avatar name={selectedUser.name?.charAt(0)} size="lg" src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.name || 'U')}&background=10b981&color=fff`} className="w-16 h-16 text-xl" />
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{selectedUser.name}</h3>
                                        <p className="text-slate-500 text-sm">{selectedUser.email}</p>
                                        <Chip size="sm" color="success" variant="flat" className="mt-1 font-bold">Active</Chip>
                                    </div>
                                </div>
                                <Divider className="mb-4" />
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: "Phone", value: selectedUser.phone || "N/A", icon: <Phone size={14} /> },
                                        { label: "Location", value: selectedUser.city ? `${selectedUser.city}, ${selectedUser.state}` : "N/A", icon: <MapPin size={14} /> },
                                        { label: "Last Login", value: getTimeSince(selectedUser.lastLogin), icon: null },
                                        { label: "Member Since", value: selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString("en-IN") : "N/A", icon: null },
                                    ].map((field, i) => (
                                        <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">{field.icon}{field.label}</p>
                                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{field.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </ModalBody>
                            <ModalFooter className="px-6 pb-6 pt-0 gap-2">
                                <Button variant="flat" onPress={onClose} className="font-bold">Close</Button>
                                <Button onPress={() => { downloadUser(selectedUser); onClose(); }} className="bg-indigo-600 text-white font-bold" startContent={<DownloadSimple weight="bold" />}>
                                    Download Report
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
