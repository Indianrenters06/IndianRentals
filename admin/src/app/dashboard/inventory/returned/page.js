'use client';

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Button, Skeleton, Pagination, Spinner, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Textarea } from "@heroui/react";
import { ArrowsClockwise, CheckCircle, WarningCircle, MagnifyingGlass, XCircle, CaretLeft, CaretRight } from "@phosphor-icons/react";

// ── Toast Notification ────────────────────────────────────────────────────────
function Toast({ toasts }) {
    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
            <AnimatePresence>
                {toasts.map((t) => (
                    <motion.div
                        key={t.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.22 }}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold text-white pointer-events-auto min-w-[260px] ${
                            t.type === "success" ? "bg-emerald-600" : "bg-red-600"
                        }`}
                    >
                        {t.type === "success"
                            ? <CheckCircle size={18} weight="bold" />
                            : <XCircle size={18} weight="bold" />}
                        {t.message}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ReturnedInventory() {
    const [returned, setReturned] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [rowsPerPage] = useState(10);
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "date",
        direction: "descending",
    });
    const [toasts, setToasts] = useState([]);

    // Modal & Inspection states
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedCondition, setSelectedCondition] = useState("Good");
    const [inspectionNotes, setInspectionNotes] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const addToast = useCallback((message, type = "success") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
    }, []);

    const fetchReturned = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API}/api/admin/inventory/returned`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch returned inventory");
            const data = await res.json();
            setReturned(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReturned();
    }, [fetchReturned]);

    const handleStartInspection = (item) => {
        setSelectedItem(item);
        setSelectedCondition("Good");
        setInspectionNotes(item.inspectionNotes || "");
        onOpen();
    };

    const handleProcessSubmit = async () => {
        if (!selectedItem) return;
        setSubmitting(true);
        try {
            const token = localStorage.getItem("adminToken");
            const { rentalId, itemId } = selectedItem;
            const res = await fetch(`${API}/api/admin/inventory/returned/${rentalId}/${itemId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    condition: selectedCondition,
                    inspectionNotes
                })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || "Failed to submit inspection");
            }

            addToast(`Inspection submitted successfully!`, "success");
            onClose();
            fetchReturned();
        } catch (err) {
            addToast(err.message || "Something went wrong", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const sortedItems = useMemo(() => {
        let list = [...returned];
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(
                (item) =>
                    item.item?.toLowerCase().includes(q) ||
                    item.returnedBy?.toLowerCase().includes(q) ||
                    item.condition?.toLowerCase().includes(q)
            );
        }

        return list.sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [returned, search, sortDescriptor]);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return sortedItems.slice(start, end);
    }, [page, sortedItems, rowsPerPage]);

    return (
        <div className="w-full space-y-6 pb-12">
            <Toast toasts={toasts} />
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Returned <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">Items</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-200">Process and inspect items returned by customers.</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <Chip
                        size="lg"
                        variant="flat"
                        color="warning"
                        className="font-bold text-sm px-3 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                    >
                        {loading ? "..." : `${returned.filter(r => !r.processed).length} Pending Inspection`}
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
                                placeholder="Search by item name or customer..."
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
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-12 w-full rounded-xl" />
                            ))}
                        </div>
                    ) : (
                        <Table
                            aria-label="Returned items table"
                            sortDescriptor={sortDescriptor}
                            onSortChange={setSortDescriptor}
                            bottomContent={
                                sortedItems.length > 0 ? (
                                    <div className="flex w-full justify-between items-center py-4 px-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30">
                                        <span className="text-sm text-slate-500">
                                            Showing {items.length} of {sortedItems.length} returns
                                        </span>
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                type="button"
                                                disabled={page === 1}
                                                onClick={() => setPage(p => Math.max(p - 1, 1))}
                                                className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 hover:!bg-slate-50 dark:hover:!bg-slate-800/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <CaretLeft size={16} weight="bold" />
                                            </button>
                                            
                                            {Array.from({ length: Math.ceil(sortedItems.length / rowsPerPage) }).map((_, idx) => {
                                                const pageNum = idx + 1;
                                                const isActive = pageNum === page;
                                                return (
                                                    <button
                                                        key={pageNum}
                                                        type="button"
                                                        onClick={() => setPage(pageNum)}
                                                        className={`flex items-center justify-center w-8 h-8 text-xs font-bold rounded-lg transition-all ${
                                                            isActive
                                                                ? "!bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                                                                : "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:!bg-slate-50 dark:hover:!bg-slate-800/50"
                                                        }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}

                                            <button
                                                type="button"
                                                disabled={page === Math.ceil(sortedItems.length / rowsPerPage)}
                                                onClick={() => setPage(p => Math.min(p + 1, Math.ceil(sortedItems.length / rowsPerPage)))}
                                                className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 hover:!bg-slate-50 dark:hover:!bg-slate-800/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <CaretRight size={16} weight="bold" />
                                            </button>
                                        </div>
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
                                <TableColumn key="item" allowsSorting>PRODUCT</TableColumn>
                                <TableColumn key="returnedBy" allowsSorting>RETURNED BY</TableColumn>
                                <TableColumn key="condition" allowsSorting>REPORTED CONDITION</TableColumn>
                                <TableColumn key="date" allowsSorting>RETURN DATE</TableColumn>
                                <TableColumn align="center">STATUS</TableColumn>
                            </TableHeader>
                            <TableBody items={items} emptyContent="No recent returns documented.">
                                {(item) => (
                                    <TableRow key={item._id}>
                                        <TableCell className="font-semibold text-slate-900 dark:text-slate-200">{item.item}</TableCell>
                                        <TableCell className="text-sm font-medium">{item.returnedBy}</TableCell>
                                        <TableCell>
                                            <Chip
                                                size="sm"
                                                variant="flat"
                                                color={
                                                    item.condition === 'Excellent' || item.condition === 'Good' ? 'success' :
                                                    item.condition === 'Fair' ? 'warning' :
                                                    item.condition === 'Poor' ? 'danger' : 'default'
                                                }
                                                className="font-bold"
                                            >
                                                {item.condition}
                                            </Chip>
                                        </TableCell>
                                        <TableCell className="text-xs text-slate-500 font-bold uppercase tracking-wider">{item.date}</TableCell>
                                        <TableCell>
                                            <div className="flex justify-center">
                                                {item.processed ? (
                                                    item.condition === 'Poor' ? (
                                                        <Chip size="sm" color="danger" variant="shadow" className="bg-red-600 font-bold" startContent={<XCircle weight="bold" />}>
                                                            QC Failed
                                                        </Chip>
                                                    ) : (
                                                        <Chip size="sm" color="success" variant="shadow" className="bg-emerald-600 font-bold" startContent={<CheckCircle weight="bold" />}>
                                                            QC Passed
                                                        </Chip>
                                                    )
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        className="font-bold h-9 px-6 rounded-xl !bg-indigo-600 text-white shadow-md border-none"
                                                        startContent={<ArrowsClockwise weight="bold" />}
                                                        onPress={() => handleStartInspection(item)}
                                                    >
                                                        Start Inspection
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardBody>
            </Card>

            <Modal 
                isOpen={isOpen} 
                onOpenChange={onOpenChange} 
                size="md" 
                scrollBehavior="inside"
                placement="center"
                classNames={{
                    backdrop: "bg-slate-900/50 backdrop-blur-sm",
                    base: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-2xl max-h-[90vh]"
                }}
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        <h3 className="text-xl font-bold">Item Inspection Report</h3>
                        <p className="text-xs text-slate-500 font-normal">Verify and document the quality check of the returned product.</p>
                    </ModalHeader>
                    <ModalBody className="space-y-4">
                        <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl space-y-1.5 border border-slate-100 dark:border-slate-800/60">
                            <div className="text-xs font-bold text-slate-400 uppercase">Product Name</div>
                            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{selectedItem?.item}</div>
                            <div className="text-xs text-slate-500">Returned by: <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedItem?.returnedBy}</span></div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Verified Condition</label>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { key: "Excellent", label: "Excellent", desc: "No signs of usage / Mint" },
                                    { key: "Good", label: "Good", desc: "Minor usage / No issues" },
                                    { key: "Fair", label: "Fair (Damaged)", desc: "Wear & Tear / Needs repair" },
                                    { key: "Poor", label: "Poor (Severe)", desc: "Broken / Scrap item" }
                                ].map((cond) => {
                                    const isSelected = selectedCondition === cond.key;
                                    return (
                                        <button
                                            key={cond.key}
                                            type="button"
                                            onClick={() => setSelectedCondition(cond.key)}
                                            className={`p-3 text-left border rounded-xl transition-all flex flex-col justify-between ${
                                                isSelected
                                                    ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400"
                                                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300"
                                            }`}
                                        >
                                            <span className="text-sm font-bold">{cond.label}</span>
                                            <span className="text-[10px] text-slate-500 font-medium leading-normal mt-0.5">{cond.desc}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inspection & QC Notes</label>
                            <Textarea
                                value={inspectionNotes}
                                onChange={(e) => setInspectionNotes(e.target.value)}
                                placeholder="Document any minor/major scratches, malfunctions, missing accessories, or general remarks..."
                                classNames={{
                                    input: "text-sm",
                                    inputWrapper: "bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 focus-within:!border-indigo-500 rounded-xl"
                                }}
                                minRows={3}
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter className="gap-2 border-t border-slate-100 dark:border-slate-800/80 pt-4">
                        <Button
                            variant="flat"
                            color="default"
                            onPress={onClose}
                            className="font-bold rounded-xl"
                        >
                            Cancel
                        </Button>
                        <Button
                            isLoading={submitting}
                            onPress={handleProcessSubmit}
                            className="font-bold rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                        >
                            Submit QC Report
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
