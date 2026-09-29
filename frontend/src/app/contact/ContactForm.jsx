'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import styles from './page.module.css';
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const empty = { fullName:'',phone:'',email:'',city:'',equipment:'',order:'',message:'',consent:false };
export default function ContactForm({ content }) {
    const [intent,setIntent] = useState('rental');
    const [values,setValues] = useState(empty);
    const [pending,setPending] = useState(false);
    const [availability,setAvailability] = useState('checking');
    const [error,setError] = useState('');
    const [receipt,setReceipt] = useState(null);
    const success = useRef(null);
    const attempt = useRef(null);
    const sending = useRef(false);
    useEffect(() => {
        if (new URLSearchParams(window.location.search).get('intent') === 'support') setIntent('support');
    }, []);
    useEffect(() => {
        const controller = new AbortController();
        fetch(`${API}/api/contact/enquiries`, { signal: controller.signal, cache: 'no-store' })
            .then(response => setAvailability([200, 401, 403].includes(response.status) ? 'ready' : 'unavailable'))
            .catch(error => { if (error.name !== 'AbortError') setAvailability('unavailable'); });
        return () => controller.abort();
    }, []);
    useEffect(()=>{ if(receipt) success.current?.focus(); },[receipt]);
    const set = (key,value) => setValues(previous=>({...previous,[key]:value}));
    async function submit(event) {
        event.preventDefault();
        if (availability !== 'ready') return;
        if(sending.current) return;
        const payload = { ...values, intent };
        const fingerprint = JSON.stringify(payload);
        if(attempt.current?.fingerprint !== fingerprint) attempt.current = {fingerprint,id:crypto.randomUUID()};
        sending.current=true; setPending(true); setError('');
        try {
            const res=await fetch(`${API}/api/contact/enquiries`, { method:'POST', headers:{'Content-Type':'application/json'}, signal:AbortSignal.timeout(20000), body:JSON.stringify({...payload,submissionId:attempt.current.id}) });
            const body=await res.json().catch(()=>({}));
            if(!res.ok || !body.received) throw new Error(res.status===429 ? 'Too many requests. Please try again later or call us.' : res.status===400 ? body.message : 'We couldn’t send your request. Please try again or contact us by phone.');
            setReceipt(body.reference); attempt.current=null;
        } catch(err) { setError(err.name==='TimeoutError' ? 'The request timed out. Please try again; retrying will not send a duplicate.' : err.message==='Failed to fetch' ? 'Unable to connect. Check your connection and try again.' : err.message); }
        finally { sending.current=false; setPending(false); }
    }
    if(receipt) return <div className={styles.confirmation} ref={success} tabIndex={-1} role="status"><CheckIcon aria-hidden="true" /><h2>{content.successTitle}</h2><p>{content.successMessage}</p><p>Reference: {receipt}</p><button className="btn-primary" onClick={()=>{setReceipt(null);setValues(empty);}}>Send another request</button></div>;
    return <form id="contact-form" className="scroll-mt-28" onSubmit={submit} aria-busy={pending}>
        <fieldset disabled={pending} className={styles.intent}><legend className="sr-only">What can we help with?</legend>{[['rental','I want to rent'],['support','I need support']].map(([value,label])=><label key={value} className={intent===value?styles.selected:''}><input type="radio" name="intent" value={value} checked={intent===value} onChange={()=>{setIntent(value);setError('');}}/><span>{label}</span></label>)}</fieldset>
        <h2>{content[`${intent}Title`]}</h2><p className={styles.formIntro}>{content[`${intent}Intro`]}</p>
        <fieldset disabled={pending} className={styles.fields}>
            <legend className="sr-only">Your contact details</legend>
            <label className={styles.full}>Full name<input name="fullName" value={values.fullName} onChange={e=>set('fullName',e.target.value)} autoComplete="name" placeholder="Your name" required maxLength={100} pattern=".*\S.*"/></label>
            <label>Phone number<input name="phone" value={values.phone} onChange={e=>set('phone',e.target.value)} type="tel" autoComplete="tel" placeholder="Your mobile number" required maxLength={24}/></label>
            <label>Email address<input name="email" value={values.email} onChange={e=>set('email',e.target.value)} type="email" autoComplete="email" placeholder="you@company.com" required maxLength={254}/></label>
            <label>City<span className={styles.select}><select name="city" value={values.city} onChange={e=>set('city',e.target.value)} required><option value="" disabled>Select your city</option>{content.branches.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}</select><ChevronDownIcon aria-hidden="true"/></span></label>
            {intent==='rental'?<label key="equipment">Equipment<span className={styles.select}><select name="equipment" value={values.equipment} onChange={e=>set('equipment',e.target.value)} required><option value="" disabled>Choose equipment</option>{content.equipment.map(item=><option key={item}>{item}</option>)}</select><ChevronDownIcon aria-hidden="true"/></span></label>:<label key="order">Order number <span className={styles.optional}>(optional)</span><input name="order" value={values.order} onChange={e=>set('order',e.target.value)} placeholder="Your rental reference" maxLength={100}/></label>}
            <label className={styles.full}>{intent==='rental'?'A little about your plans':'How can we help?'} {intent==='rental'&&<span className={styles.optional}>(optional)</span>}<textarea name="message" rows={3} required={intent==='support'} maxLength={2000} value={values.message} onChange={e=>set('message',e.target.value)} placeholder={intent==='rental'?'Equipment, quantity, dates — anything that helps us understand your needs.':'Tell us what happened and what you need help with.'}/></label>
        </fieldset>
        <label className={styles.consent}><input name="consent" type="checkbox" checked={values.consent} onChange={e=>set('consent',e.target.checked)} required disabled={pending}/><span>I agree to the <Link href="/privacy" target="_blank" rel="noopener noreferrer">privacy policy</Link>.</span></label>
        {availability==='unavailable'&&<p className={styles.error} role="alert">Online enquiries are temporarily unavailable. Please call <a href={`tel:${content.phone.replace(/[^+\d]/g,'')}`}>{content.phone}</a> or email <a href={`mailto:${content.email}`}>{content.email}</a> instead.</p>}
        {error&&<p className={styles.error} role="alert">{error}</p>}
        <div className={styles.submit}><button className="btn-primary" type="submit" disabled={pending||availability!=='ready'}>{pending?'Sending…':availability==='checking'?'Checking availability…':content[`${intent}Button`]}</button></div>
    </form>;
}
