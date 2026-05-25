"use client";
import toast from 'react-hot-toast';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DeviceMobile, Plus, Trash, FloppyDisk } from "@phosphor-icons/react";

function SectionRow({ icon, title, desc, toggle, onToggle }) {
    return (
        <div className="flex items-start gap-4 w-full">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                {icon}
            </div>
            <div className="flex-1">
                <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mb-1">{title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-200 max-w-lg leading-relaxed">{desc}</p>
            </div>
            {onToggle !== undefined && (
                <button
                    onClick={() => onToggle(!toggle)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${toggle ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${toggle ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
            )}
        </div>
    );
}

function Field({ label, value, onChange, placeholder, type = "text", multiline = false }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-200 uppercase tracking-wider">{label}</label>
            {multiline ? (
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    rows={3}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-base text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
            ) : (
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-base text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
            )}
        </div>
    );
}

export default function LayoutCMSPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState({
        navbarAnnouncements: [],
        navbarLinks: [],
        footerDescription: "",
        socialLinks: { facebook: "", twitter: "", instagram: "", linkedin: "" },
        footerQuickLinks: []
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            const ts = Date.now();
            const res = await window.fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/settings?t=${ts}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const d = await res.json();
                setData({
                    navbarAnnouncements: d.navbarAnnouncements || [],
                    navbarLinks: d.navbarLinks || [],
                    footerDescription: d.footerDescription || "",
                    socialLinks: d.socialLinks || { facebook: "", twitter: "", instagram: "", linkedin: "" },
                    footerQuickLinks: d.footerQuickLinks || []
                });
            }
        } catch (err) {
            console.error("Failed to load layout settings", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/settings`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                toast.success("Layout settings updated successfully");
            } else {
                toast.error("Failed to update settings");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error saving settings");
        } finally {
            setSaving(false);
        }
    };

    const set = (key, value) => setData(prev => ({ ...prev, [key]: value }));

    if (loading) return <div className="p-8 text-center text-slate-500">Loading Layout Settings...</div>;

    return (
        <div className="max-w-4xl mx-auto pb-24">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Global Layout</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-200 mt-1">Manage Navbar, Footer, and globally shared sections.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="!bg-indigo-600 hover:!bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all shadow-sm hover:shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                    <FloppyDisk weight="bold" className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Layout'}
                </button>
            </div>

            <div className="space-y-6">
                {/* Navbar Announcements */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
                    <SectionRow
                        icon={<DeviceMobile weight="fill" className="text-indigo-500" />}
                        title="Top Banner Announcements"
                        desc="Scrolling announcements shown at the very top of the page."
                    />
                    <div className="space-y-3">
                        {data.navbarAnnouncements.map((ann, idx) => (
                            <div key={idx} className="flex gap-2">
                                <input
                                    value={ann}
                                    onChange={e => {
                                        const newArr = [...data.navbarAnnouncements];
                                        newArr[idx] = e.target.value;
                                        set("navbarAnnouncements", newArr);
                                    }}
                                    className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-base focus:outline-none"
                                />
                                <button onClick={() => {
                                    const newArr = [...data.navbarAnnouncements];
                                    newArr.splice(idx, 1);
                                    set("navbarAnnouncements", newArr);
                                }} className="p-2 text-red-500 hover:bg-red-50 rounded-xl">
                                    <Trash />
                                </button>
                            </div>
                        ))}
                        <button onClick={() => set("navbarAnnouncements", [...data.navbarAnnouncements, "New Announcement"])} className="flex items-center gap-1 text-sm text-indigo-600 font-bold hover:text-indigo-700">
                            <Plus weight="bold" /> Add Announcement
                        </button>
                    </div>
                </div>

                {/* Navbar Links */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
                    <SectionRow
                        icon={<DeviceMobile weight="fill" className="text-indigo-500" />}
                        title="Navbar Links"
                        desc="Main navigation links shown below the search bar."
                    />
                    <div className="space-y-3">
                        {data.navbarLinks.map((link, idx) => (
                            <div key={idx} className="flex gap-2 items-center bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                                <input
                                    placeholder="Link Name"
                                    value={link.name}
                                    onChange={e => {
                                        const newArr = [...data.navbarLinks];
                                        newArr[idx].name = e.target.value;
                                        set("navbarLinks", newArr);
                                    }}
                                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-base text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                />
                                <input
                                    placeholder="URL (/category/apple)"
                                    value={link.href}
                                    onChange={e => {
                                        const newArr = [...data.navbarLinks];
                                        newArr[idx].href = e.target.value;
                                        set("navbarLinks", newArr);
                                    }}
                                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-base text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                />
                                <label className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-300 whitespace-nowrap">
                                    <input type="checkbox" checked={link.separator} onChange={e => {
                                        const newArr = [...data.navbarLinks];
                                        newArr[idx].separator = e.target.checked;
                                        set("navbarLinks", newArr);
                                    }} /> Add Separator Line After?
                                </label>
                                <button onClick={() => {
                                    const newArr = [...data.navbarLinks];
                                    newArr.splice(idx, 1);
                                    set("navbarLinks", newArr);
                                }} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl">
                                    <Trash />
                                </button>
                            </div>
                        ))}
                        <button onClick={() => set("navbarLinks", [...data.navbarLinks, { name: "New Link", href: "/", separator: false }])} className="flex items-center gap-1 text-sm text-indigo-600 font-bold hover:text-indigo-700">
                            <Plus weight="bold" /> Add Nav Link
                        </button>
                    </div>
                </div>

                {/* Footer Configuration */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
                    <SectionRow
                        icon={<DeviceMobile weight="fill" className="text-indigo-500" />}
                        title="Footer Configuration"
                        desc="Manage description, social links, and quick links in the footer."
                    />
                    
                    <Field 
                        label="Footer Description" 
                        value={data.footerDescription} 
                        onChange={v => set("footerDescription", v)} 
                        multiline 
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Facebook URL" value={data.socialLinks?.facebook} onChange={v => set("socialLinks", { ...data.socialLinks, facebook: v })} />
                        <Field label="Twitter URL" value={data.socialLinks?.twitter} onChange={v => set("socialLinks", { ...data.socialLinks, twitter: v })} />
                        <Field label="Instagram URL" value={data.socialLinks?.instagram} onChange={v => set("socialLinks", { ...data.socialLinks, instagram: v })} />
                        <Field label="LinkedIn URL" value={data.socialLinks?.linkedin} onChange={v => set("socialLinks", { ...data.socialLinks, linkedin: v })} />
                    </div>

                    <div className="mt-4">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-200 uppercase tracking-wider block mb-2">Footer Quick Links</label>
                        <div className="space-y-3">
                            {data.footerQuickLinks.map((link, idx) => (
                                <div key={idx} className="flex gap-2 items-center bg-slate-50 dark:bg-slate-950 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
                                    <input
                                        placeholder="Link Name"
                                        value={link.name}
                                        onChange={e => {
                                            const newArr = [...data.footerQuickLinks];
                                            newArr[idx].name = e.target.value;
                                            set("footerQuickLinks", newArr);
                                        }}
                                        className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-base text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                    />
                                    <input
                                        placeholder="URL"
                                        value={link.href}
                                        onChange={e => {
                                            const newArr = [...data.footerQuickLinks];
                                            newArr[idx].href = e.target.value;
                                            set("footerQuickLinks", newArr);
                                        }}
                                        className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-base text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                    />
                                    <button onClick={() => {
                                        const newArr = [...data.footerQuickLinks];
                                        newArr.splice(idx, 1);
                                        set("footerQuickLinks", newArr);
                                    }} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl">
                                        <Trash />
                                    </button>
                                </div>
                            ))}
                            <button onClick={() => set("footerQuickLinks", [...data.footerQuickLinks, { name: "New Link", href: "/" }])} className="flex items-center gap-1 text-sm text-indigo-600 font-bold hover:text-indigo-700">
                                <Plus weight="bold" /> Add Quick Link
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
