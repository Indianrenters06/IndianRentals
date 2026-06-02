"use client";

import { ArrowsDownUp } from "@phosphor-icons/react";

/**
 * Reusable sort dropdown matching the Orders page style.
 *
 * Usage:
 *   <SortSelect
 *      options={[{ value: "createdAt:descending", label: "Newest first" }, ...]}
 *      value={`${sortCol}:${sortDir}`}
 *      onChange={(col, dir) => { setSortCol(col); setSortDir(dir); }}
 *   />
 *
 * The option `value` must be in the form "column:direction" where direction is
 * "ascending" or "descending". onChange receives (column, direction).
 */
export default function SortSelect({ options, value, onChange, className = "", ariaLabel = "Sort" }) {
    return (
        <div className={`relative ${className}`}>
            <ArrowsDownUp
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <select
                aria-label={ariaLabel}
                value={value}
                onChange={(e) => {
                    const [col, dir] = e.target.value.split(":");
                    onChange(col, dir);
                }}
                className="h-10 pl-9 pr-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30 shadow-sm cursor-pointer appearance-none"
            >
                {options.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))}
            </select>
        </div>
    );
}
