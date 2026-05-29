'use client';

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
    Card, CardBody, Button, Table, TableHeader, TableColumn, TableBody,
    TableRow, TableCell, Chip, Textarea, Input, Select, SelectItem,
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Skeleton, Switch
} from "@heroui/react";
import { Bell, BellRinging, Plus, PaperPlaneTilt, WarningCircle, CheckCircle, Users, Package, Tag } from "@phosphor-icons/react";
import toast from 'react-hot-toast';

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function PushNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortDescriptor, setSortDescriptor] = useState({ column: "createdAt", direction: "descending" });

    const sortedNotifications = useMemo(() => {
        return [...notifications].sort((a, b) => {
            let first = a[sortDescriptor.column] ?? '';
            let second = b[sortDescriptor.column] ?? '';
            if (sortDescriptor.column === 'createdAt') {
                first = new Date(first).getTime();
                second = new Date(second).getTime();
            }
            const cmp = first < second ? -1 : first > second ? 1 : 0;
            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [notifications, sortDescriptor]);
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [form, setForm] = useState({ title: "", message: "", type: "order", target: "all" });
    const [sending, setSending] = useState(false);
    const [formError, setFormError] = useState("");

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem("adminToken");
                const res = await fetch(`${API}/api/notifications`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Failed to fetch notifications");
                const data = await res.json();
                setNotifications(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, []);

    const handleSend = async () => {
        if (!form.title.trim()) return setFormError("Title is required.");
        if (!form.message.trim()) return setFormError("Message is required.");
        setFormError("");
        setSending(true);
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API}/api/notifications`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error("Failed to send notification");
            const newNotif = await res.json();
            setNotifications(prev => [newNotif, ...prev]);
            setForm({ title: "", message: "", type: "order", target: "all" });
            onClose();
            toast.success("Notification sent successfully");
        } catch (err) {
            toast.error("Failed to send notification");
        } finally {
            setSending(false);
        }
    };

    const getTypeIcon = (type) => {
        if (type === "order") return <Package size={14} />;
        if (type === "kyc") return <CheckCircle size={14} />;
        return <Bell size={14} />;
    };

    const getTypeColor = (type) => {
        if (type === "order") return "primary";
        if (type === "kyc") return "warning";
        return "default";
    };

    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Push <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">Notifications</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-200">Broadcast messages, alerts, and updates to your customers.</p>
                </motion.div>
                <div className="flex items-center gap-3">
                    <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 rounded-full px-3 py-1.5 font-bold text-sm">
                        {notifications.filter(n => !n.isRead).length} Unread
                    </div>
                    <button type="button" onClick={onOpen} className="inline-flex items-center gap-2 h-10 px-5 rounded-xl !bg-indigo-600 hover:!bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all">
                        <Plus weight="bold" size={15} />
                        New Notification
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "Total Sent", value: notifications.length, icon: PaperPlaneTilt, color: "text-indigo-500" },
                    { label: "Unread", value: notifications.filter(n => !n.isRead).length, icon: BellRinging, color: "text-amber-500" },
                    { label: "Read", value: notifications.filter(n => n.isRead).length, icon: CheckCircle, color: "text-emerald-500" },
                ].map(stat => (
                    <Card key={stat.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <CardBody className="p-4 flex flex-row items-center gap-4">
                            <div className={`p-2 bg-slate-100 dark:bg-slate-800 rounded-xl ${stat.color}`}>
                                <stat.icon weight="bold" size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                                <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{loading ? "..." : stat.value}</p>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <CardBody className="p-0">
                    {error ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3 text-rose-500">
                            <WarningCircle size={40} weight="bold" />
                            <p className="font-semibold">{error}</p>
                        </div>
                    ) : loading ? (
                        <div className="p-6 space-y-4">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-xl" />)}</div>
                    ) : (
                        <Table aria-label="Notifications table" sortDescriptor={sortDescriptor} onSortChange={setSortDescriptor} classNames={{ wrapper: "p-0 rounded-none shadow-none bg-transparent", th: "bg-slate-50 dark:bg-slate-950/80 uppercase text-xs font-bold h-12 pt-0 px-6", td: "py-4 px-6 border-b border-slate-100 dark:border-slate-800/50" }}>
                            <TableHeader>
                                <TableColumn key="title" allowsSorting>TITLE</TableColumn>
                                <TableColumn key="message">MESSAGE</TableColumn>
                                <TableColumn key="type" allowsSorting>TYPE</TableColumn>
                                <TableColumn key="createdAt" allowsSorting>SENT AT</TableColumn>
                                <TableColumn key="isRead" allowsSorting align="center">STATUS</TableColumn>
                            </TableHeader>
                            <TableBody items={sortedNotifications} emptyContent="No notifications yet. Click 'New Notification' to send one.">
                                {(item) => (
                                    <TableRow key={item._id}>
                                        <TableCell className="font-semibold text-slate-900 dark:text-slate-100">{item.title}</TableCell>
                                        <TableCell className="text-sm text-slate-500 max-w-xs truncate">{item.message}</TableCell>
                                        <TableCell>
                                            <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-bold text-xs ${item.type === "order" ? "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400" :
                                                    item.type === "kyc" ? "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400" :
                                                        "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-200"
                                                }`}>
                                                {getTypeIcon(item.type)}
                                                {item.type || "general"}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-xs text-slate-500">
                                            {new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-center">
                                                <Chip size="sm" color={item.isRead ? "default" : "success"} variant="flat" className="font-bold">
                                                    {item.isRead ? "Read" : "Delivered"}
                                                </Chip>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardBody>
            </Card>

            {/* Send Notification Modal */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg" placement="center" classNames={{ base: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" }}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="font-bold text-slate-900 dark:text-slate-100">Broadcast Notification</ModalHeader>
                            <ModalBody className="flex flex-col gap-4 py-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <Select 
                                        label="Type" 
                                        variant="bordered"
                                        radius="xl"
                                        selectedKeys={[form.type]} 
                                        onSelectionChange={keys => setForm(f => ({ ...f, type: [...keys][0] || "general" }))} 
                                        classNames={{ trigger: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 h-[60px]" }}
                                    >
                                        <SelectItem key="order" startContent={<Package size={14} />}>Order Update</SelectItem>
                                        <SelectItem key="kyc" startContent={<CheckCircle size={14} />}>KYC Alert</SelectItem>
                                        <SelectItem key="offer" startContent={<Tag size={14} />}>Offer / Promo</SelectItem>
                                        <SelectItem key="general" startContent={<Bell size={14} />}>General</SelectItem>
                                    </Select>
                                    <Select 
                                        label="Target Audience" 
                                        variant="bordered"
                                        radius="xl"
                                        selectedKeys={[form.target]} 
                                        onSelectionChange={keys => setForm(f => ({ ...f, target: [...keys][0] || "all" }))} 
                                        classNames={{ trigger: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 h-[60px]" }}
                                    >
                                        <SelectItem key="all" startContent={<Users size={14} />}>All Users</SelectItem>
                                        <SelectItem key="active">Active Users</SelectItem>
                                        <SelectItem key="kyc_pending">Pending KYC</SelectItem>
                                    </Select>
                                </div>
                                <Input 
                                    label="Notification Title" 
                                    placeholder="e.g. Your order has been shipped" 
                                    value={form.title} 
                                    onValueChange={v => setForm(f => ({ ...f, title: v }))} 
                                    variant="bordered"
                                    radius="xl"
                                    startContent={<Bell className="text-slate-400" />}
                                    classNames={{ inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 h-[60px]" }} 
                                />
                                <Textarea 
                                    label="Message Body" 
                                    placeholder="Full notification message..." 
                                    value={form.message} 
                                    onValueChange={v => setForm(f => ({ ...f, message: v }))} 
                                    variant="bordered"
                                    radius="xl"
                                    classNames={{ inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700" }} 
                                />
                                {formError && <p className="text-sm text-rose-500 flex items-center gap-2"><WarningCircle weight="bold" />{formError}</p>}
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="flat" onPress={onClose}>Cancel</Button>
                                <button type="button" disabled={sending} onClick={handleSend} className="inline-flex items-center gap-2 h-11 px-8 rounded-xl !bg-indigo-600 hover:!bg-indigo-700 disabled:opacity-60 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all">
                                    {sending ? (
                                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
                                    ) : (
                                        <PaperPlaneTilt weight="bold" size={18} />
                                    )}
                                    Send Now
                                </button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
