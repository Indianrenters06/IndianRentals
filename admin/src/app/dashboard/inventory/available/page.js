'use client';

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Skeleton, Pagination } from "@heroui/react";
import { Package, MagnifyingGlass, WarningCircle } from "@phosphor-icons/react";
import SortSelect from "@/components/SortSelect";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AvailableStock() {
    const [stock, setStock] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [rowsPerPage] = useState(10);
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "name",
        direction: "ascending",
    });

    useEffect(() => {
        const fetchStock = async () => {
            try {
                const token = localStorage.getItem("adminToken");
                const res = await fetch(`${API}/api/admin/inventory/available`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Failed to fetch available stock");
                const data = await res.json();
                setStock(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchStock();
    }, []);

    const sortedItems = useMemo(() => {
        let list = [...stock];
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(
                (item) =>
                    item.name?.toLowerCase().includes(q) ||
                    item.sku?.toLowerCase().includes(q) ||
                    item.location?.toLowerCase().includes(q)
            );
        }

        return list.sort((a, b) => {
            const col = sortDescriptor.column;
            let first, second;
            if (col === "stock") { first = Number(a.stock) || 0; second = Number(b.stock) || 0; }
            else { first = (a[col] || "").toString().toLowerCase(); second = (b[col] || "").toString().toLowerCase(); }
            const cmp = first < second ? -1 : first > second ? 1 : 0;
            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [stock, search, sortDescriptor]);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return sortedItems.slice(start, end);
    }, [page, sortedItems, rowsPerPage]);

    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Available <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">Stock</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-200">Inventory items currently ready for immediate fulfillment.</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <Chip
                        size="lg"
                        variant="flat"
                        color="success"
                        startContent={<Package weight="bold" className="mr-1" />}
                        className="font-bold text-sm px-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                    >
                        {loading ? "..." : `${stock.length} Products`}
                    </Chip>
                </motion.div>
            </div>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <CardBody className="p-0">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 bg-slate-50 dark:bg-slate-950/30">
                        <div className="relative group flex-1 max-w-md">
                            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name, SKU or location..."
                                className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 h-11"
                            />
                        </div>
                        <SortSelect
                            className="h-11"
                            value={`${sortDescriptor.column}:${sortDescriptor.direction}`}
                            onChange={(column, direction) => { setSortDescriptor({ column, direction }); setPage(1); }}
                            options={[
                                { value: "name:ascending", label: "Name A–Z" },
                                { value: "name:descending", label: "Name Z–A" },
                                { value: "stock:descending", label: "Stock high → low" },
                                { value: "stock:ascending", label: "Stock low → high" },
                                { value: "location:ascending", label: "Location A–Z" },
                            ]}
                        />
                    </div>

                    {error ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3 text-rose-500">
                            <WarningCircle size={40} weight="bold" />
                            <p className="font-semibold">{error}</p>
                            <p className="text-sm text-slate-500">Check that the backend server is running.</p>
                        </div>
                    ) : loading ? (
                        <div className="p-6 space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-12 w-full rounded-xl" />
                            ))}
                        </div>
                    ) : (
                        <Table
                            aria-label="Available stock table"
                            bottomContent={
                                sortedItems.length > 0 ? (
                                    <div className="flex w-full justify-between items-center py-4 px-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30">
                                        <span className="text-sm text-slate-500">
                                            Showing {items.length} of {sortedItems.length} products
                                        </span>
                                        <Pagination
                                            radius="md" variant="flat"
                                            showControls
                                            
                                            color="primary"
                                            page={page}
                                            total={Math.ceil(sortedItems.length / rowsPerPage)}
                                            onChange={(page) => setPage(page)}
                                            classNames={{
                                                cursor: "bg-indigo-500 shadow-indigo-500/30",
                                            }}
                                        />
                                    </div>
                                ) : null
                            }
                            classNames={{
                                wrapper: "p-0 rounded-none shadow-none bg-transparent",
                                th: "bg-slate-50 dark:bg-slate-950/80 uppercase text-xs font-bold h-12 pt-0 px-6",
                                td: "py-4 px-6 border-b border-slate-100 dark:border-slate-800/50"
                            }}
                        >
                            <TableHeader>
                                <TableColumn key="name">ITEM NAME</TableColumn>
                                <TableColumn key="sku">SKU ID</TableColumn>
                                <TableColumn key="location">LOCATION</TableColumn>
                                <TableColumn key="stock">STOCK</TableColumn>
                                <TableColumn key="condition">CONDITION</TableColumn>
                                <TableColumn key="status" align="center">STATUS</TableColumn>
                            </TableHeader>
                            <TableBody items={items} emptyContent="No available items found.">
                                {(item) => (
                                    <TableRow key={item._id}>
                                        <TableCell className="font-semibold text-slate-900 dark:text-slate-100">{item.name}</TableCell>
                                        <TableCell className="font-mono text-xs text-slate-500 tracking-wider font-bold uppercase">{item.sku}</TableCell>
                                        <TableCell className="text-sm font-medium text-slate-600 dark:text-slate-200">{item.location}</TableCell>
                                        <TableCell>
                                            <span className="font-bold text-indigo-600 dark:text-indigo-400">{item.stock}</span>
                                            <span className="text-xs text-slate-400 ml-1">units</span>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                size="sm"
                                                variant="flat"
                                                color={item.condition === 'New' ? 'success' : item.condition === 'Good' ? 'secondary' : 'warning'}
                                                className="font-bold"
                                            >
                                                {item.condition}
                                            </Chip>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-center">
                                                <Chip
                                                    size="sm"
                                                    color={item.status === 'Ready' ? 'success' : 'warning'}
                                                    variant="dot"
                                                    className="border-none font-bold"
                                                >
                                                    {item.status}
                                                </Chip>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardBody>
            </Card>
        </div>
    );
}

