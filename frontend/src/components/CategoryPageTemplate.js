"use client";
import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { getProducts } from '@/services/productService';
import Sidebar from './Sidebar';
import ProductCard from './ProductCard';

const CategoryPageTemplate = ({ productNamePrefix, productDescription, basePrice, image, title }) => {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isClient, setIsClient] = useState(false);
    const itemsPerPage = 10;

    const [selectedDuration, setSelectedDuration] = useState("3 months");
    const [selectedSort, setSelectedSort] = useState("Most Popular");

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient) return;
        const fetchAndFilterProducts = async () => {
            try {
                setLoading(true);
                const { products: fetchedProducts } = await getProducts({ keyword: productNamePrefix });

                if (fetchedProducts && fetchedProducts.length > 0) {
                    const mappedProducts = fetchedProducts.map(p => {
                        const baseOrigin = Math.round((p.rentalPrice || basePrice) * 1.5);
                        const baseRent = p.rentalPrice || basePrice;
                        return {
                            id: p._id,
                            name: p.name,
                            description: p.description || productDescription,
                            baseOriginalPrice: baseOrigin,
                            baseRentPrice: baseRent,
                            originalPrice: baseOrigin,
                            rentPrice: baseRent,
                            discount: "20% off",
                            image: (p.images && p.images.length > 0) ? p.images[0] : image,
                            isNew: p.condition === 'New',
                        };
                    });
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
    }, [isClient, productNamePrefix, productDescription, basePrice, image]);

    if (!isClient && typeof window === 'undefined') {
        return <div className="min-h-screen bg-white" />;
    }

    const getDurationMultiplier = (duration) => {
        switch (duration) {
            case "1 month": return 1.2;
            case "3 months": return 1.0;
            case "6 months": return 0.85;
            case "9 months": return 0.75;
            case "18 months": return 0.65;
            case "24 months": return 0.55;
            default: return 1.0;
        }
    };

    const processedProducts = React.useMemo(() => {
        let results = [...products];
        const multiplier = getDurationMultiplier(selectedDuration);

        results = results.map(p => ({
            ...p,
            rentPrice: Math.round(p.baseRentPrice * multiplier),
            originalPrice: Math.round(p.baseOriginalPrice * multiplier),
            selectedDurationStr: selectedDuration
        }));

        if (selectedSort === "Price (high to low)") {
            results.sort((a, b) => b.rentPrice - a.rentPrice);
        } else if (selectedSort === "Price (low to high)") {
            results.sort((a, b) => a.rentPrice - b.rentPrice);
        } else if (selectedSort === "New Arrivals") {
            results.sort((a, b) => (b.isNew === a.isNew) ? 0 : b.isNew ? 1 : -1);
        }

        return results;
    }, [products, selectedDuration, selectedSort]);

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><FaArrowLeft size={24} className="text-gray-900" /></button>
                    <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                </div>
                <div className="flex gap-8">
                    <Sidebar
                        selectedDuration={selectedDuration}
                        setSelectedDuration={setSelectedDuration}
                        selectedSort={selectedSort}
                        setSelectedSort={setSelectedSort}
                    />
                    <main className="flex-1">
                        <div className="flex items-center justify-end mb-6"><span className="text-sm text-gray-500">{processedProducts.length} products</span></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            {processedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                        {processedProducts.length > itemsPerPage && (
                            <div className="flex justify-center items-center gap-2">
                                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"><FaChevronDown className="rotate-90" size={14} /></button>
                                {Array.from({ length: Math.ceil(processedProducts.length / itemsPerPage) }).map((_, i) => (
                                    <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === i + 1 ? "bg-black text-white shadow-md" : "text-gray-500 hover:bg-gray-50"}`}>{i + 1}</button>
                                ))}
                                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(processedProducts.length / itemsPerPage)))} disabled={currentPage === Math.ceil(processedProducts.length / itemsPerPage)} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"><FaChevronDown className="-rotate-90" size={14} /></button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default CategoryPageTemplate;
