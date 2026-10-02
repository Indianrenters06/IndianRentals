"use client";
import { useEffect, useRef, useState } from "react";
import { useConsent } from "./CookieConsent";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X } from "@phosphor-icons/react";
import styles from "./StickyMobileCTA.module.css";

const HIDDEN_PATHS = ["/cart", "/checkout", "/login", "/register", "/order-confirmation", "/careers", "/contact", "/contact-demo"];

export default function StickyMobileCTA() {
    const pathname = usePathname() || "";
    return <RouteCTA key={pathname} pathname={pathname} />;
}

function RouteCTA({ pathname }) {
    const { consentVisible } = useConsent();
    const [visible, setVisible] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const barRef = useRef(null);
    const spacerRef = useRef(null);
    const reduceMotion = useReducedMotion();

    useEffect(() => {
        let active = true;
        const onScroll = () => {
            if (active && window.scrollY > 200) setVisible(true);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        queueMicrotask(onScroll);
        return () => {
            active = false;
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    const isHidden = consentVisible || dismissed || !visible ||
        HIDDEN_PATHS.some((path) => pathname.startsWith(path)) ||
        pathname.startsWith("/profile") || pathname.startsWith("/admin");

    // Match the actual responsive height so footer links remain reachable.
    useEffect(() => {
        if (isHidden || !barRef.current) return;
        const bar = barRef.current;
        const spacer = spacerRef.current;
        const reserveSpace = () => {
            if (spacer) spacer.style.height = `${bar.getBoundingClientRect().height}px`;
        };
        const observer = new ResizeObserver(reserveSpace);
        observer.observe(bar);
        reserveSpace();
        return () => {
            observer.disconnect();
            if (spacer) spacer.style.height = "0px";
        };
    }, [isHidden]);

    return <>
        <div ref={spacerRef} className={styles.spacer} aria-hidden="true" />
        <AnimatePresence>
            {!isHidden && <motion.div
                ref={barRef}
                role="region"
                aria-label="Rental help"
                initial={reduceMotion ? false : { y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 30 }}
                className={styles.bar}
            >
                <div className={styles.inner}>
                    <button type="button" onClick={() => setDismissed(true)} className={styles.dismiss} aria-label="Dismiss rental help">
                        <X size={20} aria-hidden="true" />
                    </button>
                    <div className={styles.content}>
                        <Image src="/images/rental-help-headset-v1.webp" width={56} height={56} unoptimized loading="eager" className={styles.illustration} alt="" />
                        <div className={styles.copy}>
                            <p className={styles.title}>Need help choosing?</p>
                            <p className={styles.description}>Free advice from our rental experts.</p>
                        </div>
                        <div className={styles.actions}>
                            <Link href="/products" className={styles.browse}>Browse</Link>
                            <Link href="/contact" className={styles.quote}>Get Quote</Link>
                        </div>
                    </div>
                </div>
            </motion.div>}
        </AnimatePresence>
    </>;
}
