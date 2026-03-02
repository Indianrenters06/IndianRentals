"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Card, CardBody, Button, Chip, Avatar,
    Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
    Spinner,
} from "@heroui/react";
import {
    Plus, MagnifyingGlass, DotsThreeVertical,
    PencilSimple, Trash, Eye, CheckCircle, Package,
    ArrowClockwise, FunnelSimple
} from "@phosphor-icons/react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const FRONTEND = process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";
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
    const [deleting, setDeleting] = useState(null);
    const [toggling, setToggling] = useState(null);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all"); // all | active | draft

    // ── Fetch ─────────────────────────────────────────────────────────────────
    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API}/api/products?limit=200`);
            if (res.ok) {
                const data = await res.json();
                setProducts(Array.isArray(data.products) ? data.products : []);
            }
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

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

    const totalActive = products.filter(p => p.isActive).length;
    const totalDraft = products.filter(p => !p.isActive).length;

    // ── Delete ────────────────────────────────────────────────────────────────
    const handleDelete = async (id) => {
        if (!confirm("Delete this product permanently? This cannot be undone.")) return;
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
                        onClick={() => router.push("/dashboard/products/add")}
                        className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all"
                    >
                        <Plus weight="bold" size={15} />
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
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900/60">
                        {/* Search */}
                        <div className="relative group w-full sm:w-72">
                            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500" size={15} />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search by name, brand, category…"
                                className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 w-full transition-all"
                            />
                        </div>

                        {/* Filter pills */}
                        <div className="flex items-center gap-2">
                            {["all", "active", "draft"].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${filter === f
                                        ? "bg-indigo-600 text-white shadow-sm"
                                        : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-indigo-300"
                                        }`}
                                >
                                    {f === "all" ? `All (${products.length})` : f === "active" ? `Active (${totalActive})` : `Draft (${totalDraft})`}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Column headers */}
                    <div className={`${gridClass} px-6 py-3 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400`}>
                        <span>Product</span>
                        <span>Category</span>
                        <span>Price / Deposit</span>
                        <span>Stock</span>
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
                            {visible.map((product, i) => (
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
                                            onClick={() => window.open(`${process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000"}/products/${product._id}`, "_blank")}
                                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
                                        >
                                            <Eye size={15} />
                                        </button>
                                        <button
                                            type="button"
                                            title="Edit Product"
                                            onClick={() => router.push(`/dashboard/products/edit/${product._id}`)}
                                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
                                        >
                                            <PencilSimple size={15} />
                                        </button>
                                        <button
                                            type="button"
                                            title="Delete Product"
                                            disabled={deleting === product._id}
                                            onClick={() => handleDelete(product._id)}
                                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-40 transition-colors"
                                        >
                                            {deleting === product._id ? <Spinner size="sm" /> : <Trash size={15} />}
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </CardBody>
                    )}

                    {/* Footer count */}
                    {!loading && visible.length > 0 && (
                        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
                            Showing <span className="font-bold text-slate-600 dark:text-slate-300">{visible.length}</span> of {products.length} products
                            {search && ` · filtered by "${search}"`}
                        </div>
                    )}
                </Card>
            </motion.div>
        </div>
    );
}
