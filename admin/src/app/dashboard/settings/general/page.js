'use client';
import toast from 'react-hot-toast';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardBody, Input, Switch, Divider, Select, SelectItem } from "@heroui/react";
import { Gear, FloppyDisk, Globe, Phone, MapPin, CurrencyInr, WarningCircle, CheckCircle, EnvelopeSimple, Image as PhosphorImage } from "@phosphor-icons/react";
import ImageUploader from "@/components/ImageUploader";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const CURRENCIES = [
    { key: "INR", label: "INR — Indian Rupee (₹)" },
    { key: "USD", label: "USD — US Dollar ($)" },
    { key: "EUR", label: "EUR — Euro (€)" },
    { key: "GBP", label: "GBP — British Pound (£)" },
];

const TIMEZONES = [
    { key: "Asia/Kolkata",    label: "Asia/Kolkata (IST, UTC+5:30)" },
    { key: "UTC",             label: "UTC (UTC+0:00)" },
    { key: "Asia/Dubai",      label: "Asia/Dubai (GST, UTC+4:00)" },
    { key: "Asia/Singapore",  label: "Asia/Singapore (SGT, UTC+8:00)" },
    { key: "Europe/London",   label: "Europe/London (GMT/BST)" },
    { key: "America/New_York",label: "America/New_York (ET)" },
];

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
                        siteName:           d.siteName        || "",
                        siteLogo:           d.siteLogo        || "",
                        siteEmail:          d.contactEmail    || "",
                        sitePhone:          d.contactPhone    || "",
                        address:            d.address         || "",
                        currency:           d.currency        || "INR",
                        timezone:           d.timezone        || "Asia/Kolkata",
                        maintenanceMode:    d.maintenanceMode  ?? false,
                        allowRegistrations: d.allowRegistrations ?? true,
                        requireKYC:         d.requireKYC       ?? true,
                    }));
                }
            } catch (err) {
                console.error("Failed to load settings", err);
            }
        };
        fetchSettings();
    }, []);

    const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API}/api/settings`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    siteName:           form.siteName,
                    siteLogo:           form.siteLogo,
                    contactEmail:       form.siteEmail,
                    contactPhone:       form.sitePhone,
                    address:            form.address,
                    currency:           form.currency,
                    timezone:           form.timezone,
                    maintenanceMode:    form.maintenanceMode,
                    allowRegistrations: form.allowRegistrations,
                    requireKYC:         form.requireKYC,
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
                <CardBody className="p-6 space-y-6">

                    {/* ── Platform Identity ── */}
                    <p className="text-xs font-bold uppercase tracking-widest text-indigo-500 flex items-center gap-2">
                        <Globe size={14} weight="bold" /> Platform Identity
                    </p>
                    <p className="text-xs text-slate-400 -mt-4">
                        These values are used across the Navbar, Footer, PDF invoices, and email templates automatically.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
                        <Input
                            label="Site Name"
                            placeholder="IndianRentals"
                            value={form.siteName}
                            onValueChange={v => set("siteName", v)}
                            variant="bordered"
                            radius="xl"
                            startContent={<Globe size={16} className="text-slate-400 shrink-0 mb-0.5" />}
                            classNames={{ inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 h-[60px]", innerWrapper: "items-end pb-2", label: "text-sm font-medium" }}
                            description="Shown in the browser tab, Navbar alt text, and Footer copyright."
                        />
                        <Input
                            label="Support Email"
                            type="email"
                            placeholder="support@example.com"
                            value={form.siteEmail}
                            onValueChange={v => set("siteEmail", v)}
                            variant="bordered"
                            radius="xl"
                            startContent={<EnvelopeSimple size={16} className="text-slate-400 shrink-0 mb-0.5" />}
                            classNames={{ inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 h-[60px]", innerWrapper: "items-end pb-2", label: "text-sm font-medium" }}
                            description="Used on the Contact page and in transactional emails."
                        />
                        <Input
                            label="Phone Number"
                            placeholder="+91 9876543210"
                            value={form.sitePhone}
                            onValueChange={v => set("sitePhone", v)}
                            variant="bordered"
                            radius="xl"
                            startContent={<Phone size={16} className="text-slate-400 shrink-0 mb-0.5" />}
                            classNames={{ inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 h-[60px]", innerWrapper: "items-end pb-2", label: "text-sm font-medium" }}
                            description="Displayed in the Footer and Contact page."
                        />
                        <Input
                            label="Address"
                            placeholder="Mumbai, Maharashtra, India"
                            value={form.address}
                            onValueChange={v => set("address", v)}
                            variant="bordered"
                            radius="xl"
                            startContent={<MapPin size={16} className="text-slate-400 shrink-0 mb-0.5" />}
                            classNames={{ inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 h-[60px]", innerWrapper: "items-end pb-2", label: "text-sm font-medium" }}
                            description="Used in invoices and the Contact page."
                        />

                        <Select
                            label="Currency"
                            selectedKeys={[form.currency]}
                            onSelectionChange={keys => set("currency", [...keys][0] || "INR")}
                            variant="bordered"
                            radius="xl"
                            startContent={<CurrencyInr size={16} className="text-slate-400 shrink-0" />}
                            classNames={{ trigger: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 h-[60px]", value: "text-slate-900 dark:text-white", label: "text-sm font-medium" }}
                            description="Affects price display across the entire platform."
                        >
                            {CURRENCIES.map(c => <SelectItem key={c.key}>{c.label}</SelectItem>)}
                        </Select>

                        <Select
                            label="Timezone"
                            selectedKeys={[form.timezone]}
                            onSelectionChange={keys => set("timezone", [...keys][0] || "Asia/Kolkata")}
                            variant="bordered"
                            radius="xl"
                            startContent={<Globe size={16} className="text-slate-400 shrink-0" />}
                            classNames={{ trigger: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 h-[60px]", value: "text-slate-900 dark:text-white", label: "text-sm font-medium" }}
                            description="Used for scheduling, order timestamps, and reports."
                        >
                            {TIMEZONES.map(t => <SelectItem key={t.key}>{t.label}</SelectItem>)}
                        </Select>
                    </div>

                    {/* ── Site Logo ── */}
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                            <PhosphorImage size={13} weight="bold" className="shrink-0" /> Site Logo
                        </p>
                        <p className="text-xs text-slate-400">
                            This logo appears in the Navbar, Footer, and PDF invoices. Upload a PNG/WebP with a transparent background for best results.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                            <ImageUploader
                                label="Upload Logo"
                                existingUrl={form.siteLogo}
                                onUpload={url => set("siteLogo", url)}
                            />
                            {form.siteLogo && (
                                <div className="flex flex-col gap-2">
                                    <p className="text-xs text-slate-400 font-medium">Preview</p>
                                    <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-white dark:bg-slate-800 flex items-center justify-center h-24">
                                        <img
                                            src={form.siteLogo}
                                            alt="Site Logo Preview"
                                            className="max-h-16 max-w-full object-contain"
                                            onError={e => { e.target.style.display = 'none'; }}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                                        <span className="text-[10px] font-mono text-slate-400 break-all line-clamp-2">{form.siteLogo}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <Divider className="bg-slate-200 dark:bg-slate-800" />

                    {/* ── Platform Behaviour ── */}
                    <p className="text-xs font-bold uppercase tracking-widest text-indigo-500 flex items-center gap-2">
                        <Gear size={14} weight="bold" className="shrink-0" /> Platform Behaviour
                    </p>

                    {form.maintenanceMode && (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400">
                            <WarningCircle weight="bold" size={18} className="shrink-0" />
                            <p className="text-sm font-semibold">Maintenance mode is currently <span className="underline">active</span>. The platform is offline for regular users.</p>
                        </div>
                    )}

                    <div className="space-y-3">
                        {[
                            { key: "maintenanceMode",    label: "Maintenance Mode",             desc: "Temporarily take the site offline for regular users. Admins retain full access.", color: "danger",  badge: { on: "● SITE OFFLINE", off: "● SITE ONLINE", onCls: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400", offCls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" } },
                            { key: "allowRegistrations", label: "Allow New Registrations",      desc: "Let new users sign up. Disable to freeze new sign-ups.",                         color: "success", badge: { on: "● REGISTRATIONS OPEN", off: "● REGISTRATIONS CLOSED", onCls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400", offCls: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400" } },
                            { key: "requireKYC",         label: "Require KYC Before Checkout",  desc: "Block rental orders until KYC documents are approved by an admin.",              color: "warning", badge: { on: "● KYC REQUIRED", off: "● KYC OPTIONAL", onCls: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400", offCls: "bg-slate-100 text-slate-500 dark:bg-slate-700/50" } },
                        ].map(item => (
                            <div key={item.key} className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                                item.key === "maintenanceMode" && form[item.key] ? "bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30"
                                : item.key === "allowRegistrations" && !form[item.key] ? "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30"
                                : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/50"
                            }`}>
                                <div className="flex-1 mr-6">
                                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.label}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full mt-2 ${form[item.key] ? item.badge.onCls : item.badge.offCls}`}>
                                        {form[item.key] ? item.badge.on : item.badge.off}
                                    </span>
                                </div>
                                <Switch color={item.color} isSelected={form[item.key]} onValueChange={v => set(item.key, v)} />
                            </div>
                        ))}
                    </div>
                </CardBody>
            </Card>

            {/* Save Button */}
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center gap-2 h-12 px-10 rounded-xl !bg-indigo-600 hover:!bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 disabled:opacity-60 transition-all"
                >
                    {saving ? (
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
                    ) : (
                        <FloppyDisk weight="bold" size={18} />
                    )}
                    {saving ? "Saving…" : "Save Changes"}
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
