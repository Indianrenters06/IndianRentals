'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Card, CardBody, Button, Table, TableHeader, TableColumn, TableBody,
    TableRow, TableCell, Chip, Avatar, Skeleton, Modal, ModalContent,
    ModalHeader, ModalBody, ModalFooter, Input, useDisclosure
} from "@heroui/react";
import { Cards, ArrowUpRight, Plus, WarningCircle, CurrencyInr } from "@phosphor-icons/react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function UserWallet() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedUser, setSelectedUser] = useState(null);
    const [creditAmount, setCreditAmount] = useState("");
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("adminToken");
                const res = await fetch(`${API}/api/admin/users`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Failed to fetch users");
                const data = await res.json();
                // Enrich with wallet mock if not present
                setUsers(data.map(u => ({ ...u, walletBalance: u.walletBalance ?? 0 })));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const openAddCredit = (user) => {
        setSelectedUser(user);
        setCreditAmount("");
        onOpen();
    };

    const handleAddCredit = async () => {
        if (!creditAmount || isNaN(creditAmount)) return;
        setAdding(true);
        // Optimistic update (no wallet endpoint yet)
        setUsers(prev => prev.map(u =>
            u._id === selectedUser._id
                ? { ...u, walletBalance: (u.walletBalance || 0) + Number(creditAmount) }
                : u
        ));
        setAdding(false);
        onOpenChange(false);
    };

    const totalBalance = users.reduce((s, u) => s + (u.walletBalance || 0), 0);

    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Wallet <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">System</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Manage user balances, deposit summaries, and in-platform currency.</p>
                </motion.div>
                <div className="flex items-center gap-3">
                    {!loading && (
                        <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 rounded-full px-3 py-1.5 font-bold text-sm">
                            <CurrencyInr weight="bold" size={14} />
                            ₹{totalBalance.toLocaleString("en-IN")} Total
                        </div>
                    )}
                    <button type="button" onClick={() => users.length > 0 && openAddCredit(users[0])} className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all">
                        <Plus weight="bold" size={15} />
                        Add Credit
                    </button>
                </div>
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
                            aria-label="User wallets table"
                            classNames={{
                                wrapper: "p-0 rounded-none shadow-none bg-transparent",
                                th: "bg-slate-50 dark:bg-slate-950/80 uppercase text-xs font-bold h-12 pt-0 px-6",
                                td: "py-4 px-6 border-b border-slate-100 dark:border-slate-800/50"
                            }}
                        >
                            <TableHeader>
                                <TableColumn>WALLET OWNER</TableColumn>
                                <TableColumn>EMAIL</TableColumn>
                                <TableColumn>AVAILABLE BALANCE</TableColumn>
                                <TableColumn align="center">STATUS</TableColumn>
                                <TableColumn align="center">ACTIONS</TableColumn>
                            </TableHeader>
                            <TableBody items={users} emptyContent="No users found.">
                                {(item) => (
                                    <TableRow key={item._id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar
                                                    name={item.name?.charAt(0)}
                                                    size="sm"
                                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(item.name || 'U')}&background=6366f1&color=fff`}
                                                />
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
                                            <div className="flex justify-center gap-2">
                                                <Button isIconOnly size="sm" variant="light" color="secondary" className="text-indigo-500" onPress={() => openAddCredit(item)}>
                                                    <Plus />
                                                </Button>
                                                <Button isIconOnly size="sm" variant="light" color="primary" className="text-indigo-500">
                                                    <ArrowUpRight />
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

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="sm" placement="center"
                classNames={{ base: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" }}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="font-bold text-slate-900 dark:text-slate-100">
                                Add Credit — {selectedUser?.name}
                            </ModalHeader>
                            <ModalBody className="pb-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount (₹)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><CurrencyInr size={16} /></span>
                                        <input
                                            type="number"
                                            min="1"
                                            value={creditAmount}
                                            onChange={e => setCreditAmount(e.target.value)}
                                            placeholder="Enter credit amount"
                                            className="w-full h-11 pl-9 pr-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                                        />
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="flat" onPress={onClose}>Cancel</Button>
                                <Button color="primary" isLoading={adding} onPress={handleAddCredit} className="bg-indigo-600 font-bold">
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
