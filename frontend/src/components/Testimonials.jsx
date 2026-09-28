'use client';

import { useEffect, useState } from 'react';
import { Star } from '@phosphor-icons/react';
import { getTestimonials } from '../services/testimonialService';
import { API } from '../services/apiConfig';

const cardColors = [
    ['#fff1c5', '#6d3b0b'],
    ['#f0ebff', '#472c78'],
    ['#e8f2ff', '#24457a'],
    ['#e4f7ed', '#24583d'],
    ['#fce9f2', '#763653'],
    ['#f3f0e8', '#454035'],
];

function ReviewCard({ review, index }) {
    const [background, color] = cardColors[index % cardColors.length];
    const rating = Math.max(0, Math.min(5, Math.round(Number(review.rating) || 0)));
    return (
        <article className="mb-3 inline-block w-full break-inside-avoid rounded-[20px] p-3 sm:mb-5 sm:p-5" style={{ backgroundColor: background, color }}>
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="text-lg font-semibold tracking-tight">{review.name}</h3>
                    {review.role && <p className="mt-0.5 text-sm opacity-80">{review.role}</p>}
                </div>
                {rating > 0 && <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold" aria-label={`${rating} out of 5 stars`}><Star size={17} weight="fill" aria-hidden="true" />{rating}</span>}
            </div>
            <p className="mt-4 whitespace-pre-line text-xs leading-[1.55] sm:text-sm">{review.message}</p>
        </article>
    );
}

export default function Testimonials({ overrideBg, overridePadding, overrideHeight, titleOverride, subtitleOverride }) {
    const [reviews, setReviews] = useState([]);
    const [enabled, setEnabled] = useState(true);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        let active = true;
        Promise.all([
            getTestimonials(),
            fetch(`${API}/api/cms/homepage`).then(response => response.ok ? response.json() : null).catch(() => null),
        ]).then(([items, cms]) => {
            if (!active) return;
            setEnabled(cms?.testimonialsEnabled !== false);
            setReviews(Array.isArray(items) ? items.filter(item => item?.name && item?.message && item.isApproved !== false) : []);
        }).catch(() => { if (active) setReviews([]); });
        return () => { active = false; };
    }, []);

    if (!enabled || reviews.length === 0) return null;

    const visibleReviews = showAll ? reviews : reviews.slice(0, 6);
    return (
        <section className="w-full" style={{ background: overrideBg || '#fff', minHeight: overrideHeight || undefined }} aria-labelledby="testimonials-heading">
            <div className="mx-auto w-full max-w-[1200px] px-5 min-[600px]:px-[30px] xl:px-0" style={{ paddingTop: overridePadding || '40px', paddingBottom: overridePadding || '40px' }}>
                <div className="mb-7 max-w-[650px]">
                    <h2 id="testimonials-heading" className="text-[28px] font-semibold leading-tight tracking-[-.03em] text-[#333] md:text-[36px]">{titleOverride || 'What Our Customers Say'}</h2>
                    <p className="mt-3 text-base leading-relaxed text-[#545454]">{subtitleOverride || 'Real experiences from innovators, businesses, and creators powering their ambitions with IndianRenters.'}</p>
                </div>
                <div className={`columns-2 gap-3 md:gap-5 xl:columns-3 ${reviews.length > 6 && !showAll ? 'max-h-[680px] overflow-hidden [mask-image:linear-gradient(to_bottom,#000_65%,transparent)]' : ''}`}>
                    {visibleReviews.map((review, index) => <ReviewCard key={review._id || review.id || index} review={review} index={index} />)}
                </div>
                {reviews.length > 6 && <div className="mt-8 flex justify-center"><button type="button" onClick={() => setShowAll(value => !value)} className="min-h-11 rounded-full bg-[#0075ff] px-6 text-sm font-semibold text-white hover:bg-[#0066dc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0075ff]">{showAll ? 'Show fewer reviews' : 'Read All Reviews'}</button></div>}
            </div>
        </section>
    );
}
