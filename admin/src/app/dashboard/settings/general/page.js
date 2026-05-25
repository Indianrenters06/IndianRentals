'use client';
import toast from 'react-hot-toast';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardBody, Input, Button, Switch, Divider, Chip } from "@heroui/react";
import { Gear, FloppyDisk, Globe, Phone, MapPin, CurrencyInr, WarningCircle, CheckCircle } from "@phosphor-icons/react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function GeneralSettings() {
    const [form, setForm] = useState({
        siteName: "",
        siteLogo: "",
        siteEmail: "",
        sitePhone: "",
        address: "",
        currency: "INR",
        timezone: "Asia/Kolkata",
        maintenanceMode: false,
        allowRegistrations: true,
        requireKYC: true,
    });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [loadError, setLoadError] = useState(false);

    // ── Load from backend ──────────────────────────────────────────────────────
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const token = localStorage.getItem("adminToken");
                const res = await fetch(`${API}/api/settings`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const d = await res.json();
                    setForm(prev => ({
                        ...prev,
                        siteName: d.siteName || "",
                        siteLogo: d.siteLogo || "",
                        siteEmail: d.contactEmail || "",
                        sitePhone: d.contactPhone || "",
                        address: d.address || "",
                        currency: d.currency || "INR",
                        timezone: d.timezone || "Asia/Kolkata",
                        maintenanceMode: d.maintenanceMode ?? false,
                        allowRegistrations: d.allowRegistrations ?? true,
                        requireKYC: d.requireKYC ?? true,
                    }));
                }
            } catch (err) {
                console.error("Failed to load settings", err);
                setLoadError(true);
            }
        };
        fetchSettings();
    }, []);

    // ── Save to backend ────────────────────────────────────────────────────────
    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API}/api/settings`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    siteName: form.siteName,
                    siteLogo: form.siteLogo,
                    contactEmail: form.siteEmail,
                    contactPhone: form.sitePhone,
                    address: form.address,
                    maintenanceMode: form.maintenanceMode,
                    allowRegistrations: form.allowRegistrations,
                    requireKYC: form.requireKYC,
                }),
            });
            if (!res.ok) throw new Error((await res.json()).message || "Failed to save");
            setSaved(true);
            toast.success("Settings saved successfully");
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="w-full space-y-6 pb-12 max-w-3xl">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                    General <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">Settings</span>
                </h1>
                <p className="text-slate-600 dark:text-slate-200">Configure your platform's core identity and behaviour.</p>
            </motion.div>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <CardBody className="p-6 space-y-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-indigo-500 flex items-center gap-2"><Globe weight="bold" /> Platform Identity</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                        <Input
                            label="Site Name"
                            placeholder="IndianRentals"
                            value={form.siteName}
                            onValueChange={v => setForm(f => ({ ...f, siteName: v }))}
                            variant="bordered"
                            radius="xl"
                            startContent={<Globe className="text-slate-400" />}
                            classNames={{ inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 h-[60px]" }}
                        />
                        <Input
                            label="Support Email"
                            type="email"
                            placeholder="support@example.com"
                            value={form.siteEmail}
                            onValueChange={v => setForm(f => ({ ...f, siteEmail: v }))}
                            variant="bordered"
                            radius="xl"
                            startContent={<Globe className="text-slate-400" />}
                            classNames={{ inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 h-[60px]" }}
                        />
                        <div className="md:col-span-2">
                            <Input
                                label="Site Logo URL"
                                placeholder="https://res.cloudinary.com/..."
                                value={form.siteLogo}
                                onValueChange={v => setForm(f => ({ ...f, siteLogo: v }))}
                                variant="bordered"
                                radius="xl"
                                description="Provide a Cloudinary or direct image link for the logo."
                                classNames={{ 
                                    inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 h-[60px]",
                                    input: "font-mono text-xs"
                                }}
                            />
                        </div>
                        <Input
                            label="Phone Number"
                            placeholder="+91 9876543210"
                            value={form.sitePhone}
                            onValueChange={v => setForm(f => ({ ...f, sitePhone: v }))}
                            variant="bordered"
                            radius="xl"
                            startContent={<Phone className="text-slate-400" />}
                            classNames={{ inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 h-[60px]" }}
                        />
                        <Input
                            label="Address"
                            placeholder="Mumbai, Maharashtra, India"
                            value={form.address}
                            onValueChange={v => setForm(f => ({ ...f, address: v }))}
                            variant="bordered"
                            radius="xl"
                            startContent={<MapPin className="text-slate-400" />}
                            classNames={{ inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 h-[60px]" }}
                        />
                        <Input
                            label="Currency"
                            value={form.currency}
                            variant="bordered"
                            radius="xl"
                            isReadOnly
                            startContent={<CurrencyInr className="text-slate-400" />}
                            classNames={{ inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 h-[60px] opacity-60" }}
                        />
                        <Input
                            label="Timezone"
                            value={form.timezone}
                            variant="bordered"
                            radius="xl"
                            isReadOnly
                            startContent={<Globe className="text-slate-400" />}
                            classNames={{ inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 h-[60px] opacity-60" }}
                        />
                    </div>

                    <Divider className="bg-slate-200 dark:bg-slate-800 my-2" />

                    <p className="text-xs font-bold uppercase tracking-widest text-indigo-500 flex items-center gap-2"><Gear weight="bold" /> Platform Behaviour</p>

                    {form.maintenanceMode && (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400">
                            <WarningCircle weight="bold" size={18} className="shrink-0" />
                            <p className="text-sm font-semibold">Maintenance mode is currently <span className="underline">active</span>. The platform is offline for regular users. Remember to save and disable it when done.</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        {[
                            { key: "maintenanceMode", label: "Maintenance Mode", desc: "Temporarily take the site offline for regular users. Admins retain full access.", color: "danger" },
                            { key: "allowRegistrations", label: "Allow New Registrations", desc: "Let new users sign up on the platform. Disable to freeze new sign-ups.", color: "success" },
                            { key: "requireKYC", label: "Require KYC Before Checkout", desc: "Block rental orders until KYC documents are approved by an admin.", color: "warning" },
                        ].map(item => (
                            <div key={item.key} className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                                item.key === "maintenanceMode" && form[item.key]
                                    ? "bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30"
                                    : item.key === "allowRegistrations" && !form[item.key]
                                    ? "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30"
                                    : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/50"
                            }`}>
                                <div className="flex-1 mr-6">
                                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.label}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                                    <div className="mt-2">
                                        {item.key === "maintenanceMode" && (
                                            <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${form[item.key] ? "bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400" : "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"}`}>
                                                {form[item.key] ? "● SITE OFFLINE" : "● SITE ONLINE"}
                                            </span>
                                        )}
                                        {item.key === "allowRegistrations" && (
                                            <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${form[item.key] ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400" : "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400"}`}>
                                                {form[item.key] ? "● REGISTRATIONS OPEN" : "● REGISTRATIONS CLOSED"}
                                            </span>
                                        )}
                                        {item.key === "requireKYC" && (
                                            <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${form[item.key] ? "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400" : "bg-slate-100 dark:bg-slate-700/50 text-slate-500"}`}>
                                                {form[item.key] ? "● KYC REQUIRED" : "● KYC OPTIONAL"}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <Switch
                                    color={item.color}
                                    isSelected={form[item.key]}
                                    onValueChange={v => setForm(f => ({ ...f, [item.key]: v }))}
                                />
                            </div>
                        ))}
                    </div>
                </CardBody>
            </Card>

            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center gap-2 h-12 px-10 rounded-xl !bg-indigo-600 hover:!bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 disabled:opacity-60 transition-all"
                >
                    {saving ? (
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
                    ) : saved ? (
                        <CheckCircle weight="bold" size={18} />
                    ) : (
                        <FloppyDisk weight="bold" size={18} />
                    )}
                    {saving ? "Saving…" : saved ? "Saved!" : "Save Changes"}
                </button>
                {saved && (
                    <div className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-sm font-semibold bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-full px-3 py-1.5">
                        <CheckCircle weight="bold" size={14} /> Settings saved successfully
                    </div>
                )}
            </div>
        </div>
    );
}
