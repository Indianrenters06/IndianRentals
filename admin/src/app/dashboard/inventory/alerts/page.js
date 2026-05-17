'use client';

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Button, Skeleton, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, useDisclosure, Spinner, Pagination } from "@heroui/react";
import { WarningCircle, TrendDown, ShoppingCart, Package, ArrowUp, CheckCircle, MagnifyingGlass, XCircle } from "@phosphor-icons/react";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function InventoryAlerts() {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    // Table state
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [rowsPerPage] = useState(10);
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "priority",
        direction: "descending",
    });

    // Reorder state
    const [selectedItem, setSelectedItem] = useState(null);
    const [orderQty, setOrderQty] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const fetchAlerts = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API}/api/admin/inventory/alerts`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch inventory alerts");
            const data = await res.json();
            setAlerts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlerts();
    }, []);

    const handleReorderClick = (item) => {
        setSelectedItem(item);
        setOrderQty("");
        onOpen();
    };

    const handleReorderSubmit = async () => {
        if (!orderQty || isNaN(orderQty) || Number(orderQty) <= 0) {
            toast.error("Please enter a valid quantity");
            return;
        }

        setSubmitting(true);
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API}/api/admin/inventory/adjustment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    productId: selectedItem._id,
                    change: Number(orderQty),
                    reason: `Restock via Inventory Alerts (Ordered ${orderQty} units)`
                }),
            });

            if (!res.ok) throw new Error("Restock failed");

            toast.success(`${selectedItem.item} stock updated!`);
            onClose();
            fetchAlerts(); // Refresh list
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const sortedItems = useMemo(() => {
        let list = [...alerts];
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(
                (item) =>
                    item.item?.toLowerCase().includes(q) ||
                    item.message?.toLowerCase().includes(q) ||
                    item.type?.toLowerCase().includes(q)
            );
        }

        return list.sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [alerts, search, sortDescriptor]);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return sortedItems.slice(start, end);
    }, [page, sortedItems, rowsPerPage]);

    const highCount = alerts.filter(a => a.priority === 'High').length;

    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Inventory <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Alerts</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Critical notifications about stock levels and reordering requirements.</p>
                </motion.div>

                <div className="flex items-center gap-3">
                    {!loading && highCount > 0 && (
                        <Chip size="lg" color="danger" variant="flat" className="font-bold text-sm px-4 h-11 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20">
                            {highCount} Critical Alerts
                        </Chip>
                    )}
                    <Button
                        color="primary"
                        variant="flat"
                        radius="xl"
                        className="font-bold h-11 px-6 !bg-indigo-50 dark:!bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30"
                        startContent={<ShoppingCart weight="bold" />}
                    >
                        Alert Thresholds
                    </Button>
                </div>
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
                                placeholder="Search by item name or alert..."
                                className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 h-11"
                            />
                        </div>
                    </div>

                    {error ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3 text-rose-500">
                            <WarningCircle size={40} weight="bold" />
                            <p className="font-semibold">{error}</p>
                            <p className="text-sm text-slate-500">Check that the backend server is running.</p>
                        </div>
                    ) : loading ? (
                        <div className="p-6 space-y-4">
                            {[...Array(4)].map((_, i) => (
                                <Skeleton key={i} className="h-12 w-full rounded-xl" />
                            ))}
                        </div>
                    ) : (
                        <Table
                            aria-label="Inventory alerts table"
                            sortDescriptor={sortDescriptor}
                            onSortChange={setSortDescriptor}
                            bottomContent={
                                sortedItems.length > 0 ? (
                                    <div className="flex w-full justify-between items-center py-4 px-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30">
                                        <span className="text-sm text-slate-500">
                                            Showing {items.length} of {sortedItems.length} alerts
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
                                <TableColumn key="item" allowsSorting>ITEM UNDER ALERT</TableColumn>
                                <TableColumn key="type" allowsSorting>ALERT TYPE</TableColumn>
                                <TableColumn key="message" allowsSorting>DESCRIPTION</TableColumn>
                                <TableColumn key="stock" allowsSorting>STOCK</TableColumn>
                                <TableColumn key="priority" align="center" allowsSorting>PRIORITY</TableColumn>
                                <TableColumn align="center">ACTION</TableColumn>
                            </TableHeader>
                            <TableBody items={items} emptyContent="System healthy. No active alerts.">
                                {(item) => (
                                    <TableRow key={String(item._id)}>
                                        <TableCell className="font-semibold text-slate-900 dark:text-slate-200">{item.item}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-tight text-slate-500">
                                                <TrendDown className="text-rose-500" weight="bold" /> {item.type}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm italic text-slate-500">{item.message}</TableCell>
                                        <TableCell>
                                            <span className={`font-bold text-sm ${item.stock === 0 ? 'text-rose-500' : 'text-amber-500'}`}>
                                                {item.stock} units
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-center">
                                                <Chip
                                                    size="sm"
                                                    color={item.priority === 'High' ? 'danger' : 'warning'}
                                                    variant="flat"
                                                    className="font-bold tracking-widest"
                                                >
                                                    {item.priority}
                                                </Chip>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-center">
                                                <Button
                                                    size="sm"
                                                    radius="xl"
                                                    onPress={() => handleReorderClick(item)}
                                                    className="font-bold h-9 px-6 bg-indigo-600 text-white shadow-md border-none"
                                                >
                                                    Order Stock
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardBody>
            </Card>

            {/* Quick Reorder Modal */}
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                size="md"
                placement="center"
                classNames={{ 
                    base: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl",
                    header: "px-6 pt-6 pb-0",
                    footer: "px-6 pb-6 pt-0"
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                <Package weight="bold" className="text-indigo-500" />
                                Quick Reorder
                            </ModalHeader>
                            <ModalBody className="py-6 px-6 space-y-4">
                                <div className="p-4 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
                                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest mb-1">Product</p>
                                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{selectedItem?.item}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Chip size="sm" variant="flat" color={selectedItem?.stock === 0 ? "danger" : "warning"} className="font-bold">
                                            Current Stock: {selectedItem?.stock}
                                        </Chip>
                                    </div>
                                </div>

                                <Input
                                    label="Order Quantity"
                                    placeholder="Number of units to add"
                                    type="number"
                                    value={orderQty}
                                    onValueChange={setOrderQty}
                                    variant="bordered"
                                    radius="xl"
                                    autoFocus
                                    startContent={<ArrowUp weight="bold" className="text-emerald-500" />}
                                    classNames={{
                                        inputWrapper: "bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 h-[65px] shadow-sm hover:border-emerald-500 transition-all",
                                        label: "text-slate-900 dark:text-slate-100 font-bold",
                                        input: "font-bold text-slate-900 dark:text-slate-100"
                                    }}
                                />
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold px-1">
                                    Note: This will increase the system stock count immediately.
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="flat" onPress={onClose} className="font-bold text-slate-600 dark:text-slate-400">Cancel</Button>
                                <Button
                                    color="success"
                                    isLoading={submitting}
                                    onPress={handleReorderSubmit}
                                    className="h-11 px-8 rounded-xl !bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/30"
                                    startContent={!submitting && <CheckCircle weight="bold" />}
                                >
                                    Confirm Order
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}

