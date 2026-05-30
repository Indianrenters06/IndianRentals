'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Card, CardBody, Button, Switch, Chip, Skeleton,
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Input, Textarea, Select, SelectItem
} from "@heroui/react";
import { CheckCircle, EnvelopeSimple, DeviceMobile, Bell, PaperPlaneTilt, WarningCircle, ShoppingCart, Users } from "@phosphor-icons/react";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function BookingConfirmation() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [channels, setChannels] = useState({ email: true, sms: true, push: true });
    const [sending, setSending] = useState(false);
    const [form, setForm] = useState({ orderId: "", customerName: "", channel: "all" });
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        fetch(`${API}/api/notifications?type=booking`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.ok ? r.json() : [])
            .then(d => { setLogs(Array.isArray(d) ? d.filter(n => n.type === "order" || n.type === "booking") : []); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const handleSend = async () => {
        if (!form.orderId.trim()) return toast.error("Order ID is required");
        setSending(true);
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API}/api/alerts`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ title: "Booking Confirmed", message: `Order #${form.orderId} has been confirmed. Thank you${form.customerName ? `, ${form.customerName}` : ""}!`, type: "order", target: "all" }),
            });
            if (!res.ok) throw new Error();
            toast.success("Booking confirmation sent");
            onClose();
            setForm({ orderId: "", customerName: "", channel: "all" });
        } catch {
            toast.error("Failed to send notification");
        } finally {
            setSending(false);
        }
    };

    const stats = [
        { label: "Sent Today",    value: logs.filter(l => new Date(l.createdAt).toDateString() === new Date().toDateString()).length, icon: PaperPlaneTilt, color: "text-indigo-500" },
        { label: "Total Sent",    value: logs.length,                                                                                    icon: CheckCircle,   color: "text-emerald-500" },
        { label: "Channels Active", value: Object.values(channels).filter(Boolean).length,                                              icon: Bell,          color: "text-amber-500"  },
    ];

    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Booking <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">Confirmation</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Notify customers instantly when their booking is confirmed.</p>
                </motion.div>
                <button onClick={onOpen} className="inline-flex items-center gap-2 h-10 px-5 rounded-xl !bg-indigo-600 hover:!bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all">
                    <PaperPlaneTilt weight="bold" size={15} /> Send Confirmation
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {stats.map(s => (
                    <Card key={s.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <CardBody className="p-4 flex flex-row items-center gap-4">
                            <div className={`p-2 bg-slate-100 dark:bg-slate-800 rounded-xl ${s.color}`}>
                                <s.icon weight="bold" size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-medium">{s.label}</p>
                                <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{loading ? "…" : s.value}</p>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>

            {/* Channel Config */}
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <CardBody className="p-6">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Notification Channels</p>
                    <div className="space-y-4">
                        {[
                            { key: "email", label: "Email Confirmation", desc: "Send order receipt to customer email", icon: EnvelopeSimple, color: "text-blue-500" },
                            { key: "sms",   label: "SMS Alert",           desc: "Send short confirmation via SMS",      icon: DeviceMobile,    color: "text-emerald-500" },
                            { key: "push",  label: "Push Notification",   desc: "In-app or mobile push alert",          icon: Bell,            color: "text-indigo-500" },
                        ].map(ch => (
                            <div key={ch.key} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 bg-slate-100 dark:bg-slate-800 rounded-xl ${ch.color}`}><ch.icon weight="bold" size={18} /></div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{ch.label}</p>
                                        <p className="text-xs text-slate-400">{ch.desc}</p>
                                    </div>
                                </div>
                                <Switch isSelected={channels[ch.key]} onValueChange={v => setChannels(c => ({ ...c, [ch.key]: v }))} color="success" size="sm" />
                            </div>
                        ))}
                    </div>
                </CardBody>
            </Card>

            {/* Recent logs */}
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <CardBody className="p-6">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Recent Booking Confirmations</p>
                    {loading ? [...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 rounded-xl mb-2" />) :
                        logs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
                                <ShoppingCart size={40} weight="thin" />
                                <p className="text-sm">No booking confirmations sent yet</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {logs.slice(0, 10).map(l => (
                                    <div key={l._id} className="flex items-center justify-between py-3 border-b border-slate-50 dark:border-slate-800/50 last:border-0">
                                        <div>
                                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{l.title}</p>
                                            <p className="text-xs text-slate-400 mt-0.5">{l.message}</p>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0 ml-4">
                                            <Chip size="sm" color={l.isRead ? "default" : "success"} variant="flat" className="font-bold">{l.isRead ? "Read" : "Delivered"}</Chip>
                                            <span className="text-xs text-slate-400">{new Date(l.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                </CardBody>
            </Card>

            {/* Send Modal */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md" placement="center" classNames={{ base: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" }}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="font-bold text-slate-900 dark:text-slate-100">Send Booking Confirmation</ModalHeader>
                            <ModalBody className="flex flex-col gap-4 py-4">
                                <Input label="Order ID" placeholder="e.g. ORD-12345" value={form.orderId} onValueChange={v => setForm(f => ({ ...f, orderId: v }))}
                                    variant="bordered" radius="xl" startContent={<ShoppingCart className="text-slate-400" size={16} />}
                                    classNames={{ inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 h-[60px]" }} />
                                <Input label="Customer Name (optional)" placeholder="e.g. Rahul Sharma" value={form.customerName} onValueChange={v => setForm(f => ({ ...f, customerName: v }))}
                                    variant="bordered" radius="xl" startContent={<Users className="text-slate-400" size={16} />}
                                    classNames={{ inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 h-[60px]" }} />
                                <Select label="Channel" selectedKeys={[form.channel]} onSelectionChange={k => setForm(f => ({ ...f, channel: [...k][0] || "all" }))}
                                    variant="bordered" radius="xl"
                                    classNames={{ trigger: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 h-[60px]" }}>
                                    <SelectItem key="all">All Channels (Email + SMS + Push)</SelectItem>
                                    <SelectItem key="email">Email Only</SelectItem>
                                    <SelectItem key="sms">SMS Only</SelectItem>
                                    <SelectItem key="push">Push Only</SelectItem>
                                </Select>
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="flat" onPress={onClose}>Cancel</Button>
                                <button disabled={sending} onClick={handleSend} className="inline-flex items-center gap-2 h-11 px-8 rounded-xl !bg-indigo-600 hover:!bg-indigo-700 disabled:opacity-60 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all">
                                    {sending ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg> : <PaperPlaneTilt weight="bold" size={16} />}
                                    Send Confirmation
                                </button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
