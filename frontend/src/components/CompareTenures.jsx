'use client';

import { useEffect, useRef } from 'react';
import { ArrowRight, X } from '@phosphor-icons/react';

const fallbackTenures = [
    { months: 1, price: 2560 },
    { months: 3, price: 2304 },
    { months: 6, price: 2048 },
    { months: 9, price: 1920 },
    { months: 12, price: 1792 },
];

export default function CompareTenures({ isOpen, onClose, selectedTenure, onSelect, tenures }) {
    const closeRef = useRef(null);
    const panelRef = useRef(null);
    const plans = tenures?.length ? tenures : fallbackTenures;
    const basePrice = plans[0]?.price || 0;

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
        <div aria-hidden="true" onClick={onClose} className={`fixed inset-0 z-[9998] bg-[#141414]/55 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`} />
        <aside ref={panelRef} role="dialog" aria-modal={isOpen ? 'true' : undefined} aria-hidden={!isOpen} aria-labelledby="compare-tenures-title" inert={!isOpen ? true : undefined}
            className={`fixed inset-y-0 right-0 z-[9999] flex w-full max-w-[520px] flex-col bg-[#f6f6f6] shadow-2xl transition-transform duration-300 ease-out sm:rounded-l-[24px] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="shrink-0 border-b border-[#e2e2e2] bg-white px-5 pb-5 pt-6 sm:px-8 sm:pt-8">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[.12em] text-[#555]">Rental options</p>
                        <h2 id="compare-tenures-title" className="text-[27px] font-semibold leading-tight tracking-[-.04em] text-[#141414] sm:text-[32px]">Compare rental periods</h2>
                        <p className="mt-2 text-sm leading-relaxed text-[#555]">Choose the monthly rent that fits your plans.</p>
                    </div>
                    <button ref={closeRef} type="button" onClick={onClose} aria-label="Close comparison" className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#d8d8d8] text-[#141414] hover:bg-[#f6f6f6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]"><X size={20} aria-hidden="true" /></button>
                </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-8">
                <fieldset className="space-y-3">
                    <legend className="mb-3 text-sm font-semibold text-[#333]">Monthly rent by minimum term</legend>
                    {plans.map((plan) => {
                        const selected = selectedTenure === plan.months;
                        const saving = basePrice > plan.price ? Math.round((1 - plan.price / basePrice) * 100) : 0;
                        return <label key={plan.months} className={`flex cursor-pointer items-center gap-3 rounded-[14px] border bg-white px-4 py-4 transition-colors sm:px-5 ${selected ? 'border-[#141414] ring-2 ring-[#ffcf46]' : 'border-[#dedede] hover:border-[#777]'}`}>
                            <input type="radio" name="rental-tenure" value={plan.months} checked={selected} onChange={() => onSelect(plan.months)} className="h-5 w-5 shrink-0 accent-[#141414]" />
                            <span className="min-w-0 flex-1 text-[15px] font-semibold text-[#141414]">{plan.months} {plan.months === 1 ? 'month' : 'months'}</span>
                            <span className="flex flex-col items-end gap-1 text-right">
                                <span className="whitespace-nowrap text-[17px] font-semibold text-[#141414]">₹{Number(plan.price).toLocaleString('en-IN')}<span className="text-xs font-normal text-[#666]">/mo</span></span>
                                {saving > 0 && <span className="whitespace-nowrap rounded-full bg-[#e8f5e9] px-2 py-0.5 text-xs font-semibold text-[#176d2c]">Save {saving}% monthly</span>}
                            </span>
                        </label>;
                    })}
                </fieldset>
                <p className="mt-5 text-xs leading-relaxed text-[#666]">Prices shown are monthly rents. Taxes, deposit and delivery charges are confirmed at checkout.</p>
            </div>

            <div className="shrink-0 border-t border-[#e2e2e2] bg-white px-5 py-4 sm:px-8 sm:py-5">
                <button type="button" onClick={onClose} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#ffcf46] px-6 text-base font-semibold text-[#141414] transition-colors hover:bg-[#f5bf27] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]">
                    Use {selectedTenure} {selectedTenure === 1 ? 'month' : 'months'} <ArrowRight size={18} aria-hidden="true" />
                </button>
            </div>
        </aside>
    </>;
}
