"use client";
import { useState, useEffect, useRef } from "react";

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
 */
export const useWholeCardTrack = (cardW, gap) => {
    const boundsRef = useRef(null);
    const [track, setTrack] = useState({ width: null, perView: 1 });

    useEffect(() => {
        const el = boundsRef.current;
        if (!el) return;
        const measure = () => {
            const available = el.clientWidth;
            if (!available) return;
            const perView = Math.max(1, Math.floor((available + gap) / (cardW + gap)));
            setTrack({ width: perView * (cardW + gap) - gap, perView });
        };
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        return () => ro.disconnect();
    }, [cardW, gap]);

    return [boundsRef, track.width, track.perView];
};
