"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone } from "@phosphor-icons/react";

// Pages where the CTA should NOT appear
const HIDDEN_PATHS = ["/cart", "/checkout", "/login", "/register", "/order-confirmation"];

export default function StickyMobileCTA() {
    const pathname = usePathname() || "";
    const [visible, setVisible] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    // Show after user has scrolled 200px — don't distract on initial load
    useEffect(() => {
        const onScroll = () => {
            if (window.scrollY > 200) {
                setVisible(true);
            }
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Reset dismissed state on page change
    useEffect(() => {
        setDismissed(false);
        setVisible(false);
    }, [pathname]);

    // Hide on specific pages
    const isHidden =
        dismissed ||
        !visible ||
        HIDDEN_PATHS.some((p) => pathname.startsWith(p)) ||
        pathname.startsWith("/profile") ||
        pathname.startsWith("/admin");

    return (
        <AnimatePresence>
            {!isHidden && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-0 left-0 right-0 z-[990] md:hidden"
                    style={{
                        background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
                        borderTop: "1px solid rgba(255,207,70,0.3)",
                        boxShadow: "0 -4px 24px rgba(0,0,0,0.25)",
                    }}
                >
                    {/* Dismiss button */}
                    <button
                        onClick={() => setDismissed(true)}
                        className="absolute top-2 right-3 text-gray-400 hover:text-white transition-colors"
                        aria-label="Dismiss CTA"
                    >
                        <X size={16} />
                    </button>

                    <div className="flex items-center gap-3 px-4 py-3.5 pr-8">
                        {/* Icon */}
                        <div
                            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                            style={{ background: "rgba(255,207,70,0.15)", border: "1px solid rgba(255,207,70,0.4)" }}
                        >
                            <Phone size={18} weight="fill" color="#FFCF46" />
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                            <p className="text-white text-xs font-semibold leading-tight">
                                Need help choosing?
                            </p>
                            <p className="text-gray-400 text-[10px] leading-tight mt-0.5">
                                Talk to our rental experts — free advice!
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex items-center gap-2 shrink-0">
                            <Link
                                href="/products"
                                className="text-[11px] font-medium text-gray-300 whitespace-nowrap px-3 py-1.5 rounded-full border border-gray-600 hover:border-gray-400 transition-colors"
                            >
                                Browse
                            </Link>
                            <Link
                                href="/contact"
                                className="text-[11px] font-bold text-black whitespace-nowrap px-3 py-1.5 rounded-full transition-all hover:opacity-90 active:scale-95"
                                style={{ background: "#FFCF46" }}
                            >
                                Get Quote
                            </Link>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
