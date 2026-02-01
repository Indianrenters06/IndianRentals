"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { getCategories } from '../../../services/categoryService';

const initialDSLRProducts = [
    { name: "DSLR Camera", image: "/placeholder.jpg", href: "/category/dslr/camera" },
    { name: "Video Camera", image: "/placeholder.jpg", href: "/category/dslr/video-camera" },
    { name: "Instant Camera", image: "/placeholder.jpg", href: "/category/dslr/instant-camera" },
    { name: "Go-Pro", image: "/placeholder.jpg", href: "/category/dslr/gopro" },
    { name: "Camera Lenses", image: "/placeholder.jpg", href: "/category/dslr/lenses" },
    { name: "Photo Printer", image: "/placeholder.jpg", href: "/category/dslr/photo-printer" },
];

const DSLRCamerasPage = () => {
    const router = useRouter();
    const [products, setProducts] = useState(initialDSLRProducts);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const categories = await getCategories();
                const merged = initialDSLRProducts.map(p => {
                    const cat = categories.find(c => c.name === p.name);
                    if (cat && cat.image) {
                        return { ...p, image: cat.image };
                    }
                    return p;
                });
                setProducts(merged);
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };
        fetchImages();
    }, []);

    return (
        <div className="min-h-screen bg-white pb-20">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center gap-4 mb-10">
                    <button onClick={() => router.back()} className="text-gray-800 hover:text-gray-600 transition-colors">
                        <FaArrowLeft size={28} />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">DSLR Cameras</h1>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {products.map((product, index) => (
                        <motion.div
                            key={product.name}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="group"
                        >
                            <Link href={product.href} className="block">
                                <div className="bg-[#F5F5F7] rounded-2xl aspect-square mb-3 transition-transform duration-300 group-hover:scale-[1.02] overflow-hidden relative">
                                    <div className="relative w-full h-full">
                                        {product.image && product.image !== "/placeholder.jpg" ? (
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                fill
                                                className="object-contain p-4"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                                <span>No Image</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <h3 className="text-center text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {product.name}
                                </h3>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default DSLRCamerasPage;
