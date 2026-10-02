"use client";

import { lockBodyScroll } from '../lib/bodyScrollLock.mjs';
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ArrowRight, Check, MapPin, X } from "@phosphor-icons/react";
import { checkServiceability } from "../services/serviceabilityService";
import styles from "./LocationSelector.module.css";

const cities = ["Delhi", "Noida", "Mumbai", "Pune", "Bangalore", "Hyderabad", "Kolkata", "Chennai"];

// Mounted only while open, so unsaved choices are discarded on dismissal.
export default function LocationSelector({ currentLocation, onSave, onClose }) {
    const dialogRef = useRef(null);
    const requestRef = useRef(null);
    const [pincode, setPincode] = useState(currentLocation.match(/^[1-9]\d{5}/)?.[0] || "");
    const [city, setCity] = useState(cities.includes(currentLocation) ? currentLocation : "");
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const dialog = dialogRef.current;
        const trigger = document.activeElement;
        const unlockScroll = lockBodyScroll();
        dialog.showModal();
        return () => {
            requestRef.current?.abort();
            dialog.close();
            unlockScroll();
            if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus();
        };
    }, []);

    const resetFeedback = () => {
        requestRef.current?.abort();
        requestRef.current = null;
        setLoading(false);
        setResult(null);
        setError("");
    };

    const verifyPincode = async () => {
        if (!/^[1-9]\d{5}$/.test(pincode)) {
            setError("Enter a valid 6-digit pincode.");
            return null;
        }
        requestRef.current?.abort();
        const request = new AbortController();
        requestRef.current = request;
        setLoading(true);
        setError("");
        setResult(null);
        try {
            const data = await checkServiceability(pincode, { signal: request.signal });
            if (request.signal.aborted) return null;
            if (typeof data?.serviceable !== "boolean") throw new Error("Invalid serviceability response");
            if (!data.serviceable) {
                setError(data.message || "Delivery is not available for this pincode yet.");
                return null;
            }
            const verified = { pincode, label: [pincode, data.district].filter(Boolean).join(" · ") };
            setResult(verified);
            return verified;
        } catch {
            if (!request.signal.aborted) setError("We couldn’t check delivery right now. Please try again.");
            return null;
        } finally {
            if (requestRef.current === request) setLoading(false);
        }
    };

    const continueWithLocation = async () => {
        if (loading) return;
        if (pincode) {
            const verified = result?.pincode === pincode ? result : await verifyPincode();
            if (verified) onSave(verified.label);
        } else if (city) {
            onSave(city);
        }
    };

    return createPortal(
        <dialog
            ref={dialogRef}
            className={styles.dialog}
            aria-labelledby="location-title"
            aria-describedby="location-description"
            onCancel={(event) => { event.preventDefault(); onClose(); }}
            onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
        >
            <div className={styles.panel}>
                <header className={styles.header}>
                    <span className={styles.pin}><MapPin size={25} weight="duotone" aria-hidden="true" /></span>
                    <button type="button" className={styles.close} aria-label="Close location selector" onClick={onClose} autoFocus>
                        <X size={21} aria-hidden="true" />
                    </button>
                    <h2 id="location-title">Where are you renting?</h2>
                    <p id="location-description">Choose your city or check delivery to your pincode.</p>
                </header>

                <div className={styles.content}>
                    <form onSubmit={(event) => { event.preventDefault(); if (!loading) void verifyPincode(); }} noValidate>
                        <label htmlFor="delivery-pincode" className={styles.label}>Delivery pincode</label>
                        <div className={styles.inputGroup}>
                            <MapPin size={20} aria-hidden="true" />
                            <input
                                id="delivery-pincode"
                                type="text"
                                inputMode="numeric"
                                autoComplete="postal-code"
                                maxLength={6}
                                placeholder="Enter 6-digit pincode"
                                value={pincode}
                                aria-invalid={Boolean(error)}
                                aria-describedby="location-feedback"
                                onChange={(event) => {
                                    resetFeedback();
                                    setPincode(event.target.value.replace(/\D/g, ""));
                                    setCity("");
                                }}
                            />
                            <button type="submit" disabled={loading} aria-label="Check delivery pincode">{loading ? "Checking…" : "Check"}</button>
                        </div>
                        <div id="location-feedback" className={styles.feedback} aria-live="polite" aria-atomic="true">
                            {error ? <p role="alert">{error}</p> : result ? <p><Check size={16} aria-hidden="true" /> Delivery available for {result.label}</p> : currentLocation ? <p>Current location: <strong>{currentLocation}</strong></p> : <p>Check availability before choosing your rental.</p>}
                        </div>
                    </form>

                    <div className={styles.divider}><span>Or choose your city</span></div>
                    <div className={styles.cities} role="group" aria-label="Choose your delivery city">
                        {cities.map((name) => (
                            <button
                                key={name}
                                type="button"
                                className={styles.city}
                                aria-pressed={city === name}
                                onClick={() => { resetFeedback(); setCity(name); setPincode(""); }}
                            >
                                <span className={styles.artwork}>
                                    <Image src={`/images/cities/${name.toLowerCase()}.png`} alt="" width={96} height={96} />
                                    {city === name && <span className={styles.check}><Check size={12} weight="bold" aria-hidden="true" /></span>}
                                </span>
                                <span>{name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <footer className={styles.footer}>
                    <p>{city ? `Selected: ${city}. Check your exact pincode for delivery availability.` : "Your delivery address can be added at checkout."}</p>
                    <button type="button" className={styles.continue} disabled={loading || (!city && !pincode)} onClick={continueWithLocation}>
                        {loading ? "Checking delivery…" : "Continue"}<ArrowRight size={19} aria-hidden="true" />
                    </button>
                </footer>
            </div>
        </dialog>,
        document.body
    );
}
