'use client';

import { motion } from "framer-motion";
import { Card, CardBody, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip } from "@heroui/react";
import { Plus, PencilSimple, Trash, FileText, LinkSimple } from "@phosphor-icons/react";

const PAGES = [
    { id: 1, title: 'About Us', slug: '/about', status: 'Active', updated: '2 days ago' },
    { id: 2, title: 'Terms & Conditions', slug: '/terms', status: 'Active', updated: '1 month ago' },
    { id: 3, title: 'Privacy Policy', slug: '/privacy', status: 'Active', updated: '3 months ago' },
    { id: 4, title: 'Contact Us', slug: '/contact', status: 'Active', updated: 'Dec 12, 2023' },
];

export default function StaticPages() {
    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Static <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Pages</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Manage legal, informational, and other standalone website pages.</p>
                </motion.div>

                <Button color="primary" variant="shadow" className="font-bold bg-indigo-600 shadow-indigo-500/20 px-6" startContent={<Plus weight="bold" />}>
                    Add New Page
                </Button>
            </div>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <CardBody className="p-0">
                    <Table
                        aria-label="Static pages table"
                        classNames={{
                            wrapper: "p-0 rounded-none shadow-none bg-transparent",
                            thead: "bg-slate-50 dark:bg-slate-950/80",
                            th: "text-slate-500 font-bold uppercase text-xs h-12 pt-0 px-6",
                            td: "py-4 px-6 border-b border-slate-100 dark:border-slate-800/50"
                        }}
                    >
                        <TableHeader>
                            <TableColumn>PAGE NAME</TableColumn>
                            <TableColumn>PUBLIC URL</TableColumn>
                            <TableColumn>LAST UPDATED</TableColumn>
                            <TableColumn>STATUS</TableColumn>
                            <TableColumn align="center">ACTIONS</TableColumn>
                        </TableHeader>
                        <TableBody items={PAGES} emptyContent="No static pages found.">
                            {(page) => (
                                <TableRow key={page.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <FileText className="text-indigo-500" weight="bold" />
                                            <span className="text-sm font-semibold text-slate-900 dark:text-slate-200">{page.title}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                                            <LinkSimple className="w-3 h-3" weight="bold" /> {page.slug}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-xs font-medium text-slate-500">{page.updated}</span>
                                    </TableCell>
                                    <TableCell>
                                        <Chip size="sm" color="success" variant="flat" className="font-bold h-6">Live</Chip>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center gap-2">
                                            <Button isIconOnly size="sm" variant="light"><PencilSimple className="w-4 h-4" /></Button>
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
    );
}
