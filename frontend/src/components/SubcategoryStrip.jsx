"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import CarouselArrow from './CarouselArrow';
import CategoryPlaceholderIcon from './CategoryPlaceholderIcon';
import styles from './SubcategoryStrip.module.css';

function StripImage({ sub, active }) {
    const [failedImage, setFailedImage] = useState(null);
    const hasImage = Boolean(sub.image) && failedImage !== sub.image;
    return (
        <span className={`${styles.imageFrame} ${active ? styles.active : ''} ${hasImage ? '' : styles.missingImage}`}>
            {hasImage ? (
                <Image src={sub.image} alt="" fill className={styles.image}
                    onError={() => setFailedImage(sub.image)}
                    sizes="(max-width: 767px) 92px, (max-width: 1023px) 116px, 158px" />
            ) : <CategoryPlaceholderIcon name={sub.name} slug={sub.slug} className={styles.placeholder} />}
        </span>
    );
}

export default function SubcategoryStrip({ id, subcategories, activeName }) {
    const scrollerRef = useRef(null);
    const [position, setPosition] = useState({ overflow: false, previousDisabled: true, nextDisabled: true });

    useEffect(() => {
        const scroller = scrollerRef.current;
        if (!scroller) return;
        const update = () => {
            const maxScroll = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
            const left = Math.max(0, Math.min(scroller.scrollLeft, maxScroll));
            setPosition({ overflow: maxScroll > 2,
                previousDisabled: left <= 2, nextDisabled: left >= maxScroll - 2 });
        };
        const active = scroller.querySelector('[aria-current="page"]');
        if (active) {
            const offset = active.getBoundingClientRect().left - scroller.getBoundingClientRect().left;
            scroller.scrollLeft += offset - (scroller.clientWidth - active.clientWidth) / 2;
        }
        scroller.addEventListener('scroll', update, { passive: true });
        const observer = new ResizeObserver(update);
        observer.observe(scroller);
        update();
        return () => { scroller.removeEventListener('scroll', update); observer.disconnect(); };
    }, [activeName, subcategories]);

    const scroll = (direction) => {
        const scroller = scrollerRef.current;
        if (!scroller) return;
        scroller.scrollBy({ left: direction * scroller.clientWidth * 0.85,
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    };

    if (!subcategories?.length) return null;

    return (
        <nav className={styles.section} aria-label="Browse subcategories">
            <div className={styles.container}>
                <div id={id} ref={scrollerRef} className={styles.scroller} tabIndex={0} aria-label="Subcategories, scroll for more"
                    onKeyDown={event => {
                        if (event.target === event.currentTarget && ['ArrowLeft', 'ArrowRight'].includes(event.key)) {
                            event.preventDefault();
                            scroll(event.key === 'ArrowLeft' ? -1 : 1);
                        }
                    }}>
                    {subcategories.map((sub) => {
                        const active = activeName?.toLocaleLowerCase() === sub.name?.toLocaleLowerCase();
                        return (
                            <Link key={sub.href} href={sub.href} className={styles.item} aria-current={active ? 'page' : undefined}>
                                <StripImage sub={sub} active={active} />
                                <span className={styles.label}>{sub.name}</span>
                            </Link>
                        );
                    })}
                </div>
                {position.overflow && <>
                    <CarouselArrow direction="previous" className={`${styles.edgeArrow} ${styles.previous}`}
                        aria-label="Previous subcategories" aria-controls={id}
                        disabled={position.previousDisabled} onClick={() => scroll(-1)} />
                    <CarouselArrow direction="next" className={`${styles.edgeArrow} ${styles.next}`}
                        aria-label="Next subcategories" aria-controls={id}
                        disabled={position.nextDisabled} onClick={() => scroll(1)} />
                </>}
            </div>
        </nav>
    );
}
