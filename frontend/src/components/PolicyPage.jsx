'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRightIcon, DocumentTextIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import PageBanner from './PageBanner';
import styles from './PolicyPage.module.css';
import { API } from '@/services/apiConfig';

const PAGES = [
    ['terms', '/terms', 'Terms & conditions'],
    ['privacy', '/privacy', 'Privacy policy'],
    ['kyc-policy', '/kyc-policy', 'KYC policy'],
    ['shipping', '/shipping', 'Shipping & delivery'],
    ['refund', '/return-policy', 'Returns & refunds'],
    ['rules', '/rules', 'Rules & charges'],
    ['delivery-charges', '/delivery-charges', 'Delivery charges'],
    ['late-fee-rules', '/late-fee-rules', 'Late fee rules'],
    ['cancellation-rules', '/cancellation-rules', 'Cancellation rules'],
    ['subscription-rules', '/subscription-rules', 'Subscription rules'],
];

export default function PolicyPage({ cmsKey, title, image, fallbackHtml }) {
    const [cms, setCms] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const controller = new AbortController();
        fetch(`${API}/api/cms/${cmsKey}`, { signal: controller.signal })
            .then(response => response.ok ? response.json() : null)
            .then(value => { if (!controller.signal.aborted) setCms(value); })
            .catch(() => {})
            .finally(() => { if (!controller.signal.aborted) setLoading(false); });
        return () => controller.abort();
    }, [cmsKey]);

    const heading = cms?.bannerTitle || title;
    return <main className={styles.page}>
        <PageBanner image={cms?.bannerImage || image} title={heading} showText={cms?.bannerShowText !== false} background={cms?.bannerBackground} />
        <div className={styles.layout}>
            <aside className={styles.sidebar} aria-label="Policy navigation">
                <div className={styles.sideHeader}><DocumentTextIcon aria-hidden="true" /><span>Policies & guidance</span></div>
                <nav>{PAGES.map(([key, href, label]) => <Link key={href} href={href} aria-current={key === cmsKey ? 'page' : undefined} className={key === cmsKey ? styles.active : ''}>{label}<ArrowRightIcon aria-hidden="true" /></Link>)}</nav>
            </aside>
            <article className={styles.article}>
                <div className={styles.articleHeader}>
                    <span>IndianRenters policies</span>
                    <h2>{heading}</h2>
                    <p>Read the details below or choose another policy from the list.</p>
                </div>
                {loading ? <div className={styles.loading} role="status">Loading policy…</div> :
                    <div className={styles.content} dangerouslySetInnerHTML={{ __html: cms?.pageContent || fallbackHtml }} />}
                <div className={styles.help}>
                    <div><h3>Need help with this policy?</h3><p>Our team can help you understand how it applies to your rental.</p></div>
                    <Link href="/contact"><EnvelopeIcon aria-hidden="true" /> Contact us <ArrowRightIcon aria-hidden="true" /></Link>
                </div>
            </article>
        </div>
    </main>;
}
