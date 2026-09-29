"use client";

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { FiPackage } from 'react-icons/fi';
import styles from './SubcategoryStrip.module.css';

export default function SubcategoryStrip({ id, subcategories, activeName }) {
    const scrollerRef = useRef(null);

    useEffect(() => {
        const scroller = scrollerRef.current;
        const active = scroller?.querySelector('[aria-current="page"]');
        if (scroller && active) {
            scroller.scrollLeft = active.offsetLeft - scroller.offsetLeft - 16;
        }
    }, [activeName, subcategories]);

    if (!subcategories?.length) return null;

    return (
        <nav className={styles.section} aria-label="Browse subcategories">
            <div className={styles.container}>
                <div id={id} ref={scrollerRef} className={styles.scroller} tabIndex={0} aria-label="Subcategories, scroll for more">
                    {subcategories.map((sub) => {
                        const active = activeName?.toLocaleLowerCase() === sub.name?.toLocaleLowerCase();
                        return (
                            <Link key={sub.href} href={sub.href} className={styles.item} aria-current={active ? 'page' : undefined}>
                                <span className={`${styles.imageFrame} ${active ? styles.active : ''}`}>
                                    {sub.image ? (
                                        <Image src={sub.image} alt="" fill className={styles.image} sizes="(max-width: 767px) 86px, (max-width: 1023px) 110px, 158px" />
                                    ) : (
                                        <FiPackage className={styles.placeholder} aria-hidden="true" />
                                    )}
                                </span>
                                <span className={styles.label}>{sub.name}</span>
                            </Link>
                        );
                    })}
                </div>
                {subcategories.length > 7 && (
                    <button type="button" className={styles.next} aria-label="Show more subcategories"
                        onClick={() => scrollerRef.current?.scrollBy({ left: 348, behavior: 'smooth' })}>
                        <ChevronRightIcon aria-hidden="true" />
                    </button>
                )}
            </div>
        </nav>
    );
}
