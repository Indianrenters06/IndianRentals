"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Card, CardBody, Button, Chip, Dropdown, DropdownTrigger,
    DropdownMenu, DropdownItem, Spinner, Modal, ModalContent,
    ModalHeader, ModalBody, ModalFooter, useDisclosure, Divider, Input
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
                                            <p className="text-sm font-semibold truncate text-slate-800 dark:text-slate-100">{item.name}</p>
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

export default function OrdersManagement() {
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

    const handleStatusUpdate = async (id, status) => {
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

    const filtered = useMemo(() => {
        if (!search.trim()) return orders;
        const q = search.toLowerCase();
        return orders.filter(o =>
            o._id?.toLowerCase().includes(q) ||
            o.user?.name?.toLowerCase().includes(q) ||
            o.user?.email?.toLowerCase().includes(q) ||
            o.orderItems?.some(i => i.name?.toLowerCase().includes(q))
        );
    }, [orders, search]);

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
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Rental <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-600">Operations</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Manage order lifecycle, deliveries, and returns.</p>
                </motion.div>
                <div className="flex items-center gap-3">
                    <Button isIconOnly variant="flat" size="sm" onPress={fetchOrders} isLoading={loading} className="text-slate-500">
                        <ArrowClockwise size={16}/>
                    </Button>
                    <Input placeholder="Search orders..." value={search} onValueChange={setSearch}
                        startContent={<MagnifyingGlass className="text-slate-400" size={16}/>}
                        classNames={{ inputWrapper: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 h-10 w-64 shadow-sm" }}
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {["Pending","Approved","Shipped","Delivered"].map(s => (
                    <Card key={s} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <CardBody className="p-4">
                            <p className="text-2xl font-black text-slate-900 dark:text-white">
                                {loading ? "—" : orders.filter(o => o.status === s).length}
                            </p>
                            <StatusChip status={s} />
                        </CardBody>
                    </Card>
                ))}
            </div>

            {/* Order Cards List */}
            <div className="space-y-3">
                {/* Column Header */}
                <div className="hidden md:grid grid-cols-[1fr_1.5fr_2fr_1fr_1fr_auto] gap-4 px-5 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <span>Order ID</span>
                    <span>Customer</span>
                    <span>Items</span>
                    <span>Total</span>
                    <span>Status</span>
                    <span className="w-8"></span>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Spinner color="secondary" label="Loading orders..."/>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="py-20 text-center text-slate-400 text-sm">No orders found.</div>
                ) : (
                    filtered.map((order, i) => (
                        <motion.div key={order._id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                        >
                            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                                <CardBody className="p-0">
                                    {/* Mobile layout */}
                                    <div className="md:hidden p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="font-mono text-xs font-bold text-indigo-500">#{order._id?.slice(-8).toUpperCase()}</span>
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
                                                                <DropdownItem key={a.s} color={a.danger ? "danger" : "default"} className={a.danger ? "text-danger" : ""} startContent={a.icon} onPress={() => handleStatusUpdate(order._id, a.s)}>{a.label}</DropdownItem>
                                                            ))}
                                                        </DropdownMenu>
                                                    </Dropdown>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-sm font-semibold">{order.user?.name}</p>
                                        <p className="text-xs text-slate-500 truncate">{(order.orderItems || []).map(i => i.name).join(", ")}</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold">₹{order.totalPrice?.toLocaleString("en-IN")}</span>
                                            <span className={`text-xs font-semibold ${order.isPaid ? 'text-emerald-500' : 'text-red-500'}`}>
                                                {order.isPaid ? '● Paid' : '● Unpaid'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Desktop layout */}
                                    <div className="hidden md:grid grid-cols-[1fr_1.5fr_2fr_1fr_1fr_auto] gap-4 items-center px-5 py-4">
                                        {/* Order ID */}
                                        <div>
                                            <span className="font-mono text-xs font-bold text-indigo-500">#{order._id?.slice(-8).toUpperCase()}</span>
                                            <p className="text-[10px] text-slate-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short" })}</p>
                                        </div>

                                        {/* Customer */}
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{order.user?.name || "—"}</p>
                                            <p className="text-xs text-slate-500 truncate">{order.user?.email}</p>
                                        </div>

                                        {/* Items */}
                                        <div className="min-w-0">
                                            {(order.orderItems || []).slice(0, 2).map((item, j) => (
                                                <p key={j} className="text-xs text-slate-700 dark:text-slate-300 truncate">{item.name}</p>
                                            ))}
                                            {(order.orderItems?.length || 0) > 2 && (
                                                <p className="text-[10px] text-slate-400">+{order.orderItems.length - 2} more</p>
                                            )}
                                        </div>

                                        {/* Total + Payment */}
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">₹{order.totalPrice?.toLocaleString("en-IN")}</p>
                                            <span className={`text-[10px] font-semibold mt-0.5 inline-block ${order.isPaid ? 'text-emerald-500' : 'text-red-500'}`}>
                                                {order.isPaid ? '● Paid' : '● Unpaid'}
                                            </span>
                                        </div>

                                        {/* Status */}
                                        <StatusChip status={order.status}/>

                                        {/* Actions */}
                                        <div className="flex items-center justify-end">
                                            {updating === order._id ? <Spinner size="sm" color="secondary"/> : (
                                                <Dropdown classNames={{ content: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl" }}>
                                                    <DropdownTrigger>
                                                        <Button isIconOnly size="sm" variant="light" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                                            <DotsThreeVertical weight="bold" size={18}/>
                                                        </Button>
                                                    </DropdownTrigger>
                                                    <DropdownMenu aria-label="Order Actions" variant="flat">
                                                        <DropdownItem key="view" startContent={<Eye weight="bold"/>} onPress={() => openModal(order)}>View Order Details</DropdownItem>
                                                        <DropdownItem key="invoice" startContent={<DownloadSimple weight="bold"/>} onPress={() => downloadPDFInvoice(order)}>Download Invoice</DropdownItem>
                                                        {(ACTIONS[order.status] || []).map(a => (
                                                            <DropdownItem key={a.s} color={a.danger ? "danger" : "default"} className={a.danger ? "text-danger" : ""} startContent={a.icon} onPress={() => handleStatusUpdate(order._id, a.s)}>{a.label}</DropdownItem>
                                                        ))}
                                                    </DropdownMenu>
                                                </Dropdown>
                                            )}
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </motion.div>
                    ))
                )}
            </div>

            <OrderModal order={selected} isOpen={isOpen} onClose={onOpenChange} onAction={handleStatusUpdate}/>
        </div>
    );
}
