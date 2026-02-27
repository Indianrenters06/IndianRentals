'use client';

import { motion } from "framer-motion";
import { Card, CardBody, Button, Spinner } from "@heroui/react";
import { ShoppingCart, Calendar } from "@phosphor-icons/react";

export default function RentalHistory() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Rental <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">History</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Track all active and past rentals across the user base.</p>
                </motion.div>
            </div>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <CardBody className="py-20 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center mb-4 text-indigo-500">
                        <Calendar size={24} weight="bold" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Aggregating History</h3>
                    <p className="text-slate-500 max-w-sm mt-2">Loading rental durations, returns, and extensions...</p>
                    <Spinner className="mt-4" />
                </CardBody>
            </Card>
        </div>
    );
}
