'use client';

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
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            alert(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="w-full space-y-6 pb-12 max-w-3xl">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                    General <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Settings</span>
                </h1>
                <p className="text-slate-600 dark:text-slate-400">Configure your platform's core identity and behaviour.</p>
            </motion.div>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <CardBody className="p-6 space-y-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-indigo-500 flex items-center gap-2"><Globe weight="bold" /> Platform Identity</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Site Name</label>
                            <input
                                type="text"
                                value={form.siteName}
                                onChange={e => setForm(f => ({ ...f, siteName: e.target.value }))}
                                placeholder="IndianRentals"
                                className="h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Site Logo URL</label>
                            <input
                                type="text"
                                value={form.siteLogo}
                                onChange={e => setForm(f => ({ ...f, siteLogo: e.target.value }))}
                                placeholder="https://res.cloudinary.com/..."
                                className="h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-mono"
                            />
                            <p className="text-[10px] text-slate-400 mt-1">Provide a Cloudinary or direct image link for the logo.</p>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Support Email</label>
                            <input
                                type="email"
                                value={form.siteEmail}
                                onChange={e => setForm(f => ({ ...f, siteEmail: e.target.value }))}
                                placeholder="support@example.com"
                                className="h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone Number</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><Phone size={15} /></span>
                                <input type="text" value={form.sitePhone} onChange={e => setForm(f => ({ ...f, sitePhone: e.target.value }))} placeholder="+91 9876543210" className="w-full h-11 pl-9 pr-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Address</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><MapPin size={15} /></span>
                                <input type="text" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Mumbai, Maharashtra, India" className="w-full h-11 pl-9 pr-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Currency</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><CurrencyInr size={15} /></span>
                                <input type="text" value={form.currency} readOnly className="w-full h-11 pl-9 pr-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white opacity-60 cursor-not-allowed" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Timezone</label>
                            <input type="text" value={form.timezone} readOnly className="h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white opacity-60 cursor-not-allowed" />
                        </div>
                    </div>

                    <Divider className="bg-slate-200 dark:bg-slate-800 my-2" />

                    <p className="text-xs font-bold uppercase tracking-widest text-indigo-500 flex items-center gap-2"><Gear weight="bold" /> Platform Behaviour</p>
                    <div className="space-y-4">
                        {[
                            { key: "maintenanceMode", label: "Maintenance Mode", desc: "Temporarily take the site offline for users", color: "danger" },
                            { key: "allowRegistrations", label: "Allow New Registrations", desc: "Let new users sign up on the platform", color: "success" },
                            { key: "requireKYC", label: "Require KYC Before Checkout", desc: "Block orders until KYC documents are approved", color: "warning" },
                        ].map(item => (
                            <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50">
                                <div>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.label}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
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
                    className="inline-flex items-center gap-2 h-12 px-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 disabled:opacity-60 transition-all"
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
