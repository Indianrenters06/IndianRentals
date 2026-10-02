'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, X, MapPin, Briefcase, MagnifyingGlass, CheckCircle } from '@phosphor-icons/react';
import { API } from '@/services/apiConfig';
import defaults from '@/lib/careers-defaults.json';
import styles from './page.module.css';
import { careersSubmissionAttempt, supportsCareersSubmission } from '@/lib/careersSubmission.mjs';

export default function CareersPage() {
    const [content, setContent] = useState(defaults);
    const [loaded, setLoaded] = useState(false);
    const [loadError, setLoadError] = useState(false);
    const [search, setSearch] = useState('');
    const [team, setTeam] = useState('');
    const [location, setLocation] = useState('');
    const [active, setActive] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');
    const dialog = useRef(null);
    const requestPending = useRef(false);
    const submissionAttempt = useRef(null);
    useEffect(() => {
        const controller = new AbortController();
        fetch(`${API}/api/careers`, { signal: controller.signal, cache: 'no-store' })
            .then(r => { if (!r.ok) throw new Error('Unavailable'); return r.json(); })
            .then(data => { setContent({ ...defaults, ...data }); setLoaded(true); })
            .catch(e => { if (e.name !== 'AbortError') { setLoadError(true); setLoaded(true); } });
        return () => controller.abort();
    }, []);
    useEffect(() => {
        if (!active) return;
        const modal = dialog.current;
        const overflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        modal.showModal();
        return () => { modal.close(); document.body.style.overflow = overflow; };
    }, [active]);
    const jobs = content.enabled ? content.jobs.filter(j => j.status === 'published') : [];
    const filtered = jobs.filter(j => (!team || j.department === team) && (!location || j.location === location) && `${j.title} ${j.department} ${j.description}`.toLowerCase().includes(search.toLowerCase()));
    const form = content.forms.find(f => f.id === (active?.formId || content.defaultFormId));
    const submissionsAvailable = loaded && !loadError && supportsCareersSubmission(content);
    const open = job => { setSubmitted(false); setError(''); setActive(job); };
    const close = () => { if (!requestPending.current) setActive(null); };
    const submit = async event => {
        event.preventDefault();
        if (requestPending.current) return;
        if (!submissionsAvailable) { setError('Applications are temporarily unavailable. Please try again later.'); return; }
        requestPending.current = true; setSending(true); setError('');
        const values = new FormData(event.currentTarget);
        try {
            const payload = { jobId: active.id, fullName: values.get('fullName'), email: values.get('email'), consent: values.get('consent') === 'on', answers: Object.fromEntries((form?.fields || []).map(f => [f.id, values.get(`field-${f.id}`)])) };
            submissionAttempt.current = careersSubmissionAttempt(submissionAttempt.current, payload);
            const response = await fetch(`${API}/api/careers/applications`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...payload, submissionId: submissionAttempt.current.submissionId }),
                signal: AbortSignal.timeout(15000)
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(data.message || (response.status === 429 ? 'Too many attempts. Please try again later.' : 'We could not save your application. Please try again.'));
            if (response.status !== 201 || typeof data.id !== 'string' || !/^[a-f\d]{24}$/i.test(data.id) || data.reference !== submissionAttempt.current.submissionId) {
                throw new Error('We could not confirm receipt. Please try again with the same details.');
            }
            submissionAttempt.current = null;
            setSubmitted(true);
        } catch (e) { setError(e.name === 'TimeoutError' || e.name === 'TypeError' ? 'We could not confirm receipt. Please try again; retrying the same details will not create a duplicate application.' : e.message); }
        finally { requestPending.current = false; setSending(false); }
    };
    return <div className={styles.page}>
        <section className={styles.hero}>
            <div className={`${styles.container} ${styles.heroGrid}`}>
                <div>
                    <p className={styles.eyebrow}>{content.eyebrow}</p>
                    <h1>{content.title}</h1>
                    <p className={styles.lead}>{content.intro}</p>
                    <div className={styles.actions}>
                        <a href="#opportunities" className="btn-primary">{content.primaryLabel}</a>
                        <Link href="/about" className="btn-secondary">{content.secondaryLabel}</Link>
                    </div>
                </div>
                <figure className={styles.heroVisual}>
                    {content.heroImage && <img src={content.heroImage} alt={content.heroImageAlt} />}
                    <figcaption>{content.heroCaption}<ArrowUpRight size={24}/></figcaption>
                </figure>
            </div>
        </section>
        <section className={`${styles.container} ${styles.section}`}>
            <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>{content.cultureEyebrow}</p><h2>{content.cultureTitle}</h2></div><p>{content.cultureIntro}</p></div>
            <div className={styles.benefits}>{content.benefits.map((item, i) => <article key={i}><span className={styles.number}>0{i + 1}</span><h3>{item.title}</h3><p>{item.description}</p></article>)}</div>
        </section>
        <section className={styles.opportunities} id="opportunities">
            <div className={styles.container}>
                <div className={styles.sectionHeading}><h2>{content.jobsTitle}</h2><p>{content.jobsIntro}</p></div>
                {!loaded ? <p role="status">Loading opportunities…</p> : loadError ? <div className={styles.empty} role="alert"><h3>Opportunities are temporarily unavailable.</h3><p>Please try again shortly.</p><button className="btn-secondary" onClick={() => window.location.reload()}>Try again</button></div> : !content.enabled ? <div className={styles.empty}><h3>Applications are currently closed.</h3><p>Please check back for future opportunities.</p></div> : <>
                    {!submissionsAvailable && <p role="status">Applications are temporarily unavailable. You can still browse roles; please try again later.</p>}
                    {jobs.length > 0 && <><div className={styles.filters}>
                        <label className={styles.search}><span className={styles.srOnly}>Search roles</span><MagnifyingGlass size={20}/><input placeholder="Search by role or keyword" value={search} onChange={e => setSearch(e.target.value)}/></label>
                        <label><span className={styles.srOnly}>Team</span><select value={team} onChange={e => setTeam(e.target.value)}><option value="">All teams</option>{[...new Set(jobs.map(j => j.department))].map(v => <option key={v}>{v}</option>)}</select></label>
                        <label><span className={styles.srOnly}>Location</span><select value={location} onChange={e => setLocation(e.target.value)}><option value="">All locations</option>{[...new Set(jobs.map(j => j.location))].map(v => <option key={v}>{v}</option>)}</select></label>
                    </div><p className={styles.results} aria-live="polite">{filtered.length} {filtered.length === 1 ? 'open role' : 'open roles'}</p></>}
                    <div className={styles.jobList}>{filtered.map(job => <article className={styles.job} key={job.id}>
                        <div><span className={styles.team}>{job.department}</span><h3>{job.title}</h3><div className={styles.meta}><span><MapPin size={16}/>{job.location}</span>{job.type && <span><Briefcase size={16}/>{job.type}</span>}{job.experience && <span>{job.experience}</span>}</div></div>
                        <button className="btn-secondary" onClick={() => open(job)} aria-label={`View role: ${job.title}`}>View role<ArrowUpRight size={18}/></button>
                    </article>)}</div>
                    {filtered.length === 0 && <div className={styles.empty}><Briefcase size={32}/><h3>{jobs.length ? 'No matching roles.' : content.emptyTitle}</h3><p>{jobs.length ? 'Try a different team, location or keyword.' : content.emptyText}</p>{jobs.length > 0 && <button className="btn-secondary" onClick={() => { setSearch(''); setTeam(''); setLocation(''); }}>Clear filters</button>}</div>}
                </>}
            </div>
        </section>
        {content.steps.length > 0 && <section className={`${styles.container} ${styles.section}`}><p className={styles.eyebrow}>WHAT COMES NEXT</p><h2>{content.processTitle}</h2><ol className={styles.steps}>{content.steps.map((step, i) => <li key={i}><span className={styles.number}>0{i + 1}</span><h3>{step.title}</h3><p>{step.description}</p></li>)}</ol></section>}
        {loaded && !loadError && content.enabled && content.generalEnabled && <section className={`${styles.container} ${styles.general}`}><div><p className={styles.eyebrow}>OPEN APPLICATION</p><h2>{content.generalTitle}</h2><p>{content.generalText}</p></div><button className="btn-primary" disabled={!submissionsAvailable} onClick={() => open({ id: '', title: 'Open application' })}>{content.generalButton}<ArrowUpRight size={20}/></button></section>}
        {active && <dialog ref={dialog} className={styles.dialog} onCancel={e => { e.preventDefault(); close(); }} onClick={e => { if (e.target === e.currentTarget) close(); }} aria-labelledby="application-title">
            <div className={styles.dialogBody}>
                <button className={styles.close} type="button" aria-label="Close application" onClick={close} disabled={sending}><X size={22}/></button>
                {submitted ? <div className={styles.success} role="status"><CheckCircle size={48}/><h2 id="application-title">{content.successTitle}</h2><p>{content.successText}</p><button className="btn-primary" onClick={close}>Back to opportunities</button></div> : <>
                    <p className={styles.eyebrow}>{active.department || 'OPEN APPLICATION'}</p><h2 id="application-title">{active.title}</h2>
                    {active.id && <div className={styles.jobDetail}><p>{[active.location, active.type, active.experience].filter(Boolean).join(' · ')}</p><p>{active.description}</p>{active.requirements && <><h3>What you’ll bring</h3><ul>{active.requirements.split('\n').filter(Boolean).map((r, i) => <li key={i}>{r}</li>)}</ul></>}</div>}
                    <form onSubmit={submit} className={styles.form}>
                        <h3>{content.formTitle}</h3><p>{content.formIntro}</p>
                        <div className={styles.formGrid}><label>Full name <span>*</span><input name="fullName" autoComplete="name" required maxLength={150}/></label><label>Email <span>*</span><input name="email" type="email" autoComplete="email" required maxLength={254}/></label>
                            {form?.fields.map(field => <label className={field.type === 'textarea' ? styles.fullWidth : ''} key={field.id}>{field.label}{field.required && <span> *</span>}{field.type === 'textarea' ? <textarea name={`field-${field.id}`} required={field.required} rows={4} maxLength={5000}/> : field.type === 'select' ? <select name={`field-${field.id}`} required={field.required} defaultValue=""><option value="" disabled>Choose an option</option>{field.options.map(v => <option key={v}>{v}</option>)}</select> : <input name={`field-${field.id}`} type={field.type} required={field.required} maxLength={1000} placeholder={field.type === 'url' ? 'https://' : undefined}/>}</label>)}
                        </div>
                        <label className={styles.consent}><input type="checkbox" name="consent" required/><span>{content.consentText} <Link href="/privacy" target="_blank">Privacy policy</Link></span></label>
                        {error && <p className={styles.error} role="alert">{error}</p>}
                        {!submissionsAvailable && <p role="status">Applications are temporarily unavailable. Please try again later.</p>}
                        <div className={styles.actions}><button className="btn-primary" type="submit" disabled={sending || !form || !submissionsAvailable}>{sending ? 'Sending…' : content.submitLabel}<ArrowRight size={18}/></button><button className="btn-secondary" type="button" onClick={close} disabled={sending}>Cancel</button></div>
                    </form>
                </>}
            </div>
        </dialog>}
    </div>;
}
