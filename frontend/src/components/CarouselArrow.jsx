'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import styles from './CarouselArrow.module.css';

export default function CarouselArrow({ direction, className = '', ...props }) {
    const Icon = direction === 'previous' ? ChevronLeftIcon : ChevronRightIcon;
    return <button type="button" className={`${styles.arrow} ${className}`} {...props}>
        <Icon width={24} height={24} aria-hidden="true" />
    </button>;
}
