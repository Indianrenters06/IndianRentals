'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Spinner } from "@heroui/react";
import { FiArrowLeft, FiChevronLeft, FiArrowUpRight, FiLink, FiLinkedin, FiTwitter, FiFacebook, FiMail } from "react-icons/fi";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function BlogPostPage() {
    const { slug } = useParams();
    const router = useRouter();
    const [post, setPost] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    useEffect(() => {
        if (!slug) return;
        const fetchData = async () => {
            try {
                const [postRes, listRes] = await Promise.all([
                    fetch(`${API}/api/blog/${slug}`),
                    fetch(`${API}/api/blog?status=published`),
                ]);

                if (postRes.ok) {
                    setPost(await postRes.json());
                } else {
                    setError(true);
                }

                if (listRes.ok) {
                    const all = await listRes.json();
                    setRelated(all.filter(p => (p.slug || p._id) !== slug).slice(0, 3));
                }
            } catch (err) {
                console.error("Failed to fetch blog post:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    const formatDate = (dateString, long = false) => {
        const options = long
            ? { day: 'numeric', month: 'long', year: 'numeric' }
            : { day: 'numeric', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    const readTime = (html) => {
        if (!html) return 1;
        const text = html.replace(/<[^>]*>/g, ' ');
        const words = text.trim().split(/\s+/).filter(Boolean).length;
        return Math.max(1, Math.round(words / 200));
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (e) {
            console.error("Copy failed", e);
        }
    };

    const shareUrl = typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : '';
    const shareTitle = post ? encodeURIComponent(post.title) : '';

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (!email) return;
        // No newsletter backend yet — acknowledge locally.
        setSubscribed(true);
        setEmail('');
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
                    <FiArrowLeft size={18} /> Back to Blog
                </button>
            </div>
        );
    }

    const category = post.tags && post.tags.length > 0 ? post.tags[0] : (post.category || "Category");

    return (
        <article className="bg-white w-full flex flex-col items-center px-5 md:px-8">
            <div className="w-full max-w-[760px] pt-5 md:pt-10 pb-12 md:pb-24">

                {/* Back link */}
                <Link href="/blog" className="inline-flex items-center gap-2 text-[#1f1f1f] hover:text-[#0B5ED7] font-normal mb-5 md:mb-8 text-[14px] md:text-[16px] transition-colors">
                    <FiChevronLeft className="w-5 h-5 md:w-6 md:h-6" /> All Posts
                </Link>

                {/* Header: category + read time */}
                <div className="flex items-center gap-4 mb-4">
                    <span className="bg-[#d6f1ff] border-[0.5px] border-[#0689ff] text-[#0689ff] text-[11px] md:text-[12px] font-medium px-3 py-1 rounded-full whitespace-nowrap">
                        {category}
                    </span>
                    <span className="text-[#1f1f1f] text-[13px] md:text-[14px] font-semibold">
                        {readTime(post.content)} min read
                    </span>
                </div>

                {/* Title + excerpt */}
                <h1 className="text-[27px] md:text-[40px] font-bold text-[#1f1f1f] tracking-tight leading-[1.25] mb-5 md:mb-6">
                    {post.title}
                </h1>
                {post.excerpt && (
                    <p className="text-[12px] md:text-[16px] text-[#1f1f1f]/80 leading-relaxed mb-6 md:mb-8">
                        {post.excerpt}
                    </p>
                )}

                {/* Cover image */}
                <div className="w-full h-[180px] md:h-[420px] bg-[#cdcdcd] rounded-[16px] overflow-hidden mb-5 md:mb-7 relative">
                    {post.coverImage ? (
                        <img src={post.coverImage} alt={post.title} className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">
                            <span>Image Placeholder</span>
                        </div>
                    )}
                </div>

                {/* Author / Published + share */}
                <div className="flex flex-col gap-5 mb-8 md:mb-12">
                    <div className="flex gap-12 md:gap-16">
                        <div className="flex flex-col gap-2">
                            <span className="text-[#0075ff] text-[12px] font-normal">Written by</span>
                            <span className="text-[#333] text-[14px] font-bold">{post.author || "Admin"}</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-[#0075ff] text-[12px] font-normal">Published on</span>
                            <span className="text-[#333] text-[14px] font-bold">{formatDate(post.createdAt, true)}</span>
                        </div>
                    </div>

                    {/* Share buttons */}
                    <div className="flex gap-2 items-center">
                        <button
                            onClick={handleCopy}
                            className="bg-[#f6f6f6] border border-[#e2e2e2] text-[#545454] font-bold text-[14px] md:text-[16px] flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-[#ededed] transition-colors"
                        >
                            {copied ? 'Copied!' : 'Copy Link'}
                            <FiLink className="w-5 h-5" />
                        </button>
                        <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn" className="bg-[#f6f6f6] border border-[#e2e2e2] text-[#545454] w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#ededed] transition-colors">
                            <FiLinkedin className="w-5 h-5" />
                        </a>
                        <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`} target="_blank" rel="noopener noreferrer" aria-label="Share on X" className="bg-[#f6f6f6] border border-[#e2e2e2] text-[#545454] w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#ededed] transition-colors">
                            <FiTwitter className="w-5 h-5" />
                        </a>
                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook" className="bg-[#f6f6f6] border border-[#e2e2e2] text-[#545454] w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#ededed] transition-colors">
                            <FiFacebook className="w-5 h-5" />
                        </a>
                    </div>
                </div>

                {/* Rich text content */}
                <div
                    className="prose prose-sm md:prose-base prose-slate max-w-none
                               prose-headings:font-bold prose-headings:text-[#1f1f1f] prose-headings:tracking-tight
                               prose-p:text-[#1f1f1f] prose-p:leading-relaxed prose-a:text-[#0B5ED7] prose-a:no-underline hover:prose-a:underline
                               prose-img:rounded-2xl prose-blockquote:border-[#333] prose-blockquote:text-[#1f1f1f]"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Gallery */}
                {post.images && post.images.length > 0 && (
                    <div className="mt-10 space-y-4">
                        <h3 className="text-[18px] md:text-[21px] font-bold text-[#1f1f1f] tracking-tight">Gallery</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {post.images.map((img, i) => (
                                <div key={i} className="aspect-video rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
                                    <img src={img} alt={`Gallery image ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Newsletter */}
                <div className="mt-12 md:mt-16 bg-[#eee] border border-[#e2e2e2] rounded-[16px] p-6 md:p-7">
                    <FiMail className="w-8 h-8 text-[#333] mb-2" />
                    <h3 className="text-[22px] md:text-[27px] font-bold text-[#333] tracking-tight leading-tight">Weekly Newsletter</h3>
                    <p className="text-[14px] md:text-[16px] text-[#333] mt-1 mb-4">Subscribe to receive the latest blog posts to your inbox every week.</p>

                    {subscribed ? (
                        <p className="text-[14px] font-semibold text-[#0B5ED7]">Thanks for subscribing! 🎉</p>
                    ) : (
                        <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full h-[39px] bg-white border border-[#e2e2e2] rounded-[8px] px-3 text-[12px] md:text-[14px] text-[#333] placeholder:text-[#afafaf] focus:outline-none focus:border-[#0689ff]"
                            />
                            <p className="text-[12px] text-[#333] font-light">
                                By subscribing you agree to with our{' '}
                                <Link href="/privacy" className="font-bold underline">Privacy Policy</Link>.
                            </p>
                            <button type="submit" className="mt-1 bg-[#ffcf46] text-[#1f1f1f] text-[12px] md:text-[14px] font-medium px-4 py-2 rounded-full w-full hover:brightness-95 transition">
                                Subscribe
                            </button>
                        </form>
                    )}
                </div>

                {/* Related posts */}
                {related.length > 0 && (
                    <div className="mt-12 md:mt-20">
                        <span className="text-[#1f1f1f] text-[12px] font-medium">Blog</span>
                        <div className="flex items-end justify-between gap-4 mt-2 mb-6 md:mb-8">
                            <div>
                                <h2 className="text-[22px] md:text-[32px] font-bold text-black tracking-tight leading-tight">Related posts</h2>
                                <p className="text-[12px] md:text-[16px] text-black/70 mt-2">Discover more rentals tips, guides and stories.</p>
                            </div>
                            <Link href="/blog" className="bg-[#333] text-white text-[13px] md:text-[14px] font-medium px-4 py-1.5 rounded-full whitespace-nowrap hover:bg-black transition-colors shrink-0">
                                View All
                            </Link>
                        </div>

                        <div className="flex flex-col md:grid md:grid-cols-3 gap-5 md:gap-6">
                            {related.map((rp) => {
                                const rpCategory = rp.tags && rp.tags.length > 0 ? rp.tags[0] : (rp.category || "Category");
                                return (
                                    <Link key={rp._id} href={`/blog/${rp.slug || rp._id}`} className="group flex flex-row md:flex-col gap-3 md:gap-4 items-stretch">
                                        <div className="relative w-[42%] md:w-full shrink-0 self-stretch md:self-auto md:aspect-[4/3] rounded-[12px] overflow-hidden bg-[#cdcdcd]">
                                            {rp.coverImage ? (
                                                <img src={rp.coverImage} alt={rp.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-slate-300 text-xs">Image</div>
                                            )}
                                        </div>
                                        <div className="flex flex-col flex-1 min-w-0">
                                            <span className="text-[#0689ff] text-[8px] md:text-[12px] font-medium bg-[#d6f1ff] border-[0.5px] border-[#0689ff] px-2 md:px-3 py-0.5 md:py-1 rounded-full w-fit mb-2 md:mb-3">
                                                {rpCategory}
                                            </span>
                                            <div className="flex items-start justify-between gap-2 mb-1 md:mb-2">
                                                <h3 className="text-[12px] md:text-[18px] font-semibold md:font-bold text-black group-hover:text-[#0B5ED7] transition-colors line-clamp-2 leading-snug">
                                                    {rp.title}
                                                </h3>
                                                <FiArrowUpRight className="w-4 h-4 md:w-[22px] md:h-[22px] text-gray-400 group-hover:text-[#0B5ED7] transition-colors shrink-0 mt-0.5" />
                                            </div>
                                            {rp.excerpt && (
                                                <p className="text-black/60 text-[10px] md:text-[14px] leading-snug line-clamp-2 mb-2 md:mb-4">
                                                    {rp.excerpt}
                                                </p>
                                            )}
                                            <div className="flex items-center gap-2 mt-auto">
                                                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 shrink-0">
                                                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(rp.author || "John Doe")}&background=random`} alt={rp.author || "Admin"} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] md:text-[13px] font-bold text-black leading-none mb-1">{rp.author || "John Doe"}</span>
                                                    <span className="text-[10px] md:text-[11px] text-gray-500 leading-none">{formatDate(rp.createdAt)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}

            </div>
        </article>
    );
}
