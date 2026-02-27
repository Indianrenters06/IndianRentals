'use client';

import { motion } from "framer-motion";
import { Card, CardBody, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip } from "@heroui/react";
import { CurrencyInr, Calendar, ArrowDownRight, CheckCircle } from "@phosphor-icons/react";

const PAYMENTS = [
    { id: 1, amount: "₹4,500", method: "UPI", status: "Success", user: "Rahul Sharma", date: "Today" },
    { id: 2, amount: "₹12,200", method: "Credit Card", status: "Pending", user: "Sneha Menon", date: "Yesterday" },
    { id: 3, amount: "₹850", method: "Wallet", status: "Success", user: "Amit Kumar", date: "2 days ago" },
];

export default function UserPayments() {
    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Payment <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">History</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Complete audit log of all financial transactions on the platform.</p>
                </motion.div>

                <div className="flex gap-2">
                    <Button color="success" variant="flat" className="font-bold border border-indigo-500 text-indigo-600 dark:text-indigo-400" startContent={<Calendar />}>Export Report</Button>
                </div>
            </div>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <CardBody className="p-0">
                    <Table
                        aria-label="Payment history table"
                        classNames={{
                            wrapper: "p-0 rounded-none shadow-none bg-transparent",
                            th: "bg-slate-50 dark:bg-slate-950/80 uppercase text-xs font-bold h-12 pt-0 px-6",
                            td: "py-4 px-6 border-b border-slate-100 dark:border-slate-800/50"
                        }}
                    >
                        <TableHeader>
                            <TableColumn>PAYMENT FROM</TableColumn>
                            <TableColumn>AMOUNT</TableColumn>
                            <TableColumn>METHOD</TableColumn>
                            <TableColumn>DATE</TableColumn>
                            <TableColumn align="center">STATUS</TableColumn>
                        </TableHeader>
                        <TableBody items={PAYMENTS} emptyContent="No transactions found.">
                            {(item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-semibold">{item.user}</TableCell>
                                    <TableCell className="font-bold text-slate-900 dark:text-white">{item.amount}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                            <CurrencyInr className="text-indigo-500" /> {item.method}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-slate-500">{item.date}</TableCell>
                                    <TableCell>
                                        <div className="flex justify-center">
                                            <Chip
                                                size="sm"
                                                color={item.status === 'Success' ? 'success' : 'warning'}
                                                variant="flat"
                                                className="font-bold"
                                                startContent={item.status === 'Success' ? <CheckCircle weight="bold" /> : <ArrowDownRight weight="bold" />}
                                            >
                                                {item.status}
                                            </Chip>
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
