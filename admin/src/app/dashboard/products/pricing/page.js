'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Card, CardBody, Button, Table, TableHeader, TableColumn, 
    TableBody, TableRow, TableCell, Chip, Divider,
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, 
    useDisclosure, Input, Select, SelectItem, Textarea, Spinner
} from "@heroui/react";
import { Plus, CurrencyInr, Lightning, Trash, Package, Clock, ShieldCheck, ListPlus } from "@phosphor-icons/react";
import { toast } from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const BILLING_CYCLES = [
    { label: "1 Month", value: "1" },
    { label: "3 Months", value: "3" },
    { label: "6 Months", value: "6" },
    { label: "12 Months", value: "12" },
];

export default function PricingPlans() {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [formData, setFormData] = useState({
        name: "",
        baseRate: "",
        duration: "1",
        description: "",
        features: ""
    });

    const fetchPlans = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API}/api/admin/pricing-plans`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setPlans(data);
            }
        } catch (error) {
            toast.error("Failed to load plans");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const handleCreate = async () => {
        if (!formData.name || !formData.baseRate) {
            toast.error("Please fill in required fields");
            return;
        }

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API}/api/admin/pricing-plans`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    baseRate: Number(formData.baseRate),
                    duration: Number(formData.duration),
                    features: formData.features.split("\n").filter(f => f.trim() !== "")
                })
            });

            if (res.ok) {
                toast.success("Pricing plan created!");
                fetchPlans();
                onClose();
                setFormData({ name: "", baseRate: "", duration: "1", description: "", features: "" });
            } else {
                const err = await res.json();
                toast.error(err.message || "Failed to create plan");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this plan?")) return;
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API}/api/admin/pricing-plans/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                toast.success("Plan removed");
                fetchPlans();
            }
        } catch (error) {
            toast.error("Failed to delete plan");
        }
    };

    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Pricing <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Plans</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Configure flexible rental durations and subscription models.</p>
                </motion.div>

                <Button 
                    onPress={onOpen}
                    className="h-12 px-8 rounded-xl !bg-indigo-600 hover:!bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 transition-all" 
                    startContent={<Plus weight="bold" size={20} />}
                >
                    Create Plan
                </Button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Spinner color="secondary" />
                </div>
            ) : plans.length === 0 ? (
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardBody className="py-20 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-500 mb-6">
                            <CurrencyInr size={40} weight="duotone" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Pricing Plans Yet</h3>
                        <p className="text-slate-500 max-w-sm mb-8">Click the "Create Plan" button to start defining your rental durations and base pricing rates.</p>
                        <Button 
                            onPress={onOpen}
                            className="h-11 px-8 rounded-xl !bg-indigo-600 hover:!bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 transition-all" 
                            startContent={<Plus weight="bold" size={18} />}
                        >
                            Get Started
                        </Button>
                    </CardBody>
                </Card>
            ) : (
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <Table aria-label="Pricing Plans Table" classNames={{ wrapper: "p-0 rounded-none shadow-none bg-transparent" }}>
                        <TableHeader>
                            <TableColumn>PLAN NAME</TableColumn>
                            <TableColumn>DURATION</TableColumn>
                            <TableColumn>BASE RATE</TableColumn>
                            <TableColumn>STATUS</TableColumn>
                            <TableColumn align="center">ACTIONS</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {plans.map(plan => (
                                <TableRow key={plan._id} className="border-b border-slate-100 dark:border-slate-800/50 last:border-0">
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-900 dark:text-white">{plan.name}</span>
                                            <span className="text-xs text-slate-500 line-clamp-1">{plan.description}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Chip size="sm" variant="flat" color="secondary" className="font-bold">
                                            {plan.duration} Month{plan.duration !== 1 ? 's' : ''}
                                        </Chip>
                                    </TableCell>
                                    <TableCell className="font-bold text-indigo-600 dark:text-indigo-400">₹{plan.baseRate}</TableCell>
                                    <TableCell>
                                        <Chip size="sm" color={plan.isActive ? "success" : "default"} variant="dot">
                                            {plan.isActive ? "Active" : "Inactive"}
                                        </Chip>
                                    </TableCell>
                                    <TableCell>
                                        <Button isIconOnly variant="light" color="danger" onPress={() => handleDelete(plan._id)}>
                                            <Trash weight="bold" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            )}

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
                                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Create New <span className="text-indigo-500">Pricing Plan</span></h2>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">Configure duration and base rates</p>
                            </ModalHeader>
                            <ModalBody className="py-6 px-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input 
                                        label="Plan Name" 
                                        placeholder="e.g. Weekly Pro" 
                                        variant="bordered"
                                        labelPlacement="inside"
                                        value={formData.name}
                                        onValueChange={v => setFormData(p => ({ ...p, name: v }))}
                                        classNames={{ label: "font-bold text-slate-700 dark:text-slate-300" }}
                                    />
                                    <Select 
                                        label="Duration" 
                                        placeholder="Select duration" 
                                        variant="bordered"
                                        labelPlacement="inside"
                                        selectedKeys={[formData.duration]}
                                        onSelectionChange={keys => setFormData(p => ({ ...p, duration: Array.from(keys)[0] }))}
                                        classNames={{ label: "font-bold text-slate-700 dark:text-slate-300" }}
                                    >
                                        {BILLING_CYCLES.map(c => (
                                            <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                                        ))}
                                    </Select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input 
                                        label="Base Rate (₹)" 
                                        placeholder="0.00" 
                                        type="number"
                                        variant="bordered"
                                        labelPlacement="inside"
                                        value={formData.baseRate}
                                        onValueChange={v => setFormData(p => ({ ...p, baseRate: v }))}
                                        classNames={{ label: "font-bold text-slate-700 dark:text-slate-300" }}
                                        startContent={<CurrencyInr className="text-slate-400" />}
                                    />
                                    <Input 
                                        label="Short Description" 
                                        placeholder="Brief summary of the plan" 
                                        variant="bordered"
                                        labelPlacement="inside"
                                        value={formData.description}
                                        onValueChange={v => setFormData(p => ({ ...p, description: v }))}
                                        classNames={{ label: "font-bold text-slate-700 dark:text-slate-300" }}
                                    />
                                </div>

                                <Textarea 
                                    label="Included Features" 
                                    placeholder="Feature 1&#10;Feature 2&#10;Feature 3" 
                                    variant="bordered"
                                    labelPlacement="inside"
                                    value={formData.features}
                                    onValueChange={v => setFormData(p => ({ ...p, features: v }))}
                                    classNames={{ label: "font-bold text-slate-700 dark:text-slate-300" }}
                                    description="One feature per line"
                                />

                                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/20 flex gap-3">
                                    <Lightning size={20} className="text-amber-500 shrink-0 mt-0.5" weight="fill" />
                                    <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed font-medium">
                                        These plans will be globally available as options when customers choose their rental duration on the frontend.
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
                                    className="!bg-indigo-600 hover:!bg-indigo-700 text-white font-bold px-8 rounded-xl shadow-lg shadow-indigo-500/30"
                                >
                                    Create Plan
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
