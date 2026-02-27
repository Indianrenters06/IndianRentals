'use client';

import { motion } from "framer-motion";
import { Card, CardBody, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Divider } from "@heroui/react";
import { Plus, Stack, Trash, PencilSimple, Gear } from "@phosphor-icons/react";

const VARIANT_GROUPS = [
    { id: 1, name: "Storage Capacity", options: ["128GB", "256GB", "512GB", "1TB"], appliesTo: "Laptops, Mobiles", status: "Active" },
    { id: 2, name: "Lens Mount", options: ["E-Mount", "EF-Mount", "RF-Mount"], appliesTo: "Cameras", status: "Active" },
    { id: 3, name: "Color Palette", options: ["Space Gray", "Silver", "Midnight"], appliesTo: "All Electronics", status: "Global" },
];

export default function VariantsManagement() {
    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Product <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Variants</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Manage size, color, or specification variations across your inventory.</p>
                </motion.div>

                <Button color="primary" variant="shadow" className="bg-indigo-600 shadow-indigo-500/30 font-bold" startContent={<Plus weight="bold" />}>
                    Define Type
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden lg:col-span-2">
                    <CardBody className="p-0">
                        <Table
                            aria-label="Variants Table"
                            classNames={{
                                wrapper: "p-0 rounded-none shadow-none bg-transparent",
                                thead: "bg-slate-50 dark:bg-slate-950/80",
                                th: "text-slate-500 font-bold uppercase text-xs py-4 px-6 h-12 pt-0",
                                td: "py-4 px-6 border-b border-slate-100 dark:border-slate-800/50",
                                tr: "hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                            }}
                        >
                            <TableHeader>
                                <TableColumn>VARIANT GROUP</TableColumn>
                                <TableColumn>OPTIONS</TableColumn>
                                <TableColumn>APPLICABLE CATEGORIES</TableColumn>
                                <TableColumn>STATUS</TableColumn>
                                <TableColumn align="center">ACTIONS</TableColumn>
                            </TableHeader>
                            <TableBody items={VARIANT_GROUPS} emptyContent="No variant groups defined.">
                                {(group) => (
                                    <TableRow key={group.id}>
                                        <TableCell>
                                            <span className="text-sm font-semibold">{group.name}</span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {group.options.map(opt => (
                                                    <Chip key={opt} size="xs" variant="flat" className="bg-slate-100 dark:bg-slate-800 text-[10px] font-bold h-5 uppercase">{opt}</Chip>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-xs text-slate-500 font-medium">{group.appliesTo}</span>
                                        </TableCell>
                                        <TableCell>
                                            <Chip size="sm" color={group.status === 'Active' ? 'success' : 'primary'} variant="dot" className="border-none bg-transparent h-auto p-0">{group.status}</Chip>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-center gap-2">
                                                <Button isIconOnly size="sm" variant="light"><Gear className="w-4 h-4" /></Button>
                                                <Button isIconOnly size="sm" variant="light" color="danger"><Trash className="w-4 h-4" /></Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
