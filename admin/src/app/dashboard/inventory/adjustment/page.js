'use client';

import { motion } from "framer-motion";
import { Card, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Button } from "@heroui/react";
import { Plus, ArrowRight } from "@phosphor-icons/react";

const LOGS = [
    { id: 1, item: "Sony A7R IV", type: "Manual Entry", change: "+2", reason: "Procurement Sync", date: "Today" },
    { id: 2, item: "MacBook Pro M2", type: "Correction", change: "-1", reason: "Stock Mismatch", date: "Yesterday" },
];

export default function StockAdjustment() {
    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Stock <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Adjustment</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Manually adjust inventory levels and track the history of changes.</p>
                </motion.div>

                <Button color="primary" variant="shadow" className="font-bold bg-indigo-600 shadow-indigo-500/20 px-6" startContent={<Plus weight="bold" />}>
                    New Adjustment
                </Button>
            </div>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <CardBody className="p-0">
                    <Table
                        aria-label="Stock adjustment table"
                        classNames={{
                            wrapper: "p-0 rounded-none shadow-none bg-transparent",
                            th: "bg-slate-50 dark:bg-slate-950/80 uppercase text-xs font-bold h-12 pt-0 px-6",
                            td: "py-4 px-6 border-b border-slate-100 dark:border-slate-800/50"
                        }}
                    >
                        <TableHeader>
                            <TableColumn>PRODUCT</TableColumn>
                            <TableColumn>METHOD</TableColumn>
                            <TableColumn>QUANTITY CHANGE</TableColumn>
                            <TableColumn>REASON / NOTE</TableColumn>
                            <TableColumn align="center">DATE</TableColumn>
                        </TableHeader>
                        <TableBody items={LOGS} emptyContent="No adjustments logged.">
                            {(item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-semibold">{item.item}</TableCell>
                                    <TableCell>
                                        <Chip size="sm" variant="flat" className="bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold uppercase tracking-wider">{item.type}</Chip>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`font-bold ${item.change.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{item.change}</span>
                                    </TableCell>
                                    <TableCell className="text-sm italic text-slate-500">{item.reason}</TableCell>
                                    <TableCell className="text-xs font-bold uppercase tracking-widest text-slate-400">{item.date}</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>
        </div>
    );
}
