'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
    Card, CardBody, Divider, Input,
    Textarea, Tabs, Tab, Switch, Spinner,
    Button, Badge, Chip,
} from "@heroui/react";
import {
    Layout, Image as PhosphorImage, FloppyDisk,
    CheckCircle, Warning, Globe, ShieldCheck, ChartLineUp,
    Plus, Trash, ArrowsLeftRight, Tag, Star, Package, CaretRight, ChatText
} from "@phosphor-icons/react";
import ImageUploader from "@/components/ImageUploader";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const getToken = () => typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

// The default empty state mirroring our backend schema
const DEFAULTS = {
    publishStatus: "published",

    heroEnabled: true,
    heroSlides: [{
        title: "The Tech That Powers Your Ambition. On Demand.",
        subtitle: "Get the latest MacBooks, Workstations, Cameras, and more.",
        image: "",
        bgColor: "#00A8FF",
        ctaText: "Rent Now",
        ctaLink: "/products"
    }],

    bestRentedEnabled: true,
    bestRentedTitle: "Best Rented Products",
    bestRentedProductIds: [],

    newLaunchEnabled: true,
    newLaunchTitle: "New Launches This Week",
    newLaunchProductIds: [],

    rentalProcessEnabled: true,
    rentalProcessTitle: "Rental Process",
    rentalProcessSubtitle: "Choose, secure, receive, and create with zero hassle. No installation, no configuration, no delay.",
    rentalProcessSteps: [
        { title: "Choose Your Tech", description: "Browse our curated selection...", icon: "FaLaptopCode", highlight: true },
        { title: "Complete KYC", description: "Pick a flexible rental tenure...", icon: "FaUserCheck", highlight: false },
        { title: "Secure Your Order", description: "Confirm your rental...", icon: "FaShieldAlt", highlight: false },
        { title: "Receive & Create", description: "We deliver your tech...", icon: "FaBoxOpen", highlight: false }
    ],

    testimonialsEnabled: true,
    testimonialSectionTitle: "What Our Customers Say",
    testimonialSectionSubtitle: "Real experiences from innovators...",
    testimonialGoogleReviewCount: "5000+",
    testimonialGoogleRating: "4.9",

    whyChooseUsTitle: "Why Choose Us?",
    whyChooseUsSubtitle: "",
    whyChooseUsImage: "",
    statsDevices: "90k+",
    statsCustomers: "30k+",
    statsCities: "401+",

    metaTitle: "",
    metaDescription: "",
};


