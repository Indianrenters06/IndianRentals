'use client';

import { motion } from "framer-motion";
import { Card, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Button } from "@heroui/react";
import { ArrowsClockwise, CheckCircle, WarningCircle } from "@phosphor-icons/react";

const RETURNED = [
    { id: 1, item: "Sony A7R IV", returnedBy: "Rahul Sharma", condition: "Excellent", processed: true, date: "Today, 10:30 AM" },
    { id: 2, item: "DJI Mavic Air 2", returnedBy: "Priya Desai", condition: "Minor Scratches", processed: false, date: "Yesterday" },
    { id: 3, item: "Zoom H6 Recorder", returnedBy: "Amit Kumar", condition: "Excellent", processed: true, date: "2 days ago" },
];

export default function ReturnedInventory() {
    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Returned <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Items</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Process and inspect items returned by customers.</p>
                </motion.div>
            </div>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <CardBody className="p-0">
                    <Table
                        aria-label="Returned items table"
                        classNames={{
                            wrapper: "p-0 rounded-none shadow-none bg-transparent",
                            th: "bg-slate-50 dark:bg-slate-950/80 uppercase text-xs font-bold h-12 pt-0 px-6",
                            td: "py-4 px-6 border-b border-slate-100 dark:border-slate-800/50"
                        }}
                    >
                        <TableHeader>
                            <TableColumn>PRODUCT</TableColumn>
                            <TableColumn>RETURNED BY</TableColumn>
                            <TableColumn>REPORTED CONDITION</TableColumn>
                            <TableColumn>RETURN DATE</TableColumn>
                            <TableColumn align="center">STATUS</TableColumn>
                        </TableHeader>
                        <TableBody items={RETURNED} emptyContent="No recent returns documented.">
                            {(item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-semibold">{item.item}</TableCell>
                                    <TableCell className="text-sm">{item.returnedBy}</TableCell>
                                    <TableCell>
                                        <Chip size="sm" variant="flat" color={item.condition === 'Excellent' ? 'success' : 'warning'}>{item.condition}</Chip>
                                    </TableCell>
                                    <TableCell className="text-xs text-slate-500 font-medium">{item.date}</TableCell>
                                    <TableCell>
                                        <div className="flex justify-center flex-col items-center">
                                            {item.processed ? (
                                                <Chip size="sm" color="success" variant="shadow" startContent={<CheckCircle weight="bold" />}>QC Passed</Chip>
                                            ) : (
                                                <Button size="sm" color="primary" variant="flat" className="font-bold h-7 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" startContent={<ArrowsClockwise weight="bold" className="animate-spin-slow" />}>
                                                    Start Inspection
                                                </Button>
                                            )}
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
