'use client';
import Link from 'next/link';
import { API_BASE_URL } from '@/lib/apiConfig';
import RentalStepsEditor from '@/components/RentalStepsEditor';
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
import { resolveOfferCampaign, offerPreviewUrl } from '@/lib/offerCampaigns';

import { loadCatalogue } from '@/lib/catalogue.mjs';

const API = API_BASE_URL;
const getToken = () => typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

// ── Reusable Native Input/Textarea ──────────────────────────────────────────
const Field = ({ label, value, onChange, placeholder, type = "text", rows, min, max, step, className = "" }) => (
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
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all"
            />
        )}
    </div>
);

// ── Offers ───────────────────────────────────────────────────────────────────
// Offers are stored under the legacy `clientLogos` key. Older entries are plain
// image URL strings; newer entries carry editable campaign copy.
const toOffer = (o) => resolveOfferCampaign(typeof o === "string"
    ? { image: o, link: "", title: "", subtitle: "", ctaText: "", altText: "" }
    : { image: o?.image || "", link: o?.link || "", title: o?.title || "", subtitle: o?.subtitle || "", ctaText: o?.ctaText || "", altText: o?.altText || "" });

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
        const controller = new AbortController();
        const fetchAll = async () => {
            try {
                const products = await loadCatalogue(API, { signal: controller.signal });
                if (!controller.signal.aborted) setAllProducts(products);
            } catch (err) { console.error(err); }
        };
        fetchAll();
        return () => controller.abort();
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
    featureSectionTitle: "The right tech, right when you need it.",
    featureSectionSubtitle: "Rent laptops, cameras, and more for the work ahead.",
    featureSectionImage: "/images/home/rental-workspace-offer.webp",
    featureSectionMediaType: "image",
    featureSectionMobileMedia: "/images/home/rental-workspace-offer-mobile.webp",
    featureSectionPosterImage: "",
    featureSectionMediaAlt: "Rental laptop and creative equipment ready for work",
    featureSectionInteraction: "none",
    featureSectionCtaText: "Explore rentals",
    featureSectionCtaLink: "/products",
    featureSectionStats: [
        { value: '23x', label: 'Up to', sublabel: 'faster than the fastest Intel-based MacBook Air' },
        { value: '2x', label: 'Up to', sublabel: 'faster than MacBook Air(M1)' },
        { value: '18 hr', label: 'Up to', sublabel: 'battery life' }
    ],
    rentalProcessEnabled: true,
    rentalProcessTitle: "Rental Process",
    rentalProcessSubtitle: "Choose, secure, receive, and create with zero hassle. No installation, no configuration, no delay.",
    rentalProcessSteps: [
        { title: "Choose Your Tech", description: "Explore the catalogue and choose the equipment and rental duration you need.", icon: "Laptop", highlight: true, link: "" },
        { title: "Complete KYC", description: "Add your delivery details and submit the documents requested during verification.", icon: "IdentificationCard", highlight: false, link: "" },
        { title: "Secure Your Order", description: "Review your rental, deposit and payment details before confirming your order.", icon: "ShoppingCart", highlight: false, link: "" },
        { title: "Receive & Create", description: "Receive your equipment at the confirmed delivery address and get started.", icon: "Package", highlight: false, link: "" },
    ],
    testimonialsEnabled: true,
    testimonialSectionTitle: "What Our Customers Say",
    testimonialSectionSubtitle: "Real experiences from innovators, businesses, and creators powering their ambitions with IndianRentals.",
    testimonialGoogleReviewCount: "",
    testimonialGoogleRating: "4.9",
    whyChooseUsEnabled: true,
    whyChooseUsTitle: "Why Choose Us?",
    whyChooseUsSubtitle: "",
    whyChooseUsImage: "",
    statsDevices: "90k+", statsCustomers: "30k+", statsCities: "401+",
    clientSectionEnabled: true, clientSectionTitle: "Offers", clientLogos: [],
    faqSectionEnabled: true,
    homepageFaqEnabled: true,
    homepageFaqTitle: "Everything you need to know about renting with IndianRenters.com",
    homepageFaqSubtitle: "Welcome to FAQ!",
    homepageFaqItems: [],
    featuredShowcaseEnabled: true,
    featuredShowcaseProductIds: [],
    featuredShowcaseBanners: [
        { title: 'Apple Products', subtitle: 'MacBooks | iPads | iPhones | Mac Studio | Mac Mini', image: '', bg: 'linear-gradient(135deg, #2a1a5e 0%, #4c3099 40%, #7c5cbf 70%, #b08ad4 100%)', href: '/category/apple' },
        { title: 'Gaming Laptops', subtitle: 'ASUS ROG | Lenovo Legion | MSI | HP Omen', image: '', bg: 'linear-gradient(135deg, #0a1628 0%, #1a3a5c 40%, #1e5f8c 70%, #2a9fd6 100%)', href: '/products' },
        { title: 'Smart Devices', subtitle: 'Tablets | Smartwatches | Earbuds | Accessories', image: '', bg: 'linear-gradient(135deg, #1a2e1a 0%, #1e5c3a 40%, #25874f 70%, #3ac47d 100%)', href: '/products' },
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
    const [draftUnavailable, setDraftUnavailable] = useState(false);
    const [availableProducts, setAvailableProducts] = useState([]);

    const [offerImageUrl, setOfferImageUrl] = useState("");

    const set = (key, val) => setData(prev => ({ ...prev, [key]: val }));

    useEffect(() => {
        const controller = new AbortController();
        loadCatalogue(API, { signal: controller.signal })
            .then(products => { if (!controller.signal.aborted) setAvailableProducts(products); })
            .catch(() => {});
        return () => controller.abort();
    }, []);

    // ── Offers (stored under the legacy `clientLogos` key) ────────────────────
    const offers = (data.clientLogos || []).map(toOffer);
    const addOffer = (image, link = "") => set("clientLogos", [...offers, { image, link, title: "", subtitle: "", ctaText: "", altText: "" }]);
    const updateOffer = (idx, patch) =>
        set("clientLogos", offers.map((o, i) => (i === idx ? { ...o, ...patch } : o)));
    const addOfferFromUrl = () => {
        const url = offerImageUrl.trim();
        if (!url) return;
        if (!/^https?:\/\//i.test(url)) { toast.error("Image link must start with http:// or https://"); return; }
        addOffer(url);
        setOfferImageUrl("");
    };

    const fetchCMS = useCallback(async () => {
        try {
            setLoading(true);
            let res = await fetch(`${API}/api/cms/homepage/draft`, { headers: { Authorization: `Bearer ${getToken()}` }, cache: 'no-store' });
            if (res.status === 404) {
                setDraftUnavailable(true);
                res = await fetch(`${API}/api/cms/homepage`, { cache: 'no-store' });
            } else {
                setDraftUnavailable(false);
            }
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
                if (!Array.isArray(d.rentalProcessSteps)) {
                    d.rentalProcessSteps = DEFAULTS.rentalProcessSteps;
                }
                if (d.whyChooseUsEnabled === undefined) d.whyChooseUsEnabled = true;
                if (d.clientSectionEnabled === undefined) d.clientSectionEnabled = true;
                d.clientLogos = (d.clientLogos || []).map(toOffer);
                if (d.faqSectionEnabled === undefined) d.faqSectionEnabled = true;
                if (d.homepageFaqEnabled === undefined) d.homepageFaqEnabled = true;
                if (!d.homepageFaqItems) d.homepageFaqItems = [];
                if (d.featureSectionTitle === "MacBook Air" && (!d.featureSectionImage || d.featureSectionImage.includes("gfjrzgp5llzcjap30wkt.png"))) {
                    Object.assign(d, {
                        featureSectionTitle: DEFAULTS.featureSectionTitle,
                        featureSectionSubtitle: DEFAULTS.featureSectionSubtitle,
                        featureSectionImage: DEFAULTS.featureSectionImage,
                        featureSectionCtaText: DEFAULTS.featureSectionCtaText,
                        featureSectionCtaLink: DEFAULTS.featureSectionCtaLink,
                        featureSectionMediaType: "image",
                        featureSectionMobileMedia: DEFAULTS.featureSectionMobileMedia,
                    });
                }
                setData({ ...DEFAULTS, ...d });
            }
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchCMS(); }, [fetchCMS]);

    const handleSave = async () => {
        if (draftUnavailable) { toast.error('Start or deploy the updated CMS backend to save a draft.'); return; }
        try {
            setSaving(true);
            const res = await fetch(`${API}/api/cms/homepage`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error((await res.json()).message || "Failed to save");
            setSaved(true);
            window.dispatchEvent(new CustomEvent('cms:draft-saved', { detail: { page: 'homepage' } }));
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
            {draftUnavailable && <div role="status" className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
                Showing published homepage content. The connected backend does not yet support saved drafts. Changes on this screen cannot be saved or published until the updated backend is running.
            </div>}
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
                            <CheckCircle size={14} weight="fill" /> Draft saved
                        </span>
                    )}
                    <button onClick={handleSave} disabled={saving || draftUnavailable}
                        className="flex items-center gap-2 h-10 px-6 rounded-xl !bg-indigo-600 hover:!bg-indigo-700 disabled:opacity-60 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all">
                        {saving ? <Spinner size="sm" color="white" /> : <FloppyDisk size={18} weight="bold" />}
                        {saving ? "Saving…" : "Save draft"}
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
                            <div>
                                <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100"><PhosphorImage /> Hero Banner Slides</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Upload banner images and set the product link. When clicked on the homepage, each banner directs customers to its product page.</p>
                            </div>
                            <button onClick={() => set("heroSlides", [...data.heroSlides, { title: `Banner #${data.heroSlides.length + 1}`, image: "", bgImage: "", ctaLink: "/products", slideLink: "/products", link: "/products" }])}
                                className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-all shadow-sm cursor-pointer">
                                <Plus size={15} weight="bold" /> Add Banner
                            </button>
                        </div>

                        <div className="space-y-6">
                            {data.heroSlides.map((slide, index) => {
                                const currentImage = slide.bgImage || slide.image || "";
                                const currentLink = slide.ctaLink || slide.slideLink || slide.link || "";

                                return (
                                    <div key={index} className="p-6 border border-slate-200 dark:border-slate-800 rounded-2xl relative bg-slate-50/70 dark:bg-slate-950/60 space-y-5">
                                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                                            <div className="flex items-center gap-2.5">
                                                <span className="w-7 h-7 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-lg flex items-center justify-center font-bold text-xs">#{index + 1}</span>
                                                <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                                                    {slide.title || `Hero Banner #${index + 1}`}
                                                </h4>
                                            </div>
                                            {data.heroSlides.length > 1 && (
                                                <button
                                                    onClick={() => { const n = [...data.heroSlides]; n.splice(index, 1); set("heroSlides", n); }}
                                                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 p-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs font-medium"
                                                    title="Delete this banner"
                                                >
                                                    <Trash size={15} /> Remove
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                                            {/* Left Column: Image Upload & URL */}
                                            <div className="space-y-4">
                                                <ImageUploader
                                                    label="Banner Image"
                                                    existingUrl={currentImage}
                                                    onUpload={url => {
                                                        const n = [...data.heroSlides];
                                                        n[index].bgImage = url;
                                                        n[index].image = url;
                                                        set("heroSlides", n);
                                                    }}
                                                />
                                                <div>
                                                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
                                                        Or Direct Image URL
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={currentImage}
                                                        onChange={e => {
                                                            const n = [...data.heroSlides];
                                                            n[index].bgImage = e.target.value;
                                                            n[index].image = e.target.value;
                                                            set("heroSlides", n);
                                                        }}
                                                        placeholder="https://res.cloudinary.com/... or https://..."
                                                        className="w-full h-11 px-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:border-indigo-500 transition-colors"
                                                    />
                                                </div>
                                            </div>

                                            {/* Right Column: Target Product Link & Preview */}
                                            <div className="space-y-4">
                                                <div>
                                                    <div className="flex items-center justify-between mb-1.5">
                                                        <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                                            Product Page Link <span className="text-red-500">*</span>
                                                        </label>
                                                        <span className="text-[11px] text-slate-400 font-medium">/products/&lt;id&gt; or /products</span>
                                                    </div>

                                                    {/* Quick Select Dropdown */}
                                                    {availableProducts.length > 0 && (
                                                        <div className="mb-2.5">
                                                            <select
                                                                defaultValue=""
                                                                onChange={e => {
                                                                    const prodId = e.target.value;
                                                                    if (!prodId) return;
                                                                    const prod = availableProducts.find(p => p._id === prodId);
                                                                    const n = [...data.heroSlides];
                                                                    const targetLink = `/products/${prodId}`;
                                                                    n[index].ctaLink = targetLink;
                                                                    n[index].slideLink = targetLink;
                                                                    n[index].link = targetLink;
                                                                    if (!n[index].title && prod?.name) {
                                                                        n[index].title = prod.name;
                                                                    }
                                                                    set("heroSlides", n);
                                                                    e.target.value = "";
                                                                }}
                                                                className="w-full h-10 px-3 appearance-none rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-900 dark:text-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer"
                                                            >
                                                                <option value="">⚡ Select a product to auto-fill link...</option>
                                                                {availableProducts.map(p => (
                                                                    <option key={p._id} value={p._id}>
                                                                        {p.name} {p.rentalPrice ? `(₹${p.rentalPrice}/mo)` : ''}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    )}

                                                    <input
                                                        type="text"
                                                        value={currentLink}
                                                        onChange={e => {
                                                            const n = [...data.heroSlides];
                                                            const val = e.target.value;
                                                            n[index].ctaLink = val;
                                                            n[index].slideLink = val;
                                                            n[index].link = val;
                                                            set("heroSlides", n);
                                                        }}
                                                        placeholder="/products/65fa... or /products"
                                                        className="w-full h-11 px-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:border-indigo-500 transition-colors font-medium"
                                                    />
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                        Select from the dropdown above or enter any custom URL (e.g., <code className="text-indigo-600 dark:text-indigo-400 font-mono">/products</code> or <code className="text-indigo-600 dark:text-indigo-400 font-mono">/products/&lt;id&gt;</code>).
                                                    </p>
                                                </div>

                                                <div>
                                                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
                                                        Banner Label / Title (Optional)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={slide.title || ""}
                                                        onChange={e => {
                                                            const n = [...data.heroSlides];
                                                            n[index].title = e.target.value;
                                                            set("heroSlides", n);
                                                        }}
                                                        placeholder="e.g. MacBook Pro Offer"
                                                        className="w-full h-11 px-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                                                    />
                                                </div>

                                                {/* Live Banner Preview */}
                                                <div>
                                                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
                                                        Live Banner Preview
                                                    </label>
                                                    {currentImage ? (
                                                        <div className="w-full h-36 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden relative bg-slate-900 shadow-inner group">
                                                            <img
                                                                src={currentImage}
                                                                alt={slide.title || "Hero banner preview"}
                                                                className="w-full h-full object-cover object-center"
                                                            />
                                                            <div className="absolute bottom-2 left-2 right-2 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center justify-between text-xs text-white">
                                                                <span className="truncate font-medium flex items-center gap-1.5">
                                                                    🔗 {currentLink || "/products"}
                                                                </span>
                                                                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider shrink-0">Clickable</span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="w-full h-36 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 text-xs gap-1">
                                                            <span>Upload a banner image to see preview</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
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
                                                placeholder="/category/apple"
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
                            desc="A full-width media banner. Edit the words separately so they remain readable at every screen size."
                            toggle={data.featureSectionEnabled}
                            onToggle={v => set("featureSectionEnabled", v)}
                        />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <Field label="Headline" value={data.featureSectionTitle} onChange={v => set("featureSectionTitle", v)} />
                                <Field label="Description" value={data.featureSectionSubtitle} onChange={v => set("featureSectionSubtitle", v)} rows={3} />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field label="Button text" value={data.featureSectionCtaText} onChange={v => set("featureSectionCtaText", v)} />
                                    <Field label="Button destination" value={data.featureSectionCtaLink} onChange={v => set("featureSectionCtaLink", v)} placeholder="/products" />
                                </div>
                                <Field label="Media description for accessibility" value={data.featureSectionMediaAlt} onChange={v => set("featureSectionMediaAlt", v)} />
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Desktop media type
                                    <select value={data.featureSectionMediaType || "image"} onChange={e => set("featureSectionMediaType", e.target.value)} className="mt-1 block w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white">
                                        <option value="image">Image or animation</option>
                                        <option value="video">Video</option>
                                    </select>
                                </label>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Interaction
                                    <select value={data.featureSectionInteraction || "none"} onChange={e => set("featureSectionInteraction", e.target.value)} className="mt-1 block w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white">
                                        <option value="none">Still</option>
                                        <option value="hover-zoom">Subtle hover zoom</option>
                                    </select>
                                </label>
                            </div>
                            <div className="space-y-4">
                                <p className="text-sm text-slate-500">Use a wide image, animated WebP/AVIF/GIF, or a short muted MP4/WebM. Keep text out of the media; the storefront overlays editable copy. Video viewers get a play/pause control.</p>
                                <ImageUploader label="Desktop media" allowVideo existingUrl={data.featureSectionImage?.startsWith("/") ? `http://localhost:3000${data.featureSectionImage}` : data.featureSectionImage} onUpload={url => { set("featureSectionImage", url); set("featureSectionMediaType", /\/video\/upload\/|\.(mp4|webm)(?:[?#]|$)/i.test(url) ? "video" : "image"); }} />
                                <Field label="Desktop media URL" value={data.featureSectionImage} onChange={v => set("featureSectionImage", v)} placeholder="https://... or /images/..." />
                                <ImageUploader label="Mobile media (optional)" allowVideo existingUrl={data.featureSectionMobileMedia?.startsWith("/") ? `http://localhost:3000${data.featureSectionMobileMedia}` : data.featureSectionMobileMedia} onUpload={url => set("featureSectionMobileMedia", url)} />
                                <Field label="Mobile media URL (optional)" value={data.featureSectionMobileMedia} onChange={v => set("featureSectionMobileMedia", v)} />
                                <ImageUploader label="Video poster image (optional)" existingUrl={data.featureSectionPosterImage} onUpload={url => set("featureSectionPosterImage", url)} />
                                <Field label="Video poster URL" value={data.featureSectionPosterImage} onChange={v => set("featureSectionPosterImage", v)} />
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

                        <RentalStepsEditor steps={data.rentalProcessSteps || []} onChange={steps => set("rentalProcessSteps", steps)} />
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
                            desc="Manage published customer reviews below. These section settings are shared across storefront pages."
                            toggle={data.testimonialsEnabled}
                            onToggle={v => set("testimonialsEnabled", v)}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Section Title" value={data.testimonialSectionTitle} onChange={v => set("testimonialSectionTitle", v)} />
                            <Field label="Google Rating (1–5)" type="number" min={1} max={5} step={0.1} value={data.testimonialGoogleRating} onChange={v => set("testimonialGoogleRating", v)} />
                            <Field label="Google Review Count Badge" value={data.testimonialGoogleReviewCount} onChange={v => set("testimonialGoogleReviewCount", v)} placeholder="Enter the verified review count" />
                            <div className="md:col-span-2">
                                <Field label="Section Subtitle" value={data.testimonialSectionSubtitle} onChange={v => set("testimonialSectionSubtitle", v)} rows={2} />
                            </div>
                        </div>
                        <Link href="/dashboard/cms/testimonials" className="inline-flex min-h-11 items-center rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700">Manage testimonials</Link>
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
                                <ImageUploader label="Why Choose Us image" existingUrl={data.whyChooseUsImage} onUpload={url => set("whyChooseUsImage", url)} />
                                <button type="button" onClick={() => set("whyChooseUsImage", "")} className="mt-3 rounded-lg border border-slate-300 px-4 py-2 text-sm">Use default equipment image</button>
                            </div>
                        </div>
                    </div>

                    {/* Offers */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
                        <SectionRow
                            icon={<Layout weight="fill" className="text-pink-500" />}
                            title="Offers"
                            desc="Add a wide image, headline, supporting line and destination for each campaign card. The section is hidden on the website until at least one card is added."
                            toggle={data.clientSectionEnabled}
                            onToggle={v => set("clientSectionEnabled", v)}
                        />

                        <Field label="Internal section label" value={data.clientSectionTitle} onChange={v => set("clientSectionTitle", v)} placeholder="e.g. Offers" />

                        {/* Existing offers */}
                        {offers.length > 0 ? (
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-200 uppercase tracking-wider block">
                                    Offers ({offers.length})
                                </label>
                                <div className="space-y-3">
                                    {offers.map((offer, idx) => (
                                        <div key={idx} className="grid grid-cols-1 lg:grid-cols-[180px_minmax(0,1fr)_auto] items-start gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950">
                                            <div className="w-full h-28 rounded-lg bg-[#141414] border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden">
                                                {offer.image ? (
                                                    <img src={offerPreviewUrl(offer.image)} className="w-full h-full object-cover" alt={offer.altText || `Offer ${idx + 1}`} />
                                                ) : (
                                                    <PhosphorImage size={22} className="text-slate-300" />
                                                )}
                                            </div>
                                            <div className="flex-1 space-y-2 min-w-0">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                    <Field label="Headline" value={offer.title} onChange={v => updateOffer(idx, { title: v })} placeholder="The shot starts here." />
                                                    <Field label="Button label" value={offer.ctaText} onChange={v => updateOffer(idx, { ctaText: v })} placeholder="Explore cameras" />
                                                </div>
                                                <Field label="Supporting line" value={offer.subtitle} onChange={v => updateOffer(idx, { subtitle: v })} placeholder="Camera kits for every brief." />
                                                <Field
                                                    label="Image URL"
                                                    value={offer.image}
                                                    onChange={v => updateOffer(idx, { image: v })}
                                                    placeholder="https://res.cloudinary.com/..."
                                                />
                                                <Field
                                                    label="Destination URL"
                                                    value={offer.link}
                                                    onChange={v => updateOffer(idx, { link: v })}
                                                    placeholder="/products or https://..."
                                                />
                                                <Field label="Image description (for image-only cards)" value={offer.altText} onChange={v => updateOffer(idx, { altText: v })} placeholder="Describe the image" />
                                                <ImageUploader label="Replace image (WebP, JPG, PNG, GIF or AVIF)" existingUrl="" onUpload={url => { if (url) updateOffer(idx, { image: url }); }} />
                                            </div>
                                            <button
                                                onClick={() => set("clientLogos", offers.filter((_, i) => i !== idx))}
                                                className="self-start sm:self-center text-red-500 hover:text-red-700 p-2 shrink-0"
                                                title="Remove offer"
                                            >
                                                <Trash size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 text-sm">
                                <Layout size={18} weight="bold" className="shrink-0" />
                                <p>No offers added yet. The section will be hidden on the website until you add at least one offer below.</p>
                            </div>
                        )}

                        {/* Add a new offer */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-200 uppercase tracking-wider block">
                                Add Offer
                            </label>
                            <p className="text-xs text-slate-500 -mt-1">Use a landscape image around 1.9:1 with room for text on the left. The website renders the headline separately so it stays readable on phones.</p>

                            <div className="max-w-xs">
                                <ImageUploader
                                    label=""
                                    existingUrl=""
                                    onUpload={url => { if (url) addOffer(url); }}
                                />
                            </div>

                            <div className="flex items-center gap-2 max-w-xl">
                                <div className="flex-1 h-[1px] bg-slate-200 dark:bg-slate-700" />
                                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Or paste an image link</span>
                                <div className="flex-1 h-[1px] bg-slate-200 dark:bg-slate-700" />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 max-w-xl">
                                <input
                                    type="url"
                                    value={offerImageUrl}
                                    onChange={e => setOfferImageUrl(e.target.value)}
                                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addOfferFromUrl(); } }}
                                    placeholder="https://example.com/offer-banner.jpg"
                                    className="flex-1 h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all"
                                />
                                <button
                                    onClick={addOfferFromUrl}
                                    className="h-10 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors shrink-0"
                                >
                                    <Plus size={14} /> Add Offer
                                </button>
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
