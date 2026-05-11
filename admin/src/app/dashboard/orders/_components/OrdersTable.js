"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
    Card, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Button,
    Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Input, Skeleton
} from "@heroui/react";
import { 
    DotsThreeVertical, MagnifyingGlass, Calendar, ShoppingCart, 
    ArrowRight, CheckCircle, XCircle, FileText, DownloadSimple 
} from "@phosphor-icons/react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function OrdersTable({ initialStatus = "all", title = "Orders" }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isMounted, setIsMounted] = useState(false);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API}/api/admin/rentals`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setIsMounted(true);
        fetchOrders();
    }, []);

    const filteredOrders = useMemo(() => {
        let result = orders;
        if (initialStatus !== "all") {
            result = result.filter(order => order.status?.toLowerCase() === initialStatus.toLowerCase());
        }
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(order => 
                order.orderId?.toLowerCase().includes(q) || 
                order.user?.name?.toLowerCase().includes(q) ||
                order.item?.name?.toLowerCase().includes(q)
            );
        }
        return result;
    }, [orders, search, initialStatus]);

    if (!isMounted) return null;

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API}/api/admin/rentals/${id}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                fetchOrders();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const renderStatusChip = (status) => {
        const s = status?.toLowerCase();
        if (s === 'delivered' || s === 'active') return <Chip size="sm" color="success" variant="flat" className="font-bold">Active</Chip>;
        if (s === 'pending') return <Chip size="sm" color="warning" variant="flat" className="font-bold">Pending</Chip>;
        if (s === 'cancelled') return <Chip size="sm" color="danger" variant="flat" className="font-bold">Cancelled</Chip>;
        if (s === 'returned') return <Chip size="sm" color="secondary" variant="flat" className="font-bold">Returned</Chip>;
        return <Chip size="sm" variant="flat" className="font-bold">{status?.toUpperCase()}</Chip>;
    };

    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        {title} <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Management</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Track and fulfill rental requests across the platform.</p>
                </motion.div>
                
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500" />
                        <Input
                            placeholder="Search orders..."
                            value={search}
                            onValueChange={setSearch}
                            classNames={{
                                inputWrapper: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 h-11 w-64 shadow-sm"
                            }}
                        />
                    </div>
                </div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <CardBody className="p-0">
                        <Table
                            aria-label="Orders Table"
                            classNames={{
                                wrapper: "p-0 rounded-none shadow-none bg-transparent",
                                thead: "bg-slate-50 dark:bg-slate-950/80",
                                th: "text-slate-500 font-semibold uppercase text-[10px] py-4 px-6 border-b border-slate-200 dark:border-slate-800",
                                td: "py-4 px-6 border-b border-slate-100 dark:border-slate-800/50"
                            }}
                        >
                            <TableHeader>
                                <TableColumn>ORDER ID</TableColumn>
                                <TableColumn>CUSTOMER</TableColumn>
                                <TableColumn>ITEM</TableColumn>
                                <TableColumn>DURATION</TableColumn>
                                <TableColumn>STATUS</TableColumn>
                                <TableColumn align="center">ACTIONS</TableColumn>
                            </TableHeader>
                            <TableBody items={filteredOrders} isLoading={loading} emptyContent={loading ? "Loading orders..." : "No orders found."}>
                                {(order) => (
                                    <TableRow key={order._id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <FileText size={16} className="text-slate-400" />
                                                <span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-400">#{order.orderId || order._id?.slice(-8)}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold">{order.user?.name || "Guest User"}</span>
                                                <span className="text-xs text-slate-500">{order.user?.phone}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                                    <ShoppingCart size={14} className="text-indigo-500" />
                                                </div>
                                                <span className="text-sm font-medium truncate max-w-[150px]">{order.item?.name || "Product Name"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <Calendar size={14} />
                                                <span className="text-xs font-medium">{new Date(order.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - {new Date(order.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {renderStatusChip(order.status)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-center">
                                                <Dropdown>
                                                    <DropdownTrigger>
                                                        <Button isIconOnly size="sm" variant="light" className="rounded-full">
                                                            <DotsThreeVertical weight="bold" />
                                                        </Button>
                                                    </DropdownTrigger>
                                                    <DropdownMenu aria-label="Order actions">
                                                        <DropdownItem key="view" startContent={<ArrowRight />}>View Details</DropdownItem>
                                                        <DropdownItem key="invoice" startContent={<DownloadSimple />}>Download Invoice</DropdownItem>
                                                        {order.status === 'pending' && (
                                                            <DropdownItem key="deliver" className="text-success" color="success" startContent={<CheckCircle />} onPress={() => handleUpdateStatus(order._id, 'delivered')}>Mark as Delivered</DropdownItem>
                                                        )}
                                                        {order.status === 'delivered' && (
                                                            <DropdownItem key="return" className="text-secondary" color="secondary" startContent={<ArrowsClockwise />} onPress={() => handleUpdateStatus(order._id, 'returned')}>Mark as Returned</DropdownItem>
                                                        )}
                                                        {order.status === 'pending' && (
                                                            <DropdownItem key="cancel" className="text-danger" color="danger" startContent={<XCircle />} onPress={() => handleUpdateStatus(order._id, 'cancelled')}>Cancel Order</DropdownItem>
                                                        )}
                                                    </DropdownMenu>
                                                </Dropdown>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardBody>
                </Card>
            </motion.div>
        </div>
    );
}
