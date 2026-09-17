/**
 * Centralized motion tokens and Framer Motion variants.
 * Guarantees uniform timing curves, durations, and micro-interactions across the entire application.
 */

// Timing curves
export const EASINGS = {
    easeOut: [0.16, 1, 0.3, 1], // Apple-style smooth decelerate
    easeInOut: [0.4, 0, 0.2, 1],
    sharp: [0.4, 0, 0.6, 1],
};

// Durations (in seconds)
export const DURATIONS = {
    fast: 0.15,   // 150ms - micro-interactions, clicks, toggles
    normal: 0.2,  // 200ms - dropdowns, tooltips, list items
    medium: 0.25, // 250ms - modals, drawers, card hover expansions
    slow: 0.35,   // 350ms - full-page sections, banners
};

// Fade In
export const fadeInVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: DURATIONS.fast, ease: "easeOut" } },
    exit: { opacity: 0, transition: { duration: DURATIONS.fast, ease: "easeIn" } },
};

// Subtle Slide Up (for cards, page content)
export const slideUpVariants = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: DURATIONS.normal, ease: EASINGS.easeOut } },
    exit: { opacity: 0, y: -8, transition: { duration: DURATIONS.fast, ease: "easeIn" } },
};

// Dialog & Modal Entrance
export const modalVariants = {
    initial: { opacity: 0, scale: 0.96, y: 8 },
    animate: { opacity: 1, scale: 1, y: 0, transition: { duration: DURATIONS.medium, ease: EASINGS.easeOut } },
    exit: { opacity: 0, scale: 0.96, y: 8, transition: { duration: DURATIONS.fast, ease: "easeIn" } },
};

// Dropdown / Popover Entrance
export const dropdownVariants = {
    initial: { opacity: 0, y: 6, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: DURATIONS.fast, ease: EASINGS.easeOut } },
    exit: { opacity: 0, y: 4, scale: 0.98, transition: { duration: DURATIONS.fast, ease: "easeIn" } },
};

// Overlay Backdrop
export const backdropVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: DURATIONS.normal } },
    exit: { opacity: 0, transition: { duration: DURATIONS.fast } },
};

// Stagger Container
export const staggerContainer = (staggerChildren = 0.05, delayChildren = 0) => ({
    initial: {},
    animate: {
        transition: {
            staggerChildren,
            delayChildren,
        },
    },
});
