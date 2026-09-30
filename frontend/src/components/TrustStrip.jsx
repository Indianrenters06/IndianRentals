import Link from 'next/link';
import { ArrowUpRight } from '@phosphor-icons/react';
import styles from './TrustStrip.module.css';

// Operational benefits sourced from 00_brand/proof-bank.md.
const benefits = [
    { title: 'Quality checked', description: 'Equipment checked before every delivery.', href: '/rental-process', illustration: 'quality' },
    { title: 'Delivery & setup', description: 'Doorstep delivery and installation included.', href: '/shipping', illustration: 'delivery' },
    { title: 'Repairs covered', description: 'Maintenance and repairs throughout your rental.', href: '/contact', illustration: 'repair' },
    { title: 'Refundable deposit', description: 'Security deposit refunded under your rental terms.', href: '/return-policy', illustration: 'deposit' },
];

export default function TrustStrip() {
    return <section className={styles.section} aria-label="Rental benefits">
        <ul className={styles.benefits}>
            {benefits.map(benefit => <li key={benefit.illustration} className={styles.benefit}>
                <span className={`${styles.illustration} ${styles[benefit.illustration]}`} aria-hidden="true" />
                <div className={styles.copy}>
                    <Link href={benefit.href} className={styles.link}>
                        <span>{benefit.title}</span>
                        <ArrowUpRight size={16} weight="regular" aria-hidden="true" />
                    </Link>
                    <p>{benefit.description}</p>
                </div>
            </li>)}
        </ul>
    </section>;
}
