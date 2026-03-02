"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardBody, Textarea, Divider } from "@heroui/react";
import { FloppyDisk, ArrowLeft, Tag, MapPin, CurrencyInr, Cube } from "@phosphor-icons/react";
import ImageUploader from "@/components/ImageUploader";

const inputCls = "w-full h-12 px-3 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-sm";
const prefixInputCls = "w-full h-12 pl-9 pr-3 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-sm";
const textareaCls = "w-full min-h-[120px] p-3 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-sm resize-y";
const selectCls = "w-full h-12 px-3 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-sm appearance-none cursor-pointer";
const labelCls = "text-sm font-bold text-slate-700 dark:text-slate-200 block mb-1.5";

export default function AddProduct() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        subcategory: "",
        brand: "",
        rentalPrice: "",
        securityDeposit: "",
        stock: "1",
        condition: "Good",
        city: "",
        state: "",
        images: [""],
        isActive: true,
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/categories`);
                const data = await res.json();
                setCategories(Array.isArray(data) ? data : data.categories || []);
            } catch (err) {
                console.error("Failed to fetch categories", err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (formData.category) {
            const selectedCat = categories.find(c => c.name === formData.category || c._id === formData.category);
            if (selectedCat?._id) {
                const fetchSubcats = async () => {
                    try {
                        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/categories/${selectedCat._id}/subcategories`);
                        const data = await res.json();
                        setSubcategories(Array.isArray(data) ? data : data.subcategories || []);
                    } catch (err) {
                        console.error(err);
                    }
                };
                fetchSubcats();
            } else {
                setSubcategories([]);
            }
        } else {
            setSubcategories([]);
        }
    }, [formData.category, categories]);

    const set = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem("adminToken");
            const selectedCat = categories.find(c => c._id === formData.category);
            const categoryName = selectedCat ? selectedCat.name : formData.category;

            const payload = {
                name: formData.name,
                description: formData.description,
                category: categoryName,
                subcategory: formData.subcategory || null,
                brand: formData.brand,
                rentalPrice: Number(formData.rentalPrice),
                securityDeposit: Number(formData.securityDeposit),
                stock: Number(formData.stock),
                condition: formData.condition,
                city: formData.city,
                state: formData.state,
                images: formData.images.filter(Boolean),
                isActive: formData.isActive,
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/products`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || "Failed to create product");
            }

            alert("Product successfully created!");
            router.push("/dashboard/products");
        } catch (err) {
            alert(err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                    <button
                        type="button"
                        onClick={() => router.push("/dashboard/products")}
                        className="inline-flex items-center gap-1.5 text-slate-500 hover:text-indigo-500 text-sm mb-2 transition-colors"
                    >
                        <ArrowLeft size={15} /> Back to Products
                    </button>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Add New <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Product</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">List a new item in your inventory catalogue.</p>
                </motion.div>
            </div>

            <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm w-full">
                    <CardBody className="p-8 space-y-8">

                        {/* ── Basic Information ── */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Tag className="text-indigo-500" /> Basic Information
                                </h3>
                                <Divider className="bg-slate-100 dark:bg-slate-800" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div>
                                    <label className={labelCls}>Product Name <span className="text-rose-500">*</span></label>
                                    <input required name="name" value={formData.name} onChange={e => set("name", e.target.value)}
                                        placeholder="Enter product title" className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}>Brand Name</label>
                                    <input name="brand" value={formData.brand} onChange={e => set("brand", e.target.value)}
                                        placeholder="e.g. Sony, Nikon" className={inputCls} />
                                </div>
                            </div>

                            <div>
                                <label className={labelCls}>Product Description <span className="text-rose-500">*</span></label>
                                <textarea
                                    required
                                    name="description"
                                    value={formData.description}
                                    onChange={e => set("description", e.target.value)}
                                    placeholder="Describe features, colors, condition etc."
                                    className={textareaCls}
                                />
                            </div>

                            {/* Category selects — native for proper z-index */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div>
                                    <label className={labelCls}>Primary Category <span className="text-rose-500">*</span></label>
                                    <div className="relative">
                                        <select
                                            required
                                            value={formData.category}
                                            onChange={e => set("category", e.target.value)}
                                            className={selectCls}
                                        >
                                            <option value="">Select a category</option>
                                            {categories.map(cat => (
                                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                                            ))}
                                        </select>
                                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">▾</span>
                                    </div>
                                </div>

                                <div>
                                    <label className={labelCls}>Sub-Category (Optional)</label>
                                    <div className="relative">
                                        <select
                                            value={formData.subcategory}
                                            onChange={e => set("subcategory", e.target.value)}
                                            disabled={subcategories.length === 0}
                                            className={`${selectCls} disabled:opacity-50 disabled:cursor-not-allowed`}
                                        >
                                            <option value="">{subcategories.length === 0 ? "Select category first" : "Choose sub-category"}</option>
                                            {subcategories.map(sub => (
                                                <option key={sub._id} value={sub._id}>{sub.name}</option>
                                            ))}
                                        </select>
                                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">▾</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Pricing & Inventory ── */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    <CurrencyInr weight="bold" className="text-indigo-500" /> Pricing & Inventory
                                </h3>
                                <Divider className="bg-slate-100 dark:bg-slate-800" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                                {/* Daily Rent */}
                                <div>
                                    <label className={labelCls}>Daily Rent (₹) <span className="text-rose-500">*</span></label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 font-bold text-sm pointer-events-none">₹</span>
                                        <input required type="number" name="rentalPrice" value={formData.rentalPrice}
                                            onChange={e => set("rentalPrice", e.target.value)}
                                            placeholder="0.00" className={prefixInputCls} />
                                    </div>
                                </div>

                                {/* Security Deposit */}
                                <div>
                                    <label className={labelCls}>Security Deposit (₹) <span className="text-rose-500">*</span></label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 font-bold text-sm pointer-events-none">₹</span>
                                        <input required type="number" name="securityDeposit" value={formData.securityDeposit}
                                            onChange={e => set("securityDeposit", e.target.value)}
                                            placeholder="0.00" className={prefixInputCls} />
                                    </div>
                                </div>

                                {/* Stock Quantity */}
                                <div>
                                    <label className={labelCls}>Stock Quantity <span className="text-rose-500">*</span></label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 pointer-events-none">
                                            <Cube size={15} />
                                        </span>
                                        <input required type="number" name="stock" value={formData.stock}
                                            onChange={e => set("stock", e.target.value)}
                                            placeholder="1" className={prefixInputCls} />
                                    </div>
                                </div>

                                {/* Item Condition */}
                                <div>
                                    <label className={labelCls}>Item Condition <span className="text-rose-500">*</span></label>
                                    <div className="relative">
                                        <select required value={formData.condition} onChange={e => set("condition", e.target.value)} className={selectCls}>
                                            <option value="New">New</option>
                                            <option value="Good">Good</option>
                                            <option value="Fair">Fair</option>
                                        </select>
                                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">▾</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Location & Media ── */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    <MapPin className="text-rose-500" /> Location & Media
                                </h3>
                                <Divider className="bg-slate-100 dark:bg-slate-800" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div>
                                    <label className={labelCls}>Pickup City <span className="text-rose-500">*</span></label>
                                    <input required name="city" value={formData.city} onChange={e => set("city", e.target.value)}
                                        placeholder="e.g. Bangalore" className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}>State <span className="text-rose-500">*</span></label>
                                    <input required name="state" value={formData.state} onChange={e => set("state", e.target.value)}
                                        placeholder="e.g. Karnataka" className={inputCls} />
                                </div>
                            </div>

                            <ImageUploader
                                multiple
                                label="Product Images"
                                onUploadMany={urls => setFormData(p => ({ ...p, images: urls }))}
                            />
                        </div>

                        {/* Submit */}
                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center gap-2 h-12 px-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold text-sm shadow-lg shadow-indigo-500/30 transition-all"
                            >
                                {loading ? (
                                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                ) : (
                                    <FloppyDisk size={18} weight="bold" />
                                )}
                                {loading ? "Publishing…" : "Publish Product"}
                            </button>
                        </div>
                    </CardBody>
                </Card>
            </motion.form>
        </div>
    );
}
