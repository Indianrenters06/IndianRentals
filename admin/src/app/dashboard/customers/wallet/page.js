'use client';

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Card, CardBody, Button, Table, TableHeader, TableColumn, TableBody,
    TableRow, TableCell, Chip, Avatar, Skeleton, Pagination,
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure
} from "@heroui/react";
import { Cards, ArrowUpRight, Plus, WarningCircle, CurrencyInr, MagnifyingGlass, CheckCircle, XCircle, DownloadSimple } from "@phosphor-icons/react";

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

export default function UserWallet() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [selectedUser, setSelectedUser] = useState(null);
    const [creditAmount, setCreditAmount] = useState("");
    const [adding, setAdding] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [rowsPerPage] = useState(10);
    const [sortDescriptor, setSortDescriptor] = useState({ column: "walletBalance", direction: "descending" });
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = "success") => {
        const id = Date.now();
        setToasts(p => [...p, { id, message, type }]);
        setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("adminToken");
                const res = await fetch(`${API}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } });
                if (!res.ok) throw new Error("Failed to fetch users");
                const data = await res.json();
                setUsers(data.map(u => ({ ...u, walletBalance: u.walletBalance ?? 0 })));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const openAddCredit = (user) => { setSelectedUser(user); setCreditAmount(""); onOpen(); };

    const handleAddCredit = async () => {
        if (!creditAmount || isNaN(creditAmount) || Number(creditAmount) <= 0) {
            addToast("Please enter a valid amount", "error"); return;
        }
        setAdding(true);
        // Optimistic update
        setUsers(prev => prev.map(u => u._id === selectedUser._id ? { ...u, walletBalance: (u.walletBalance || 0) + Number(creditAmount) } : u));
        addToast(`₹${Number(creditAmount).toLocaleString("en-IN")} credited to ${selectedUser.name}`, "success");
        setAdding(false);
        onClose();
    };

    const downloadWallet = (user) => {
        const content = [
            `Wallet Statement`,
            `Generated: ${new Date().toLocaleString("en-IN")}`,
            ``,
            `Customer: ${user.name || "N/A"}`,
            `Email: ${user.email || "N/A"}`,
            `Available Balance: ₹${(user.walletBalance || 0).toLocaleString("en-IN")}`,
            `Wallet Status: ${user.walletBalance > 0 ? "Active" : "Inactive"}`,
            `Member Since: ${user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN") : "N/A"}`,
        ].join("\n");
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url; a.download = `wallet_${user.name?.replace(/\s+/g, "_") || "statement"}.txt`; a.click();
        addToast(`Wallet statement downloaded for ${user.name}`, "success");
    };

    const totalBalance = users.reduce((s, u) => s + (u.walletBalance || 0), 0);

    const sortedItems = useMemo(() => {
        let list = [...users];
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(u => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
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
                        Wallet <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">System</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Manage user balances, deposit summaries, and in-platform currency.</p>
                </motion.div>
                <div className="flex items-center gap-3">
                    {!loading && (
                        <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 rounded-full px-4 py-2 font-bold text-sm">
                            <CurrencyInr weight="bold" size={14} />
                            ₹{totalBalance.toLocaleString("en-IN")} Total
                        </div>
                    )}
                    <button type="button" onClick={() => users.length > 0 && openAddCredit(users[0])}
                        className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all">
                        <Plus weight="bold" size={15} /> Add Credit
                    </button>
                </div>
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
                        <div className="p-6 space-y-4">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-xl" />)}</div>
                    ) : (
                        <Table aria-label="User wallets table" sortDescriptor={sortDescriptor} onSortChange={setSortDescriptor}
                            bottomContent={sortedItems.length > 0 ? (
                                <div className="flex w-full justify-between items-center py-4 px-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30">
                                    <span className="text-sm text-slate-500">Showing {items.length} of {sortedItems.length} wallets</span>
                                    <Pagination radius="md" variant="flat" showControls  color="primary" page={page} total={Math.ceil(sortedItems.length / rowsPerPage)} onChange={setPage} classNames={{ cursor: "bg-indigo-500 shadow-indigo-500/30" }} />
                                </div>
                            ) : null}
                            classNames={{ wrapper: "p-0 rounded-none shadow-none bg-transparent", th: "bg-slate-50 dark:bg-slate-950/80 uppercase text-xs font-bold h-12 pt-0 px-6", td: "py-4 px-6 border-b border-slate-100 dark:border-slate-800/50" }}>
                            <TableHeader>
                                <TableColumn key="name" allowsSorting>WALLET OWNER</TableColumn>
                                <TableColumn key="email" allowsSorting>EMAIL</TableColumn>
                                <TableColumn key="walletBalance" allowsSorting>AVAILABLE BALANCE</TableColumn>
                                <TableColumn align="center">STATUS</TableColumn>
                                <TableColumn align="center">ACTIONS</TableColumn>
                            </TableHeader>
                            <TableBody items={items} emptyContent="No users found.">
                                {(item) => (
                                    <TableRow key={item._id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar name={item.name?.charAt(0)} size="sm" src={`https://ui-avatars.com/api/?name=${encodeURIComponent(item.name || 'U')}&background=6366f1&color=fff`} />
                                                <span className="text-sm font-semibold">{item.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-xs text-slate-500">{item.email}</TableCell>
                                        <TableCell>
                                            <span className={`font-bold text-lg ${item.walletBalance > 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
                                                ₹{(item.walletBalance || 0).toLocaleString("en-IN")}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-center">
                                                <Chip size="sm" color={item.walletBalance > 0 ? "success" : "default"} variant="flat" className="font-bold">
                                                    {item.walletBalance > 0 ? "Active" : "Inactive"}
                                                </Chip>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-center items-center gap-1">
                                                <button type="button" title="Add Credit" onClick={() => openAddCredit(item)}
                                                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 font-bold text-xs hover:bg-indigo-100 transition-colors">
                                                    <Plus size={13} weight="bold" /> Add Credit
                                                </button>
                                                <button type="button" title="Download Statement" onClick={() => downloadWallet(item)}
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

            {/* Add Credit Modal */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="sm" placement="center"
                classNames={{ base: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl" }}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="font-bold text-slate-900 dark:text-slate-100 px-6 pt-6 pb-0">
                                Add Credit — {selectedUser?.name}
                            </ModalHeader>
                            <ModalBody className="pb-4 px-6 pt-4">
                                <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl border border-indigo-100 dark:border-indigo-500/20 mb-2">
                                    <p className="text-xs text-indigo-500 font-bold uppercase tracking-widest">Current Balance</p>
                                    <p className="text-xl font-black text-indigo-700 dark:text-indigo-400">₹{(selectedUser?.walletBalance || 0).toLocaleString("en-IN")}</p>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount (₹)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><CurrencyInr size={16} /></span>
                                        <input type="number" min="1" value={creditAmount} onChange={e => setCreditAmount(e.target.value)} placeholder="Enter credit amount"
                                            className="w-full h-11 pl-9 pr-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all" />
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter className="px-6 pb-6 pt-0">
                                <Button variant="flat" onPress={onClose} className="font-bold">Cancel</Button>
                                <Button color="primary" isLoading={adding} onPress={handleAddCredit} className="!bg-indigo-600 font-bold">
                                    Add Credit
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
