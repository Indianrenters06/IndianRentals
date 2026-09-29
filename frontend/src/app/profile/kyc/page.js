'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, ClockIcon, CloudArrowUpIcon, DocumentTextIcon, ExclamationCircleIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { getKYCStatus, saveKYCData, uploadKYCFiles } from '../../../services/kycService';
import { profileTitleClassName } from '../profileTitle';

const INITIAL_DETAILS = {
    name: '', fatherName: '', fatherPhone: '', email: '', phone: '',
    permanentAddress: '', currentAddress: '', city: '', state: '',
    pincode: '', country: 'India'
};

const DOCUMENTS = [
    { key: 'aadharFront', title: 'Aadhaar card', side: 'Front side', description: 'The side with your photograph and name.' },
    { key: 'aadharBack', title: 'Aadhaar card', side: 'Back side', description: 'The side with your address.' },
    { key: 'panCard', title: 'PAN card', side: 'Front side', description: 'Make sure the PAN number is legible.' },
];

const STEPS = [
    { title: 'Personal details', description: 'Your identity and address' },
    { title: 'Documents', description: 'Aadhaar and PAN' },
    { title: 'Review', description: 'Check before submitting' },
];

const inputClass = 'h-12 w-full rounded-xl border border-[#d7d7d7] bg-white px-4 text-[15px] text-[#141414] outline-none transition-colors duration-150 placeholder:text-[#6b6b6b] hover:border-[#969696] focus:border-[#141414] focus:ring-2 focus:ring-[#ffcf46]';
const primaryButtonClass = 'inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#ffcf46] px-6 text-[15px] font-semibold text-[#141414] transition-colors duration-150 hover:bg-[#f3bf35] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414] disabled:cursor-not-allowed disabled:opacity-55';

function validateDetails(details) {
    const next = {};
    const required = {
        name: 'Enter your full name.', fatherName: "Enter your father's name.",
        fatherPhone: "Enter your father's mobile number.", email: 'Enter your email address.',
        phone: 'Enter your mobile number.', permanentAddress: 'Enter your permanent address.',
        city: 'Enter your city.', state: 'Enter your state.', pincode: 'Enter your PIN code.'
    };
    Object.entries(required).forEach(([key, message]) => {
        if (!String(details[key] ?? '').trim()) next[key] = message;
    });
    if (!next.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim())) next.email = 'Enter a valid email address.';
    if (!next.phone && !/^[6-9]\d{9}$/.test(details.phone.replace(/\s/g, ''))) next.phone = 'Enter a valid 10-digit Indian mobile number.';
    if (!next.fatherPhone && !/^[6-9]\d{9}$/.test(details.fatherPhone.replace(/\s/g, ''))) next.fatherPhone = 'Enter a valid 10-digit Indian mobile number.';
    if (!next.pincode && !/^\d{6}$/.test(details.pincode.trim())) next.pincode = 'Enter a valid 6-digit PIN code.';
    return next;
}

function Field({ id, label, value, onChange, error, required = false, ...props }) {
    return (
        <div className="min-w-0">
            <label htmlFor={id} className="mb-2 block text-[14px] font-medium text-[#333333]">
                {label}{required && <span className="ml-1 text-[#bb2b1f]" aria-hidden="true">*</span>}
            </label>
            <input id={id} name={id} value={value ?? ''} onChange={onChange} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} required={required} className={`${inputClass} ${error ? 'border-[#bb2b1f] focus:border-[#bb2b1f] focus:ring-[#f3b5b0]' : ''}`} {...props} />
            {error && <p id={`${id}-error`} role="alert" className="mt-1.5 text-[13px] text-[#a3261c]">{error}</p>}
        </div>
    );
}

