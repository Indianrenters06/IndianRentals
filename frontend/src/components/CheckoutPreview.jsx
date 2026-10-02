'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { ArrowRight, ArrowLeft, Check, Clock, CreditCard, QrCode, Bank, LockKey, Receipt, Truck, FileText, UploadSimple } from '@phosphor-icons/react';
import CheckoutHeader from './CheckoutHeader';
import AddressModal from './AddressModal';
import CheckoutAddressPicker from './CheckoutAddressPicker';
import { getAddresses } from '@/services/addressService';
import kycStyles from './KYCExperience.module.css';
import s from './CheckoutPreview.module.css';
import { selectCartItems, selectCartTotals } from '@/redux/features/cartSlice';
import { getProductById } from '@/services/productService';
import { previewMoney as money, previewPaymentAmounts } from '@/lib/checkoutPreviewModel.mjs';

const SCENARIOS = [['address', 'Delivery address'], ['advance', 'Booking advance'], ['received', 'Advance received'], ['verification', 'KYC form'], ['pending', 'KYC under review'], ['rejected', 'KYC needs changes'], ['approved', 'KYC approved'], ['balance', 'Balance payment'], ['complete', 'Payment complete'], ['booking', 'My booking']];
const COPY = {
    address: ['Where should we deliver?', 'Choose your delivery address before paying your booking advance.'],
    advance: ['Start your booking', 'Pay a 10% advance now. Complete verification, then review and pay your remaining balance.'],
    received: ['Booking advance received', 'Complete your identity verification next. Your advance will be deducted from your final bill.'],
    verification: ['Verify your identity', 'Add your details, a reference, and your documents for review.'],
    pending: ['Your KYC is under review', 'Your advance has been received. Balance payment becomes available after verification.'],
    rejected: ['Your submission needs changes', 'Update the document requested below and resubmit your details.'],
    approved: ['Your KYC is verified', 'Review your final bill and pay the remaining balance to complete your booking.'],
    balance: ['Complete your payment', 'Your booking advance has been deducted. Review the final breakdown before paying.'],
    complete: ['Payment complete', 'Your next step is delivery scheduling. Check your booking for updates.'],
    booking: ['Your booking', 'See what you have paid and the next step for your rental.'],
};
const PERSONAL = [['name', 'Full name', 'text'], ['phone', 'Mobile number', 'tel'], ['email', 'Email address', 'email'], ['address', 'Current address', 'text']];
const REFERENCE = [['referenceName', 'Reference name', 'text'], ['relationship', 'Relationship', 'text'], ['referencePhone', 'Reference mobile number', 'tel'], ['referenceAddress', 'Reference address', 'text']];
const DOCUMENTS = ['Aadhaar · front side', 'Aadhaar · back side', 'PAN card'];
const KYC_STEPS = ['Personal details', 'Reference', 'Documents', 'Review'];
const EMPTY_LEDGER = { advancePaid: false, kyc: 'not-submitted', balancePaid: false };
function scenarioLedger(stage) {
    if (['address', 'advance'].includes(stage)) return { ...EMPTY_LEDGER };
    return { advancePaid: true, balancePaid: stage === 'complete', kyc: ['approved', 'balance', 'complete'].includes(stage) ? 'approved' : stage === 'rejected' ? 'rejected' : ['verification', 'received'].includes(stage) ? 'not-submitted' : 'pending' };
}
function previewAddress(value) {
    if (!value || typeof value !== 'object' || !String(value.addressLine || value.address || '').trim()) return null;
    return { ...value, _id: value._id || value.id || 'preview-selected-address', name: value.name || '', phone: value.phone || '', addressLine: value.addressLine || value.address, pincode: value.pincode || value.postalCode || '', city: value.city || '', state: value.state || '', country: value.country || 'India' };
}
function StatusMark({ type }) {
    if (['success', 'rejected'].includes(type)) return <div className={`${kycStyles.statusBadge} ${type === 'success' ? kycStyles.verifiedBadge : kycStyles.rejectedBadge}`} aria-hidden="true"><span className={type === 'success' ? kycStyles.verifiedCheck : kycStyles.rejectedCross} /></div>;
    return <span className={s.statusIcon} aria-hidden="true">{type === 'receipt' ? <Receipt /> : <Clock />}</span>;
}

