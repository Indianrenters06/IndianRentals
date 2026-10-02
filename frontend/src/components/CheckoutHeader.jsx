'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check } from '@phosphor-icons/react';
import { usePathname } from 'next/navigation';
import { useSettings } from '../context/SettingsContext';
import { useSelector } from 'react-redux';
import { selectCartItems } from '../redux/features/cartSlice';
import styles from './CheckoutHeader.module.css';

const steps = [
    { label: 'Checkout' },
    { label: 'Address' },
    { label: 'Verification' },
    { label: 'Delivery' },
];

const CheckoutHeader = ({ stepLabels, activeStep }) => {
    const pathname = usePathname() || '';
    const cartItems = useSelector(selectCartItems);
    const showProgress = Boolean(stepLabels) || pathname !== '/cart' || cartItems.length > 0;
    const displayedSteps = stepLabels ? stepLabels.map(label => ({ label })) : steps;
    const { settings } = useSettings();
    const siteLogo = settings?.siteLogo || 'https://res.cloudinary.com/dgkckcdk8/image/upload/v1776892240/1d1f7c4e3c0490bcddb69ceb328c67be2f7cf361_6_kufcee.png';
    const siteName = settings?.siteName || 'Indian Renters';
    const currentIndex = activeStep ?? (pathname.startsWith('/checkout/legacy/payment') ? 3
        : pathname.startsWith('/checkout/legacy/kyc') ? 2
        : pathname.startsWith('/checkout/legacy/address') ? 1
        : 0);

    return (
        <header className={`${styles.header} ${showProgress ? styles.withProgress : ''}`}>
            <div className={styles.inner}>
                <Link href="/" aria-label="Return to Indian Renters homepage" className="flex h-10 w-[150px] shrink-0 items-center">
                    <Image src={siteLogo} unoptimized alt={siteName} width={150} height={40} className="max-h-10 w-auto max-w-[150px] object-contain" priority />
                </Link>
                {showProgress && <nav aria-label="Checkout progress" className={styles.progress}>
                    <ol className={styles.steps}>
                        {displayedSteps.map((step, index) => (
                            <li key={step.label}
                                className={`${styles.step} ${index === currentIndex ? styles.current : ''} ${index < currentIndex ? styles.completed : ''}`}
                                aria-current={index === currentIndex ? 'step' : undefined}>
                                <span className={styles.number} aria-hidden="true">
                                    {index < currentIndex ? <Check size={14} weight="bold" /> : index + 1}
                                </span>
                                <span className={styles.label}>{step.label}</span>
                                    <span className="sr-only">{index < currentIndex ? ' — completed' : ` — step ${index + 1} of ${displayedSteps.length}`}</span>
                            </li>
                        ))}
                    </ol>
                </nav>}
            </div>
        </header>
    );
};

export default CheckoutHeader;
