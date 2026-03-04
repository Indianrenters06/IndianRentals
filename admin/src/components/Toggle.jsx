'use client';

/**
 * Toggle — A clean, accessible pill-style toggle switch.
 * Drop-in replacement for HeroUI <Switch> in all CMS pages.
 *
 * Props:
 *   isSelected   {boolean}  — current on/off state
 *   onValueChange {fn}      — called with new boolean when toggled
 *   size         {string}   — 'sm' | 'md' (default 'md')
 *   children     {node}     — optional label text rendered to the right
 */
export default function Toggle({ isSelected = false, onValueChange, size = 'md', children }) {
    const isSmall = size === 'sm';

    const trackW = isSmall ? 'w-9' : 'w-12';
    const trackH = isSmall ? 'h-5' : 'h-6';
    const thumbSz = isSmall ? 'w-3.5 h-3.5' : 'w-4.5 h-4.5';
    /* translate-x values: small = 16px off / 0 on, md = 24px off / 0 on */
    const thumbOn = isSmall ? 'translate-x-4' : 'translate-x-6';
    const thumbOff = 'translate-x-0.5';

    return (
        <button
            type="button"
            role="switch"
            aria-checked={isSelected}
            onClick={() => onValueChange?.(!isSelected)}
            className="group inline-flex items-center gap-2 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-full"
        >
            {/* Track */}
            <span
                className={`
          relative inline-flex shrink-0 items-center
          ${trackW} ${trackH}
          rounded-full border-2 border-transparent
          transition-colors duration-200 ease-in-out
          ${isSelected
                        ? 'bg-emerald-500 shadow-[0_0_0_3px_rgba(34,197,94,0.15)]'
                        : 'bg-slate-300 dark:bg-slate-600'}
        `}
            >
                {/* Thumb */}
                <span
                    className={`
            pointer-events-none inline-block
            ${thumbSz}
            rounded-full bg-white
            shadow-md ring-0
            transform transition-transform duration-200 ease-in-out
            ${isSelected ? thumbOn : thumbOff}
          `}
                />
            </span>

            {/* Optional label */}
            {children && (
                <span className="text-xs text-slate-500 dark:text-slate-400 leading-none">
                    {children}
                </span>
            )}
        </button>
    );
}
