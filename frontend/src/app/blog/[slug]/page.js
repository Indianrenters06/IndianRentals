'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Spinner } from "@heroui/react";
import { ArrowLeft, Clock, User, Tag } from "@phosphor-icons/react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function BlogPostPage() {
    const { slug } = useParams();
    const router = useRouter();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!slug) return;
        const fetchPost = async () => {
            try {
                const res = await fetch(`${API}/api/blog/${slug}`);
                if (res.ok) {
                    const data = await res.json();
                    setPost(data);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error("Failed to fetch blog post:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [slug]);

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <Spinner size="lg" color="primary" />
                <p className="mt-4 text-slate-500 font-medium">Loading post...</p>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Post Not Found</h2>
                <p className="text-slate-500 mb-8 max-w-md">The blog post you're looking for doesn't exist or has been removed.</p>
                <button
                    onClick={() => router.push('/blog')}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
                >
                    <ArrowLeft size={18} weight="bold" /> Back to Blog
                </button>
            </div>
        );
    }

    return (
        <article className="bg-white min-h-screen pb-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-20">

                <Link href="/blog" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold mb-8 text-sm transition-colors">
                    <ArrowLeft size={16} weight="bold" /> Back to all posts
                </Link>

                <header className="mb-10">
                    <div className="flex flex-wrap items-center gap-2 mb-6">
                        {post.tags && post.tags.map((tag, i) => (
                            <span key={i} className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-600 text-xs font-semibold rounded-full flex items-center gap-1.5">
                                <Tag size={12} weight="fill" /> {tag}
                            </span>
                        ))}
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-6 leading-tight">
                        {post.title}
                    </h1>

                    {post.excerpt && (
                        <p className="text-xl md:text-2xl text-slate-500 mb-8 font-light leading-relaxed">
                            {post.excerpt}
                        </p>
                    )}

                    <div className="flex items-center gap-4 py-6 border-y border-slate-100">
                        <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 font-bold text-lg overflow-hidden relative">
                            {post.coverImage ? (
                                <img src="https://ui-avatars.com/api/?name=John+Doe&background=random" className="absolute opacity-0" />
                            ) : null}
                            {post.author ? post.author.charAt(0).toUpperCase() : "A"}
                        </div>
                        <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5 text-base">
                                <User size={16} weight="fill" className="text-slate-400" /> {post.author || "Admin"}
                            </div>
                            <div className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                                <Clock size={16} weight="fill" className="text-slate-400" /> {formatDate(post.createdAt)}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Hero / Cover Image (Maintained Aspect Ratio Placeholder) */}
                <div className="w-full aspect-[21/9] md:aspect-[2.5/1] bg-slate-50 rounded-3xl overflow-hidden mb-12 relative border border-slate-200 shadow-sm">
                    {post.coverImage ? (
                        <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-300 gap-2 font-medium">
                            <span className="opacity-50 text-sm tracking-wider uppercase">Image Placeholder</span>
                        </div>
                    )}
                </div>

                {/* Content Body */}
                <div
                    className="prose prose-lg prose-slate max-w-none 
                               prose-headings:font-bold prose-headings:text-slate-900 prose-headings:tracking-tight 
                               prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline
                               prose-img:rounded-2xl prose-img:border prose-img:border-slate-100 prose-img:shadow-sm"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Footer Meta */}
                <footer className="mt-16 pt-8 border-t border-slate-200">
                    <div className="flex flex-wrap gap-2">
                        <span className="text-slate-500 font-semibold text-sm mr-2 flex items-center">Tags:</span>
                        {post.tags && post.tags.map((tag, i) => (
                            <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-200 transition-colors cursor-pointer">
                                #{tag}
                            </span>
                        ))}
                        {(!post.tags || post.tags.length === 0) && (
                            <span className="text-slate-400 text-sm italic">No tags</span>
                        )}
                    </div>
                </footer>

            </div>
        </article>
    );
}
