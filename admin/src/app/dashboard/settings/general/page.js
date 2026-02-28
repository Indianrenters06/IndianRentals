'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardBody, Input, Button, Switch, Divider, Chip } from "@heroui/react";
import { Gear, FloppyDisk, Globe, Phone, MapPin, CurrencyInr, WarningCircle, CheckCircle } from "@phosphor-icons/react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function GeneralSettings() {
    const [form, setForm] = useState({
        siteName: "IndianRentals",
        siteEmail: "support@indianrentals.com",
        sitePhone: "+91 9876543210",
        address: "Mumbai, Maharashtra, India",
        currency: "INR",
        timezone: "Asia/Kolkata",
        maintenanceMode: false,
        allowRegistrations: true,
        requireKYC: true,
    });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        await new Promise(r => setTimeout(r, 800)); // simulate API
        setSaved(true);
        setSaving(false);
        setTimeout(() => setSaved(false), 3000);
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
                        <Input label="Site Name" value={form.siteName} onValueChange={v => setForm(f => ({ ...f, siteName: v }))} classNames={{ inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700" }} />
                        <Input label="Support Email" value={form.siteEmail} onValueChange={v => setForm(f => ({ ...f, siteEmail: v }))} classNames={{ inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700" }} />
                        <Input label="Phone Number" startContent={<Phone className="text-slate-400" />} value={form.sitePhone} onValueChange={v => setForm(f => ({ ...f, sitePhone: v }))} classNames={{ inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700" }} />
                        <Input label="Address" startContent={<MapPin className="text-slate-400" />} value={form.address} onValueChange={v => setForm(f => ({ ...f, address: v }))} classNames={{ inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700" }} />
                        <Input label="Currency" startContent={<CurrencyInr className="text-slate-400" />} value={form.currency} isReadOnly classNames={{ inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700" }} />
                        <Input label="Timezone" value={form.timezone} isReadOnly classNames={{ inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700" }} />
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
                <Button
                    color="primary"
                    className="bg-indigo-600 font-bold shadow-indigo-500/20 shadow-lg px-8"
                    startContent={saving ? null : saved ? <CheckCircle weight="bold" /> : <FloppyDisk weight="bold" />}
                    isLoading={saving}
                    onPress={handleSave}
                >
                    {saved ? "Saved!" : "Save Changes"}
                </Button>
                {saved && <Chip color="success" variant="flat" startContent={<CheckCircle weight="bold" />}>Settings saved successfully</Chip>}
            </div>
        </div>
    );
}
