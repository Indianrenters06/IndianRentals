'use client';
import toast from 'react-hot-toast';

import React, { useState, useEffect, useCallback } from 'react';
import { Spinner, Switch } from '@heroui/react';
import { FloppyDisk, Monitor, Package, Sparkle } from '@phosphor-icons/react';
import { BsTruck } from 'react-icons/bs';
import { FaStar } from 'react-icons/fa';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

const DEFAULTS = {
    productPageBenefits: ["Fully Functional", "Accessories Included", "Free Repairs & Maintenance", "Professionally sanitized"],
    productPageDeliveryText: "2-4 days",
    productPageDiscountText: "20% off",
    productPageCtaText: "Rent Now",
    productPageCompareLinkText: "compare all tenures",
    productPageBenefitsHeading: "What's included in your plan:",
    productPageTestimonialsHeading: "Don't just take our word for it",
    productPageFaqHeading: "Product FAQs",
    productPageRelatedHeading: "Best Rented Products",
    productPageGlobalRelatedIds: [],
    productPageEnableCompare: true,
    productPageEnableRelated: true,
    productPageEnableFaq: true,
    productPageEnableTestimonials: true,
    productPageEnableRating: true,
};

export default function ProductPageCMS() {
    const [globalData, setGlobalData] = useState(DEFAULTS);
    const [data, setData] = useState(DEFAULTS);
    const [products, setProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState('GLOBAL');
    const [selectedProductData, setSelectedProductData] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    const set = (k, v) => setData(p => ({ ...p, [k]: v }));
    const setProd = (k, v) => setSelectedProductData(p => ({ ...p, [k]: v }));

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const resCms = await window.fetch(`${API}/api/cms/product-page?t=${Date.now()}`);
            if (resCms.ok) {
                const json = await resCms.json();
                setGlobalData({ ...DEFAULTS, ...json });
                if (selectedProductId === 'GLOBAL') setData({ ...DEFAULTS, ...json });
            }
            const resProd = await window.fetch(`${API}/api/products?limit=500`);
            if (resProd.ok) {
                const prodJson = await resProd.json();
                setProducts(prodJson.products || []);
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }, [selectedProductId]);

    useEffect(() => { loadData(); }, [loadData]);

    const handleProductSelect = (e) => {
        const id = e.target.value;
        setSelectedProductId(id);
        if (id === 'GLOBAL') {
            setData(globalData);
            setSelectedProductData(null);
        } else {
            const prod = products.find(p => p._id === id);
            if (prod) {
                setSelectedProductData({
                    ...prod,
                    faqs: prod.faqs || [],
                    relatedProducts: prod.pageLayout?.relatedProducts?.map(r => r._id || r) || []
                });
                const layout = prod.pageLayout || {};
                setData({
                    productPageDeliveryText: layout.deliveryText || "",
                    productPageDiscountText: layout.discountText || "",
                    productPageCtaText: layout.ctaText || globalData.productPageCtaText,
                    productPageCompareLinkText: layout.compareLinkText || globalData.productPageCompareLinkText,
                    productPageBenefitsHeading: layout.benefitsHeading || globalData.productPageBenefitsHeading,
                    productPageTestimonialsHeading: layout.testimonialsHeading || globalData.productPageTestimonialsHeading,
                    productPageFaqHeading: layout.faqHeading || globalData.productPageFaqHeading,
                    productPageRelatedHeading: layout.relatedHeading || globalData.productPageRelatedHeading,
                    productPageBenefits: layout.benefits?.length ? layout.benefits : globalData.productPageBenefits,
                    productPageEnableCompare: layout.enableCompare !== undefined && layout.enableCompare !== null ? layout.enableCompare : globalData.productPageEnableCompare,
                    productPageEnableRelated: layout.enableRelated !== undefined && layout.enableRelated !== null ? layout.enableRelated : globalData.productPageEnableRelated,
                    productPageEnableFaq: layout.enableFaq !== undefined && layout.enableFaq !== null ? layout.enableFaq : globalData.productPageEnableFaq,
                    productPageEnableTestimonials: layout.enableTestimonials !== undefined && layout.enableTestimonials !== null ? layout.enableTestimonials : globalData.productPageEnableTestimonials,
                    productPageEnableRating: layout.enableRating !== undefined && layout.enableRating !== null ? layout.enableRating : globalData.productPageEnableRating,
                });
            }
        }
    };

    const save = async () => {
        try {
            setSaving(true);
            if (selectedProductId === 'GLOBAL') {
                const res = await window.fetch(`${API}/api/cms/product-page`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                    body: JSON.stringify({ ...data, productPageGlobalRelatedIds: data.productPageGlobalRelatedIds || [] }),
                });
                if (!res.ok) throw new Error('Failed to save global template');
                setGlobalData(data);
            } else {
                const payload = {
                    name: selectedProductData.name,
                    description: selectedProductData.description,
                    rentalPrice: selectedProductData.rentalPrice,
                    faqs: selectedProductData.faqs,
                    pageLayout: {
                        deliveryText: data.productPageDeliveryText,
                        discountText: data.productPageDiscountText,
                        ctaText: data.productPageCtaText,
                        compareLinkText: data.productPageCompareLinkText,
                        benefitsHeading: data.productPageBenefitsHeading,
                        testimonialsHeading: data.productPageTestimonialsHeading,
                        faqHeading: data.productPageFaqHeading,
                        relatedHeading: data.productPageRelatedHeading,
                        benefits: data.productPageBenefits,
                        enableCompare: data.productPageEnableCompare,
                        enableRelated: data.productPageEnableRelated,
                        enableFaq: data.productPageEnableFaq,
                        enableTestimonials: data.productPageEnableTestimonials,
                        enableRating: data.productPageEnableRating,
                        relatedProducts: selectedProductData.relatedProducts
                    }
                };
                const res = await window.fetch(`${API}/api/products/${selectedProductId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                    body: JSON.stringify(payload),
                });
                if (!res.ok) throw new Error('Failed to save product details');
            }
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (e) { toast.error(e.message); }
        finally { setSaving(false); }
    };

    if (!mounted || loading) return (
        <div className="flex items-center justify-center gap-3 py-24 text-slate-400">
            <Spinner size="sm" color="secondary" /> Loading Product Page Builder…
        </div>
    );

    const mockName = selectedProductId !== 'GLOBAL' ? selectedProductData.name : "Sample Product Name (Global Default)";
    const mockCategory = selectedProductId !== 'GLOBAL' ? selectedProductData.category : "Category";
    const mockPrice = selectedProductId !== 'GLOBAL' ? selectedProductData.rentalPrice : "2,560";
    const mockDescription = selectedProductId !== 'GLOBAL' ? selectedProductData.description : "This is a detailed description of the product. It explains the features, condition, and why this is a great item to rent.";

    const isProduct = selectedProductId !== 'GLOBAL';

    return (
        <div className="space-y-6 pb-16">
            {/* Toolbar */}
            <div className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-4 -mx-6 px-6 mb-6 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <Monitor size={24} className="text-indigo-500" /> Visual Page Builder
                    </h1>
                    <div className="h-6 w-[1px] bg-slate-300 dark:bg-slate-700 mx-2"></div>
                    <select
                        value={selectedProductId}
                        onChange={handleProductSelect}
                        className="h-10 px-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-indigo-500/30"
                    >
                        <option value="GLOBAL">Edit Global Master Template</option>
                        <optgroup label="Edit Specific Product">
                            {products.map(p => (
                                <option key={p._id} value={p._id}>{p.name}</option>
                            ))}
                        </optgroup>
                    </select>
                </div>
                <button onClick={save} disabled={saving}
                    className="flex items-center gap-2 h-10 px-6 rounded-lg bg-[#FF5A00] hover:bg-[#E04D00] disabled:opacity-60 text-white font-bold text-sm transition-all shadow-md">
                    {saving ? <Spinner size="sm" color="white" /> : <FloppyDisk size={18} weight="bold" />}
                    {saved ? 'Saved!' : 'Save Design'}
                </button>
            </div>

            {/* Visual Builder Canvas */}
            <div className="w-full bg-[#f9f9f9] rounded-2xl border border-slate-200 overflow-hidden shadow-inner p-6 flex justify-center">
                <div className="w-full max-w-[1200px] bg-transparent font-sans text-[#1D1D1F]">

                    {/* ── Breadcrumb ── */}
                    <div className="text-[14px] font-medium text-[#586A84] mb-6 flex items-center gap-2">
                        <span>Shop all</span> › <span>{mockCategory}</span> › <span className="text-[#1D1D1F] font-bold">{mockName}</span>
                    </div>

                    {/* ── 2-Column Layout ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                        {/* Left – Image area with discount badge */}
                        <div className="w-full max-w-[611px] bg-white rounded-xl border border-gray-100 h-[611px] relative flex items-center justify-center">
                            <div className="absolute top-6 left-6 z-10">
                                <input
                                    value={data.productPageDiscountText}
                                    onChange={e => set('productPageDiscountText', e.target.value)}
                                    className="bg-[#FF3B30] text-white text-[12px] font-bold px-3 py-1 rounded-[6px] outline-none border border-transparent focus:border-white focus:ring-2 focus:ring-red-500/50"
                                    placeholder="e.g. 20% off"
                                    title="Edit Discount Tag"
                                />
                            </div>
                            <div className="text-gray-300 flex flex-col items-center">
                                <Package size={64} />
                                <span className="mt-4 font-medium">Product Image Gallery Placeholder</span>
                            </div>
                        </div>

                        {/* Right – Product details */}
                        <div className="flex flex-col gap-5">

                            {/* Product Name */}
                            <div>
                                {isProduct ? (
                                    <input
                                        value={selectedProductData?.name || ''}
                                        onChange={e => setProd('name', e.target.value)}
                                        className="text-[40px] leading-[48px] font-bold text-[#1D1D1F] tracking-tight bg-transparent border-b border-transparent hover:border-gray-200 focus:border-blue-500 outline-none w-full"
                                        placeholder="Product Name"
                                    />
                                ) : (
                                    <h1 className="text-[40px] leading-[48px] font-bold text-[#1D1D1F] tracking-tight">{mockName}</h1>
                                )}
                            </div>

                            {/* Rating row */}
                            <div className={`flex items-center justify-between transition-all duration-200 ${!data.productPageEnableRating ? 'opacity-40 grayscale' : ''}`}>
                                <div className="flex items-center gap-2">
                                    <div className="flex text-yellow-400 text-sm">
                                        <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                                    </div>
                                    <span className="text-[13px] text-[#586A84]">4.8 · 124 reviews</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-gray-400 font-medium">Show Ratings?</span>
                                    <Switch isSelected={data.productPageEnableRating} onValueChange={v => set('productPageEnableRating', v)} color="warning" size="sm" />
                                </div>
                            </div>

                            {/* Price + Delivery badge */}
                            <div className="flex items-center justify-between border-b border-[#E5E5EA] pb-5">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-[28px] font-bold tracking-tight">
                                        ₹{isProduct ? (
                                            <input
                                                value={selectedProductData?.rentalPrice || ''}
                                                onChange={e => setProd('rentalPrice', e.target.value)}
                                                className="w-[100px] bg-transparent border-b border-transparent hover:border-gray-200 focus:border-blue-500 outline-none text-[28px]"
                                            />
                                        ) : mockPrice}
                                    </span>
                                    <span className="text-[14px] font-medium text-[#86868B]">/ mo</span>
                                </div>
                                <div className="bg-[#00B200] text-white text-[12px] font-medium px-3 py-1.5 rounded-[6px] flex items-center gap-1.5">
                                    <BsTruck size={14} />
                                    <input
                                        value={data.productPageDeliveryText}
                                        onChange={e => set('productPageDeliveryText', e.target.value)}
                                        className="bg-transparent text-white outline-none border border-transparent focus:border-white w-[70px]"
                                        placeholder="2-4 days"
                                        title="Edit Delivery Time"
                                    />
                                </div>
                            </div>

                            {/* Benefits */}
                            <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col gap-2 relative group">
                                <span className="absolute -top-2 -right-2 bg-indigo-500 text-white text-[10px] px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Editable List</span>
                                <input
                                    value={data.productPageBenefitsHeading}
                                    onChange={e => set('productPageBenefitsHeading', e.target.value)}
                                    className="text-[14px] font-semibold text-gray-800 bg-transparent outline-none border-b border-transparent focus:border-indigo-300 w-full"
                                    placeholder="Section heading..."
                                />
                                <textarea
                                    value={data.productPageBenefits?.join(', ') || ''}
                                    onChange={e => set('productPageBenefits', e.target.value.split(',').map(s => s.trim()))}
                                    className="w-full text-[13px] text-gray-600 bg-gray-50 p-2 rounded outline-none border border-transparent focus:border-indigo-300 resize-none h-16"
                                    placeholder="Type benefits separated by commas..."
                                />
                                <div className="flex gap-2 overflow-hidden mt-1 opacity-70 flex-wrap">
                                    {(data.productPageBenefits || []).slice(0, 3).map((b, i) => (
                                        <div key={i} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded flex items-center gap-1">
                                            <Sparkle size={12} /> {b || 'Empty'}
                                        </div>
                                    ))}
                                    {data.productPageBenefits?.length > 3 && <span className="text-xs text-gray-400 mt-1">+{data.productPageBenefits.length - 3} more</span>}
                                </div>
                            </div>

                            {/* CTA Button */}
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-12 bg-[#FF5A00] rounded-xl flex items-center justify-center">
                                    <input
                                        value={data.productPageCtaText}
                                        onChange={e => set('productPageCtaText', e.target.value)}
                                        className="bg-transparent text-white font-bold text-[15px] text-center outline-none border border-transparent focus:border-white/50 rounded w-full px-4"
                                        placeholder="Rent Now"
                                        title="Edit CTA Button Text"
                                    />
                                </div>
                                <div className="w-12 h-12 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-400 cursor-pointer hover:text-red-500 transition-colors">
                                    ♡
                                </div>
                            </div>

                            {/* Description */}
                            {isProduct && (
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-[14px] font-semibold">Description</h3>
                                    <textarea
                                        value={selectedProductData?.description || ''}
                                        onChange={e => setProd('description', e.target.value)}
                                        className="w-full min-h-[100px] text-[14px] text-gray-600 bg-transparent border border-transparent hover:border-gray-200 focus:border-blue-500 outline-none rounded p-1 resize-y"
                                        placeholder="Product Description..."
                                    />
                                </div>
                            )}

                            {/* Compare Tenures link */}
                            <div className={`flex items-center justify-between border-t border-[#E5E5EA] pt-4 transition-all ${!data.productPageEnableCompare ? 'opacity-40 grayscale' : ''}`}>
                                <input
                                    value={data.productPageCompareLinkText}
                                    onChange={e => set('productPageCompareLinkText', e.target.value)}
                                    className="text-[12px] font-medium text-[#FF5A00] underline underline-offset-4 bg-transparent outline-none border-b border-transparent focus:border-[#FF5A00] w-[180px]"
                                    title="Edit compare link text"
                                />
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-gray-400 font-medium">Show Link?</span>
                                    <Switch isSelected={data.productPageEnableCompare} onValueChange={v => set('productPageEnableCompare', v)} color="warning" size="sm" />
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* ── Bottom Sections ── */}
                    <div className="mt-16 flex flex-col gap-12 border-t border-gray-200 pt-12">

                        {/* Testimonials */}
                        <div className={`relative transition-all duration-300 ${!data.productPageEnableTestimonials ? 'opacity-40 grayscale' : ''}`}>
                            <div className="absolute -top-4 right-0 z-10 flex items-center gap-2 bg-white px-3 py-1.5 shadow-sm rounded-lg border border-gray-100">
                                <span className="text-xs font-bold text-gray-500">Testimonials</span>
                                <Switch isSelected={data.productPageEnableTestimonials} onValueChange={v => set('productPageEnableTestimonials', v)} size="sm" color="success" />
                            </div>
                            <div className="text-center mb-8">
                                <input
                                    value={data.productPageTestimonialsHeading}
                                    onChange={e => set('productPageTestimonialsHeading', e.target.value)}
                                    className="text-[32px] font-bold tracking-tight bg-transparent outline-none border-b-2 border-transparent hover:border-gray-200 focus:border-indigo-400 text-center w-full"
                                    placeholder="Section heading..."
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                        <div className="flex text-yellow-400 mb-3"><FaStar /><FaStar /><FaStar /><FaStar /><FaStar /></div>
                                        <div className="w-full h-2 bg-gray-100 rounded mb-2"></div>
                                        <div className="w-3/4 h-2 bg-gray-100 rounded mb-6"></div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                            <div className="w-20 h-2 bg-gray-200 rounded"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* FAQs */}
                        <div className={`relative transition-all duration-300 ${!data.productPageEnableFaq ? 'opacity-40 grayscale' : ''}`}>
                            <div className="absolute -top-4 right-0 z-10 flex items-center gap-2 bg-white px-3 py-1.5 shadow-sm rounded-lg border border-gray-100">
                                <span className="text-xs font-bold text-gray-500">FAQs</span>
                                <Switch isSelected={data.productPageEnableFaq} onValueChange={v => set('productPageEnableFaq', v)} size="sm" color="success" />
                            </div>
                            <div className="mb-8">
                                <input
                                    value={data.productPageFaqHeading}
                                    onChange={e => set('productPageFaqHeading', e.target.value)}
                                    className="text-[32px] font-bold tracking-tight bg-transparent outline-none border-b-2 border-transparent hover:border-gray-200 focus:border-indigo-400 w-full"
                                    placeholder="Section heading..."
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                {!isProduct ? (
                                    <div className="p-6 bg-white border border-gray-200 rounded-xl text-center text-gray-500">
                                        Select a specific product from the top menu to edit its FAQs here.
                                    </div>
                                ) : (
                                    <>
                                        {(selectedProductData?.faqs || []).map((faq, i) => (
                                            <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3 relative">
                                                <button
                                                    onClick={() => {
                                                        const newFaqs = [...(selectedProductData.faqs || [])];
                                                        newFaqs.splice(i, 1);
                                                        setProd('faqs', newFaqs);
                                                    }}
                                                    className="absolute top-4 right-4 text-xs text-red-500 hover:underline"
                                                >Remove</button>
                                                <input
                                                    value={faq.question}
                                                    onChange={e => {
                                                        const newFaqs = [...(selectedProductData.faqs || [])];
                                                        newFaqs[i].question = e.target.value;
                                                        setProd('faqs', newFaqs);
                                                    }}
                                                    className="font-bold text-[#1D1D1F] outline-none border-b border-transparent focus:border-indigo-300 w-[90%]"
                                                    placeholder="Question?"
                                                />
                                                <textarea
                                                    value={faq.answer}
                                                    onChange={e => {
                                                        const newFaqs = [...(selectedProductData.faqs || [])];
                                                        newFaqs[i].answer = e.target.value;
                                                        setProd('faqs', newFaqs);
                                                    }}
                                                    className="text-sm text-gray-600 outline-none border-b border-transparent focus:border-indigo-300 resize-none h-16 w-[90%]"
                                                    placeholder="Answer..."
                                                />
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => {
                                                const newFaqs = [...(selectedProductData.faqs || []), { question: '', answer: '' }];
                                                setProd('faqs', newFaqs);
                                            }}
                                            className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-500 rounded-xl font-medium hover:bg-gray-50 hover:text-indigo-500 hover:border-indigo-300 transition-colors"
                                        >
                                            + Add New FAQ
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Related Products */}
                        <div className={`relative transition-all duration-300 ${!data.productPageEnableRelated ? 'opacity-40 grayscale' : ''}`}>
                            <div className="absolute -top-4 right-0 z-10 flex items-center gap-2 bg-white px-3 py-1.5 shadow-sm rounded-lg border border-gray-100">
                                <span className="text-xs font-bold text-gray-500">Related Products</span>
                                <Switch isSelected={data.productPageEnableRelated} onValueChange={v => set('productPageEnableRelated', v)} size="sm" color="success" />
                            </div>
                            <div className="mb-8">
                                <input
                                    value={data.productPageRelatedHeading}
                                    onChange={e => set('productPageRelatedHeading', e.target.value)}
                                    className="text-[32px] font-bold tracking-tight bg-transparent outline-none border-b-2 border-transparent hover:border-gray-200 focus:border-indigo-400 w-full"
                                    placeholder="Section heading..."
                                />
                            </div>

                            {/* Interactive 4-slot product picker */}
                            {(() => {
                                const relatedIds = isProduct
                                    ? (selectedProductData?.relatedProducts || [])
                                    : (data.productPageGlobalRelatedIds || []);

                                const setRelated = (newIds) => {
                                    if (isProduct) setProd('relatedProducts', newIds);
                                    else set('productPageGlobalRelatedIds', newIds);
                                };

                                const usedIds = new Set(relatedIds.filter(Boolean));

                                const availableFor = (slotId) =>
                                    products.filter(p =>
                                        p._id !== selectedProductId &&
                                        (!usedIds.has(p._id) || p._id === slotId)
                                    );

                                return (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {[0, 1, 2, 3].map(i => {
                                            const productId = relatedIds[i];
                                            const product = products.find(p => p._id === productId);

                                            const removeSlot = () => {
                                                const next = [...relatedIds];
                                                next.splice(i, 1);
                                                setRelated(next);
                                            };

                                            const setSlot = (newId) => {
                                                const next = [...relatedIds];
                                                next[i] = newId;
                                                setRelated(next);
                                            };

                                            return (
                                                <div key={i} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden h-[250px] flex flex-col relative group">
                                                    {product ? (
                                                        <>
                                                            <div className="h-[150px] bg-gray-100 flex items-center justify-center text-gray-300 shrink-0">
                                                                <Package size={36} />
                                                            </div>
                                                            <div className="p-3 flex flex-col gap-1">
                                                                <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug">{product.name}</p>
                                                                <p className="text-xs text-gray-500 font-medium">₹{product.rentalPrice}/mo</p>
                                                            </div>
                                                            {/* Hover overlay: change or remove */}
                                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 rounded-2xl px-3">
                                                                <select
                                                                    value={productId}
                                                                    onChange={e => setSlot(e.target.value)}
                                                                    className="text-xs bg-white text-gray-800 px-2 py-1.5 rounded-lg w-full font-medium cursor-pointer"
                                                                >
                                                                    {availableFor(productId).map(p => (
                                                                        <option key={p._id} value={p._id}>{p.name}</option>
                                                                    ))}
                                                                </select>
                                                                <button onClick={removeSlot} className="text-xs text-white bg-red-500 hover:bg-red-600 px-4 py-1.5 rounded-lg font-semibold w-full transition-colors">
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="h-full flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-200 rounded-2xl p-3">
                                                            <Package size={28} className="text-gray-300" />
                                                            <select
                                                                value=""
                                                                onChange={e => e.target.value && setSlot(e.target.value)}
                                                                className="text-xs bg-gray-50 border border-gray-200 text-gray-500 px-2 py-1.5 rounded-lg w-full cursor-pointer"
                                                            >
                                                                <option value="">+ Pick a product</option>
                                                                {availableFor(null).map(p => (
                                                                    <option key={p._id} value={p._id}>{p.name}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })()}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
