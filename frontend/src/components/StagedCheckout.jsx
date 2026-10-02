'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowRight, CreditCard, Receipt, Clock } from '@phosphor-icons/react';
import CheckoutHeader from './CheckoutHeader';
import AddressModal from './AddressModal';
import CheckoutAddressPicker from './CheckoutAddressPicker';
import KYCExperience from './KYCExperience';
import { getAddresses, addAddress, updateAddress, deleteAddress } from '@/services/addressService';
import { checkoutUser, stagedRequest } from '@/services/stagedCheckout';
import { getCashfree } from '@/services/cashfree';
import { clearCart, selectCartItems } from '@/redux/features/cartSlice';
import { checkoutSelections, stagedCheckoutView } from '@/lib/stagedCheckoutModel.mjs';
import { previewMoney as money } from '@/lib/checkoutPreviewModel.mjs';
import s from './CheckoutPreview.module.css';

const ATTEMPT_KEY = 'irStagedCheckoutAttempt';
const readAttempt = () => { try { return JSON.parse(sessionStorage.getItem(ATTEMPT_KEY) || 'null'); } catch { return null; } };
const writeAttempt = value => { sessionStorage.setItem(ATTEMPT_KEY, JSON.stringify(value)); };

export default function StagedCheckout() {
    const items = useSelector(selectCartItems);
    const couponCode = useSelector(state => state.cart.coupon?.code || null);
    const dispatch = useDispatch();
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);
    const [returnHref, setReturnHref] = useState('/checkout/staged');
    const [addresses, setAddresses] = useState([]);
    const [address, setAddress] = useState(null);
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [addressError, setAddressError] = useState('');
    const [quote, setQuote] = useState(null);
    const [state, setState] = useState(null);
    const [reviewedHash, setReviewedHash] = useState(null);
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);
    const busyRef = useRef(false);
    const mounted = useRef(true);
    const orderId = state?.rental?._id;
    const view = stagedCheckoutView(state);

    const acceptState = useCallback(data => {
        if (!mounted.current) return;
        setState(data);
        if (data.rental?.isPaid && readAttempt()?.rentalId === data.rental._id) sessionStorage.removeItem(ATTEMPT_KEY);
    }, []);
    const refresh = useCallback(async id => {
        const data = await stagedRequest(`/rentals/${id}/staged`);
        acceptState(data);
        return data;
    }, [acceptState]);

    useEffect(() => {
        mounted.current = true;
        const initialize = async () => {
            const currentUser = checkoutUser();
            setUser(currentUser);
            const query = new URLSearchParams(window.location.search);
            const requestedId = query.get('orderId');
            if (!requestedId && query.get('new') === '1') setReturnHref('/checkout/staged?new=1');
            if (requestedId && /^[a-f\d]{24}$/i.test(requestedId)) {
                const stage = query.get('paymentStage');
                setReturnHref(`/checkout/staged?orderId=${requestedId}${['advance', 'balance'].includes(stage) ? `&paymentStage=${stage}` : ''}`);
            }
            if (!currentUser?.token) { setReady(true); return; }
            const attempt = readAttempt();
            const id = requestedId || (query.get('new') !== '1' && attempt?.userId === currentUser._id ? attempt.rentalId : null);
            try {
                if (id) {
                    if (!/^[a-f\d]{24}$/i.test(id)) throw new Error('This booking link is invalid.');
                    const returnStage = new URLSearchParams(window.location.search).get('paymentStage');
                    if (['advance', 'balance'].includes(returnStage)) {
                        try { await stagedRequest('/payments/staged/verify', { rentalId: id, stage: returnStage }); }
                        catch (err) { if (mounted.current) setError(err); }
                    }
                    await refresh(id);
                } else {
                    const list = await getAddresses();
                    if (!mounted.current) return;
                    setAddresses(list);
                    setAddress(list.find(item => item.isDefault) || list[0] || null);
                }
            } catch (err) { if (mounted.current) setError(err); }
            finally { if (mounted.current) setReady(true); }
        };
        initialize();
        return () => { mounted.current = false; };
    }, [refresh]);

    useEffect(() => {
        if (!orderId) return;
        const onFocus = () => { refresh(orderId).catch(err => setError(err)); };
        window.addEventListener('focus', onFocus);
        return () => window.removeEventListener('focus', onFocus);
    }, [orderId, refresh]);

    useEffect(() => {
        const rental = state?.rental;
        // Completing an older booking must not remove a different, newer cart.
        if (rental?.isPaid && !rental.refundReviewRequired && items.length &&
            items.length === rental.orderItems?.length && items.every(item => rental.orderItems.some(line =>
                String(line.product) === item.id && line.qty === item.quantity && line.tenureMonths === item.duration))) dispatch(clearCart());
    }, [state, items, dispatch]);

    const perform = async task => {
        if (busyRef.current) return;
        busyRef.current = true; setBusy(true); setError('');
        try { await task(); } catch (err) { if (mounted.current) setError(err); }
        finally { busyRef.current = false; if (mounted.current) setBusy(false); }
    };
    const saveAddress = async data => {
        if (busyRef.current) return;
        busyRef.current = true; setBusy(true); setAddressError('');
        try {
            const list = editing?._id ? await updateAddress(editing._id, data) : await addAddress({ ...data, isDefault: addresses.length === 0 });
            setAddresses(list);
            setAddress(editing?._id ? list.find(item => item._id === editing._id) : list.find(item => !addresses.some(old => old._id === item._id)) || list.find(item => item.isDefault) || list[0]);
            setQuote(null); setModal(false);
        } catch (err) { setAddressError(err.message); }
        finally { busyRef.current = false; setBusy(false); }
    };
    const reviewQuote = () => perform(async () => {
        const selections = checkoutSelections(items, address, couponCode);
        localStorage.setItem('shippingAddress', JSON.stringify(address));
        const currentQuote = await stagedRequest('/rentals/quote', selections);
        setQuote(currentQuote);
        document.getElementById('staged-quote-heading')?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    });
    const pay = stage => perform(async () => {
        let id = orderId;
        if (!id) {
            const selections = checkoutSelections(items, address, couponCode);
            const fingerprint = JSON.stringify({ selections, userId: user._id });
            let attempt = readAttempt();
            if (!attempt || attempt.fingerprint !== fingerprint) {
                attempt = { fingerprint, userId: user._id, quoteHash: quote.hash, key: crypto.randomUUID() };
                writeAttempt(attempt);
            }
            try {
                const rental = await stagedRequest('/rentals/staged', { ...selections, quoteHash: attempt.quoteHash, checkoutKey: attempt.key });
                id = rental._id;
                writeAttempt({ ...attempt, rentalId: id });
                window.history.replaceState(null, '', `/checkout/staged?orderId=${encodeURIComponent(id)}`);
            } catch (err) {
                if (err.quote) setQuote(err.quote);
                if (err.status === 409) sessionStorage.removeItem(ATTEMPT_KEY);
                throw err;
            }
            await refresh(id);
        }
        const latest = await refresh(id);
        const session = await stagedRequest('/payments/staged/order', { rentalId: id, stage, quoteHash: stage === 'balance' ? reviewedHash : latest.rental.pricingSnapshot.hash });
        if (!session.alreadyPaid) {
            const cashfree = await getCashfree(session.mode);
            await cashfree.checkout({ paymentSessionId: session.paymentSessionId, redirectTarget: '_modal' });
        }
        try { await stagedRequest('/payments/staged/verify', { rentalId: id, stage }); }
        catch (err) { await refresh(id); throw err; }
        const confirmed = await refresh(id);
        if (confirmed.rental?.staged?.[stage]?.state !== 'paid') setError('Payment is not confirmed yet. Check its status before trying again.');
    });
    const finalize = () => perform(async () => {
        const data = await stagedRequest(`/rentals/${orderId}/staged/finalize`, {});
        setReviewedHash(null); acceptState(data);
    });
    const checkPayment = () => perform(async () => {
        for (const stage of ['advance', 'balance']) {
            const association = state?.rental?.staged?.[stage];
            if (association?.providerOrderId && association.state !== 'paid') {
                try { await stagedRequest('/payments/staged/verify', { rentalId: orderId, stage }); }
                catch (err) { await refresh(orderId); throw err; }
            }
        }
        await refresh(orderId);
    });
    const onKycStatus = useCallback(status => {
        if (orderId && status !== state?.kycStatus && !['loading', 'error', 'unauthenticated'].includes(status)) refresh(orderId).catch(err => setError(err));
    }, [orderId, state?.kycStatus, refresh]);

    const finalQuote = state?.finalQuote || state?.rental?.staged?.finalQuote;
    const bill = finalQuote || state?.rental?.pricingSnapshot || quote;
    const advancePaise = state ? view.advancePaise : Math.round((quote?.totalPaise || 0) / 10);
    const dueLabel = view.complete ? 'Balance due' : !view.advancePaid ? 'Booking advance · 10%' : 'Remaining balance';
    const due = view.complete ? 0 : !view.advancePaid ? advancePaise : view.balancePaise;
    const action = !state && !quote ? <button className={s.primaryButton} disabled={busy || !address || !items.length} onClick={reviewQuote}>{busy ? 'Loading…' : 'Review booking advance'}<ArrowRight aria-hidden="true" size={18} /></button>
        : view.blocked ? <Link className={s.primaryButton} href="/contact">Contact our team</Link>
        : !view.advancePaid ? <button className={s.primaryButton} disabled={busy} onClick={() => pay('advance')}>{busy ? 'Checking payment…' : `Pay advance ${money(due)}`}</button>
        : view.complete ? <Link className={s.primaryButton} href="/profile/orders">View my booking</Link>
        : state?.kycStatus !== 'approved' ? <button className={s.primaryButton} disabled={busy} onClick={() => document.getElementById('staged-kyc')?.scrollIntoView({ block: 'start', behavior: 'smooth' })}>View verification</button>
        : !finalQuote ? <button className={s.primaryButton} disabled={busy} onClick={finalize}>Review final bill</button>
        : <button className={s.primaryButton} disabled={busy || !view.canPayBalance || reviewedHash !== finalQuote.hash} onClick={() => pay('balance')}>{busy ? 'Checking payment…' : `Pay balance ${money(due)}`}</button>;
    const title = !state && !quote ? 'Where should we deliver?' : view.blocked ? 'Your booking needs review' : view.complete ? 'Payment complete' : !view.advancePaid ? 'Start your booking' : state?.kycStatus !== 'approved' ? 'Verify your identity' : 'Complete your payment';
    const rows = bill ? [['First month rent', bill.rentPaise], ['GST', bill.taxPaise], ['Refundable security deposit', bill.depositPaise], ['Delivery', bill.deliveryPaise], ...(bill.discountPaise ? [['Coupon discount', -bill.discountPaise]] : [])] : [];

    return <><CheckoutHeader stepLabels={['Address', 'Advance', 'Verification', 'Balance']} activeStep={state ? view.step : quote ? 1 : 0} />
        <main className={s.page}><div className={s.container}>
            {!ready ? <p role="status">Loading your booking…</p> : !user?.token ? <section className={s.card}><div className={s.cardHeader}><h1 className={s.title}>Sign in to continue</h1><p>Your saved addresses and booking progress stay with your account.</p></div><div className={s.cardBody}><Link href={`/login?redirect=${encodeURIComponent(returnHref)}`} className={s.primaryButton}>Sign in</Link></div></section> : <>
                <header className={s.intro}><h1 className={s.title}>{title}</h1><p className={s.description}>Pay a 10% booking advance, complete KYC, then review and pay the balance. Your advance is credited against the final bill.</p></header>
                {error && <div className={`${s.notice} ${s.noticeError}`} role="alert"><p>{error.message || error}</p>{error.code === 'CHECKOUT_API_UNAVAILABLE' && <><Link className={s.textLink} href="/checkout/preview">Explore checkout preview</Link><p>No payment is taken and no booking is placed in the preview.</p></>}{orderId && <button className={s.textLink} disabled={busy} onClick={checkPayment}>Refresh booking status</button>}</div>}
                <div className={s.layout}><div className={s.main}>
                    {!state && !quote && <CheckoutAddressPicker addresses={addresses} selectedId={address?._id} onSelect={setAddress} disabled={busy}
                        onAdd={() => { setEditing(null); setAddressError(''); setModal(true); }}
                        onEdit={item => { setEditing(item); setAddressError(''); setModal(true); }}
                        onDelete={item => { if (!window.confirm(`Delete the saved address for ${item.name}?`)) return; perform(async () => { const list = await deleteAddress(item._id); setAddresses(list); if (address?._id === item._id) setAddress(list.find(saved => saved.isDefault) || list[0] || null); }); }}>
                        {!addresses.length && <p className={s.helper}>Add your delivery address once. It will be saved for your next rental.</p>}
                        {!items.length && <Link href="/products" className={s.textLink}>Add a rental to your cart</Link>}
                    </CheckoutAddressPicker>}
                    {((quote && !state) || (state && !view.advancePaid)) && <section className={s.card}><div className={s.cardHeader}><h2>Review your booking advance</h2><p>Your payment method is selected securely in the payment window.</p></div><div className={s.cardBody}><span className={s.method}><CreditCard size={24} aria-hidden="true" />UPI, cards and net banking</span><div className={s.notice}>Pay {money(advancePaise)} now. KYC approval and payment of the remaining balance are required before delivery. Availability is confirmed by our team.</div><p className={s.helper}>If you cancel or verification cannot be completed after payment, our team reviews any refund due under the <Link className={s.inlineLink} href="/refund-policy">refund policy</Link>.</p>{!state && <button className={s.textLink} disabled={busy} onClick={() => setQuote(null)}>Change address</button>}</div></section>}
                    {view.advancePaid && <section className={s.card}><div className={s.statusHeader}><span className={s.statusIcon}><Receipt aria-hidden="true" /></span><div className={s.statusCopy}><h2>{view.complete ? 'Your first bill is paid' : 'Booking advance received'}</h2><p>Booking {orderId?.slice(-6).toUpperCase()}</p></div></div><div className={s.cardBody}><div className={s.receipt}><span>Total received</span><strong>{money(view.paidPaise)}</strong></div><p className={s.stageNote}>Advance: {money(advancePaise)}{state.rental.staged.advance.providerPaymentId && <><br />Payment reference: {state.rental.staged.advance.providerPaymentId}</>}</p>{view.complete && <p className={s.helper}>{state.kycStatus === 'approved' ? 'Your next step is delivery scheduling. Check My Orders for updates.' : 'Your payment is recorded. Identity verification must be approved before delivery.'}</p>}{view.blocked && <div className={`${s.notice} ${s.noticeError}`}>This booking is on hold. Payments already received remain recorded; our team will review the next step.</div>}</div></section>}
                    {view.advancePaid && !view.blocked && !view.complete && <div id="staged-kyc" className={s.card}><div className={s.cardBody}><KYCExperience key={`${orderId}:${state.kycStatus}`} mode="checkout" onStatusChange={onKycStatus} approvedHref={`/checkout/staged?orderId=${orderId}`} loginReturnHref={`/checkout/staged?orderId=${orderId}`} onApproved={finalQuote ? () => document.getElementById('staged-final-bill')?.scrollIntoView({ block: 'center', behavior: 'smooth' }) : finalize} /></div></div>}
                    {finalQuote && !view.complete && !view.blocked && <section id="staged-final-bill" className={s.card}><div className={s.cardHeader}><h2>Review your final bill</h2><p>Your advance has been deducted from the amount below.</p></div><div className={s.cardBody}>{finalQuote.adjustmentReason && <div className={s.notice}>Delivery charge updated: {finalQuote.adjustmentReason}</div>}<div className={s.receipt}><span>Balance to pay</span><strong>{money(view.balancePaise)}</strong></div><label className={s.helper}><input type="checkbox" checked={reviewedHash === finalQuote.hash} onChange={event => setReviewedHash(event.target.checked ? finalQuote.hash : null)} /> I have reviewed this final bill and the advance credit.</label>{!view.canPayBalance && <p className={s.helper}>Balance payment is unavailable. Refresh your booking to check verification and payment status.</p>}</div></section>}
                    {orderId && <button disabled={busy} className={s.textLink} onClick={checkPayment}><Clock size={18} aria-hidden="true" />Refresh booking status</button>}
                    <p className={s.helper}>Need help? <Link href="/contact" className={s.inlineLink}>Contact our team</Link></p>
                </div><aside className={s.summary} aria-label="Booking payment summary"><h2 id="staged-quote-heading" className={s.summaryTitle}>Your rental summary</h2>
                    {(state?.rental?.orderItems || items).map((item, index) => <div className={s.product} key={item._id || item.id || index}>{item.image && <Image src={item.image} alt="" width={68} height={68} unoptimized className={s.productImage} />}<div className={s.productCopy}><strong>{item.name}</strong><span className={s.summaryProductTerm}>{item.tenureMonths || item.duration}-month minimum term · Quantity {item.qty || item.quantity}</span></div></div>)}
                    {bill ? <details className={s.summaryBreakdown} open><summary>{finalQuote ? 'Final first-bill breakdown' : 'Estimated first-bill breakdown'}</summary><dl className={s.lineItems}>{rows.map(([label, value]) => <div key={label} className={s.row}><dt>{label}</dt><dd>{money(value || 0)}</dd></div>)}<div className={`${s.row} ${s.totalRow}`}><dt>Total</dt><dd>{money(bill.totalPaise)}</dd></div>{view.paidPaise > 0 && <div className={`${s.row} ${s.creditRow}`}><dt>Payments received</dt><dd>−{money(view.paidPaise)}</dd></div>}</dl></details> : <p className={s.summaryNote}>Select your address to calculate the current rental, deposit, tax and delivery charges.</p>}
                    {bill && <div className={s.dueNow}><span>{dueLabel}</span><strong className={s.amount}>{money(due)}</strong></div>}
                    <p className={s.summaryNote}>{view.advancePaid ? 'Balance payment becomes available after KYC approval and review of your final bill.' : 'Your advance is part of your first bill, which includes the refundable security deposit.'}</p><div className={s.summaryAction}>{action}</div>
                </aside></div><div className={s.stickyMobileAction}><div className={s.mobileActionAmount}><span>{bill ? dueLabel : 'Booking advance'}</span><strong>{bill ? money(due) : '10%'}</strong></div>{action}</div>
            </>}
        </div></main><AddressModal isOpen={modal} onClose={() => setModal(false)} onSave={saveAddress} initialData={editing} isSubmitting={busy} saveError={addressError} /></>;
}
