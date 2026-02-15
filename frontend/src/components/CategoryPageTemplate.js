"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaHeart, FaChevronDown, FaInfoCircle, FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { getProducts } from '../services/productService';

// Component factory to generate pages with specific configuration
const createCategoryPage = (config) => {
    const CategoryPage = () => {
        const router = useRouter();
        const [currentPage, setCurrentPage] = useState(1);
        const [products, setProducts] = useState([]);
        const [loading, setLoading] = useState(true);
        const itemsPerPage = 10;

        // Use state for sorting/filtering in a real app
        const [selectedDuration, setSelectedDuration] = useState("3 months");
        const [selectedSort, setSelectedSort] = useState("Most Popular");

        useEffect(() => {
            const fetchAndFilterProducts = async () => {
                try {
                    setLoading(true);
                    const { products: fetchedProducts } = await getProducts({ keyword: config.productNamePrefix });

                    // The backend typically handles the filtering via keyword search, but we can do a safety check
                    const filtered = fetchedProducts;

                    if (filtered.length > 0) {
                        const mappedProducts = filtered.map(p => ({
                            id: p._id,
                            name: p.name,
                            description: p.description || config.productDescription,
                            originalPrice: Math.round((p.rentalPrice || config.basePrice) * 1.5),
                            rentPrice: p.rentalPrice || config.basePrice,
                            discount: "20% off", // Mock discount logic for now
                            image: (p.images && p.images.length > 0) ? p.images[0] : config.image,
                            isNew: p.condition === 'New',
                        }));
                        setProducts(mappedProducts);
                    } else {
                        setProducts([]);
                    }
                } catch (err) {
                    console.error("Failed to fetch products for category", err);
                    setProducts([]);
                } finally {
                    setLoading(false);
                }
            };

            fetchAndFilterProducts();
        }, []);

        const Sidebar = () => {
            const categories = [
                "Most Rented", "Apple Products", "IT Products", "AV Products",
                "Office Equipment", "DSLR Camera & Lenses", "Latest Launch", "More"
            ];
            const durations = ["1 month", "3 months", "6 months", "9 months", "18 months", "24 months"];

            return (
                <aside className="w-64 flex-shrink-0 hidden lg:block pr-8 min-h-screen font-sans">
                    <div className="mb-10">
                        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-6">Browse Categories</h3>
                        <ul className="space-y-4">
                            {categories.map((cat) => (
                                <li key={cat}>
                                    <Link href="#" className={`flex items-center justify-between text-[14px] group transition-all duration-200 ${cat === "Apple Products" ? "text-black font-semibold" : "text-gray-500 hover:text-black"}`}>
                                        {cat}
                                        <span className={`text-lg transition-transform duration-200 ${cat === "Apple Products" ? "text-black translate-x-1" : "text-gray-300 group-hover:text-black group-hover:translate-x-1"}`}>›</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Rent For & Sort By Logic (Same as before) - Simplified for brevity in this factory but fully included in execution */}
                    <div className="mb-10 border-t border-gray-100 pt-8">
                        <div className="flex items-center gap-2 mb-5">
                            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Rent For</h3>
                            <FaInfoCircle className="text-gray-300 hover:text-gray-500 cursor-help" size={12} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {durations.map((duration) => (
                                <button key={duration} onClick={() => setSelectedDuration(duration)} className={`px-3 py-2.5 text-[13px] font-medium rounded-xl border transition-all duration-200 ${selectedDuration === duration ? "border-black bg-white text-black shadow-sm ring-1 ring-black/5" : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 bg-transparent"}`}>{duration}</button>
                            ))}
                        </div>
                    </div>
                    <div className="mb-10 border-t border-gray-100 pt-8">
                        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-5">Sort By</h3>
                        <div className="space-y-4">
                            {["Most Popular", "Price (high to low)", "Price (low to high)", "New Arrivals"].map((option) => (
                                <label key={option} className="flex items-center gap-3 cursor-pointer group" onClick={() => setSelectedSort(option)}>
                                    <div className={`w-5 h-5 rounded-full border transition-all duration-200 flex items-center justify-center ${selectedSort === option ? "border-black" : "border-gray-300 group-hover:border-gray-400"}`}>
                                        {selectedSort === option && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
                                    </div>
                                    <span className={`text-[14px] transition-colors duration-200 ${selectedSort === option ? "text-black font-medium" : "text-gray-500 group-hover:text-gray-800"}`}>{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </aside>
            );
        };

        const ProductCard = ({ product }) => (
            <div className="bg-fuchsia-50 rounded-[28px] p-3 border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 relative flex flex-col h-full group hover:-translate-y-1">
                <div className="absolute top-5 left-5 z-10"><span className="bg-[#FF3B30] text-white text-[10px] font-light px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">{product.discount}</span></div>
                <button className="absolute top-5 right-5 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-400 hover:text-[#FF3B30] transition-colors duration-200"><FaHeart size={14} /></button>
                <Link href={`/products/${product.id}`} className="contents">
                    <div className="relative w-full aspect-[7/8] mb-3 flex items-center justify-center rounded-[32px] overflow-hidden cursor-pointer">
                        <div className="absolute inset-0 pointer-events-none" />
                        <Image src={product.image} alt={product.name} fill className="object-contain p-6 pb-14 group-hover:scale-105 transition-transform duration-500 drop-shadow-xl" />
                        <button className=" absolute bottom-2 left-4 right-4 bg-[#1D1D1F] text-white text-[14px] font-medium py-2 rounded-full hover:bg-white hover:text-black hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 ease-out shadow-lg translate-y-[130%] group-hover:translate-y-0 z-20">Rent Now</button>
                    </div>
                    <div className="flex flex-col flex-1 px-1 cursor-pointer">
                        <h3 className="text-[17px] font-semibold text-[#1D1D1F] mb-1.5 leading-snug tracking-tight line-clamp-2">{product.name}</h3>
                        <p className="text-[11px] text-[#86868B]  line-clamp-2 leading-relaxed text-black">{product.description}</p>
                        <div className="mt-auto">
                            <div className="flex items-baseline flex-wrap gap-x-2 gap-y-1">
                                <span className="text-[13px] text-[#86868B] font-medium">from</span>
                                <span className="text-[13px] text-[#86868B] line-through font-medium">₹{product.originalPrice}</span>
                                <span className="text-[19px] font-bold text-[#FF3B30]">₹{product.rentPrice}</span>
                                <span className="text-[13px] text-[#86868B] font-medium">/month</span>
                            </div>

                        </div>
                    </div>
                </Link>
            </div>
        );

        return (
            <div className="min-h-screen bg-white">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center gap-4 mb-8">
                        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><FaArrowLeft size={24} className="text-gray-900" /></button>
                        <h1 className="text-3xl font-bold text-gray-900">{config.title}</h1>
                    </div>
                    <div className="flex gap-8">
                        <Sidebar />
                        <main className="flex-1">
                            <div className="flex items-center justify-end mb-6"><span className="text-sm text-gray-500">{products.length} products</span></div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                                {products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                            {products.length > itemsPerPage && (
                                <div className="flex justify-center items-center gap-2">
                                    <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"><FaChevronDown className="rotate-90" size={14} /></button>
                                    {Array.from({ length: Math.ceil(products.length / itemsPerPage) }).map((_, i) => (
                                        <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === i + 1 ? "bg-black text-white shadow-md" : "text-gray-500 hover:bg-gray-50"}`}>{i + 1}</button>
                                    ))}
                                    <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(products.length / itemsPerPage)))} disabled={currentPage === Math.ceil(products.length / itemsPerPage)} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"><FaChevronDown className="-rotate-90" size={14} /></button>
                                </div>
                            )}
                        </main>
                    </div>
                </div>
            </div>
        );
    };

    // Add displayName for debugging
    CategoryPage.displayName = `CategoryPage_${config.productNamePrefix.replace(/\s+/g, '_')}`;

    return CategoryPage;
};

export default createCategoryPage;
