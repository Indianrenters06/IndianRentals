"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Card, CardBody, Button, Table, TableHeader, TableColumn,
    TableBody, TableRow, TableCell, Chip, Dropdown, DropdownTrigger,
    DropdownMenu, DropdownItem, Spinner, Modal, ModalContent,
    ModalHeader, ModalBody, ModalFooter, useDisclosure, Divider, Input
} from "@heroui/react";
import {
    DotsThreeVertical, Eye, Truck, ArrowCounterClockwise, XCircle,
    CheckCircle, ShoppingCart, Package, MapPin, Calendar,
    CurrencyDollar, User, MagnifyingGlass, ArrowClockwise, Warning,
    Checks
} from "@phosphor-icons/react";

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
    const items = order.orderItems || [];
    const addr  = order.shippingAddress || {};
    const p     = order.rentalPeriod || {};
    const fmt   = d => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

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
                        {/* Customer */}
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1"><User size={11}/> Customer</p>
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{order.user?.name || "—"}</p>
                            <p className="text-xs text-slate-500">{order.user?.email}</p>
                        </div>
                        <Divider />
                        {/* Items */}
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
                        {/* Period + Payment */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1"><Calendar size={11}/> Rental Period</p>
                                <p className="text-sm font-semibold">{p.durationMonths} month{p.durationMonths !== 1 ? "s" : ""}</p>
                                <p className="text-xs text-slate-500">{fmt(p.startDate)} → {fmt(p.endDate)}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1"><CurrencyDollar size={11}/> Payment</p>
                                <p className="text-sm font-bold">₹{order.totalPrice?.toLocaleString("en-IN")}</p>
                                <p className="text-xs text-slate-500">{order.paymentMethod} · {order.isPaid ? "✅ Paid" : "⏳ Unpaid"}</p>
                            </div>
                        </div>
                        {addr.address && (
                            <>
                                <Divider />
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1"><MapPin size={11}/> Shipping Address</p>
                                    <p className="text-sm text-slate-700 dark:text-slate-300">{addr.address}, {addr.city} – {addr.postalCode}</p>
                                    <p className="text-xs text-slate-500">📞 {addr.phone}</p>
                                </div>
                            </>
                        )}
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
    const [orders, setOrders]   = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);
    const [search, setSearch]   = useState("");
    const [selected, setSelected] = useState(null);
    const [toast, setToast]     = useState(null);
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
        <div className="max-w-7xl mx-auto w-full space-y-6 pb-12">

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
                    <p className="text-slate-600 dark:text-slate-400">Manage order lifecycle, deliveries, and returns in real-time.</p>
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

            {/* Table */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardBody className="p-0">
                        <Table aria-label="Orders Table" classNames={{
                            wrapper: "p-0 rounded-none shadow-none bg-transparent",
                            thead: "bg-slate-50 dark:bg-slate-950/80",
                            th: "text-slate-500 font-semibold uppercase text-xs py-4 px-6 border-b border-slate-200 dark:border-slate-800",
                            td: "py-4 px-6 border-b border-slate-100 dark:border-slate-800/50"
                        }}>
                            <TableHeader>
                                <TableColumn>ORDER ID</TableColumn>
                                <TableColumn>CUSTOMER</TableColumn>
                                <TableColumn>ITEMS</TableColumn>
                                <TableColumn>TOTAL</TableColumn>
                                <TableColumn>PAYMENT</TableColumn>
                                <TableColumn>STATUS</TableColumn>
                                <TableColumn align="center">ACTIONS</TableColumn>
                            </TableHeader>
                            <TableBody items={filtered} isLoading={loading}
                                loadingContent={<div className="py-20 flex justify-center"><Spinner color="secondary" label="Loading..."/></div>}
                                emptyContent={<div className="py-20 text-center text-slate-400 text-sm">No orders found.</div>}
                            >
                                {(order) => (
                                    <TableRow key={order._id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                        <TableCell>
                                            <span className="font-mono text-xs font-bold text-indigo-500">#{order._id?.slice(-8).toUpperCase()}</span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold">{order.user?.name || "—"}</span>
                                                <span className="text-xs text-slate-500">{order.user?.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-0.5">
                                                {(order.orderItems || []).slice(0, 2).map((item, i) => (
                                                    <span key={i} className="text-xs text-slate-700 dark:text-slate-300 truncate max-w-[160px]">{item.name}</span>
                                                ))}
                                                {(order.orderItems?.length || 0) > 2 && (
                                                    <span className="text-[10px] text-slate-400">+{order.orderItems.length - 2} more</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm font-bold">₹{order.totalPrice?.toLocaleString("en-IN")}</span>
                                        </TableCell>
                                        <TableCell>
                                            {order.isPaid
                                                ? <Chip size="sm" color="success" variant="dot" className="text-xs">Paid</Chip>
                                                : <Chip size="sm" color="danger"  variant="dot" className="text-xs">Unpaid</Chip>
                                            }
                                        </TableCell>
                                        <TableCell><StatusChip status={order.status}/></TableCell>
                                        <TableCell>
                                            <div className="flex justify-center">
                                                {updating === order._id ? <Spinner size="sm" color="secondary"/> : (
                                                    <Dropdown classNames={{ content: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl" }}>
                                                        <DropdownTrigger>
                                                            <Button isIconOnly size="sm" variant="light" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                                                <DotsThreeVertical weight="bold" size={18}/>
                                                            </Button>
                                                        </DropdownTrigger>
                                                        <DropdownMenu aria-label="Order Actions" variant="flat">
                                                            <DropdownItem key="view" startContent={<Eye weight="bold"/>}
                                                                onPress={() => openModal(order)}>
                                                                View Order Details
                                                            </DropdownItem>
                                                            {(ACTIONS[order.status] || []).map(a => (
                                                                <DropdownItem key={a.s}
                                                                    color={a.danger ? "danger" : "default"}
                                                                    className={a.danger ? "text-danger" : ""}
                                                                    startContent={a.icon}
                                                                    onPress={() => handleStatusUpdate(order._id, a.s)}>
                                                                    {a.label}
                                                                </DropdownItem>
                                                            ))}
                                                        </DropdownMenu>
                                                    </Dropdown>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardBody>
                </Card>
            </motion.div>

            <OrderModal order={selected} isOpen={isOpen} onClose={onOpenChange} onAction={handleStatusUpdate}/>
        </div>
    );
}
