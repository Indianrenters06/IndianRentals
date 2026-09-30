'use client';

import { useId } from 'react';

export default function BannerAppearanceControls({ data, set, defaultColor = '#f6f6f6' }) {
    const id = useId();
    const color = data.bannerBackground || '';
    const valid = /^#[\da-f]{6}$/i.test(color);
    return <fieldset className="space-y-4 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <legend className="px-1 text-sm font-semibold text-slate-800 dark:text-slate-100">Banner appearance</legend>
        <label className="flex items-center gap-3 text-sm text-slate-800 dark:text-slate-100">
            <input type="checkbox" checked={data.bannerShowText !== false} onChange={e => set('bannerShowText', e.target.checked)} className="h-4 w-4 accent-indigo-600" />
            Show text over the banner image
        </label>
        <div>
            <label htmlFor={`${id}-color`} className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-200">Banner container background</label>
            <div className="flex flex-wrap items-center gap-3">
                <input aria-label="Choose banner container background colour" type="color" value={valid ? color : defaultColor} onChange={e => set('bannerBackground', e.target.value)} className="h-10 w-12 cursor-pointer rounded border border-slate-200 bg-transparent p-1" />
                <input id={`${id}-color`} value={color} onChange={e => set('bannerBackground', e.target.value)} placeholder={defaultColor.toUpperCase()} maxLength={7} aria-invalid={!!color && !valid} aria-describedby={`${id}-hint`} className="h-10 w-36 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 text-sm text-slate-900 dark:text-white" />
                <button type="button" onClick={() => set('bannerBackground', '')} className="text-sm underline underline-offset-4 text-slate-700 dark:text-slate-200">Use page default</button>
            </div>
            <p id={`${id}-hint`} className={`mt-2 text-xs ${color && !valid ? 'text-red-600' : 'text-slate-500 dark:text-slate-400'}`}>{color && !valid ? 'Enter a six-digit hex colour, such as #ffcf46.' : `Page default: ${defaultColor.toUpperCase()}. Changes the container above and around the image.`}</p>
        </div>
    </fieldset>;
}
