"use client";
import { useState, useRef, useCallback } from "react";

/**
 * Snaps a carousel track to a whole number of fixed-width cards.
 *
 * Card width and gap are fixed by the design, so rather than resizing cards to
 * divide the container evenly, the track itself is narrowed to the largest whole
 * multiple that fits. The leftover becomes equal margins at both ends, which is
 * what stops a sliced card ever showing at an edge.
 *
 * Returns [ref, trackWidth, perView] — put the ref on the element whose width is
 * the available space, and apply trackWidth to the swiper wrapper inside it.
 * trackWidth is null until the first measurement, so fall back to '100%'.
 *
 * perView must be fed to the swiper as an explicit `slidesPerGroup`. Swiper's
 * `slidesPerGroupAuto` derives the step from its own dynamic visible-slide count,
 * which stops resolving to a whole card once loop clones are in the track — that
 * lands the transform on a fractional offset and slices the first card.
 *
 * The returned ref is a *callback* ref, not an object ref. Carousels here render
 * null while their products are still being fetched, so a mount-time useEffect
 * would find no node and — with nothing in its dep array to change — never run
 * again, silently leaving the track unsnapped. A callback ref fires whenever the
 * node actually attaches, including after loading finishes.
 */
export const useWholeCardTrack = (cardW, gap) => {
    const [track, setTrack] = useState({ width: null, perView: 1 });
    const observerRef = useRef(null);

    const measure = useCallback((el) => {
        if (!el) return;
        const available = el.clientWidth;
        // Zero while an ancestor is display:none — the observer re-fires on reveal.
        if (!available) return;
        const perView = Math.max(1, Math.floor((available + gap) / (cardW + gap)));
        setTrack((prev) =>
            prev.perView === perView && prev.width !== null
                ? prev
                : { width: perView * (cardW + gap) - gap, perView }
        );
    }, [cardW, gap]);

    const boundsRef = useCallback((node) => {
        if (observerRef.current) {
            observerRef.current.disconnect();
            observerRef.current = null;
        }
        if (!node) return;
        measure(node);
        const ro = new ResizeObserver(() => measure(node));
        ro.observe(node);
        observerRef.current = ro;
    }, [measure]);

    return [boundsRef, track.width, track.perView];
};
