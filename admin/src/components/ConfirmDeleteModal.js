'use client';
import { AnimatePresence, motion } from "framer-motion";
import { Spinner } from "@heroui/react";
import { Warning, Trash } from "@phosphor-icons/react";

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, title, description, loading }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 10 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        className="relative z-10 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-7 max-w-sm w-full"
                    >
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
                                <Warning size={32} weight="duotone" className="text-red-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">{title}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
                            </div>
                            <div className="flex gap-3 w-full pt-1">
                                <button
                                    onClick={onClose}
                                    disabled={loading}
                                    className="flex-1 h-11 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:!bg-slate-50 dark:hover:!bg-slate-800 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onConfirm}
                                    disabled={loading}
                                    className="flex-1 h-11 rounded-2xl !bg-red-600 hover:!bg-red-700 text-white text-sm font-bold shadow-lg shadow-red-500/25 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading ? <Spinner size="sm" color="white" /> : <Trash size={15} weight="bold" />}
                                    {loading ? "Deleting…" : "Delete"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
