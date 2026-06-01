"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Spinner, Button, Pagination } from "@heroui/react";
import {
    Plus, Tag, Trash, PencilSimple, Warning, CheckCircle, XCircle, Check, X,
    CaretUp, CaretDown
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
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold text-white pointer-events-auto min-w-[260px] ${
                            t.type === "success" ? "bg-emerald-600" : "bg-red-600"
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
                                <p className="text-sm text-slate-500 dark:text-slate-200">{description}</p>
                            </div>
                            <div className="flex gap-3 w-full pt-1">
                                <Button
                                    variant="bordered"
                                    onPress={onClose}
                                    isDisabled={loading}
                                    className="flex-1 h-11 rounded-2xl font-semibold border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    color="danger"
                                    variant="shadow"
                                    onPress={onConfirm}
                                    isLoading={loading}
                                    className="flex-1 h-11 rounded-2xl font-bold shadow-lg shadow-red-500/25"
                                >
                                    {loading ? "Deleting…" : "Delete"}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

// ── Inline Add Subcategory Row ───────────────────────────────────────────────
function AddSubRow({ parentId, onDone, onCancel, addToast }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [saving, setSaving] = useState(false);

    const save = async () => {
        if (!name.trim()) return;
        setSaving(true);
        try {
            const res = await fetch(`${API}/api/categories/${parentId}/subcategories`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify({ name, description }),
            });
            if (!res.ok) throw new Error((await res.json()).message || "Failed");
            addToast("Subcategory created successfully!", "success");
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
                    <Tag size={18} className="text-indigo-500" weight="duotone" />
                </div>
                <input
                    autoFocus
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") save(); if (e.key === "Escape") onCancel(); }}
                    placeholder="Subcategory name (required)…"
                    className="flex-1 h-10 px-4 rounded-xl border border-indigo-300 dark:border-indigo-500/50 text-base font-semibold bg-white dark:bg-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                />
                <input
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Description (optional)…"
                    className="w-52 h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-base bg-white dark:bg-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all hidden md:block"
                />
                <Button
                    color="primary"
                    variant="shadow"
                    onPress={save}
                    isDisabled={saving || !name.trim()}
                    isLoading={saving}
                    className="h-10 px-6 rounded-xl font-bold shadow-lg shadow-indigo-500/20"
                >
                    Save
                </Button>
                <Button isIconOnly variant="light" onPress={onCancel} className="text-slate-500">
                    <X size={16} />
                </Button>
            </div>
        </motion.div>
    );
}

// ── Subcategory Row ───────────────────────────────────────────────────────────
function SubRow({ sub, onDelete, onRefresh, addToast }) {
    const [editing, setEditing] = useState(false);
    const [editName, setEditName] = useState(sub.name);
    const [editDescription, setEditDescription] = useState(sub.description || "");
    const [editImage, setEditImage] = useState(sub.image || "");
    const [saving, setSaving] = useState(false);

    const openEdit = () => {
        setEditName(sub.name);
        setEditDescription(sub.description || "");
        setEditImage(sub.image || "");
        setEditing(true);
    };

    const cancelEdit = () => {
        setEditing(false);
        setEditName(sub.name);
        setEditDescription(sub.description || "");
        setEditImage(sub.image || "");
    };

    const saveEdit = async () => {
        if (!editName.trim()) return;
        setSaving(true);
        try {
            const res = await fetch(`${API}/api/categories/${sub._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify({ name: editName, description: editDescription, image: editImage }),
            });
            if (!res.ok) throw new Error((await res.json()).message || "Failed");
            addToast("Subcategory updated successfully!", "success");
            onRefresh();
            setEditing(false);
        } catch (e) { 
            addToast(e.message, "error"); 
        } finally { 
            setSaving(false); 
        }
    };

    return (
        <div className="border-b border-slate-100 dark:border-slate-800/60 last:border-b-0">
            {/* Main row */}
            <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                {(editing ? editImage : sub.image) ? (
                    <img
                        src={editing ? editImage : sub.image}
                        alt={sub.name}
                        className="w-10 h-10 rounded-xl object-contain bg-white border border-slate-200 p-0.5 shrink-0"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0">
                        <Tag size={18} className="text-indigo-400" weight="duotone" />
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">{sub.name}</span>
                    {sub.slug && <span className="ml-2 text-xs font-mono text-slate-400">/{sub.slug}</span>}
                    {sub.description && <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">{sub.description}</p>}
                </div>

                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${sub.isActive ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                    {sub.isActive ? "Active" : "Off"}
                </span>

                <div className="flex items-center gap-1 shrink-0">
                    <Button
                        isIconOnly
                        variant="light"
                        size="sm"
                        onPress={editing ? cancelEdit : openEdit}
                        className={editing ? "text-slate-400" : "text-slate-400 hover:text-indigo-500"}
                    >
                        {editing ? <X size={14} /> : <PencilSimple size={14} weight="bold" />}
                    </Button>
                    <Button isIconOnly variant="light" size="sm" className="text-slate-400 hover:text-red-500" onPress={() => onDelete(sub)}>
                        <Trash size={14} weight="bold" />
                    </Button>
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
                            <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-4">Edit Subcategory — {sub.name}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Left: name & description field */}
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Name</label>
                                        <input
                                            autoFocus
                                            value={editName}
                                            onChange={e => setEditName(e.target.value)}
                                            onKeyDown={e => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") cancelEdit(); }}
                                            className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-base font-semibold bg-white dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Description</label>
                                        <input
                                            value={editDescription}
                                            onChange={e => setEditDescription(e.target.value)}
                                            onKeyDown={e => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") cancelEdit(); }}
                                            className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-base font-semibold bg-white dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
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
                                        <Button
                                            color="primary"
                                            variant="shadow"
                                            onPress={saveEdit}
                                            isDisabled={saving || !editName.trim()}
                                            isLoading={saving}
                                            className="h-9 px-4 rounded-xl font-bold shadow-md shadow-indigo-500/20"
                                        >
                                            Save Changes
                                        </Button>
                                        <Button variant="bordered" onPress={cancelEdit} className="h-9 px-4 rounded-xl">
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                                {/* Right: image uploader */}
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Subcategory Image</label>
                                    <ImageUploader
                                        key={`edit-${sub._id}-${editing}`}
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

// ── Main Component ────────────────────────────────────────────────────────────
export default function SubcategoriesManagement() {
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedParent, setSelectedParent] = useState("");
    const [addingSub, setAddingSub] = useState(false);

    // Sorting & pagination
    const [sortKey, setSortKey] = useState("name"); // 'name' | 'status'
    const [sortDir, setSortDir] = useState("asc");   // 'asc' | 'desc'
    const [page, setPage] = useState(1);
    const rowsPerPage = 8;

    const toggleSort = (key) => {
        if (sortKey === key) {
            setSortDir(d => (d === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(key);
            setSortDir("asc");
        }
        setPage(1);
    };

    // Confirm modal state
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null); // { id, name }
    const [deleting, setDeleting] = useState(false);

    // Toast state
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = "success") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${API}/api/categories/admin`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (res.ok) {
                const data = await res.json();
                const cats = Array.isArray(data) ? data : data.categories || [];
                setCategories(cats);
                if (cats.length > 0 && !selectedParent) {
                    setSelectedParent(cats[0]._id);
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchSubcategories = async (parentId) => {
        if (!parentId) return;
        try {
            setLoading(true);
            const res = await fetch(`${API}/api/categories/${parentId}/subcategories`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (res.ok) {
                const data = await res.json();
                setSubcategories(Array.isArray(data) ? data : data.subcategories || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCategories(); }, []);
    useEffect(() => { if (selectedParent) fetchSubcategories(selectedParent); }, [selectedParent]);

    // Reset to first page whenever the parent changes or a new list loads
    useEffect(() => { setPage(1); }, [selectedParent]);

    // ── Sorting & pagination ──────────────────────────────────────────────────
    const sorted = useMemo(() => {
        const list = [...subcategories];
        const dir = sortDir === "asc" ? 1 : -1;
        list.sort((a, b) => {
            let cmp = 0;
            if (sortKey === "name") {
                cmp = (a.name || "").localeCompare(b.name || "");
            } else if (sortKey === "status") {
                cmp = (a.isActive ? 1 : 0) - (b.isActive ? 1 : 0);
            }
            return cmp * dir;
        });
        return list;
    }, [subcategories, sortKey, sortDir]);

    const totalPages = Math.max(1, Math.ceil(sorted.length / rowsPerPage));
    useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);

    const paginated = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        return sorted.slice(start, start + rowsPerPage);
    }, [sorted, page]);

    const SortHeader = ({ label, sortKey: key, className }) => (
        <button
            type="button"
            onClick={() => toggleSort(key)}
            className={`flex items-center justify-center gap-1 text-xs font-semibold uppercase tracking-wider transition-colors ${sortKey === key ? "text-indigo-500" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"} ${className || ""}`}
        >
            {label}
            {sortKey === key
                ? (sortDir === "asc" ? <CaretUp size={11} weight="bold" /> : <CaretDown size={11} weight="bold" />)
                : <CaretDown size={11} className="opacity-30" />}
        </button>
    );

    // ── Delete flow ───────────────────────────────────────────────────────────
    const askDelete = (sub) => {
        setDeleteTarget({ id: sub._id, name: sub.name });
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
            fetchSubcategories(selectedParent);
        } catch (err) {
            addToast(err.message, "error");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="w-full space-y-6 pb-12">
            {/* Toast Notifications */}
            <Toast toasts={toasts} />

            {/* Confirm Delete Modal */}
            <ConfirmDeleteModal
                isOpen={confirmOpen}
                onClose={() => { if (!deleting) { setConfirmOpen(false); setDeleteTarget(null); } }}
                onConfirm={confirmDelete}
                title="Delete Subcategory?"
                description={`"${deleteTarget?.name}" will be permanently removed. This cannot be undone.`}
                loading={deleting}
            />

            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Subcategory{" "}
                        <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">
                            Management
                        </span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-200">Drill down your catalogue into specific sub-groups.</p>
                </motion.div>

                <Button
                    color="primary"
                    variant="shadow"
                    className="h-12 px-8 rounded-xl font-bold !bg-indigo-600 hover:!bg-indigo-700 text-white shadow-lg shadow-indigo-500/30 transition-all"
                    onPress={() => {
                        if (!selectedParent) {
                            addToast("Please select a parent category first.", "error");
                            return;
                        }
                        setAddingSub(true);
                    }}
                    startContent={<Plus weight="bold" size={18} />}
                >
                    Add Subcategory
                </Button>
            </div>

            {/* Filter by parent */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Filter by Parent:</span>
                <div className="relative max-w-xs w-full">
                    <select
                        value={selectedParent}
                        onChange={e => {
                            setSelectedParent(e.target.value);
                            setAddingSub(false);
                        }}
                        className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all appearance-none cursor-pointer"
                    >
                        <option value="" disabled>Select parent category...</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">▾</span>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                {/* Table header */}
                <div className="flex items-center px-5 py-3 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 gap-3">
                    <span className="w-10" />
                    <div className="flex-1">
                        <SortHeader label="Subcategory" sortKey="name" />
                    </div>
                    <SortHeader label="Status" sortKey="status" className="w-16" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 w-20 text-center">Actions</span>
                </div>

                {/* Inline Add Row */}
                <AnimatePresence>
                    {addingSub && selectedParent && (
                        <AddSubRow
                            parentId={selectedParent}
                            onDone={() => { setAddingSub(false); fetchSubcategories(selectedParent); }}
                            onCancel={() => setAddingSub(false)}
                            addToast={addToast}
                        />
                    )}
                </AnimatePresence>

                {/* Content */}
                {loading ? (
                    <div className="flex items-center justify-center gap-2 py-16 text-slate-400">
                        <Spinner size="sm" color="secondary" /> Loading subcategories…
                    </div>
                ) : !selectedParent ? (
                    <div className="text-center py-16 text-slate-400">
                        <Tag size={40} className="mx-auto mb-3 opacity-30" weight="duotone" />
                        <p>Please select a parent category to view subcategories.</p>
                    </div>
                ) : subcategories.length === 0 ? (
                    <div className="text-center py-16 text-slate-400">
                        <Tag size={40} className="mx-auto mb-3 opacity-30" weight="duotone" />
                        <p>No subcategories yet. Click "Add Subcategory" to get started.</p>
                    </div>
                ) : (
                    <>
                        <div>
                            {paginated.map(sub => (
                                <SubRow
                                    key={sub._id}
                                    sub={sub}
                                    onDelete={askDelete}
                                    onRefresh={() => fetchSubcategories(selectedParent)}
                                    addToast={addToast}
                                />
                            ))}
                        </div>

                        {/* Pagination footer */}
                        <div className="flex w-full flex-col sm:flex-row gap-3 justify-between items-center py-4 px-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30">
                            <span className="text-sm text-slate-500">
                                Showing {(page - 1) * rowsPerPage + 1}–{Math.min(page * rowsPerPage, sorted.length)} of {sorted.length} subcategor{sorted.length !== 1 ? "ies" : "y"}
                            </span>
                            {totalPages > 1 && (
                                <Pagination
                                    radius="md"
                                    variant="flat"
                                    showControls
                                    color="primary"
                                    page={page}
                                    total={totalPages}
                                    onChange={setPage}
                                    classNames={{ cursor: "bg-indigo-500 shadow-indigo-500/30" }}
                                />
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

