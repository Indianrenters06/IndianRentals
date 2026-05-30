'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Card, CardBody, Switch, Chip, Skeleton,
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Input, Select, SelectItem, Button
} from "@heroui/react";
import { XCircle, EnvelopeSimple, DeviceMobile, Bell, PaperPlaneTilt, ShoppingCart, Users, WarningCircle } from "@phosphor-icons/react";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CancellationAlerts() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [channels, setChannels] = useState({ email: true, sms: true, push: false });
    const [sending, setSending] = useState(false);
    const [form, setForm] = useState({ orderId: "", reason: "", channel: "all" });
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        fetch(`${API}/api/alerts`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.ok ? r.json() : [])
            .then(d => { setLogs(Array.isArray(d) ? d.filter(n => n.type === "cancellation" || (n.title || "").toLowerCase().includes("cancel")) : []); setLoading(false); })
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
                body: JSON.stringify({
                    title: "Order Cancelled",
                    message: `Order #${form.orderId} has been cancelled.${form.reason ? ` Reason: ${form.reason}` : ""} Contact support for assistance.`,
                    type: "order", target: "all"
                }),
            });
            if (!res.ok) throw new Error();
            toast.success("Cancellation alert sent");
            onClose();
            setForm({ orderId: "", reason: "", channel: "all" });
        } catch {
            toast.error("Failed to send alert");
        } finally {
            setSending(false);
        }
    };

    const stats = [
        { label: "Alerts Sent",    value: logs.length,                                                                                       icon: XCircle,       color: "text-red-500"    },
        { label: "Sent Today",     value: logs.filter(l => new Date(l.createdAt).toDateString() === new Date().toDateString()).length,         icon: Bell,          color: "text-amber-500"  },
        { label: "Channels Active", value: Object.values(channels).filter(Boolean).length,                                                    icon: PaperPlaneTilt, color: "text-indigo-500" },
    ];

    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Cancellation <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">Alerts</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Notify customers immediately when a booking is cancelled.</p>
                </motion.div>
                <button onClick={onOpen} className="inline-flex items-center gap-2 h-10 px-5 rounded-xl !bg-red-600 hover:!bg-red-700 text-white font-semibold text-sm shadow-lg shadow-red-500/25 transition-all">
                    <XCircle weight="bold" size={15} /> Send Alert
                </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {stats.map(s => (
                    <Card key={s.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <CardBody className="p-4 flex flex-row items-center gap-4">
                            <div className={`p-2 bg-slate-100 dark:bg-slate-800 rounded-xl ${s.color}`}><s.icon weight="bold" size={20} /></div>
                            <div>
                                <p className="text-xs text-slate-500 font-medium">{s.label}</p>
                                <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{loading ? "…" : s.value}</p>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <CardBody className="p-6">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Notification Channels</p>
                    <div className="space-y-4">
                        {[
                            { key: "email", label: "Email Alert",        desc: "Send cancellation notice to customer email", icon: EnvelopeSimple, color: "text-blue-500"    },
                            { key: "sms",   label: "SMS Alert",          desc: "Send cancellation via SMS",                  icon: DeviceMobile,   color: "text-emerald-500" },
                            { key: "push",  label: "Push Notification",  desc: "In-app push for cancellation",               icon: Bell,           color: "text-indigo-500"  },
                        ].map(ch => (
                            <div key={ch.key} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 bg-slate-100 dark:bg-slate-800 rounded-xl ${ch.color}`}><ch.icon weight="bold" size={18} /></div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{ch.label}</p>
                                        <p className="text-xs text-slate-400">{ch.desc}</p>
                                    </div>
                                </div>
                                <Switch isSelected={channels[ch.key]} onValueChange={v => setChannels(c => ({ ...c, [ch.key]: v }))} color="danger" size="sm" />
                            </div>
                        ))}
                    </div>
                </CardBody>
            </Card>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <CardBody className="p-6">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Recent Cancellation Alerts</p>
                    {loading ? [...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 rounded-xl mb-2" />) :
                        logs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
                                <XCircle size={40} weight="thin" />
                                <p className="text-sm">No cancellation alerts sent yet</p>
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
                                            <Chip size="sm" color="danger" variant="flat" className="font-bold">Cancelled</Chip>
                                            <span className="text-xs text-slate-400">{new Date(l.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                </CardBody>
            </Card>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md" placement="center" classNames={{ base: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" }}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="font-bold text-slate-900 dark:text-slate-100">Send Cancellation Alert</ModalHeader>
                            <ModalBody className="flex flex-col gap-4 py-4">
                                <Input label="Order ID" placeholder="e.g. ORD-12345" value={form.orderId} onValueChange={v => setForm(f => ({ ...f, orderId: v }))}
                                    variant="bordered" radius="xl" startContent={<ShoppingCart className="text-slate-400" size={16} />}
                                    classNames={{ inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 h-[60px]" }} />
                                <Input label="Cancellation Reason (optional)" placeholder="e.g. Customer requested" value={form.reason} onValueChange={v => setForm(f => ({ ...f, reason: v }))}
                                    variant="bordered" radius="xl" startContent={<WarningCircle className="text-slate-400" size={16} />}
                                    classNames={{ inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 h-[60px]" }} />
                                <Select label="Channel" selectedKeys={[form.channel]} onSelectionChange={k => setForm(f => ({ ...f, channel: [...k][0] || "all" }))}
                                    variant="bordered" radius="xl"
                                    classNames={{ trigger: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 h-[60px]" }}>
                                    <SelectItem key="all">All Channels</SelectItem>
                                    <SelectItem key="email">Email Only</SelectItem>
                                    <SelectItem key="sms">SMS Only</SelectItem>
                                </Select>
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="flat" onPress={onClose}>Cancel</Button>
                                <button disabled={sending} onClick={handleSend} className="inline-flex items-center gap-2 h-11 px-8 rounded-xl !bg-red-600 hover:!bg-red-700 disabled:opacity-60 text-white font-bold text-sm shadow-lg shadow-red-500/25 transition-all">
                                    {sending ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg> : <XCircle weight="bold" size={16} />}
                                    Send Alert
                                </button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