export default function CheckoutPreview() {
    const items = useSelector(selectCartItems);
    const totals = useSelector(selectCartTotals);
    const [example, setExample] = useState(null);
    const [loadError, setLoadError] = useState(false);
    const [stage, setStage] = useState('address');
    const [ledger, setLedger] = useState(EMPTY_LEDGER);
    const [kycStep, setKycStep] = useState(0);
    const [fields, setFields] = useState({});
    const [documents, setDocuments] = useState({});
    const [method, setMethod] = useState('upi');
    const [paymentFailed, setPaymentFailed] = useState(false);
    const [adjustment, setAdjustment] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [addressModalOpen, setAddressModalOpen] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [addressLoadError, setAddressLoadError] = useState(false);
    const [address, setAddress] = useState(null);
    const [ready, setReady] = useState(false);
    const [bookingSnapshot, setBookingSnapshot] = useState(null);
    const kycHeadingRef = useRef(null);
    const headingRef = useRef(null);

    useEffect(() => {
        let active = true;
        if (!items.length) getProductById('697f5f7934195cb8014c8dbf').then(product => { if (active) setExample(product); }).catch(() => { if (active) setLoadError(true); });
        return () => { active = false; };
    }, [items.length]);
    useEffect(() => {
        let active = true;
        queueMicrotask(() => {
            if (!active) return;
            try {
                const saved = JSON.parse(sessionStorage.getItem('irCheckoutDesignPreview') || 'null');
                if (SCENARIOS.some(([key]) => key === saved?.stage)) {
                    setStage(saved.stage);
                    setLedger({ ...scenarioLedger(saved.stage), ...saved.ledger });
                    setAdjustment(Boolean(saved.adjustment));
                    setBookingSnapshot(saved.bookingSnapshot || null);
                    setFields(saved.fields || {});
                    setAddress(previewAddress(saved.address));
                    setAddresses(Array.isArray(saved.addresses) ? saved.addresses.map(previewAddress).filter(Boolean) : []);
                    setDocuments(saved.documents || {});
                    setKycStep(Number.isInteger(saved.kycStep) ? Math.max(0, Math.min(3, saved.kycStep)) : 0);
                }
            } catch { /* Storage is optional. */ }
            try {
                const storedAddress = previewAddress(JSON.parse(localStorage.getItem('shippingAddress') || 'null'));
                if (storedAddress) setAddress(current => current || storedAddress);
            } catch { /* Invalid stored addresses are ignored. */ }
            setReady(true);
        });
        return () => { active = false; };
    }, []);
    useEffect(() => {
        if (ready) { try { sessionStorage.setItem('irCheckoutDesignPreview', JSON.stringify({ stage, ledger, adjustment, bookingSnapshot, fields, address, addresses, documents, kycStep })); } catch { /* Storage is optional. */ } }
    }, [stage, ledger, adjustment, bookingSnapshot, fields, address, addresses, documents, kycStep, ready]);

    useEffect(() => {
        if (!ready) return;
        let active = true;
        getAddresses().then(list => {
            if (!active) return;
            const saved = list.map(previewAddress).filter(Boolean);
            setAddresses(current => [...current, ...saved.filter(item => !current.some(existing => existing._id === item._id))]);
            setAddress(current => current || saved.find(item => item.isDefault) || saved[0] || null);
        }).catch(() => { if (active) setAddressLoadError(true); });
        return () => { active = false; };
    }, [ready]);
    useEffect(() => {
        if (!address) return;
        let active = true;
        queueMicrotask(() => {
            if (active) setFields(current => ({ ...current, name: address.name, phone: address.phone, address: [address.addressLine, address.city, address.state].filter(Boolean).join(', '), pincode: address.pincode }));
        });
        return () => { active = false; };
    }, [address]);
    const addressChoices = address && !addresses.some(item => item._id === address._id) ? [address, ...addresses] : addresses;
    const openAddressModal = selected => { setEditingAddress(selected || null); setAddressModalOpen(true); };
    const removePreviewAddress = selected => {
        if (!window.confirm(`Remove the address for ${selected.name} from this preview?`)) return;
        const remaining = addressChoices.filter(item => item._id !== selected._id);
        setAddresses(remaining);
        if (address?._id === selected._id) setAddress(remaining.find(item => item.isDefault) || remaining[0] || null);
    };
    const savePreviewAddress = value => {
        const saved = previewAddress({ ...value, _id: editingAddress?._id || `preview-${Date.now()}` });
        setAddresses(current => [...current.filter(item => item._id !== saved._id), saved]);
        setAddress(saved);
        setAddressModalOpen(false);
        setEditingAddress(null);
    };

    const cartItem = items[0];
    const currentProduct = cartItem || example;
    const currentQuote = cartItem ? { rent: totals.monthlyRentTotal, deposit: totals.securityAmount, delivery: totals.deliveryCharges, tax: totals.totalGST, discount: totals.couponDiscount }
        : { rent: example?.rentalPrice || 0, deposit: example?.securityDeposit || 0, delivery: example ? 400 : 0, tax: Math.round((example?.rentalPrice || 0) * 0.18), discount: 0 };
    const product = bookingSnapshot?.product || currentProduct;
    const quote = bookingSnapshot?.quote || currentQuote;
    const sampleQuote = bookingSnapshot ? bookingSnapshot.sample : !cartItem;
    const term = bookingSnapshot?.term || cartItem?.duration || 1;
    const snapshotBooking = () => ({ quote: currentQuote, product: { name: currentProduct?.name, image: currentProduct?.image || currentProduct?.images?.[0] }, term: cartItem?.duration || 1, sample: !cartItem });
    const finalBill = ['approved', 'balance', 'complete'].includes(stage) || (stage === 'booking' && ledger.kyc === 'approved');
    const deliveryAdjustment = adjustment && finalBill ? 200 : 0;
    const amounts = previewPaymentAmounts(quote, deliveryAdjustment);
    const canPay = Boolean(product) && amounts.estimatedTotal > 0;
    const index = ledger.balancePaid ? 4 : stage === 'address' ? 0 : ['advance', 'received'].includes(stage) ? 1 : ['verification', 'pending', 'rejected', 'approved'].includes(stage) ? 2 : ledger.kyc === 'approved' ? 3 : 2;
    const [title, description] = COPY[stage];
    const go = next => {
        setStage(next); setPaymentFailed(false);
        requestAnimationFrame(() => { headingRef.current?.focus(); headingRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' }); });
    };
    const chooseScenario = next => { setBookingSnapshot(['address', 'advance'].includes(next) ? null : currentProduct ? snapshotBooking() : null); setLedger(scenarioLedger(next)); if (next === 'verification') setKycStep(0); go(next); };
    const useExample = () => {
        setFields({ name: 'Example customer', phone: '9000000000', email: 'customer@example.com', address: 'Example delivery address', pincode: '110001', referenceName: 'Example reference', relationship: 'Parent', referencePhone: '9000000001', referenceAddress: 'Example reference address' });
        setAddress(previewAddress({ name: 'Example customer', phone: '9000000000', addressLine: 'Example delivery address', city: 'Delhi', state: 'Delhi', pincode: '110001' }));
        setDocuments(Object.fromEntries(DOCUMENTS.map(label => [label, 'Example document selected'])));
    };
    const reset = () => { setLedger({ ...EMPTY_LEDGER }); setBookingSnapshot(null); setFields({}); setDocuments({}); setAddress(null); setAddresses([]); setEditingAddress(null); setAddressModalOpen(false); setKycStep(0); setAdjustment(false); go('address'); };
    const simulatePayment = balance => { if (!balance) setBookingSnapshot(snapshotBooking()); setLedger(current => ({ ...current, ...(balance ? { balancePaid: true } : { advancePaid: true }) })); go(balance ? 'complete' : 'received'); };
    const submitKyc = event => { event.preventDefault(); if (kycStep < 3) { setKycStep(current => current + 1); requestAnimationFrame(() => { kycHeadingRef.current?.focus(); kycHeadingRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' }); }); } else { setLedger(current => ({ ...current, kyc: 'pending' })); go('pending'); } };
    const nextFromBooking = () => {
        if (ledger.balancePaid) go('complete');
        else if (ledger.kyc === 'approved') go('balance');
        else if (ledger.kyc === 'rejected') { setKycStep(2); go('verification'); }
        else if (ledger.kyc === 'pending') go('pending');
        else go('verification');
    };
    const actionLabel = stage === 'address' ? 'Continue to advance' : stage === 'advance' ? `Pay advance ${money(amounts.advance)}` : stage === 'received' ? 'Complete KYC' : stage === 'verification' ? (kycStep === 3 ? 'Submit for verification' : 'Continue') : stage === 'rejected' ? 'Update and resubmit' : stage === 'approved' ? 'Review final bill' : stage === 'balance' ? `Pay balance ${money(amounts.balance)}` : stage === 'booking' ? ledger.balancePaid ? 'View delivery status' : ledger.kyc === 'approved' ? 'Pay remaining balance' : ledger.kyc === 'rejected' ? 'Update your KYC' : ledger.kyc === 'pending' ? 'View verification status' : 'Complete KYC' : 'View booking';
    const performAction = () => {
        if (stage === 'address') { if (address) go('advance'); else openAddressModal(); }
        else if (stage === 'advance') simulatePayment(false);
        else if (stage === 'balance') simulatePayment(true);
        else if (stage === 'verification') document.getElementById('preview-kyc-form')?.requestSubmit();
        else if (stage === 'received') go('verification');
        else if (stage === 'rejected') { setKycStep(2); go('verification'); }
        else if (stage === 'approved') go('balance');
        else if (stage === 'booking') nextFromBooking();
        else go('booking');
    };
    const disabled = !canPay || (stage === 'verification' && kycStep === 2 && !DOCUMENTS.every(label => documents[label]));
    const dueLabel = ledger.balancePaid ? 'Balance due' : ['advance', 'address'].includes(stage) ? 'Booking advance · 10%' : finalBill ? 'Balance to pay' : 'Advance paid';
    const dueAmount = ledger.balancePaid ? 0 : ['advance', 'address'].includes(stage) ? amounts.advance : finalBill ? amounts.balance : amounts.advance;
    const action = <button type="button" className={s.primaryButton} onClick={performAction} disabled={disabled}>{actionLabel}<ArrowRight size={18} aria-hidden="true" /></button>;
    const renderFields = definitions => <div className={s.fieldGrid}>{definitions.map(([key, label, type]) => <label key={key} className={s.field}>{label}<input className={s.input} type={type} value={fields[key] || ''} required autoComplete="off" maxLength={type === 'tel' ? 10 : 200} pattern={type === 'tel' ? '[0-9]{10}' : key === 'pincode' ? '[0-9]{6}' : undefined} placeholder={type === 'tel' ? '10-digit mobile number' : label} onChange={event => setFields(current => ({ ...current, [key]: event.target.value }))} /></label>)}</div>;
    const methods = <div className={s.methods} role="radiogroup" aria-label="Payment method">{[['upi', 'UPI', QrCode], ['card', 'Debit or credit card', CreditCard], ['bank', 'Net banking', Bank]].map(([value, label, Icon]) => <label className={s.method} key={value}>
        <input className={s.methodInput} type="radio" name="preview-payment-method" value={value} checked={method === value} onChange={() => setMethod(value)} />
        <span className={s.methodCheck} aria-hidden="true">{method === value && <Image src="/images/checkout-address/payment-selected.svg" width={14} height={14} alt="" />}</span>
        <span className={s.methodIcon}><Icon size={22} aria-hidden="true" /></span>
        <span className={s.methodLabel}>{label}</span>
    </label>)}</div>;
    const rows = [['First month rent', quote.rent], ['GST', quote.tax], ['Refundable security deposit', quote.deposit], ['Delivery', quote.delivery + deliveryAdjustment], ...(quote.discount ? [['Coupon discount', -quote.discount]] : [])];

    return <>
        <CheckoutHeader stepLabels={['Address', 'Advance', 'Verification', 'Balance']} activeStep={index} />
        <main className={s.page}>
            <div className={s.container}>
                <div className={s.previewBar} aria-label="Design preview controls">
                    <div><span className={s.previewLabel}>Checkout design preview</span><p className={s.summaryNote}>Simulated payments and verification. No order is placed.</p></div>
                    <div className={s.previewTools}>
                        <select className={s.previewSelect} aria-label="Preview screen" value={stage} onChange={event => chooseScenario(event.target.value)}>{SCENARIOS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
                        <button className={s.textLink} type="button" onClick={useExample}>Use example details</button>
                        <button className={s.textLink} type="button" onClick={reset}>Reset</button>
                        <Link className={s.textLink} href="/checkout/staged?new=1">Go to checkout</Link>
                        <Link className={s.textLink} href="/checkout/legacy/cart">Original checkout backup</Link>
                    </div>
                </div>
                <header className={s.intro}><h1 className={s.title} tabIndex={-1} ref={headingRef}>{title}</h1><p className={s.description}>{description}</p></header>
                <div className={s.layout}>
                    <div className={s.main}>
                        {stage === 'address' && <CheckoutAddressPicker addresses={addressChoices} selectedId={address?._id} onSelect={setAddress} onAdd={() => openAddressModal()} onEdit={openAddressModal} onDelete={removePreviewAddress}>
                            {addressLoadError && <p role="status" className={s.helper}>Saved addresses could not be loaded. Add an address to try this preview.</p>}
                            {!addressChoices.length && <p className={s.helper}>Add your delivery address once to use it throughout this preview.</p>}
                            <p className={s.helper}>Address changes stay in this preview session.</p>
                        </CheckoutAddressPicker>}
                        {['advance', 'balance'].includes(stage) && <section className={s.card}>
                            <div className={s.cardHeader}><h2>Payment method</h2><p>Choose how you would like to pay.</p></div>
                            <div className={s.cardBody}>{methods}<p className={s.helper}><LockKey size={16} className="inline mr-1" aria-hidden="true" />Payment selection is simulated in this design preview.</p>
                                {stage === 'advance' && <div className={s.notice}>Your advance is part of your first bill. The refundable security deposit is included in this first-bill estimate.</div>}
                                {stage === 'balance' && <><div className={s.notice}>Your advance of {money(amounts.advance)} has been deducted from the final amount.</div><label className={s.helper}><input type="checkbox" checked={adjustment} onChange={event => setAdjustment(event.target.checked)} /> Preview a delivery charge change (+₹200)</label>{deliveryAdjustment > 0 && <p className={s.errorText}>Delivery changed from {money(quote.delivery * 100)} to {money((quote.delivery + deliveryAdjustment) * 100)} in this example. Review the updated total before paying.</p>}</>}
                                {paymentFailed && <p role="alert" className={`${s.notice} ${s.noticeError}`}>Payment was not completed. Your booking is saved; try again when you are ready.</p>}
                                <details className={s.policyDetails}><summary>What happens if verification is not approved?</summary><p>The checkout will explain the booking advance refund terms before payment. The final policy is awaiting confirmation for this preview.</p></details>
                                <button type="button" className={s.textLink} onClick={() => setPaymentFailed(true)}>Preview unsuccessful payment</button>
                            </div>
                        </section>}
                        {stage === 'verification' && <section className={s.card}>
                            <div className={s.cardHeader}><h2 ref={kycHeadingRef} tabIndex={-1}>{KYC_STEPS[kycStep]}</h2><p>Step {kycStep + 1} of 4</p></div>
                            <div className={s.cardBody}>
                                <ol className={s.stageNav} aria-label="Verification steps">{KYC_STEPS.map((label, i) => <li key={label}><button type="button" aria-current={i === kycStep ? 'step' : undefined} disabled={i > kycStep} onClick={() => setKycStep(i)}><span className={s.timelineMark} data-complete={i < kycStep} data-current={i === kycStep}>{i < kycStep ? <Check size={14} aria-hidden="true" /> : i + 1}</span>{label}</button></li>)}</ol>
                                <form id="preview-kyc-form" onSubmit={submitKyc}>
                                    {kycStep < 2 && renderFields(kycStep === 0 ? PERSONAL : REFERENCE)}
                                    {kycStep === 2 && <><p className={s.helper}>Add clear copies of all three documents.</p><div className={s.documentGrid}>{DOCUMENTS.map((label, i) => <div className={s.documentItem} key={label}><FileText className={s.documentIcon} aria-hidden="true" /><strong>{label}</strong><span className={s.documentName}>{documents[label] || 'JPG, PNG or PDF · up to 10 MB'}</span><label className={s.uploadButton} htmlFor={`preview-document-${i}`}><UploadSimple size={18} aria-hidden="true" />{documents[label] ? 'Replace file' : 'Choose file'}</label><input id={`preview-document-${i}`} className={s.screenReaderOnly} type="file" accept="image/jpeg,image/png,application/pdf" onChange={event => { const file = event.target.files?.[0]; event.target.setCustomValidity(''); if (file && file.size <= 10 * 1024 * 1024) setDocuments(current => ({ ...current, [label]: file.name })); else if (file) { event.target.setCustomValidity('Choose a file smaller than 10 MB.'); event.target.reportValidity(); } }} /></div>)}</div><p className={s.summaryNote}>Only filenames appear in this preview. Files are not uploaded.</p></>}
                                    {kycStep === 3 && <><dl className={s.lineItems}>{[...PERSONAL, ...REFERENCE].map(([key, label]) => <div className={s.row} key={key}><dt>{label}</dt><dd>{fields[key] || 'Example detail'}</dd></div>)}</dl><div className={s.notice}>Check your details before submitting. Your remaining payment will become available after approval.</div></>}
                                </form>
                                <div className={s.actionRow}><button type="button" className={s.textLink} onClick={() => go('booking')}>Finish KYC later</button></div>
                                {kycStep > 0 && <div className={s.actionRow}><button type="button" className={s.textLink} onClick={() => setKycStep(current => current - 1)}><ArrowLeft size={16} aria-hidden="true" /> Back</button></div>}
                            </div>
                        </section>}
                        {['received', 'pending', 'rejected', 'approved', 'complete'].includes(stage) && <section className={s.card}>
                            <div className={s.statusHeader}><StatusMark type={stage === 'rejected' ? 'rejected' : ['approved', 'complete'].includes(stage) ? 'success' : stage === 'received' ? 'receipt' : 'pending'} /><div className={s.statusCopy}><h2>{stage === 'received' ? 'Your advance is recorded' : stage === 'pending' ? 'Verification pending' : stage === 'rejected' ? 'Upload a clearer document' : stage === 'approved' ? 'Ready for the final payment' : 'Delivery is the next step'}</h2><p>{stage === 'rejected' ? 'Example review note: the Aadhaar front image is not clear enough to read.' : stage === 'pending' ? 'You can leave this page and return to your booking to check the status.' : stage === 'complete' ? 'A delivery date has not been confirmed yet.' : stage === 'approved' ? 'Your advance remains credited toward your first bill.' : 'Complete your details and submit your documents for review.'}</p></div></div>
                            <div className={s.cardBody}>
                                <div className={s.receipt}><span>{stage === 'complete' ? 'Total paid' : 'Booking advance paid'}</span><strong>{money(stage === 'complete' ? amounts.finalTotal : amounts.advance)}</strong></div>
                                {stage === 'received' && <><p className={s.stageNote}>Receipt · PREVIEW-ADVANCE<br />Payment shown here is simulated.</p><button type="button" className={s.textLink} onClick={() => go('booking')}>Finish KYC later</button></>}
                                {stage === 'pending' && <ol className={s.timeline}>{[['Booking advance received', true], ['KYC submitted · awaiting review', false], ['Review and pay your balance', false], ['Delivery scheduling', false]].map(([label, done], i) => <li className={s.timelineItem} key={label}><span className={s.timelineMark} data-complete={done} data-current={i === 1}>{done ? <Check size={14} aria-hidden="true" /> : i + 1}</span><span className={s.timelineContent}>{label}</span></li>)}</ol>}
                                {stage === 'rejected' && <div className={`${s.notice} ${s.noticeError}`}>Your advance is still recorded. You can correct and resubmit your KYC.</div>}
                                {stage === 'approved' && <p className={s.stageNote}>Final amount: {money(amounts.finalTotal)}<br />Advance already paid: {money(amounts.advance)}<br /><strong>Remaining balance: {money(amounts.balance)}</strong></p>}
                                {stage === 'complete' && <ol className={s.timeline}>{[['Verification approved', true], ['Advance and balance received', true], ['Delivery scheduling pending', false]].map(([label, done]) => <li key={label} className={s.timelineItem}><span className={s.timelineMark} data-complete={done} data-current={!done}>{done ? <Check size={14} aria-hidden="true" /> : <Truck size={14} aria-hidden="true" />}</span><span className={s.timelineContent}>{label}</span></li>)}</ol>}
                            </div>
                        </section>}
                        {stage === 'booking' && <section className={s.card}>
                            <div className={s.cardHeader}><h2>Booking · PREVIEW</h2><p>Your payment and verification progress in one place.</p></div>
                            <div className={s.cardBody}>
                                <div className={s.orderProgress}><span>{ledger.advancePaid ? 'Advance received' : 'Advance due'}</span><span>{ledger.kyc === 'approved' ? 'KYC approved' : ledger.kyc === 'rejected' ? 'KYC needs changes' : ledger.kyc === 'pending' ? 'KYC under review' : 'KYC not submitted'}</span><span>{ledger.balancePaid ? 'Payment complete' : 'Balance outstanding'}</span></div>
                                <dl className={s.lineItems}><div className={s.row}><dt>Advance paid</dt><dd>{money(ledger.advancePaid ? amounts.advance : 0)}</dd></div><div className={s.row}><dt>Balance paid</dt><dd>{money(ledger.balancePaid ? amounts.balance : 0)}</dd></div><div className={`${s.row} ${s.totalRow}`}><dt>Remaining balance</dt><dd>{money(ledger.balancePaid ? 0 : amounts.balance)}</dd></div></dl>
                                <div className={s.notice}>{ledger.balancePaid ? 'Your booking is awaiting delivery scheduling.' : ledger.kyc === 'approved' ? 'Your KYC is approved. Pay the remaining balance to complete your booking.' : ledger.kyc === 'rejected' ? 'Update your KYC submission to continue.' : ledger.kyc === 'pending' ? 'Your KYC is being reviewed. Balance payment is not available yet.' : 'Complete your KYC to continue.'}</div>
                            </div>
                        </section>}
                        <p className={s.helper}>Need help with your booking? <Link href="/contact" className={s.inlineLink}>Contact our team</Link></p>
                    </div>
                    <aside className={s.summary} aria-label="Booking payment summary">
                        <h2 className={s.summaryTitle}>Your rental summary</h2>
                        <div className={s.product}>{product?.image || product?.images?.[0] ? <Image src={product.image || product.images[0]} width={68} height={68} unoptimized className={s.productImage} alt="" /> : <FileText className={s.productImage} aria-hidden="true" />}<div className={s.productCopy}><strong>{product?.name || (loadError ? 'Add a product to your cart' : 'Loading rental…')}</strong><span className={s.summaryProductTerm}>{product ? `${term}-month minimum term · Quantity 1` : 'Your rental details appear here'}</span></div></div>
                        {sampleQuote && <p className={s.summaryNote}>Example product from the catalogue. Amounts are for design review.</p>}
                        <details className={s.summaryBreakdown} open><summary>{finalBill ? 'Final first-bill breakdown' : 'Estimated first-bill breakdown'}</summary><dl className={s.lineItems}>{rows.map(([label, value]) => <div className={s.row} key={label}><dt>{label}</dt><dd>{money(value * 100)}</dd></div>)}<div className={`${s.row} ${s.totalRow}`}><dt>{finalBill ? 'Final total' : 'Estimated total'}</dt><dd>{money(finalBill ? amounts.finalTotal : amounts.estimatedTotal)}</dd></div>{ledger.advancePaid && <div className={`${s.row} ${s.creditRow}`}><dt>Advance already paid</dt><dd>−{money(amounts.advance)}</dd></div>}{ledger.balancePaid && <div className={`${s.row} ${s.creditRow}`}><dt>Balance already paid</dt><dd>−{money(amounts.balance)}</dd></div>}</dl></details>
                        <div className={s.dueNow}><span>{dueLabel}</span><strong className={s.amount}>{money(dueAmount)}</strong></div>
                        {!ledger.advancePaid ? <><div className={s.row}><span>Estimated balance after KYC</span><strong>{money(amounts.balance)}</strong></div><p className={s.summaryNote}>Your advance is deducted from the final bill. You review and pay the balance after approval.</p></> : <p className={s.summaryNote}>{ledger.balancePaid ? 'Your first bill is fully paid in this preview.' : finalBill ? 'Includes rent, tax, delivery and the refundable deposit, less your advance.' : `Estimated balance: ${money(amounts.balance)}. Available to pay after KYC approval.`}</p>}
                        <div className={s.summaryAction}>{action}</div>
                        {loadError && <Link href="/products" className={s.textLink}>Browse products</Link>}
                    </aside>
                </div>
                <div className={s.stickyMobileAction}><div className={s.mobileActionAmount}><span>{dueLabel}</span><strong>{money(dueAmount)}</strong></div>{action}</div>
            </div>
        </main>
        <AddressModal isOpen={addressModalOpen} initialData={editingAddress} onClose={() => setAddressModalOpen(false)} onSave={savePreviewAddress} />
    </>;
}
