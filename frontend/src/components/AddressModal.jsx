'use client';

import { lockBodyScroll } from '../lib/bodyScrollLock.mjs';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { House, MapPin, X } from '@phosphor-icons/react';

const emptyForm = {
    name: '', addressLine: '', city: '', state: '', pincode: '', country: 'India', phone: '', isBillingSame: false,
};

function validate(data) {
    const errors = {};
    if (!data.name.trim()) errors.name = 'Enter the recipient’s full name.';
    if (!data.addressLine.trim()) errors.addressLine = 'Enter the street address.';
    if (!data.city.trim()) errors.city = 'Enter the city.';
    if (!data.state.trim()) errors.state = 'Enter the state.';
    if (!/^\d{6}$/.test(data.pincode.trim())) errors.pincode = 'Enter a 6-digit PIN code.';
    if (!data.country.trim()) errors.country = 'Enter the country.';
    if (!/^\d{10}$/.test(data.phone.replace(/\s+/g, ''))) errors.phone = 'Enter a 10-digit phone number.';
    return errors;
}

export default function AddressModal(props) {
    if (!props.isOpen) return null;
    return <AddressForm key={props.initialData?._id || 'new'} {...props} />;
}

function AddressForm({ onClose, onSave, initialData, isSubmitting = false, saveError = '' }) {
    const [formData, setFormData] = useState(() => ({ ...emptyForm, ...initialData }));
    const [errors, setErrors] = useState({});
    const dialogRef = useRef(null);
    const firstFieldRef = useRef(null);
    useEffect(() => {
        const previousFocus = document.activeElement;
        const unlockScroll = lockBodyScroll();
        firstFieldRef.current?.focus();
        return () => {
            unlockScroll();
            previousFocus?.focus?.();
        };
    }, []);

    useEffect(() => {
        const onKeyDown = event => {
            if (event.key === 'Escape' && !isSubmitting) onClose();
            if (event.key !== 'Tab') return;
            const focusables = [...dialogRef.current.querySelectorAll('button:not([disabled]), input:not([disabled])')];
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [onClose, isSubmitting]);

    function change(event) {
        const { name, value, checked, type } = event.target;
        setFormData(current => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
        setErrors(current => ({ ...current, [name]: undefined }));
    }

    function submit(event) {
        event.preventDefault();
        if (isSubmitting) return;
        const next = validate(formData);
        setErrors(next);
        if (Object.keys(next).length) {
            document.getElementById(`address-${Object.keys(next)[0]}`)?.focus();
            return;
        }
        onSave(formData);
    }

    const fields = [
        ['name', 'Full name', 'Recipient’s full name', 'text', 'name'],
        ['phone', 'Mobile number', '10-digit mobile number', 'tel', 'tel-national'],
        ['addressLine', 'Street address', 'House number, building and street', 'text', 'street-address'],
        ['city', 'City', 'City', 'text', 'address-level2'],
        ['state', 'State', 'State', 'text', 'address-level1'],
        ['pincode', 'PIN code', '6-digit PIN', 'text', 'postal-code'],
        ['country', 'Country', 'Country', 'text', 'country-name'],
    ];

    return <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#141414]/60 p-0 sm:items-center sm:p-5" onMouseDown={event => { if (event.target === event.currentTarget && !isSubmitting) onClose(); }}>
        <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="address-dialog-title" className="flex max-h-[96dvh] w-full max-w-[660px] flex-col overflow-hidden rounded-t-[24px] bg-white shadow-[0_24px_80px_rgba(0,0,0,.25)] sm:max-h-[min(92dvh,820px)] sm:rounded-[24px]">
            <div className="relative isolate flex min-h-[190px] items-start justify-between gap-5 overflow-hidden bg-[#141414] px-6 py-6 text-white sm:px-8 sm:py-7">
                <Image src="/images/address-delivery-editorial.png" alt="" fill sizes="(max-width: 660px) 100vw, 660px" className="-z-20 object-cover object-center" priority />
                <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-[#141414]/95 via-[#141414]/80 to-[#141414]/45" />
                <div className="max-w-[450px]">
                    <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#ffcf46] text-[#141414]"><House size={22} weight="regular" aria-hidden="true" /></span>
                    <h2 id="address-dialog-title" className="text-[26px] font-semibold leading-tight tracking-[-.03em] sm:text-[30px]">{initialData ? 'Edit your address' : 'Add a delivery address'}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-white/70">We’ll use these details to deliver your rental.</p>
                </div>
                <button type="button" onClick={onClose} disabled={isSubmitting} aria-label="Close address form" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/30 text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffcf46] disabled:opacity-50"><X size={20} aria-hidden="true" /></button>
            </div>
            <form onSubmit={submit} noValidate className="overflow-y-auto overscroll-contain">
                <div className="grid gap-x-5 gap-y-5 px-6 py-6 sm:grid-cols-2 sm:px-8">
                    <div className="sm:col-span-2 flex items-center gap-2 border-b border-[#e2e2e2] pb-2 text-sm font-semibold text-[#333]"><MapPin size={18} aria-hidden="true" /> Delivery details</div>
                    {fields.map(([name, label, placeholder, type, autoComplete], index) => <div key={name} className={name === 'addressLine' ? 'sm:col-span-2' : ''}>
                        <label htmlFor={`address-${name}`} className="mb-2 block text-sm font-medium text-[#333]">{label} <span aria-hidden="true" className="text-[#b14413]">*</span></label>
                        <input ref={index === 0 ? firstFieldRef : undefined} id={`address-${name}`} name={name} type={type} autoComplete={autoComplete}
                            inputMode={name === 'phone' || name === 'pincode' ? 'numeric' : undefined} maxLength={name === 'phone' ? 10 : name === 'pincode' ? 6 : undefined}
                            value={formData[name] || ''} onChange={change} placeholder={placeholder} aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `address-${name}-error` : undefined}
                            className={`h-12 w-full rounded-lg border px-4 text-base text-[#141414] outline-none transition-colors placeholder:text-[#777] focus:border-[#141414] focus:ring-2 focus:ring-[#ffcf46] ${errors[name] ? 'border-[#b14413]' : 'border-[#cbcbcb]'}`} />
                        {errors[name] && <p id={`address-${name}-error`} className="mt-1.5 text-sm text-[#b14413]">{errors[name]}</p>}
                    </div>)}
                    <label className="flex items-center gap-3 text-sm text-[#333] sm:col-span-2">
                        <input type="checkbox" name="isBillingSame" checked={Boolean(formData.isBillingSame)} onChange={change} className="h-5 w-5 shrink-0 accent-[#141414]" />
                        Billing address is the same as delivery address
                    </label>
                </div>
                <div className="sticky bottom-0 border-t border-[#e2e2e2] bg-white px-6 py-4 sm:px-8">
                    {saveError && <p role="alert" className="mb-3 rounded-xl bg-[#fff1e8] px-4 py-3 text-sm text-[#9a3515]">{saveError}</p>}
                    <div className="flex items-center gap-3">
                        <button type="button" onClick={onClose} disabled={isSubmitting} className="flex min-h-12 flex-1 items-center justify-center rounded-full border border-[#cbcbcb] px-5 text-sm font-semibold text-[#333] hover:border-[#141414] disabled:opacity-50">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="flex min-h-12 flex-[1.7] items-center justify-center rounded-full bg-[#ffcf46] px-5 text-sm font-semibold text-[#141414] hover:bg-[#f5bf27] disabled:opacity-60">{isSubmitting ? 'Saving address…' : initialData ? 'Save changes' : 'Save address'}</button>
                    </div>
                </div>
            </form>
        </div>
    </div>;
}
