'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRightIcon, ArrowRightIcon, PhoneIcon, EnvelopeIcon, MapPinIcon, ChevronDownIcon, PauseIcon, PlayIcon } from '@heroicons/react/24/outline';
import { locationPhoneHref } from '@/config/locations';
import ContactForm from './ContactForm';
import PageBanner from '@/components/PageBanner';
import styles from './page.module.css';

const ROTATION_MS = 3000;
function subscribeMotion(callback) {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    media.addEventListener('change', callback);
    return () => media.removeEventListener('change', callback);
}
function subscribeVisibility(callback) {
    document.addEventListener('visibilitychange', callback);
    return () => document.removeEventListener('visibilitychange', callback);
}
const readReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const readHidden = () => document.hidden;
const serverPaused = () => true;

/* THESIS: A contact desk that makes choosing help and describing a rental equally easy.
   OWN-WORLD: Existing Mona Sans, yellow, charcoal, white; clear rules and generous type.
   STORY: Choose enquiry or support, describe the need, find a verified local branch.
   FIRST VIEWPORT: Warm photographic contact banner, followed by the preserved two-line title.
   FORM: Contact desk with local directory, candidate 4; seed 66092709.
   IMPLEMENTATION: CMS-backed content, functional enquiry form, preserved branch controls. */
