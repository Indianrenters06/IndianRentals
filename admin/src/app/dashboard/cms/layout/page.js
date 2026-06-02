"use client";
import toast from 'react-hot-toast';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Spinner } from "@heroui/react";
import {
    FloppyDisk, Plus, Trash, CheckCircle,
    MegaphoneSimple, Link as LinkIcon, Layout, ShareNetwork,
    FacebookLogo, TwitterLogo, InstagramLogo, LinkedinLogo,
    Globe, NavigationArrow
} from "@phosphor-icons/react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const getToken = () => typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

// ── Shared components (matching Homepage Editor style) ────────────────────────
const SectionRow = ({ icon, title, desc }) => (
    <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        {icon && <div className="p-2 rounded-lg shrink-0">{icon}</div>}
        <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">{title}</h3>
            {desc && <p className="text-xs text-slate-500 mt-0.5">{desc}</p>}
        </div>
    </div>
);

const Field = ({ label, value, onChange, placeholder, type = "text", rows }) => (
    <div className="flex flex-col gap-1">
        {label && <label className="text-xs font-bold text-slate-500 dark:text-slate-200 uppercase tracking-wider">{label}</label>}
        {rows ? (
            <textarea
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                rows={rows}
                className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all resize-none"
            />
        ) : (
            <input
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all"
            />
        )}
    </div>
);

const TabBtn = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
            active
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                : 'text-slate-500 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
    >
        {icon} {label}
    </button>
);

