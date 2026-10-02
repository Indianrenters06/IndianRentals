"use client";
import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AuthCard from "./AuthCard";
import useModalFocus from "@/lib/useModalFocus";

// Navbar sign-in pop-up: the shared Figma AuthCard on a dimmed backdrop.
const AuthModal = ({ isOpen, onClose, initialView = "login" }) => {
    const panelRef = useRef(null);
    useModalFocus({ isOpen, onClose, panelRef });

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
                    />
                    <div className="fixed inset-0 flex items-center justify-center p-4 z-[70] pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            ref={panelRef}
                            tabIndex={-1}
                            className="pointer-events-auto w-full max-h-[calc(100dvh-32px)] overflow-y-auto overscroll-contain flex justify-center"
                            role="dialog"
                            aria-modal="true"
                            aria-label="Sign in or create an account"
                        >
                            <AuthCard initialView={initialView} onClose={onClose} onSuccess={onClose} />
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AuthModal;
