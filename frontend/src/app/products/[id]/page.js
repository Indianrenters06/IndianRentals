"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { FaHeart, FaShareAlt, FaMinus, FaPlus, FaShoppingCart, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { BsTruck, BsBoxSeam, BsCreditCard } from 'react-icons/bs';

import { useDispatch } from 'react-redux';
import { addToCart } from '../../../redux/features/cartSlice';
import { getProductById } from '../../../services/productService';

export default function ProductDetailPage() {
    const router = useRouter();
    const params = useParams(); // Get ID from URL
    const dispatch = useDispatch();

    // Product Data State
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // UI States
    const [duration, setDuration] = useState(1);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('Product Details');
    const [openFaq, setOpenFaq] = useState(0);

    // Fetch Product Data
    useEffect(() => {
        if (!params.id) return;

        const fetchProduct = async () => {
            try {
                setLoading(true);
                // The ID from URL might be a slug or actual ID. 
                // Since our backend uses MongoDB IDs, we hope the link passed the ID.
                const data = await getProductById(params.id);
                setProduct(data);
            } catch (err) {
                console.error("Failed to load product", err);
                setError("Product not found");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [params.id]);


    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? -1 : index);
    };

    const tenures = [
        { label: '1+', months: 1, price: product?.rentalPrice || 2560 }, // Use product price as base
        { label: '3+', months: 3, price: Math.round((product?.rentalPrice || 2560) * 0.9) },
        { label: '6+', months: 6, price: Math.round((product?.rentalPrice || 2560) * 0.8) },
        { label: '9+', months: 9, price: Math.round((product?.rentalPrice || 2560) * 0.75) },
        { label: '12+', months: 12, price: Math.round((product?.rentalPrice || 2560) * 0.7) },
    ];

    const currentPlan = tenures.find(t => duration <= t.months) || tenures[tenures.length - 1];

    const handleAddToCart = () => {
        if (!product) return;

        const item = {
            id: product._id,
            name: product.name,
            image: product.images?.[0] || "/images/placeholder.png",
            price: currentPlan.price,
            monthlyRent: currentPlan.price,
            duration: duration,
            quantity: quantity,
            refundableAmount: product.securityDeposit || 10000,
            description: product.description,
            tenures: tenures
        };
        dispatch(addToCart(item));
        router.push('/cart');
    };

    if (loading) return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
    if (error || !product) return <div className="min-h-screen flex justify-center items-center">Product not found</div>;

    // Derived Data
    const mainImage = product.images && product.images.length > 0 ? product.images[0] : "/images/placeholder.png";
    const specs = [
        { label: "BRAND", value: product.brand || "N/A" },
        { label: "CATEGORY", value: product.category || "N/A" },
        { label: "CONDITION", value: product.condition || "New" },
        { label: "STOCK", value: product.stock > 0 ? "In Stock" : "Out of Stock" },
        { label: "LOCATION", value: product.city || "All India" },
    ];

    return (
        <div className="min-h-screen bg-white font-sans text-[#1D1D1F] tracking-tight antialiased">
            {/* Breadcrumb */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 text-sm text-gray-500">
                <Link href="/" className="text-black hover:text-gray hover:underline">Shop all</Link>
                <span className="mx-2">›</span>
                <Link href={`/category/${product.category?.toLowerCase() || 'all'}`} className="text-black hover:text-gray hover:underline">{product.category || 'Category'}</Link>
                <span className="mx-2">›</span>
                <span className="text-black font-medium">{product.name}</span>
            </div>

            <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left Column - Images */}
                    <div className="lg:w-[55%]">
                        <div className="relative mb-6">
                            <span className="absolute top-5 left-0 z-10 bg-[#FF3B30] text-white text-[11px] font-medium px-2 py-0.5 ml-4 rounded-lg uppercase tracking-wider shadow-sm">20% off</span>
                            {/* Main Image Container */}
                            <div className="border border-gray-200 rounded-[24px] bg-white p-6 relative mb-6 flex items-center justify-center h-[400px]">
                                <Image
                                    src={mainImage}
                                    alt={product.name}
                                    width={700}
                                    height={500}
                                    className="object-contain max-h-full w-auto"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Thumbnails (Mocked for now as likely only 1 image exists) */}
                        <div className="flex gap-4 justify-center">
                            {[mainImage].map((img, i) => (
                                <button key={i} className="w-[100px] h-[100px] flex-shrink-0 bg-white border border-gray-200 rounded-[20px] p-2 flex items-center justify-center hover:border-gray-400 transition-all shadow-sm">
                                    <div className="w-full h-full relative">
                                        <Image
                                            src={img}
                                            alt={`View ${i}`}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="lg:w-[36%] pl-4 pt-0">
                        <h1 className="text-[22px] font-semibold text-[#1D1D1F] leading-tight mb-1 underline decoration-from-font underline-offset-2">{product.name}</h1>
                        <h2 className="text-[18px] text-[#1D1D1F] mb-3 font-normal leading-snug">{product.description}</h2>

                        <div className="text-[16px] font-medium text-[#1D1D1F] mb-4 inline-block underline decoration-from-font underline-offset-2">
                            Refundable Amount - <span className="font-bold">₹{product.securityDeposit || 10000}</span>
                        </div>

                        {/* Rental Card */}
                        <div className="border border-gray-200 rounded-xl bg-white mb-2 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                            <div className="p-4">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-[13px] font-semibold">Select rental period</span>
                                </div>

                                <div className="relative px-2 mb-8">
                                    <input
                                        type="range"
                                        min="1"
                                        max="5"
                                        step="1"
                                        value={duration <= 1 ? 1 : duration <= 3 ? 2 : duration <= 6 ? 3 : duration <= 9 ? 4 : 5}
                                        onChange={(e) => {
                                            const step = parseInt(e.target.value);
                                            const months = [1, 3, 6, 9, 12];
                                            setDuration(months[step - 1]);
                                        }}
                                        className="w-full"
                                    />
                                    <div className="mt-2 flex justify-between text-xs text-gray-500 font-medium">
                                        {tenures.map(t => (
                                            <span key={t.months} className={duration === t.months ? "text-black font-bold" : ""}>
                                                {t.label}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Row */}
                                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                                    <div className="flex flex-col">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-[24px] font-bold text-[#1D1D1F]">₹{currentPlan.price * quantity}</span>
                                            <span className="text-xs text-gray-500">/month</span>
                                        </div>
                                    </div>

                                    {/* Component for Quantity */}
                                    <div className="flex items-center border border-gray-300 rounded-lg h-9 px-2 gap-3 bg-white">
                                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-500 hover:text-black"><FaMinus size={10} /></button>
                                        <span className="text-sm font-medium w-4 text-center">{quantity}</span>
                                        <button onClick={() => setQuantity(quantity + 1)} className="text-gray-500 hover:text-black"><FaPlus size={10} /></button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-[#FFC72C] hover:bg-[#FFD740] active:scale-[0.99] text-[#1D1D1F] font-bold py-3.5 rounded-full text-[16px] shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 mb-6"
                        >
                            Book Your Plan <FaShoppingCart className="text-lg" />
                        </button>
                    </div>
                </div>

                {/* Below Fold Content - Tabs Box */}
                <div className="mt-10">
                    <div className="border border-gray-200 rounded-[24px] p-8 bg-white">
                        <div className="flex justify-center gap-4 mb-8">
                            {['Product Details', 'Return Policy', 'Shipping Policy'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-8 py-3 rounded-full text-lg font-light transition-all underline decoration-1 underline-offset-1 ${activeTab === tab ? 'bg-[#333333] text-white' : 'bg-[#EBEBEB] text-[#1D1D1F] hover:bg-[#d6d6d6]'} font-normal`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-12 px-2">
                            {specs.map((item, i) => (
                                <div key={i} className="flex flex-col gap-1.5">
                                    <span className="text-[16px] font-semibold text-black uppercase underline decoration-1 underline-offset-1">{item.label}</span>
                                    <span className="text-lg text-[#1D1D1F] text-gray-600">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
