'use client';

import { motion } from "framer-motion";
import { Card, CardBody, Chip } from "@heroui/react";
import { Wrench } from "@phosphor-icons/react";

export default function ComingSoon({ title, subtitle, icon: Icon = Wrench }) {
    return (
        <div className="w-full space-y-6 pb-12">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">{title}</h1>
                <p className="text-slate-600 dark:text-slate-400">{subtitle}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardBody className="py-24 flex flex-col items-center justify-center text-center gap-5">
                        <div className="w-20 h-20 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-500 shadow-inner">
                            <Icon size={36} weight="duotone" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Coming Soon</h3>
                            <p className="text-slate-500 max-w-sm">This section is currently being built. Check back shortly for the full feature.</p>
                        </div>
                        <Chip color="warning" variant="flat" className="font-bold mt-2">🚧 Under Development</Chip>
                    </CardBody>
                </Card>
            </motion.div>
        </div>
    );
}
