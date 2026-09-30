'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { Star } from '@phosphor-icons/react';
import { submitProductReview } from '@/services/productService';
import styles from './ProductReviewForm.module.css';

export default function ProductReviewForm({ productId, cms }) {
    const id = useId();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [pending, setPending] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [needsLogin, setNeedsLogin] = useState(false);

    const submit = async (event) => {
        event.preventDefault();
        if (pending || !rating || !comment.trim()) return;
        setError('');
        setNeedsLogin(false);
        let session;
        try { session = JSON.parse(localStorage.getItem('userInfo') || 'null'); } catch { session = null; }
        if (!session?.token) {
            setNeedsLogin(true);
            setError('Sign in to submit your review.');
            return;
        }
        setPending(true);
        try {
            await submitProductReview(productId, { rating, comment: comment.trim() }, session.token);
            setSubmitted(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Your review could not be submitted. Please try again.');
        } finally { setPending(false); }
    };

    if (submitted) return <p className={styles.success} role="status">{cms('ReviewThanksText', 'Thanks for your review!')}</p>;

    return <form className={styles.form} onSubmit={submit}>
        <fieldset disabled={pending} className={styles.rating}>
            <legend>{cms('ReviewPrompt', 'How was your experience?')}</legend>
            <div className={styles.stars}>
                {[1, 2, 3, 4, 5].map(value => <label key={value} className={styles.star}>
                    <input type="radio" name={`rating-${id}`} value={value} checked={rating === value} onChange={() => setRating(value)} required />
                    <Star size={28} weight={value <= rating ? 'fill' : 'regular'} aria-hidden="true" />
                    <span className="sr-only">{value} {value === 1 ? 'star' : 'stars'}</span>
                </label>)}
                {rating > 0 && <span className={styles.ratingValue}>{rating}/5</span>}
            </div>
        </fieldset>
        <label htmlFor={`${id}-comment`}>Your review</label>
        <textarea id={`${id}-comment`} value={comment} onChange={event => setComment(event.target.value)} placeholder={cms('ReviewPlaceholder', 'Tell others about your rental experience…')} rows={4} required maxLength={2000} disabled={pending} />
        {error && <div role="alert" className={styles.error}>{error} {needsLogin && <Link href={`/login?redirect=${encodeURIComponent(`/products/${productId}`)}`}>Sign in</Link>}</div>}
        <button type="submit" disabled={pending || !rating || !comment.trim()}>{pending ? 'Submitting…' : cms('ReviewSubmitText', 'Submit Review')}</button>
    </form>;
}
