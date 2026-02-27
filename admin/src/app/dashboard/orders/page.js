"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Card,
    CardBody,
    Button,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Avatar,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
} from "@heroui/react";
import { DotsThreeVertical, Eye, CheckCircle, Clock, Truck, ArrowCounterClockwise, XCircle, ShoppingCart } from "@phosphor-icons/react";

export default function OrdersManagement() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/rentals`, {
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
        fetchOrders();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/rentals/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                alert("Order status updated!");
                fetchOrders();
            }
        } catch (err) {
            alert(err.message);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'warning';
            case 'active': case 'delivered': return 'success';
            case 'returned': return 'default';
            case 'cancelled': return 'danger';
            default: return 'default';
        }
    };

    return (
        <div className="max-w-7xl mx-auto w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Rental <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Operations</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Manage order lifecycle, deliveries, and returns in real-time.</p>
                </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardBody className="p-0">
                        <Table
                            aria-label="Orders Table"
                            classNames={{
                                wrapper: "p-0 rounded-none shadow-none bg-transparent",
                                thead: "bg-slate-50 dark:bg-slate-950/80",
                                th: "text-slate-500 font-semibold uppercase text-xs py-4 px-6 border-b border-slate-200 dark:border-slate-800",
                                td: "py-4 px-6 border-b border-slate-100 dark:border-slate-800/50"
                            }}
                        >
                            <TableHeader>
                                <TableColumn>ORDER ID</TableColumn>
                                <TableColumn>CUSTOMER</TableColumn>
                                <TableColumn>TOTAL</TableColumn>
                                <TableColumn>PAYMENT</TableColumn>
                                <TableColumn>STATUS</TableColumn>
                                <TableColumn align="center">ACTIONS</TableColumn>
                            </TableHeader>
                            <TableBody items={orders} isLoading={loading} emptyContent={loading ? "Loading orders..." : "No orders found."}>
                                {(order) => (
                                    <TableRow key={order._id}>
                                        <TableCell>
                                            <span className="font-mono text-xs text-indigo-500 font-bold">#{order._id.toString().slice(-6).toUpperCase()}</span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold">{order.user?.name}</span>
                                                <span className="text-xs text-slate-500">{order.user?.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm font-bold">₹{order.totalPrice}</span>
                                        </TableCell>
                                        <TableCell>
                                            {order.isPaid ?
                                                <Chip size="sm" color="success" variant="dot">Paid</Chip> :
                                                <Chip size="sm" color="danger" variant="dot">Unpaid</Chip>
                                            }
                                        </TableCell>
                                        <TableCell>
                                            <Chip color={getStatusColor(order.status)} size="sm" variant="flat">{order.status}</Chip>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-center items-center gap-2">
                                                <Dropdown>
                                                    <DropdownTrigger>
                                                        <Button isIconOnly size="sm" variant="light"><DotsThreeVertical weight="bold" /></Button>
                                                    </DropdownTrigger>
                                                    <DropdownMenu aria-label="Order Actions">
                                                        <DropdownItem key="view" startContent={<Eye weight="bold" />}>View Order Details</DropdownItem>
                                                        <DropdownItem key="ship" startContent={<Truck weight="bold" />} onClick={() => handleStatusUpdate(order._id, 'Delivered')}>Mark as Delivered</DropdownItem>
                                                        <DropdownItem key="return" startContent={<ArrowCounterClockwise weight="bold" />} onClick={() => handleStatusUpdate(order._id, 'Returned')}>Confirm Return</DropdownItem>
                                                        <DropdownItem key="cancel" color="danger" className="text-danger" startContent={<XCircle weight="bold" />} onClick={() => handleStatusUpdate(order._id, 'Cancelled')}>Cancel Order</DropdownItem>
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
