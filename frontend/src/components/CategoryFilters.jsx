'use client';

import { lockBodyScroll } from '../lib/bodyScrollLock.mjs';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AdjustmentsHorizontalIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import styles from './CategoryFilters.module.css';

const DURATIONS = ['1 month', '3 months', '6 months', '9 months', '18 months', '24 months'];
const SORT_OPTIONS = [
    { value: 'Most Popular', label: 'Most popular' },
    { value: 'Price (low to high)', label: 'Price: low to high' },
    { value: 'Price (high to low)', label: 'Price: high to low' },
    { value: 'New Arrivals', label: 'New arrivals' },
];

function FilterDialog({ selectedDuration, selectedSort, dealsOnly, onApply, onDismiss }) {
    const [duration, setDuration] = useState(selectedDuration);
    const [sort, setSort] = useState(selectedSort);
    const [deals, setDeals] = useState(dealsOnly);
    const dialogRef = useRef(null);
    const titleId = useId();
    const groupId = useId();

    useEffect(() => {
        const dialog = dialogRef.current;
        const unlockScroll = lockBodyScroll();
        dialog.showModal();
        // The desktop layout already has a persistent filter sidebar.
        const desktop = window.matchMedia('(min-width: 1024px)');
        const handleResize = () => { if (desktop.matches) onDismiss(); };
        desktop.addEventListener('change', handleResize);
        return () => {
            desktop.removeEventListener('change', handleResize);
            dialog.close();
            unlockScroll();
        };
    }, [onDismiss]);

    return createPortal(
        <dialog ref={dialogRef} className={styles.dialog} aria-labelledby={titleId}
            onCancel={onDismiss}
            onClick={event => {
                if (event.target !== event.currentTarget) return;
                const bounds = event.currentTarget.getBoundingClientRect();
                if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onDismiss();
            }}>
            <form className={styles.form} onSubmit={event => { event.preventDefault(); onApply(duration, sort, deals); }}>
                <header className={styles.header}>
                    <h2 id={titleId}>Filter & sort</h2>
                    <button type="button" className={styles.close} aria-label="Close filters" onClick={onDismiss} autoFocus>
                        <XMarkIcon aria-hidden="true" />
                    </button>
                </header>
                <div className={styles.body}>
                    <fieldset className={styles.group}>
                        <legend>Rental duration</legend>
                        <div className={styles.durations}>
                            {DURATIONS.map(value => (
                                <label key={value} className={styles.duration}>
                                    <input type="radio" name={`${groupId}-duration`} value={value} checked={duration === value} onChange={() => setDuration(value)} />
                                    <span>{value}</span>
                                </label>
                            ))}
                        </div>
                    </fieldset>
                    <fieldset className={`${styles.group} ${styles.sortGroup}`}>
                        <legend>Sort by</legend>
                        <div className={styles.sortOptions}>
                            {SORT_OPTIONS.map(option => (
                                <label key={option.value} className={styles.sortOption}>
                                    <input type="radio" name={`${groupId}-sort`} value={option.value} checked={sort === option.value} onChange={() => setSort(option.value)} />
                                    <span className={styles.radioMark} aria-hidden="true"><CheckIcon /></span>
                                    <span>{option.label}</span>
                                </label>
                            ))}
                        </div>
                    </fieldset>
                    <fieldset className={`${styles.group} ${styles.sortGroup}`}>
                        <legend>Deals</legend>
                        <div className={styles.sortOptions}>
                            <label className={styles.sortOption}>
                                <input type="checkbox" checked={deals} onChange={event => setDeals(event.target.checked)} />
                                <span className={styles.checkboxMark} aria-hidden="true"><CheckIcon /></span>
                                <span>Deals</span>
                            </label>
                        </div>
                    </fieldset>
                </div>
                <footer className={styles.footer}>
                    <button type="button" className="btn-secondary" onClick={() => { setDuration('3 months'); setSort('Most Popular'); setDeals(false); }}>Reset</button>
                    <button type="submit" className="btn-primary">Apply filters</button>
                </footer>
            </form>
        </dialog>, document.body
    );
}

export default function CategoryFilters({ count, selectedDuration, setSelectedDuration, selectedSort, setSelectedSort, dealsOnly = false, setDealsOnly }) {
    const [open, setOpen] = useState(false);
    const triggerRef = useRef(null);
    const dismiss = useCallback(() => {
        setOpen(false);
        requestAnimationFrame(() => triggerRef.current?.focus());
    }, []);
    const changedCount = Number(selectedDuration !== '3 months') + Number(selectedSort !== 'Most Popular') + Number(dealsOnly);
    return <>
        <div className={styles.toolbar}>
            <button ref={triggerRef} type="button" className={styles.trigger} aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}>
                <AdjustmentsHorizontalIcon aria-hidden="true" />
                Filter & sort
                {changedCount > 0 && <span className={styles.badge} aria-label={`${changedCount} active settings`}>{changedCount}</span>}
            </button>
            <span className={styles.count} aria-live="polite">{count} {count === 1 ? 'product' : 'products'}</span>
        </div>
        {open && <FilterDialog selectedDuration={selectedDuration} selectedSort={selectedSort} dealsOnly={dealsOnly} onDismiss={dismiss}
            onApply={(duration, sort, deals) => { setSelectedDuration(duration); setSelectedSort(sort); setDealsOnly?.(deals); dismiss(); }} />}
    </>;
}
