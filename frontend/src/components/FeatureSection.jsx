"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Pause, Play } from '@phosphor-icons/react';
import useHomepageContent from '@/hooks/useHomepageContent';
import { resolveCmsHref } from '@/lib/cmsLinks';
import styles from './FeatureSection.module.css';

const DEFAULT_IMAGE = '/images/home/rental-workspace-offer.webp';
const DEFAULT_MOBILE_IMAGE = '/images/home/rental-workspace-offer-mobile.webp';
const LEGACY_IMAGE = 'gfjrzgp5llzcjap30wkt.png';
const isVideo = (url = '', type = '') => type === 'video' || /\.(mp4|webm)(?:[?#]|$)/i.test(url) || /\/video\/upload\//.test(url);

export default function FeatureSection() {
    const { content: cms, loading } = useHomepageContent();
    const videoRef = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);
    const [mobile, setMobile] = useState(false);

    useEffect(() => {
        const media = window.matchMedia('(prefers-reduced-motion: reduce)');
        const sync = () => setReducedMotion(media.matches);
        sync();
        media.addEventListener('change', sync);
        return () => media.removeEventListener('change', sync);
    }, []);
    useEffect(() => {
        const media = window.matchMedia('(max-width: 767px)');
        const sync = () => setMobile(media.matches);
        sync();
        media.addEventListener('change', sync);
        return () => media.removeEventListener('change', sync);
    }, []);
    useEffect(() => {
        if (reducedMotion && videoRef.current) videoRef.current.pause();
    }, [reducedMotion]);

    if (loading) return <div className={styles.skeleton} aria-hidden="true" />;
    if (!cms || cms.featureSectionEnabled === false) return null;

    const legacy = cms.featureSectionTitle === 'MacBook Air' && (!cms.featureSectionImage || cms.featureSectionImage.includes(LEGACY_IMAGE));
    const title = legacy ? 'The right tech, right when you need it.' : (cms.featureSectionTitle || 'The right tech, right when you need it.');
    const description = legacy ? 'Rent laptops, cameras, and more for the work ahead.' : (cms.featureSectionSubtitle || 'Rent laptops, cameras, and more for the work ahead.');
    const mediaUrl = legacy ? DEFAULT_IMAGE : (cms.featureSectionImage || DEFAULT_IMAGE);
    const mobileUrl = cms.featureSectionMobileMedia || (mediaUrl === DEFAULT_IMAGE ? DEFAULT_MOBILE_IMAGE : mediaUrl);
    const activeMedia = mobile ? mobileUrl : mediaUrl;
    const video = isVideo(activeMedia, activeMedia === mediaUrl ? cms.featureSectionMediaType : '');
    const poster = cms.featureSectionPosterImage || undefined;
    const alt = cms.featureSectionMediaAlt || 'Rental laptop and creative equipment ready for work';
    const motion = cms.featureSectionInteraction === 'hover-zoom' ? styles.zoom : '';

    const togglePlayback = async () => {
        if (!videoRef.current) return;
        if (videoRef.current.paused) {
            try { await videoRef.current.play(); setPlaying(true); } catch { setPlaying(false); }
        } else {
            videoRef.current.pause();
            setPlaying(false);
        }
    };

    return (
        <section className={styles.section} aria-label="Featured rental offer">
            <div className={`${styles.banner} ${motion}`}>
                <div className={styles.media}>
                    {video ? (
                        <video ref={videoRef} key={activeMedia} className={styles.visual} poster={poster}
                            muted loop playsInline autoPlay={!reducedMotion} preload="metadata"
                            onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} aria-label={alt}>
                            <source src={activeMedia} />
                        </video>
                    ) : <img src={activeMedia} alt={alt} className={styles.visual} loading="lazy" />}
                    <div className={styles.shade} aria-hidden="true" />
                </div>
                <div className={styles.copy}>
                    <h2>{title}</h2>
                    {description && <p>{description}</p>}
                    <Link href={resolveCmsHref(cms.featureSectionCtaLink || '/products')} className={styles.cta}>
                        {cms.featureSectionCtaText || 'Explore rentals'}
                        <ArrowUpRight size={19} weight="bold" aria-hidden="true" />
                    </Link>
                </div>
                {video && <button type="button" className={styles.playback} onClick={togglePlayback}
                    aria-label={`${playing ? 'Pause' : 'Play'} featured offer video`}>
                    {playing ? <Pause size={18} weight="fill" aria-hidden="true" /> : <Play size={18} weight="fill" aria-hidden="true" />}
                </button>}
            </div>
        </section>
    );
}