const TABS = [
    { key: "announcements", label: "Announcements",  icon: <MegaphoneSimple size={15} /> },
    { key: "navbar",        label: "Navbar Links",   icon: <NavigationArrow size={15} /> },
    { key: "footer",        label: "Footer",         icon: <Layout size={15} /> },
    { key: "social",        label: "Social Links",   icon: <ShareNetwork size={15} /> },
];

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function LayoutCMSPage() {
    const [activeTab, setActiveTab] = useState("announcements");
    const [loading, setLoading]     = useState(true);
    const [saving, setSaving]       = useState(false);
    const [saved, setSaved]         = useState(false);
    const [data, setData] = useState({
        navbarAnnouncements: [],
        navbarLinks: [],
        footerDescription: "",
        socialLinks: { facebook: "", twitter: "", instagram: "", linkedin: "" },
        footerQuickLinks: [],
    });

    const set = (key, value) => setData(prev => ({ ...prev, [key]: value }));

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch(`${API}/api/settings?t=${Date.now()}`, {
                    headers: { Authorization: `Bearer ${getToken()}` },
                });
                if (res.ok) {
                    const d = await res.json();
                    setData({
                        navbarAnnouncements: d.navbarAnnouncements || [],
                        navbarLinks: d.navbarLinks || [],
                        footerDescription: d.footerDescription || "",
                        socialLinks: d.socialLinks || { facebook: "", twitter: "", instagram: "", linkedin: "" },
                        footerQuickLinks: d.footerQuickLinks || [],
                    });
                }
            } catch (err) {
                console.error("Failed to load layout settings", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`${API}/api/settings`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error((await res.json()).message || "Failed to save");
            setSaved(true);
            toast.success("Layout saved successfully");
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            toast.error(err.message || "Error saving settings");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
            <Spinner size="lg" color="secondary" />
            <p className="text-slate-500 font-medium">Loading Layout Settings…</p>
        </div>
    );

    return (
        <div className="w-full space-y-6 pb-16">

            {/* ── Page Header ── */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Global <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">Layout</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-200 text-sm">Manage Navbar, Footer, and globally shared sections.</p>
                </motion.div>
                <div className="flex items-center gap-3">
                    {saved && (
                        <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-sm font-semibold bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-full px-3 py-1.5 animate-pulse">
                            <CheckCircle size={14} weight="fill" /> Saved Successfully!
                        </span>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 h-10 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all"
                    >
                        {saving ? <Spinner size="sm" color="white" /> : <FloppyDisk size={18} weight="bold" />}
                        {saving ? "Saving…" : "Save Layout"}
                    </button>
                </div>
            </div>

            {/* ── Tab Bar ── */}
            <div className="flex items-center gap-2 flex-wrap">
                {TABS.map(t => (
                    <TabBtn key={t.key} icon={t.icon} label={t.label} active={activeTab === t.key} onClick={() => setActiveTab(t.key)} />
                ))}
            </div>

            {/* ── TAB: ANNOUNCEMENTS ── */}
            {activeTab === "announcements" && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
                        <SectionRow
                            icon={<MegaphoneSimple weight="fill" size={18} className="text-indigo-500" />}
                            title="Top Banner Announcements"
                            desc="Scrolling announcements shown at the very top of every page. Keep them short and impactful."
                        />

                        <div className="space-y-3">
                            {data.navbarAnnouncements.map((ann, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <div className="flex-1 relative">
                                        <input
                                            value={ann}
                                            onChange={e => {
                                                const n = [...data.navbarAnnouncements];
                                                n[idx] = e.target.value;
                                                set("navbarAnnouncements", n);
                                            }}
                                            placeholder="e.g. ♥ Free delivery on all rentals ♥"
                                            className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                                        />
                                    </div>
                                    <button
                                        onClick={() => {
                                            const n = [...data.navbarAnnouncements];
                                            n.splice(idx, 1);
                                            set("navbarAnnouncements", n);
                                        }}
                                        className="w-9 h-9 flex items-center justify-center rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors shrink-0"
                                        title="Remove"
                                    >
                                        <Trash size={16} weight="bold" />
                                    </button>
                                </div>
                            ))}

                            {data.navbarAnnouncements.length === 0 && (
                                <div className="text-center py-8 text-slate-400 text-sm border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                                    No announcements yet. Add one below.
                                </div>
                            )}

                            <button
                                onClick={() => set("navbarAnnouncements", [...data.navbarAnnouncements, ""])}
                                className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center gap-2 text-slate-400 hover:text-indigo-500 hover:border-indigo-400 transition-all text-sm font-semibold"
                            >
                                <Plus size={16} weight="bold" /> Add Announcement
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* ── TAB: NAVBAR LINKS ── */}
            {activeTab === "navbar" && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
                        <SectionRow
                            icon={<NavigationArrow weight="fill" size={18} className="text-violet-500" />}
                            title="Navbar Links"
                            desc="Main navigation links shown in the header. Order here reflects order on site."
                        />

                        {/* Column headers */}
                        <div className="hidden md:grid grid-cols-[1fr_1fr_auto_auto] gap-3 px-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Link Label</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">URL Path</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">Separator</span>
                            <span className="w-9" />
                        </div>

                        <div className="space-y-2">
                            {data.navbarLinks.map((link, idx) => (
                                <div key={idx} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto] gap-2 items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                    <input
                                        placeholder="Link Name"
                                        value={link.name}
                                        onChange={e => {
                                            const n = [...data.navbarLinks];
                                            n[idx] = { ...n[idx], name: e.target.value };
                                            set("navbarLinks", n);
                                        }}
                                        className="h-9 px-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                                    />
                                    <input
                                        placeholder="/category/apple"
                                        value={link.href}
                                        onChange={e => {
                                            const n = [...data.navbarLinks];
                                            n[idx] = { ...n[idx], href: e.target.value };
                                            set("navbarLinks", n);
                                        }}
                                        className="h-9 px-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white font-mono placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                                    />
                                    <label className="flex items-center justify-center gap-2 cursor-pointer">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={link.separator || false}
                                                onChange={e => {
                                                    const n = [...data.navbarLinks];
                                                    n[idx] = { ...n[idx], separator: e.target.checked };
                                                    set("navbarLinks", n);
                                                }}
                                            />
                                            <div className="w-8 h-4 bg-slate-200 dark:bg-slate-700 peer-checked:bg-indigo-500 rounded-full transition-colors" />
                                            <div className="absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
                                        </div>
                                        <span className="text-xs text-slate-500 dark:text-slate-300 hidden md:inline">Separator</span>
                                    </label>
                                    <button
                                        onClick={() => {
                                            const n = [...data.navbarLinks];
                                            n.splice(idx, 1);
                                            set("navbarLinks", n);
                                        }}
                                        className="w-9 h-9 flex items-center justify-center rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                        title="Remove"
                                    >
                                        <Trash size={16} weight="bold" />
                                    </button>
                                </div>
                            ))}

                            {data.navbarLinks.length === 0 && (
                                <div className="text-center py-8 text-slate-400 text-sm border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                                    No nav links yet. Add one below.
                                </div>
                            )}

                            <button
                                onClick={() => set("navbarLinks", [...data.navbarLinks, { name: "", href: "/", separator: false }])}
                                className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center gap-2 text-slate-400 hover:text-indigo-500 hover:border-indigo-400 transition-all text-sm font-semibold"
                            >
                                <Plus size={16} weight="bold" /> Add Nav Link
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* ── TAB: FOOTER ── */}
            {activeTab === "footer" && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    {/* Footer Description */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
                        <SectionRow
                            icon={<Layout weight="fill" size={18} className="text-pink-500" />}
                            title="Footer Description"
                            desc="Short brand description shown in the footer's first column, below the logo."
                        />
                        <Field
                            label="Description Text"
                            value={data.footerDescription}
                            onChange={v => set("footerDescription", v)}
                            placeholder="Your go-to rental platform for premium tech and appliances across India."
                            rows={3}
                        />
                    </div>

                    {/* Footer Quick Links */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
                        <SectionRow
                            icon={<LinkIcon weight="bold" size={18} className="text-amber-500" />}
                            title="Footer Quick Links"
                            desc="Navigation links shown in the footer's Quick Links column."
                        />

                        <div className="hidden md:grid grid-cols-[1fr_1fr_auto] gap-3 px-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Link Label</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">URL Path</span>
                            <span className="w-9" />
                        </div>

                        <div className="space-y-2">
                            {data.footerQuickLinks.map((link, idx) => (
                                <div key={idx} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2 items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                    <input
                                        placeholder="Link Name"
                                        value={link.name}
                                        onChange={e => {
                                            const n = [...data.footerQuickLinks];
                                            n[idx] = { ...n[idx], name: e.target.value };
                                            set("footerQuickLinks", n);
                                        }}
                                        className="h-9 px-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                                    />
                                    <input
                                        placeholder="/about"
                                        value={link.href}
                                        onChange={e => {
                                            const n = [...data.footerQuickLinks];
                                            n[idx] = { ...n[idx], href: e.target.value };
                                            set("footerQuickLinks", n);
                                        }}
                                        className="h-9 px-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white font-mono placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                                    />
                                    <button
                                        onClick={() => {
                                            const n = [...data.footerQuickLinks];
                                            n.splice(idx, 1);
                                            set("footerQuickLinks", n);
                                        }}
                                        className="w-9 h-9 flex items-center justify-center rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                        title="Remove"
                                    >
                                        <Trash size={16} weight="bold" />
                                    </button>
                                </div>
                            ))}

                            {data.footerQuickLinks.length === 0 && (
                                <div className="text-center py-8 text-slate-400 text-sm border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                                    No quick links yet. Add one below.
                                </div>
                            )}

                            <button
                                onClick={() => set("footerQuickLinks", [...data.footerQuickLinks, { name: "", href: "/" }])}
                                className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center gap-2 text-slate-400 hover:text-indigo-500 hover:border-indigo-400 transition-all text-sm font-semibold"
                            >
                                <Plus size={16} weight="bold" /> Add Quick Link
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* ── TAB: SOCIAL LINKS ── */}
            {activeTab === "social" && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
                        <SectionRow
                            icon={<ShareNetwork weight="fill" size={18} className="text-sky-500" />}
                            title="Social Media Links"
                            desc="These appear in the footer. Leave blank to hide the icon."
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {[
                                { key: "facebook",  label: "Facebook",  icon: <FacebookLogo  size={18} weight="fill" className="text-[#1877F2]" />, placeholder: "https://facebook.com/yourpage" },
                                { key: "twitter",   label: "Twitter / X", icon: <TwitterLogo   size={18} weight="fill" className="text-[#1DA1F2]" />, placeholder: "https://twitter.com/yourhandle" },
                                { key: "instagram", label: "Instagram", icon: <InstagramLogo  size={18} weight="fill" className="text-[#E1306C]" />, placeholder: "https://instagram.com/yourhandle" },
                                { key: "linkedin",  label: "LinkedIn",  icon: <LinkedinLogo   size={18} weight="fill" className="text-[#0A66C2]" />, placeholder: "https://linkedin.com/company/yourpage" },
                            ].map(({ key, label, icon, placeholder }) => (
                                <div key={key} className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                                        {icon} {label}
                                    </label>
                                    <div className="relative">
                                        <Globe size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                        <input
                                            type="url"
                                            value={data.socialLinks?.[key] || ""}
                                            onChange={e => set("socialLinks", { ...data.socialLinks, [key]: e.target.value })}
                                            placeholder={placeholder}
                                            className="w-full h-10 pl-9 pr-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}

        </div>
    );
}
