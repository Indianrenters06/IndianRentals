'use client';

import { motion } from "framer-motion";
import { Card, CardBody, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Avatar } from "@heroui/react";
import { Users, MagnifyingGlass, ArrowRight, Check } from "@phosphor-icons/react";

const ACTIVE_USERS = [
    { id: 1, name: "Rahul Sharma", email: "rahul.s@example.com", activity: "Last active: 2h ago", status: "Active" },
    { id: 2, name: "Sneha Menon", email: "sneha.m@example.com", activity: "Last active: 15m ago", status: "Online" },
    { id: 3, name: "Amit Kumar", email: "amit.k@example.com", activity: "Last active: Yesterday", status: "Active" },
];

export default function ActiveUsers() {
    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Active <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Users</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Monitor users currently engaging with the platform.</p>
                </motion.div>
            </div>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <CardBody className="p-0">
                    <Table
                        aria-label="Active users table"
                        classNames={{
                            wrapper: "p-0 rounded-none shadow-none bg-transparent",
                            th: "bg-slate-50 dark:bg-slate-950/80 uppercase text-xs font-bold h-12 pt-0 px-6",
                            td: "py-4 px-6 border-b border-slate-100 dark:border-slate-800/50"
                        }}
                    >
                        <TableHeader>
                            <TableColumn>USER</TableColumn>
                            <TableColumn>LAST ACTIVITY</TableColumn>
                            <TableColumn>ENGAGEMENT</TableColumn>
                            <TableColumn align="center">STATUS</TableColumn>
                            <TableColumn align="center">ACTION</TableColumn>
                        </TableHeader>
                        <TableBody items={ACTIVE_USERS} emptyContent="No active users found.">
                            {(user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar name={user.name.charAt(0)} size="sm" className="bg-emerald-500/10 text-emerald-600 font-bold" />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold">{user.name}</span>
                                                <span className="text-xs text-slate-500">{user.email}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-xs font-medium text-slate-500">{user.activity}</span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-slate-400">
                                            {[1, 2, 3, 4, 5].map(v => <div key={v} className={`w-1 h-3 rounded-full ${v <= 4 ? 'bg-emerald-500' : 'bg-slate-200'}`} />)}
                                            <span className="text-[10px] ml-1 font-bold">HIGH</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center">
                                            <Chip size="sm" color={user.status === 'Online' ? 'success' : 'primary'} variant="flat" className="font-bold">{user.status}</Chip>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center">
                                            <Button isIconOnly size="sm" variant="light" color="primary" className="text-indigo-500"><ArrowRight /></Button>
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
