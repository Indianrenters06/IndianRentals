'use client';

import { MapPin } from '@phosphor-icons/react';
import styles from './DeliveryCheck.module.css';

export default function DeliveryCheck({ id = 'delivery-pincode', value, onChange, onCheck, checking, result, label = 'Check delivery', placeholder = 'Enter your pincode', buttonLabel = 'Check' }) {
    return <section className={styles.card} aria-label={label}>
        <div className={styles.heading}>
            <span className={styles.icon}><MapPin size={21} weight="fill" aria-hidden="true" /></span>
            <span>{label}</span>
        </div>
        <form className={styles.form} onSubmit={(event) => { event.preventDefault(); onCheck(); }}>
            <label className={styles.srOnly} htmlFor={id}>Delivery pincode</label>
            <input id={id} type="text" inputMode="numeric" autoComplete="postal-code" maxLength={6} value={value}
                onChange={(event) => onChange(event.target.value.replace(/\D/g, '').slice(0, 6))} placeholder={placeholder} />
            <button type="submit" disabled={checking}>{checking ? 'Checking…' : buttonLabel}</button>
        </form>
        {result && <p className={`${styles.result} ${result.serviceable ? styles.success : styles.error}`} role="status">{result.message}</p>}
    </section>;
}
