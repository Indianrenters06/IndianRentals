import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/common/Button';
import styles from './not-found.module.css';

const shortcuts = [
    { label: 'Laptops', href: '/category/it-products/laptop' },
    { label: 'Projectors & screens', href: '/category/av-products' },
    { label: 'Office essentials', href: '/category/office-equipment' },
];

export default function NotFound() {
    return (
        <section className={styles.page} aria-labelledby="not-found-title">
            <div className={styles.message}>
                <p className={styles.eyebrow}>404 / Page not found</p>
                <h1 id="not-found-title">This page took<br />a detour.</h1>
                <p className={styles.description}>The link may have changed. Let’s get you back to equipment for the work ahead.</p>
                <div className={styles.actions}>
                    <Button href="/products" className={`${styles.action} ${styles.primary}`}>
                        Explore equipment
                        <span className={styles.arrow} aria-hidden="true"><Image src="/images/not-found/arrow.svg" width={15.9998} height={13.9875} alt="" /></span>
                    </Button>
                    <Button href="/" variant="outline" className={`${styles.action} ${styles.secondary}`}>Back to homepage</Button>
                </div>
                <nav className={styles.shortcuts} aria-label="Popular rental categories">
                    <p>Take a shorter route</p>
                    <div>{shortcuts.map(({ label, href }) => <Link key={href} href={href}>{label}</Link>)}</div>
                </nav>
            </div>
            <div className={styles.art} aria-hidden="true">
                <div className={styles.illustration}>
                    <Image src="/images/not-found/equipment.png" alt="" fill priority sizes="(max-width: 767px) 100vw, (max-width: 1440px) 55vw, 751px" />
                </div>
                <span className={styles.number}>404</span>
            </div>
        </section>
    );
}
