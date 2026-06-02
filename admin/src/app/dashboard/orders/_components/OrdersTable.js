"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Card, CardBody, Button, Chip, Dropdown, DropdownTrigger,
    DropdownMenu, DropdownItem, Spinner, Modal, ModalContent,
    ModalHeader, ModalBody, ModalFooter, useDisclosure, Divider, Input, Pagination
} from "@heroui/react";
import {
    DotsThreeVertical, Eye, Truck, ArrowCounterClockwise, XCircle,
    CheckCircle, Package, MapPin, Calendar, CurrencyDollar, User,
    ArrowClockwise, Warning, Checks, MagnifyingGlass, DownloadSimple
} from "@phosphor-icons/react";
import { downloadPDFInvoice } from "@/utils/pdfInvoice";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const STATUS_CFG = {
    Pending:   { color: "warning",   label: "Pending"   },
    Approved:  { color: "primary",   label: "Approved"  },
    Shipped:   { color: "secondary", label: "Shipped"   },
    Delivered: { color: "success",   label: "Delivered" },
    Active:    { color: "success",   label: "Active"    },
    Returned:  { color: "default",   label: "Returned"  },
    Cancelled: { color: "danger",    label: "Cancelled" },
};

const ACTIONS = {
    Pending:   [{ s: "Approved",  label: "Approve Order",     icon: <CheckCircle weight="bold"/> },
                { s: "Cancelled", label: "Cancel Order",      icon: <XCircle weight="bold"/>, danger: true }],
    Approved:  [{ s: "Shipped",   label: "Mark as Shipped",   icon: <Truck weight="bold"/> },
                { s: "Cancelled", label: "Cancel Order",      icon: <XCircle weight="bold"/>, danger: true }],
    Shipped:   [{ s: "Delivered", label: "Mark as Delivered", icon: <Truck weight="bold"/> }],
    Delivered: [{ s: "Active",    label: "Mark as Active",    icon: <Checks weight="bold"/> },
                { s: "Returned",  label: "Confirm Return",    icon: <ArrowCounterClockwise weight="bold"/> }],
    Active:    [{ s: "Returned",  label: "Confirm Return",    icon: <ArrowCounterClockwise weight="bold"/> }],
    Returned:  [],
    Cancelled: [],
};

function StatusChip({ status }) {
    const c = STATUS_CFG[status] || { color: "default", label: status };
    return <Chip size="sm" color={c.color} variant="flat" className="font-semibold text-xs">{c.label}</Chip>;
}

function OrderModal({ order, isOpen, onClose, onAction }) {
    if (!order) return null;
    const items  = order.orderItems || [];
    const addr   = order.shippingAddress || {};
    const period = order.rentalPeriod || {};
    const fmt    = d => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose} size="2xl" scrollBehavior="inside"
            classNames={{ backdrop: "bg-slate-900/60 backdrop-blur-sm" }}>
            <ModalContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                {(close) => (<>
                    <ModalHeader className="border-b border-slate-100 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-mono text-indigo-500 font-bold">#{order._id?.slice(-8).toUpperCase()}</p>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Order Details</h2>
                        </div>
                        <StatusChip status={order.status} />
                    </ModalHeader>
                    <ModalBody className="px-6 py-5 space-y-5">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1"><User size={11}/> Customer</p>
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{order.user?.name || "—"}</p>
                            <p className="text-xs text-slate-500">{order.user?.email}</p>
                        </div>
                        <Divider />
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1"><Package size={11}/> Items ({items.length})</p>
                            <div className="space-y-2">
                                {items.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                        {item.image && <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover shrink-0"/>}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold truncate">{item.name}</p>
                                            <p className="text-xs text-slate-500">Qty: {item.qty} · ₹{item.price?.toLocaleString("en-IN")}/mo · Deposit: ₹{item.securityDeposit?.toLocaleString("en-IN")}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Divider />
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1"><Calendar size={11}/> Rental Period</p>
                                <p className="text-sm font-semibold">{period.durationMonths} month{period.durationMonths !== 1 ? "s" : ""}</p>
                                <p className="text-xs text-slate-500">{fmt(period.startDate)} → {fmt(period.endDate)}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1"><CurrencyDollar size={11}/> Payment</p>
                                <p className="text-sm font-bold">₹{order.totalPrice?.toLocaleString("en-IN")}</p>
                                <p className="text-xs text-slate-500">{order.paymentMethod} · {order.isPaid ? "Paid" : "Unpaid"}</p>
                            </div>
                        </div>
                        {addr.address && (<>
                            <Divider />
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1"><MapPin size={11}/> Shipping</p>
                                <p className="text-sm text-slate-700 dark:text-slate-300">{addr.address}, {addr.city} – {addr.postalCode}</p>
                                <p className="text-xs text-slate-500">{addr.phone}</p>
                            </div>
                        </>)}
                    </ModalBody>
                    <ModalFooter className="border-t border-slate-100 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
                        <Button variant="light" onPress={close} className="font-semibold text-slate-500">Close</Button>
                        <div className="flex gap-2 flex-wrap">
                            {(ACTIONS[order.status] || []).map(a => (
                                <Button key={a.s} size="sm"
                                    color={a.danger ? "danger" : "primary"}
                                    variant={a.danger ? "flat" : "solid"}
                                    startContent={a.icon}
                                    className="font-semibold text-xs"
                                    onPress={() => { onAction(order._id, a.s); close(); }}>
                                    {a.label}
                                </Button>
                            ))}
                        </div>
                    </ModalFooter>
                </>)}
            </ModalContent>
        </Modal>
    );
}