function UploadField({ item, file, error, onSelect }) {
    const inputRef = useRef(null);
    const fileLabel = typeof file === 'string' ? 'Previously uploaded document' : file?.name;
    return (
        <div>
            <div className={`rounded-2xl border bg-white p-4 sm:p-5 ${error ? 'border-[#bb2b1f]' : 'border-[#d7d7d7]'}`}>
                <div className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#f6f6f6] text-[#333333]"><DocumentTextIcon className="size-5" aria-hidden="true" /></span>
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline gap-x-2">
                            <h3 className="text-[15px] font-semibold text-[#141414]">{item.title}</h3>
                            <span className="text-[13px] text-[#555555]">{item.side}</span>
                        </div>
                        <p className="mt-1 text-[13px] leading-5 text-[#555555]">{item.description}</p>
                    </div>
                    {file && <CheckIcon className="size-5 shrink-0 text-[#167a3d]" aria-label="Added" />}
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#e8e8e8] pt-4">
                    <div className="min-w-0 flex-1">
                        {file ? <p className="truncate text-[13px] font-medium text-[#333333]" title={fileLabel}>{fileLabel}</p> : <p className="text-[13px] text-[#555555]">JPG, PNG or PDF · up to 10 MB</p>}
                    </div>
                    <input ref={inputRef} id={item.key} type="file" className="sr-only" tabIndex={-1} aria-hidden="true" accept="image/jpeg,image/png,application/pdf" onChange={(event) => { onSelect(item.key, event.target.files?.[0]); event.target.value = ''; }} />
                    <button id={`${item.key}-button`} type="button" aria-label={`${file ? 'Replace' : 'Choose'} ${item.title} ${item.side} file`} aria-describedby={error ? `${item.key}-error` : undefined} onClick={() => inputRef.current?.click()} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#bdbdbd] bg-white px-4 text-[13px] font-semibold text-[#141414] transition-colors hover:border-[#141414] hover:bg-[#f6f6f6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]">
                        <CloudArrowUpIcon className="size-4" aria-hidden="true" />{file ? 'Replace file' : 'Choose file'}
                    </button>
                </div>
            </div>
            {error && <p id={`${item.key}-error`} role="alert" className="mt-1.5 text-[13px] text-[#a3261c]">{error}</p>}
        </div>
    );
}

