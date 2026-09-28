"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Laptop, IdentificationCard, ShoppingCart, Package, ArrowRight } from '@phosphor-icons/react';
import { API } from '../services/apiConfig';
import styles from './RentalProcess.module.css';
import { getStepIllustration } from '@/lib/rentalProcessIllustrations';

const FALLBACK_STEPS = [
    { title: 'Choose Your Tech', description: 'Explore the catalogue and choose the equipment and rental duration you need.', icon: 'Laptop' },
    { title: 'Complete KYC', description: 'Add your delivery details and submit the documents requested during verification.', icon: 'IdentificationCard' },
    { title: 'Secure Your Order', description: 'Review your rental, deposit and payment details before confirming your order.', icon: 'ShoppingCart' },
    { title: 'Receive & Create', description: 'Receive your equipment at the confirmed delivery address and get started.', icon: 'Package' },
];
const LEGACY_DESCRIPTIONS = [
    'Browse our curated selection...',
    'Pick a flexible rental tenure...',
    'Confirm your rental...',
    'We deliver your tech...',
];

// Expand only the original seed placeholders; editors retain control of custom copy.
function completeStepDescription(step) {
    const index = FALLBACK_STEPS.findIndex(item => item.title === step.title);
    return index >= 0 && step.description?.trim() === LEGACY_DESCRIPTIONS[index]
        ? { ...step, description: FALLBACK_STEPS[index].description }
        : step;
}

const ICONS = { Laptop, IdentificationCard, UserFocus: IdentificationCard, ShoppingCart, Package,
    FaSearch: Laptop, FaLaptopCode: Laptop, FaIdCard: IdentificationCard, FaCreditCard: ShoppingCart, FaTruck: Package };
const DEFAULT_ICONS = [Laptop, IdentificationCard, ShoppingCart, Package];
const safeLink = (value) => typeof value === 'string' && (/^\/(?!\/)/.test(value) || /^https?:\/\//.test(value)) ? value : null;

export default function RentalProcess({ cmsData = null, showRentalProcessLink = true, desktopBackground = 'var(--color-grey-50)' }) {
    const [loadedCms, setLoadedCms] = useState(null);
    const [loading, setLoading] = useState(!cmsData);
    const [failedImages, setFailedImages] = useState({});
    useEffect(() => {
        if (cmsData) return;
        const request = new AbortController();
        fetch(`${API}/api/cms/homepage`, { cache: 'no-store', signal: request.signal })
            .then(response => response.ok ? response.json() : null)
            .then(data => { if (!request.signal.aborted) setLoadedCms(data); })
            .catch(() => {})
            .finally(() => { if (!request.signal.aborted) setLoading(false); });
        return () => request.abort();
    }, [cmsData]);

    const cms = cmsData || loadedCms;
    // An explicitly empty CMS list stays empty; removing all steps must persist.
    const steps = Array.isArray(cms?.rentalProcessSteps) ? cms.rentalProcessSteps.map(completeStepDescription) : FALLBACK_STEPS;
    if (cms?.rentalProcessEnabled === false || !steps.length) return null;
    if (loading && !cmsData) return <div className="h-80 bg-grey-50" aria-busy="true" aria-label="Loading rental process" />;

    return (
        <section className={styles.section} style={{ background: desktopBackground }} aria-labelledby="rental-process-title">
            <div className={styles.container}>
                <header className={styles.header}>
                    <div>
                        <h2 id="rental-process-title">{cms?.rentalProcessTitle || 'Rental Process'}</h2>
                        <p>{cms?.rentalProcessSubtitle || 'From choosing your equipment to getting it delivered, here’s how renting works.'}</p>
                    </div>
                    <div className={styles.actions}>
                        {showRentalProcessLink && <Link href="/rental-process" className="btn-secondary">Rental Process</Link>}
                        <Link href="/contact" className="btn-primary">Contact us</Link>
                    </div>
                </header>
                <ol className={styles.steps}>
                    {steps.map((step, index) => {
                        const Icon = ICONS[step.icon] || DEFAULT_ICONS[index % DEFAULT_ICONS.length];
                        const image = safeLink(step.image) || getStepIllustration(step);
                        const href = safeLink(step.link);
                        return (
                            <li key={`${index}-${step.title}`} className={styles.step} data-highlight={step.highlight || undefined}>
                                <div className={styles.visual} data-illustrated={Boolean(image && !failedImages[image]) || undefined}>
                                    {image && !failedImages[image] ? (
                                        <Image src={image} alt={step.imageAlt || ''} fill unoptimized={Boolean(safeLink(step.image))} sizes="(max-width: 639px) 128px, 224px" className={styles.illustration} onError={() => setFailedImages(previous => ({ ...previous, [image]: true }))} />
                                    ) : <Icon size={64} weight="duotone" aria-hidden="true" />}
                                    <span className={styles.number} aria-label={`Step ${index + 1}`}>{String(index + 1).padStart(2, '0')}</span>
                                </div>
                                <div className={styles.copy}>
                                    <h3>{step.title}</h3>
                                    <p>{step.description}</p>
                                    {href && <Link href={href} className={styles.stepLink}>Explore this step <ArrowRight size={16} aria-hidden="true" /></Link>}
                                </div>
                            </li>
                        );
                    })}
                </ol>
            </div>
        </section>
    );
}
