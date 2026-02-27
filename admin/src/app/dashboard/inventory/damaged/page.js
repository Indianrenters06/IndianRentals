'use client';

import { motion } from "framer-motion";
import { Card, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Button } from "@heroui/react";
import { Warning, Wrench, Trash } from "@phosphor-icons/react";

const DAMAGED = [
    { id: 1, item: "Canon R5 Body", issue: "Sensor Damage", severity: "High", estimate: "₹18,500", status: "In Repair" },
    { id: 2, item: "LED Panel 600", issue: "Frame cracked", severity: "Low", estimate: "₹2,200", status: "Pending Quote" },
];

export default function DamagedInventory() {
    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Damaged <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Inventory</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Manage assets requiring repair, insurance claims, or disposal.</p>
                </motion.div>
            </div>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <CardBody className="p-0">
                    <Table
                        aria-label="Damaged items table"
                        classNames={{
                            wrapper: "p-0 rounded-none shadow-none bg-transparent",
                            th: "bg-slate-50 dark:bg-slate-950/80 uppercase text-xs font-bold h-12 pt-0 px-6",
                            td: "py-4 px-6 border-b border-slate-100 dark:border-slate-800/50"
                        }}
                    >
                        <TableHeader>
                            <TableColumn>DAMAGED PRODUCT</TableColumn>
                            <TableColumn>NATURE OF ISSUE</TableColumn>
                            <TableColumn>SEVERITY</TableColumn>
                            <TableColumn>EST. REPAIR COST</TableColumn>
                            <TableColumn align="center">REPAIR STATUS</TableColumn>
                        </TableHeader>
                        <TableBody items={DAMAGED} emptyContent="No damaged items recorded.">
                            {(item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-semibold">{item.item}</TableCell>
                                    <TableCell className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                        <div className="flex items-center gap-2">
                                            <Warning className="text-rose-500" weight="bold" /> {item.issue}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Chip size="sm" color={item.severity === 'High' ? 'danger' : 'warning'} variant="flat">{item.severity}</Chip>
                                    </TableCell>
                                    <TableCell className="font-bold">
                                        {item.estimate}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center flex-col items-center">
                                            <Button size="sm" color="secondary" variant="flat" startContent={<Wrench weight="bold" />} className="font-bold h-7 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                                {item.status}
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
