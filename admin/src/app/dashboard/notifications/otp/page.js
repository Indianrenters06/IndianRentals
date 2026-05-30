'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Card, CardBody, Switch, Chip, Skeleton, Button,
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Input, Select, SelectItem
} from "@heroui/react";
import { LockKey, DeviceMobile, EnvelopeSimple, PaperPlaneTilt, ShieldCheck, Users, WarningCircle } from "@phosphor-icons/react";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function OTPVerification() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [config, setConfig] = useState({ sms: true, email: true, expiry: "10", length: "6" });
    const [sending, setSending] = useState(false);
    const [form, setForm] = useState({ recipient: "", channel: "sms" });
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        fetch(`${API}/api/alerts`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.ok ? r.json() : [])
            .then(d => {
                const all = Array.isArray(d) ? d : [];
                setLogs(all.filter(n => (n.title || "").toLowerCase().includes("otp") || (n.title || "").toLowerCase().includes("verif")));
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleSend = async () => {
        if (!form.recipient.trim()) return toast.error("Phone or email is required");
        setSending(true);
        const otp = Math.floor(100000 + Math.random() * 900000).toString().substring(0, parseInt(config.length));
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API}/api/alerts`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    title: "OTP Verification",
                    message: `Your IndianRentals OTP is ${otp}. Valid for ${config.expiry} minutes. Do not share this with anyone.`,
                    type: "general", target: "all"
                }),
            });
            if (!res.ok) throw new Error();
            toast.success(`OTP sent to ${form.recipient}`);
            onClose();
            setForm({ recipient: "", channel: "sms" });
        } catch {
            toast.error("Failed to send OTP");
        } finally {
            setSending(false);
        }
    };

    const stats = [
        { label: "OTPs Sent",   value: logs.length,                                                                                   icon: PaperPlaneTilt, color: "text-indigo-500"  },
        { label: "Sent Today",  value: logs.filter(l => new Date(l.createdAt).toDateString() === new Date().toDateString()).length,     icon: LockKey,        color: "text-amber-500"   },
        { label: "Verified",    value: logs.filter(l => l.isRead).length,                                                              icon: ShieldCheck,    color: "text-emerald-500" },
    ];

    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        OTP <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">Verification</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Send one-time passwords for authentication and account verification.</p>
                </motion.div>
                <button onClick={onOpen} className="inline-flex items-center gap-2 h-10 px-5 rounded-xl !bg-indigo-600 hover:!bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all">
                    <LockKey weight="bold" size={15} /> Send OTP
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

            {/* OTP Config */}
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <CardBody className="p-6">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">OTP Configuration</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            {[
                                { key: "sms",   label: "SMS OTP",   desc: "Send OTP via Twilio / MSG91", icon: DeviceMobile,   color: "text-emerald-500" },
                                { key: "email", label: "Email OTP", desc: "Send OTP via Email",          icon: EnvelopeSimple, color: "text-blue-500"    },
                            ].map(ch => (
                                <div key={ch.key} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 bg-slate-100 dark:bg-slate-800 rounded-xl ${ch.color}`}><ch.icon weight="bold" size={18} /></div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{ch.label}</p>
                                            <p className="text-xs text-slate-400">{ch.desc}</p>
                                        </div>
                                    </div>
                                    <Switch isSelected={config[ch.key]} onValueChange={v => setConfig(c => ({ ...c, [ch.key]: v }))} color="success" size="sm" />
                                </div>
                            ))}
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-medium text-slate-500 mb-2">OTP Length</p>
                                <div className="flex gap-2">
                                    {["4", "6", "8"].map(l => (
                                        <button key={l} onClick={() => setConfig(c => ({ ...c, length: l }))}
                                            className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-all ${config.length === l ? "bg-indigo-600 text-white border-indigo-600" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"}`}>
                                            {l} digits
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-slate-500 mb-2">Expiry Time</p>
                                <div className="flex gap-2">
                                    {["5", "10", "15"].map(t => (
                                        <button key={t} onClick={() => setConfig(c => ({ ...c, expiry: t }))}
                                            className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-all ${config.expiry === t ? "bg-indigo-600 text-white border-indigo-600" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"}`}>
                                            {t} min
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <CardBody className="p-6">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Recent OTP Logs</p>
                    {loading ? [...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 rounded-xl mb-2" />) :
                        logs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
                                <LockKey size={40} weight="thin" />
                                <p className="text-sm">No OTP logs found</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {logs.slice(0, 10).map(l => (
                                    <div key={l._id} className="flex items-center justify-between py-3 border-b border-slate-50 dark:border-slate-800/50 last:border-0">
                                        <div>
                                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{l.title}</p>
                                            <p className="text-xs text-slate-400 mt-0.5">{new Date(l.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} · {new Date(l.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                                        </div>
                                        <Chip size="sm" color={l.isRead ? "success" : "warning"} variant="flat" className="font-bold">
                                            {l.isRead ? "Verified" : "Pending"}
                                        </Chip>
                                    </div>
                                ))}
                            </div>
                        )}
                </CardBody>
            </Card>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="sm" placement="center" classNames={{ base: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" }}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="font-bold text-slate-900 dark:text-slate-100">Send OTP</ModalHeader>
                            <ModalBody className="flex flex-col gap-4 py-4">
                                <Input label="Phone / Email" placeholder="+91 98765 43210 or email" value={form.recipient} onValueChange={v => setForm(f => ({ ...f, recipient: v }))}
                                    variant="bordered" radius="xl" startContent={<Users className="text-slate-400" size={16} />}
                                    classNames={{ inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 h-[60px]" }} />
                                <Select label="Channel" selectedKeys={[form.channel]} onSelectionChange={k => setForm(f => ({ ...f, channel: [...k][0] || "sms" }))}
                                    variant="bordered" radius="xl"
                                    classNames={{ trigger: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 h-[60px]" }}>
                                    <SelectItem key="sms" startContent={<DeviceMobile size={14} />}>SMS</SelectItem>
                                    <SelectItem key="email" startContent={<EnvelopeSimple size={14} />}>Email</SelectItem>
                                </Select>
                                <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-3 flex items-start gap-2">
                                    <WarningCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                                    <p className="text-xs text-amber-700 dark:text-amber-400">OTP will be {config.length} digits and expire in {config.expiry} minutes.</p>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="flat" onPress={onClose}>Cancel</Button>
                                <button disabled={sending} onClick={handleSend} className="inline-flex items-center gap-2 h-11 px-8 rounded-xl !bg-indigo-600 hover:!bg-indigo-700 disabled:opacity-60 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all">
                                    {sending ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg> : <LockKey weight="bold" size={16} />}
                                    Send OTP
                                </button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
