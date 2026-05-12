'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Card, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Button,
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
    Select, SelectItem, Input, Textarea, Skeleton, useDisclosure
} from "@heroui/react";
import { Plus, WarningCircle, ArrowUp, ArrowDown } from "@phosphor-icons/react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function StockAdjustment() {
    const [logs, setLogs] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    // Form state
    const [selectedProduct, setSelectedProduct] = useState("");
    const [changeType, setChangeType] = useState("increase");
    const [amount, setAmount] = useState("");
    const [reason, setReason] = useState("");
    const [formError, setFormError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("adminToken");
                const [prodRes] = await Promise.all([
                    fetch(`${API}/api/admin/products`, { headers: { Authorization: `Bearer ${token}` } }),
                ]);
                if (!prodRes.ok) throw new Error("Failed to fetch products");
                const prodData = await prodRes.json();
                setProducts(prodData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async () => {
        if (!selectedProduct) return setFormError("Please select a product.");
        if (!amount || isNaN(amount) || Number(amount) <= 0) return setFormError("Enter a valid positive number.");
        if (!reason.trim()) return setFormError("Please provide a reason.");

        setFormError("");
        setSubmitting(true);

        try {
            const token = localStorage.getItem("adminToken");
            const change = changeType === "increase" ? Number(amount) : -Number(amount);
            const product = products.find(p => p._id === selectedProduct);

            const res = await fetch(`${API}/api/admin/inventory/adjustment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ productId: selectedProduct, change, reason }),
            });

            if (!res.ok) throw new Error("Adjustment failed");

            // Add to local log
            const newLog = {
                _id: Date.now().toString(),
                item: product?.name || "Unknown",
                type: "Manual Entry",
                change: change > 0 ? `+${change}` : String(change),
                reason,
                date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
            };
            setLogs(prev => [newLog, ...prev]);

            // Update local product stock display
            setProducts(prev => prev.map(p =>
                p._id === selectedProduct
                    ? { ...p, stock: Math.max(0, (p.stock || 0) + change) }
                    : p
            ));

            setSelectedProduct("");
            setChangeType("increase");
            setAmount("");
            setReason("");
            onClose();
        } catch (err) {
            setFormError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Stock <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Adjustment</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Manually adjust inventory levels and track the history of changes.</p>
                </motion.div>

                <Button color="primary" variant="shadow" className="font-bold bg-indigo-600 shadow-indigo-500/20 px-6" startContent={<Plus weight="bold" />} onPress={onOpen}>
                    New Adjustment
                </Button>
            </div>

            {/* Product Current Stock Summary */}
            {!loading && !error && products.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {products.slice(0, 4).map(p => (
                        <Card key={p._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                            <CardBody className="p-4">
                                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider truncate">{p.name}</p>
                                <div className="flex items-end gap-2 mt-1">
                                    <span className={`text-2xl font-black ${p.stock === 0 ? 'text-rose-500' : p.stock < 5 ? 'text-amber-500' : 'text-indigo-600 dark:text-indigo-400'}`}>
                                        {p.stock}
                                    </span>
                                    <span className="text-xs text-slate-400 mb-1">units</span>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            )}

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
                            {[...Array(3)].map((_, i) => (
                                <Skeleton key={i} className="h-12 w-full rounded-xl" />
                            ))}
                        </div>
                    ) : (
                        <Table
                            aria-label="Stock adjustment table"
                            classNames={{
                                wrapper: "p-0 rounded-none shadow-none bg-transparent",
                                th: "bg-slate-50 dark:bg-slate-950/80 uppercase text-xs font-bold h-12 pt-0 px-6",
                                td: "py-4 px-6 border-b border-slate-100 dark:border-slate-800/50"
                            }}
                        >
                            <TableHeader>
                                <TableColumn>PRODUCT</TableColumn>
                                <TableColumn>METHOD</TableColumn>
                                <TableColumn>QUANTITY CHANGE</TableColumn>
                                <TableColumn>REASON / NOTE</TableColumn>
                                <TableColumn align="center">DATE</TableColumn>
                            </TableHeader>
                            <TableBody items={logs} emptyContent="No adjustments logged yet. Click 'New Adjustment' to begin.">
                                {(item) => (
                                    <TableRow key={item._id}>
                                        <TableCell className="font-semibold text-slate-900 dark:text-slate-100">{item.item}</TableCell>
                                        <TableCell>
                                            <Chip size="sm" variant="flat" className="bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold uppercase tracking-wider">{item.type}</Chip>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`font-bold flex items-center gap-1 ${String(item.change).startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                {String(item.change).startsWith('+') ? <ArrowUp weight="bold" size={14} /> : <ArrowDown weight="bold" size={14} />}
                                                {item.change}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-sm italic text-slate-500">{item.reason}</TableCell>
                                        <TableCell className="text-xs font-bold uppercase tracking-widest text-slate-400 text-center">{item.date}</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardBody>
            </Card>

            {/* New Adjustment Modal */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg" placement="center"
                classNames={{
                    base: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800",
                    header: "border-b border-slate-200 dark:border-slate-800",
                    footer: "border-t border-slate-200 dark:border-slate-800",
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="font-bold text-slate-900 dark:text-slate-100">New Stock Adjustment</ModalHeader>
                            <ModalBody className="py-6 flex flex-col gap-4">
                                <Select
                                     label="Select Product"
                                     variant="bordered"
                                     radius="xl"
                                     placeholder="Choose a product to adjust"
                                     selectedKeys={selectedProduct ? [selectedProduct] : []}
                                     onSelectionChange={(keys) => setSelectedProduct([...keys][0] || "")}
                                     classNames={{ trigger: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 h-[60px]" }}
                                 >
                                     {products.map(p => (
                                         <SelectItem key={p._id} value={p._id} description={`Current stock: ${p.stock}`}>
                                             {p.name}
                                         </SelectItem>
                                     ))}
                                 </Select>

                                 <div className="grid grid-cols-2 gap-3">
                                     {["increase", "decrease"].map(type => (
                                         <button
                                             key={type}
                                             onClick={() => setChangeType(type)}
                                             className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-bold text-sm transition-all ${changeType === type
                                                 ? type === "increase"
                                                     ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600"
                                                     : "border-rose-500 bg-rose-50 dark:bg-rose-500/10 text-rose-600"
                                                 : "border-slate-200 dark:border-slate-700 text-slate-500"
                                                 }`}
                                         >
                                             {type === "increase" ? <ArrowUp weight="bold" /> : <ArrowDown weight="bold" />}
                                             {type === "increase" ? "Increase Stock" : "Decrease Stock"}
                                         </button>
                                     ))}
                                 </div>

                                 <Input
                                     label="Quantity"
                                     placeholder="Enter amount"
                                     type="number"
                                     min="1"
                                     value={amount}
                                     onValueChange={setAmount}
                                     variant="bordered"
                                     radius="xl"
                                     classNames={{ inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 h-[60px]" }}
                                 />

                                 <Textarea
                                     label="Reason / Note"
                                     placeholder="e.g. Procurement sync, stock mismatch correction..."
                                     value={reason}
                                     onValueChange={setReason}
                                     variant="bordered"
                                     radius="xl"
                                     classNames={{ inputWrapper: "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700" }}
                                 />

                                {formError && (
                                    <p className="text-sm text-rose-500 font-medium flex items-center gap-2">
                                        <WarningCircle weight="bold" /> {formError}
                                    </p>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="flat" onPress={onClose} className="text-slate-600 dark:text-slate-400">Cancel</Button>
                                <Button color="primary" isLoading={submitting} onPress={handleSubmit} className="bg-indigo-600 font-bold">
                                    Apply Adjustment
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