export default function OrdersTable({ initialStatus = "all", title = "Orders" }) {
    const [orders, setOrders]     = useState([]);
    const [loading, setLoading]   = useState(true);
    const [updating, setUpdating] = useState(null);
    const [search, setSearch]     = useState("");
    const [selected, setSelected] = useState(null);
    const [toast, setToast]       = useState(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API}/api/admin/rentals`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) setOrders(await res.json());
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchOrders(); }, []);

    const handleStatusChange = async (id, status) => {
        try {
            setUpdating(id);
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API}/api/admin/rentals/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                const updated = await res.json();
                setOrders(prev => prev.map(o => o._id === id ? { ...o, status: updated.status } : o));
                showToast(`Order marked as ${status}`);
            } else {
                const e = await res.json();
                showToast(e.message || "Failed to update", "error");
            }
        } catch { showToast("Network error", "error"); }
        finally { setUpdating(null); }
    };

    const openModal = (order) => { setSelected(order); onOpen(); };

    const [sortCol, setSortCol] = useState("createdAt");
    const [sortDir, setSortDir] = useState("descending");
    const [page, setPage] = useState(1);
    const rowsPerPage = 10;

    const filtered = useMemo(() => {
        let list = orders;
        if (initialStatus !== "all") {
            list = list.filter(o => o.status?.toLowerCase() === initialStatus.toLowerCase());
        }
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(o =>
                o._id?.toLowerCase().includes(q) ||
                o.user?.name?.toLowerCase().includes(q) ||
                o.user?.email?.toLowerCase().includes(q) ||
                o.orderItems?.some(i => i.name?.toLowerCase().includes(q))
            );
        }
        return [...list].sort((a, b) => {
            let first, second;
            if (sortCol === 'user') { first = a.user?.name ?? ''; second = b.user?.name ?? ''; }
            else if (sortCol === 'createdAt') { first = new Date(a.createdAt).getTime(); second = new Date(b.createdAt).getTime(); }
            else { first = a[sortCol] ?? ''; second = b[sortCol] ?? ''; }
            const cmp = first < second ? -1 : first > second ? 1 : 0;
            return sortDir === "descending" ? -cmp : cmp;
        });
    }, [orders, search, initialStatus, sortCol, sortDir]);

    // Reset to page 1 when filters/sort change
    useEffect(() => { setPage(1); }, [search, sortCol, sortDir]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
    useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);

    const paginated = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        return filtered.slice(start, start + rowsPerPage);
    }, [filtered, page]);

    return (
        <div className="w-full space-y-6 pb-12">
            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className={`fixed top-5 right-5 z-[9999] px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold flex items-center gap-2 ${toast.type === "error" ? "bg-red-600 text-white" : "bg-emerald-600 text-white"}`}>
                        {toast.type === "error" ? <Warning size={16}/> : <CheckCircle size={16}/>} {toast.msg}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        {title} <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">Orders</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-200 text-sm">Track and manage rental order lifecycle.</p>
                </motion.div>
                <div className="flex items-center gap-3">
                    <Button isIconOnly variant="flat" size="sm" onPress={fetchOrders} isLoading={loading} className="text-slate-500">
                        <ArrowClockwise size={16}/>
                    </Button>
                    <div className="relative group w-60">
                        <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full h-10 pl-10 pr-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 shadow-sm transition-all"
                        />
                    </div>
                    <select
                        value={`${sortCol}:${sortDir}`}
                        onChange={e => { const [col, dir] = e.target.value.split(':'); setSortCol(col); setSortDir(dir); }}
                        className="h-10 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30 shadow-sm"
                    >
                        <option value="createdAt:descending">Newest first</option>
                        <option value="createdAt:ascending">Oldest first</option>
                        <option value="user:ascending">Customer A–Z</option>
                        <option value="user:descending">Customer Z–A</option>
                        <option value="totalPrice:descending">Highest total</option>
                        <option value="totalPrice:ascending">Lowest total</option>
                        <option value="status:ascending">Status</option>
                    </select>
                </div>
            </div>

            {/* Column header row */}
            <div className="hidden sm:grid grid-cols-[140px_1fr_1fr_100px_auto] gap-4 px-5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Order ID</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Customer</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total · Payment</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</span>
                <span className="w-8"></span>
            </div>

            {/* List */}
            <div className="space-y-2">
                {loading ? (
                    <div className="flex justify-center py-20"><Spinner color="secondary" label="Loading orders..."/></div>
                ) : filtered.length === 0 ? (
                    <div className="py-20 text-center text-slate-400 text-sm">No {title.toLowerCase()} orders found.</div>
                ) : paginated.map((order, i) => (
                    <motion.div key={order._id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
                            <CardBody className="p-4 sm:p-5">
                                {/* Desktop row */}
                                <div className="hidden sm:grid grid-cols-[140px_1fr_1fr_100px_auto] gap-4 items-center">
                                    {/* Order ID + date */}
                                    <div>
                                        <p className="font-mono text-xs font-bold text-indigo-500">#{order._id?.slice(-8).toUpperCase()}</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                                    </div>
                                    {/* Customer */}
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{order.user?.name || "—"}</p>
                                        <p className="text-xs text-slate-500 truncate">{order.user?.email}</p>
                                    </div>
                                    {/* Total + payment */}
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">₹{order.totalPrice?.toLocaleString("en-IN")}</p>
                                        <span className={`text-[10px] font-semibold mt-0.5 inline-block ${order.isPaid ? 'text-emerald-500' : 'text-red-500'}`}>
                                            {order.isPaid ? '● Paid' : '● Unpaid'}
                                        </span>
                                    </div>
                                    {/* Status */}
                                    <StatusChip status={order.status}/>
                                    {/* Actions */}
                                    <div className="flex justify-end">
                                        {updating === order._id ? <Spinner size="sm" color="secondary"/> : (
                                            <Dropdown classNames={{ content: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl" }}>
                                                <DropdownTrigger>
                                                    <Button isIconOnly size="sm" variant="light" className="text-slate-400">
                                                        <DotsThreeVertical weight="bold" size={18}/>
                                                    </Button>
                                                </DropdownTrigger>
                                                <DropdownMenu aria-label="Order Actions" variant="flat">
                                                    <DropdownItem key="view" startContent={<Eye weight="bold"/>} onPress={() => openModal(order)}>View Details</DropdownItem>
                                                    <DropdownItem key="invoice" startContent={<DownloadSimple weight="bold"/>} onPress={() => downloadPDFInvoice(order)}>Download Invoice</DropdownItem>
                                                    {(ACTIONS[order.status] || []).map(a => (
                                                        <DropdownItem key={a.s} color={a.danger ? "danger" : "default"} className={a.danger ? "text-danger" : ""} startContent={a.icon} onPress={() => handleStatusChange(order._id, a.s)}>{a.label}</DropdownItem>
                                                    ))}
                                                </DropdownMenu>
                                            </Dropdown>
                                        )}
                                    </div>
                                </div>

                                {/* Mobile row */}
                                <div className="sm:hidden space-y-2">
                                    <div className="flex items-center justify-between">
                                        <p className="font-mono text-xs font-bold text-indigo-500">#{order._id?.slice(-8).toUpperCase()}</p>
                                        <div className="flex items-center gap-2">
                                            <StatusChip status={order.status}/>
                                            {updating === order._id ? <Spinner size="sm"/> : (
                                                <Dropdown classNames={{ content: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl" }}>
                                                    <DropdownTrigger>
                                                        <Button isIconOnly size="sm" variant="light"><DotsThreeVertical weight="bold" size={16}/></Button>
                                                    </DropdownTrigger>
                                                    <DropdownMenu aria-label="Actions" variant="flat">
                                                        <DropdownItem key="view" startContent={<Eye weight="bold"/>} onPress={() => openModal(order)}>View Details</DropdownItem>
                                                        <DropdownItem key="invoice" startContent={<DownloadSimple weight="bold"/>} onPress={() => downloadPDFInvoice(order)}>Download Invoice</DropdownItem>
                                                        {(ACTIONS[order.status] || []).map(a => (
                                                            <DropdownItem key={a.s} color={a.danger ? "danger" : "default"} className={a.danger ? "text-danger" : ""} startContent={a.icon} onPress={() => handleStatusChange(order._id, a.s)}>{a.label}</DropdownItem>
                                                        ))}
                                                    </DropdownMenu>
                                                </Dropdown>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-sm font-semibold">{order.user?.name}</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold">₹{order.totalPrice?.toLocaleString("en-IN")}</span>
                                        <span className={`text-xs font-semibold ${order.isPaid ? 'text-emerald-500' : 'text-red-500'}`}>
                                            {order.isPaid ? '● Paid' : '● Unpaid'}
                                        </span>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Pagination */}
            {!loading && filtered.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <span className="text-sm text-slate-500">
                        Showing {(page - 1) * rowsPerPage + 1}–{Math.min(page * rowsPerPage, filtered.length)} of {filtered.length} order{filtered.length !== 1 ? "s" : ""}
                    </span>
                    {totalPages > 1 && (
                        <Pagination
                            radius="md" variant="flat" showControls color="primary"
                            page={page} total={totalPages} onChange={setPage}
                            classNames={{ cursor: "bg-indigo-500 shadow-indigo-500/30" }}
                        />
                    )}
                </div>
            )}

            <OrderModal order={selected} isOpen={isOpen} onClose={onOpenChange} onAction={handleStatusChange}/>
        </div>
    );
}
