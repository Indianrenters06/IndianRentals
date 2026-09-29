'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, X } from '@phosphor-icons/react';

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
    const [draftTenure, setDraftTenure] = useState(selectedTenure);

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
            className={`fixed inset-y-0 right-0 z-[9999] flex w-full max-w-[506px] flex-col bg-[#eee] shadow-2xl transition-transform duration-300 ease-out sm:rounded-l-[18px] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="shrink-0 px-5 pb-4 pt-7 sm:px-8">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 id="compare-tenures-title" className="text-[24px] font-semibold leading-tight tracking-[-.03em] text-[#141414] sm:text-[28px]">Compare all rental prices</h2>
                        <p className="mt-1 text-sm leading-relaxed text-[#555]">Choose the monthly rent that fits your plans.</p>
                    </div>
                    <button ref={closeRef} type="button" onClick={onClose} aria-label="Close comparison" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#d8d8d8] bg-white text-[#141414] hover:bg-[#f6f6f6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]"><X size={20} aria-hidden="true" /></button>
                </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-5 sm:px-8">
                <fieldset className="space-y-2 rounded-[20px] bg-white p-3 shadow-[0_12px_24px_rgba(0,0,0,.06)]">
                    <legend className="sr-only">Monthly rent by minimum term</legend>
                    {plans.map((plan) => {
                        const selected = draftTenure === plan.months;
                        const saving = basePrice > plan.price ? Math.round((1 - plan.price / basePrice) * 100) : 0;
                        return <label key={plan.months} className={`flex min-h-[58px] cursor-pointer flex-wrap items-center gap-x-3 gap-y-1 rounded-[12px] border px-3 py-2.5 transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#141414] sm:flex-nowrap ${selected ? 'border-[#00b505] bg-[#f0fdf4] shadow-[0_2px_6px_rgba(0,100,0,.12)]' : 'border-[#e2e2e2] bg-white hover:border-[#999]'}`}>
                            <input type="radio" name="rental-tenure" value={plan.months} checked={selected} onChange={() => setDraftTenure(plan.months)} className="sr-only peer" />
                            <span aria-hidden="true" className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${selected ? 'border-[#00b505] bg-[#00b505] text-white' : 'border-[#888] bg-white'}`}>{selected && <Check size={14} weight="bold" />}</span>
                            <span className="shrink-0 rounded-[4px] bg-[#008a00] px-3 py-1 text-sm font-semibold text-white">{plan.months} {plan.months === 1 ? 'month' : 'months'}</span>
                            <span className="ml-auto whitespace-nowrap text-sm font-medium text-[#333]">₹{Number(plan.price).toLocaleString('en-IN')}<span className="text-xs text-[#666]">/mo</span></span>
                            {saving > 0 && <span className="whitespace-nowrap text-sm font-semibold text-[#00a500]">{saving}% OFF</span>}
                        </label>;
                    })}
                </fieldset>
                <p className="mt-5 text-xs leading-relaxed text-[#555]">Prices shown are monthly rents. Taxes, deposit and delivery charges are confirmed at checkout.</p>
            </div>

            <div className="shrink-0 px-5 pb-6 pt-1 sm:px-8">
                <button type="button" onClick={() => { onSelect(draftTenure); onClose(); }} className="flex min-h-10 items-center justify-center rounded-full bg-[#ffcf46] px-6 text-sm font-semibold text-[#141414] transition-colors hover:bg-[#f5bf27] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]">
                    Select {draftTenure} {draftTenure === 1 ? 'month' : 'months'}
                </button>
            </div>
        </aside>
    </>;
}
