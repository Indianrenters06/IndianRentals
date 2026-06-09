'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Spinner } from "@heroui/react";
import { FiArrowUpRight } from "react-icons/fi";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function BlogPage() {
    const [posts, setPosts] = useState([]);
    const [cmsData, setCmsData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [postsRes, cmsRes] = await Promise.all([
                    fetch(`${API}/api/blog?status=published`),
                    fetch(`${API}/api/cms/blog`)
                ]);
                
                if (postsRes.ok) setPosts(await postsRes.json());
                
                if (cmsRes.ok) {
                    setCmsData(await cmsRes.json());
                } else {
                    setCmsData({
                        blogTitle: 'Latest News & Resources',
                        blogSubtitle: 'The latest industry news, interviews, technologies, and resources.',
                        blogTabs: ['View all', 'Short term', 'Long term', 'Production on service', 'Next Tech', 'News']
                    });
                }
            } catch (err) {
                console.error("Failed to fetch blog data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    const tabs = cmsData?.blogTabs || ['View all', 'Short term', 'Long term', 'Production on service', 'Next Tech', 'News'];
    const [activeTab, setActiveTab] = useState('View all');

    // Make sure activeTab falls back correctly if tabs change
    useEffect(() => {
        if (tabs.length > 0 && !tabs.includes(activeTab)) {
            setActiveTab(tabs[0]);
        }
    }, [tabs, activeTab]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <Spinner size="lg" color="primary" />
                <p className="mt-4 text-slate-500 font-medium">Loading Latest News & Resources...</p>
            </div>
        );
    }

    // Filter posts based on active tab
    const filteredPosts = activeTab === 'View all' 
        ? posts 
        : posts.filter(p => p.tags && p.tags.some(tag => tag.toLowerCase() === activeTab.toLowerCase()));

    const featuredPost = filteredPosts[0] || {
        _id: 'placeholder-1',
        title: 'Long-Term Rentals',
        excerpt: 'Lorem ipsum dolor sit amet consectetur. Ut cras sit pulvinar dui tristique. Auctor os nullo.',
        category: 'Category',
        author: 'John Doe',
        createdAt: '2022-01-11T00:00:00Z',
        coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop&q=80'
    };
    
    // Fill the rest with placeholders if not enough posts to match the design visually
    const defaultGridPosts = [
        { _id: 'p2', title: 'Long-Term Rentals', excerpt: 'Lorem ipsum dolor sit amet consectetur. Ut cras sit pulvinar dui tristique. Auctor os nullo.', category: 'Category', author: 'John Doe', createdAt: '2022-01-11T00:00:00Z', coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60' },
        { _id: 'p3', title: 'Long-Term Rentals', excerpt: 'Lorem ipsum dolor sit amet consectetur. Ut cras sit pulvinar dui tristique. Auctor os nullo.', category: 'Category', author: 'John Doe', createdAt: '2022-01-11T00:00:00Z', coverImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=60' },
        { _id: 'p4', title: 'Long-Term Rentals', excerpt: 'Lorem ipsum dolor sit amet consectetur. Ut cras sit pulvinar dui tristique. Auctor os nullo.', category: 'Category', author: 'John Doe', createdAt: '2022-01-11T00:00:00Z', coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60' },
        { _id: 'p5', title: 'Long-Term Rentals', excerpt: 'Lorem ipsum dolor sit amet consectetur. Ut cras sit pulvinar dui tristique. Auctor os nullo.', category: 'Category', author: 'John Doe', createdAt: '2022-01-11T00:00:00Z', coverImage: 'https://images.unsplash.com/photo-1531297172867-4d5ce290d291?w=800&auto=format&fit=crop&q=60' },
        { _id: 'p6', title: 'Long-Term Rentals', excerpt: 'Lorem ipsum dolor sit amet consectetur. Ut cras sit pulvinar dui tristique. Auctor os nullo.', category: 'Category', author: 'John Doe', createdAt: '2022-01-11T00:00:00Z', coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60' },
        { _id: 'p7', title: 'Long-Term Rentals', excerpt: 'Lorem ipsum dolor sit amet consectetur. Ut cras sit pulvinar dui tristique. Auctor os nullo.', category: 'Category', author: 'John Doe', createdAt: '2022-01-11T00:00:00Z', coverImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=60' },
    ];
    
    const gridPosts = filteredPosts.length > 1 ? filteredPosts.slice(1) : (filteredPosts.length === 1 ? [] : defaultGridPosts);

    return (
        <div className="w-full flex justify-center bg-white pt-3 md:pt-5">
            <div className="w-full max-w-[1440px] px-5 md:px-[80px] flex flex-col gap-6 md:gap-[48px] bg-[var(--Color-Scheme-1-Background,#fff)] py-5 md:py-7">
                {/* Header Section */}
                <div className="flex flex-col gap-3 md:gap-2">
                    <h1 className="text-[20px] md:text-[40px] font-bold text-[#1D1D1F] font-['Mona_Sans',sans-serif] tracking-tight leading-tight">
                        {cmsData?.blogTitle || 'Latest News & Resources'}
                    </h1>
                    <p className="text-[12px] md:text-[16px] text-gray-500 font-['Mona_Sans',sans-serif]">
                        {cmsData?.blogSubtitle || 'The latest industry news, interviews, technologies, and resources.'}
                    </p>
                </div>

                {/* Featured Hero Post */}
                <Link href={`/blog/${featuredPost.slug || featuredPost._id}`} className="group flex flex-col gap-3 md:gap-4">
                    <span className="text-[#0B5ED7] text-[10px] md:text-[12px] font-medium md:font-semibold md:bg-[#E7F0FC] md:px-3 md:py-1 rounded-full w-fit">
                        {featuredPost.tags && featuredPost.tags.length > 0 ? featuredPost.tags[0] : featuredPost.category || "Category"}
                    </span>

                    <div className="w-full h-[210px] md:h-[540px] rounded-[12px] md:rounded-[24px] overflow-hidden relative bg-[#cdcdcd]">
                        {featuredPost.coverImage ? (
                            <img
                                src={featuredPost.coverImage}
                                alt={featuredPost.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                                <span>Image Placeholder</span>
                            </div>
                        )}
                    </div>

                    {/* On mobile: author on the left, text on the right. On desktop: text on top, author below. */}
                    <div className="flex flex-row md:flex-col md:max-w-[800px] gap-6 md:gap-0 mt-1 md:mt-2">
                        <div className="flex items-center gap-2 md:gap-3 shrink-0 order-1 md:order-2 md:mt-0">
                            <div className="w-[34px] h-[34px] md:w-10 md:h-10 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 shrink-0">
                                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(featuredPost.author || "John Doe")}&background=random`} alt={featuredPost.author || "Admin"} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col justify-center">
                                <div className="text-[10px] md:text-[14px] font-bold md:font-semibold text-[#1D1D1F] leading-none mb-1">{featuredPost.author || "John Doe"}</div>
                                <div className="text-[10px] md:text-[12px] text-gray-500 leading-none">{formatDate(featuredPost.createdAt)}</div>
                            </div>
                        </div>

                        <div className="flex flex-col flex-1 min-w-0 order-2 md:order-1">
                            <div className="flex items-start md:items-center justify-between gap-2">
                                <h2 className="text-[12px] md:text-[32px] font-bold text-[#1D1D1F] group-hover:text-[#0B5ED7] transition-colors leading-tight mb-1 md:mb-2">
                                    {featuredPost.title}
                                </h2>
                                <FiArrowUpRight className="w-4 h-4 md:w-7 md:h-7 text-gray-400 group-hover:text-[#0B5ED7] transition-colors shrink-0" />
                            </div>
                            {featuredPost.excerpt && (
                                <p className="text-gray-500 text-[10px] md:text-[16px] mb-0 md:mb-6 line-clamp-2 md:line-clamp-none leading-snug">
                                    {featuredPost.excerpt}
                                </p>
                            )}
                        </div>
                    </div>
                </Link>

                {/* Tabs / Filters */}
                <div className="w-full border-b border-gray-200">
                    <div className="flex items-center gap-6 md:gap-8 overflow-x-auto no-scrollbar">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-3 md:pb-4 text-[12px] md:text-[15px] font-medium transition-colors relative whitespace-nowrap ${
                                    activeTab === tab
                                        ? 'text-[#0B5ED7]'
                                        : 'text-[#1D1D1F] hover:text-[#0B5ED7]'
                                }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#0B5ED7] rounded-t-full" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid Posts — horizontal cards on mobile, vertical on desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5 md:gap-y-[48px]">
                    {gridPosts.map((post) => (
                        <Link key={post._id} href={`/blog/${post.slug || post._id}`} className="group flex flex-row md:flex-col gap-3 md:gap-4 items-stretch">

                            <div className="relative w-[42%] md:w-full shrink-0 self-stretch md:self-auto md:aspect-[4/3] rounded-[12px] md:rounded-[16px] overflow-hidden bg-[#cdcdcd]">
                                {post.coverImage ? (
                                    <img
                                        src={post.coverImage}
                                        alt={post.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-slate-100 flex items-center justify-center text-slate-300 text-xs">
                                        <span>Image</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col flex-1 min-w-0">
                                <span className="text-[#0B5ED7] text-[8px] md:text-[12px] font-medium md:font-semibold bg-[#d6f1ff] md:bg-[#E7F0FC] border-[0.5px] border-[#0689ff] md:border-0 px-2 md:px-3 py-0.5 md:py-1 rounded-full w-fit mb-2 md:mb-3">
                                    {post.tags && post.tags.length > 0 ? post.tags[0] : post.category || "Category"}
                                </span>

                                <div className="flex items-start justify-between gap-2 md:gap-4 mb-1 md:mb-2">
                                    <h3 className="text-[12px] md:text-[18px] font-semibold md:font-bold text-[#1D1D1F] group-hover:text-[#0B5ED7] transition-colors line-clamp-2 leading-snug">
                                        {post.title}
                                    </h3>
                                    <FiArrowUpRight className="w-4 h-4 md:w-[22px] md:h-[22px] text-gray-400 group-hover:text-[#0B5ED7] transition-colors shrink-0 mt-0.5 md:mt-1" />
                                </div>

                                {post.excerpt && (
                                    <p className="text-gray-500 text-[10px] md:text-[14px] leading-snug md:leading-relaxed line-clamp-2 mb-2 md:mb-4">
                                        {post.excerpt}
                                    </p>
                                )}

                                <div className="flex items-center gap-2 md:gap-3 mt-auto">
                                    <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 shrink-0">
                                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(post.author || "John Doe")}&background=random`} alt={post.author || "Admin"} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <div className="text-[10px] md:text-[13px] font-bold md:font-semibold text-[#1D1D1F] leading-none mb-1">{post.author || "John Doe"}</div>
                                        <div className="text-[10px] md:text-[11px] text-gray-500 leading-none">{formatDate(post.createdAt)}</div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

            </div>
        </div>
    );
}
