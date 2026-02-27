'use client';

import { motion } from "framer-motion";
import { Card, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, User } from "@heroui/react";
import { ArrowUpRight, Clock } from "@phosphor-icons/react";

const ASSIGNED = [
    { id: 1, item: "Sony A7R IV", user: "Rahul Sharma", order: "ORD-9912", returnDate: "Oct 25, 2023" },
    { id: 2, item: "Lens 24-70mm", user: "Rahul Sharma", order: "ORD-9912", returnDate: "Oct 25, 2023" },
    { id: 3, item: "MacBook Pro M2", user: "Sneha Menon", order: "ORD-9844", returnDate: "Oct 22, 2023" },
];

export default function AssignedInventory() {
    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Assigned <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Inventory</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Track items currently out on active rental orders.</p>
                </motion.div>
            </div>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <CardBody className="p-0">
                    <Table
                        aria-label="Assigned stock table"
                        classNames={{
                            wrapper: "p-0 rounded-none shadow-none bg-transparent",
                            th: "bg-slate-50 dark:bg-slate-950/80 uppercase text-xs font-bold h-12 pt-0 px-6",
                            td: "py-4 px-6 border-b border-slate-100 dark:border-slate-800/50"
                        }}
                    >
                        <TableHeader>
                            <TableColumn>PRODUCT</TableColumn>
                            <TableColumn>ASSIGNED TO</TableColumn>
                            <TableColumn>ORDER ID</TableColumn>
                            <TableColumn>EXPECTED RETURN</TableColumn>
                            <TableColumn align="center">STATUS</TableColumn>
                        </TableHeader>
                        <TableBody items={ASSIGNED} emptyContent="No assigned items currently.">
                            {(item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-semibold text-slate-900 dark:text-slate-200">{item.item}</TableCell>
                                    <TableCell>
                                        <User
                                            name={item.user}
                                            description="Premium Member"
                                            avatarProps={{ size: "sm", radius: "full", src: `https://ui-avatars.com/api/?name=${item.user}` }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip size="sm" variant="flat" className="bg-slate-100 dark:bg-slate-800 text-slate-600 font-mono font-bold tracking-wider">
                                            {item.order}
                                        </Chip>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-sm font-semibold">{item.returnDate}</span>
                                            <span className="text-[10px] text-slate-500 flex items-center gap-1 uppercase font-bold tracking-widest"><Clock weight="bold" /> 5 days left</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center flex-col items-center">
                                            <Chip size="sm" color="primary" variant="flat" className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800" endContent={<ArrowUpRight weight="bold" className="ml-1" />}>On Rent</Chip>
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
