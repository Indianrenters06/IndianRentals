'use client';
import toast from 'react-hot-toast';

import React, { useState, useEffect, useCallback } from 'react';
import { Spinner, Switch } from '@heroui/react';
import { FloppyDisk, CheckCircle, Package, Monitor, Heart, Export as ExportIcon, Sparkle, UserCircle, Bank, Truck } from '@phosphor-icons/react';
import { BsTruck } from 'react-icons/bs';
import { FaStar } from 'react-icons/fa';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

// Default empty state
const DEFAULTS = {
    productPageBenefits: ["Fully Functional", "Accessories Included", "Free Repairs & Maintenance", "Professionally sanitized"],
    productPageDeliveryText: "2-4 days",
    productPageDiscountText: "20% off",
    productPageEnableCompare: true,
    productPageEnableRelated: true,
    productPageEnableFaq: true,
    productPageEnableTestimonials: true,
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
                    productPageBenefits: layout.benefits?.length ? layout.benefits : globalData.productPageBenefits,
                    productPageEnableCompare: layout.enableCompare !== undefined && layout.enableCompare !== null ? layout.enableCompare : globalData.productPageEnableCompare,
                    productPageEnableRelated: layout.enableRelated !== undefined && layout.enableRelated !== null ? layout.enableRelated : globalData.productPageEnableRelated,
                    productPageEnableFaq: layout.enableFaq !== undefined && layout.enableFaq !== null ? layout.enableFaq : globalData.productPageEnableFaq,
                    productPageEnableTestimonials: layout.enableTestimonials !== undefined && layout.enableTestimonials !== null ? layout.enableTestimonials : globalData.productPageEnableTestimonials,
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
                    body: JSON.stringify(data),
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
                        benefits: data.productPageBenefits,
                        enableCompare: data.productPageEnableCompare,
                        enableRelated: data.productPageEnableRelated,
                        enableFaq: data.productPageEnableFaq,
                        enableTestimonials: data.productPageEnableTestimonials,
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

    // Dynamic mock values based on selection
    const mockName = selectedProductId !== 'GLOBAL' ? selectedProductData.name : "Sample Product Name (Global Default)";
    const mockCategory = selectedProductId !== 'GLOBAL' ? selectedProductData.category : "Category";
    const mockPrice = selectedProductId !== 'GLOBAL' ? selectedProductData.rentalPrice : "2,560";
    const mockDescription = selectedProductId !== 'GLOBAL' ? selectedProductData.description : "This is a detailed description of the product. It explains the features, condition, and why this is a great item to rent.";

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
                    {saving ? <Spinner size="sm" color="white" /> : <FloppyDisk size={18} weight="bold" />} Save Design
                </button>
            </div>

            {/* Visual Builder Canvas */}
            <div className="w-full bg-[#f9f9f9] rounded-2xl border border-slate-200 overflow-hidden shadow-inner p-6 flex justify-center">
                
                {/* Simulated Product Detail Page Container */}
                <div className="w-full max-w-[1200px] bg-transparent font-sans text-[#1D1D1F]">
                    
                    {/* Simulated Breadcrumb */}
                    <div className="text-[14px] font-medium text-[#586A84] mb-6 flex items-center gap-2">
                        <span>Shop all</span> › <span>{mockCategory}</span> › <span className="text-[#1D1D1F] font-bold">{mockName}</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        
                        {/* Left - Visual Image Preview */}
                        <div className="w-full max-w-[611px] bg-white rounded-xl border border-gray-100 h-[611px] relative flex items-center justify-center">
                            {/* Editable Discount Tag */}
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

                        {/* Right - Product Details Editable */}
                        <div className="flex flex-col gap-6">
                            
                            {/* Title & Price Header */}
                            <div className="flex flex-col gap-2">
                                {selectedProductId !== 'GLOBAL' ? (
                                    <input 
                                        value={selectedProductData?.name || ''}
                                        onChange={e => setProd('name', e.target.value)}
                                        className="text-[40px] leading-[48px] font-bold text-[#1D1D1F] tracking-tight bg-transparent border-b border-transparent hover:border-gray-200 focus:border-blue-500 outline-none w-full"
                                        placeholder="Product Name"
                                    />
                                ) : (
                                    <h1 className="text-[40px] leading-[48px] font-bold text-[#1D1D1F] tracking-tight">{mockName}</h1>
                                )}

                                <div className="flex items-center justify-between border-b border-[#E5E5EA] pb-6 pt-2">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-[28px] font-bold tracking-tight">
                                            ₹{selectedProductId !== 'GLOBAL' ? (
                                                <input 
                                                    value={selectedProductData?.rentalPrice || ''}
                                                    onChange={e => setProd('rentalPrice', e.target.value)}
                                                    className="w-[100px] bg-transparent border-b border-transparent hover:border-gray-200 focus:border-blue-500 outline-none text-[28px]"
                                                />
                                            ) : mockPrice}
                                        </span>
                                        <span className="text-[14px] font-medium text-[#86868B]">/ mo</span>
                                    </div>

                                    {/* Editable Delivery Badge */}
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
                            </div>

                            {/* Plan Benefits (Editable Array) */}
                            <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col gap-2 relative group">
                                <span className="absolute -top-2 -right-2 bg-indigo-500 text-white text-[10px] px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Editable List</span>
                                <p className="text-[14px] font-semibold text-gray-800">What's included in your plan (Edit Below):</p>
                                <textarea
                                    value={data.productPageBenefits?.join(', ') || ''}
                                    onChange={e => set('productPageBenefits', e.target.value.split(',').map(s => s.trim()))}
                                    className="w-full text-[13px] text-gray-600 bg-gray-50 p-2 rounded outline-none border border-transparent focus:border-indigo-300 resize-none h-16"
                                    placeholder="Type benefits separated by commas..."
                                />
                                <div className="flex gap-2 overflow-hidden mt-2 opacity-70">
                                    {(data.productPageBenefits || []).slice(0, 3).map((b, i) => (
                                        <div key={i} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded flex items-center gap-1 truncate">
                                            <Sparkle size={12}/> {b || 'Empty'}
                                        </div>
                                    ))}
                                    {data.productPageBenefits?.length > 3 && <span className="text-xs text-gray-400 mt-1">+{data.productPageBenefits.length - 3} more</span>}
                                </div>
                            </div>

                            {/* Description (Editable if product selected) */}
                            {selectedProductId !== 'GLOBAL' && (
                                <div className="flex flex-col gap-2 mt-4">
                                    <h3 className="text-[14px] font-semibold">Description</h3>
                                    <textarea 
                                        value={selectedProductData?.description || ''}
                                        onChange={e => setProd('description', e.target.value)}
                                        className="w-full min-h-[100px] text-[14px] text-gray-600 bg-transparent border border-transparent hover:border-gray-200 focus:border-blue-500 outline-none rounded p-1 resize-y"
                                        placeholder="Product Description..."
                                    />
                                </div>
                            )}
                            
                            {/* Compare Tenures Modal Toggle */}
                            <div className="flex items-center justify-between border-t border-[#E5E5EA] pt-4 mt-4 relative group">
                                <div className="text-[12px] font-medium text-[#FF5A00] underline underline-offset-4 cursor-pointer">
                                    compare all tenures
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-gray-400 font-medium">Show Link?</span>
                                    <Switch isSelected={data.productPageEnableCompare} onValueChange={v => set('productPageEnableCompare', v)} color="warning" size="sm" />
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Bottom Sections */}
                    <div className="mt-16 flex flex-col gap-12 border-t border-gray-200 pt-12">
                        
                        {/* Visual Testimonials Block */}
                        <div className={`relative transition-all duration-300 ${!data.productPageEnableTestimonials ? 'opacity-40 grayscale' : ''}`}>
                            <div className="absolute -top-4 right-0 z-10 flex items-center gap-2 bg-white px-3 py-1.5 shadow-sm rounded-lg border border-gray-100">
                                <span className="text-xs font-bold text-gray-500">Testimonials Visibility</span>
                                <Switch isSelected={data.productPageEnableTestimonials} onValueChange={v => set('productPageEnableTestimonials', v)} size="sm" color="success" />
                            </div>
                            <div className="text-center mb-8">
                                <h2 className="text-[32px] font-bold tracking-tight">Don't just take our word for it</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                        <div className="flex text-yellow-400 mb-3"><FaStar/><FaStar/><FaStar/><FaStar/><FaStar/></div>
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

                        {/* Visual FAQs Block with Editing */}
                        <div className={`relative transition-all duration-300 ${!data.productPageEnableFaq ? 'opacity-40 grayscale' : ''}`}>
                            <div className="absolute -top-4 right-0 z-10 flex items-center gap-2 bg-white px-3 py-1.5 shadow-sm rounded-lg border border-gray-100">
                                <span className="text-xs font-bold text-gray-500">FAQs Visibility</span>
                                <Switch isSelected={data.productPageEnableFaq} onValueChange={v => set('productPageEnableFaq', v)} size="sm" color="success" />
                            </div>
                            <div className="mb-8">
                                <h2 className="text-[32px] font-bold tracking-tight">Product FAQs</h2>
                            </div>
                            
                            <div className="flex flex-col gap-3">
                                {selectedProductId === 'GLOBAL' ? (
                                    <div className="p-6 bg-white border border-gray-200 rounded-xl text-center text-gray-500">
                                        Select a specific product from the top menu to edit its specific FAQs here.
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

                        {/* Visual Related Products Block */}
                        <div className={`relative transition-all duration-300 ${!data.productPageEnableRelated ? 'opacity-40 grayscale' : ''}`}>
                            <div className="absolute -top-4 right-0 z-10 flex items-center gap-2 bg-white px-3 py-1.5 shadow-sm rounded-lg border border-gray-100">
                                <span className="text-xs font-bold text-gray-500">Related Products Visibility</span>
                                <Switch isSelected={data.productPageEnableRelated} onValueChange={v => set('productPageEnableRelated', v)} size="sm" color="success" />
                            </div>
                            <div className="mb-8">
                                <h2 className="text-[32px] font-bold tracking-tight">Best Rented Products</h2>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-[250px] flex flex-col">
                                        <div className="h-[150px] bg-gray-100 flex items-center justify-center text-gray-400">
                                            <Package size={32} />
                                        </div>
                                        <div className="p-4 flex flex-col gap-2">
                                            <div className="w-3/4 h-3 bg-gray-200 rounded"></div>
                                            <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {selectedProductId !== 'GLOBAL' && (
                                <div className="mt-6 bg-white p-6 rounded-xl border border-gray-200">
                                    <h3 className="font-bold text-gray-800 mb-2">Override Related Products</h3>
                                    <p className="text-xs text-gray-500 mb-4">Select specific products to show in this slider for this product only. Leave empty to use global default.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {products.filter(p => p._id !== selectedProductId).map(p => (
                                            <label key={p._id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    checked={(selectedProductData?.relatedProducts || []).includes(p._id)}
                                                    onChange={(e) => {
                                                        const current = [...(selectedProductData?.relatedProducts || [])];
                                                        if (e.target.checked) {
                                                            setProd('relatedProducts', [...current, p._id]);
                                                        } else {
                                                            setProd('relatedProducts', current.filter(id => id !== p._id));
                                                        }
                                                    }}
                                                    className="w-4 h-4 text-indigo-600 rounded"
                                                />
                                                <span className="text-sm font-medium text-gray-700">{p.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
