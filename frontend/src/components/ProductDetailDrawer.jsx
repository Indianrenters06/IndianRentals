'use client';

import { useEffect, useRef } from 'react';
import { X } from '@phosphor-icons/react';

export default function ProductDetailDrawer({ isOpen, onClose, title, description, icon: Icon, children }) {
    const panelRef = useRef(null);
    const closeRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;
        const previousFocus = document.activeElement;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        closeRef.current?.focus();

        const onKeyDown = (event) => {
            if (event.key === 'Escape') onClose();
            if (event.key !== 'Tab') return;
            const focusables = [...panelRef.current.querySelectorAll('button:not([disabled]), a[href], input:not([disabled])')];
            if (!focusables.length) return;
            if (event.shiftKey && document.activeElement === focusables[0]) {
                event.preventDefault();
                focusables.at(-1).focus();
            } else if (!event.shiftKey && document.activeElement === focusables.at(-1)) {
                event.preventDefault();
                focusables[0].focus();
            }
        };
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', onKeyDown);
            previousFocus?.focus?.();
        };
    }, [isOpen, onClose]);

    return <>
        <div aria-hidden="true" onClick={onClose} className={`fixed inset-0 z-[9998] bg-[#141414]/55 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`} />
        <aside ref={panelRef} role="dialog" aria-modal={isOpen ? 'true' : undefined} aria-hidden={!isOpen} aria-label={title} inert={!isOpen ? true : undefined}
            className={`fixed inset-y-0 right-0 z-[9999] flex w-full max-w-[506px] flex-col bg-[#eee] shadow-2xl transition-transform duration-300 ease-out sm:rounded-l-[18px] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <header className="flex items-start justify-between gap-5 px-5 pb-5 pt-7 sm:px-8">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        {Icon && <Icon size={24} className="shrink-0 text-[#ed2115]" aria-hidden="true" />}
                        <h2 className="text-[25px] font-semibold leading-tight tracking-[-0.03em] text-[#333]">{title}</h2>
                    </div>
                    {description && <p className="mt-2 max-w-[42ch] text-sm leading-relaxed text-[#555]">{description}</p>}
                </div>
                <button ref={closeRef} type="button" onClick={onClose} aria-label="Close details" className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#dedede] text-[#141414] transition-colors hover:bg-[#f6f6f6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]"><X size={20} aria-hidden="true" /></button>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-7 text-[15px] leading-relaxed text-[#333] sm:px-8">
                <div className="min-h-[280px] rounded-[20px] bg-white p-5 shadow-[0_12px_28px_rgba(0,0,0,.06)] sm:p-6">{children}</div>
            </div>
        </aside>
    </>;
}
