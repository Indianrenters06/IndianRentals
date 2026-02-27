'use client';

import { motion } from "framer-motion";
import { Card, CardBody, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip } from "@heroui/react";
import { ShieldSlash, MagnifyingGlass, Warning } from "@phosphor-icons/react";

const BLACKLIST = [
    { id: 1, identifier: "9876543210", type: "Phone Number", reason: "Fraudulent Identity", date: "Jan 12, 2023" },
    { id: 2, identifier: "scammer@junk.com", type: "Email Address", reason: "Security Threat", date: "Mar 05, 2023" },
];

export default function BlacklistManagement() {
    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Security <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Blacklist</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Manage identifiers banned from accessing platform services.</p>
                </motion.div>
                <Button color="danger" variant="shadow" className="font-bold bg-rose-600 shadow-rose-500/20 px-6" startContent={<ShieldSlash weight="bold" />}>Add to Blacklist</Button>
            </div>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <CardBody className="p-0">
                    <Table
                        aria-label="Blacklist table"
                        classNames={{
                            wrapper: "p-0 rounded-none shadow-none bg-transparent",
                            th: "bg-slate-50 dark:bg-slate-950/80 uppercase text-xs font-bold h-12 pt-0 px-6",
                            td: "py-4 px-6 border-b border-slate-100 dark:border-slate-800/50"
                        }}
                    >
                        <TableHeader>
                            <TableColumn>BLOCKED IDENTIFIER</TableColumn>
                            <TableColumn>TYPE</TableColumn>
                            <TableColumn>REASON</TableColumn>
                            <TableColumn>LISTED ON</TableColumn>
                            <TableColumn align="center">ACTION</TableColumn>
                        </TableHeader>
                        <TableBody items={BLACKLIST} emptyContent="Security perimeter clear. No active blacklists.">
                            {(item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-mono text-sm font-bold text-rose-600 dark:text-rose-400">{item.identifier}</TableCell>
                                    <TableCell>
                                        <Chip size="sm" variant="flat" className="font-bold uppercase tracking-wider">{item.type}</Chip>
                                    </TableCell>
                                    <TableCell className="text-sm font-medium text-slate-500">{item.reason}</TableCell>
                                    <TableCell className="text-xs text-slate-400 font-bold">{item.date}</TableCell>
                                    <TableCell>
                                        <div className="flex justify-center">
                                            <Button size="sm" color="default" variant="light" className="font-bold h-7">Remove</Button>
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
