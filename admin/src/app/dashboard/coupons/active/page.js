'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Card, CardBody, Button, Table, TableHeader, TableColumn, TableBody,
    TableRow, TableCell, Chip, Input, Modal, ModalContent, ModalHeader,
    ModalBody, ModalFooter, Select, SelectItem, useDisclosure, Skeleton
} from "@heroui/react";
import { Tag, Plus, Trash, WarningCircle, CheckCircle, Clock, MagnifyingGlass } from "@phosphor-icons/react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const LOCAL_KEY = "admin_coupons";

const loadCoupons = () => { try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]"); } catch { return []; } };
const saveCoupons = (list) => localStorage.setItem(LOCAL_KEY, JSON.stringify(list));

export default function ActiveCoupons() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [form, setForm] = useState({ code: "", discount: "", type: "percentage", minOrder: "", expires: "", description: "" });
    const [formError, setFormError] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setCoupons(loadCoupons());
        setLoading(false);
    }, []);

    const filtered = coupons.filter(c =>
        c.code.toLowerCase().includes(search.toLowerCase()) ||
        c.description?.toLowerCase().includes(search.toLowerCase())
    );

    const handleCreate = async () => {
        if (!form.code.trim()) return setFormError("Coupon code is required.");
        if (!form.discount || isNaN(form.discount)) return setFormError("Enter a valid discount value.");
        setFormError("");
        setSaving(true);
        await new Promise(r => setTimeout(r, 400));
        const newCoupon = {
            id: Date.now().toString(),
            code: form.code.toUpperCase().trim(),
            discount: Number(form.discount),
            type: form.type,
            minOrder: form.minOrder ? Number(form.minOrder) : 0,
            expires: form.expires || null,
            description: form.description,
            usageCount: 0,
            status: "Active",
            createdAt: new Date().toISOString(),
        };
        const updated = [newCoupon, ...coupons];
        setCoupons(updated);
        saveCoupons(updated);
        setForm({ code: "", discount: "", type: "percentage", minOrder: "", expires: "", description: "" });
        setSaving(false);
        onClose();
    };

    const handleDelete = (id) => {
        const updated = coupons.filter(c => c.id !== id);
        setCoupons(updated);
        saveCoupons(updated);
    };

    const toggleStatus = (id) => {
        const updated = coupons.map(c => c.id === id ? { ...c, status: c.status === "Active" ? "Paused" : "Active" } : c);
        setCoupons(updated);
        saveCoupons(updated);
    };

    const isExpired = (expires) => expires && new Date(expires) < new Date();

    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Coupon <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Manager</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Create, manage, and monitor discount coupons for your customers.</p>
                </motion.div>
                <div className="flex items-center gap-3">
                    <Chip size="lg" color="success" variant="flat" className="font-bold text-sm px-3">
                        {coupons.filter(c => c.status === "Active" && !isExpired(c.expires)).length} Active
                    </Chip>
                    <Button color="primary" variant="shadow" className="font-bold bg-indigo-600 shadow-indigo-500/20 px-6" startContent={<Plus weight="bold" />} onPress={onOpen}>
                        Create Coupon
                    </Button>
                </div>
            </div>

            {/* Search */}
            <div className="relative group max-w-sm">
                <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
                <input
                    type="text"
                    placeholder="Search coupons..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 h-11"
                />
            </div>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <CardBody className="p-0">
                    {loading ? (
                        <div className="p-6 space-y-4">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-xl" />)}</div>
                    ) : (
                        <Table aria-label="Coupons table" classNames={{ wrapper: "p-0 rounded-none shadow-none bg-transparent", th: "bg-slate-50 dark:bg-slate-950/80 uppercase text-xs font-bold h-12 pt-0 px-6", td: "py-4 px-6 border-b border-slate-100 dark:border-slate-800/50" }}>
                            <TableHeader>
                                <TableColumn>CODE</TableColumn>
                                <TableColumn>DISCOUNT</TableColumn>
                                <TableColumn>MIN ORDER</TableColumn>
                                <TableColumn>EXPIRES</TableColumn>
                                <TableColumn>USES</TableColumn>
                                <TableColumn align="center">STATUS</TableColumn>
                                <TableColumn align="center">ACTIONS</TableColumn>
                            </TableHeader>
                            <TableBody items={filtered} emptyContent="No coupons yet. Click 'Create Coupon' to add one.">
                                {(item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <span className="font-mono font-bold text-sm text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 rounded-lg tracking-widest">
                                                {item.code}
                                            </span>
                                        </TableCell>
                                        <TableCell className="font-bold text-slate-900 dark:text-slate-100">
                                            {item.type === "percentage" ? `${item.discount}%` : `₹${item.discount}`}
                                        </TableCell>
                                        <TableCell className="text-sm text-slate-500">{item.minOrder > 0 ? `₹${item.minOrder}` : "No minimum"}</TableCell>
                                        <TableCell>
                                            {item.expires ? (
                                                <div className="flex items-center gap-1.5">
                                                    <Clock size={12} className={isExpired(item.expires) ? "text-rose-500" : "text-slate-400"} />
                                                    <span className={`text-xs font-medium ${isExpired(item.expires) ? "text-rose-500" : "text-slate-500"}`}>
                                                        {new Date(item.expires).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                                        {isExpired(item.expires) && " (Expired)"}
                                                    </span>
                                                </div>
                                            ) : <span className="text-xs text-slate-400">No expiry</span>}
                                        </TableCell>
                                        <TableCell><span className="font-bold text-slate-700 dark:text-slate-300">{item.usageCount}</span></TableCell>
                                        <TableCell>
                                            <div className="flex justify-center">
                                                <Chip
                                                    size="sm"
                                                    color={isExpired(item.expires) ? "danger" : item.status === "Active" ? "success" : "warning"}
                                                    variant="flat"
                                                    className="font-bold cursor-pointer"
                                                    onClick={() => toggleStatus(item.id)}
                                                >
                                                    {isExpired(item.expires) ? "Expired" : item.status}
                                                </Chip>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-center">
                                                <Button size="sm" color="danger" variant="light" isIconOnly onPress={() => handleDelete(item.id)}>
                                                    <Trash weight="bold" size={14} />
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

            {/* Create coupon modal */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg" placement="center" classNames={{ base: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" }}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="font-bold text-slate-900 dark:text-slate-100">Create New Coupon</ModalHeader>
                            <ModalBody className="flex flex-col gap-4 py-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <Input label="Coupon Code" placeholder="e.g. SAVE20" value={form.code} onValueChange={v => setForm(f => ({ ...f, code: v.toUpperCase() }))} description="Will be auto-uppercased" classNames={{ inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700" }} />
                                    <Select label="Discount Type" selectedKeys={[form.type]} onSelectionChange={keys => setForm(f => ({ ...f, type: [...keys][0] || "percentage" }))} classNames={{ trigger: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700" }}>
                                        <SelectItem key="percentage">Percentage (%)</SelectItem>
                                        <SelectItem key="flat">Flat Amount (₹)</SelectItem>
                                    </Select>
                                    <Input label={form.type === "percentage" ? "Discount %" : "Discount ₹"} placeholder={form.type === "percentage" ? "e.g. 20" : "e.g. 100"} type="number" value={form.discount} onValueChange={v => setForm(f => ({ ...f, discount: v }))} classNames={{ inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700" }} />
                                    <Input label="Minimum Order (₹)" placeholder="e.g. 500 (optional)" type="number" value={form.minOrder} onValueChange={v => setForm(f => ({ ...f, minOrder: v }))} classNames={{ inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700" }} />
                                </div>
                                <Input label="Expiry Date" type="date" value={form.expires} onValueChange={v => setForm(f => ({ ...f, expires: v }))} classNames={{ inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700" }} />
                                <Input label="Description (optional)" placeholder="Internal note about this coupon" value={form.description} onValueChange={v => setForm(f => ({ ...f, description: v }))} classNames={{ inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700" }} />
                                {formError && <p className="text-sm text-rose-500 flex items-center gap-2"><WarningCircle weight="bold" />{formError}</p>}
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="flat" onPress={onClose}>Cancel</Button>
                                <Button color="primary" isLoading={saving} onPress={handleCreate} className="bg-indigo-600 font-bold" startContent={<Tag weight="bold" />}>Create Coupon</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
