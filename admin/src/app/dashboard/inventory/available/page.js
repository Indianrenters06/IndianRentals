'use client';

import { motion } from "framer-motion";
import { Card, CardBody, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Input } from "@heroui/react";
import { Package, CheckCircle, MagnifyingGlass, ArrowRight } from "@phosphor-icons/react";

const STOCK = [
    { id: 1, name: "Sony A7R IV", sku: "CAM-SY-001", location: "Warehouse A", status: "Ready" },
    { id: 2, name: "Canon R5", sku: "CAM-CN-005", location: "Warehouse B", status: "Ready" },
    { id: 3, name: "MacBook Pro M2", sku: "LAP-AP-022", location: "Warehouse A", status: "In Inspection" },
];

export default function AvailableStock() {
    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Available <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Stock</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Inventory items currently ready for immediate fulfillment.</p>
                </motion.div>
            </div>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <CardBody className="p-0">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 bg-slate-50 dark:bg-slate-950/30">
                        <div className="relative group flex-1 max-w-md">
                            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by SKU or Item Name..."
                                className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 h-11"
                            />
                        </div>
                    </div>
                    <Table
                        aria-label="Available stock table"
                        classNames={{
                            wrapper: "p-0 rounded-none shadow-none bg-transparent",
                            th: "bg-slate-50 dark:bg-slate-950/80 uppercase text-xs font-bold h-12 pt-0 px-6",
                            td: "py-4 px-6 border-b border-slate-100 dark:border-slate-800/50"
                        }}
                    >
                        <TableHeader>
                            <TableColumn>ITEM NAME</TableColumn>
                            <TableColumn>SKU ID</TableColumn>
                            <TableColumn>CURRENT LOCATION</TableColumn>
                            <TableColumn>CONDITION</TableColumn>
                            <TableColumn align="center">STATUS</TableColumn>
                        </TableHeader>
                        <TableBody items={STOCK} emptyContent="No available items found.">
                            {(item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-semibold">{item.name}</TableCell>
                                    <TableCell className="font-mono text-xs text-slate-500 tracking-wider font-bold uppercase">{item.sku}</TableCell>
                                    <TableCell className="text-sm font-medium">{item.location}</TableCell>
                                    <TableCell>
                                        <Chip size="sm" variant="flat" color="secondary" className="font-bold">Excellent</Chip>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center flex-col items-center gap-1">
                                            <Chip size="sm" color={item.status === 'Ready' ? 'success' : 'warning'} variant="dot" className="border-none">{item.status}</Chip>
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
