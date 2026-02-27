'use client';

import { motion } from "framer-motion";
import { Card, CardBody, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Avatar } from "@heroui/react";
import { Plus, PencilSimple, Trash, FileText, Eye, Clock } from "@phosphor-icons/react";

const POSTS = [
    { id: 1, title: "How to Choose the Right Camera for Rent", author: "Admin", status: "Published", date: "Oct 12, 2023", views: "1.2k" },
    { id: 2, title: "Top 10 Gadgets for Digital Nomads in Bangalore", author: "Curator", status: "Draft", date: "Oct 15, 2023", views: "0" },
    { id: 3, title: "Renting vs Buying: The 2023 Guide", author: "Admin", status: "Published", date: "Sep 28, 2023", views: "3.5k" },
];

export default function BlogManagement() {
    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Blog <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Management</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Manage your platform's blog posts, tutorials, and industry news.</p>
                </motion.div>

                <Button color="primary" variant="shadow" className="font-bold bg-indigo-600 shadow-indigo-500/20 px-6" startContent={<Plus weight="bold" />}>
                    Create Post
                </Button>
            </div>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <CardBody className="p-0">
                    <Table
                        aria-label="Blog posts table"
                        classNames={{
                            wrapper: "p-0 rounded-none shadow-none bg-transparent",
                            thead: "bg-slate-50 dark:bg-slate-950/80",
                            th: "text-slate-500 font-bold uppercase text-xs h-12 pt-0 px-6",
                            td: "py-4 px-6 border-b border-slate-100 dark:border-slate-800/50"
                        }}
                    >
                        <TableHeader>
                            <TableColumn>ARTICLE TITLE</TableColumn>
                            <TableColumn>AUTHOR</TableColumn>
                            <TableColumn>STATUS</TableColumn>
                            <TableColumn>ENGAGEMENT</TableColumn>
                            <TableColumn align="center">ACTIONS</TableColumn>
                        </TableHeader>
                        <TableBody items={POSTS} emptyContent="No blog posts found.">
                            {(post) => (
                                <TableRow key={post.id}>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm font-semibold text-slate-900 dark:text-slate-200 line-clamp-1">{post.title}</span>
                                            <span className="text-[10px] text-slate-500 flex items-center gap-1 uppercase tracking-wider font-bold"><Clock className="w-2.5 h-2.5" weight="bold" /> {post.date}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar name={post.author.charAt(0)} size="xs" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400" />
                                            <span className="text-xs font-medium">{post.author}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Chip size="sm" color={post.status === 'Published' ? 'success' : 'default'} variant="dot" className="border-none bg-transparent p-0">{post.status}</Chip>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <Eye className="w-3.5 h-3.5" /> {post.views} views
                                        </div>
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
