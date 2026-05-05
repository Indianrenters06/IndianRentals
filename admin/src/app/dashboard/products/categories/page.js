"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Spinner } from "@heroui/react";
import {
    Plus, Folder, FolderPlus, FolderOpen, Trash, PencilSimple,
    CaretDown, CaretRight, TreeStructure, Tag, Check, X, FloppyDisk,
} from "@phosphor-icons/react";
import ImageUploader from "@/components/ImageUploader";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function getToken() {
    return typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
}

// ── Subcategory row ───────────────────────────────────────────────────────────
function SubRow({ sub, onDelete, onSave }) {
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(sub.name);
    const [saving, setSaving] = useState(false);

    const save = async () => {
        if (!name.trim()) return;
        setSaving(true);
        try {
            const res = await fetch(`${API}/api/categories/${sub._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify({ name }),
            });
            if (!res.ok) throw new Error((await res.json()).message || "Failed");
            onSave();
            setEditing(false);
        } catch (e) { alert(e.message); }
        finally { setSaving(false); }
    };

    return (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800/60 pl-14 group">
            <Tag size={13} weight="fill" className="text-indigo-400 shrink-0" />
            {sub.image && (
                <img src={sub.image} alt={sub.name} className="w-8 h-8 rounded-lg object-contain bg-white border border-slate-200 p-0.5 shrink-0" />
            )}
            {editing ? (
                <input
                    autoFocus
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") save(); if (e.key === "Escape") setEditing(false); }}
                    className="flex-1 h-8 px-2 rounded-lg border border-indigo-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:bg-slate-900 dark:text-white"
                />
            ) : (
                <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{sub.name}</span>
                    {sub.slug && <span className="ml-2 text-xs font-mono text-slate-400">/{sub.slug}</span>}
                </div>
            )}
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${sub.isActive ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                {sub.isActive ? "Active" : "Off"}
            </span>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {editing ? (
                    <>
                        <button onClick={save} disabled={saving} className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors">
                            {saving ? <Spinner size="sm" /> : <Check size={14} weight="bold" />}
                        </button>
                        <button onClick={() => setEditing(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                            <X size={14} weight="bold" />
                        </button>
                    </>
                ) : (
                    <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors">
                        <PencilSimple size={14} weight="bold" />
                    </button>
                )}
                <button onClick={() => onDelete(sub._id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                    <Trash size={14} weight="bold" />
                </button>
            </div>
        </div>
    );
}

// ── Inline Add Subcategory Row ───────────────────────────────────────────────
function AddSubRow({ parentId, onDone, onCancel }) {
    const [name, setName] = useState("");
    const [saving, setSaving] = useState(false);

    const save = async () => {
        if (!name.trim()) return;
        setSaving(true);
        try {
            const res = await fetch(`${API}/api/categories/${parentId}/subcategories`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify({ name }),
            });
            if (!res.ok) throw new Error((await res.json()).message || "Failed");
            onDone();
        } catch (e) { alert(e.message); setSaving(false); }
    };

    return (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-indigo-50/50 dark:bg-indigo-500/5 border-t border-indigo-100 dark:border-indigo-500/20 pl-14">
            <Tag size={13} weight="fill" className="text-indigo-300 shrink-0" />
            <input
                autoFocus
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") save(); if (e.key === "Escape") onCancel(); }}
                placeholder="Subcategory name…"
                className="flex-1 h-8 px-3 rounded-lg border border-indigo-300 dark:border-indigo-500/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 bg-white dark:bg-slate-900 dark:text-white placeholder:text-slate-400"
            />
            <button onClick={save} disabled={saving || !name.trim()}
                className="h-8 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold disabled:opacity-50 transition-colors flex items-center gap-1.5">
                {saving ? <Spinner size="sm" color="white" /> : <Check size={14} weight="bold" />} Add
            </button>
            <button onClick={onCancel} className="h-8 px-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <X size={14} />
            </button>
        </div>
    );
}

// ── Category Row ──────────────────────────────────────────────────────────────
function CatRow({ cat, onDelete, onRefresh }) {
    const [expanded, setExpanded] = useState(false);
    const [addingSub, setAddingSub] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editName, setEditName] = useState(cat.name);
    const [editImage, setEditImage] = useState(cat.image || "");
    const [saving, setSaving] = useState(false);

    const openEdit = () => {
        setEditName(cat.name);
        setEditImage(cat.image || "");
        setEditing(true);
    };

    const cancelEdit = () => {
        setEditing(false);
        setEditName(cat.name);
        setEditImage(cat.image || "");
    };

    const saveEdit = async () => {
        if (!editName.trim()) return;
        setSaving(true);
        try {
            const res = await fetch(`${API}/api/categories/${cat._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify({ name: editName, image: editImage }),
            });
            if (!res.ok) throw new Error((await res.json()).message || "Failed");
            onRefresh();
            setEditing(false);
        } catch (e) { alert(e.message); }
        finally { setSaving(false); }
    };

    const subCount = cat.subcategories?.length || 0;

    return (
        <div className="border-b border-slate-100 dark:border-slate-800/60 last:border-b-0">
            {/* Main row */}
            <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                <button onClick={() => setExpanded(v => !v)}
                    className="p-1 rounded text-slate-400 hover:text-indigo-500 transition-colors shrink-0">
                    {expanded ? <CaretDown size={13} weight="bold" /> : <CaretRight size={13} weight="bold" />}
                </button>

                {/* Category image preview */}
                {(editing ? editImage : cat.image) ? (
                    <img
                        src={editing ? editImage : cat.image}
                        alt={cat.name}
                        className="w-10 h-10 rounded-xl object-contain bg-white border border-slate-200 p-0.5 shrink-0"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0">
                        <Folder size={18} className="text-indigo-400" weight="duotone" />
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">{cat.name}</span>
                    {cat.slug && <span className="ml-2 text-xs font-mono text-slate-400">/{cat.slug}</span>}
                    {cat.description && <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">{cat.description}</p>}
                </div>

                <button onClick={() => { setExpanded(true); setAddingSub(true); }}
                    className="hidden group-hover:flex items-center gap-1 h-7 px-2.5 text-xs font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg hover:bg-indigo-100 transition-colors shrink-0">
                    <Plus size={11} weight="bold" /> Sub
                </button>

                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-full shrink-0">
                    {subCount} sub{subCount !== 1 ? "s" : ""}
                </span>

                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${cat.isActive ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                    {cat.isActive ? "Active" : "Off"}
                </span>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                        onClick={editing ? cancelEdit : openEdit}
                        className={`p-1.5 rounded-lg transition-colors ${
                            editing
                                ? "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                                : "text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
                        }`}
                    >
                        {editing ? <X size={14} /> : <PencilSimple size={14} weight="bold" />}
                    </button>
                    <button onClick={() => onDelete(cat._id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                        <Trash size={14} weight="bold" />
                    </button>
                </div>
            </div>

            {/* ── Edit Panel ─────────────────────────────────────────────────── */}
            <AnimatePresence>
                {editing && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="mx-5 mb-4 mt-1 p-5 rounded-2xl border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50/40 dark:bg-indigo-500/5">
                            <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-4">Edit Category — {cat.name}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Left: name field */}
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Name</label>
                                        <input
                                            autoFocus
                                            value={editName}
                                            onChange={e => setEditName(e.target.value)}
                                            onKeyDown={e => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") cancelEdit(); }}
                                            className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold bg-white dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                                        />
                                    </div>
                                    {editImage && (
                                        <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                                            <img src={editImage} alt="preview" className="w-14 h-14 rounded-lg object-contain" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Current Image</p>
                                                <button
                                                    onClick={() => setEditImage("")}
                                                    className="text-xs text-red-500 hover:text-red-700 font-semibold"
                                                >
                                                    Remove image
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex gap-2 pt-1">
                                        <button
                                            onClick={saveEdit}
                                            disabled={saving || !editName.trim()}
                                            className="flex items-center gap-2 h-9 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold disabled:opacity-50 transition-colors shadow-md shadow-indigo-500/20"
                                        >
                                            {saving ? <Spinner size="sm" color="white" /> : <Check size={14} weight="bold" />}
                                            {saving ? "Saving…" : "Save Changes"}
                                        </button>
                                        <button
                                            onClick={cancelEdit}
                                            className="h-9 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                                {/* Right: image uploader */}
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Category Image</label>
                                    <ImageUploader
                                        key={`edit-${cat._id}-${editing}`}
                                        existingUrl={editImage}
                                        onUpload={url => setEditImage(url)}
                                        label="Upload new image"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Subcategories */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.18, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        {cat.subcategories?.map(sub => (
                            <SubRow
                                key={sub._id}
                                sub={sub}
                                onDelete={async (id) => {
                                    if (!confirm("Delete this subcategory?")) return;
                                    const res = await fetch(`${API}/api/categories/${id}`, {
                                        method: "DELETE",
                                        headers: { Authorization: `Bearer ${getToken()}` },
                                    });
                                    if (res.ok) onRefresh();
                                    else alert((await res.json()).message || "Failed");
                                }}
                                onSave={onRefresh}
                            />
                        ))}
                        {addingSub && (
                            <AddSubRow
                                parentId={cat._id}
                                onDone={() => { setAddingSub(false); onRefresh(); }}
                                onCancel={() => setAddingSub(false)}
                            />
                        )}
                        {!addingSub && (
                            <div className="pl-14 py-2 border-t border-slate-100 dark:border-slate-800/60">
                                <button
                                    onClick={() => setAddingSub(true)}
                                    className="flex items-center gap-1.5 text-xs text-indigo-500 hover:text-indigo-700 font-semibold transition-colors"
                                >
                                    <Plus size={12} weight="bold" /> Add Subcategory
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ── Inline Add Category Row ──────────────────────────────────────────────────
function AddCatRow({ onDone, onCancel }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [saving, setSaving] = useState(false);

    const save = async () => {
        if (!name.trim()) return;
        setSaving(true);
        try {
            const res = await fetch(`${API}/api/categories`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify({ name, description }),
            });
            if (!res.ok) throw new Error((await res.json()).message || "Failed");
            onDone();
        } catch (e) { alert(e.message); setSaving(false); }
    };

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
        >
            <div className="flex items-center gap-3 px-5 py-3.5 bg-indigo-50/60 dark:bg-indigo-500/10 border-b border-indigo-100 dark:border-indigo-500/20">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center shrink-0">
                    <FolderPlus size={18} className="text-indigo-500" weight="duotone" />
                </div>
                <input
                    autoFocus
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") save(); if (e.key === "Escape") onCancel(); }}
                    placeholder="Category name (required)…"
                    className="flex-1 h-10 px-4 rounded-xl border border-indigo-300 dark:border-indigo-500/50 text-sm font-semibold bg-white dark:bg-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                />
                <input
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Description (optional)…"
                    className="w-52 h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all hidden md:block"
                />
                <button
                    onClick={save}
                    disabled={saving || !name.trim()}
                    className="h-10 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold disabled:opacity-50 transition-colors flex items-center gap-2 shrink-0 shadow-lg shadow-indigo-500/20"
                >
                    {saving ? <Spinner size="sm" color="white" /> : <Check size={15} weight="bold" />}
                    {saving ? "Saving…" : "Save"}
                </button>
                <button onClick={onCancel} className="h-10 px-3 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shrink-0">
                    <X size={16} />
                </button>
            </div>
        </motion.div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [addingCat, setAddingCat] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API}/api/categories/admin`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (res.ok) {
                const data = await res.json();
                setCategories(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchCategories(); }, [fetchCategories]);

    const handleDelete = async (id) => {
        if (!confirm("Delete this category and ALL its subcategories?")) return;
        const res = await fetch(`${API}/api/categories/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (res.ok) fetchCategories();
        else alert((await res.json()).message || "Failed");
    };

    const filtered = search.trim()
        ? categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
        : categories;

    const totalSubs = categories.reduce((a, c) => a + (c.subcategories?.length || 0), 0);
    const activeCount = categories.filter(c => c.isActive).length;

    if (!mounted) return null;

    return (
        <div className="w-full space-y-5 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Category{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
                            Management
                        </span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        Click <span className="font-semibold text-indigo-500">+ Add Category</span> to add inline. Click the row to expand subcategories.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search categories…"
                        className="h-10 px-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all w-52 dark:text-white"
                    />
                    <button
                        onClick={() => { setAddingCat(true); setSearch(""); }}
                        className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all"
                    >
                        <FolderPlus size={16} /> Add Category
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "Total Categories", value: categories.length, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-500/10" },
                    { label: "Subcategories", value: totalSubs, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10" },
                    { label: "Active", value: activeCount, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
                ].map(s => (
                    <div key={s.label} className={`rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex items-center gap-3 bg-white dark:bg-slate-900 shadow-sm`}>
                        <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                        <p className="text-xs text-slate-500 font-medium">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                {/* Table header */}
                <div className="flex items-center px-5 py-3 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 gap-3">
                    <span className="w-6" />
                    <span className="w-10" />
                    <span className="flex-1 text-xs font-semibold uppercase tracking-wider text-slate-500">Category</span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 w-24 text-center">Subcats</span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 w-16 text-center">Status</span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 w-20 text-center">Actions</span>
                </div>

                {/* Inline Add Row */}
                <AnimatePresence>
                    {addingCat && (
                        <AddCatRow
                            onDone={() => { setAddingCat(false); fetchCategories(); }}
                            onCancel={() => setAddingCat(false)}
                        />
                    )}
                </AnimatePresence>

                {/* Content */}
                {loading ? (
                    <div className="flex items-center justify-center gap-2 py-16 text-slate-400">
                        <Spinner size="sm" color="secondary" /> Loading categories…
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16 text-slate-400">
                        <Folder size={40} className="mx-auto mb-3 opacity-30" weight="duotone" />
                        <p>{search ? "No categories match your search." : "No categories yet. Click \"Add Category\" to get started."}</p>
                    </div>
                ) : (
                    <div>
                        {filtered.map(cat => (
                            <CatRow
                                key={cat._id}
                                cat={cat}
                                onDelete={handleDelete}
                                onRefresh={fetchCategories}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
