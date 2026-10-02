"use client";

import { useEffect, useRef } from 'react';
import { lockBodyScroll } from './bodyScrollLock.mjs';

const selector = 'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// A parent's changing close callback must not restart the opening focus session.
export default function useModalFocus({ isOpen, onClose, panelRef, initialFocusRef }) {
    const closeRef = useRef(onClose);
    useEffect(() => { closeRef.current = onClose; }, [onClose]);
    useEffect(() => {
        if (!isOpen || !panelRef.current) return;
        const panel = panelRef.current;
        const previousFocus = document.activeElement;
        const unlockScroll = lockBodyScroll();
        const items = () => [...panel.querySelectorAll(selector)].filter(element => element.getClientRects().length && !element.closest('[inert]') && getComputedStyle(element).visibility !== 'hidden');
        const enter = () => (initialFocusRef?.current || items()[0] || panel).focus();
        enter();
        const onKey = event => {
            if (event.key === 'Escape') { event.preventDefault(); closeRef.current?.(); return; }
            if (event.key !== 'Tab') return;
            const controls = items();
            const first = controls[0] || panel;
            const last = controls.at(-1) || panel;
            if (!controls.length || !panel.contains(document.activeElement) || (event.shiftKey && document.activeElement === first) || (!event.shiftKey && document.activeElement === last)) {
                event.preventDefault();
                (event.shiftKey ? last : first).focus();
            }
        };
        const keepInside = event => { if (!panel.contains(event.target)) enter(); };
        document.addEventListener('keydown', onKey);
        document.addEventListener('focusin', keepInside);
        return () => {
            document.removeEventListener('keydown', onKey);
            document.removeEventListener('focusin', keepInside);
            unlockScroll();
            const isVisible = element => element?.isConnected && element.getClientRects().length && getComputedStyle(element).visibility !== 'hidden' && !element.closest('[inert]');
            if (isVisible(previousFocus)) previousFocus.focus?.();
            else [...document.querySelectorAll(selector)].find(element => !panel.contains(element) && isVisible(element))?.focus();
        };
    }, [isOpen, panelRef, initialFocusRef]);
}
