"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CheckIcon, ChevronRightIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import styles from './Sidebar.module.css';

const CATEGORY_LINKS = [
    ['Most Rented', '/products'],
    ['Apple Products', '/category/apple'],
    ['IT Products', '/category/it-products'],
    ['AV Products', '/category/av-products'],
    ['Office Equipment', '/category/office-equipment'],
    ['DSLR Camera & Lenses', '/category/dslr'],
    ['Latest Launch', '/products'],
    ['More', '/categories'],
];
const DURATIONS = ['1 month', '3 months', '6 months', '9 months', '18 months', '24 months'];
const SORT_OPTIONS = ['Most Popular', 'Price (high to low)', 'Price (low to high)', 'New Arrivals'];

export default function Sidebar({ selectedDuration, setSelectedDuration, selectedSort, setSelectedSort, dealsOnly = false, setDealsOnly }) {
    const pathname = usePathname() || '';

    return (
        <aside className={styles.sidebar} aria-label="Product filters">
            <section className={styles.section} aria-labelledby="category-filter-title">
                <h2 id="category-filter-title" className={styles.heading}>Browse categories</h2>
                <nav className={styles.categories} aria-label="Product categories">
                    {CATEGORY_LINKS.map(([label, href]) => {
                        const active = href.startsWith('/category/') && (pathname === href || pathname.startsWith(`${href}/`));
                        return (
                            <Link key={label} href={href} className={`${styles.category} ${label === 'More' ? styles.more : ''} ${active ? styles.current : ''}`}
                                aria-current={active ? 'page' : undefined}>
                                <span>{label}</span>
                                {label !== 'More' && <ChevronRightIcon aria-hidden="true" />}
                            </Link>
                        );
                    })}
                </nav>
            </section>

            <fieldset className={styles.section}>
                <legend className={styles.heading}>Rent for <InformationCircleIcon className={styles.info} aria-hidden="true" /></legend>
                <div className={styles.durations}>
                    {DURATIONS.map(duration => (
                        <label key={duration} className={`${styles.duration} ${selectedDuration === duration ? styles.durationSelected : ''}`}>
                            <input type="radio" name="desktop-rental-duration" value={duration}
                                checked={selectedDuration === duration} onChange={() => setSelectedDuration(duration)} />
                            <span>{duration}</span>
                        </label>
                    ))}
                </div>
            </fieldset>

            <fieldset className={styles.section}>
                <legend className={styles.heading}>Sort by</legend>
                <div className={styles.sortOptions}>
                    {SORT_OPTIONS.map(option => (
                        <label key={option} className={styles.option}>
                            <input type="radio" name="desktop-product-sort" value={option} checked={selectedSort === option}
                                onChange={() => setSelectedSort(option)} />
                            <span className={styles.radioMark} aria-hidden="true"><CheckIcon /></span>
                            <span>{option}</span>
                        </label>
                    ))}
                </div>
            </fieldset>

            <fieldset className={`${styles.section} ${styles.lastSection}`}>
                <legend className={styles.heading}>Deals</legend>
                <label className={styles.option}>
                    <input type="checkbox" checked={dealsOnly} onChange={event => setDealsOnly?.(event.target.checked)} />
                    <span className={styles.checkboxMark} aria-hidden="true"><CheckIcon /></span>
                    <span>Deals</span>
                </label>
            </fieldset>
        </aside>
    );
}
