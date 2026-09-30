'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';
import { cmsUrl } from '@/lib/cmsPreview';
import { getTestimonials } from '@/services/testimonialService';
import styles from './Testimonials.module.css';

const palettes = ['orange', 'violet', 'blue', 'blue', 'pink', 'violet', 'teal', 'blue', 'orange'];

function googleReviewUrl(value) {
    try {
        const url = new URL(value);
        return url.protocol === 'https:' && ['google.com', 'www.google.com', 'maps.google.com', 'g.page', 'maps.app.goo.gl'].includes(url.hostname) ? url.href : null;
    } catch { return null; }
}

function Rating({ value, compact = false }) {
    const rating = Math.max(0, Math.min(5, Number(value) || 0));
    return <span className={compact ? styles.compactStars : styles.stars} role="img" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: 5 }, (_, i) => <span key={i} className={styles.star} aria-hidden="true">
            <Image src="/icons/testimonial-star.svg" width={20.6512} height={20.6512} alt="" loading="eager" className={styles.emptyStar} />
            <span className={styles.starFill} style={{ width: `${Math.max(0, Math.min(1, rating - i)) * 100}%` }}>
                <Image src="/icons/testimonial-star.svg" width={20.6512} height={20.6512} alt="" loading="eager" />
            </span>
        </span>)}
    </span>;
}

function ReviewCard({ review, index }) {
    const sourceUrl = googleReviewUrl(review.sourceUrl);
    return <article className={`${styles.card} ${styles[palettes[index % palettes.length]]}`}>
        <div className={styles.author}>
            <h3>{review.name}</h3>
            {review.role && <p>{review.role}</p>}
        </div>
        <p className={styles.message}>{review.message}</p>
        <div className={styles.cardFooter}>
            {review.source === 'google' ? (
                sourceUrl ? <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className={styles.sourceLink} aria-label={`Read ${review.name}'s review on Google`}>
                    <Image src="/icons/testimonial-google.svg" width={25} height={26} alt="Google" />
                </a> : <Image src="/icons/testimonial-google.svg" width={25} height={26} alt="Google review" />
            ) : <span className={styles.sourceLabel}>IndianRenters customer</span>}
            <Rating value={review.rating} />
        </div>
    </article>;
}

export default function Testimonials({ overrideBg, overridePadding, overrideHeight, titleOverride, subtitleOverride, sectionId = 'customer-reviews' }) {
    const headingId = useId();
    const reviewsId = useId();
    const [reviews, setReviews] = useState([]);
    const [cms, setCms] = useState(null);
    const [status, setStatus] = useState('loading');
    const [showAll, setShowAll] = useState(false);
    const [reload, setReload] = useState(0);
    const previewRef = useRef(null);
    const [overflows, setOverflows] = useState(false);

    useEffect(() => {
        let active = true;
        Promise.allSettled([
            getTestimonials(),
            fetch(cmsUrl('homepage'), { cache: 'no-store' }).then(res => {
                if (!res.ok) throw new Error('Section settings unavailable');
                return res.json();
            }),
        ]).then(([items, settings]) => {
            if (!active) return;
            if (settings.status === 'fulfilled') setCms(settings.value);
            if (items.status === 'fulfilled' && Array.isArray(items.value)) {
                setReviews(items.value.filter(item => item?.name && item?.message && item.isApproved !== false));
                setStatus('ready');
            } else setStatus('error');
        });
        return () => { active = false; };
    }, [reload]);

    useEffect(() => {
        const preview = previewRef.current;
        if (!preview) return;
        const measure = () => setOverflows(preview.scrollHeight > preview.clientHeight + 1);
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(preview);
        if (preview.firstElementChild) observer.observe(preview.firstElementChild);
        return () => observer.disconnect();
    }, [reviews, showAll, cms?.testimonialsEnabled]);

    if (cms?.testimonialsEnabled === false) return null;

    const rating = Number(cms?.testimonialGoogleRating);
    const hasRating = rating > 0 && rating <= 5 && Boolean(cms?.testimonialGoogleReviewCount?.trim());
    const isEmpty = status === 'ready' && !reviews.length;
    if (isEmpty && !hasRating) return null;
    return <section id={sectionId} className={`${styles.section} ${isEmpty ? styles.empty : ''}`} aria-labelledby={headingId}
        style={{ '--testimonial-background': overrideBg || undefined, paddingBlock: overridePadding || undefined, minHeight: overrideHeight || undefined }}>
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.intro}>
                    <h2 id={headingId}>{titleOverride ?? cms?.testimonialSectionTitle ?? 'What Our Customers Say'}</h2>
                    <p>{subtitleOverride ?? cms?.testimonialSectionSubtitle ?? 'Real experiences from innovators, businesses, and creators powering their ambitions with IndianRenters.'}</p>
                </div>
                {hasRating && <div className={styles.summary}>
                    <Image src="/icons/testimonial-google.svg" width={25} height={26} alt="Google" />
                    <span>{cms.testimonialGoogleReviewCount} reviews</span>
                    <span className={styles.summaryRating}><Rating value={rating} compact /><span>{rating}</span></span>
                </div>}
            </header>
            {status === 'loading' ? <p className={styles.state} role="status">Loading customer reviews…</p> : status === 'error' ? <div className={styles.state} role="status">
                <p>Customer reviews couldn’t load. Please try again.</p>
                <button type="button" className={styles.button} onClick={() => { setStatus('loading'); setReload(value => value + 1); }}>Try again</button>
            </div> : reviews.length ? <>
                <div id={reviewsId} ref={previewRef} className={`${showAll ? styles.expanded : styles.collapsed} ${!showAll && overflows ? styles.fade : ''}`}><div className={styles.reviews}>
                    {reviews.map((review, index) => <ReviewCard key={review._id || review.id || index} review={review} index={index} />)}
                </div></div>
                {(overflows || showAll) && <div className={styles.actions}><button className={styles.button} type="button" aria-expanded={showAll} aria-controls={reviewsId} onClick={() => setShowAll(value => !value)}>
                    {showAll ? 'Show fewer reviews' : 'Read All Reviews'}
                </button></div>}
            </> : null}
        </div>
    </section>;
}
