import { cache } from 'react';
import { notFound } from 'next/navigation';
import { fetchPublicJson } from '@/lib/serverApi.mjs';
import { publicMetadata } from '@/lib/publicMetadata';
import { plainText } from '@/lib/seo.mjs';
const getPost = cache(async slug => {
    const post = await fetchPublicJson(`/api/blog/${encodeURIComponent(slug)}`, { cache: 'no-store' });
    if (!post || post.status !== 'published') notFound();
    return post;
});
export async function generateMetadata({ params }) {
    const { slug } = await params;
    const post = await getPost(slug);
    return publicMetadata({ title: post.title, description: post.excerpt || plainText(post.content),
        path: `/blog/${encodeURIComponent(post.slug || post._id)}`, ...(post.coverImage ? { image: post.coverImage } : {}), type: 'article' });
}
export default async function Layout({ children, params }) {
    await getPost((await params).slug);
    return children;
}
