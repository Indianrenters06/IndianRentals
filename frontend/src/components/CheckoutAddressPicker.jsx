'use client';

import { useId } from 'react';
import Image from 'next/image';
import s from './CheckoutAddressPicker.module.css';

export default function CheckoutAddressPicker({ addresses, selectedId, onSelect, onAdd, onEdit, onDelete, disabled = false, children }) {
    const id = useId();
    return <section className={s.section} aria-labelledby={`${id}-heading`}>
        <header className={s.header}><h2 id={`${id}-heading`}>Your Addresses</h2><div className={s.divider} aria-hidden="true" /></header>
        <button type="button" className={s.addButton} disabled={disabled} onClick={onAdd}><Image src="/images/checkout-address/plus.svg" alt="" width={20} height={20} unoptimized />Add New Address</button>
        <div className={s.list} role="radiogroup" aria-label="Delivery address">
            {addresses.map(address => {
                const key = address._id || address.id;
                const selected = key === selectedId;
                const parts = [address.addressLine, [address.city, address.state].filter(Boolean).join(', '), address.pincode, address.country || 'India'].filter(Boolean);
                return <div key={key} className={`${s.card} ${selected ? s.selected : ''}`}>
                    <input type="radio" name={`${id}-address`} className={s.radio} checked={selected} disabled={disabled} onChange={() => onSelect(address)} aria-label={`Deliver to ${address.name}, ${parts.join(', ')}`} />
                    <div className={s.details}><Image src="/images/checkout-address/recipient.svg" alt="" width={40} height={40} unoptimized className={s.recipient} /><div className={s.copy}>
                        <div className={s.name}><strong>{address.name}</strong>{address.isDefault && <span className={s.defaultTag}>Default</span>}</div>
                        <p className={s.address}>{parts.map((part, index) => <span key={index}>{index > 0 && <span className={s.separator} aria-hidden="true" />}<span>{part}</span></span>)}</p>
                        <p className={s.phone}>{address.phone}</p>
                    </div></div>
                    <div className={s.actions}>
                        {onDelete && <button type="button" className={s.deleteButton} disabled={disabled} aria-label={`Delete address for ${address.name}`} onClick={() => onDelete(address)}><Image src="/images/checkout-address/delete.svg" alt="" width={34} height={35.5} unoptimized /></button>}
                        <button type="button" className={s.editButton} disabled={disabled} aria-label={`Edit address for ${address.name}`} onClick={() => onEdit(address)}>Click to Edit</button>
                    </div>
                    {selected && <span className={s.corner} aria-hidden="true"><Image src="/images/checkout-address/selected.svg" alt="" width={16} height={16} unoptimized /></span>}
                </div>;
            })}
        </div>
        {children}
    </section>;
}
