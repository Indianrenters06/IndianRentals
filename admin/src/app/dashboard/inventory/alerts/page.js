'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Button, Skeleton, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, useDisclosure, Spinner } from "@heroui/react";
import { WarningCircle, TrendDown, ShoppingCart, Package, ArrowUp, CheckCircle } from "@phosphor-icons/react";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function InventoryAlerts() {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    
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
                        <Chip size="lg" color="danger" variant="flat" className="font-bold text-sm px-3 h-10 rounded-xl">
                            {highCount} Critical
                        </Chip>
                    )}
                    <Button 
                        color="primary" 
                        variant="flat" 
                        radius="xl"
                        className="font-bold h-11 px-6 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30" 
                        startContent={<ShoppingCart weight="bold" />}
                    >
                        Settings & Thresholds
                    </Button>
                </div>
            </div>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <CardBody className="p-0">
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
                            classNames={{
                                wrapper: "p-0 rounded-none shadow-none bg-transparent",
                                th: "bg-slate-50 dark:bg-slate-950/80 uppercase text-xs font-bold h-12 pt-0 px-6",
                                td: "py-4 px-6 border-b border-slate-100 dark:border-slate-800/50"
                            }}
                        >
                            <TableHeader>
                                <TableColumn>ITEM UNDER ALERT</TableColumn>
                                <TableColumn>ALERT TYPE</TableColumn>
                                <TableColumn>DESCRIPTION</TableColumn>
                                <TableColumn>STOCK</TableColumn>
                                <TableColumn align="center">PRIORITY</TableColumn>
                                <TableColumn align="center">ACTION</TableColumn>
                            </TableHeader>
                            <TableBody items={alerts} emptyContent="System healthy. No active alerts.">
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
                classNames={{ base: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 px-6 pt-6">
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
                            <ModalFooter className="px-6 pb-6 pt-0">
                                <Button variant="flat" onPress={onClose} className="font-bold">Cancel</Button>
                                <Button 
                                    color="success" 
                                    isLoading={submitting} 
                                    onPress={handleReorderSubmit}
                                    className="h-11 px-8 rounded-xl bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/30"
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

