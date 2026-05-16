"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
    Card, CardBody, Input, Textarea, Button,
    Select, SelectItem, Divider, Switch, Spinner, Chip
} from "@heroui/react";
import {
    FloppyDisk, ArrowLeft, Image as PhosphorImage,
    Tag, MapPin, Cube, CurrencyInr, Plus, Trash, CheckCircle
} from "@phosphor-icons/react";
import ImageUploader from "@/components/ImageUploader";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const getToken = () => localStorage.getItem("adminToken");

const WRAPPER_CLS = "h-12 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 transition-all shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20";

const EMPTY = {
    name: "", description: "", category: "", subcategory: "",
    brand: "", rentalPrice: "", securityDeposit: "",
    stock: "1", condition: "Good", city: "", state: "",
    images: [""],          // array of URL strings
    isActive: true,
    returnPolicy: "",
    shippingPolicy: "",
    mrp: "",
    benefits: "",
    specifications: "",
    faqs: "",
};

export default function EditProduct() {
    const router = useRouter();
    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [form, setForm] = useState(EMPTY);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);

    // ── Helpers ────────────────────────────────────────────────────────────────
    const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

    const setImage = (idx, val) =>
        setForm(p => { const imgs = [...p.images]; imgs[idx] = val; return { ...p, images: imgs }; });

    const addImageSlot = () =>
        setForm(p => ({ ...p, images: [...p.images, ""] }));

    const removeImage = (idx) =>
        setForm(p => ({ ...p, images: p.images.filter((_, i) => i !== idx) }));

    // ── Fetch categories ───────────────────────────────────────────────────────
    useEffect(() => {
        fetch(`${API}/api/categories`)
            .then(r => r.ok ? r.json() : [])
            .then(d => setCategories(Array.isArray(d) ? d : d.categories || []))
            .catch(console.error);
    }, []);

    // ── Fetch subcategories when category changes ──────────────────────────────
    useEffect(() => {
        if (!form.category) { setSubcategories([]); return; }
        const cat = categories.find(c => c._id === form.category || c.name === form.category);
        if (!cat?._id) { setSubcategories([]); return; }
        fetch(`${API}/api/categories/${cat._id}/subcategories`)
            .then(r => r.ok ? r.json() : [])
            .then(d => setSubcategories(Array.isArray(d) ? d : d.subcategories || []))
            .catch(() => setSubcategories([]));
    }, [form.category, categories]);

    // ── Load existing product ──────────────────────────────────────────────────
    const fetchProduct = useCallback(async () => {
        if (!id) return;
        try {
            setLoading(true);
            const res = await fetch(`${API}/api/products/${id}`);
            if (!res.ok) throw new Error("Product not found");
            const p = await res.json();

            setForm({
                name: p.name || "",
                description: p.description || "",
                category: p.category || "", // Initially use the name/ID as-is
                subcategory: p.subcategory?._id || p.subcategory || "",
                brand: p.brand || "",
                rentalPrice: String(p.rentalPrice ?? ""),
                securityDeposit: String(p.securityDeposit ?? ""),
                stock: String(p.stock ?? "1"),
                condition: p.condition || "Good",
                city: p.city || "",
                state: p.state || "",
                images: p.images?.length ? p.images : [""],
                isActive: p.isActive !== undefined ? p.isActive : true,
                returnPolicy: p.returnPolicy || "",
                shippingPolicy: p.shippingPolicy || "",
                mrp: String(p.mrp ?? ""),
                deliveryTime: p.deliveryTime || "2-4 days",
                benefits: p.benefits?.map(b => b.type || b).join("\n") || "",
                specifications: p.specifications?.map(s => `${s.label}: ${s.value}`).join("\n") || "",
                faqs: p.faqs?.map(f => `${f.question}\n${f.answer}`).join("\n\n") || "",
            });
        } catch (err) {
            console.error("Fetch Error:", err);
            alert(err.message);
            router.push("/dashboard/products");
        } finally {
            setLoading(false);
        }
    }, [id, router]);

    // Load product once on mount
    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    // Resolve category ID once categories are loaded
    useEffect(() => {
        if (!loading && categories.length > 0 && form.category) {
            const matchedCat = categories.find(c => c.name === form.category || c._id === form.category);
            if (matchedCat && matchedCat._id !== form.category) {
                set("category", matchedCat._id);
            }
        }
    }, [categories, loading, form.category]);

    // ── Save ──────────────────────────────────────────────────────────────────
    const handleSave = async () => {
        if (!form.name || !form.rentalPrice || !form.securityDeposit || !form.city || !form.state) {
            alert("Please fill all required fields.");
            return;
        }
        try {
            setSaving(true);

            // Resolve category name from selected id
            const selCat = categories.find(c => c._id === form.category);
            const catName = selCat ? selCat.name : form.category;

            const payload = {
                name: form.name,
                description: form.description,
                category: catName,
                subcategory: form.subcategory || "",
                brand: form.brand,
                rentalPrice: Number(form.rentalPrice),
                securityDeposit: Number(form.securityDeposit),
                stock: Number(form.stock),
                condition: form.condition,
                city: form.city,
                state: form.state,
                images: form.images.filter(Boolean),
                isActive: form.isActive,
                returnPolicy: form.returnPolicy,
                shippingPolicy: form.shippingPolicy,
                mrp: Number(form.mrp) || 0,
                deliveryTime: form.deliveryTime,
                benefits: form.benefits.split("\n").map(b => b.trim()).filter(Boolean),
                specifications: form.specifications.split("\n").filter(Boolean).map(line => {
                    const [label, ...valArr] = line.split(":");
                    return { label: label?.trim() || "", value: valArr.join(":").trim() || "" };
                }),
                faqs: (() => {
                    const lines = form.faqs.split("\n").filter(line => line.trim() !== "");
                    const parsed = [];
                    for (let i = 0; i < lines.length; i += 2) {
                        parsed.push({
                            question: lines[i]?.trim() || "",
                            answer: lines[i + 1]?.trim() || ""
                        });
                    }
                    return parsed;
                })(),
            };

            const res = await fetch(`${API}/api/products/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error((await res.json()).message || "Failed to update");

            setSaved(true);
            setTimeout(() => { setSaved(false); router.push("/dashboard/products"); }, 1500);
        } catch (err) {
            alert(err.message);
        } finally {
            setSaving(false);
        }
    };

    // ── Loading state ─────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Spinner size="lg" color="secondary" />
                <p className="text-slate-500 font-medium">Loading product…</p>
            </div>
        );
    }

    return (
        <div className="w-full space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <Button
                        variant="light"
                        className="mb-2 text-slate-500 dark:text-slate-400 p-0 hover:bg-transparent hover:text-indigo-500"
                        startContent={<ArrowLeft />}
                        onPress={() => router.push("/dashboard/products")}
                    >
                        Back to Products
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Edit <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Product</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-mono">ID: {id}</p>
                </motion.div>

                <div className="flex items-center gap-3">
                    {saved && (
                        <Chip color="success" variant="flat" size="sm" startContent={<CheckCircle size={14} weight="fill" />}>
                            Saved! Redirecting…
                        </Chip>
                    )}
                    {/* Active / Draft toggle */}
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            {form.isActive ? "Active" : "Draft"}
                        </span>
                        <Switch
                            isSelected={form.isActive}
                            onValueChange={v => set("isActive", v)}
                            color="success"
                            size="sm"
                        />
                    </div>
                    <Button
                        color="primary"
                        size="lg"
                        isLoading={saving}
                        startContent={!saving && <FloppyDisk size={18} />}
                        className="font-bold px-10 shadow-lg shadow-indigo-500/30 bg-indigo-600"
                        onPress={handleSave}
                    >
                        Update Product
                    </Button>
                </div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm w-full">
                    <CardBody className="p-8 space-y-10">

                        {/* ── Basic Information ── */}
                        <section className="space-y-6">
                            <div className="space-y-1">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Tag className="text-indigo-500" size={18} /> Basic Information
                                </h3>
                                <Divider className="bg-slate-100 dark:bg-slate-800" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                        Product Name <span className="text-rose-500">*</span>
                                    </label>
                                    <Input
                                        value={form.name}
                                        onValueChange={v => set("name", v)}
                                        placeholder="Enter product title"
                                        variant="bordered"
                                        classNames={{ inputWrapper: WRAPPER_CLS }}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Brand Name</label>
                                    <Input
                                        value={form.brand}
                                        onValueChange={v => set("brand", v)}
                                        placeholder="e.g. Apple, Sony, Nikon"
                                        variant="bordered"
                                        classNames={{ inputWrapper: WRAPPER_CLS }}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                    Description <span className="text-rose-500">*</span>
                                </label>
                                <Textarea
                                    value={form.description}
                                    onValueChange={v => set("description", v)}
                                    placeholder="Describe features, colors, accessories included…"
                                    variant="bordered"
                                    minRows={4}
                                    classNames={{ inputWrapper: "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60" }}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                        Primary Category <span className="text-rose-500">*</span>
                                    </label>
                                    <Select
                                        placeholder="Select a category"
                                        variant="bordered"
                                        selectedKeys={form.category ? [form.category] : []}
                                        onSelectionChange={keys => set("category", Array.from(keys)[0] || "")}
                                        classNames={{
                                            trigger: WRAPPER_CLS,
                                            value: "text-slate-900 dark:text-slate-100",
                                        }}
                                        popoverProps={{
                                            classNames: {
                                                content: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-1",
                                            }
                                        }}
                                    >
                                        {categories.map(cat => (
                                            <SelectItem key={cat._id} textValue={cat.name} className="text-slate-900 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Sub-Category</label>
                                    <Select
                                        placeholder={subcategories.length ? "Choose sub-category" : "Select category first"}
                                        variant="bordered"
                                        isDisabled={subcategories.length === 0}
                                        selectedKeys={form.subcategory ? [form.subcategory] : []}
                                        onSelectionChange={keys => set("subcategory", Array.from(keys)[0] || "")}
                                        classNames={{
                                            trigger: WRAPPER_CLS,
                                            value: "text-slate-900 dark:text-slate-100",
                                        }}
                                        popoverProps={{
                                            classNames: {
                                                content: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-1",
                                            }
                                        }}
                                    >
                                        {subcategories.map(sub => (
                                            <SelectItem key={sub._id} textValue={sub.name} className="text-slate-900 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
                                                {sub.name}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </div>
                            </div>
                        </section>

                        {/* ── Pricing & Inventory ── */}
                        <section className="space-y-6">
                            <div className="space-y-1">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <CurrencyInr weight="bold" className="text-indigo-500" size={18} /> Pricing & Inventory
                                </h3>
                                <Divider className="bg-slate-100 dark:bg-slate-800" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                        Rental Price (₹/mo) <span className="text-rose-500">*</span>
                                    </label>
                                    <Input
                                        type="number"
                                        value={form.rentalPrice}
                                        onValueChange={v => set("rentalPrice", v)}
                                        placeholder="0"
                                        variant="bordered"
                                        startContent={<span className="text-indigo-500 font-bold text-sm">₹</span>}
                                        classNames={{ inputWrapper: WRAPPER_CLS }}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                        Security Deposit (₹) <span className="text-rose-500">*</span>
                                    </label>
                                    <Input
                                        type="number"
                                        value={form.securityDeposit}
                                        onValueChange={v => set("securityDeposit", v)}
                                        placeholder="0"
                                        variant="bordered"
                                        startContent={<span className="text-indigo-500 font-bold text-sm">₹</span>}
                                        classNames={{ inputWrapper: WRAPPER_CLS }}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                        Stock Qty <span className="text-rose-500">*</span>
                                    </label>
                                    <Input
                                        type="number"
                                        value={form.stock}
                                        onValueChange={v => set("stock", v)}
                                        placeholder="1"
                                        variant="bordered"
                                        startContent={<Cube className="text-indigo-500" size={15} />}
                                        classNames={{ inputWrapper: WRAPPER_CLS }}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                        Condition <span className="text-rose-500">*</span>
                                    </label>
                                    <Select
                                        variant="bordered"
                                        selectedKeys={[form.condition]}
                                        onSelectionChange={keys => set("condition", Array.from(keys)[0] || "Good")}
                                        classNames={{
                                            trigger: WRAPPER_CLS,
                                            value: "text-slate-900 dark:text-slate-100",
                                        }}
                                        popoverProps={{
                                            classNames: {
                                                content: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-1",
                                            }
                                        }}
                                    >
                                        <SelectItem key="New" textValue="New" className="text-slate-900 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">New</SelectItem>
                                        <SelectItem key="Good" textValue="Good" className="text-slate-900 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">Good</SelectItem>
                                        <SelectItem key="Fair" textValue="Fair" className="text-slate-900 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">Fair</SelectItem>
                                    </Select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                        MRP / Original Price (₹)
                                    </label>
                                    <Input
                                        type="number"
                                        value={form.mrp}
                                        onValueChange={v => set("mrp", v)}
                                        placeholder="0"
                                        variant="bordered"
                                        startContent={<span className="text-indigo-500 font-bold text-sm">₹</span>}
                                        classNames={{ inputWrapper: WRAPPER_CLS }}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* ── Policies & Additional Info ── */}
                        <section className="space-y-6">
                            <div className="space-y-1">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <FloppyDisk className="text-indigo-500" size={18} /> Policies & Details
                                </h3>
                                <Divider className="bg-slate-100 dark:bg-slate-800" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Return Policy</label>
                                    <Textarea
                                        value={form.returnPolicy}
                                        onValueChange={v => set("returnPolicy", v)}
                                        placeholder="Enter return policy terms..."
                                        variant="bordered"
                                        minRows={3}
                                        classNames={{ inputWrapper: "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60" }}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Shipping Policy</label>
                                    <Textarea
                                        value={form.shippingPolicy}
                                        onValueChange={v => set("shippingPolicy", v)}
                                        placeholder="Enter shipping & delivery terms..."
                                        variant="bordered"
                                        minRows={3}
                                        classNames={{ inputWrapper: "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60" }}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* ── Location ── */}
                        <section className="space-y-6">
                            <div className="space-y-1">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <MapPin className="text-rose-500" size={18} /> Location
                                </h3>
                                <Divider className="bg-slate-100 dark:bg-slate-800" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                        City <span className="text-rose-500">*</span>
                                    </label>
                                    <Input value={form.city} onValueChange={v => set("city", v)} placeholder="e.g. Bangalore" variant="bordered" classNames={{ inputWrapper: WRAPPER_CLS }} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                        State <span className="text-rose-500">*</span>
                                    </label>
                                    <Input value={form.state} onValueChange={v => set("state", v)} placeholder="e.g. Karnataka" variant="bordered" classNames={{ inputWrapper: WRAPPER_CLS }} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                        Delivery Time
                                    </label>
                                    <Input value={form.deliveryTime} onValueChange={v => set("deliveryTime", v)} placeholder="e.g. 2-4 days" variant="bordered" classNames={{ inputWrapper: WRAPPER_CLS }} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Benefits (One per line)</label>
                                    <Textarea
                                        value={form.benefits}
                                        onValueChange={v => set("benefits", v)}
                                        placeholder="Fully Functional&#10;Accessories Included"
                                        variant="bordered"
                                        minRows={5}
                                        classNames={{ inputWrapper: "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60" }}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Specifications (Label: Value per line)</label>
                                    <Textarea
                                        value={form.specifications}
                                        onValueChange={v => set("specifications", v)}
                                        placeholder="MODEL: MacBook Pro&#10;DISPLAY: 16 inches"
                                        variant="bordered"
                                        minRows={5}
                                        classNames={{ inputWrapper: "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60" }}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 mt-6">
                                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Product FAQs (Alternating Lines)</label>
                                <Textarea
                                    value={form.faqs}
                                    onValueChange={v => set("faqs", v)}
                                    placeholder="Question 1...&#10;Answer 1...&#10;Question 2...&#10;Answer 2..."
                                    variant="bordered"
                                    minRows={4}
                                    classNames={{ inputWrapper: "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60" }}
                                />
                            </div>
                        </section>

                        {/* ── Images ── */}
                        <section className="space-y-6">
                            <div className="space-y-1">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <PhosphorImage className="text-indigo-500" size={18} /> Product Images
                                </h3>
                                <Divider className="bg-slate-100 dark:bg-slate-800" />
                            </div>
                            <p className="text-xs text-slate-400">
                                Upload new images or keep the existing ones. The first image is the primary listing photo.
                            </p>

                            {/* Upload new images */}
                            <ImageUploader
                                multiple
                                existingUrls={form.images}
                                label="Product Images"
                                onUploadMany={urls =>
                                    setForm(p => ({
                                        ...p,
                                        images: urls,
                                    }))
                                }
                            />
                        </section>

                        {/* Save button */}
                        <div className="flex justify-end pt-2">
                            <Button
                                color="primary"
                                size="lg"
                                isLoading={saving}
                                startContent={!saving && <FloppyDisk size={18} />}
                                className="font-bold px-12 shadow-lg shadow-indigo-500/20 bg-indigo-600"
                                onPress={handleSave}
                            >
                                Update Product
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </motion.div>
        </div>
    );
}
