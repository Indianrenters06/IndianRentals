'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Card, CardBody, Button, Table, TableHeader, TableColumn, TableBody,
    TableRow, TableCell, Chip, Modal, ModalContent, ModalHeader, ModalBody,
    ModalFooter, Input, Select, SelectItem, useDisclosure, Skeleton
} from "@heroui/react";
import { ShieldSlash, WarningCircle, Warning, Plus, Trash } from "@phosphor-icons/react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Blacklist is managed locally (no dedicated backend model yet)
const LOCAL_KEY = "admin_blacklist";

const loadBlacklist = () => {
    try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]"); } catch { return []; }
};
const saveBlacklist = (list) => localStorage.setItem(LOCAL_KEY, JSON.stringify(list));

export default function BlacklistManagement() {
    const [blacklist, setBlacklist] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [form, setForm] = useState({ identifier: "", type: "Email Address", reason: "" });
    const [formError, setFormError] = useState("");

    useEffect(() => {
        // Load from local storage as there's no backend model for this yet
        setBlacklist(loadBlacklist());
        setLoading(false);
    }, []);

    const handleAdd = () => {
        if (!form.identifier.trim()) return setFormError("Identifier is required.");
        if (!form.reason.trim()) return setFormError("Reason is required.");
        setFormError("");
        const newEntry = {
            id: Date.now().toString(),
            identifier: form.identifier.trim(),
            type: form.type,
            reason: form.reason.trim(),
            date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
        };
        const updated = [newEntry, ...blacklist];
        setBlacklist(updated);
        saveBlacklist(updated);
        setForm({ identifier: "", type: "Email Address", reason: "" });
        onClose();
    };

    const handleRemove = (id) => {
        const updated = blacklist.filter(b => b.id !== id);
        setBlacklist(updated);
        saveBlacklist(updated);
    };

    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Security <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Blacklist</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Manage identifiers banned from accessing platform services.</p>
                </motion.div>
                <div className="flex items-center gap-3">
                    {!loading && blacklist.length > 0 && (
                        <div className="inline-flex items-center gap-2 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 rounded-full px-3 py-1.5 font-bold text-sm">
                            <ShieldSlash weight="bold" size={14} />
                            {blacklist.length} Blacklisted
                        </div>
                    )}
                    <button type="button" onClick={onOpen} className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-lg shadow-rose-500/25 transition-all">
                        <ShieldSlash weight="bold" size={15} />
                        Add to Blacklist
                    </button>
                </div>
            </div>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <CardBody className="p-0">
                    {loading ? (
                        <div className="p-6 space-y-4">
                            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-xl" />)}
                        </div>
                    ) : (
                        <Table
                            aria-label="Blacklist table"
                            classNames={{
                                wrapper: "p-0 rounded-none shadow-none bg-transparent",
                                th: "bg-slate-50 dark:bg-slate-950/80 uppercase text-xs font-bold h-12 pt-0 px-6",
                                td: "py-4 px-6 border-b border-slate-100 dark:border-slate-800/50"
                            }}
                        >
                            <TableHeader>
                                <TableColumn>BLOCKED IDENTIFIER</TableColumn>
                                <TableColumn>TYPE</TableColumn>
                                <TableColumn>REASON</TableColumn>
                                <TableColumn>LISTED ON</TableColumn>
                                <TableColumn align="center">ACTION</TableColumn>
                            </TableHeader>
                            <TableBody items={blacklist} emptyContent="Security perimeter clear. No active blacklists.">
                                {(item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-mono text-sm font-bold text-rose-600 dark:text-rose-400">{item.identifier}</TableCell>
                                        <TableCell>
                                            <Chip size="sm" variant="flat" className="font-bold uppercase tracking-wider">{item.type}</Chip>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                                <Warning className="text-rose-500 shrink-0" weight="bold" />
                                                {item.reason}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-xs text-slate-400 font-bold">{item.date}</TableCell>
                                        <TableCell>
                                            <div className="flex justify-center">
                                                <button type="button" onClick={() => handleRemove(item.id)} className="inline-flex items-center gap-1.5 h-7 px-3 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 font-bold text-xs border border-transparent hover:border-rose-200 transition-colors">
                                                    <Trash weight="bold" size={13} />
                                                    Remove
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

            {/* Add Blacklist Modal */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md" placement="center"
                classNames={{ base: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" }}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="font-bold text-rose-600 dark:text-rose-400">
                                🚫 Add to Blacklist
                            </ModalHeader>
                            <ModalBody className="flex flex-col gap-4 py-4">
                                <Select
                                    label="Identifier Type"
                                    variant="bordered"
                                    radius="xl"
                                    selectedKeys={[form.type]}
                                    onSelectionChange={(keys) => setForm(f => ({ ...f, type: [...keys][0] || "Email Address" }))}
                                    classNames={{ trigger: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 h-[60px]" }}
                                >
                                    <SelectItem key="Email Address">Email Address</SelectItem>
                                    <SelectItem key="Phone Number">Phone Number</SelectItem>
                                    <SelectItem key="IP Address">IP Address</SelectItem>
                                    <SelectItem key="Device ID">Device ID</SelectItem>
                                </Select>
                                <Input
                                    label="Identifier"
                                    placeholder={form.type === "Email Address" ? "e.g. fraud@spam.com" : form.type === "Phone Number" ? "e.g. 9876543210" : "Enter identifier"}
                                    value={form.identifier}
                                    onValueChange={(v) => setForm(f => ({ ...f, identifier: v }))}
                                    variant="bordered"
                                    radius="xl"
                                    startContent={<ShieldSlash className="text-slate-400" />}
                                    classNames={{ inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 h-[60px]" }}
                                />
                                <Input
                                    label="Reason"
                                    placeholder="e.g. Fraudulent activity, Policy violation..."
                                    value={form.reason}
                                    onValueChange={(v) => setForm(f => ({ ...f, reason: v }))}
                                    variant="bordered"
                                    radius="xl"
                                    startContent={<WarningCircle className="text-slate-400" />}
                                    classNames={{ inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 h-[60px]" }}
                                />
                                {formError && (
                                    <p className="text-sm text-rose-500 flex items-center gap-2">
                                        <WarningCircle weight="bold" /> {formError}
                                    </p>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="flat" onPress={onClose}>Cancel</Button>
                                <button type="button" onClick={handleAdd} className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm transition-all">
                                    <ShieldSlash weight="bold" size={15} />
                                    Blacklist
                                </button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
