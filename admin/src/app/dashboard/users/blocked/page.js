'use client';

import { motion } from "framer-motion";
import { Card, CardBody, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Avatar } from "@heroui/react";
import { Prohibit, WarningCircle, ArrowCounterClockwise } from "@phosphor-icons/react";

const BLOCKED = [
    { id: 1, name: "Vikram Singh", reason: "Multiple Payment Failures", date: "Oct 1, 2023" },
    { id: 2, name: "Anita Rao", reason: "Policy Violation", date: "Sep 25, 2023" },
];

export default function BlockedUsers() {
    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Blocked <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Accounts</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Manage users who have been temporarily or permanently restricted.</p>
                </motion.div>
            </div>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <CardBody className="p-0">
                    <Table
                        aria-label="Blocked users table"
                        classNames={{
                            wrapper: "p-0 rounded-none shadow-none bg-transparent",
                            th: "bg-slate-50 dark:bg-slate-950/80 uppercase text-xs font-bold h-12 pt-0 px-6",
                            td: "py-4 px-6 border-b border-slate-100 dark:border-slate-800/50"
                        }}
                    >
                        <TableHeader>
                            <TableColumn>RESTRICTED USER</TableColumn>
                            <TableColumn>REASON FOR BLOCK</TableColumn>
                            <TableColumn>BLOCKED ON</TableColumn>
                            <TableColumn align="center">ACTIONS</TableColumn>
                        </TableHeader>
                        <TableBody items={BLOCKED} emptyContent="No blocked accounts currently.">
                            {(user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar name={user.name.charAt(0)} size="sm" className="bg-rose-500/10 text-rose-600 font-bold" />
                                            <span className="text-sm font-semibold">{user.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-sm text-slate-500 italic">
                                            <WarningCircle className="text-rose-500" /> {user.reason}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs font-bold uppercase tracking-widest text-slate-400">{user.date}</TableCell>
                                    <TableCell>
                                        <div className="flex justify-center">
                                            <Button size="sm" color="success" variant="flat" className="font-bold h-7" startContent={<ArrowCounterClockwise />}>Restore Access</Button>
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
