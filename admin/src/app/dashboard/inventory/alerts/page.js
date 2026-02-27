'use client';

import { motion } from "framer-motion";
import { Card, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Button } from "@heroui/react";
import { WarningCircle, TrendDown, ShoppingCart } from "@phosphor-icons/react";

const ALERTS = [
    { id: 1, item: "Sony A7R IV", type: "Low Stock", message: "Only 2 units remaining in Warehouse A.", priority: "High" },
    { id: 2, item: "Batteries NP-FZ100", type: "Reorder Point", message: "Refill stock to maintain availability.", priority: "Medium" },
];

export default function InventoryAlerts() {
    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Inventory <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Alerts</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Critical notifications about stock levels, expiry, and reordering requirements.</p>
                </motion.div>

                <Button color="primary" variant="flat" className="font-bold border px-6 border-indigo-500 text-indigo-500" startContent={<ShoppingCart weight="bold" />}>
                    Settings & Thresholds
                </Button>
            </div>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <CardBody className="p-0">
                    <Table
                        aria-label="Inventory alerts table"
                        classNames={{
                            wrapper: "p-0 rounded-none shadow-none bg-transparent",
                            th: "bg-slate-50 dark:bg-slate-950/80 uppercase text-xs font-bold h-12 pt-0 px-6",
                            td: "py-4 px-6 border-b border-slate-100 dark:border-slate-800/50"
                        }}
                    >
                        <TableHeader>
                            <TableColumn>ITEM UNDER ALERT</TableColumn>
                            <TableColumn>ALERT TYPE</TableColumn>
                            <TableColumn>DESCRIPTION</TableColumn>
                            <TableColumn align="center">PRIORITY</TableColumn>
                            <TableColumn align="center">ACTION</TableColumn>
                        </TableHeader>
                        <TableBody items={ALERTS} emptyContent="System healthy. No active alerts.">
                            {(item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-semibold text-slate-900 dark:text-slate-200">{item.item}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-tight text-slate-500">
                                            <TrendDown className="text-rose-500" weight="bold" /> {item.type}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm italic text-slate-500">{item.message}</TableCell>
                                    <TableCell>
                                        <Chip size="sm" color={item.priority === 'High' ? 'danger' : 'warning'} variant="flat" className="font-bold tracking-widest">{item.priority}</Chip>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center flex-col items-center">
                                            <Button size="sm" color="primary" variant="shadow" className="font-bold h-7 bg-indigo-600 shadow-indigo-500/20">
                                                Order Stock
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>
        </div>
    );
}
