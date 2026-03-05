'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Spinner } from "@heroui/react";
import { FiArrowUpRight } from "react-icons/fi";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function BlogPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch(`${API}/api/blog?status=published`);
                if (res.ok) {
                    const data = await res.json();
                    setPosts(data);
                }
            } catch (err) {
                console.error("Failed to fetch blog posts:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <Spinner size="lg" color="primary" />
                <p className="mt-4 text-slate-500 font-medium">Loading Latest News & Resources...</p>
            </div>
        );
    }

    const featuredPost = posts[0];
    const gridPosts = posts.slice(1);

    return (
        <div className="bg-white min-h-screen pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24">

                {/* Header Section */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">
                        Latest News & Resources
                    </h1>
                    <p className="text-lg md:text-xl text-slate-800">
                        The latest industry news, interviews, technoloigies, and resources
                    </p>
                </div>

                {posts.length === 0 ? (
                    <div className="py-20 text-center text-slate-500">
                        <p className="text-xl">No published blog posts yet.</p>
                        <p className="mt-2">Check back soon for the latest news!</p>
                    </div>
                ) : (
                    <>
                        {/* Featured Hero Post */}
                        {featuredPost && (
                            <div className="mb-20">
                                <Link href={`/blog/${featuredPost.slug || featuredPost._id}`} className="group block">
                                    <h3 className="text-blue-500 font-semibold mb-3">
                                        {featuredPost.tags && featuredPost.tags.length > 0 ? featuredPost.tags[0] : "Category"}
                                    </h3>

                                    {/* Image Space - Retaining layout even if empty */}
                                    <div className="w-full aspect-[21/9] md:aspect-[2.5/1] bg-slate-100 rounded-3xl overflow-hidden mb-6 relative border border-slate-200">
                                        {featuredPost.coverImage ? (
                                            <img
                                                src={featuredPost.coverImage}
                                                alt={featuredPost.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                                                <span>Image Placeholder</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="max-w-4xl">
                                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                                            {featuredPost.title}
                                        </h2>
                                        {featuredPost.excerpt && (
                                            <p className="text-slate-600 text-lg md:text-xl mb-6 line-clamp-2">
                                                {featuredPost.excerpt}
                                            </p>
                                        )}

                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center font-bold text-slate-500 bg-indigo-50 border border-indigo-100">
                                                {featuredPost.author ? featuredPost.author.charAt(0).toUpperCase() : "A"}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-900">{featuredPost.author || "Admin"}</div>
                                                <div className="text-sm text-slate-500">{formatDate(featuredPost.createdAt)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )}

                        {/* Grid Posts */}
                        {gridPosts.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                                {gridPosts.map((post) => (
                                    <Link key={post._id} href={`/blog/${post.slug || post._id}`} className="group block">

                                        {/* Image Space - Retaining layout even if empty */}
                                        <div className="w-full aspect-[3/2] bg-slate-100 rounded-2xl overflow-hidden mb-5 relative border border-slate-200">
                                            {post.coverImage ? (
                                                <img
                                                    src={post.coverImage}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                                                    <span>Image Placeholder</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="inline-block px-3 py-1 bg-blue-50 border border-blue-200 text-blue-500 text-xs font-semibold rounded-full mb-4">
                                            {post.tags && post.tags.length > 0 ? post.tags[0] : "Category"}
                                        </div>

                                        <div className="flex items-start justify-between gap-4 mb-2">
                                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                {post.title}
                                            </h3>
                                            <FiArrowUpRight size={22} className="text-slate-400 group-hover:text-blue-600 transition-colors shrink-0 mt-1" />
                                        </div>

                                        {post.excerpt && (
                                            <p className="text-slate-600 mb-6 line-clamp-2 text-sm md:text-base leading-relaxed">
                                                {post.excerpt}
                                            </p>
                                        )}

                                        <div className="flex items-center gap-3 mt-auto">
                                            <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center font-bold text-xs text-slate-500 bg-indigo-50 border border-indigo-100 relative">
                                                {post.coverImage ? (
                                                    <img src="https://ui-avatars.com/api/?name=John+Doe&background=random" className="absolute opacity-0" />
                                                ) : null}
                                                {post.author ? post.author.charAt(0).toUpperCase() : "A"}
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-slate-900">{post.author || "Admin"}</div>
                                                <div className="text-xs text-slate-500">{formatDate(post.createdAt)}</div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
