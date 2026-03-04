'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
    Card, CardBody, Button, Input, Textarea,
    Chip, Spinner, Divider, Avatar
} from "@heroui/react";
import {
    Plus, PencilSimple, Trash, FileText,
    Eye, Clock, ArrowLeft, Image as PhosphorImage,
    FloppyDisk, CheckCircle, Tag, Globe
} from "@phosphor-icons/react";
import Toggle from "@/components/Toggle";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const getToken = () => typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

const EMPTY_FORM = {
    title: "", excerpt: "", content: "", coverImage: "",
    author: "Admin", tags: "", status: "draft",
};

// ── Blog post editor ──────────────────────────────────────────────────────────
function PostEditor({ post, onBack, onSaved }) {
    const isNew = !post;
    const [form, setForm] = useState(
        isNew ? EMPTY_FORM : {
            title: post.title || "",
            excerpt: post.excerpt || "",
            content: post.content || "",
            coverImage: post.coverImage || "",
            author: post.author || "Admin",
            tags: (post.tags || []).join(", "),
            status: post.status || "draft",
        }
    );
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

    const handleSave = async () => {
        if (!form.title.trim()) return alert("Title is required");
        try {
            setSaving(true);
            const payload = {
                ...form,
                tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
            };
            const url = isNew ? `${API}/api/blog` : `${API}/api/blog/${post._id}`;
            const method = isNew ? "POST" : "PUT";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error((await res.json()).message || "Failed to save");
            setSaved(true);
            setTimeout(() => { setSaved(false); onSaved(); }, 1200);
        } catch (e) {
            alert(e.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            className="space-y-6"
        >
            {/* Sub-header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button isIconOnly size="sm" variant="light" onPress={onBack} className="text-slate-500">
                        <ArrowLeft size={18} />
                    </Button>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                        {isNew ? "New Blog Post" : "Edit Post"}
                    </h2>
                </div>
                <div className="flex items-center gap-3">
                    {saved && (
                        <div className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-sm font-semibold bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-full px-3 py-1">
                            <CheckCircle size={12} weight="fill" /> Saved!
                        </div>
                    )}
                    <Button variant="flat" size="sm" className="font-semibold"
                        onPress={() => set("status", form.status === "published" ? "draft" : "published")}>
                        {form.status === "published" ? "Switch to Draft" : "Publish"}
                    </Button>
                    <button type="button" disabled={saving} onClick={handleSave}
                        className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all">
                        {saving ? (
                            <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
                        ) : (
                            <FloppyDisk size={14} weight="bold" />
                        )}
                        Save
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main content area */}
                <div className="lg:col-span-2 space-y-5">
                    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <CardBody className="p-6 space-y-5">
                            <Input
                                label="Post Title"
                                value={form.title}
                                onValueChange={v => set("title", v)}
                                placeholder="How to Choose the Right Camera for Rent"
                                variant="bordered"
                                labelPlacement="outside"
                                isRequired
                                classNames={{ input: "text-base font-semibold", label: "text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider" }}
                            />
                            <Textarea
                                label="Excerpt / Summary"
                                value={form.excerpt}
                                onValueChange={v => set("excerpt", v)}
                                placeholder="A short description shown in the post listing…"
                                variant="bordered"
                                labelPlacement="outside"
                                minRows={2}
                                classNames={{ label: "text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider" }}
                            />
                            <div>
                                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-2">
                                    Full Content
                                </label>
                                <Textarea
                                    value={form.content}
                                    onValueChange={v => set("content", v)}
                                    placeholder="Write your full blog post here. HTML is supported."
                                    variant="bordered"
                                    minRows={16}
                                    classNames={{ input: "font-mono text-sm" }}
                                />
                                <p className="text-xs text-slate-400 mt-1.5">{form.content.length.toLocaleString()} characters</p>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    {/* Status */}
                    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <CardBody className="p-5 space-y-4">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Publish</h4>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</span>
                                <Chip
                                    size="sm"
                                    color={form.status === "published" ? "success" : "warning"}
                                    variant="flat"
                                >
                                    {form.status === "published" ? "Published" : "Draft"}
                                </Chip>
                            </div>
                            <Toggle
                                isSelected={form.status === "published"}
                                onValueChange={v => set("status", v ? "published" : "draft")}
                                size="sm"
                            >
                                Publish publicly
                            </Toggle>
                        </CardBody>
                    </Card>

                    {/* Cover image */}
                    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <CardBody className="p-5 space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Cover Image</h4>
                            <div className="relative">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><PhosphorImage size={14} /></span>
                                <input
                                    type="url"
                                    value={form.coverImage}
                                    onChange={e => set("coverImage", e.target.value)}
                                    placeholder="https://res.cloudinary.com/..."
                                    className="w-full h-9 pl-8 pr-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                                />
                            </div>
                            {form.coverImage && (
                                <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                                    <img src={form.coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </CardBody>
                    </Card>

                    {/* Meta */}
                    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <CardBody className="p-5 space-y-4">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Details</h4>
                            <div>
                                <label className="text-xs text-slate-500 block mb-1.5">Author</label>
                                <input
                                    type="text"
                                    value={form.author}
                                    onChange={e => set("author", e.target.value)}
                                    placeholder="Admin"
                                    className="w-full h-9 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 block mb-1.5">Tags (comma separated)</label>
                                <div className="relative">
                                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><Tag size={13} /></span>
                                    <input
                                        type="text"
                                        value={form.tags}
                                        onChange={e => set("tags", e.target.value)}
                                        placeholder="rental, cameras, guide"
                                        className="w-full h-9 pl-8 pr-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                                    />
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
}

// ── Blog list view ────────────────────────────────────────────────────────────
export default function BlogManagement() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);  // null = list, 'new' = new, post obj = edit
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
            const res = await fetch(`${API}/api/blog/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${getToken()}` },
            });
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
                {editing !== null ? (
                    <PostEditor
                        key={editing === "new" ? "new" : editing._id}
                        post={editing === "new" ? null : editing}
                        onBack={backToList}
                        onSaved={backToList}
                    />
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
                            <button
                                type="button"
                                onClick={() => setEditing("new")}
                                className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all"
                            >
                                <Plus weight="bold" size={15} />
                                Create Post
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { label: "Total Posts", value: posts.length, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-500/10", icon: <FileText size={20} weight="duotone" /> },
                                { label: "Published", value: totalPublished, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10", icon: <Globe size={20} weight="duotone" /> },
                                { label: "Drafts", value: totalDraft, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10", icon: <PencilSimple size={20} weight="duotone" /> },
                            ].map(s => (
                                <Card key={s.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <CardBody className="flex flex-row items-center gap-3 p-4">
                                        <div className={`p-2.5 rounded-xl ${s.bg} ${s.color}`}>{s.icon}</div>
                                        <div>
                                            <p className="text-2xl font-black text-slate-900 dark:text-white">{s.value}</p>
                                            <p className="text-xs text-slate-500">{s.label}</p>
                                        </div>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>

                        {/* Post list */}
                        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            {/* Column headers */}
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
                                    <Button size="sm" variant="flat" className="mt-4 text-indigo-500" onPress={() => setEditing("new")}>
                                        Create your first post
                                    </Button>
                                </div>
                            ) : (
                                <CardBody className="p-0 divide-y divide-slate-100 dark:divide-slate-800/60">
                                    {posts.map((post, i) => (
                                        <motion.div
                                            key={post._id}
                                            initial={{ opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.04 }}
                                            className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group"
                                        >
                                            {/* Title */}
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
                                                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-200 group-hover:text-indigo-500 transition-colors truncate">
                                                        {post.title}
                                                    </p>
                                                    {post.excerpt && (
                                                        <p className="text-xs text-slate-400 line-clamp-1">{post.excerpt}</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Author */}
                                            <div className="flex items-center gap-2">
                                                <Avatar
                                                    name={post.author?.charAt(0) || "A"}
                                                    size="sm"
                                                    className="w-7 h-7 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 shrink-0"
                                                />
                                                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{post.author}</span>
                                            </div>

                                            {/* Status */}
                                            <Chip
                                                size="sm"
                                                color={post.status === "published" ? "success" : "warning"}
                                                variant="flat"
                                            >
                                                {post.status === "published" ? "Published" : "Draft"}
                                            </Chip>

                                            {/* Date */}
                                            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400">
                                                <Clock size={12} />
                                                {new Date(post.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    isIconOnly size="sm" variant="light"
                                                    className="text-slate-400 hover:text-indigo-500"
                                                    onPress={() => setEditing(post)}
                                                >
                                                    <PencilSimple size={15} />
                                                </Button>
                                                <Button
                                                    isIconOnly size="sm" variant="light"
                                                    className="text-slate-400 hover:text-red-500"
                                                    isLoading={deleting === post._id}
                                                    onPress={() => handleDelete(post._id)}
                                                >
                                                    <Trash size={15} />
                                                </Button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </CardBody>
                            )}
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
