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
 * Returns [ref, trackWidth, perView, gap] — put the ref on the element whose width
 * is the available space, and apply trackWidth to the swiper wrapper inside it.
 * trackWidth is null until the first measurement, so fall back to '100%'.
 *
 * With `flexGap`, one more card is squeezed in and the gaps tighten to absorb the
 * leftover, as long as they stay at or above `minGap`. Narrowing the track leaves
 * dead space at both ends, which reads as the section being inset from its own
 * heading; tightening the gap instead keeps the cards at their Figma size and the
 * track flush with the container. Feed the returned gap back as `spaceBetween`.
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
export const useWholeCardTrack = (cardW, gap, { flexGap = false, minGap = 12 } = {}) => {
    const [track, setTrack] = useState({ width: null, perView: 1, gap });
    const observerRef = useRef(null);

    const measure = useCallback((el) => {
        if (!el) return;
        const available = el.clientWidth;
        // Zero while an ancestor is display:none — the observer re-fires on reveal.
        if (!available) return;
        let perView = Math.max(1, Math.floor((available + gap) / (cardW + gap)));
        let usedGap = gap;

        if (flexGap) {
            const more = perView + 1;
            // Only worth it while the extra card still leaves breathing room.
            const tightened = (available - more * cardW) / (more - 1);
            if (tightened >= minGap) {
                perView = more;
                usedGap = Math.floor(tightened * 100) / 100;
            }
        }

        const width = perView * (cardW + usedGap) - usedGap;
        setTrack((prev) =>
            prev.perView === perView && prev.width === width
                ? prev
                : { width, perView, gap: usedGap }
        );
    }, [cardW, gap, flexGap, minGap]);

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

    return [boundsRef, track.width, track.perView, track.gap];
};
