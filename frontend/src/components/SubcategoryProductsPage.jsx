'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import { FiPackage } from 'react-icons/fi';
import { getProductsBySubcategory, getProducts } from '../services/productService';
import ProductCard from './ProductCard';

/**
 * SubcategoryProductsPage
 * 
 * Reusable page that lists all products in a given subcategory.
 * 
 * Props:
 *  - subcategoryId   (string)  MongoDB ObjectId of the subcategory — used to filter products
 *  - subcategoryName (string)  Display name, e.g. "MacBook Pro"
 *  - parentName      (string)  Parent category name, e.g. "Apple"
 *  - parentHref      (string)  Back-link href, e.g. "/category/apple"
 */
export default function SubcategoryProductsPage({ subcategoryId, subcategoryName, parentName, parentHref }) {
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('default');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                let data;
                if (subcategoryId) {
                    // Fetch by subcategory ObjectId (precise DB filter)
                    data = await getProductsBySubcategory(subcategoryId);
                } else {
                    // Fallback: filter by category name
                    data = await getProducts({ category: parentName });
                }
                const list = Array.isArray(data) ? data : (data.products || []);
                setProducts(list);
            } catch (err) {
                console.error('Failed to load products:', err);
                setError('Failed to load products. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [subcategoryId, parentName]);

    const sortedProducts = [...products].sort((a, b) => {
        if (sortBy === 'price-asc') return a.rentalPrice - b.rentalPrice;
        if (sortBy === 'price-desc') return b.rentalPrice - a.rentalPrice;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
    });

    return (
        <div className="min-h-screen bg-white">
            <main className="px-4 pt-5 pb-10 max-w-7xl mx-auto sm:px-6 lg:px-8">

                {/* Top bar: Back + Title + Sort */}
                <div className="flex items-center justify-between gap-3 mb-6">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.back()}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <FaArrowLeft size={18} className="text-gray-800" />
                        </button>
                        <div>
                            <p className="text-xs text-gray-500">
                                <Link href="/" className="hover:underline">Home</Link>
                                {' › '}
                                <Link href={parentHref || '#'} className="hover:underline">{parentName}</Link>
                                {' › '}
                                <span className="text-gray-800">{subcategoryName}</span>
                            </p>
                            <h1 className="text-xl md:text-2xl font-bold text-gray-900">{subcategoryName}</h1>
                        </div>
                    </div>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                        <option value="default">Sort: Default</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="name">Name: A-Z</option>
                    </select>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div key={n} className="animate-pulse">
                                <div className="bg-gray-100 rounded-2xl aspect-4/3 mb-2" />
                                <div className="h-4 bg-gray-100 rounded w-3/4 mx-auto" />
                                <div className="h-3 bg-gray-100 rounded w-1/2 mx-auto mt-1" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="text-center py-16">
                        <p className="text-gray-500 text-sm">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && sortedProducts.length === 0 && (
                    <div className="text-center py-20">
                        <FiPackage size={48} className="mx-auto text-gray-300 mb-4" />
                        <h2 className="text-lg font-semibold text-gray-700">No products available yet</h2>
                        <p className="text-sm text-gray-400 mt-1">
                            The admin hasn&apos;t added any {subcategoryName} products yet. Check back soon!
                        </p>
                        <Link
                            href={parentHref || '/'}
                            className="inline-block mt-6 px-6 py-2.5 bg-gray-900 text-white rounded-full text-sm hover:bg-gray-800 transition-colors"
                        >
                            ← Back to {parentName}
                        </Link>
                    </div>
                )}

                {/* Product Grid */}
                {!loading && !error && sortedProducts.length > 0 && (
                    <>
                        <p className="text-xs text-gray-400 mb-4">{sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''} found</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                            {sortedProducts.map((product) => (
                                <ProductCard 
                                    key={product._id} 
                                    product={{
                                        ...product,
                                        id: product._id,
                                        image: product.images?.[0] || "/images/placeholder.png",
                                        rentPrice: product.rentalPrice,
                                        originalPrice: product.rentalPrice ? Math.round(product.rentalPrice * 1.5) : 8999
                                    }} 
                                />
                            ))}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
