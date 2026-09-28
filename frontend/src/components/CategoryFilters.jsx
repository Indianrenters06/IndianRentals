'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AdjustmentsHorizontalIcon, XMarkIcon } from '@heroicons/react/24/outline';
import styles from './CategoryFilters.module.css';

const DURATIONS = ['1 month', '3 months', '6 months', '9 months', '18 months', '24 months'];
const SORT_OPTIONS = [
    { value: 'Most Popular', label: 'Most popular' },
    { value: 'Price (low to high)', label: 'Price: low to high' },
    { value: 'Price (high to low)', label: 'Price: high to low' },
    { value: 'New Arrivals', label: 'New arrivals' },
];

function FilterDialog({ selectedDuration, selectedSort, onApply, onDismiss }) {
    const [duration, setDuration] = useState(selectedDuration);
    const [sort, setSort] = useState(selectedSort);
    const dialogRef = useRef(null);
    const titleId = useId();
    const groupId = useId();

    useEffect(() => {
        const dialog = dialogRef.current;
        const previousOverflow = document.body.style.overflow;
        dialog.showModal();
        document.body.style.overflow = 'hidden';
        // The desktop layout already has a persistent filter sidebar.
        const desktop = window.matchMedia('(min-width: 1024px)');
        const handleResize = () => { if (desktop.matches) onDismiss(); };
        desktop.addEventListener('change', handleResize);
        return () => {
            desktop.removeEventListener('change', handleResize);
            dialog.close();
            document.body.style.overflow = previousOverflow;
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
            <form className={styles.form} onSubmit={event => { event.preventDefault(); onApply(duration, sort); }}>
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
                                    <span>{option.label}</span>
                                    <input type="radio" name={`${groupId}-sort`} value={option.value} checked={sort === option.value} onChange={() => setSort(option.value)} />
                                </label>
                            ))}
                        </div>
                    </fieldset>
                </div>
                <footer className={styles.footer}>
                    <button type="button" className="btn-secondary" onClick={() => { setDuration('3 months'); setSort('Most Popular'); }}>Reset</button>
                    <button type="submit" className="btn-primary">Apply filters</button>
                </footer>
            </form>
        </dialog>, document.body
    );
}

export default function CategoryFilters({ count, selectedDuration, setSelectedDuration, selectedSort, setSelectedSort }) {
    const [open, setOpen] = useState(false);
    const triggerRef = useRef(null);
    const dismiss = useCallback(() => {
        setOpen(false);
        requestAnimationFrame(() => triggerRef.current?.focus());
    }, []);
    const changedCount = Number(selectedDuration !== '3 months') + Number(selectedSort !== 'Most Popular');
    return <>
        <div className={styles.toolbar}>
            <button ref={triggerRef} type="button" className={styles.trigger} aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}>
                <AdjustmentsHorizontalIcon aria-hidden="true" />
                Filter & sort
                {changedCount > 0 && <span className={styles.badge} aria-label={`${changedCount} active settings`}>{changedCount}</span>}
            </button>
            <span className={styles.count} aria-live="polite">{count} {count === 1 ? 'product' : 'products'}</span>
        </div>
        {open && <FilterDialog selectedDuration={selectedDuration} selectedSort={selectedSort} onDismiss={dismiss}
            onApply={(duration, sort) => { setSelectedDuration(duration); setSelectedSort(sort); dismiss(); }} />}
    </>;
}
