'use client';

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
    Card, CardBody, Button, Table, TableHeader, TableColumn, TableBody,
    TableRow, TableCell, Chip, Input, Modal, ModalContent, ModalHeader,
    ModalBody, ModalFooter, Select, SelectItem, useDisclosure, Skeleton, Spinner
} from "@heroui/react";
import { Tag, Plus, Trash, WarningCircle, CheckCircle, Clock, MagnifyingGlass, ArrowClockwise } from "@phosphor-icons/react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const getToken = () => localStorage.getItem("adminToken");

export default function ActiveCoupons() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [form, setForm] = useState({
        code: "", discountAmount: "", discountType: "percentage",
        minOrderAmount: "", expiryDate: "", usageLimit: "", description: ""
    });
    const [formError, setFormError] = useState("");
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(null);
    const [toggling, setToggling] = useState(null);

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

    const filtered = coupons.filter(c =>
        c.code?.toLowerCase().includes(search.toLowerCase()) ||
        c.description?.toLowerCase().includes(search.toLowerCase())
    );

    // ── Create ─────────────────────────────────────────────────────────────────
    const handleCreate = async () => {
        if (!form.code.trim()) return setFormError("Coupon code is required.");
        if (!form.discountAmount || isNaN(form.discountAmount)) return setFormError("Enter a valid discount value.");
        setFormError("");
        setSaving(true);
        try {
            const payload = {
                code: form.code.toUpperCase().trim(),
                discountType: form.discountType,
                discountAmount: Number(form.discountAmount),
                minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : 0,
                expiryDate: form.expiryDate || null,
                usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
                isActive: true,
            };
            const res = await fetch(`${API}/api/coupons`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Failed to create coupon");
            }
            setForm({ code: "", discountAmount: "", discountType: "percentage", minOrderAmount: "", expiryDate: "", usageLimit: "", description: "" });
            onClose();
            fetchCoupons();
        } catch (err) {
            setFormError(err.message);
        } finally {
            setSaving(false);
        }
    };

    // ── Delete ─────────────────────────────────────────────────────────────────
    const handleDelete = async (id) => {
        if (!confirm("Delete this coupon permanently?")) return;
        try {
            setDeleting(id);
            const res = await fetch(`${API}/api/coupons/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            if (res.ok) {
                setCoupons(prev => prev.filter(c => c._id !== id));
            } else {
                const err = await res.json();
                alert(err.message || "Failed to delete");
            }
        } catch (err) {
            alert(err.message);
        } finally {
            setDeleting(null);
        }
    };

    // ── Toggle Active / Paused ──────────────────────────────────────────────────
    const toggleStatus = async (coupon) => {
        try {
            setToggling(coupon._id);
            const res = await fetch(`${API}/api/coupons/${coupon._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify({ isActive: !coupon.isActive }),
            });
            if (res.ok) {
                const updated = await res.json();
                setCoupons(prev => prev.map(c => c._id === coupon._id ? updated : c));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setToggling(null);
        }
    };

    const isExpired = (expires) => expires && new Date(expires) < new Date();

    // ── Render ─────────────────────────────────────────────────────────────────
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
                    <button type="button" onClick={fetchCoupons} className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-indigo-500 transition-colors">
                        <ArrowClockwise size={16} />
                    </button>
                    <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 rounded-full px-3 py-1.5 font-bold text-sm">
                        {coupons.filter(c => c.isActive && !isExpired(c.expiryDate)).length} Active
                    </div>
                    <button type="button" onClick={onOpen} className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all">
                        <Plus weight="bold" size={15} />
                        Create Coupon
                    </button>
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
                                    <TableRow key={item._id}>
                                        <TableCell>
                                            <span className="font-mono font-bold text-sm text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 rounded-lg tracking-widest">
                                                {item.code}
                                            </span>
                                        </TableCell>
                                        <TableCell className="font-bold text-slate-900 dark:text-slate-100">
                                            {item.discountType === "percentage" ? `${item.discountAmount}%` : `₹${item.discountAmount}`}
                                        </TableCell>
                                        <TableCell className="text-sm text-slate-500">{item.minOrderAmount > 0 ? `₹${item.minOrderAmount}` : "No minimum"}</TableCell>
                                        <TableCell>
                                            {item.expiryDate ? (
                                                <div className="flex items-center gap-1.5">
                                                    <Clock size={12} className={isExpired(item.expiryDate) ? "text-rose-500" : "text-slate-400"} />
                                                    <span className={`text-xs font-medium ${isExpired(item.expiryDate) ? "text-rose-500" : "text-slate-500"}`}>
                                                        {new Date(item.expiryDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                                        {isExpired(item.expiryDate) && " (Expired)"}
                                                    </span>
                                                </div>
                                            ) : <span className="text-xs text-slate-400">No expiry</span>}
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-bold text-slate-700 dark:text-slate-300">{item.usageCount || 0}</span>
                                            {item.usageLimit && <span className="text-xs text-slate-400 ml-1">/ {item.usageLimit}</span>}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-center">
                                                <button
                                                    onClick={() => !isExpired(item.expiryDate) && toggleStatus(item)}
                                                    disabled={toggling === item._id || isExpired(item.expiryDate)}
                                                    className="inline-flex items-center gap-1 disabled:cursor-not-allowed"
                                                >
                                                    {toggling === item._id ? (
                                                        <Spinner size="sm" />
                                                    ) : (
                                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${isExpired(item.expiryDate)
                                                                ? "bg-rose-100 dark:bg-rose-500/10 text-rose-600"
                                                                : item.isActive
                                                                    ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 cursor-pointer hover:bg-emerald-200"
                                                                    : "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 cursor-pointer hover:bg-amber-200"
                                                            }`}>
                                                            {isExpired(item.expiryDate) ? "Expired" : item.isActive ? "Active" : "Paused"}
                                                        </span>
                                                    )}
                                                </button>
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

            {/* Create coupon modal */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg" placement="center" classNames={{ base: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" }}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="font-bold text-slate-900 dark:text-slate-100">Create New Coupon</ModalHeader>
                            <ModalBody className="flex flex-col gap-4 py-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <Input label="Coupon Code" placeholder="e.g. SAVE20" value={form.code} onValueChange={v => setForm(f => ({ ...f, code: v.toUpperCase() }))} description="Will be auto-uppercased" classNames={{ inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700" }} />
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm text-slate-700 dark:text-slate-300 font-medium">Discount Type</label>
                                        <select value={form.discountType} onChange={e => setForm(f => ({ ...f, discountType: e.target.value }))} className="h-12 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 appearance-none cursor-pointer">
                                            <option value="percentage">Percentage (%)</option>
                                            <option value="flat">Flat Amount (₹)</option>
                                        </select>
                                    </div>
                                    <Input label={form.discountType === "percentage" ? "Discount %" : "Discount ₹"} placeholder={form.discountType === "percentage" ? "e.g. 20" : "e.g. 100"} type="number" value={form.discountAmount} onValueChange={v => setForm(f => ({ ...f, discountAmount: v }))} classNames={{ inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700" }} />
                                    <Input label="Minimum Order (₹)" placeholder="e.g. 500 (optional)" type="number" value={form.minOrderAmount} onValueChange={v => setForm(f => ({ ...f, minOrderAmount: v }))} classNames={{ inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700" }} />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <Input label="Expiry Date" type="date" value={form.expiryDate} onValueChange={v => setForm(f => ({ ...f, expiryDate: v }))} classNames={{ inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700" }} />
                                    <Input label="Usage Limit (optional)" placeholder="e.g. 100" type="number" value={form.usageLimit} onValueChange={v => setForm(f => ({ ...f, usageLimit: v }))} classNames={{ inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700" }} />
                                </div>
                                {formError && <p className="text-sm text-rose-500 flex items-center gap-2"><WarningCircle weight="bold" />{formError}</p>}
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="flat" onPress={onClose}>Cancel</Button>
                                <button type="button" disabled={saving} onClick={handleCreate} className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold text-sm transition-all">
                                    {saving ? (
                                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
                                    ) : (
                                        <Tag weight="bold" size={15} />
                                    )}
                                    Create Coupon
                                </button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
