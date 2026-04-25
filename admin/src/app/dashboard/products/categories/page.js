"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Card,
    CardBody,
    Button,
    Input,
    Textarea,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Chip,
    Avatar,
    Tooltip,
    Spinner,
} from "@heroui/react";
import {
    Plus,
    Folder,
    FolderPlus,
    FolderOpen,
    Image,
    Trash,
    PencilSimple,
    CaretDown,
    CaretRight,
    TreeStructure,
    Tag,
} from "@phosphor-icons/react";
import ImageUploader from "@/components/ImageUploader";

const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

function getToken() {
    return typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
}

// ─── Subcategory pill row ─────────────────────────────────────────────────────
function SubcategoryRow({ sub, onEdit, onDelete }) {
    return (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 group">
            <Tag size={13} weight="fill" className="text-indigo-400 shrink-0" />
            <Avatar
                src={
                    sub.image ||
                    `https://ui-avatars.com/api/?name=${sub.name}&size=32&background=e0e7ff&color=6366f1`
                }
                size="sm"
                className="w-7 h-7 shrink-0"
            />
            <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {sub.name}
                </span>
                <span className="text-xs font-mono text-slate-400">/{sub.slug}</span>
            </div>
            {sub.description && (
                <span className="hidden md:block text-xs text-slate-500 line-clamp-1 max-w-[180px]">
                    {sub.description}
                </span>
            )}
            <Chip
                size="sm"
                color={sub.isActive ? "success" : "default"}
                variant="flat"
                className="shrink-0"
            >
                {sub.isActive ? "Active" : "Off"}
            </Chip>
            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                <Tooltip content="Edit subcategory" size="sm">
                    <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        className="text-slate-400 hover:text-indigo-500"
                        onPress={() => onEdit(sub)}
                    >
                        <PencilSimple size={14} />
                    </Button>
                </Tooltip>
                <Tooltip content="Delete subcategory" color="danger" size="sm">
                    <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        className="text-slate-400 hover:text-red-500"
                        onPress={() => onDelete(sub._id)}
                    >
                        <Trash size={14} />
                    </Button>
                </Tooltip>
            </div>
        </div>
    );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function CategoriesCMS() {
    const newCatModal = useDisclosure();
    const newSubModal = useDisclosure();
    const editModal = useDisclosure();

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedIds, setExpandedIds] = useState(new Set());

    // Forms
    const [catForm, setCatForm] = useState({ name: "", description: "", image: "" });
    const [catSaving, setCatSaving] = useState(false);
    const [subForm, setSubForm] = useState({ name: "", description: "", image: "" });
    const [subSaving, setSubSaving] = useState(false);
    const [activeCat, setActiveCat] = useState(null); // parent for the sub modal
    
    // Edit Form
    const [editForm, setEditForm] = useState({ _id: null, name: "", description: "", image: "", isActive: true });
    const [editSaving, setEditSaving] = useState(false);

    // ── Fetch ─────────────────────────────────────────────────────────────────
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

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // ── Helpers ───────────────────────────────────────────────────────────────
    const toggleExpand = (id) => {
        setExpandedIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const openSubModal = (cat) => {
        setActiveCat(cat);
        setSubForm({ name: "", description: "", image: "" });
        newSubModal.onOpen();
    };

    const openEditModal = (item) => {
        setEditForm({
            _id: item._id,
            name: item.name || "",
            description: item.description || "",
            image: item.image || "",
            isActive: item.isActive !== undefined ? item.isActive : true
        });
        editModal.onOpen();
    };

    // ── CRUD ──────────────────────────────────────────────────────────────────
    const handleCreateCategory = async (onClose) => {
        try {
            setCatSaving(true);
            const res = await fetch(`${API}/api/categories`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify(catForm),
            });
            if (!res.ok) throw new Error((await res.json()).message || "Failed");
            setCatForm({ name: "", description: "", image: "" });
            onClose();
            await fetchCategories();
        } catch (err) {
            alert(err.message);
        } finally {
            setCatSaving(false);
        }
    };

    const handleCreateSubcategory = async (onClose) => {
        if (!activeCat) return;
        try {
            setSubSaving(true);
            const res = await fetch(`${API}/api/categories/${activeCat._id}/subcategories`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify(subForm),
            });
            if (!res.ok) throw new Error((await res.json()).message || "Failed");
            setSubForm({ name: "", description: "", image: "" });
            onClose();
            setExpandedIds((prev) => new Set([...prev, activeCat._id]));
            await fetchCategories();
        } catch (err) {
            alert(err.message);
        } finally {
            setSubSaving(false);
        }
    };

    const handleDeleteCategory = async (id) => {
        if (!confirm("Delete this category and ALL its subcategories?")) return;
        try {
            const res = await fetch(`${API}/api/categories/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (res.ok) await fetchCategories();
            else alert((await res.json()).message || "Failed");
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDeleteSubcategory = async (subId) => {
        if (!confirm("Delete this subcategory?")) return;
        try {
            const res = await fetch(`${API}/api/categories/${subId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (res.ok) await fetchCategories();
            else alert((await res.json()).message || "Failed");
        } catch (err) {
            alert(err.message);
        }
    };

    const handleUpdateItem = async (onClose) => {
        try {
            setEditSaving(true);
            const res = await fetch(`${API}/api/categories/${editForm._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify(editForm),
            });
            if (!res.ok) throw new Error((await res.json()).message || "Failed to update");
            onClose();
            await fetchCategories();
        } catch (err) {
            alert(err.message);
        } finally {
            setEditSaving(false);
        }
    };

    // ── Totals ────────────────────────────────────────────────────────────────
    const totalSubs = categories.reduce((a, c) => a + (c.subcategories?.length || 0), 0);
    const activeCount = categories.filter((c) => c.isActive).length;

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="w-full space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Category{" "}
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">
                            Management
                        </span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Organize your inventory with root categories and subcategories.
                    </p>
                </motion.div>

                <button
                    type="button"
                    onClick={newCatModal.onOpen}
                    className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all"
                >
                    <FolderPlus size={16} />
                    Add Category
                </button>
            </div>

            {/* Stats strip */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="grid grid-cols-3 gap-4"
            >
                {[
                    { label: "Categories", value: categories.length, icon: <Folder size={20} weight="duotone" />, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-500/10" },
                    { label: "Subcategories", value: totalSubs, icon: <TreeStructure size={20} weight="duotone" />, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10" },
                    { label: "Active", value: activeCount, icon: <Tag size={20} weight="duotone" />, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
                ].map((s) => (
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
            </motion.div>

            {/* Category list (custom layout — avoids HeroUI Table colSpan limitation) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.45 }}
            >
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm w-full overflow-hidden">
                    {/* Table header */}
                    <div className="grid grid-cols-[auto_1fr_1fr_auto_auto_auto] gap-x-4 items-center px-5 py-3 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800">
                        <div className="w-6" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Category</span>
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 hidden md:block">Description</span>
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Subcats</span>
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Status</span>
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 text-center">Actions</span>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center gap-2 py-16 text-slate-400">
                            <Spinner size="sm" color="secondary" />
                            <span>Loading categories…</span>
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="text-center py-16 text-slate-400">
                            <Folder size={48} className="mx-auto mb-3 opacity-30" />
                            <p>No categories found.</p>
                        </div>
                    ) : (
                        <CardBody className="p-0 divide-y divide-slate-100 dark:divide-slate-800/60">
                            {categories.map((cat, idx) => {
                                const isExpanded = expandedIds.has(cat._id);
                                const subCount = cat.subcategories?.length || 0;
                                return (
                                    <motion.div
                                        key={cat._id}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.04 }}
                                    >
                                        {/* ── Main category row ─────────────────────────── */}
                                        <div className="grid grid-cols-[auto_1fr_1fr_auto_auto_auto] gap-x-4 items-center px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                                            {/* Expand toggle */}
                                            <button
                                                onClick={() => toggleExpand(cat._id)}
                                                className="p-1 rounded-md text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
                                                aria-label={isExpanded ? "Collapse" : "Expand"}
                                            >
                                                {isExpanded ? (
                                                    <CaretDown size={13} weight="bold" />
                                                ) : (
                                                    <CaretRight size={13} weight="bold" />
                                                )}
                                            </button>

                                            {/* Name + avatar */}
                                            <div className="flex items-center gap-3 min-w-0">
                                                <Avatar
                                                    src={cat.image || `https://ui-avatars.com/api/?name=${cat.name}`}
                                                    size="sm"
                                                    isBordered
                                                    className="ring-slate-200 dark:ring-slate-700 shrink-0"
                                                />
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-200 group-hover:text-indigo-500 transition-colors truncate">
                                                        {cat.name}
                                                    </span>
                                                    <span className="text-xs text-slate-400 font-mono">/{cat.slug}</span>
                                                </div>
                                            </div>

                                            {/* Description */}
                                            <span className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1 hidden md:block">
                                                {cat.description || "—"}
                                            </span>

                                            {/* Subcategory count badge */}
                                            <div
                                                className="inline-flex items-center gap-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 font-semibold cursor-pointer rounded-full px-2 py-0.5 text-xs"
                                                onClick={() => toggleExpand(cat._id)}
                                            >
                                                <TreeStructure size={11} />
                                                {subCount} sub{subCount !== 1 ? "s" : ""}
                                            </div>

                                            {/* Status */}
                                            <Chip
                                                size="sm"
                                                color={cat.isActive ? "success" : "default"}
                                                variant="flat"
                                            >
                                                {cat.isActive ? "Active" : "Disabled"}
                                            </Chip>

                                            {/* Actions */}
                                            <div className="flex items-center gap-1">
                                                <Tooltip content="Add subcategory" color="secondary" size="sm">
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        variant="flat"
                                                        className="text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20"
                                                        onPress={() => openSubModal(cat)}
                                                    >
                                                        <Plus size={14} weight="bold" />
                                                    </Button>
                                                </Tooltip>
                                                <Tooltip content="Edit" size="sm">
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        variant="light"
                                                        className="text-slate-400 hover:text-indigo-500"
                                                        onPress={() => openEditModal(cat)}
                                                    >
                                                        <PencilSimple size={14} />
                                                    </Button>
                                                </Tooltip>
                                                <Tooltip content="Delete" color="danger" size="sm">
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        variant="light"
                                                        className="text-slate-400 hover:text-red-500"
                                                        onPress={() => handleDeleteCategory(cat._id)}
                                                    >
                                                        <Trash size={14} />
                                                    </Button>
                                                </Tooltip>
                                            </div>
                                        </div>

                                        {/* ── Expanded subcategory section ───────────────── */}
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    key="subs"
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.22, ease: "easeInOut" }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="ml-10 mr-4 pb-4 pt-1 space-y-2 border-l-2 border-indigo-100 dark:border-indigo-500/20 pl-4">
                                                        {/* Section label + inline add button */}
                                                        <div className="flex items-center gap-2 py-1">
                                                            <FolderOpen
                                                                size={13}
                                                                className="text-indigo-400 shrink-0"
                                                                weight="duotone"
                                                            />
                                                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                                                                Subcategories of{" "}
                                                                <span className="text-indigo-500 normal-case font-bold">
                                                                    {cat.name}
                                                                </span>
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => openSubModal(cat)}
                                                                className="ml-auto inline-flex items-center gap-1 h-6 px-2.5 text-xs text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 font-semibold rounded-lg hover:bg-indigo-100 transition-colors"
                                                            >
                                                                <Plus size={11} weight="bold" />
                                                                Add Subcategory
                                                            </button>
                                                        </div>

                                                        {/* Subcategory rows */}
                                                        {cat.subcategories && cat.subcategories.length > 0 ? (
                                                            cat.subcategories.map((sub) => (
                                                                <SubcategoryRow
                                                                    key={sub._id}
                                                                    sub={sub}
                                                                    onEdit={openEditModal}
                                                                    onDelete={handleDeleteSubcategory}
                                                                />
                                                            ))
                                                        ) : (
                                                            <div className="py-4 px-4 text-sm text-slate-400 flex items-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700">
                                                                <TreeStructure size={15} className="opacity-50" />
                                                                No subcategories yet.{" "}
                                                                <button
                                                                    onClick={() => openSubModal(cat)}
                                                                    className="text-indigo-500 hover:underline font-semibold"
                                                                >
                                                                    Add one →
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}
                        </CardBody>
                    )}
                </Card>
            </motion.div>

            {/* ══ Modal: Add Root Category ══════════════════════════════════════ */}
            <Modal
                isOpen={newCatModal.isOpen}
                onOpenChange={newCatModal.onOpenChange}
                backdrop="blur"
                placement="top-center"
                scrollBehavior="inside"
                size="3xl"
                classNames={{ base: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex items-center gap-2 text-slate-900 dark:text-white">
                                <Folder className="text-indigo-500" size={20} /> Add Root Category
                            </ModalHeader>
                            <ModalBody className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm text-slate-700 dark:text-slate-300 font-medium block mb-1.5">Category Name <span className="text-red-500">*</span></label>
                                            <input
                                                autoFocus
                                                required
                                                value={catForm.name}
                                                onChange={(e) => setCatForm((p) => ({ ...p, name: e.target.value }))}
                                                placeholder="e.g. Photography"
                                                className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm text-slate-700 dark:text-slate-300 font-medium block mb-1.5">Description</label>
                                            <textarea
                                                value={catForm.description}
                                                onChange={(e) => setCatForm((p) => ({ ...p, description: e.target.value }))}
                                                placeholder="Short description of this category..."
                                                rows={5}
                                                className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-sm resize-y"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm text-slate-700 dark:text-slate-300 font-medium block mb-1.5">Cover Image (Optional)</label>
                                        <ImageUploader
                                            key={`cat-${newCatModal.isOpen}`}
                                            existingUrl={catForm.image}
                                            onUpload={(url) => setCatForm((p) => ({ ...p, image: url }))}
                                            label="Click or drag to upload category banner"
                                        />
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter className="border-t border-slate-100 dark:border-slate-800/60 p-4">
                                <Button variant="flat" onPress={onClose} className="rounded-xl font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors">Cancel</Button>
                                <Button
                                    className="rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30 transition-all font-medium"
                                    isLoading={catSaving}
                                    onPress={() => handleCreateCategory(onClose)}
                                >
                                    Create Category
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* ══ Modal: Add Subcategory ════════════════════════════════════════ */}
            <Modal
                isOpen={newSubModal.isOpen}
                onOpenChange={newSubModal.onOpenChange}
                backdrop="blur"
                placement="top-center"
                scrollBehavior="inside"
                size="3xl"
                classNames={{ base: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-0.5 text-slate-900 dark:text-white">
                                <div className="flex items-center gap-2">
                                    <TreeStructure className="text-purple-500" size={20} />
                                    Add Subcategory
                                </div>
                                {activeCat && (
                                    <p className="text-sm font-normal text-slate-400 ml-7">
                                        Under{" "}
                                        <span className="text-indigo-500 font-semibold">{activeCat.name}</span>
                                    </p>
                                )}
                            </ModalHeader>
                            <ModalBody className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm text-slate-700 dark:text-slate-300 font-medium block mb-1.5">Subcategory Name <span className="text-red-500">*</span></label>
                                            <input
                                                autoFocus
                                                required
                                                value={subForm.name}
                                                onChange={(e) => setSubForm((p) => ({ ...p, name: e.target.value }))}
                                                placeholder="e.g. MacBook Air"
                                                className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm text-slate-700 dark:text-slate-300 font-medium block mb-1.5">Description</label>
                                            <textarea
                                                value={subForm.description}
                                                onChange={(e) => setSubForm((p) => ({ ...p, description: e.target.value }))}
                                                placeholder="Short description..."
                                                rows={5}
                                                className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-sm resize-y"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm text-slate-700 dark:text-slate-300 font-medium block mb-1.5">Cover Image (Optional)</label>
                                        <ImageUploader
                                            key={`sub-${newSubModal.isOpen}`}
                                            existingUrl={subForm.image}
                                            onUpload={(url) => setSubForm((p) => ({ ...p, image: url }))}
                                            label="Click or drag to upload subcategory banner"
                                        />
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter className="border-t border-slate-100 dark:border-slate-800/60 p-4">
                                <Button variant="flat" onPress={onClose} className="rounded-xl font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors">Cancel</Button>
                                <Button
                                    className="rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30 transition-all font-medium"
                                    isLoading={subSaving}
                                    onPress={() => handleCreateSubcategory(onClose)}
                                >
                                    Add Subcategory
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* ══ Modal: Edit Category/Subcategory ════════════════════════════════════ */}
            <Modal
                isOpen={editModal.isOpen}
                onOpenChange={editModal.onOpenChange}
                placement="center"
                scrollBehavior="inside"
                size="3xl"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex items-center gap-2 text-slate-900 dark:text-white">
                                <PencilSimple className="text-indigo-500" size={20} /> Edit Item
                            </ModalHeader>
                            <ModalBody className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm text-slate-700 dark:text-slate-300 font-medium block mb-1.5">Name <span className="text-red-500">*</span></label>
                                            <input
                                                autoFocus
                                                required
                                                value={editForm.name}
                                                onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                                                className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm text-slate-700 dark:text-slate-300 font-medium block mb-1.5">Description</label>
                                            <textarea
                                                value={editForm.description}
                                                onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
                                                rows={5}
                                                className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-sm resize-y"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm text-slate-700 dark:text-slate-300 font-medium block mb-1.5">Status</label>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setEditForm((p) => ({ ...p, isActive: true }))}
                                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${editForm.isActive ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
                                                >
                                                    Active
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setEditForm((p) => ({ ...p, isActive: false }))}
                                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${!editForm.isActive ? 'bg-slate-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
                                                >
                                                    Disabled
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm text-slate-700 dark:text-slate-300 font-medium block mb-1.5">Cover Image (Optional)</label>
                                        <ImageUploader
                                            key={`edit-${editModal.isOpen}-${editForm._id}`}
                                            existingUrl={editForm.image}
                                            onUpload={(url) => setEditForm((p) => ({ ...p, image: url }))}
                                            label="Click or drag to update image"
                                        />
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter className="border-t border-slate-100 dark:border-slate-800/60 p-4">
                                <Button variant="flat" onPress={onClose} className="rounded-xl font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors">Cancel</Button>
                                <Button
                                    className="rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30 transition-all font-medium"
                                    isLoading={editSaving}
                                    onPress={() => handleUpdateItem(onClose)}
                                >
                                    Save Changes
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
