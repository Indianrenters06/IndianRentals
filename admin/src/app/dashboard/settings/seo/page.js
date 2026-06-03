'use client';
import toast from 'react-hot-toast';
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardBody, Divider } from "@heroui/react";
import { Robot, FloppyDisk, CheckCircle, Sparkle, ArrowSquareOut, Info } from "@phosphor-icons/react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
// Public site origin — used only to build the preview links shown on this page.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://indianrenters.com";

export default function SeoSettings() {
    const [form, setForm] = useState({ robotsTxt: "", llmsTxt: "" });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const token = localStorage.getItem("adminToken");
                const res = await fetch(`${API}/api/settings`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const d = await res.json();
                    setForm({ robotsTxt: d.robotsTxt || "", llmsTxt: d.llmsTxt || "" });
                }
            } catch (err) {
                console.error("Failed to load SEO settings", err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API}/api/settings`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ robotsTxt: form.robotsTxt, llmsTxt: form.llmsTxt }),
            });
            if (!res.ok) throw new Error((await res.json()).message || "Failed to save");
            setSaved(true);
            toast.success("SEO settings saved");
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
                    SEO <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">&amp; Crawlers</span>
                </h1>
                <p className="text-slate-600 dark:text-slate-200">
                    Control how search engines and AI assistants crawl your site. These files are served live by the public site.
                </p>
            </motion.div>

            {/* robots.txt */}
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <CardBody className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-indigo-500 flex items-center gap-2">
                                <Robot size={14} weight="bold" /> robots.txt
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                                Tells search-engine &amp; AI crawlers what they may index. Served at the site root.
                            </p>
                        </div>
                        <a href={`${SITE_URL}/robots.txt`} target="_blank" rel="noreferrer"
                            className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 h-8 px-3 rounded-lg bg-indigo-50 dark:bg-indigo-500/10">
                            View live <ArrowSquareOut size={13} weight="bold" />
                        </a>
                    </div>

                    <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-400">
                        <Info size={16} weight="bold" className="shrink-0 mt-0.5" />
                        <p className="text-xs">
                            The default already <strong>allows AI/LLM bots</strong> (GPTBot, ClaudeBot, PerplexityBot, Google-Extended…) so your brand can appear in AI answers. Remove an <code>Allow</code> block to opt a bot out.
                        </p>
                    </div>

                    <textarea
                        value={form.robotsTxt}
                        onChange={e => set("robotsTxt", e.target.value)}
                        disabled={loading}
                        rows={16}
                        spellCheck={false}
                        placeholder="User-agent: *&#10;Allow: /"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-slate-100 font-mono resize-y focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
                    />
                </CardBody>
            </Card>

            {/* llms.txt */}
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <CardBody className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-indigo-500 flex items-center gap-2">
                                <Sparkle size={14} weight="bold" /> llms.txt
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                                A Markdown summary of your site for AI assistants (the emerging <code>llms.txt</code> standard). Helps LLMs understand and cite your brand.
                            </p>
                        </div>
                        <a href={`${SITE_URL}/llms.txt`} target="_blank" rel="noreferrer"
                            className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 h-8 px-3 rounded-lg bg-indigo-50 dark:bg-indigo-500/10">
                            View live <ArrowSquareOut size={13} weight="bold" />
                        </a>
                    </div>

                    <textarea
                        value={form.llmsTxt}
                        onChange={e => set("llmsTxt", e.target.value)}
                        disabled={loading}
                        rows={14}
                        spellCheck={false}
                        placeholder="# Your Brand&#10;&#10;> One-line summary of what you do."
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-slate-100 font-mono resize-y focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
                    />
                </CardBody>
            </Card>

            {/* Save */}
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving || loading}
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
                        <CheckCircle weight="bold" size={14} /> Saved
                    </div>
                )}
            </div>
        </div>
    );
}
