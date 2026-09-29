'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowClockwise, Check, MapPin, PencilSimple, Plus, Trash, UserCircle } from '@phosphor-icons/react';
import AddressModal from '../../../components/AddressModal';
import { getAddresses, addAddress, updateAddress, deleteAddress } from '../../../services/addressService';
import { profileTitleClassName } from '../profileTitle';

export default function AddressesPage() {
    const router = useRouter();
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState('');

    useEffect(() => {
        let active = true;
        setLoading(true);
        setLoadError('');
        getAddresses()
            .then(list => { if (active) setAddresses(list); })
            .catch(() => { if (active) setLoadError('Could not load your addresses. Please refresh and try again.'); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [refreshKey]);

    useEffect(() => {
        if (new URLSearchParams(window.location.search).get('add') !== '1') return;
        try {
            if (JSON.parse(localStorage.getItem('userInfo') || 'null')?.token) {
                setEditingAddress(null);
                setIsModalOpen(true);
                window.history.replaceState(null, '', '/profile/addresses');
            }
        } catch { /* The sign-in flow handles an invalid session. */ }
    }, []);

    const openAdd = () => {
        let token;
        try { token = JSON.parse(localStorage.getItem('userInfo') || 'null')?.token; } catch { token = null; }
        if (!token) {
            router.push('/login?redirect=%2Fprofile%2Faddresses%3Fadd%3D1');
            return;
        }
        setEditingAddress(null);
        setSaveError('');
        setIsModalOpen(true);
    };

    const openEdit = address => {
        setEditingAddress(address);
        setSaveError('');
        setIsModalOpen(true);
    };

    const handleSave = async formData => {
        setIsSaving(true);
        setSaveError('');
        try {
            const list = editingAddress
                ? await updateAddress(editingAddress.id, formData)
                : await addAddress(formData);
            setAddresses(list);
            setIsModalOpen(false);
            setEditingAddress(null);
        } catch {
            setSaveError('We couldn’t save this address. Check your connection or sign in, then try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async id => {
        if (!window.confirm('Delete this address?')) return;
        try {
            setAddresses(await deleteAddress(id));
        } catch {
            setLoadError('Could not delete the address. Please try again.');
        }
    };

    const setDefault = async id => {
        try {
            setAddresses(await updateAddress(id, { isDefault: true }));
        } catch {
            setLoadError('Could not change your default address. Please try again.');
        }
    };

    return (
        <section className="w-full bg-white" aria-labelledby="addresses-heading">
            <div>
                <h1 id="addresses-heading" className={profileTitleClassName}>Your Addresses</h1>
            </div>
            <div className="mb-7 mt-3 h-px w-full bg-[#e2e2e2] lg:mb-8" />

            {!loading && !loadError && addresses.length > 0 && (
                <button type="button" onClick={openAdd} className="mb-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#333] px-5 text-sm font-medium text-white transition-colors hover:bg-[#141414] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffcf46]">
                    <Plus size={18} weight="bold" aria-hidden="true" /> Add New Address
                </button>
            )}

            {loading ? (
                <p className="py-12 text-sm text-[#545454]" role="status">Loading your addresses…</p>
            ) : loadError ? (
                <section className="mt-3 flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-[#e2e2e2] bg-[#f6f6f6] px-6 py-10 text-center" role="alert">
                    <span className="mb-6 flex size-20 items-center justify-center rounded-[16px] bg-white text-[#141414]"><MapPin size={38} weight="regular" aria-hidden="true" /></span>
                    <h2 className="text-[24px] font-semibold leading-tight tracking-[-0.03em] text-[#141414] sm:text-[28px]">We couldn’t load your addresses</h2>
                    <p className="mt-2 max-w-[420px] text-[16px] leading-6 text-[#545454]">Please check your connection and try again.</p>
                    <button type="button" onClick={() => setRefreshKey(key => key + 1)} className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#ffcf46] px-6 text-[15px] font-semibold text-[#141414] transition-colors hover:bg-[#f3bf35] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]"><ArrowClockwise size={18} weight="bold" aria-hidden="true" />Try again</button>
                </section>
            ) : addresses.length === 0 ? (
                <section className="mt-3 flex min-h-[340px] flex-col items-center justify-center rounded-2xl border border-[#e2e2e2] bg-[#f6f6f6] px-6 py-10 text-center sm:min-h-[380px] sm:px-10">
                    <span className="mb-6 flex size-20 items-center justify-center rounded-[16px] bg-white text-[#141414]"><MapPin size={38} weight="regular" aria-hidden="true" /></span>
                    <h2 className="text-[24px] font-semibold leading-tight tracking-[-0.03em] text-[#141414] sm:text-[28px]">No addresses yet</h2>
                    <p className="mt-2 max-w-[420px] text-[16px] leading-6 text-[#545454]">Save a delivery address so it’s ready when you check out.</p>
                    <button type="button" onClick={openAdd} className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#ffcf46] px-6 text-[15px] font-semibold text-[#141414] transition-colors hover:bg-[#f3bf35] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]"><Plus size={18} weight="bold" aria-hidden="true" />Add an address</button>
                </section>
            ) : (
                <div className="space-y-3">
                    {addresses.map(address => (
                        <article key={address.id} className={'relative rounded-xl border-2 px-4 py-4 transition-colors sm:px-5 ' + (address.isDefault ? 'border-[#0075ff]' : 'border-[#e2e2e2] hover:border-[#afafaf]')}>
                            {address.isDefault && <span className="absolute right-0 top-0 inline-flex items-center gap-1 rounded-bl-xl rounded-tr-[11px] bg-[#0075ff] px-2 py-1 text-xs font-semibold text-white"><Check size={14} weight="bold" aria-hidden="true" /><span className="sr-only sm:not-sr-only">Default</span></span>}
                            <div className="flex items-start gap-3 pr-10 sm:pr-24">
                                <UserCircle size={30} weight="fill" className="mt-0.5 shrink-0 text-[#333]" aria-hidden="true" />
                                <div className="min-w-0 space-y-1 text-sm text-[#333]">
                                    <p className="font-semibold">{address.name}</p>
                                    <p className="break-words">{address.addressLine}</p>
                                    <p>{[address.city, address.state, address.pincode, address.country || 'India'].filter(Boolean).join(' · ')}</p>
                                    {address.phone && <p className="text-[#757575]">{address.phone}</p>}
                                </div>
                            </div>
                            <div className="mt-4 flex flex-wrap items-center gap-4 sm:absolute sm:bottom-4 sm:right-4 sm:mt-0">
                                {!address.isDefault && <button type="button" onClick={() => setDefault(address.id)} className="text-sm font-medium text-[#333] underline underline-offset-2 hover:text-[#0075ff]">Set as default</button>}
                                <button type="button" onClick={() => openEdit(address)} className="inline-flex min-h-9 items-center gap-1 text-sm font-medium text-[#333] underline underline-offset-2 hover:text-[#0075ff]" aria-label={'Edit address for ' + address.name}><PencilSimple size={17} aria-hidden="true" /> Edit</button>
                                <button type="button" onClick={() => handleDelete(address.id)} className="inline-flex min-h-9 items-center gap-1 text-sm font-medium text-[#333] underline underline-offset-2 hover:text-[#b14413]" aria-label={'Delete address for ' + address.name}><Trash size={17} aria-hidden="true" /> Delete</button>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            <AddressModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                initialData={editingAddress}
                isSubmitting={isSaving}
                saveError={saveError}
            />
        </section>
    );
}
