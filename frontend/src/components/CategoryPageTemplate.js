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
                    const mappedProducts = fetchedProducts.map(p => ({
                        id: p._id,
                        name: p.name,
                        description: p.description || productDescription,
                        originalPrice: Math.round((p.rentalPrice || basePrice) * 1.5),
                        rentPrice: p.rentalPrice || basePrice,
                        discount: "20% off",
                        image: (p.images && p.images.length > 0) ? p.images[0] : image,
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
    }, [isClient, productNamePrefix, productDescription, basePrice, image]);

    if (!isClient && typeof window === 'undefined') {
        return <div className="min-h-screen bg-white" />;
    }

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

export default CategoryPageTemplate;
