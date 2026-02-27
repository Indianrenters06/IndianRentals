'use client';

import { motion } from "framer-motion";
import { Card, CardBody, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Avatar } from "@heroui/react";
import { Cards, ArrowUpRight, Plus } from "@phosphor-icons/react";

const WALLETS = [
    { id: 1, name: "Rahul Sharma", balance: "₹1,240", lastUsed: "Dec 1, 2023" },
    { id: 2, name: "Sneha Menon", balance: "₹45,000", lastUsed: "Dec 10, 2023" },
    { id: 3, name: "Amit Kumar", balance: "₹0", lastUsed: "Never" },
];

export default function UserWallet() {
    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Wallet <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">System</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Manage user balances, deposit summaries, and in-platform currency.</p>
                </motion.div>
                <Button color="primary" variant="shadow" className="font-bold bg-indigo-600 shadow-indigo-500/20 px-6" startContent={<Plus weight="bold" />}>Add Credit</Button>
            </div>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <CardBody className="p-0">
                    <Table
                        aria-label="User wallets table"
                        classNames={{
                            wrapper: "p-0 rounded-none shadow-none bg-transparent",
                            th: "bg-slate-50 dark:bg-slate-950/80 uppercase text-xs font-bold h-12 pt-0 px-6",
                            td: "py-4 px-6 border-b border-slate-100 dark:border-slate-800/50"
                        }}
                    >
                        <TableHeader>
                            <TableColumn>WALLET OWNER</TableColumn>
                            <TableColumn>AVAILABLE BALANCE</TableColumn>
                            <TableColumn>LAST TRANSACTION</TableColumn>
                            <TableColumn align="center">STATUS</TableColumn>
                            <TableColumn align="center">HISTORY</TableColumn>
                        </TableHeader>
                        <TableBody items={WALLETS} emptyContent="No wallet data found.">
                            {(item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar name={item.name.charAt(0)} size="sm" className="bg-indigo-500/10 text-indigo-600 font-bold" />
                                            <span className="text-sm font-semibold">{item.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-bold text-lg text-indigo-600 dark:text-indigo-400">{item.balance}</TableCell>
                                    <TableCell className="text-xs font-medium text-slate-500 uppercase tracking-wider">{item.lastUsed}</TableCell>
                                    <TableCell>
                                        <div className="flex justify-center">
                                            <Chip size="sm" color={item.balance === '₹0' ? 'default' : 'success'} variant="flat" className="font-bold">
                                                {item.balance === '₹0' ? 'Inactive' : 'Active'}
                                            </Chip>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center">
                                            <Button isIconOnly size="sm" variant="light" color="secondary" className="text-indigo-500"><ArrowUpRight /></Button>
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
