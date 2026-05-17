"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Spinner } from "@heroui/react";
import {
    Plus, Folder, FolderPlus, FolderOpen, Trash, PencilSimple,
    CaretDown, CaretRight, TreeStructure, Tag, Check, X, FloppyDisk,
    Warning, CheckCircle, XCircle, MagnifyingGlass
} from "@phosphor-icons/react";
import ImageUploader from "@/components/ImageUploader";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function getToken() {
    return typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
}

// ── Toast Notification ────────────────────────────────────────────────────────
function Toast({ toasts }) {
    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
            <AnimatePresence>
                {toasts.map((t) => (
                    <motion.div
                        key={t.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.22 }}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold text-white pointer-events-auto min-w-[260px] ${t.type === "success" ? "bg-emerald-600" : "bg-red-600"
                            }`}
                    >
                        {t.type === "success"
                            ? <CheckCircle size={18} weight="bold" />
                            : <XCircle size={18} weight="bold" />}
                        {t.message}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}

// ── Confirm Delete Modal ──────────────────────────────────────────────────────
function ConfirmDeleteModal({ isOpen, onClose, onConfirm, title, description, loading }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 10 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        className="relative z-10 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-7 max-w-sm w-full"
                    >
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
                                <Warning size={32} weight="duotone" className="text-red-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">{title}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
                            </div>
                            <div className="flex gap-3 w-full pt-1">
                                <button
                                    onClick={onClose}
                                    disabled={loading}
                                    className="flex-1 h-11 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:!bg-slate-50 dark:hover:!bg-slate-800 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onConfirm}
                                    disabled={loading}
                                    className="flex-1 h-11 rounded-2xl !bg-red-600 hover:!bg-red-700 text-white text-sm font-bold shadow-lg shadow-red-500/25 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading ? <Spinner size="sm" color="white" /> : <Trash size={15} weight="bold" />}
                                    {loading ? "Deleting…" : "Delete"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}



// ── Category Row ──────────────────────────────────────────────────────────────
function CatRow({ cat, onDelete, onRefresh, addToast }) {
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
            addToast("Category updated successfully!", "success");
            onRefresh();
            setEditing(false);
        } catch (e) {
            addToast(e.message, "error");
        } finally {
            setSaving(false);
        }
    };

    const subCount = cat.subcategories?.length || 0;

    return (
        <div className="border-b border-slate-100 dark:border-slate-800/60 last:border-b-0">
            {/* Main row */}
            <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">

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



                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-full shrink-0">
                    {subCount} sub{subCount !== 1 ? "s" : ""}
                </span>

                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${cat.isActive ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                    {cat.isActive ? "Active" : "Off"}
                </span>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                        onClick={editing ? cancelEdit : openEdit}
                        className={`p-1.5 rounded-lg transition-colors ${editing ? "text-slate-400 hover:!bg-slate-100 dark:hover:!bg-slate-700" : "text-slate-400 hover:text-indigo-500 hover:!bg-indigo-50 dark:hover:!bg-indigo-500/10" }`}
                    >
                        {editing ? <X size={14} /> : <PencilSimple size={14} weight="bold" />}
                    </button>
                    <button onClick={() => onDelete(cat)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
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
                                            className="flex items-center gap-2 h-12 px-8 rounded-xl !bg-indigo-600 hover:!bg-indigo-700 text-white text-sm font-bold disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/30"
                                        >
                                            {saving ? <Spinner size="sm" color="white" /> : <Check size={16} weight="bold" />}
                                            {saving ? "Saving…" : "Save Changes"}
                                        </button>
                                        <button
                                            onClick={cancelEdit}
                                            className="h-12 px-6 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-500 hover:!bg-slate-100 dark:hover:!bg-slate-800 transition-colors"
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


        </div>
    );
}

// ── Inline Add Category Row ──────────────────────────────────────────────────
function AddCatRow({ onDone, onCancel, addToast }) {
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
            addToast("Category created successfully!", "success");
            onDone();
        } catch (e) {
            addToast(e.message, "error");
            setSaving(false);
        }
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
                    className="h-10 px-5 rounded-xl !bg-indigo-600 hover:!bg-indigo-700 text-white text-sm font-bold disabled:opacity-50 transition-colors flex items-center gap-2 shrink-0 shadow-lg shadow-indigo-500/20"
                >
                    {saving ? <Spinner size="sm" color="white" /> : <Check size={15} weight="bold" />}
                    {saving ? "Saving…" : "Save"}
                </button>
                <button onClick={onCancel} className="h-10 px-3 rounded-xl text-slate-500 hover:!bg-slate-100 dark:hover:!bg-slate-700 transition-colors shrink-0">
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

    // Confirm modal state
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null); // { id, name, type: 'category' | 'subcategory' }
    const [deleting, setDeleting] = useState(false);

    // Toast state
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = "success") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
    }, []);

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

    const askDeleteCategory = (cat) => {
        setDeleteTarget({ id: cat._id, name: cat.name, type: 'category' });
        setConfirmOpen(true);
    };



    const confirmDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            const res = await fetch(`${API}/api/categories/${deleteTarget.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (!res.ok) throw new Error((await res.json()).message || "Failed to delete");
            addToast(`"${deleteTarget.name}" deleted successfully!`);
            setConfirmOpen(false);
            setDeleteTarget(null);
            fetchCategories();
        } catch (err) {
            addToast(err.message, "error");
        } finally {
            setDeleting(false);
        }
    };

    const filtered = search.trim()
        ? categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
        : categories;

    const totalSubs = categories.reduce((a, c) => a + (c.subcategories?.length || 0), 0);
    const activeCount = categories.filter(c => c.isActive).length;

    if (!mounted) return null;

    return (
        <div className="w-full space-y-5 pb-12">
            {/* Toast Notifications */}
            <Toast toasts={toasts} />

            {/* Confirm Delete Modal */}
            <ConfirmDeleteModal
                isOpen={confirmOpen}
                onClose={() => { if (!deleting) { setConfirmOpen(false); setDeleteTarget(null); } }}
                onConfirm={confirmDelete}
                title={deleteTarget?.type === 'category' ? "Delete Category?" : "Delete Subcategory?"}
                description={deleteTarget?.type === 'category'
                    ? `"${deleteTarget?.name}" and ALL its subcategories will be permanently removed.`
                    : `"${deleteTarget?.name}" will be permanently removed. This cannot be undone.`}
                loading={deleting}
            />

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
                        Click <span className="font-semibold text-indigo-500">+ Add Category</span> to add a main category.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none z-10">
                            <MagnifyingGlass className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
                        </div>
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search categories…"
                            className="h-10 pl-10 pr-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all w-52 dark:text-white"
                        />
                    </div>
                    <button
                        onClick={() => { setAddingCat(true); setSearch(""); }}
                        className="inline-flex items-center gap-2 h-12 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 transition-all"
                    >
                        <FolderPlus size={18} weight="bold" /> Add Category
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
                            addToast={addToast}
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
                                onDelete={askDeleteCategory}
                                onRefresh={fetchCategories}
                                addToast={addToast}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