export default function KYCPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [maxStep, setMaxStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');
    const [kycStatus, setKycStatus] = useState('loading');
    const [kycData, setKycData] = useState(null);
    const [formData, setFormData] = useState({ personalDetails: INITIAL_DETAILS, documents: { aadharFront: null, aadharBack: null, panCard: null } });
    const contentRef = useRef(null);

    useEffect(() => {
        let active = true;
        getKYCStatus().then((data) => {
            if (!active) return;
            const status = String(data?.status || 'not_submitted').toLowerCase();
            setKycData(data);
            setKycStatus(status);
            if (status === 'rejected') {
                setFormData((previous) => ({
                    personalDetails: { ...previous.personalDetails, ...data.personalDetails },
                    documents: { ...previous.documents, ...data.documents }
                }));
            }
        }).catch(() => { if (active) setKycStatus('not_submitted'); });
        return () => { active = false; };
    }, []);

    const changeDetails = (field, value) => {
        setFormData((previous) => ({ ...previous, personalDetails: { ...previous.personalDetails, [field]: value } }));
        setMaxStep(1);
        setErrors((previous) => ({ ...previous, [field]: '' }));
    };

    const selectFile = (field, file) => {
        if (!file) return;
        const nextError = !['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)
            ? 'Choose a JPG, PNG or PDF file.'
            : file.size > 10 * 1024 * 1024 ? 'Choose a file smaller than 10 MB.' : '';
        setErrors((previous) => ({ ...previous, [field]: nextError }));
        if (!nextError) {
            setFormData((previous) => ({ ...previous, documents: { ...previous.documents, [field]: file } }));
            setMaxStep(2);
        }
    };

    const goToStep = (step) => {
        setCurrentStep(step);
        setErrors({});
        setSubmitError('');
        requestAnimationFrame(() => contentRef.current?.focus({ preventScroll: false }));
    };

    const nextStep = () => {
        const nextErrors = currentStep === 1 ? validateDetails(formData.personalDetails)
            : Object.fromEntries(DOCUMENTS.filter(({ key }) => !formData.documents[key]).map(({ key }) => [key, 'Add this document to continue.']));
        setErrors(nextErrors);
        const firstError = Object.keys(nextErrors)[0];
        if (firstError) {
            requestAnimationFrame(() => document.getElementById(currentStep === 2 ? `${firstError}-button` : firstError)?.focus());
            return;
        }
        setMaxStep((previous) => Math.max(previous, currentStep + 1));
        goToStep(currentStep + 1);
    };

    const submit = async () => {
        setLoading(true);
        setSubmitError('');
        try {
            const files = new FormData();
            DOCUMENTS.forEach(({ key }) => {
                if (formData.documents[key] instanceof File) files.append(key, formData.documents[key]);
            });
            const uploadedDocs = [...files.entries()].length ? await uploadKYCFiles(files) : {};
            const saved = await saveKYCData({
                personalDetails: { ...formData.personalDetails, idType: 'Aadhar Card' },
                referenceDetails: {}, documents: uploadedDocs
            });
            setKycData(saved);
            setKycStatus(String(saved?.status || 'pending').toLowerCase());
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            setSubmitError(error.response?.data?.message || 'We could not submit your KYC. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (kycStatus === 'loading') return <div className="flex min-h-64 items-center justify-center" role="status"><span className="size-8 animate-spin rounded-full border-[3px] border-[#dddddd] border-t-[#141414]" /><span className="sr-only">Loading KYC status</span></div>;

    if (kycStatus === 'pending' || kycStatus === 'approved') {
        const approved = kycStatus === 'approved';
        return (
            <section className="mx-auto max-w-[860px] py-6 sm:py-10" aria-labelledby="kyc-status-title">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-[#ffcf46]">{approved ? <CheckIcon className="size-7 text-[#141414]" aria-hidden="true" /> : <ClockIcon className="size-7 text-[#141414]" aria-hidden="true" />}</div>
                <h1 id="kyc-status-title" className={`mt-6 ${profileTitleClassName}`}>{approved ? 'Your KYC is verified' : 'Your KYC is under review'}</h1>
                <p className="mt-3 max-w-[620px] text-[15px] leading-7 text-[#555555]">{approved ? 'Your identity check is complete. Your submitted details are available below.' : 'We have received your details and documents. You can check the status here whenever you need to.'}</p>
                <div className="mt-8 border-t border-[#dddddd] pt-6">
                    <h2 className="text-[18px] font-semibold text-[#141414]">Submitted documents</h2>
                    <ul className="mt-3 divide-y divide-[#e8e8e8]">
                        {DOCUMENTS.map(({ key, title, side }) => <li key={key} className="flex items-center justify-between gap-4 py-4 text-[14px]"><span className="text-[#333333]">{title} · {side}</span><span className="font-medium text-[#555555]">{kycData?.documents?.[key] ? 'Received' : 'Not provided'}</span></li>)}
                    </ul>
                </div>
            </section>
        );
    }

    const details = formData.personalDetails;
    const update = (field) => (event) => changeDetails(field, event.target.value);

    return (
        <section className="pb-12 sm:pb-16" aria-labelledby="kyc-title">
            <header className="pb-7 pt-2 sm:pb-9 sm:pt-4">
                <h1 id="kyc-title" className={profileTitleClassName}>KYC & Documentation</h1>
                <div className="my-4 h-px w-full bg-[#dedede]" aria-hidden="true" />
                <p className="max-w-[580px] text-[15px] leading-6 text-[#555555]">Verify your identity to complete your rental. You can review everything before you submit.</p>
            </header>

            {kycStatus === 'rejected' && <div role="alert" className="mb-7 flex items-start gap-3 rounded-xl border border-[#e9b3ae] bg-[#fff5f3] p-4 text-[#7e211a]"><ExclamationCircleIcon className="mt-0.5 size-5 shrink-0" aria-hidden="true" /><div><p className="font-semibold">Your previous submission needs changes</p><p className="mt-1 text-[14px] leading-6">{kycData?.rejectionReason || 'Please check your details and documents before resubmitting.'}</p></div></div>}

            <div className="grid gap-4 lg:grid-cols-[195px_minmax(0,1fr)] lg:gap-9">
                <aside aria-label="Verification progress" className="lg:pt-1">
                    <p className="mb-3 text-[13px] font-semibold text-[#555555]">Step {currentStep} of {STEPS.length}</p>
                    <div className="mb-5 h-1 overflow-hidden rounded-full bg-[#e8e8e8] lg:hidden"><div className="h-full bg-[#141414] transition-[width] duration-200 motion-reduce:transition-none" style={{ width: `${(currentStep / STEPS.length) * 100}%` }} /></div>
                    <ol className="hidden space-y-1 lg:block">
                        {STEPS.map((step, index) => {
                            const number = index + 1;
                            const active = currentStep === number;
                            const completed = number < maxStep;
                            return <li key={step.title}><button type="button" disabled={number > maxStep} onClick={() => goToStep(number)} aria-current={active ? 'step' : undefined} className={`flex min-h-16 w-full items-start gap-3 rounded-xl px-2 py-2 text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#141414] ${active ? 'bg-[#fff4c6]' : 'hover:bg-[#f6f6f6] disabled:hover:bg-transparent'}`}><span className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border text-[12px] font-semibold ${active ? 'border-[#141414] bg-[#141414] text-white' : completed ? 'border-[#141414] bg-white text-[#141414]' : 'border-[#c9c9c9] text-[#777777]'}`}>{completed && !active ? <CheckIcon className="size-4" aria-hidden="true" /> : number}</span><span><span className={`block text-[14px] font-semibold ${active ? 'text-[#141414]' : 'text-[#555555]'}`}>{step.title}</span><span className="mt-0.5 block text-[12px] leading-4 text-[#666666]">{step.description}</span></span></button></li>;
                        })}
                    </ol>
                    <p className="hidden border-t border-[#e3e3e3] pt-5 text-[13px] leading-5 text-[#555555] lg:mt-6 lg:block"><LockClosedIcon className="mb-2 size-5 text-[#333333]" aria-hidden="true" />Your documents are used for identity verification.</p>
                </aside>

                <div className="min-w-0 overflow-hidden rounded-2xl border border-[#e2e2e2] bg-white">
                    <div ref={contentRef} tabIndex={-1} className="outline-none">
                        <div className="border-b border-[#ededed] px-5 py-6 sm:px-8 sm:py-7">
                            <p className="mb-2 text-[13px] font-medium text-[#666666] lg:hidden">{STEPS[currentStep - 1].title}</p>
                            <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-[#141414] sm:text-[26px]">{currentStep === 1 ? 'Tell us about yourself' : currentStep === 2 ? 'Add your documents' : 'Review your details'}</h2>
                            <p className="mt-1 text-[14px] leading-6 text-[#555555]">{currentStep === 1 ? 'Enter your details as they appear on your identity documents.' : currentStep === 2 ? 'Upload clear copies so our team can check them.' : 'Make sure your information is correct before sending it for verification.'}</p>
                        </div>

                        {currentStep === 1 && <div className="grid gap-x-5 gap-y-5 px-5 py-6 sm:grid-cols-2 sm:px-8 sm:py-8">
                            <div className="sm:col-span-2"><Field id="name" label="Full name" required autoComplete="name" placeholder="As shown on your ID" value={details.name} onChange={update('name')} error={errors.name} /></div>
                            <Field id="fatherName" label="Father's name" required placeholder="Full name" value={details.fatherName} onChange={update('fatherName')} error={errors.fatherName} />
                            <Field id="fatherPhone" label="Father's mobile number" required type="tel" inputMode="numeric" autoComplete="off" maxLength={10} placeholder="10-digit number" value={details.fatherPhone} onChange={update('fatherPhone')} error={errors.fatherPhone} />
                            <Field id="email" label="Email address" required type="email" autoComplete="email" placeholder="you@example.com" value={details.email} onChange={update('email')} error={errors.email} />
                            <Field id="phone" label="Mobile number" required type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={10} placeholder="10-digit number" value={details.phone} onChange={update('phone')} error={errors.phone} />
                            <div className="sm:col-span-2"><Field id="permanentAddress" label="Permanent address" required autoComplete="street-address" placeholder="House number, street and area" value={details.permanentAddress} onChange={update('permanentAddress')} error={errors.permanentAddress} /></div>
                            <div className="sm:col-span-2"><Field id="currentAddress" label="Current address" autoComplete="off" placeholder="If different from your permanent address" value={details.currentAddress} onChange={update('currentAddress')} error={errors.currentAddress} /></div>
                            <Field id="city" label="City" required autoComplete="address-level2" placeholder="City" value={details.city} onChange={update('city')} error={errors.city} />
                            <Field id="state" label="State" required autoComplete="address-level1" placeholder="State" value={details.state} onChange={update('state')} error={errors.state} />
                            <Field id="pincode" label="PIN code" required inputMode="numeric" maxLength={6} autoComplete="postal-code" placeholder="6-digit PIN" value={details.pincode} onChange={update('pincode')} error={errors.pincode} />
                            <Field id="country" label="Country" value={details.country} onChange={update('country')} autoComplete="country-name" />
                        </div>}

                        {currentStep === 2 && <div className="space-y-4 px-5 py-6 sm:px-8 sm:py-8">{DOCUMENTS.map((item) => <UploadField key={item.key} item={item} file={formData.documents[item.key]} error={errors[item.key]} onSelect={selectFile} />)}<p className="text-[13px] leading-5 text-[#555555]">Check that all corners are visible and the text is readable. You can replace a file before submitting.</p></div>}

                        {currentStep === 3 && <div className="space-y-7 px-5 py-6 sm:px-8 sm:py-8">
                            <div><div className="flex items-center justify-between gap-3"><h3 className="text-[17px] font-semibold text-[#141414]">Personal details</h3><button type="button" onClick={() => goToStep(1)} className="min-h-11 text-[13px] font-semibold text-[#333333] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-[#141414]">Edit</button></div><dl className="mt-2 grid gap-x-5 gap-y-4 border-t border-[#e8e8e8] pt-4 text-[14px] sm:grid-cols-2">{[['Full name', details.name], ['Email', details.email], ['Mobile number', details.phone], ['Father’s name', details.fatherName], ['Father’s mobile', details.fatherPhone], ['Permanent address', details.permanentAddress], ['Current address', details.currentAddress || 'Not provided'], ['City and state', `${details.city}, ${details.state}`], ['PIN code', details.pincode]].map(([label, value]) => <div key={label} className="min-w-0"><dt className="text-[#666666]">{label}</dt><dd className="mt-1 break-words font-medium text-[#141414]">{value}</dd></div>)}</dl></div>
                            <div><div className="flex items-center justify-between gap-3"><h3 className="text-[17px] font-semibold text-[#141414]">Documents</h3><button type="button" onClick={() => goToStep(2)} className="min-h-11 text-[13px] font-semibold text-[#333333] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-[#141414]">Edit</button></div><ul className="mt-2 divide-y divide-[#e8e8e8] border-t border-[#e8e8e8]">{DOCUMENTS.map(({ key, title, side }) => <li key={key} className="flex items-center gap-3 py-3 text-[14px]"><CheckIcon className="size-4 shrink-0 text-[#167a3d]" aria-hidden="true" /><span className="min-w-0 truncate text-[#333333]">{title} · {side}</span></li>)}</ul></div>
                            {submitError && <p role="alert" className="rounded-xl bg-[#fff5f3] p-4 text-[14px] text-[#a3261c]">{submitError}</p>}
                        </div>}

                        <div className="flex flex-col-reverse gap-3 border-t border-[#ededed] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                            {currentStep > 1 ? <button type="button" onClick={() => goToStep(currentStep - 1)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-4 text-[14px] font-semibold text-[#333333] transition-colors hover:bg-[#f6f6f6] focus-visible:outline-2 focus-visible:outline-[#141414]"><ArrowLeftIcon className="size-4" aria-hidden="true" />Back</button> : <span className="hidden sm:block" />}
                            <button type="button" onClick={currentStep === 3 ? submit : nextStep} disabled={loading} className={`${primaryButtonClass} w-full sm:w-auto`}>
                                {loading ? 'Submitting…' : currentStep === 3 ? 'Submit for verification' : currentStep === 2 ? 'Review details' : 'Continue to documents'}{!loading && <ArrowRightIcon className="size-4" aria-hidden="true" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
