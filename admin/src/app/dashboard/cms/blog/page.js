'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Chip, Spinner, Avatar } from "@heroui/react";
import {
    Plus, PencilSimple, Trash, FileText,
    Eye, Clock, ArrowLeft, Image as PhosphorImage,
    FloppyDisk, CheckCircle, Tag, Globe, Gear
} from "@phosphor-icons/react";
import dynamic from 'next/dynamic';
import Toggle from "@/components/Toggle";
import ImageUploader from "@/components/ImageUploader";

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });
const MDPreview = dynamic(() => import('@uiw/react-md-editor').then(m => m.default.Markdown), { ssr: false });

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const getToken = () => typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

const EMPTY_FORM = { title: "", excerpt: "", content: "", coverImage: "", images: [], author: "Admin", tags: "", status: "draft" };

// ── Shared native Field ────────────────────────────────────────────────────
const Field = ({ label, value, onChange, placeholder, rows, type = "text", className = "" }) => (
    <div className={`flex flex-col gap-1.5 ${className}`}>
        {label && <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>}
        {rows ? (
            <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
                className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all resize-none" />
        ) : (
            <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
                className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all" />
        )}
    </div>
);

// ── Page Config Editor ──────────────────────────────────────────────────────
function PageConfigEditor({ onBack }) {
    const [config, setConfig] = useState({ blogTitle: '', blogSubtitle: '', blogTabs: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await fetch(`${API}/api/cms/blog`);
                if (res.ok) {
                    const data = await res.json();
                    setConfig({
                        blogTitle: data.blogTitle || 'Latest News & Resources',
                        blogSubtitle: data.blogSubtitle || 'The latest industry news, interviews, technologies, and resources.',
                        blogTabs: (data.blogTabs || ['View all', 'Short term', 'Long term', 'Production on service', 'Next Tech', 'News']).join(', ')
                    });
                }
            } catch (e) {
                console.error("Failed to fetch CMS config", e);
            } finally {
                setLoading(false);
            }
        };
        fetchConfig();
    }, []);

    const handleSave = async () => {
        try {
            setSaving(true);
            const payload = {
                pageName: 'blog',
                blogTitle: config.blogTitle,
                blogSubtitle: config.blogSubtitle,
                blogTabs: config.blogTabs.split(',').map(t => t.trim()).filter(Boolean)
            };
            const res = await fetch(`${API}/api/cms/blog`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error("Failed to save config");
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (e) {
            alert(e.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex items-center justify-center p-12"><Spinner /></div>;

    return (
        <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                        <ArrowLeft size={18} />
                    </button>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                        Blog Page Configuration
                    </h2>
                </div>
                <div className="flex items-center gap-3">
                    {saved && (
                        <span className="flex items-center gap-1.5 text-emerald-600 text-sm font-semibold">
                            <CheckCircle size={14} weight="fill" /> Saved!
                        </span>
                    )}
                    <button 
                        onClick={handleSave} 
                        disabled={saving} 
                        className="flex items-center gap-2 h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 transition-all"
                    >
                        {saving ? <Spinner size="sm" color="white" /> : <FloppyDisk size={16} weight="bold" />} Save Config
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5 shadow-sm max-w-3xl">
                <Field label="Page Title" value={config.blogTitle} onChange={v => setConfig({...config, blogTitle: v})} placeholder="Latest News & Resources" />
                <Field label="Page Subtitle" value={config.blogSubtitle} onChange={v => setConfig({...config, blogSubtitle: v})} placeholder="The latest industry news..." rows={2} />
                <Field label="Filter Tabs (comma separated)" value={config.blogTabs} onChange={v => setConfig({...config, blogTabs: v})} placeholder="View all, Short term, Long term..." />
            </div>
        </motion.div>
    );
}


// ── Blog post editor ──────────────────────────────────────────────────────────
function PostEditor({ post, onBack, onSaved }) {
    const isNew = !post;
    const [form, setForm] = useState(
        isNew ? EMPTY_FORM : {
            title: post.title || "", excerpt: post.excerpt || "", content: post.content || "",
            coverImage: post.coverImage || "", images: post.images || [], author: post.author || "Admin",
            tags: (post.tags || []).join(", "), status: post.status || "draft",
        }
    );
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

    const handleSave = async () => {
        if (!form.title.trim()) return alert("Title is required");
        try {
            setSaving(true);
            const payload = { ...form, tags: form.tags.split(",").map(t => t.trim()).filter(Boolean) };
            const url = isNew ? `${API}/api/blog` : `${API}/api/blog/${post._id}`;
            const res = await fetch(url, {
                method: isNew ? "POST" : "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error((await res.json()).message || "Failed to save");
            setSaved(true);
            setTimeout(() => { setSaved(false); onSaved(); }, 1200);
        } catch (e) { alert(e.message); }
        finally { setSaving(false); }
    };

    return (
        <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="space-y-6">
            {/* Sub-header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                        <ArrowLeft size={18} />
                    </button>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                        {isNew ? "New Blog Post" : "Edit Post"}
                    </h2>
                </div>
                <div className="flex items-center gap-3">
                    {saved && (
                        <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-sm font-semibold bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-full px-3 py-1.5">
                            <CheckCircle size={12} weight="fill" /> Saved!
                        </span>
                    )}
                    <button onClick={() => set("status", form.status === "published" ? "draft" : "published")}
                        className={`h-9 px-4 rounded-xl border text-sm font-semibold transition-all ${form.status === "published" ? "border-amber-300 text-amber-600 bg-amber-50 hover:bg-amber-100 dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-400" : "border-emerald-300 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400"}`}>
                        {form.status === "published" ? "Switch to Draft" : "Publish"}
                    </button>
                    <button onClick={handleSave} disabled={saving}
                        className="flex items-center gap-1.5 h-9 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all">
                        {saving ? <Spinner size="sm" color="white" /> : <FloppyDisk size={14} weight="bold" />} Save
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main content */}
                <div className="lg:col-span-2 space-y-5">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5 shadow-sm">
                        <Field label="Post Title" value={form.title} onChange={v => set("title", v)}
                            placeholder="How to Choose the Right Camera for Rent" />
                        <Field label="Excerpt / Summary" value={form.excerpt} onChange={v => set("excerpt", v)}
                            placeholder="A short description shown in the post listing…" rows={2} />
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Content (Markdown)</label>
                            <div data-color-mode="light" className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 min-h-[400px]">
                                <MDEditor
                                    value={form.content}
                                    onChange={v => set("content", v || "")}
                                    height={400}
                                    preview="edit"
                                    style={{ borderRadius: '0.75rem' }}
                                />
                            </div>
                        </div>
                        <p className="text-xs text-slate-400">{(form.content || '').length.toLocaleString()} characters</p>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    {/* Publish status */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Publish</h4>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</span>
                            <Chip size="sm" color={form.status === "published" ? "success" : "warning"} variant="flat">
                                {form.status === "published" ? "Published" : "Draft"}
                            </Chip>
                        </div>
                        <div className="flex items-center gap-3">
                            <Toggle
                                isSelected={form.status === "published"}
                                onValueChange={v => set("status", v ? "published" : "draft")}
                                size="sm"
                            >
                                Publish publicly
                            </Toggle>
                        </div>
                    </div>

                    {/* Cover image */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Cover Image</h4>
                        <ImageUploader
                            multiple={false}
                            label="Cover Image"
                            existingUrl={form.coverImage}
                            onUpload={(url) => set("coverImage", url)}
                        />
                    </div>

                    {/* Blog Gallery Images */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Gallery / Content Images</h4>
                        <ImageUploader
                            multiple={true}
                            label="Gallery Images"
                            existingUrls={form.images}
                            onUploadMany={(urls) => set("images", urls)}
                        />
                    </div>

                    {/* Details */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Details</h4>
                        <Field label="Author" value={form.author} onChange={v => set("author", v)} placeholder="Admin" />
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tags (comma separated)</label>
                            <div className="relative">
                                <Tag size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                <input type="text" value={form.tags} onChange={e => set("tags", e.target.value)}
                                    placeholder="rental, cameras, guide"
                                    className="w-full h-10 pl-9 pr-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// ── Blog list view ────────────────────────────────────────────────────────────
export default function BlogManagement() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [deleting, setDeleting] = useState(null);

    const fetchPosts = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API}/api/blog`);
            if (res.ok) setPosts(await res.json());
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchPosts(); }, [fetchPosts]);

    const handleDelete = async (id) => {
        if (!confirm("Delete this blog post?")) return;
        try {
            setDeleting(id);
            const res = await fetch(`${API}/api/blog/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } });
            if (res.ok) await fetchPosts();
            else alert((await res.json()).message || "Failed to delete");
        } catch (e) { alert(e.message); }
        finally { setDeleting(null); }
    };

    const backToList = () => { setEditing(null); fetchPosts(); };
    const totalPublished = posts.filter(p => p.status === "published").length;
    const totalDraft = posts.filter(p => p.status === "draft").length;

    return (
        <div className="w-full space-y-6 pb-12">
            <AnimatePresence mode="wait">
                {editing === "config" ? (
                    <PageConfigEditor key="config" onBack={backToList} />
                ) : editing !== null ? (
                    <PostEditor key={editing === "new" ? "new" : editing._id}
                        post={editing === "new" ? null : editing} onBack={backToList} onSaved={backToList} />
                ) : (
                    <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                                    Blog <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Management</span>
                                </h1>
                                <p className="text-slate-600 dark:text-slate-400">Create, edit, and publish blog posts and industry news.</p>
                            </motion.div>
                            <div className="flex items-center gap-3">
                                <button onClick={() => setEditing("config")}
                                    className="flex items-center gap-2 h-10 px-5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm transition-all">
                                    <Gear weight="bold" size={15} /> Page Config
                                </button>
                                <button onClick={() => setEditing("new")}
                                    className="flex items-center gap-2 h-12 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 transition-all">
                                    <Plus weight="bold" size={18} /> Create Post
                                </button>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { label: "Total Posts", value: posts.length, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-500/10", icon: <FileText size={20} weight="duotone" /> },
                                { label: "Published", value: totalPublished, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10", icon: <Globe size={20} weight="duotone" /> },
                                { label: "Drafts", value: totalDraft, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10", icon: <PencilSimple size={20} weight="duotone" /> },
                            ].map(s => (
                                <div key={s.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-4 flex items-center gap-3">
                                    <div className={`p-2.5 rounded-xl ${s.bg} ${s.color}`}>{s.icon}</div>
                                    <div>
                                        <p className="text-2xl font-black text-slate-900 dark:text-white">{s.value}</p>
                                        <p className="text-xs text-slate-500">{s.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Post list */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                            <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-6 py-3 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Article Title</span>
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Author</span>
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Status</span>
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 hidden md:block">Date</span>
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Actions</span>
                            </div>

                            {loading ? (
                                <div className="flex items-center justify-center gap-3 py-16 text-slate-400">
                                    <Spinner size="sm" color="secondary" /> Loading posts…
                                </div>
                            ) : posts.length === 0 ? (
                                <div className="text-center py-16 text-slate-400">
                                    <FileText size={48} className="mx-auto mb-3 opacity-30" />
                                    <p className="text-sm">No blog posts yet.</p>
                                    <button onClick={() => setEditing("new")}
                                        className="mt-4 h-8 px-4 rounded-lg text-xs font-semibold text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all">
                                        Create your first post
                                    </button>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                    {posts.map((post, i) => (
                                        <motion.div key={post._id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                                            className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                                            <div className="flex items-center gap-3 min-w-0">
                                                {post.coverImage ? (
                                                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                                                        <img src={post.coverImage} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0">
                                                        <FileText size={18} className="text-indigo-400" />
                                                    </div>
                                                )}
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-200 group-hover:text-indigo-500 transition-colors truncate">{post.title}</p>
                                                    {post.excerpt && <p className="text-xs text-slate-400 line-clamp-1">{post.excerpt}</p>}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Avatar name={post.author?.charAt(0) || "A"} size="sm"
                                                    className="w-7 h-7 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 shrink-0" />
                                                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{post.author}</span>
                                            </div>
                                            <Chip size="sm" color={post.status === "published" ? "success" : "warning"} variant="flat">
                                                {post.status === "published" ? "Published" : "Draft"}
                                            </Chip>
                                            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400">
                                                <Clock size={12} />
                                                {new Date(post.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => setEditing(post)}
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all">
                                                    <PencilSimple size={15} />
                                                </button>
                                                <button onClick={() => handleDelete(post._id)} disabled={deleting === post._id}
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all disabled:opacity-40">
                                                    {deleting === post._id ? <Spinner size="sm" /> : <Trash size={15} />}
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
