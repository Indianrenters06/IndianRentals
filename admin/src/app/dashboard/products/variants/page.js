'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Card, CardBody, Button, Table, TableHeader, TableColumn, 
    TableBody, TableRow, TableCell, Chip, Divider,
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, 
    useDisclosure, Input, Textarea, Spinner
} from "@heroui/react";
import { Plus, Stack, Trash, PencilSimple, Gear, Tag, ListBullets } from "@phosphor-icons/react";
import { toast } from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function VariantsManagement() {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [variants, setVariants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        options: ""
    });

    const fetchVariants = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API}/api/admin/variants`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setVariants(data);
            }
        } catch (error) {
            toast.error("Failed to load variants");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVariants();
    }, []);

    const handleCreate = async () => {
        if (!formData.name || !formData.options) {
            toast.error("Please fill in required fields");
            return;
        }

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API}/api/admin/variants`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    options: formData.options.split(",").map(o => o.trim()).filter(o => o !== "")
                })
            });

            if (res.ok) {
                toast.success("Variant group created!");
                fetchVariants();
                onClose();
                setFormData({ name: "", options: "" });
            } else {
                const err = await res.json();
                toast.error(err.message || "Failed to create variant");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this variant group?")) return;
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API}/api/admin/variants/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                toast.success("Variant removed");
                fetchVariants();
            }
        } catch (error) {
            toast.error("Failed to delete variant");
        }
    };

    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Product <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Variants</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Manage size, color, or specification variations across your inventory.</p>
                </motion.div>

                <Button 
                    onPress={onOpen}
                    className="h-12 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 transition-all" 
                    startContent={<Plus weight="bold" size={20} />}
                >
                    Define Type
                </Button>
            </div>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <CardBody className="p-0">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Spinner color="secondary" />
                        </div>
                    ) : (
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
                                <TableColumn align="center">ACTIONS</TableColumn>
                            </TableHeader>
                            <TableBody items={variants} emptyContent="No variant groups defined.">
                                {(group) => (
                                    <TableRow key={group._id}>
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
                                            <div className="flex justify-center gap-2">
                                                <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => handleDelete(group._id)}>
                                                    <Trash className="w-4 h-4" />
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

            <Modal 
                isOpen={isOpen} 
                onOpenChange={onOpenChange}
                size="xl"
                classNames={{
                    backdrop: "bg-slate-900/50 backdrop-blur-sm",
                    base: "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl",
                    header: "border-b border-slate-100 dark:border-slate-800/60"
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 py-5 px-6">
                                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Define <span className="text-indigo-500">Variant Type</span></h2>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">Create global variant categories</p>
                            </ModalHeader>
                            <ModalBody className="py-6 px-6 space-y-6">
                                <div className="space-y-4">
                                    <Input 
                                        label="Variant Name" 
                                        placeholder="e.g. Storage Capacity, RAM, Color" 
                                        variant="bordered"
                                        labelPlacement="inside"
                                        value={formData.name}
                                        onValueChange={v => setFormData(p => ({ ...p, name: v }))}
                                        classNames={{ label: "font-bold text-slate-700 dark:text-slate-300" }}
                                        startContent={<Tag className="text-slate-400" />}
                                    />
                                    
                                    <Textarea 
                                        label="Available Options" 
                                        placeholder="Red, Blue, Green (Comma separated)" 
                                        variant="bordered"
                                        labelPlacement="inside"
                                        value={formData.options}
                                        onValueChange={v => setFormData(p => ({ ...p, options: v }))}
                                        classNames={{ label: "font-bold text-slate-700 dark:text-slate-300" }}
                                        description="Enter options separated by commas"
                                    />
                                </div>

                                <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/20 flex gap-3">
                                    <Stack size={20} className="text-indigo-500 shrink-0 mt-0.5" weight="fill" />
                                    <p className="text-xs text-indigo-700 dark:text-indigo-400 leading-relaxed font-medium">
                                        Variant groups allow you to define standardized options that can be applied to products for different pricing levels or inventory tracking.
                                    </p>
                                </div>
                            </ModalBody>
                            <ModalFooter className="border-t border-slate-100 dark:border-slate-800/60 py-4 px-6">
                                <Button variant="light" onPress={onClose} className="font-semibold">
                                    Cancel
                                </Button>
                                <Button 
                                    color="primary" 
                                    onPress={handleCreate}
                                    isLoading={isSubmitting}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 rounded-xl shadow-lg shadow-indigo-500/30"
                                >
                                    Define Variant
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
