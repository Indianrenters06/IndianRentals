'use client';

import { useEffect, useRef, useState } from 'react';
import { X } from '@phosphor-icons/react';
import styles from './CompareTenures.module.css';

export default function CompareTenures({ isOpen, onClose, selectedTenure, onSelect, tenures }) {
    const closeRef = useRef(null);
    const panelRef = useRef(null);
    const plans = tenures || [];
    const basePrice = plans[0]?.price || 0;
    const [draft, setDraft] = useState({ isOpen, tenure: selectedTenure });
    // Reset each selection session without remounting the animated panel.
    if (draft.isOpen !== isOpen) {
        setDraft({ isOpen, tenure: selectedTenure });
    }
    const draftTenure = draft.tenure;

    useEffect(() => {
        if (!isOpen) return;
        const previousFocus = document.activeElement;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        closeRef.current?.focus();
        const onKeyDown = (event) => {
            if (event.key === 'Escape') onClose();
            if (event.key !== 'Tab') return;
            const focusables = [...panelRef.current.querySelectorAll('button:not([disabled]), input:not([disabled])')];
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        };
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', onKeyDown);
            previousFocus?.focus?.();
        };
    }, [isOpen, onClose]);

    return <>
        <div aria-hidden="true" onClick={onClose} className={`${styles.backdrop} ${isOpen ? styles.backdropOpen : ''}`} />
        <aside ref={panelRef} role="dialog" aria-modal={isOpen ? 'true' : undefined} aria-hidden={!isOpen} aria-labelledby="compare-tenures-title" inert={!isOpen ? true : undefined}
            className={`${styles.panel} ${isOpen ? styles.open : ''}`}>
            <div className={styles.handle} aria-hidden="true" />
            <header className={styles.header}>
                <div>
                    <h2 id="compare-tenures-title">Choose your rental term</h2>
                    <p>Compare the monthly rent for each minimum term.</p>
                </div>
                <button ref={closeRef} type="button" onClick={onClose} aria-label="Close rental terms" className={styles.close}><X size={20} aria-hidden="true" /></button>
            </header>
            <div className={styles.content}>
                <fieldset className={styles.plans}>
                    <legend className="sr-only">Monthly rent by minimum term</legend>
                    {plans.map(plan => {
                        const selected = draftTenure === plan.months;
                        const saving = basePrice > plan.price ? Math.round((1 - plan.price / basePrice) * 100) : 0;
                        return <label key={plan.months} className={`${styles.plan} ${selected ? styles.selected : ''}`}>
                            <input type="radio" name="rental-tenure" value={plan.months} checked={selected} onChange={() => setDraft({ isOpen, tenure: plan.months })} className="sr-only" />
                            <span className={styles.term}>{plan.months} {plan.months === 1 ? 'month' : 'months'}</span>
                            <span className={styles.price}><span>₹{Number(plan.price).toLocaleString('en-IN')}<small>/month</small></span>{saving > 0 && <small className={styles.saving}>{saving}% lower monthly rent</small>}</span>
                        </label>;
                    })}
                </fieldset>
                <p className={styles.note}>Monthly rent is shown above. Taxes, deposit and delivery charges are confirmed at checkout.</p>
            </div>
            <footer className={styles.footer}>
                <button type="button" disabled={!plans.some(plan => plan.months === draftTenure)} onClick={() => { onSelect(draftTenure); onClose(); }} className={styles.apply}>
                    Apply {draftTenure} {draftTenure === 1 ? 'month' : 'months'}
                </button>
            </footer>
        </aside>
    </>;
}
