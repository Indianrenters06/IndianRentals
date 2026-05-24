"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Card, CardBody, Button, Chip, Avatar,
    Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
    Spinner, Pagination
} from "@heroui/react";
import {
    Plus, MagnifyingGlass, DotsThreeVertical,
    PencilSimple, Trash, Eye, CheckCircle, Package,
    ArrowClockwise, FunnelSimple, UploadSimple, DownloadSimple, X, CloudArrowUp, WarningCircle
} from "@phosphor-icons/react";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const FRONTEND = process.env.NEXT_PUBLIC_FRONTEND_URL || "https://indian-rentals.vercel.app";
const getToken = () => localStorage.getItem("adminToken");

const getImageUrl = (path) => {
    if (!path) return undefined;
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    return `${FRONTEND}${path.startsWith('/') ? '' : '/'}${path}`;
};

export default function AllProducts() {
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [toggling, setToggling] = useState(null);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all"); // all | active | draft

    const [isBulkOpen, setIsBulkOpen] = useState(false);
    const [bulkFile, setBulkFile] = useState(null);
    const [uploadingBulk, setUploadingBulk] = useState(false);
    const [bulkResult, setBulkResult] = useState(null);
    const [bulkError, setBulkError] = useState("");

    const [page, setPage] = useState(1);
    const rowsPerPage = 10;
    const [sortCol, setSortCol] = useState("updatedAt");
    const [sortDir, setSortDir] = useState("descending");

    // ── Fetch ─────────────────────────────────────────────────────────────────
    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API}/api/products?limit=200`);
            if (res.ok) {
                const data = await res.json();
                setProducts(Array.isArray(data.products) ? data.products : []);
            } else {
                console.error(`API returned ${res.status}`);
            }
        } catch (err) {
            console.error("Network Fetch Error:", err);
            setProducts([]);
        }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    const handleBulkUpload = async (e) => {
        e.preventDefault();
        if (!bulkFile) {
            setBulkError("Please choose a CSV file first.");
            return;
        }
        try {
            setUploadingBulk(true);
            setBulkError("");
            setBulkResult(null);

            const formData = new FormData();
            formData.append("file", bulkFile);

            const res = await fetch(`${API}/api/products/bulk`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${getToken()}`
                },
                body: formData
            });

            const data = await res.json();
            if (res.ok) {
                setBulkResult(data);
                fetchProducts();
            } else {
                setBulkError(data.message || "Failed to process bulk upload");
            }
        } catch (err) {
            setBulkError(err.message || "Something went wrong.");
        } finally {
            setUploadingBulk(false);
        }
    };

    const downloadSampleCSV = () => {
        const headers = "Name,Description,Category,Brand,RentalPrice,SecurityDeposit,Stock,Condition,City,State,MRP,DeliveryTime,Benefits,Images";
        const sampleRow = "\"Premium Laptop\",\"Latest model high-speed gaming laptop\",\"Electronics\",\"BrandX\",\"1500\",\"5000\",\"10\",\"New\",\"Bangalore\",\"Karnataka\",\"75000\",\"2-3 days\",\"Free Delivery,1 Year Warranty\",\"https://images.unsplash.com/photo-1517336714731-489689fd1ca8\"";
        const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(headers + "\n" + sampleRow);
        const link = document.createElement("a");
        link.setAttribute("href", csvContent);
        link.setAttribute("download", "indian_rentals_products_sample.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // ── Filtered view ─────────────────────────────────────────────────────────
    const visible = useMemo(() => {
        let list = products;
        if (filter === "active") list = list.filter(p => p.isActive);
        if (filter === "draft") list = list.filter(p => !p.isActive);
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(p =>
                p.name?.toLowerCase().includes(q) ||
                p.brand?.toLowerCase().includes(q) ||
                p.category?.toLowerCase().includes(q)
            );
        }
        return list;
    }, [products, search, filter]);

    const sorted = useMemo(() => {
        return [...visible].sort((a, b) => {
            let first = a[sortCol];
            let second = b[sortCol];
            if (sortCol === 'rentalPrice') {
                first = Number(first); second = Number(second);
            }
            const cmp = first < second ? -1 : first > second ? 1 : 0;
            return sortDir === 'descending' ? -cmp : cmp;
        });
    }, [visible, sortCol, sortDir]);

    const paginated = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        return sorted.slice(start, start + rowsPerPage);
    }, [sorted, page]);

    const totalActive = products.filter(p => p.isActive).length;
    const totalDraft = products.filter(p => !p.isActive).length;

    // ── Delete ────────────────────────────────────────────────────────────────
    const handleDelete = async (id) => {
        try {
            setDeleting(id);
            const res = await fetch(`${API}/api/products/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (res.ok) {
                setProducts(p => p.filter(x => x._id !== id));
            } else {
                const e = await res.json();
                alert(e.message || "Failed to delete");
            }
        } catch (err) { alert(err.message); }
        finally { setDeleting(null); }
    };

    // ── Toggle active/draft inline ────────────────────────────────────────────
    const handleToggleActive = async (product) => {
        try {
            setToggling(product._id);
            const res = await fetch(`${API}/api/products/${product._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify({ isActive: !product.isActive }),
            });
            if (res.ok) {
                const updated = await res.json();
                setProducts(prev => prev.map(p => p._id === product._id ? { ...p, isActive: updated.isActive } : p));
            } else {
                alert("Failed to update status");
            }
        } catch (err) { alert(err.message); }
        finally { setToggling(null); }
    };

    const gridClass = "grid grid-cols-[minmax(250px,2fr)_minmax(120px,1fr)_minmax(130px,1fr)_minmax(100px,1fr)_80px_100px] gap-4 items-center";

    return (
        <div className="w-full space-y-6 pb-12">
            <ConfirmDeleteModal
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={() => { setConfirmOpen(false); if (deleteTarget) handleDelete(deleteTarget.id); }}
                title="Confirm Action"
                description="Are you sure you want to perform this destructive action? This cannot be undone."
                loading={false}
            />


            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Inventory <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Catalogue</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">Manage all products actively listed on your platform.</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
                    <Button
                        isIconOnly variant="flat" size="sm"
                        className="text-slate-500"
                        onPress={fetchProducts}
                        isLoading={loading}
                    >
                        <ArrowClockwise size={16} />
                    </Button>
                    <button
                        type="button"
                        onClick={() => {
                            setIsBulkOpen(true);
                            setBulkFile(null);
                            setBulkResult(null);
                            setBulkError("");
                        }}
                        className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-slate-700 dark:text-slate-200 font-bold text-sm shadow-sm transition-all"
                    >
                        <UploadSimple weight="bold" size={18} />
                        Bulk Upload
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push("/dashboard/products/add")}
                        className="inline-flex items-center gap-2 h-12 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 transition-all"
                    >
                        <Plus weight="bold" size={18} />
                        Add New Product
                    </button>
                </motion.div>
            </div>

            {/* ── Stats strip ── */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "Total", value: products.length, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-500/10", icon: <Package size={20} weight="duotone" /> },
                    { label: "Active", value: totalActive, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10", icon: <CheckCircle size={20} weight="duotone" /> },
                    { label: "Drafts", value: totalDraft, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10", icon: <FunnelSimple size={20} weight="duotone" /> },
                ].map(s => (
                    <Card key={s.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <CardBody className="flex flex-row items-center gap-3 p-4">
                            <div className={`p-2.5 rounded-xl ${s.bg} ${s.color}`}>{s.icon}</div>
                            <div>
                                <p className="text-2xl font-black text-slate-900 dark:text-white">{loading ? "—" : s.value}</p>
                                <p className="text-xs text-slate-500">{s.label} Products</p>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>

            {/* ── Table card ── */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm w-full">

                    {/* Toolbar */}
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/60">
                        {/* Search & Sort Group */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                            <div className="relative group w-full sm:w-72">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none z-10">
                                    <MagnifyingGlass className="text-slate-400 group-focus-within:text-indigo-500" size={18} />
                                </div>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search by name, brand, category…"
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all h-10 shadow-xs"
                                />
                            </div>

                            <div className="relative w-full sm:w-56">
                                <select
                                    value={`${sortCol}-${sortDir}`}
                                    onChange={(e) => {
                                        const [c, d] = e.target.value.split("-");
                                        setSortCol(c);
                                        setSortDir(d);
                                    }}
                                    className="w-full h-10 pl-3 pr-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 shadow-xs cursor-pointer appearance-none"
                                >
                                    <option value="updatedAt-descending">Sort by: Recently Updated</option>
                                    <option value="createdAt-descending">Sort by: Newest Arrivals</option>
                                    <option value="rentalPrice-ascending">Price: Low to High</option>
                                    <option value="rentalPrice-descending">Price: High to Low</option>
                                    <option value="stock-ascending">Stock: Low to High</option>
                                    <option value="stock-descending">Stock: High to Low</option>
                                    <option value="name-ascending">Name: A to Z</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                </div>
                            </div>
                        </div>

                        {/* Filter pills */}
                        <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0 hide-scrollbar">
                            {["all", "active", "draft"].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${filter === f
                                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                                        }`}
                                >
                                    {f === "all" ? `All (${products.length})` : f === "active" ? `Active (${totalActive})` : `Draft (${totalDraft})`}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Column headers */}
                    <div className={`${gridClass} px-6 py-3 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400`}>
                        <span className="text-left">Product</span>
                        <span className="text-left">Category</span>
                        <span className="text-left">Price / Deposit</span>
                        <span className="text-left">Stock</span>
                        <span className="text-center">Status</span>
                        <span className="text-center">Actions</span>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center gap-3 py-20 text-slate-400">
                            <Spinner size="sm" color="secondary" /> Loading products…
                        </div>
                    ) : visible.length === 0 ? (
                        <div className="text-center py-20 text-slate-400">
                            <Package size={52} className="mx-auto mb-3 opacity-25" />
                            <p className="text-sm font-medium">
                                {search ? `No products match "${search}"` : "No products found."}
                            </p>
                            {!search && (
                                <Button size="sm" variant="flat" className="mt-4 text-indigo-500"
                                    onPress={() => router.push("/dashboard/products/add")}>
                                    Add your first product
                                </Button>
                            )}
                        </div>
                    ) : (
                        <CardBody className="p-0 divide-y divide-slate-100 dark:divide-slate-800/60">
                            {paginated.map((product, i) => (
                                <motion.div
                                    key={product._id}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.025 }}
                                    className={`${gridClass} px-6 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group`}
                                >
                                    {/* Product */}
                                    <div className="flex items-center gap-3 min-w-0 pr-4">
                                        <div className="w-12 h-12 rounded-md ring-1 ring-slate-200 dark:ring-slate-700 bg-white dark:bg-slate-800 shrink-0 overflow-hidden flex items-center justify-center p-1">
                                            {getImageUrl(product.images?.[0]) ? (
                                                <img
                                                    src={getImageUrl(product.images?.[0])}
                                                    alt={product.name}
                                                    className="w-full h-full object-contain"
                                                />
                                            ) : (
                                                <Package className="text-slate-300 w-6 h-6" />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-200 group-hover:text-indigo-500 transition-colors truncate">
                                                {product.name}
                                            </p>
                                            <p className="text-[10px] text-slate-400 font-mono">
                                                {product.brand || "—"} · ID:{product._id.toString().slice(-6)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Category */}
                                    <Chip size="sm" variant="flat" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium text-[11px] truncate max-w-[130px]">
                                        {product.category}
                                    </Chip>

                                    {/* Price */}
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">₹{product.rentalPrice}<span className="text-xs font-normal text-slate-400">/mo</span></p>
                                        <p className="text-[10px] text-slate-400">Dep: ₹{product.securityDeposit}</p>
                                    </div>

                                    {/* Stock */}
                                    <div>
                                        <span className={`text-sm font-bold ${product.stock <= 0 ? "text-red-500" : product.stock < 5 ? "text-amber-500" : "text-slate-700 dark:text-slate-300"}`}>
                                            {product.stock}
                                        </span>
                                        <span className="text-xs text-slate-400 ml-1">units</span>
                                        {product.stock <= 0 && <p className="text-[10px] text-red-400 font-medium">Out of stock</p>}
                                    </div>

                                    {/* Active toggle */}
                                    <div className="flex justify-center items-center">
                                        <button
                                            type="button"
                                            onClick={() => handleToggleActive(product)}
                                            disabled={toggling === product._id}
                                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${product.isActive ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                                        >
                                            <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${product.isActive ? 'translate-x-5' : 'translate-x-1'}`} />
                                        </button>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex justify-center items-center gap-1">
                                        <button
                                            type="button"
                                            title="View on Site"
                                            onClick={() => window.open(`${FRONTEND}/products/${product._id}`, "_blank")}
                                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
                                        >
                                            <Eye size={15} />
                                        </button>
                                        <button
                                            type="button"
                                            title="Edit Product"
                                            onClick={() => router.push(`/dashboard/products/edit/${product._id.toString()}`)}
                                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
                                        >
                                            <PencilSimple size={15} />
                                        </button>
                                        <button
                                            type="button"
                                            title="Delete Product"
                                            disabled={deleting === product._id}
                                            onClick={() => { setDeleteTarget({ id: product._id }); setConfirmOpen(true); }}
                                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-40 transition-colors"
                                        >
                                            {deleting === product._id ? <Spinner size="sm" /> : <Trash size={15} />}
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </CardBody>
                    )}

                    {/* Footer count & pagination */}
                    {!loading && visible.length > 0 && (
                        <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <span className="text-xs text-slate-400">
                                Showing <span className="font-bold text-slate-600 dark:text-slate-300">{(page - 1) * rowsPerPage + 1}</span> to <span className="font-bold text-slate-600 dark:text-slate-300">{Math.min(page * rowsPerPage, visible.length)}</span> of {visible.length} products
                                {search && ` · filtered`}
                            </span>
                            <Pagination
                                radius="md" variant="flat"
                                showControls

                                color="primary"
                                page={page}
                                total={Math.ceil(visible.length / rowsPerPage)}
                                onChange={(p) => setPage(p)}
                            />
                        </div>
                    )}
                </Card>
            </motion.div>
            {/* ── Bulk Upload Modal ── */}
            {isBulkOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                    <CloudArrowUp size={24} className="text-indigo-600" />
                                    Bulk Upload Products
                                </h3>
                                <p className="text-slate-500 text-xs mt-1">Upload multiple products at once via CSV file.</p>
                            </div>
                            <button
                                onClick={() => setIsBulkOpen(false)}
                                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto space-y-6 flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            {/* Step 1: Download Sample */}
                            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-700/30 flex items-center justify-between gap-4">
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Need the template format?</p>
                                    <p className="text-xs text-slate-500 truncate">Download our sample CSV to format your records correctly.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={downloadSampleCSV}
                                    className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-indigo-550 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold text-xs shrink-0 transition-all"
                                >
                                    <DownloadSimple weight="bold" size={16} />
                                    Download CSV
                                </button>
                            </div>

                            {/* Step 2: Upload Dropzone */}
                            {!bulkResult && (
                                <form onSubmit={handleBulkUpload} className="space-y-4">
                                    <div className="relative group border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-500 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all bg-white dark:bg-slate-950/40">
                                        <input
                                            type="file"
                                            accept=".csv"
                                            onChange={(e) => setBulkFile(e.target.files[0])}
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        />
                                        <CloudArrowUp size={40} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                        {bulkFile ? (
                                            <div className="text-center">
                                                <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 truncate max-w-[300px]">{bulkFile.name}</p>
                                                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{(bulkFile.size / 1024).toFixed(2)} KB</p>
                                            </div>
                                        ) : (
                                            <div className="text-center">
                                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Click to upload or drag & drop</p>
                                                <p className="text-[10px] text-slate-400 mt-0.5">Supports CSV files only</p>
                                            </div>
                                        )}
                                    </div>

                                    {bulkError && (
                                        <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                                            <WarningCircle size={16} className="shrink-0" />
                                            <p className="font-semibold">{bulkError}</p>
                                        </div>
                                    )}

                                    <div className="flex gap-3 justify-end pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setIsBulkOpen(false)}
                                            className="h-11 px-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={uploadingBulk || !bulkFile}
                                            className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs shadow-md shadow-indigo-500/10 transition-all flex items-center justify-center gap-2 min-w-[120px]"
                                        >
                                            {uploadingBulk ? (
                                                <>
                                                    <Spinner size="sm" color="white" />
                                                    Processing...
                                                </>
                                            ) : (
                                                "Upload and Process"
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Step 3: Result Summary */}
                            {bulkResult && (
                                <div className="space-y-4 animate-fade-in">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 p-4 rounded-2xl text-center">
                                            <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{bulkResult.successCount}</p>
                                            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wide mt-1">Successfully Uploaded</p>
                                        </div>
                                        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 p-4 rounded-2xl text-center">
                                            <p className="text-3xl font-black text-amber-600 dark:text-amber-400">{bulkResult.failCount}</p>
                                            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wide mt-1">Failed Records</p>
                                        </div>
                                    </div>

                                    {bulkResult.failCount > 0 && (
                                        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                                            <div className="bg-slate-50 dark:bg-slate-950 px-4 py-2 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                Errors Report
                                            </div>
                                            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[180px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                                {bulkResult.failed.map((fail, index) => (
                                                    <div key={index} className="p-3 text-[11px] flex flex-col gap-0.5">
                                                        <span className="font-bold text-amber-600 dark:text-amber-400">Row {fail.rowNum}</span>
                                                        <span className="text-slate-600 dark:text-slate-400 font-medium">{fail.error}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-3 justify-end pt-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setBulkFile(null);
                                                setBulkResult(null);
                                                setBulkError("");
                                            }}
                                            className="h-11 px-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs transition-colors"
                                        >
                                            Upload Another
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsBulkOpen(false)}
                                            className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/10 transition-colors"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
