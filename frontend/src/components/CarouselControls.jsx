"use client";

import { useEffect, useState } from 'react';
import { Pause, Play } from '@phosphor-icons/react';
import CarouselArrow from './CarouselArrow';
import styles from './CarouselControls.module.css';

/** Rail controls stay in normal flow; hero controls sit beside the banner. */
export default function CarouselControls({ count, current = 0, label = 'Carousel', onPrevious, onNext, onSelect, previousDisabled = false, nextDisabled = false, playing, onTogglePlay, variant = 'rail' }) {
    if (count < 2) return null;
    const index = Math.max(0, Math.min(current, count - 1));
    return (
        <div className={`${styles.controls} ${styles[variant] || ''}`} role="group" aria-label={`${label} controls`}>
            <div className={styles.progress}>
                {variant !== 'rail' && onSelect ? Array.from({ length: count }, (_, i) => (
                    <button key={i} type="button" className={styles.segment} onClick={() => onSelect(i)} aria-label={`Go to ${label.toLowerCase()} slide ${i + 1}`} aria-current={i === index ? 'true' : undefined}>
                        <span />
                    </button>
                )) : <span className={styles.track} role="progressbar" aria-label={`${label} position`} aria-valuemin={1} aria-valuemax={count} aria-valuenow={index + 1}><span style={{ width: `${((index + 1) / count) * 100}%` }} /></span>}
            </div>
            <div className={styles.actions}>
                {onTogglePlay && <button type="button" className={`${styles.button} ${styles.playback}`} onClick={onTogglePlay} aria-label={`${playing ? 'Pause' : 'Play'} ${label.toLowerCase()} slideshow`}>
                    {playing ? <Pause size={18} weight="fill" aria-hidden="true" /> : <Play size={18} weight="fill" aria-hidden="true" />}
                </button>}
                <CarouselArrow direction="previous" className={`${styles.arrow} ${styles.previous}`} onClick={onPrevious} disabled={previousDisabled} aria-label={`Previous ${label.toLowerCase()} slide`} />
                <CarouselArrow direction="next" className={`${styles.arrow} ${styles.next}`} onClick={onNext} disabled={nextDisabled} aria-label={`Next ${label.toLowerCase()} slide`} />
            </div>
        </div>
    );
}

/** Uses Swiper's snap positions for multi-card rails, and real indexes for looping banners. */
export function SwiperControls({ swiper, count, label, autoplay = false, variant = 'rail' }) {
    const [state, setState] = useState({ current: 0, count: 0, previousDisabled: true, nextDisabled: true, playing: false });
    useEffect(() => {
        if (!swiper || swiper.destroyed) return;
        const update = () => {
            if (swiper.destroyed) return;
            const wraps = swiper.params.loop || swiper.params.rewind;
            setState({
                current: swiper.params.loop ? swiper.realIndex : swiper.snapIndex,
                count: swiper.params.loop ? count : swiper.snapGrid.length,
                previousDisabled: swiper.isLocked || (!wraps && swiper.isBeginning),
                nextDisabled: swiper.isLocked || (!wraps && swiper.isEnd),
                playing: Boolean(swiper.autoplay?.running),
            });
        };
        const events = ['slideChange', 'snapGridLengthChange', 'resize', 'update', 'lock', 'unlock', 'autoplayStart', 'autoplayStop'];
        events.forEach(event => swiper.on(event, update));
        const media = window.matchMedia('(prefers-reduced-motion: reduce)');
        const reduceMotion = () => { if (media.matches && !swiper.destroyed) swiper.autoplay?.stop(); };
        reduceMotion();
        media.addEventListener('change', reduceMotion);
        update();
        return () => {
            events.forEach(event => swiper.off(event, update));
            media.removeEventListener('change', reduceMotion);
        };
    }, [swiper, count]);
    if (!swiper || swiper.destroyed) return null;
    return <CarouselControls {...state} label={label} variant={variant}
        onPrevious={() => swiper.slidePrev()} onNext={() => swiper.slideNext()}
        onSelect={index => swiper.params.loop ? swiper.slideToLoop(index) : swiper.slideTo(Math.min(index * swiper.params.slidesPerGroup, swiper.slides.length - 1))}
        onTogglePlay={autoplay ? () => swiper.autoplay.running ? swiper.autoplay.stop() : swiper.autoplay.start() : undefined}
    />;
}
