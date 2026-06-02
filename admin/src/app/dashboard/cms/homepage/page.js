'use client';
import toast from 'react-hot-toast';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from "framer-motion";
import { Spinner, Chip } from "@heroui/react";
import {
    Layout, Image as PhosphorImage, FloppyDisk,
    CheckCircle, Globe, ShieldCheck,
    Plus, Trash, ArrowsLeftRight, Tag, Star, Package, ChatText
} from "@phosphor-icons/react";
import ImageUploader from "@/components/ImageUploader";
import Toggle from "@/components/Toggle";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const getToken = () => typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

// ── Reusable Native Input/Textarea ──────────────────────────────────────────
const Field = ({ label, value, onChange, placeholder, type = "text", rows, className = "" }) => (
    <div className={`flex flex-col gap-1 ${className}`}>
        {label && <label className="text-xs font-bold text-slate-500 dark:text-slate-200 uppercase tracking-wider">{label}</label>}
        {rows ? (
            <textarea
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                rows={rows}
                className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all resize-none"
            />
        ) : (
            <input
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all"
            />
        )}
    </div>
);

// ── Section Header ───────────────────────────────────────────────────────────
const SectionRow = ({ icon, title, desc, toggle, onToggle }) => (
    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
            {icon && <div className="p-2 rounded-lg">{icon}</div>}
            <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">{title}</h3>
                {desc && <p className="text-xs text-slate-500 mt-0.5">{desc}</p>}
            </div>
        </div>
        {toggle !== undefined && <Toggle isSelected={toggle} onValueChange={onToggle} />}
    </div>
);

// ── Tab Button ───────────────────────────────────────────────────────────────
const TabBtn = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-500 dark:text-slate-200 hover:!bg-slate-100 dark:hover:!bg-slate-800' }`}
    >
        {icon} {label}
    </button>
);

