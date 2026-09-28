"use client";

import { ArrowUp, ArrowDown, Plus, Trash } from '@phosphor-icons/react';
import ImageUploader from './ImageUploader';
import { illustrations, getStepIllustration } from '@/lib/rentalProcessIllustrations';

const fieldClass = 'mt-1 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white';
const buttonClass = 'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 text-sm hover:bg-slate-100 disabled:opacity-30 dark:border-slate-700 dark:hover:bg-slate-800';

export default function RentalStepsEditor({ steps = [], onChange }) {
    const update = (index, field, value) => onChange(steps.map((step, i) => i === index ? { ...step, [field]: value } : step));
    const move = (index, offset) => {
        const next = [...steps];
        [next[index], next[index + offset]] = [next[index + offset], next[index]];
        onChange(next);
    };
    return (
        <div className="space-y-5">
            <p className="text-sm text-slate-500">Steps appear in this order on desktop, tablet and mobile. Choose a built-in illustration, upload your own, or select Icon only. Save the page to publish your changes.</p>
            {steps.map((step, index) => (
                <fieldset key={index} className="space-y-4 rounded-xl border border-slate-200 p-5 dark:border-slate-800">
                    <legend className="px-2 font-semibold">Step {index + 1}</legend>
                    <div className="flex flex-wrap gap-2">
                        <button type="button" className={buttonClass} disabled={index === 0} onClick={() => move(index, -1)} aria-label={`Move step ${index + 1} up`}><ArrowUp size={16} /></button>
                        <button type="button" className={buttonClass} disabled={index === steps.length - 1} onClick={() => move(index, 1)} aria-label={`Move step ${index + 1} down`}><ArrowDown size={16} /></button>
                        <button type="button" className={buttonClass} onClick={() => onChange(steps.filter((_, i) => i !== index))}><Trash size={16} /> Remove step</button>
                        <label className="ml-auto flex items-center gap-2 text-sm"><input type="checkbox" checked={Boolean(step.highlight)} onChange={e => update(index, 'highlight', e.target.checked)} /> Yellow highlight</label>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="text-sm font-medium">Title<input className={fieldClass} value={step.title || ''} onChange={e => update(index, 'title', e.target.value)} /></label>
                        <label className="text-sm font-medium">Fallback icon<select className={fieldClass} value={['Laptop','IdentificationCard','ShoppingCart','Package'].includes(step.icon) ? step.icon : ''} onChange={e => update(index, 'icon', e.target.value)}><option value="">Automatic by step</option><option value="Laptop">Laptop</option><option value="IdentificationCard">Identity verification</option><option value="ShoppingCart">Cart and payment</option><option value="Package">Delivery package</option></select></label>
                        <label className="text-sm font-medium md:col-span-2">Description<textarea className={fieldClass} rows={3} value={step.description || ''} onChange={e => update(index, 'description', e.target.value)} /></label>
                        <label className="text-sm font-medium">Optional link<input className={fieldClass} placeholder="/products" value={step.link || ''} onChange={e => update(index, 'link', e.target.value)} /></label>
                        <label className="text-sm font-medium">Image description<input className={fieldClass} placeholder="Describe the image for screen readers" value={step.imageAlt || ''} onChange={e => update(index, 'imageAlt', e.target.value)} /></label>
                        <div className="space-y-3 md:col-span-2">
                            <label className="block text-sm font-medium">Built-in illustration<select className={fieldClass} value={step.illustration || 'auto'} onChange={e => onChange(steps.map((item, i) => i === index ? { ...item, illustration: e.target.value, image: '' } : item))}>
                                <option value="auto">Match the step icon</option>
                                {illustrations.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
                                <option value="none">Icon only</option>
                            </select></label>
                            <ImageUploader label="Step illustration — upload to replace" existingUrl={step.image || getStepIllustration(step)} onUpload={url => update(index, 'image', url)} />
                            {(step.image || getStepIllustration(step)) && <button type="button" className={buttonClass} onClick={() => onChange(steps.map((item, i) => i === index ? { ...item, image: '', illustration: 'none' } : item))}>Remove image and use icon</button>}
                        </div>
                    </div>
                </fieldset>
            ))}
            {!steps.length && <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">No steps. This section will be hidden until you add a step.</p>}
            <button type="button" className={buttonClass} onClick={() => onChange([...steps, { title: 'New step', description: '', icon: '', image: '', imageAlt: '', link: '', highlight: false }])}><Plus size={18} /> Add step</button>
        </div>
    );
}
