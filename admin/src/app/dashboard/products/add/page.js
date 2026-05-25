'use client';
import toast from 'react-hot-toast';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardBody, Textarea, Divider, CheckboxGroup, Checkbox } from "@heroui/react";
import { FloppyDisk, ArrowLeft, Tag, MapPin, CurrencyInr, Cube, ListPlus } from "@phosphor-icons/react";
import ImageUploader from "@/components/ImageUploader";

const inputCls = "w-full h-12 px-3 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-sm";
const prefixInputCls = "w-full h-12 pl-9 pr-3 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-sm";
const selectCls = "w-full h-12 px-3 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-base text-slate-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-sm";
const labelCls = "block text-xs font-bold text-slate-500 dark:text-slate-200 uppercase tracking-wider mb-2 ml-1";
const textareaCls = "w-full min-h-[120px] p-4 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-sm resize-none";

export default function AddProduct() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [allAddons, setAllAddons] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        brand: "",
        description: "",
        category: "",
        subcategory: "",
        rentalPrice: "",
        mrp: "",
        securityDeposit: "",
        stock: "1",
        condition: "New",
        city: "",
        state: "",
        deliveryTime: "",
        images: [],
        benefits: "Fully Functional\nAccessories Included\nFree Repairs & Maintenance\nProfessionally sanitized",
        specifications: "MODEL: \nDISPLAY: \nGRAPHICS: \nDIMENSIONS: \nOPERATING SYSTEM: \nMEMORY: \nPROCESSOR: \nSTORAGE: \nKEYBOARD: ",
        faqs: "",
        addons: [],
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
                const [catRes, addonRes] = await Promise.all([
                    fetch(`${API}/api/categories`),
                    fetch(`${API}/api/addons`)
                ]);

                const catData = await catRes.json();
                const addonData = await addonRes.json();

                setCategories(Array.isArray(catData) ? catData : catData.categories || []);
                setAllAddons(addonData);
            } catch (err) {
                console.error("Failed to fetch data", err);
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (formData.category) {
            const selectedCat = categories.find(c => c._id === formData.category);
            setSubcategories(selectedCat?.subcategories || []);
        } else {
            setSubcategories([]);
        }
    }, [formData.category, categories]);

    const set = (field, val) => setFormData(prev => ({ ...prev, [field]: val }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem("adminToken");
            if (!token) throw new Error("Not authenticated");

            const finalData = {
                ...formData,
                benefits: formData.benefits.split("\n").filter(b => b.trim() !== ""),
                specifications: formData.specifications.split("\n").map(s => {
                    const [key, value] = s.split(":");
                    return { label: key?.trim() || "", value: value?.trim() || "" };
                }).filter(s => s.label !== ""),
                faqs: (() => {
                    const lines = formData.faqs.split("\n").filter(l => l.trim() !== "");
                    const parsed = [];
                    for (let i = 0; i < lines.length; i += 2) {
                        parsed.push({
                            question: lines[i]?.trim() || "",
                            answer: lines[i + 1]?.trim() || ""
                        });
                    }
                    return parsed;
                })(),
                addons: formData.addons,
            };

            const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            const res = await fetch(`${API}/api/products`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(finalData)
            });

            if (res.ok) {
                router.push("/dashboard/products");
            } else {
                const err = await res.json();
                throw new Error(err.message || "Failed to create product");
            }
        } catch (err) {
            toast.error(err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full space-y-6 pb-12">
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
                        Add New <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">Product</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-200">List a new item in your inventory catalogue.</p>
                </motion.div>
            </div>

            <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm w-full">
                    <CardBody className="p-8 space-y-8">

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

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    <CurrencyInr weight="bold" className="text-indigo-500" /> Pricing & Inventory
                                </h3>
                                <Divider className="bg-slate-100 dark:bg-slate-800" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                                <div>
                                    <label className={labelCls}>Daily Rent / Monthly Rent (₹) <span className="text-rose-500">*</span></label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 font-bold text-sm pointer-events-none">₹</span>
                                        <input required type="number" name="rentalPrice" value={formData.rentalPrice}
                                            onChange={e => set("rentalPrice", e.target.value)}
                                            placeholder="0.00" className={prefixInputCls} />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelCls}>MRP / Original Price (₹)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 font-bold text-sm pointer-events-none">₹</span>
                                        <input type="number" name="mrp" value={formData.mrp}
                                            onChange={e => set("mrp", e.target.value)}
                                            placeholder="0.00" className={prefixInputCls} />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelCls}>Security Deposit (₹)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 font-bold text-sm pointer-events-none">₹</span>
                                        <input type="number" name="securityDeposit" value={formData.securityDeposit}
                                            onChange={e => set("securityDeposit", e.target.value)}
                                            placeholder="0.00" className={prefixInputCls} />
                                    </div>
                                </div>
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
                                <div>
                                    <label className={labelCls}>Delivery Time</label>
                                    <input name="deliveryTime" value={formData.deliveryTime} onChange={e => set("deliveryTime", e.target.value)}
                                        placeholder="e.g. 2-4 days" className={inputCls} />
                                </div>
                            </div>

                            <div className="space-y-6 mt-8">
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Tag className="text-indigo-500" /> Additional Details
                                    </h3>
                                    <Divider className="bg-slate-100 dark:bg-slate-800" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    <div>
                                        <label className={labelCls}>Benefits (One per line)</label>
                                        <textarea
                                            name="benefits"
                                            value={formData.benefits}
                                            onChange={e => set("benefits", e.target.value)}
                                            placeholder="Fully Functional&#10;Accessories Included"
                                            className={textareaCls}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Specifications (Label: Value per line)</label>
                                        <textarea
                                            name="specifications"
                                            value={formData.specifications}
                                            onChange={e => set("specifications", e.target.value)}
                                            placeholder="MODEL: MacBook Pro&#10;DISPLAY: 16 inches"
                                            className={textareaCls}
                                        />
                                    </div>
                                </div>

                                <div className="mt-8 space-y-4">
                                    <label className={labelCls}>Product FAQs (Alternating Lines)</label>
                                    <textarea
                                        name="faqs"
                                        value={formData.faqs}
                                        onChange={e => set("faqs", e.target.value)}
                                        placeholder="Question 1...&#10;Answer 1...&#10;Question 2...&#10;Answer 2..."
                                        className={textareaCls}
                                    />
                                </div>

                                <div className="mt-8 space-y-4">
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                            <ListPlus className="text-indigo-500" /> Available Add-ons
                                        </h3>
                                        <Divider className="bg-slate-100 dark:bg-slate-800" />
                                    </div>
                                    <Card className="bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 shadow-none">
                                        <CardBody className="p-6">
                                            <CheckboxGroup
                                                value={formData.addons}
                                                onValueChange={val => set("addons", val)}
                                                className="gap-4"
                                            >
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                                                    {allAddons.map(addon => (
                                                        <div key={addon._id} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 transition-colors">
                                                            <Checkbox value={addon._id} classNames={{ label: "w-full" }}>
                                                                <div className="flex flex-col ml-1">
                                                                    <span className="text-sm font-bold">{addon.name}</span>
                                                                    <span className="text-[10px] text-slate-500 line-clamp-1">{addon.price} - {addon.description}</span>
                                                                </div>
                                                            </Checkbox>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CheckboxGroup>
                                        </CardBody>
                                    </Card>
                                </div>
                            </div>

                            <ImageUploader
                                multiple
                                label="Product Images"
                                onUploadMany={urls => setFormData(p => ({ ...p, images: urls }))}
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center justify-center gap-2 h-12 px-10 rounded-xl !bg-indigo-600 hover:!bg-indigo-700 disabled:opacity-60 text-white font-semibold text-sm shadow-lg shadow-indigo-500/30 transition-all"
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
