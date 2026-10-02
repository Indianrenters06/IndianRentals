"use client";
import { fetchCmsPage } from '@/lib/cmsPreview';
import { useState, useEffect } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { SwiperControls } from "./CarouselControls";
import { addToCart } from "@/redux/features/cartSlice";
import { API } from "@/services/apiConfig";
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y } from 'swiper/modules';
import styles from './BestRentedProducts.module.css';
import { isProductOutOfStock } from '@/lib/productAvailability';
import ProductCard from './RentalProductCard';
export { default as ProductCard } from './RentalProductCard';
import 'swiper/css';

const BestRentedProducts = ({ type = "bestRented", defaultTitle = "Curated Products", customProducts = null, titleOverride = null, productIdsOverride = null }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [swiper, setSwiper] = useState(null);
    const [cmsConfig, setCmsConfig] = useState({
        enabled: true,
        title: defaultTitle,
        productIds: []
    });
    const [loading, setLoading] = useState(true);

    const handleAddToCart = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        if (isProductOutOfStock(product)) return;
        dispatch(addToCart({
            id: product.id,
            name: product.name,
            image: product.image,
            price: product.rentPrice,
            monthlyRent: product.rentPrice,
            quantity: 1,
            duration: 1,
            refundableAmount: 0,
            description: product.name,
            sourceUrl: `/products/${product.id}`
        }));
        router.push('/checkout/staged?new=1');
    };

    useEffect(() => {
        const fetchCMSAndProducts = async () => {
            try {
                const cmsRes = await fetchCmsPage('homepage');
                let isEnabled = true;
                let finalTitle = defaultTitle;
                let targetIds = [];

                if (cmsRes.ok) {
                    const cmsData = await cmsRes.json();
                    if (type === "bestRented") {
                        isEnabled = cmsData.bestRentedEnabled !== false;
                        finalTitle = cmsData.bestRentedTitle || "Best Rented Products";
                        targetIds = cmsData.bestRentedProductIds || [];
                    } else if (type === "newLaunches") {
                        isEnabled = cmsData.newLaunchEnabled !== false;
                        finalTitle = cmsData.newLaunchTitle || "New Launches This Week";
                        targetIds = cmsData.newLaunchProductIds || [];
                    }
                }

                if (titleOverride) finalTitle = titleOverride;
                if (productIdsOverride && productIdsOverride.length > 0) targetIds = productIdsOverride;

                setCmsConfig({ enabled: isEnabled, title: finalTitle, productIds: targetIds });

                if (!isEnabled) {
                    setLoading(false);
                    return;
                }

                if (customProducts && customProducts.length > 0) {
                    const mappedProducts = customProducts.map(p => ({
                        id: p._id,
                        name: p.name,
                        category: p.category,
                        image: (p.images && p.images.length > 0) ? p.images[0] : "/images/placeholder.png",
                        rating: p.rating ?? 0,
                        reviews: p.numReviews ?? 0,
                        originalPrice: p.originalRentalPrice || null,
                        rentPrice: p.rentalPrice,
                        discount: p.pageLayout?.discountText || p.discount || "",
                        deliveryTime: p.deliveryTime || "2-4 days",
                        stock: p.stock,
                        isNew: p.condition === 'New',
                        tags: ["Quality tested", "Deep Cleaned"],
                        statusTags: ["Like New", isProductOutOfStock(p) ? "Out of stock" : "In Stock"],
                    }));
                    setProducts(mappedProducts);
                    setLoading(false);
                    return;
                }

                let fetchedProducts = [];
                if (targetIds.length > 0) {
                    const ids = [...new Set(targetIds.filter(id => typeof id === 'string' && /^[a-f0-9]{24}$/i.test(id)))].slice(0, 40);
                    if (ids.length) {
                        const response = await fetch(`${API}/api/products?ids=${ids.join(',')}&limit=40`);
                        if (!response.ok) throw new Error('Selected products are unavailable');
                        const data = await response.json();
                        const byId = new Map((data.products || []).map(product => [String(product._id), product]));
                        fetchedProducts = ids.map(id => byId.get(id)).filter(Boolean);
                    }
                    // An obsolete CMS selection must not leave an empty homepage rail.
                    // Only real, public catalogue products are used as the fallback.
                    if (!fetchedProducts.length) {
                        const response = await fetch(`${API}/api/products?limit=4`);
                        if (response.ok) fetchedProducts = (await response.json()).products || [];
                    }
                } else {
                    const fallBackRes = await fetch(`${API}/api/products?limit=4`);
                    if (fallBackRes.ok) {
                        const fallbackData = await fallBackRes.json();
                        fetchedProducts = fallbackData.products || [];
                    }
                }

                const mappedProducts = fetchedProducts.map(p => ({
                    id: p._id,
                    name: p.name,
                    category: p.category,
                    image: (p.images && p.images.length > 0) ? p.images[0] : "/images/placeholder.png",
                    rating: p.rating ?? 0,
                    reviews: p.numReviews ?? 0,
                    originalPrice: p.originalRentalPrice || null,
                    rentPrice: p.rentalPrice,
                    discount: p.pageLayout?.discountText || p.discount || "",
                    deliveryTime: p.deliveryTime || "2-4 days",
                    stock: p.stock,
                    isNew: p.condition === 'New',
                    tags: ["Quality tested", "Deep Cleaned"],
                    statusTags: ["Like New", isProductOutOfStock(p) ? "Out of stock" : "In Stock"],
                }));
                setProducts(mappedProducts);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch products or cms", error);
                setLoading(false);
            }
        };
        fetchCMSAndProducts();
    }, [type, defaultTitle, titleOverride, productIdsOverride, customProducts]);

    if (loading) return <div className="h-48 w-full bg-slate-50 animate-pulse my-4" />;
    if (!cmsConfig.enabled) return null;

    return (
        <section
            className={`${styles.section} bg-white py-12`}
        >
            <div className={styles.container}>
                <div className="flex flex-col mb-3 md:mb-4 lg:mb-8 w-full">
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                        <h2
                            className="font-manrope tracking-tight lg:tracking-[-0.8px] text-[24px] md:text-[36px] font-semibold text-[#333] leading-tight md:leading-[48px] lg:leading-[45px]"
                        >
                            {cmsConfig.title}
                        </h2>
                        {/* Figma labels this button "More Categories" on Best Rented */}
                        <Link
                            href={type === 'bestRented' ? '/categories' : '/products'}
                            className="btn-primary hidden md:inline-flex gap-[2px] text-[14px] lg:text-[16px] lg:leading-[23px] lg:tracking-[-0.4px] lg:h-10"
                        >
                            {type === 'bestRented' ? 'More Categories' : 'View All'}
                        </Link>
                    </div>
                </div>

                <div className="relative">
                    <div className="w-full">
                        <Swiper
                            modules={[A11y]}
                            onSwiper={setSwiper}
                            spaceBetween={10}
                            slidesPerView={products.length > 2 ? 2.15 : 2}
                            slidesPerGroup={1}
                            centeredSlides={false}
                            watchSlidesProgress
                            breakpoints={{ 768: { slidesPerView: 3, spaceBetween: 16 }, 1024: { slidesPerView: 4, spaceBetween: 24 } }}
                            className={`${styles.rail} ${products.length > 2 ? styles.mobilePeek : ''} !py-2 md:!py-3`}
                        >
                            {products.map((product, index) => (
                                <SwiperSlide key={product.id || index}>
                                    <ProductCard
                                        product={product}
                                        index={index}
                                        handleAddToCart={handleAddToCart}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    <div className="hidden md:block">
                        <SwiperControls swiper={swiper} count={products.length} label={cmsConfig.title} />
                    </div>
                </div>

                <div className={`${styles.mobileAction} flex justify-center md:hidden`}>
                    <Link href="/products" className="btn-primary min-h-11 text-[14px] px-8">
                        View All
                    </Link>
                </div>
            </div>

        </section>
    );
};

export default BestRentedProducts;
