'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from "framer-motion";
import {
    Card, CardBody, Divider, Input,
    Textarea, Tabs, Tab, Switch, Spinner
} from "@heroui/react";
import {
    Layout, Image as PhosphorImage, FloppyDisk,
    CheckCircle, Warning, Globe, ShieldCheck, ChartLineUp
} from "@phosphor-icons/react";
import ImageUploader from "@/components/ImageUploader";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const getToken = () => typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

const DEFAULTS = {
    heroEnabled: true,
    heroTitle: "",
    heroSubtitle: "",
    heroImage: "",
    overlayColor: "rgba(0,0,0,0.5)",
    heroBgColor: "#00A8FF",
    bannerImage: "",
    bannerTitle: "",
    metaTitle: "",
    metaDescription: "",
    publishStatus: "published",
    whyChooseUsTitle: "Why Choose Us?",
    whyChooseUsSubtitle: "",
    whyChooseUsImage: "",
    statsDevices: "90k+",
    statsCustomers: "30k+",
    statsCities: "401+",
};

export default function CMSHomepage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [data, setData] = useState(DEFAULTS);

    const set = (key, val) => setData(prev => ({ ...prev, [key]: val }));

    const fetchCMS = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API}/api/cms/homepage`);
            if (res.ok) {
                const d = await res.json();
                setData({ ...DEFAULTS, ...d });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchCMS(); }, [fetchCMS]);

    const handleSave = async () => {
        try {
            setSaving(true);
            const res = await fetch(`${API}/api/cms/homepage`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify(data),
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

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                <Spinner size="lg" color="secondary" />
                <p className="text-slate-500 font-medium">Loading Homepage CMS…</p>
            </div>
        );
    }

    return (
        <div className="w-full space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Homepage <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Editor</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Manage hero sections, banners and SEO on your landing page.
                    </p>
                </motion.div>

                <div className="flex items-center gap-3">
                    {saved && (
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-sm font-semibold bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-full px-3 py-1.5">
                            <CheckCircle size={14} weight="fill" />
                            Saved!
                        </div>
                    )}
                    {/* Status badge */}
                    <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider rounded-full px-3 py-1.5 border ${data.publishStatus === "published"
                        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
                        : "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20"
                        }`}>
                        {data.publishStatus === "published"
                            ? <Globe size={12} weight="bold" />
                            : <Warning size={12} weight="bold" />}
                        {data.publishStatus === "published" ? "Live" : "Draft"}
                    </div>
                    {/* Save button — icon inline with text using flex */}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 h-10 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all"
                    >
                        {saving ? (
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                        ) : (
                            <FloppyDisk size={16} weight="bold" />
                        )}
                        {saving ? "Saving…" : "Save Changes"}
                    </button>
                </div>
            </div>

            <Tabs
                aria-label="Homepage Sections"
                color="primary"
                variant="underlined"
                classNames={{ tabList: "gap-6 border-b border-slate-200 dark:border-slate-800 w-full", cursor: "w-full bg-indigo-500", tab: "max-w-fit px-0 h-12" }}
            >
                {/* ── Hero Section Tab ── */}
                <Tab key="hero" title={<div className="flex items-center gap-2"><Layout size={15} /><span>Hero Section</span></div>}>
                    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mt-4">
                        <CardBody className="p-8 space-y-8">
                            {/* Visibility toggle */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">Hero Visibility</h4>
                                    <p className="text-sm text-slate-500">Toggle the main hero section on the landing page.</p>
                                </div>
                                <Switch
                                    isSelected={data.heroEnabled}
                                    onValueChange={(val) => set("heroEnabled", val)}
                                    color="success"
                                />
                            </div>

                            <Divider />

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                {/* Left: copy */}
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Main Headline</label>
                                        <Input
                                            value={data.heroTitle}
                                            onValueChange={(v) => set("heroTitle", v)}
                                            placeholder="Rent Anything, Anywhere in India"
                                            variant="bordered"
                                            classNames={{ inputWrapper: "h-12" }}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Sub-headline</label>
                                        <Textarea
                                            value={data.heroSubtitle}
                                            onValueChange={(v) => set("heroSubtitle", v)}
                                            placeholder="Premium rentals at your fingertips. Why buy when you can rent?"
                                            variant="bordered"
                                            minRows={3}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Overlay Colour</label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="color"
                                                className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer"
                                                value="#000000"
                                                onChange={(e) => set("overlayColor", e.target.value + "80")}
                                            />
                                            <Input
                                                value={data.overlayColor}
                                                onValueChange={(v) => set("overlayColor", v)}
                                                placeholder="rgba(0,0,0,0.5)"
                                                variant="bordered"
                                                classNames={{ inputWrapper: "h-10" }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Right: image upload */}
                                <div className="space-y-4">
                                    <ImageUploader
                                        label="Hero Background / Product Image"
                                        existingUrl={data.heroImage}
                                        onUpload={url => set("heroImage", url)}
                                    />
                                    {/* Preview */}
                                    <div
                                        className="aspect-video rounded-2xl relative overflow-hidden border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 flex items-center justify-center"
                                        style={data.heroImage ? { backgroundImage: `url(${data.heroImage})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
                                    >
                                        {data.heroImage ? (
                                            <div
                                                className="absolute inset-0 flex flex-col items-center justify-center text-white p-6"
                                                style={{ background: data.overlayColor }}
                                            >
                                                <p className="text-2xl font-black text-center drop-shadow">{data.heroTitle || "Your headline here"}</p>
                                                <p className="text-sm mt-2 opacity-80 text-center">{data.heroSubtitle}</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-slate-400">
                                                <PhosphorImage size={32} />
                                                <span className="text-xs">Hero preview will appear here</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Tab>

                {/* ── Why Choose Us Tab ── */}
                <Tab key="why-us" title={<div className="flex items-center gap-2"><ShieldCheck size={15} /><span>Why Choose Us</span></div>}>
                    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mt-4">
                        <CardBody className="p-8 space-y-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Heading</label>
                                        <Input
                                            value={data.whyChooseUsTitle}
                                            onValueChange={(v) => set("whyChooseUsTitle", v)}
                                            placeholder="Why Choose Us?"
                                            variant="bordered"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Description</label>
                                        <Textarea
                                            value={data.whyChooseUsSubtitle}
                                            onValueChange={(v) => set("whyChooseUsSubtitle", v)}
                                            placeholder="Tell your story or value proposition…"
                                            variant="bordered"
                                            minRows={4}
                                        />
                                    </div>

                                    <div className="pt-4 space-y-4">
                                        <p className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                            <ChartLineUp size={14} /> Platform Metrics
                                        </p>
                                        <div className="grid grid-cols-3 gap-4">
                                            <Input
                                                label="Devices"
                                                value={data.statsDevices}
                                                onValueChange={v => set("statsDevices", v)}
                                                variant="bordered"
                                                size="sm"
                                            />
                                            <Input
                                                label="Customers"
                                                value={data.statsCustomers}
                                                onValueChange={v => set("statsCustomers", v)}
                                                variant="bordered"
                                                size="sm"
                                            />
                                            <Input
                                                label="Cities"
                                                value={data.statsCities}
                                                onValueChange={v => set("statsCities", v)}
                                                variant="bordered"
                                                size="sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <ImageUploader
                                        label="Sidebar Image"
                                        existingUrl={data.whyChooseUsImage}
                                        onUpload={url => set("whyChooseUsImage", url)}
                                    />
                                    {data.whyChooseUsImage && (
                                        <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
                                            <img src={data.whyChooseUsImage} className="w-full h-full object-cover" alt="Why Choose Us Preview" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Tab>

                {/* ── Publish Status Tab ── */}
                <Tab key="publish" title={<div className="flex items-center gap-2"><Globe size={15} /><span>Publish Status</span></div>}>
                    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mt-4">
                        <CardBody className="p-8 space-y-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-base font-bold">Page Status</h4>
                                    <p className="text-sm text-slate-500">Toggle whether the homepage is live to the public.</p>
                                </div>
                                <Switch
                                    isSelected={data.publishStatus === "published"}
                                    onValueChange={(val) => set("publishStatus", val ? "published" : "draft")}
                                    color="success"
                                />
                            </div>
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm border ${data.publishStatus === "published"
                                ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
                                : "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20"
                                }`}>
                                {data.publishStatus === "published"
                                    ? <CheckCircle size={16} weight="fill" />
                                    : <Warning size={16} weight="fill" />}
                                {data.publishStatus === "published" ? "Page is LIVE" : "Page is a DRAFT (hidden from public)"}
                            </div>
                        </CardBody>
                    </Card>
                </Tab>

                {/* ── SEO Tab ── */}
                <Tab key="seo" title="SEO">
                    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mt-4">
                        <CardBody className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Meta Title</label>
                                <Input
                                    value={data.metaTitle}
                                    onValueChange={(v) => set("metaTitle", v)}
                                    placeholder="IndianRentals – Rent Everything You Need"
                                    variant="bordered"
                                    classNames={{ inputWrapper: "h-12" }}
                                />
                                <p className="text-xs text-slate-400">{data.metaTitle.length} / 60 characters</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Meta Description</label>
                                <Textarea
                                    value={data.metaDescription}
                                    onValueChange={(v) => set("metaDescription", v)}
                                    placeholder="Find and rent premium gadgets, cameras, furniture & more across India."
                                    variant="bordered"
                                    minRows={3}
                                />
                                <p className="text-xs text-slate-400">{data.metaDescription.length} / 160 characters</p>
                            </div>

                            {/* SERP Preview */}
                            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 space-y-1">
                                <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Google Preview</p>
                                <p className="text-blue-600 text-sm font-medium">{data.metaTitle || "IndianRentals – Homepage"}</p>
                                <p className="text-green-700 text-xs">indianrentals.com</p>
                                <p className="text-slate-600 text-xs">{data.metaDescription || "Your website description will appear here…"}</p>
                            </div>
                        </CardBody>
                    </Card>
                </Tab>
            </Tabs>
        </div>
    );
}
