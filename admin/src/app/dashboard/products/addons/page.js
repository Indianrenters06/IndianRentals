'use client';

import { motion } from "framer-motion";
import { Card, CardBody, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Avatar } from "@heroui/react";
import { Plus, Package, Trash, PencilSimple, PlusCircle } from "@phosphor-icons/react";

const ADDONS = [
    { id: 1, name: "SanDisk 128GB SD Card", price: "₹99/day", category: "Memory", stock: 24 },
    { id: 2, name: "Extra NP-FZ100 Battery", price: "₹149/day", category: "Power", stock: 15 },
    { id: 3, name: "GoPro Head Strap", price: "₹49/day", category: "Mounts", stock: 8 },
];

export default function AddonsManagement() {
    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Product <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Add-ons</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Manage accessories and extra items that can be rented with primary products.</p>
                </motion.div>

                <Button color="primary" variant="shadow" className="bg-indigo-600 shadow-indigo-500/30 font-bold" startContent={<PlusCircle weight="bold" />}>
                    Add Accessory
                </Button>
            </div>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <CardBody className="p-0">
                    <Table
                        aria-label="Add-ons Table"
                        classNames={{
                            wrapper: "p-0 rounded-none shadow-none bg-transparent",
                            thead: "bg-slate-50 dark:bg-slate-950/80",
                            th: "text-slate-500 font-bold uppercase text-xs py-4 px-6 h-12 pt-0",
                            td: "py-4 px-6 border-b border-slate-100 dark:border-slate-800/50",
                            tr: "hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                        }}
                    >
                        <TableHeader>
                            <TableColumn>ACCESSORY</TableColumn>
                            <TableColumn>CATEGORY</TableColumn>
                            <TableColumn>PRICE</TableColumn>
                            <TableColumn>STOCK</TableColumn>
                            <TableColumn align="center">ACTIONS</TableColumn>
                        </TableHeader>
                        <TableBody items={ADDONS} emptyContent="No add-ons found.">
                            {(item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar name={item.name.charAt(0)} size="sm" className="bg-cyan-100 text-cyan-600 dark:bg-cyan-900/40 dark:text-cyan-400" />
                                            <span className="text-sm font-semibold">{item.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Chip size="sm" variant="flat" color="primary" className="font-medium">{item.category}</Chip>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">{item.price}</span>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`text-sm ${item.stock < 10 ? 'text-amber-500' : 'text-slate-500'}`}>{item.stock} Units</span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center gap-2">
                                            <Button isIconOnly size="sm" variant="light"><PencilSimple /></Button>
                                            <Button isIconOnly size="sm" variant="light" color="danger"><Trash /></Button>
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