export default function ContactPage({ content }) {
    const locations = Object.fromEntries(content.branches.map(branch => [branch.id, branch]));
    const cityKeys = content.branches.map(branch => branch.id);
    const [city, setCity] = useState(content.branches[0].id);
    const directory = useRef(null);
    const [paused, setPaused] = useState(false);
    const [inView, setInView] = useState(false);
    const [readingDetails, setReadingDetails] = useState(false);
    const [keyboardFocus, setKeyboardFocus] = useState(false);
    const [selection, setSelection] = useState(0);
    const reducedMotion = useSyncExternalStore(subscribeMotion, readReducedMotion, serverPaused);
    const hidden = useSyncExternalStore(subscribeVisibility, readHidden, serverPaused);
    const rotating = inView && !paused && !readingDetails && !keyboardFocus && !reducedMotion && !hidden;
    const branch = locations[city] || content.branches[0];
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: .25 });
        observer.observe(directory.current);
        return () => observer.disconnect();
    }, []);
    useEffect(() => {
        if (!rotating) return;
        const timer = window.setTimeout(() => {
            const keys = content.branches.map(branch => branch.id);
            setCity(keys[(keys.indexOf(city) + 1) % keys.length]);
        }, ROTATION_MS);
        return () => window.clearTimeout(timer);
    }, [city, rotating, selection, content.branches]);
    function selectCity(value) {
        setCity(value);
        setSelection(value => value + 1);
    }
    return <div className={styles.page}>
        <PageBanner image={content.heroImage} alt={content.heroAlt} title={content.heroTitle}
            showText={content.heroShowText} background={content.heroBackground} titleAs="p" imagePosition="70% center" />
        <div className={styles.container}>
            <header className={styles.hero}>
                <h1>{content.title}<br /><span>{content.titleAccent}</span></h1>
                <div><p>{content.intro}</p><p>{content.introClosing}</p></div>
            </header>
            <section className={styles.contactGrid} aria-label="Contact the rental team">
                <aside className={styles.contactOptions}>
                    <h2>{content.contactTitle}</h2>
                    <p>{content.contactDescription}</p>
                    <div className={styles.directLinks}>
                        <a href={locationPhoneHref(content.phone)}><PhoneIcon aria-hidden="true" /><span><small>{content.callLabel}</small>{content.phone}</span><ArrowUpRightIcon aria-hidden="true" /></a>
                        <a href={`mailto:${content.email}`}><EnvelopeIcon aria-hidden="true" /><span><small>{content.emailLabel}</small>{content.email}</span><ArrowUpRightIcon aria-hidden="true" /></a>
                    </div>
                    <p className={styles.hours}>{content.hours}</p>
                    <a href="#branches" className={styles.textLink}>{content.branchLinkLabel} <ArrowRightIcon aria-hidden="true" /></a>
                </aside>
                <div className={styles.formPanel}>
                    <ContactForm content={content} />
                </div>
            </section>
        </div>
        <section id="branches" className={styles.branches} aria-labelledby="branches-title">
            <div className={styles.container}>
                <div className={styles.branchHeader}><h2 id="branches-title">{content.branchesTitle}</h2><p>{content.branchesIntro}</p></div>
                <div className={styles.branchGrid} ref={directory}
                    onFocusCapture={event => { if (!event.target.closest('[data-rotation-control]') && (event.target.matches(':focus-visible') || event.target.closest('a, select'))) setKeyboardFocus(true); }}
                    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setKeyboardFocus(false); }}>
                    <div className={styles.citySelector}>
                        <label htmlFor="branch-city" className={styles.mobileCityLabel}>Your city</label>
                        <span className={`${styles.select} ${styles.mobileCitySelect}`}><select id="branch-city" value={city} onChange={e=>selectCity(e.target.value)}>{Object.entries(locations).map(([key,value])=><option key={key} value={key}>{value.name}</option>)}</select><ChevronDownIcon aria-hidden="true" /></span>
                        <div className={styles.cityButtons} role="group" aria-label="Choose a branch city">{Object.entries(locations).map(([key,value])=><button key={key} type="button" onClick={()=>selectCity(key)} aria-pressed={city===key} aria-controls="branch-detail"><span>{value.name}</span><ArrowRightIcon aria-hidden="true" /></button>)}</div>
                        {!reducedMotion && <div className={styles.rotationControls}>
                            <button type="button" data-rotation-control onClick={() => { setPaused(value => !value); setKeyboardFocus(false); }} aria-label={paused ? 'Play city rotation' : 'Pause city rotation'}>
                                {paused ? <PlayIcon aria-hidden="true" /> : <PauseIcon aria-hidden="true" />}<span>{paused ? 'Play' : 'Pause'}</span>
                            </button>
                            <div className={styles.rotationTrack} aria-hidden="true"><span key={`${city}-${selection}-${rotating}`} className={rotating ? styles.rotationProgress : undefined} style={{ '--rotation-duration': `${ROTATION_MS}ms` }} /></div>
                            <span className={styles.rotationCount}>{cityKeys.indexOf(city) + 1} / {cityKeys.length}</span>
                        </div>}
                    </div>
                    <div id="branch-detail" className={styles.branchDetail} aria-live={rotating ? 'off' : 'polite'} onMouseEnter={() => setReadingDetails(true)} onMouseLeave={() => setReadingDetails(false)}>
                        <div key={city} className={styles.branchCopy}>
                        <h3>{branch.name}</h3>
                        <p className={styles.branchType}><MapPinIcon aria-hidden="true" />{branch.type}</p>
                        {branch.address ? <address>{branch.address}</address> : <p>{branch.serviceNote}</p>}
                        <a href={locationPhoneHref(branch.phone)} className={styles.branchPhone}>{branch.phone}<ArrowUpRightIcon aria-hidden="true" /></a>
                        {branch.mapUrl && <a className={styles.textLink} href={branch.mapUrl} target="_blank" rel="noopener noreferrer">Get directions <ArrowUpRightIcon aria-hidden="true" /></a>}
                        </div>
                    </div>
                    <div className={styles.branchArt} role="img" aria-label={`${branch.name} landmark illustration`}>
                        {cityKeys.map(key => <Image key={key} src={locations[key].image} unoptimized={locations[key].image.startsWith('http')} alt="" aria-hidden="true" fill className={key === city ? styles.activeArt : styles.inactiveArt} sizes="(max-width: 599px) 85vw, (max-width: 1023px) 35vw, 370px" />)}
                    </div>
                </div>
            </div>
        </section>
        <section className={`${styles.container} ${styles.help}`} aria-labelledby="help-title"><div><h2 id="help-title">{content.helpTitle}</h2><p>{content.helpDescription}</p></div><div>{content.helpLinks.map(link => <Link key={link.href} href={link.href}>{link.label}<ArrowUpRightIcon aria-hidden="true" /></Link>)}</div></section>
    </div>;
}