// ── Helper Component for Product Search/Selection ──────────────────────────
const ProductSelector = ({ label, selectedIds, onChange }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);

    // Fetch initial selected products info
    useEffect(() => {
        if (!selectedIds || selectedIds.length === 0) {
            setSelectedProducts([]);
            return;
        }

        const fetchSelected = async () => {
            try {
                // If the IDs haven't changed, don't re-fetch
                if (selectedProducts.length === selectedIds.length &&
                    selectedProducts.every(p => selectedIds.includes(p._id))) {
                    return;
                }

                // Since we don't have a /api/products/batch route, we fetch them via general query or individually
                // To save requests, we'll just fetch all products and filter for now (or let the user pick again)
                // For a true enterprise app we'd add `?ids=id1,id2` to the backend.

                // Temporary workaround: Fetch page 1 (since usually featured products are recent) 
                // and just cache anything they search. If they reload, they just see IDs unless we fetch.
                const res = await fetch(`${API}/api/products`);
                if (res.ok) {
                    const data = await res.json();
                    const matched = data.products.filter(p => selectedIds.includes(p._id));
                    // we'll at least show the matched ones.
                    // To be safe and show *all* selected, we should ideally fetch by ID individually.
                    const finalProducts = [...matched];

                    // Fetch any missing ones directly
                    const missingIds = selectedIds.filter(id => !matched.some(m => m._id === id));
                    for (const id of missingIds) {
                        const singleRes = await fetch(`${API}/api/products/${id}`);
                        if (singleRes.ok) finalProducts.push(await singleRes.json());
                    }
                    setSelectedProducts(finalProducts);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchSelected();
    }, [selectedIds]);

    const handleSearch = async (val) => {
        setQuery(val);
        if (val.length < 2) {
            setResults([]);
            return;
        }
        setSearching(true);
        try {
            const res = await fetch(`${API}/api/products?keyword=${val}&limit=5`);
            if (res.ok) {
                const data = await res.json();
                setResults(data.products || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSearching(false);
        }
    };

    const addProduct = (prod) => {
        if (selectedIds.includes(prod._id)) return;
        const newIds = [...selectedIds, prod._id];
        setSelectedProducts([...selectedProducts, prod]);
        onChange(newIds);
        setQuery("");
        setResults([]);
    };

    const removeProduct = (id) => {
        const newIds = selectedIds.filter(i => i !== id);
        setSelectedProducts(selectedProducts.filter(p => p._id !== id));
        onChange(newIds);
    };

    return (
        <div className="space-y-4 bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{label}</h4>

            {/* Selected Pills */}
            <div className="flex flex-wrap gap-2">
                {selectedProducts.map((p) => (
                    <Chip
                        key={p._id}
                        onClose={() => removeProduct(p._id)}
                        variant="flat"
                        color="secondary"
                        avatar={p.images?.[0] ? <img src={p.images[0]} alt="" className="object-cover" /> : null}
                    >
                        {p.name}
                    </Chip>
                ))}
                {selectedProducts.length === 0 && (
                    <span className="text-xs text-slate-400 italic">No products selected yet. Search below to add.</span>
                )}
            </div>

            {/* Search Input */}
            <div className="relative">
                <Input
                    value={query}
                    onValueChange={handleSearch}
                    placeholder="Search by product name..."
                    variant="bordered"
                    startContent={<PhosphorImage className="text-slate-400" />}
                    endContent={searching ? <Spinner size="sm" /> : null}
                />

                {/* Search Results Dropdown */}
                {results.length > 0 && query.length >= 2 && (
                    <div className="absolute z-50 top-full left-0 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden max-h-[300px] overflow-y-auto">
                        {results.map((r) => (
                            <button
                                key={r._id}
                                onClick={() => addProduct(r)}
                                className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left border-b border-slate-50 dark:border-slate-800/50 last:border-0"
                            >
                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                                    {r.images?.[0] ? <img src={r.images[0]} className="w-full h-full object-cover" /> : <Package size={20} />}
                                </div>
                                <div className="flex flex-col flex-1 truncate">
                                    <span className="text-sm font-semibold truncate text-slate-900 dark:text-white">{r.name}</span>
                                    <span className="text-xs text-slate-500">{r.category} • ₹{r.rentalPrice}/mo</span>
                                </div>
                                {selectedIds.includes(r._id) && (
                                    <CheckCircle size={18} weight="fill" className="text-emerald-500" />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};



// ── Main Page Component ───────────────────────────────────────────────────────
export default function CMSHomepage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [data, setData] = useState(DEFAULTS);

    const set = (key, val) => setData(prev => ({ ...prev, [key]: val }));

    const fetchCMS = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API}/api/cms/homepage`);
            if (res.ok) {
                const d = await res.json();

                // Handle backwards compatibility for single-hero CMS structure
                if (d.heroSlides?.length === 0 && d.heroTitle) {
                    d.heroSlides = [{
                        title: d.heroTitle,
                        subtitle: d.heroSubtitle,
                        image: d.heroImage,
                        bgColor: d.heroBgColor || "#00A8FF",
                        ctaText: "Rent Now",
                        ctaLink: "/products"
                    }];
                } else if (!d.heroSlides || d.heroSlides.length === 0) {
                    d.heroSlides = DEFAULTS.heroSlides;
                }

                if (!d.rentalProcessSteps || d.rentalProcessSteps.length === 0) {
                    d.rentalProcessSteps = DEFAULTS.rentalProcessSteps;
                }

                setData({ ...DEFAULTS, ...d });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchCMS(); }, [fetchCMS]);

    const handleSave = async () => {
        try {
            setSaving(true);
            const res = await fetch(`${API}/api/cms/homepage`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error((await res.json()).message || "Failed to save");
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            alert(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                <Spinner size="lg" color="secondary" />
                <p className="text-slate-500 font-medium">Loading Homepage CMS…</p>
            </div>
        );
    }

    return (
        <div className="w-full space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Homepage <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Editor</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Manage all homepage sections natively inside the platform.
                    </p>
                </motion.div>

                <div className="flex items-center gap-3">
                    {saved && (
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-sm font-semibold bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-full px-3 py-1.5 animate-pulse">
                            <CheckCircle size={14} weight="fill" />
                            Saved Successfully!
                        </div>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 h-10 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all"
                    >
                        {saving ? <Spinner size="sm" color="white" /> : <FloppyDisk size={18} weight="bold" />}
                        {saving ? "Publishing…" : "Publish Changes"}
                    </button>
                </div>
            </div>

            {/* TAB SYSTEM */}
            <Tabs aria-label="Homepage Sections" color="primary" variant="underlined"
                classNames={{ tabList: "gap-6 border-b border-slate-200 dark:border-slate-800 w-full overflow-x-auto", cursor: "w-full bg-indigo-500", tab: "max-w-fit px-0 h-12" }}>

                {/* ── HERO TAB ── */}
                <Tab key="hero" title={<div className="flex items-center gap-2"><Layout size={15} /><span>Hero Highlights</span></div>}>
                    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mt-4 shadow-sm">
                        <CardBody className="p-6 md:p-8 space-y-8">
                            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                                <div>
                                    <h4 className="text-base font-bold text-slate-900 dark:text-white">Hero Visibility</h4>
                                    <p className="text-sm text-slate-500">Show or hide the main slider at the top of the homepage.</p>
                                </div>
                                <Switch isSelected={data.heroEnabled} onValueChange={(v) => set("heroEnabled", v)} color="success" />
                            </div>

                            <Divider />

                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-bold flex items-center gap-2"><PhosphorImage /> Carousel Slides</h3>
                                    <Button
                                        size="sm" color="primary" variant="flat" startContent={<Plus />}
                                        onClick={() => {
                                            set("heroSlides", [...data.heroSlides, { title: "New Slide", subtitle: "", image: "", bgColor: "#333333", ctaText: "Rent Now", ctaLink: "/products" }]);
                                        }}
                                    >
                                        Add Slide
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {data.heroSlides.map((slide, index) => (
                                        <div key={index} className="p-5 border border-slate-200 dark:border-slate-700 rounded-2xl relative bg-white dark:bg-slate-950 shadow-xs">
                                            {/* Delete Btn */}
                                            {data.heroSlides.length > 1 && (
                                                <button
                                                    onClick={() => {
                                                        const newSlides = [...data.heroSlides];
                                                        newSlides.splice(index, 1);
                                                        set("heroSlides", newSlides);
                                                    }}
                                                    className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                                >
                                                    <Trash size={18} />
                                                </button>
                                            )}

                                            <div className="flex items-center gap-3 mb-4">
                                                <span className="w-7 h-7 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-xs">#{index + 1}</span>
                                                <h4 className="font-semibold text-slate-800 dark:text-slate-200">Slide Configuration</h4>
                                            </div>

                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                {/* Text side */}
                                                <div className="space-y-4">
                                                    <Input
                                                        label="Headline"
                                                        value={slide.title} onValueChange={(v) => { const n = [...data.heroSlides]; n[index].title = v; set("heroSlides", n); }}
                                                        placeholder="The Tech That Powers Your Ambition." variant="bordered"
                                                    />
                                                    <Textarea
                                                        label="Sub-headline"
                                                        value={slide.subtitle} onValueChange={(v) => { const n = [...data.heroSlides]; n[index].subtitle = v; set("heroSlides", n); }}
                                                        placeholder="Get the latest MacBooks right now..." variant="bordered" rows={2}
                                                    />
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <Input
                                                            label="CTA Button Text"
                                                            value={slide.ctaText} onValueChange={(v) => { const n = [...data.heroSlides]; n[index].ctaText = v; set("heroSlides", n); }}
                                                            variant="bordered"
                                                        />
                                                        <Input
                                                            label="CTA Button Link"
                                                            value={slide.ctaLink} onValueChange={(v) => { const n = [...data.heroSlides]; n[index].ctaLink = v; set("heroSlides", n); }}
                                                            variant="bordered"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-bold text-slate-600 block mb-2">Background Color (Hex)</label>
                                                        <div className="flex items-center gap-3">
                                                            <input type="color" value={slide.bgColor} onChange={(e) => { const n = [...data.heroSlides]; n[index].bgColor = e.target.value; set("heroSlides", n); }} className="w-10 h-10 rounded cursor-pointer" />
                                                            <Input value={slide.bgColor} onValueChange={(v) => { const n = [...data.heroSlides]; n[index].bgColor = v; set("heroSlides", n); }} variant="bordered" className="flex-1" />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Image Side */}
                                                <div className="space-y-4">
                                                    <ImageUploader
                                                        label="Foreground Image (Transparent PNG Recommended)"
                                                        existingUrl={slide.image}
                                                        onUpload={url => { const n = [...data.heroSlides]; n[index].image = url; set("heroSlides", n); }}
                                                    />
                                                    {slide.image && (
                                                        <div className="h-32 rounded-xl bg-slate-100 flex items-center justify-center p-2 border border-slate-200" style={{ backgroundColor: slide.bgColor }}>
                                                            <img src={slide.image} className="max-h-full max-w-full object-contain mix-blend-normal drop-shadow-xl" alt="Preview" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Tab>

                {/* ── PRODUCTS GRID TAB ── */}
                <Tab key="products" title={<div className="flex items-center gap-2"><Package size={15} /><span>Curated Grids</span></div>}>
                    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mt-4 shadow-sm">
                        <CardBody className="p-6 md:p-8 space-y-10">

                            {/* Best Rented */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><Star weight="fill" /></div>
                                        <div>
                                            <h3 className="text-lg font-bold">Best Rented Products</h3>
                                            <p className="text-sm text-slate-500">Pick exactly which products to display on the homepage.</p>
                                        </div>
                                    </div>
                                    <Switch isSelected={data.bestRentedEnabled} onValueChange={(v) => set("bestRentedEnabled", v)} color="success" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        label="Section Title"
                                        value={data.bestRentedTitle} onValueChange={(v) => set("bestRentedTitle", v)}
                                        variant="bordered" placeholder="e.g. Best Rented Products"
                                    />
                                    <div className="md:col-span-2">
                                        <ProductSelector
                                            label="Select Products to Feature (Recommend exactly 4 or 8)"
                                            selectedIds={data.bestRentedProductIds}
                                            onChange={(ids) => set("bestRentedProductIds", ids)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* New Launches */}
                            <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><Tag weight="bold" /></div>
                                        <div>
                                            <h3 className="text-lg font-bold">New Launches Grid</h3>
                                            <p className="text-sm text-slate-500">Feature the latest equipment added to your inventory.</p>
                                        </div>
                                    </div>
                                    <Switch isSelected={data.newLaunchEnabled} onValueChange={(v) => set("newLaunchEnabled", v)} color="success" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        label="Section Title"
                                        value={data.newLaunchTitle} onValueChange={(v) => set("newLaunchTitle", v)}
                                        variant="bordered" placeholder="e.g. New Launches This Week"
                                    />
                                    <div className="md:col-span-2">
                                        <ProductSelector
                                            label="Select Products to Feature (Recommend exactly 4 or 8)"
                                            selectedIds={data.newLaunchProductIds}
                                            onChange={(ids) => set("newLaunchProductIds", ids)}
                                        />
                                    </div>
                                </div>
                            </div>

                        </CardBody>
                    </Card>
                </Tab>

                {/* ── ONBOARDING / KYC TAB ── */}
                <Tab key="process" title={<div className="flex items-center gap-2"><ArrowsLeftRight size={15} /><span>Rental Process</span></div>}>
                    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mt-4 shadow-sm">
                        <CardBody className="p-6 md:p-8 space-y-8">

                            <div className="flex flex-col md:flex-row gap-6 mb-8 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl">
                                <div className="flex-1 space-y-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-lg font-bold">Process Settings</h3>
                                        <Switch isSelected={data.rentalProcessEnabled} onValueChange={(v) => set("rentalProcessEnabled", v)} color="success" size="sm" />
                                    </div>
                                    <Input
                                        label="Section Title"
                                        value={data.rentalProcessTitle} onValueChange={(v) => set("rentalProcessTitle", v)}
                                        variant="bordered"
                                    />
                                    <Textarea
                                        label="Section Subtitle"
                                        value={data.rentalProcessSubtitle} onValueChange={(v) => set("rentalProcessSubtitle", v)}
                                        variant="bordered" rows={2}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between items-center bg-slate-900 text-white px-5 py-3 rounded-t-xl">
                                <h4 className="font-semibold text-sm">Flow Steps Configuration</h4>
                                <Button size="sm" variant="flat" className="bg-white/20 text-white"
                                    onClick={() => set("rentalProcessSteps", [...data.rentalProcessSteps, { title: "New Step", description: "Write description...", icon: "FaSearch", highlight: false }])}>
                                    + Add Step
                                </Button>
                            </div>

                            <div className="space-y-4 border border-slate-200 dark:border-slate-800 rounded-b-xl p-4 md:p-6 bg-slate-50/50 dark:bg-slate-900/50">
                                {data.rentalProcessSteps.map((step, idx) => (
                                    <div key={idx} className={`p-5 rounded-xl border relative shadow-xs transition-colors ${step.highlight ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200 dark:bg-slate-950 dark:border-slate-800'}`}>

                                        <div className="flex justify-between mb-4">
                                            <span className="font-bold text-slate-400">Step {idx + 1}</span>
                                            <div className="flex items-center gap-4">
                                                <Switch size="sm" isSelected={step.highlight} onValueChange={(v) => { const n = [...data.rentalProcessSteps]; n[idx].highlight = v; set("rentalProcessSteps", n); }}>
                                                    <span className="text-xs text-slate-500">Yellow Highlight Container</span>
                                                </Switch>
                                                <button onClick={() => { const n = [...data.rentalProcessSteps]; n.splice(idx, 1); set("rentalProcessSteps", n); }} className="text-red-500 hover:text-red-700">
                                                    <Trash size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-4">
                                                <Input
                                                    label="Title" size="sm"
                                                    value={step.title} onValueChange={(v) => { const n = [...data.rentalProcessSteps]; n[idx].title = v; set("rentalProcessSteps", n); }}
                                                    variant="bordered"
                                                />
                                                <Input
                                                    label="React Icon Name (e.g. FaUserCheck)" size="sm"
                                                    value={step.icon} onValueChange={(v) => { const n = [...data.rentalProcessSteps]; n[idx].icon = v; set("rentalProcessSteps", n); }}
                                                    variant="bordered"
                                                />
                                            </div>
                                            <div>
                                                <Textarea
                                                    label="Body Description"
                                                    value={step.description} onValueChange={(v) => { const n = [...data.rentalProcessSteps]; n[idx].description = v; set("rentalProcessSteps", n); }}
                                                    variant="bordered" rows={3}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </CardBody>
                    </Card>
                </Tab>

                {/* ── TESTIMONIALS & WHY CHOOSE US TAB ── */}
                <Tab key="trust" title={<div className="flex items-center gap-2"><ChatText size={15} /><span>Trust Factors</span></div>}>
                    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mt-4 shadow-sm">
                        <CardBody className="p-6 md:p-8 space-y-12">

                            {/* Testimonials */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Star weight="fill" /></div>
                                        <div>
                                            <h3 className="text-lg font-bold">Testimonials Section header</h3>
                                            <p className="text-sm text-slate-500">Review content is managed in the Testimonials tab. Configure UI here.</p>
                                        </div>
                                    </div>
                                    <Switch isSelected={data.testimonialsEnabled} onValueChange={(v) => set("testimonialsEnabled", v)} color="success" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        label="Section Title"
                                        value={data.testimonialSectionTitle} onValueChange={(v) => set("testimonialSectionTitle", v)}
                                        variant="bordered"
                                    />
                                    <Input
                                        label="Google Review Count Badge"
                                        value={data.testimonialGoogleReviewCount} onValueChange={(v) => set("testimonialGoogleReviewCount", v)}
                                        variant="bordered" placeholder="e.g. 5000+"
                                    />
                                    <div className="md:col-span-2">
                                        <Textarea
                                            label="Section Subtitle"
                                            value={data.testimonialSectionSubtitle} onValueChange={(v) => set("testimonialSectionSubtitle", v)}
                                            variant="bordered" rows={2}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Why Choose Us */}
                            <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><ShieldCheck weight="fill" /></div>
                                    <div>
                                        <h3 className="text-lg font-bold">Why Choose Us Block</h3>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <Input
                                            label="Headline"
                                            value={data.whyChooseUsTitle} onValueChange={(v) => set("whyChooseUsTitle", v)}
                                            variant="bordered"
                                        />
                                        <Textarea
                                            label="Description text"
                                            value={data.whyChooseUsSubtitle} onValueChange={(v) => set("whyChooseUsSubtitle", v)}
                                            variant="bordered" rows={5}
                                        />

                                        <div className="grid grid-cols-3 gap-3 pt-2">
                                            <Input label="Devices Stat" size="sm" value={data.statsDevices} onValueChange={v => set("statsDevices", v)} variant="bordered" />
                                            <Input label="Customers Stat" size="sm" value={data.statsCustomers} onValueChange={v => set("statsCustomers", v)} variant="bordered" />
                                            <Input label="Cities Stat" size="sm" value={data.statsCities} onValueChange={v => set("statsCities", v)} variant="bordered" />
                                        </div>
                                    </div>
                                    <div>
                                        <ImageUploader
                                            label="Corporate Image"
                                            existingUrl={data.whyChooseUsImage}
                                            onUpload={url => set("whyChooseUsImage", url)}
                                        />
                                        {data.whyChooseUsImage && (
                                            <div className="aspect-[4/3] w-full mt-4 rounded-xl overflow-hidden shadow-md">
                                                <img src={data.whyChooseUsImage} className="w-full h-full object-cover" alt="Preview" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </CardBody>
                    </Card>
                </Tab>

                {/* ── SEO INFO TAB ── */}
                <Tab key="seo" title={<div className="flex items-center gap-2"><Globe size={15} /><span>SEO Meta Settings</span></div>}>
                    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mt-4">
                        <CardBody className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Meta Title</label>
                                <Input
                                    value={data.metaTitle}
                                    onValueChange={(v) => set("metaTitle", v)}
                                    placeholder="IndianRentals – Rent Everything You Need"
                                    variant="bordered"
                                    classNames={{ inputWrapper: "h-12" }}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Meta Description</label>
                                <Textarea
                                    value={data.metaDescription}
                                    onValueChange={(v) => set("metaDescription", v)}
                                    placeholder="Find and rent premium gadgets..."
                                    variant="bordered"
                                    rows={3}
                                />
                            </div>

                            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 space-y-1">
                                <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-2">Google Custom Snippet Preview</p>
                                <p className="text-[#1a0dab] text-lg hover:underline cursor-pointer">{data.metaTitle || "IndianRentals – Get Tech on Demand"}</p>
                                <p className="text-[#006621] text-sm">https://indianrentals.com</p>
                                <p className="text-[#545454] text-sm">{data.metaDescription || "Default website description goes here to entice users..."}</p>
                            </div>
                        </CardBody>
                    </Card>
                </Tab>

            </Tabs>
        </div>
    );
}