// ── Product Search/Selector ──────────────────────────────────────────────────
const ProductSelector = ({ label, selectedIds, onChange }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const inputRef = useRef(null);

    useEffect(() => {
        if (!selectedIds || selectedIds.length === 0) { setSelectedProducts([]); return; }
        const fetchSelected = async () => {
            try {
                const res = await fetch(`${API}/api/products`);
                if (res.ok) {
                    const data = await res.json();
                    const matched = data.products.filter(p => selectedIds.includes(p._id));
                    const finalProducts = [...matched];
                    const missingIds = selectedIds.filter(id => !matched.some(m => m._id === id));
                    for (const id of missingIds) {
                        const r = await fetch(`${API}/api/products/${id}`);
                        if (r.ok) finalProducts.push(await r.json());
                    }
                    setSelectedProducts(finalProducts);
                }
            } catch (err) { console.error(err); }
        };
        fetchSelected();
    }, [selectedIds]);

    // Fetch all products for easy dropdown selection
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const res = await fetch(`${API}/api/products?limit=500`);
                if (res.ok) {
                    const data = await res.json();
                    setAllProducts(data.products || []);
                }
            } catch (err) { console.error(err); }
        };
        fetchAll();
    }, []);

    const handleSearch = async (val) => {
        setQuery(val);
        if (val.length < 2) { setResults([]); return; }
        setSearching(true);
        try {
            const res = await fetch(`${API}/api/products?keyword=${val}&limit=5`);
            if (res.ok) { const data = await res.json(); setResults(data.products || []); }
        } catch (err) { console.error(err); }
        finally { setSearching(false); }
    };

    const addProduct = (prod) => {
        if (selectedIds.includes(prod._id)) return;
        setSelectedProducts([...selectedProducts, prod]);
        onChange([...selectedIds, prod._id]);
        setQuery(""); setResults([]);
    };

    const handleSelectDropdown = (e) => {
        const id = e.target.value;
        if (!id) return;
        const prod = allProducts.find(p => p._id === id);
        if (prod) addProduct(prod);
        e.target.value = ""; // Reset value for next selection
    };

    const removeProduct = (id) => {
        setSelectedProducts(selectedProducts.filter(p => p._id !== id));
        onChange(selectedIds.filter(i => i !== id));
    };

    return (
        <div className="space-y-4 bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{label}</h4>
            <div className="flex flex-wrap gap-2 min-h-[28px]">
                {selectedProducts.map(p => (
                    <span key={p._id} className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-semibold">
                        {p.images?.[0] && <img src={p.images[0]} alt="" className="w-4 h-4 rounded-full object-cover" />}
                        {p.name}
                        <button onClick={() => removeProduct(p._id)} className="ml-0.5 text-indigo-400 hover:text-red-500 leading-none">×</button>
                    </span>
                ))}
                {selectedProducts.length === 0 && <span className="text-xs text-slate-400 italic">No products selected yet. Search or select below to add.</span>}
            </div>

            <div className="flex flex-col gap-3">
                <div className="relative">
                    <select
                        onChange={handleSelectDropdown}
                        defaultValue=""
                        className="w-full h-10 px-3 appearance-none rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all cursor-pointer"
                    >
                        <option value="" disabled>Browse & Select a product...</option>
                        {allProducts.map(p => (
                            <option key={p._id} value={p._id} disabled={selectedIds.includes(p._id)}>
                                {p.name} {selectedIds.includes(p._id) ? '(Added)' : ''}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-3 top-[10px] pointer-events-none text-slate-400">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path></svg>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex-1 h-[1px] bg-slate-200 dark:bg-slate-700"></div>
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Or Search</span>
                    <div className="flex-1 h-[1px] bg-slate-200 dark:bg-slate-700"></div>
                </div>

                <div className="relative">
                    <div className="relative flex items-center">
                        <PhosphorImage className="absolute left-3 text-slate-400 pointer-events-none" size={16} />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={e => handleSearch(e.target.value)}
                            placeholder="Search by product name..."
                            className="w-full h-10 pl-9 pr-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all"
                        />
                        {searching && <Spinner size="sm" className="absolute right-3" />}
                    </div>
                    {results.length > 0 && query.length >= 2 && (
                        <div className="absolute z-50 top-full left-0 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden max-h-[300px] overflow-y-auto">
                            {results.map(r => (
                                <button key={r._id} onClick={() => addProduct(r)}
                                    className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left border-b border-slate-100 dark:border-slate-800/50 last:border-0">
                                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                                        {r.images?.[0] ? <img src={r.images[0]} className="w-full h-full object-cover" alt="" /> : <Package size={20} />}
                                    </div>
                                    <div className="flex flex-col flex-1 truncate">
                                        <span className="text-sm font-semibold truncate text-slate-900 dark:text-white">{r.name}</span>
                                        <span className="text-xs text-slate-500">{r.category} • ₹{r.rentalPrice}/mo</span>
                                    </div>
                                    {selectedIds.includes(r._id) && <CheckCircle size={18} weight="fill" className="text-emerald-500 shrink-0" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ── Default CMS State ────────────────────────────────────────────────────────
const DEFAULTS = {
    publishStatus: "published",
    heroEnabled: true,
    heroSlides: [{ title: "The Tech That Powers Your Ambition. On Demand.", subtitle: "Get the latest MacBooks, Workstations, Cameras, and more.", image: "", bgColor: "#0075ff", textColor: "#ffffff", bgImage: "", ctaText: "Rent Now", ctaLink: "/products", slideLink: "" }],
    categorySectionEnabled: true,
    categorySectionTitle: "Rent by Category",
    bestRentedEnabled: true, bestRentedTitle: "Best Rented Products", bestRentedProductIds: [],
    newLaunchEnabled: true, newLaunchTitle: "New Launches This Week", newLaunchProductIds: [],
    featureSectionEnabled: true,
    featureSectionTitle: "MacBook Air",
    featureSectionSubtitle: "Skip the setup hassle. Get high-performance workstations pre-configured with Ollama for instant AI development. Run large language models locally.",
    featureSectionImage: "https://res.cloudinary.com/dgkckcdk8/image/upload/v1769961205/indian-rentals/gfjrzgp5llzcjap30wkt.png",
    featureSectionCtaText: "Rent Now",
    featureSectionCtaLink: "/store",
    featureSectionLink: "",
    featureSectionStats: [
        { value: '23x', label: 'Up to', sublabel: 'faster than the fastest Intel-based MacBook Air' },
        { value: '2x', label: 'Up to', sublabel: 'faster than MacBook Air(M1)' },
        { value: '18 hr', label: 'Up to', sublabel: 'battery life' }
    ],
    rentalProcessEnabled: true,
    rentalProcessTitle: "Rental Process",
    rentalProcessSubtitle: "Choose, secure, receive, and create with zero hassle. No installation, no configuration, no delay.",
    rentalProcessSteps: [
        { title: "Choose Your Tech", description: "Browse our curated selection...", icon: "Laptop", highlight: true, link: "" },
        { title: "Complete KYC", description: "Pick a flexible rental tenure...", icon: "IdentificationCard", highlight: false, link: "" },
        { title: "Secure Your Order", description: "Confirm your rental...", icon: "ShoppingCart", highlight: false, link: "" },
        { title: "Receive & Create", description: "We deliver your tech...", icon: "Package", highlight: false, link: "" },
    ],
    testimonialsEnabled: true,
    testimonialSectionTitle: "What Our Customers Say",
    testimonialSectionSubtitle: "Real experiences from innovators, businesses, and creators powering their ambitions with IndianRentals.",
    testimonialGoogleReviewCount: "5000+",
    testimonialGoogleRating: "4.9",
    whyChooseUsEnabled: true,
    whyChooseUsTitle: "Why Choose Us?",
    whyChooseUsSubtitle: "",
    whyChooseUsImage: "",
    statsDevices: "90k+", statsCustomers: "30k+", statsCities: "401+",
    clientSectionEnabled: true, clientSectionTitle: "Trusted By", clientLogos: [],
    faqSectionEnabled: true,
    homepageFaqEnabled: true,
    homepageFaqTitle: "Frequently Asked Questions",
    homepageFaqSubtitle: "Everything you need to know about renting with us.",
    homepageFaqItems: [],
    featuredShowcaseEnabled: true,
    featuredShowcaseProductIds: [],
    featuredShowcaseBanners: [
        { title: 'Apple Products', subtitle: 'MacBooks | iPads | iPhones | Mac Studio | Mac Mini', image: '', bg: 'linear-gradient(135deg, #2a1a5e 0%, #4c3099 40%, #7c5cbf 70%, #b08ad4 100%)', href: '/categories/apple' },
        { title: 'Gaming Laptops', subtitle: 'ASUS ROG | Lenovo Legion | MSI | HP Omen', image: '', bg: 'linear-gradient(135deg, #0a1628 0%, #1a3a5c 40%, #1e5f8c 70%, #2a9fd6 100%)', href: '/categories/gaming' },
        { title: 'Smart Devices', subtitle: 'Tablets | Smartwatches | Earbuds | Accessories', image: '', bg: 'linear-gradient(135deg, #1a2e1a 0%, #1e5c3a 40%, #25874f 70%, #3ac47d 100%)', href: '/categories/smart-devices' },
    ],
    metaTitle: "", metaDescription: "",
};

const TABS = [
    { key: "hero", label: "Hero Slides", icon: <Layout size={15} /> },
    { key: "products", label: "Curated Grids", icon: <Package size={15} /> },
    { key: "showcase", label: "Featured Showcase", icon: <PhosphorImage size={15} /> },
    { key: "feature", label: "Feature Section", icon: <Star size={15} /> },
    { key: "process", label: "Rental Process", icon: <ArrowsLeftRight size={15} /> },
    { key: "trust", label: "Trust Factors", icon: <ChatText size={15} /> },
    { key: "seo", label: "SEO Settings", icon: <Globe size={15} /> },
];

// ── Main Page ────────────────────────────────────────────────────────────────
export default function CMSHomepage() {
    const [activeTab, setActiveTab] = useState("hero");
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
                if (d.heroSlides?.length === 0 && d.heroTitle) {
                    d.heroSlides = [{ title: d.heroTitle, subtitle: d.heroSubtitle, image: d.heroImage, bgColor: d.heroBgColor || "#0075ff", textColor: d.heroTextColor || "#ffffff", bgImage: d.heroBgImage || "", ctaText: "Rent Now", ctaLink: "/products", slideLink: "" }];
                } else if (!d.heroSlides || d.heroSlides.length === 0) {
                    d.heroSlides = DEFAULTS.heroSlides.map(s => ({ ...s }));
                } else {
                    // Ensure new properties exist on older slides
                    d.heroSlides = d.heroSlides.map(s => ({
                        ...s,
                        textColor: s.textColor || "#ffffff",
                        bgImage: s.bgImage || "",
                        slideLink: s.slideLink || "",
                    }));
                }
                if (!d.rentalProcessSteps || d.rentalProcessSteps.length === 0) {
                    d.rentalProcessSteps = DEFAULTS.rentalProcessSteps;
                }
                if (d.whyChooseUsEnabled === undefined) d.whyChooseUsEnabled = true;
                if (d.clientSectionEnabled === undefined) d.clientSectionEnabled = true;
                if (d.faqSectionEnabled === undefined) d.faqSectionEnabled = true;
                if (d.homepageFaqEnabled === undefined) d.homepageFaqEnabled = true;
                if (!d.homepageFaqItems) d.homepageFaqItems = [];
                setData({ ...DEFAULTS, ...d });
            }
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
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
        } catch (err) { toast.error(err.message); }
        finally { setSaving(false); }
    };

    if (loading) return (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
            <Spinner size="lg" color="secondary" />
            <p className="text-slate-500 font-medium">Loading Homepage CMS…</p>
        </div>
    );

    return (
        <div className="w-full space-y-6 pb-16">
            {/* ── Page Header ── */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Homepage <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">Editor</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-200 text-sm">Manage all homepage sections natively inside the platform.</p>
                </motion.div>
                <div className="flex items-center gap-3">
                    {saved && (
                        <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-sm font-semibold bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-full px-3 py-1.5 animate-pulse">
                            <CheckCircle size={14} weight="fill" /> Saved Successfully!
                        </span>
                    )}
                    <button onClick={handleSave} disabled={saving}
                        className="flex items-center gap-2 h-10 px-6 rounded-xl !bg-indigo-600 hover:!bg-indigo-700 disabled:opacity-60 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all">
                        {saving ? <Spinner size="sm" color="white" /> : <FloppyDisk size={18} weight="bold" />}
                        {saving ? "Publishing…" : "Publish Changes"}
                    </button>
                </div>
            </div>

            {/* ── Custom Tab Bar ── */}
            <div className="flex items-center gap-2 flex-wrap">
                {TABS.map(t => (
                    <TabBtn key={t.key} icon={t.icon} label={t.label} active={activeTab === t.key} onClick={() => setActiveTab(t.key)} />
                ))}
            </div>

            {/* ── TAB: HERO ── */}
            {activeTab === "hero" && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                        <SectionRow
                            title="Hero Visibility"
                            desc="Show or hide the main hero slider at the top of the homepage."
                            toggle={data.heroEnabled}
                            onToggle={v => set("heroEnabled", v)}
                        />
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100"><PhosphorImage /> Carousel Slides</h3>
                            <button onClick={() => set("heroSlides", [...data.heroSlides, { title: "New Slide", subtitle: "", image: "", bgColor: "#333333", textColor: "#ffffff", bgImage: "", ctaText: "Rent Now", ctaLink: "/products" }])}
                                className="flex items-center gap-1.5 h-8 px-4 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all border border-indigo-200 dark:border-indigo-500/20">
                                <Plus size={14} /> Add Slide
                            </button>
                        </div>

                        <div className="space-y-5">
                            {data.heroSlides.map((slide, index) => (
                                <div key={index} className="p-5 border border-slate-200 dark:border-slate-700 rounded-2xl relative bg-slate-50 dark:bg-slate-950">
                                    <div className="flex items-center justify-between mb-5">
                                        <div className="flex items-center gap-2">
                                            <span className="w-7 h-7 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-xs">#{index + 1}</span>
                                            <h4 className="font-semibold text-slate-800 dark:text-slate-200">Slide Configuration</h4>
                                        </div>
                                        {data.heroSlides.length > 1 && (
                                            <button onClick={() => { const n = [...data.heroSlides]; n.splice(index, 1); set("heroSlides", n); }}
                                                className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-2 rounded-lg transition-colors">
                                                <Trash size={16} />
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <Field label="Headline" value={slide.title} onChange={v => { const n = [...data.heroSlides]; n[index].title = v; set("heroSlides", n); }} placeholder="The Tech That Powers Your Ambition." />
                                            <Field label="Sub-headline" value={slide.subtitle} onChange={v => { const n = [...data.heroSlides]; n[index].subtitle = v; set("heroSlides", n); }} placeholder="Get the latest MacBooks right now..." rows={2} />
                                            <div className="grid grid-cols-2 gap-4">
                                                <Field label="CTA Button Text" value={slide.ctaText} onChange={v => { const n = [...data.heroSlides]; n[index].ctaText = v; set("heroSlides", n); }} placeholder="Rent Now" />
                                                <Field label="CTA Button Link" value={slide.ctaLink} onChange={v => { const n = [...data.heroSlides]; n[index].ctaLink = v; set("heroSlides", n); }} placeholder="/products" />
                                            </div>
                                            <Field label="Entire Slide Link (Optional)" value={slide.slideLink || ""} onChange={v => { const n = [...data.heroSlides]; n[index].slideLink = v; set("heroSlides", n); }} placeholder="https://..." />
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-200 uppercase tracking-wider block mb-2">Background Color</label>
                                                    <div className="flex items-center gap-2">
                                                        <input type="color" value={slide.bgColor} onChange={e => { const n = [...data.heroSlides]; n[index].bgColor = e.target.value; set("heroSlides", n); }} className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200 dark:border-slate-700" />
                                                        <input type="text" value={slide.bgColor} onChange={e => { const n = [...data.heroSlides]; n[index].bgColor = e.target.value; set("heroSlides", n); }}
                                                            className="flex-1 h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-200 uppercase tracking-wider block mb-2">Text Color</label>
                                                    <div className="flex items-center gap-2">
                                                        <input type="color" value={slide.textColor || "#ffffff"} onChange={e => { const n = [...data.heroSlides]; n[index].textColor = e.target.value; set("heroSlides", n); }} className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200 dark:border-slate-700" />
                                                        <input type="text" value={slide.textColor || "#ffffff"} onChange={e => { const n = [...data.heroSlides]; n[index].textColor = e.target.value; set("heroSlides", n); }}
                                                            className="flex-1 h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono" />
                                                    </div>
                                                </div>
                                            </div>
                                            <ImageUploader label="Background Image (Replaces solid color)" existingUrl={slide.bgImage}
                                                onUpload={url => { const n = [...data.heroSlides]; n[index].bgImage = url; set("heroSlides", n); }} />
                                        </div>
                                        <div className="space-y-4">
                                            <ImageUploader label="Foreground Image (Transparent PNG Recommended)" existingUrl={slide.image}
                                                onUpload={url => { const n = [...data.heroSlides]; n[index].image = url; set("heroSlides", n); }} />
                                            {(slide.image || slide.bgImage) && (
                                                <div className="h-32 rounded-xl flex items-center justify-center p-2 border border-slate-200 dark:border-slate-700 relative overflow-hidden"
                                                    style={{ backgroundColor: slide.bgColor }}>
                                                    {slide.bgImage && <img src={slide.bgImage} className="absolute inset-0 w-full h-full object-cover opacity-50" alt="BG Preview" />}
                                                    <img src={slide.image || "https://res.cloudinary.com/dgkckcdk8/image/upload/v1769946716/indian-rentals/fj8ptqbhppbstdd0hs4i.png"}
                                                        className="relative z-10 max-h-full max-w-full object-contain drop-shadow-xl" alt="Preview" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* ── TAB: CURATED GRIDS ── */}
            {activeTab === "products" && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    {/* Category Section */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
                        <SectionRow
                            icon={<Layout weight="bold" className="text-emerald-500" />}
                            title="Rent by Category"
                            desc="Configure the category swiper title and visibility."
                            toggle={data.categorySectionEnabled}
                            onToggle={v => set("categorySectionEnabled", v)}
                        />
                        <Field label="Section Title" value={data.categorySectionTitle} onChange={v => set("categorySectionTitle", v)} placeholder="e.g. Rent by Category" />
                    </div>

                    {/* Best Rented */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
                        <SectionRow
                            icon={<Star weight="fill" className="text-amber-500" />}
                            title="Best Rented Products"
                            desc="Pick exactly which products to display on the homepage."
                            toggle={data.bestRentedEnabled}
                            onToggle={v => set("bestRentedEnabled", v)}
                        />
                        <Field label="Section Title" value={data.bestRentedTitle} onChange={v => set("bestRentedTitle", v)} placeholder="e.g. Best Rented Products" />
                        <ProductSelector label="Select Products to Feature (Recommend exactly 4 or 8)" selectedIds={data.bestRentedProductIds} onChange={ids => set("bestRentedProductIds", ids)} />
                    </div>

                    {/* New Launches */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
                        <SectionRow
                            icon={<Tag weight="bold" className="text-indigo-500" />}
                            title="New Launches Grid"
                            desc="Feature the latest equipment added to your inventory."
                            toggle={data.newLaunchEnabled}
                            onToggle={v => set("newLaunchEnabled", v)}
                        />
                        <Field label="Section Title" value={data.newLaunchTitle} onChange={v => set("newLaunchTitle", v)} placeholder="e.g. New Launches This Week" />
                        <ProductSelector label="Select Products to Feature (Recommend exactly 4 or 8)" selectedIds={data.newLaunchProductIds} onChange={ids => set("newLaunchProductIds", ids)} />
                    </div>
                </motion.div>
            )}

            {/* ── TAB: FEATURED SHOWCASE ── */}
            {activeTab === "showcase" && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

                    {/* Section toggle + product selector */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
                        <SectionRow
                            icon={<PhosphorImage weight="bold" className="text-violet-500" />}
                            title="Featured Showcase"
                            desc="A 1200×391 panel with 2 product cards + a rotating banner carousel, shown above the Rental Process section."
                            toggle={data.featuredShowcaseEnabled}
                            onToggle={v => set("featuredShowcaseEnabled", v)}
                        />

                        <ProductSelector
                            label="Pin 2 Products (left side cards — choose exactly 2)"
                            selectedIds={data.featuredShowcaseProductIds}
                            onChange={ids => set("featuredShowcaseProductIds", ids.slice(0, 2))}
                        />
                    </div>

                    {/* Banner slides */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
                        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                            <div>
                                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Banner Carousel Slides</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Right-side rotating banners. Each slide has a title, subtitle, background gradient and an image.</p>
                            </div>
                            <button
                                onClick={() => set("featuredShowcaseBanners", [
                                    ...(data.featuredShowcaseBanners || []),
                                    { title: 'New Category', subtitle: 'Product 1 | Product 2 | Product 3', image: '', bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', href: '/products' }
                                ])}
                                className="flex items-center gap-1.5 h-8 px-4 rounded-lg bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 text-sm font-semibold hover:bg-violet-100 dark:hover:bg-violet-500/20 transition-all border border-violet-200 dark:border-violet-500/20"
                            >
                                <Plus size={14} /> Add Banner
                            </button>
                        </div>

                        <div className="space-y-5">
                            {(data.featuredShowcaseBanners || []).map((banner, idx) => (
                                <div key={idx} className="p-5 border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-950 relative">
                                    {/* Slide header */}
                                    <div className="flex items-center justify-between mb-5">
                                        <div className="flex items-center gap-2">
                                            <span className="w-7 h-7 bg-violet-100 text-violet-700 rounded-full flex items-center justify-center font-bold text-xs">#{idx + 1}</span>
                                            <h4 className="font-semibold text-slate-800 dark:text-slate-200">Banner Slide</h4>
                                        </div>
                                        {(data.featuredShowcaseBanners || []).length > 1 && (
                                            <button
                                                onClick={() => { const n = [...data.featuredShowcaseBanners]; n.splice(idx, 1); set("featuredShowcaseBanners", n); }}
                                                className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                                            >
                                                <Trash size={16} />
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Left: text fields */}
                                        <div className="space-y-4">
                                            <Field
                                                label="Banner Title"
                                                value={banner.title}
                                                onChange={v => { const n = [...data.featuredShowcaseBanners]; n[idx].title = v; set("featuredShowcaseBanners", n); }}
                                                placeholder="e.g. Apple Products"
                                            />
                                            <Field
                                                label="Subtitle / Product List"
                                                value={banner.subtitle}
                                                onChange={v => { const n = [...data.featuredShowcaseBanners]; n[idx].subtitle = v; set("featuredShowcaseBanners", n); }}
                                                placeholder="MacBooks | iPads | iPhones"
                                            />
                                            <Field
                                                label="Link (href)"
                                                value={banner.href}
                                                onChange={v => { const n = [...data.featuredShowcaseBanners]; n[idx].href = v; set("featuredShowcaseBanners", n); }}
                                                placeholder="/categories/apple"
                                            />
                                            {/* Gradient bg input */}
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 dark:text-slate-200 uppercase tracking-wider block mb-2">Background Gradient (CSS)</label>
                                                <input
                                                    type="text"
                                                    value={banner.bg}
                                                    onChange={e => { const n = [...data.featuredShowcaseBanners]; n[idx].bg = e.target.value; set("featuredShowcaseBanners", n); }}
                                                    className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-400 transition-all font-mono text-xs"
                                                    placeholder="linear-gradient(135deg, #2a1a5e 0%, #b08ad4 100%)"
                                                />
                                                {/* Gradient preview swatch */}
                                                <div
                                                    className="mt-2 h-6 w-full rounded-lg border border-slate-200 dark:border-slate-700"
                                                    style={{ background: banner.bg }}
                                                />
                                            </div>
                                        </div>

                                        {/* Right: image upload + preview */}
                                        <div className="space-y-4">
                                            <ImageUploader
                                                label="Banner Image (PNG with transparency recommended)"
                                                existingUrl={banner.image}
                                                onUpload={url => { const n = [...data.featuredShowcaseBanners]; n[idx].image = url; set("featuredShowcaseBanners", n); }}
                                            />
                                            {/* Live preview card */}
                                            <div
                                                className="relative h-40 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col justify-end p-4"
                                                style={{ background: banner.bg }}
                                            >
                                                {banner.image && (
                                                    <img
                                                        src={banner.image}
                                                        alt="preview"
                                                        className="absolute inset-0 w-full h-full object-contain object-center opacity-80"
                                                    />
                                                )}
                                                <div className="relative z-10">
                                                    <p className="text-white font-bold text-sm leading-tight">{banner.title || 'Banner Title'}</p>
                                                    <p className="text-white/70 text-xs mt-0.5">{banner.subtitle || 'Subtitle goes here'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* ── TAB: FEATURE SECTION ── */}
            {activeTab === "feature" && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-8">
                        <SectionRow
                            icon={<Star weight="fill" className="text-pink-500" />}
                            title="Promotional Feature Section"
                            desc="Customize the high-impact promotional section (e.g. MacBook Air highlight)."
                            toggle={data.featureSectionEnabled}
                            onToggle={v => set("featureSectionEnabled", v)}
                        />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <Field label="Headline" value={data.featureSectionTitle} onChange={v => set("featureSectionTitle", v)} placeholder="e.g. MacBook Air" />
                                <Field label="Description" value={data.featureSectionSubtitle} onChange={v => set("featureSectionSubtitle", v)} rows={3} placeholder="Write something compelling..." />
                                <div className="grid grid-cols-2 gap-4">
                                    <Field label="CTA Text" value={data.featureSectionCtaText} onChange={v => set("featureSectionCtaText", v)} placeholder="Rent Now" />
                                    <Field label="CTA Link" value={data.featureSectionCtaLink} onChange={v => set("featureSectionCtaLink", v)} placeholder="/store" />
                                </div>
                                <Field label="Entire Section Link (Optional)" value={data.featureSectionLink || ""} onChange={v => set("featureSectionLink", v)} placeholder="https://..." />
                            </div>
                            <div>
                                <ImageUploader label="Feature Image" existingUrl={data.featureSectionImage} onUpload={url => set("featureSectionImage", url)} />
                                {data.featureSectionImage && (
                                    <div className="mt-4 h-40 rounded-xl bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 border border-slate-200 dark:border-slate-800">
                                        <img src={data.featureSectionImage} className="max-h-full max-w-full object-contain drop-shadow-lg" alt="Preview" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Stats Rows */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-6">
                                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tighter">Performance Statistics</h4>
                                <button onClick={() => set("featureSectionStats", [...(data.featureSectionStats || []), { value: "10x", label: "Up to", sublabel: "Performance" }])}
                                    className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                                    <Plus size={14} /> Add Stat
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {(data.featureSectionStats || []).map((stat, idx) => (
                                    <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 relative group">
                                        <button onClick={() => { const n = [...data.featureSectionStats]; n.splice(idx, 1); set("featureSectionStats", n) }}
                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                                        <div className="space-y-3">
                                            <Field label="Label (e.g. Up to)" value={stat.label} onChange={v => { const n = [...data.featureSectionStats]; n[idx].label = v; set("featureSectionStats", n); }} />
                                            <Field label="Value (e.g. 23x)" value={stat.value} onChange={v => { const n = [...data.featureSectionStats]; n[idx].value = v; set("featureSectionStats", n); }} />
                                            <Field label="Subtext" value={stat.sublabel} onChange={v => { const n = [...data.featureSectionStats]; n[idx].sublabel = v; set("featureSectionStats", n); }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* ── TAB: RENTAL PROCESS ── */}
            {activeTab === "process" && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
                        {/* Settings block */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Process Settings</h3>
                                <Toggle isSelected={data.rentalProcessEnabled} onValueChange={v => set("rentalProcessEnabled", v)} size="sm" />
                            </div>
                            <Field label="Section Title" value={data.rentalProcessTitle} onChange={v => set("rentalProcessTitle", v)} />
                            <Field label="Section Subtitle" value={data.rentalProcessSubtitle} onChange={v => set("rentalProcessSubtitle", v)} rows={2} />
                        </div>

                        {/* Steps */}
                        <div>
                            <div className="flex justify-between items-center bg-slate-900 text-white px-5 py-3 rounded-t-xl">
                                <h4 className="font-semibold text-sm">Flow Steps Configuration</h4>
                                <button onClick={() => set("rentalProcessSteps", [...data.rentalProcessSteps, { title: "New Step", description: "Write description...", icon: "FaSearch", highlight: false, link: "" }])}
                                    className="flex items-center gap-1.5 text-xs font-semibold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-all">
                                    <Plus size={12} /> Add Step
                                </button>
                            </div>

                            <div className="space-y-4 border border-slate-200 dark:border-slate-800 rounded-b-xl p-4 md:p-6 bg-slate-50/50 dark:bg-slate-900/50">
                                {data.rentalProcessSteps.map((step, idx) => (
                                    <div key={idx} className={`p-5 rounded-xl border relative transition-colors ${step.highlight ? 'bg-amber-50 border-amber-200 dark:bg-amber-500/5 dark:border-amber-500/20' : 'bg-white border-slate-200 dark:bg-slate-950 dark:border-slate-800'}`}>
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="font-bold text-slate-400 text-sm">Step {idx + 1}</span>
                                            <div className="flex items-center gap-4">
                                                <Toggle size="sm" isSelected={step.highlight} onValueChange={v => { const n = [...data.rentalProcessSteps]; n[idx].highlight = v; set("rentalProcessSteps", n); }}>
                                                    Yellow Highlight
                                                </Toggle>
                                                <button onClick={() => { const n = [...data.rentalProcessSteps]; n.splice(idx, 1); set("rentalProcessSteps", n); }} className="text-red-500 hover:text-red-700 p-1">
                                                    <Trash size={15} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-3">
                                                <Field label="Title" value={step.title} onChange={v => { const n = [...data.rentalProcessSteps]; n[idx].title = v; set("rentalProcessSteps", n); }} />
                                                <Field label="Icon (e.g. Laptop, Package, ShoppingCart OR Image URL)" value={step.icon} onChange={v => { const n = [...data.rentalProcessSteps]; n[idx].icon = v; set("rentalProcessSteps", n); }} placeholder="Laptop" />
                                                <Field label="Target Link (URL)" value={step.link || ""} onChange={v => { const n = [...data.rentalProcessSteps]; n[idx].link = v; set("rentalProcessSteps", n); }} placeholder="/categories/laptops" />
                                                <ImageUploader label="Step Illustration" existingUrl={step.image} onUpload={url => { const n = [...data.rentalProcessSteps]; n[idx].image = url; set("rentalProcessSteps", n); }} />
                                            </div>
                                            <Field label="Body Description" value={step.description} onChange={v => { const n = [...data.rentalProcessSteps]; n[idx].description = v; set("rentalProcessSteps", n); }} rows={5} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* ── TAB: TRUST FACTORS ── */}
            {activeTab === "trust" && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    {/* Testimonials */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
                        <SectionRow
                            icon={<Star weight="fill" className="text-emerald-500" />}
                            title="Testimonials Section"
                            desc="Review content is managed in the Testimonials tab. Configure UI here."
                            toggle={data.testimonialsEnabled}
                            onToggle={v => set("testimonialsEnabled", v)}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Section Title" value={data.testimonialSectionTitle} onChange={v => set("testimonialSectionTitle", v)} />
                            <Field label="Google Review Count Badge" value={data.testimonialGoogleReviewCount} onChange={v => set("testimonialGoogleReviewCount", v)} placeholder="e.g. 5000+" />
                            <div className="md:col-span-2">
                                <Field label="Section Subtitle" value={data.testimonialSectionSubtitle} onChange={v => set("testimonialSectionSubtitle", v)} rows={2} />
                            </div>
                        </div>
                    </div>

                    {/* Why Choose Us */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
                        <SectionRow
                            icon={<ShieldCheck weight="fill" className="text-blue-500" />}
                            title="Why Choose Us Block"
                            desc="Show or hide the 'Why Choose Us' section on the homepage."
                            toggle={data.whyChooseUsEnabled}
                            onToggle={v => set("whyChooseUsEnabled", v)}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <Field label="Headline" value={data.whyChooseUsTitle} onChange={v => set("whyChooseUsTitle", v)} />
                                <Field label="Description" value={data.whyChooseUsSubtitle} onChange={v => set("whyChooseUsSubtitle", v)} rows={5} placeholder="Join thousands who've switched to IndianRentals..." />
                                <div className="grid grid-cols-3 gap-3">
                                    <Field label="Devices Stat" value={data.statsDevices} onChange={v => set("statsDevices", v)} placeholder="90k+" />
                                    <Field label="Customers Stat" value={data.statsCustomers} onChange={v => set("statsCustomers", v)} placeholder="30k+" />
                                    <Field label="Cities Stat" value={data.statsCities} onChange={v => set("statsCities", v)} placeholder="401+" />
                                </div>
                            </div>
                            <div>
                                <ImageUploader label="Corporate Image" existingUrl={data.whyChooseUsImage} onUpload={url => set("whyChooseUsImage", url)} />
                            </div>
                        </div>
                    </div>

                    {/* Client Logos */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
                        <SectionRow
                            icon={<Layout weight="fill" className="text-pink-500" />}
                            title="Client Logos (Trusted By)"
                            desc="Upload client/partner logos. The section is hidden on the website until at least one logo is added."
                            toggle={data.clientSectionEnabled}
                            onToggle={v => set("clientSectionEnabled", v)}
                        />

                        <Field label="Section Title" value={data.clientSectionTitle} onChange={v => set("clientSectionTitle", v)} placeholder="e.g. Trusted By" />

                        {/* Uploaded logos grid */}
                        {(data.clientLogos || []).length > 0 ? (
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-200 uppercase tracking-wider block">
                                    Uploaded Logos ({data.clientLogos.length})
                                </label>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                                    {data.clientLogos.map((logo, idx) => (
                                        <div key={idx} className="relative group rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-3 flex items-center justify-center aspect-square">
                                            <img
                                                src={logo}
                                                className="max-w-full max-h-full object-contain"
                                                alt={`Client logo ${idx + 1}`}
                                            />
                                            <button
                                                onClick={() => {
                                                    const n = [...data.clientLogos];
                                                    n.splice(idx, 1);
                                                    set("clientLogos", n);
                                                }}
                                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold shadow-md"
                                                title="Remove logo"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 text-sm">
                                <Layout size={18} weight="bold" className="shrink-0" />
                                <p>No logos uploaded yet. The section will be hidden on the website until you add at least one logo below.</p>
                            </div>
                        )}

                        {/* Upload new logo */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-200 uppercase tracking-wider block">
                                Add Logo
                            </label>
                            <p className="text-xs text-slate-400 -mt-1">Upload PNG with transparent background for best results. You can add multiple logos one by one.</p>
                            <div className="max-w-xs">
                                <ImageUploader
                                    label=""
                                    existingUrl=""
                                    onUpload={url => {
                                        if (url) set("clientLogos", [...(data.clientLogos || []), url]);
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Homepage FAQ */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
                        <SectionRow
                            icon={<ChatText weight="fill" className="text-violet-500" />}
                            title="FAQ Section"
                            desc="Manage the FAQ block shown on the homepage."
                            toggle={data.homepageFaqEnabled}
                            onToggle={v => set("homepageFaqEnabled", v)}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Section Title" value={data.homepageFaqTitle} onChange={v => set("homepageFaqTitle", v)} placeholder="Frequently Asked Questions" />
                            <Field label="Section Subtitle" value={data.homepageFaqSubtitle} onChange={v => set("homepageFaqSubtitle", v)} placeholder="Everything you need to know..." />
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-200 uppercase tracking-wider block">Questions & Answers</label>
                            {(data.homepageFaqItems || []).map((item, idx) => (
                                <div key={idx} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3 bg-slate-50 dark:bg-slate-950">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-slate-400">FAQ #{idx + 1}</span>
                                        <button
                                            onClick={() => { const n = [...data.homepageFaqItems]; n.splice(idx, 1); set("homepageFaqItems", n); }}
                                            className="text-red-400 hover:text-red-600 transition-colors p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
                                        >
                                            <Trash size={15} />
                                        </button>
                                    </div>
                                    <Field
                                        label="Question"
                                        value={item.question}
                                        onChange={v => { const n = [...data.homepageFaqItems]; n[idx] = { ...n[idx], question: v }; set("homepageFaqItems", n); }}
                                        placeholder="e.g. What is the minimum rental period?"
                                    />
                                    <Field
                                        label="Answer"
                                        value={item.answer}
                                        onChange={v => { const n = [...data.homepageFaqItems]; n[idx] = { ...n[idx], answer: v }; set("homepageFaqItems", n); }}
                                        placeholder="e.g. The minimum rental period is 1 month."
                                        rows={2}
                                    />
                                </div>
                            ))}
                            <button
                                onClick={() => set("homepageFaqItems", [...(data.homepageFaqItems || []), { question: '', answer: '' }])}
                                className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-center gap-2 text-slate-400 hover:text-indigo-500 hover:border-indigo-400 transition-all"
                            >
                                <Plus size={18} /> Add FAQ
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* ── TAB: SEO ── */}
            {activeTab === "seo" && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
                        <SectionRow icon={<Globe className="text-indigo-500" />} title="SEO Meta Settings" desc="These appear in Google search results and social media previews." />
                        <Field label="Meta Title" value={data.metaTitle} onChange={v => set("metaTitle", v)} placeholder="IndianRentals – Rent Everything You Need" />
                        <p className="text-xs text-slate-400 -mt-4">{data.metaTitle.length}/60 characters</p>
                        <Field label="Meta Description" value={data.metaDescription} onChange={v => set("metaDescription", v)} placeholder="Find and rent premium gadgets, laptops, cameras and more..." rows={3} />
                        <p className="text-xs text-slate-400 -mt-4">{data.metaDescription.length}/160 characters</p>

                        {/* Google Preview */}
                        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 space-y-1">
                            <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-3">Google Snippet Preview</p>
                            <p className="text-[#1a0dab] dark:text-[#8ab4f8] text-lg hover:underline cursor-pointer font-medium leading-snug">{data.metaTitle || "IndianRentals – Get Tech on Demand"}</p>
                            <p className="text-[#006621] dark:text-[#4caf50] text-sm">https://indianrentals.com</p>
                            <p className="text-[#545454] dark:text-slate-200 text-sm leading-snug">{data.metaDescription || "Default website description goes here to entice users..."}</p>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
