'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
    Card, CardBody, Button, Input, Textarea,
    Chip, Spinner, Divider, Switch
} from "@heroui/react";
import {
    FileText, LinkSimple, FloppyDisk, PencilSimple,
    ArrowLeft, CheckCircle, Globe, Warning, Image as PhosphorImage
} from "@phosphor-icons/react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const getToken = () => typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

const PAGES = [
    { key: "about", label: "About Us", slug: "/about" },
    { key: "terms", label: "Terms & Conditions", slug: "/terms" },
    { key: "privacy", label: "Privacy Policy", slug: "/privacy" },
    { key: "contact", label: "Contact Us", slug: "/contact" },
    { key: "shipping", label: "Shipping & Delivery", slug: "/shipping" },
    { key: "refund", label: "Cancellation & Refund Policy", slug: "/refund-policy" },
    { key: "faq", label: "FAQ / Help Center", slug: "/faq" },
];

const DEFAULTS = {
    bannerImage: "",
    bannerTitle: "",
    pageContent: "",
    metaTitle: "",
    metaDescription: "",
    publishStatus: "published",
};

// ── Editor for a single page ──────────────────────────────────────────────────
function PageEditor({ page, onBack }) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [data, setData] = useState(DEFAULTS);

    const set = (k, v) => setData(p => ({ ...p, [k]: v }));

    const fetch_ = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API}/api/cms/${page.key}`);
            if (res.ok) setData({ ...DEFAULTS, ...(await res.json()) });
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }, [page.key]);

    useEffect(() => { fetch_(); }, [fetch_]);

    const save = async () => {
        try {
            setSaving(true);
            const res = await fetch(`${API}/api/cms/${page.key}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error((await res.json()).message || "Failed");
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (e) { alert(e.message); }
        finally { setSaving(false); }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center gap-3 py-24 text-slate-400">
                <Spinner size="sm" color="secondary" />
                Loading {page.label}…
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            {/* Sub-header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button isIconOnly size="sm" variant="light" onPress={onBack} className="text-slate-500">
                        <ArrowLeft size={18} />
                    </Button>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{page.label}</h2>
                        <div className="flex items-center gap-1 text-xs text-slate-400 font-mono">
                            <LinkSimple size={11} />{page.slug}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {saved && <Chip color="success" variant="flat" size="sm" startContent={<CheckCircle size={12} weight="fill" />}>Saved!</Chip>}
                    <Chip
                        size="sm"
                        color={data.publishStatus === "published" ? "success" : "warning"}
                        variant="flat"
                        startContent={data.publishStatus === "published" ? <Globe size={11} /> : <Warning size={11} />}
                    >
                        {data.publishStatus === "published" ? "Live" : "Draft"}
                    </Chip>
                    <Button
                        color="primary"
                        variant="shadow"
                        startContent={<FloppyDisk size={16} />}
                        isLoading={saving}
                        onPress={save}
                        className="bg-indigo-600 font-bold shadow-indigo-500/20"
                    >
                        Save
                    </Button>
                </div>
            </div>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <CardBody className="p-8 space-y-8">
                    {/* Banner section */}
                    <div>
                        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-4">Page Banner</h4>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Banner Title</label>
                                    <Input
                                        value={data.bannerTitle}
                                        onValueChange={v => set("bannerTitle", v)}
                                        placeholder={`${page.label}`}
                                        variant="bordered"
                                        classNames={{ inputWrapper: "h-11" }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Banner Image URL</label>
                                    <Input
                                        value={data.bannerImage}
                                        onValueChange={v => set("bannerImage", v)}
                                        placeholder="https://res.cloudinary.com/..."
                                        variant="bordered"
                                        startContent={<PhosphorImage size={14} className="text-slate-400" />}
                                        classNames={{ inputWrapper: "h-11" }}
                                    />
                                </div>
                            </div>
                            {/* Banner preview */}
                            <div
                                className="h-32 rounded-2xl relative overflow-hidden border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 flex items-center justify-center"
                                style={data.bannerImage ? { backgroundImage: `url(${data.bannerImage})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
                            >
                                {data.bannerImage ? (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                        <p className="text-white font-bold text-lg">{data.bannerTitle || page.label}</p>
                                    </div>
                                ) : (
                                    <span className="text-xs text-slate-400">Banner preview</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <Divider />

                    {/* Page content */}
                    <div>
                        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-4">Page Content</h4>
                        <p className="text-xs text-slate-400 mb-3">You can use HTML or plain paragraphs. This content is rendered on the public page.</p>
                        <Textarea
                            value={data.pageContent}
                            onValueChange={v => set("pageContent", v)}
                            placeholder="Enter full page content here…"
                            variant="bordered"
                            disableAutosize
                            rows={12}
                            classNames={{ input: "font-mono text-sm resize-y min-h-[250px]" }}
                        />
                        <p className="text-xs text-slate-400 mt-2">{data.pageContent.length.toLocaleString()} characters</p>
                    </div>

                    <Divider />

                    {/* SEO */}
                    <div>
                        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-4">SEO</h4>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Meta Title</label>
                                <Input
                                    value={data.metaTitle}
                                    onValueChange={v => set("metaTitle", v)}
                                    placeholder={`${page.label} – IndianRentals`}
                                    variant="bordered"
                                    classNames={{ inputWrapper: "h-11" }}
                                />
                                <p className="text-xs text-slate-400">{data.metaTitle.length}/60</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Meta Description</label>
                                <Textarea
                                    value={data.metaDescription}
                                    onValueChange={v => set("metaDescription", v)}
                                    placeholder="A short description for search engines."
                                    variant="bordered"
                                    disableAutosize
                                    rows={3}
                                    classNames={{ input: "resize-y min-h-[80px]" }}
                                />
                                <p className="text-xs text-slate-400">{data.metaDescription.length}/160</p>
                            </div>
                        </div>
                    </div>

                    <Divider />

                    {/* Publish toggle */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-slate-800 dark:text-slate-100">Publish Status</p>
                            <p className="text-xs text-slate-500">When disabled the page returns a draft notice.</p>
                        </div>
                        <Switch
                            isSelected={data.publishStatus === "published"}
                            onValueChange={v => set("publishStatus", v ? "published" : "draft")}
                            color="success"
                        />
                    </div>
                </CardBody>
            </Card>
        </motion.div>
    );
}

// ── Pages list ────────────────────────────────────────────────────────────────
export default function StaticPages() {
    const [selected, setSelected] = useState(null); // page key being edited
    const [statuses, setStatuses] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchStatuses = useCallback(async () => {
        try {
            setLoading(true);
            const token = getToken();
            const res = await fetch(`${API}/api/cms`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const list = await res.json();
                const map = {};
                list.forEach(p => { map[p.pageName] = p; });
                setStatuses(map);
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchStatuses(); }, [fetchStatuses]);

    const editingPage = PAGES.find(p => p.key === selected);

    return (
        <div className="w-full space-y-6 pb-12">
            {/* Header */}
            {!selected && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Static <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Pages</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Manage legal and informational pages. Click a page to edit its content.
                    </p>
                </motion.div>
            )}

            <AnimatePresence mode="wait">
                {selected && editingPage ? (
                    <PageEditor
                        key={selected}
                        page={editingPage}
                        onBack={() => { setSelected(null); fetchStatuses(); }}
                    />
                ) : (
                    <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        {loading ? (
                            <div className="flex items-center justify-center gap-3 py-24 text-slate-400">
                                <Spinner size="sm" color="secondary" /> Loading…
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {PAGES.map((page, i) => {
                                    const info = statuses[page.key];
                                    const status = info?.publishStatus || "published";
                                    const updated = info?.updatedAt
                                        ? new Date(info.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                                        : "Never edited";
                                    return (
                                        <motion.div
                                            key={page.key}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.06 }}
                                        >
                                            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400/50 transition-all duration-200 shadow-sm group cursor-pointer">
                                                <CardBody
                                                    className="p-5 flex flex-row items-center gap-4"
                                                    onClick={() => setSelected(page.key)}
                                                >
                                                    <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 shrink-0">
                                                        <FileText size={22} weight="duotone" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">{page.label}</p>
                                                        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
                                                            <LinkSimple size={10} weight="bold" />{page.slug}
                                                        </div>
                                                    </div>
                                                    <div className="text-xs text-slate-400 hidden md:block">{updated}</div>
                                                    <Chip
                                                        size="sm"
                                                        color={status === "published" ? "success" : "warning"}
                                                        variant="flat"
                                                    >
                                                        {status === "published" ? "Live" : "Draft"}
                                                    </Chip>
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        variant="light"
                                                        className="text-slate-400 group-hover:text-indigo-500"
                                                        onPress={() => setSelected(page.key)}
                                                    >
                                                        <PencilSimple size={16} />
                                                    </Button>
                                                </CardBody>
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
