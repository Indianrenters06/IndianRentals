'use client';

import { motion } from "framer-motion";
import { Card, CardBody, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Divider } from "@heroui/react";
import { Plus, CurrencyInr, Zap, Target, Package } from "@phosphor-icons/react";

const PLANS = [
    { id: 1, name: "Daily Essential", basePrice: "₹199", billing: "Per Day", status: "Active", items: 45 },
    { id: 2, name: "Weekly Pro", basePrice: "₹999", billing: "Per Week", status: "Active", items: 12 },
    { id: 3, name: "Monthly Builder", basePrice: "₹2,499", billing: "Per Month", status: "Inactive", items: 0 },
];

export default function PricingPlans() {
    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Pricing <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Plans</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Configure flexible rental durations and subscription models.</p>
                </motion.div>

                <Button color="primary" variant="shadow" className="bg-indigo-600 shadow-indigo-500/30 font-bold" startContent={<Plus weight="bold" />}>
                    Create Plan
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {PLANS.map((plan, idx) => (
                    <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-violet-500/50 transition-all duration-300">
                            <CardBody className="p-6 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="p-3 bg-indigo-100 dark:bg-indigo-500/10 rounded-2xl text-indigo-600">
                                        <Zap size={24} weight="fill" />
                                    </div>
                                    <Chip size="sm" color={plan.status === 'Active' ? 'success' : 'default'} variant="flat">{plan.status}</Chip>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold"> {plan.name}</h3>
                                    <div className="flex items-baseline gap-1 mt-1">
                                        <span className="text-2xl font-black text-slate-900 dark:text-white">{plan.basePrice}</span>
                                        <span className="text-sm text-slate-500">{plan.billing}</span>
                                    </div>
                                </div>
                                <Divider className="opacity-50" />
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                        <Package className="shrink-0" />
                                        <span>{plan.items} products using this plan</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                        <Target className="shrink-0" />
                                        <span>Standard security deposit applies</span>
                                    </div>
                                </div>
                                <Button fullWidth variant="flat" color="primary" className="mt-2 text-slate-900 dark:text-white">Edit Details</Button>
                            </CardBody>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <CardBody className="p-0">
                    <Table aria-label="Detailed plans" classNames={{ wrapper: "p-0 rounded-none shadow-none bg-transparent", th: "bg-slate-50 dark:bg-slate-950/80 uppercase text-xs font-bold h-12 pt-0" }}>
                        <TableHeader>
                            <TableColumn>PLAN NAME</TableColumn>
                            <TableColumn>BILLING CYCLE</TableColumn>
                            <TableColumn>BASE RATE</TableColumn>
                            <TableColumn align="center">ACTIONS</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {PLANS.map(p => (
                                <TableRow key={p.id}>
                                    <TableCell className="font-semibold">{p.name}</TableCell>
                                    <TableCell>{p.billing}</TableCell>
                                    <TableCell className="text-emerald-500 font-bold">{p.basePrice}</TableCell>
                                    <TableCell>
                                        <div className="flex justify-center gap-2">
                                            <Button isIconOnly size="sm" variant="light" className="text-indigo-500"><CurrencyInr weight="bold" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>
        </div>
    );
}
