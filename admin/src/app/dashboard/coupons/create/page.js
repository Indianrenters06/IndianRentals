"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Card, CardBody, Input, Button, Select, SelectItem, 
    Textarea, Switch, Divider
} from "@heroui/react";
import { 
    Ticket, ArrowLeft, CheckCircle, WarningCircle, 
    Calendar, Tag, Percent, CurrencyInr, Info 
} from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CreateCoupon() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        code: "",
        discountType: "percentage",
        discountAmount: "",
        minPurchase: "",
        maxDiscount: "",
        expiryDate: "",
        usageLimit: "",
        isActive: true,
        description: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API}/api/admin/coupons`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success("Coupon created successfully!");
                router.push("/dashboard/coupons/active");
            } else {
                const data = await res.json();
                toast.error(data.message || "Failed to create coupon");
            }
        } catch (err) {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6 pb-12">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-slate-500 hover:text-indigo-500 transition-colors mb-4 text-sm font-medium"
                >
                    <ArrowLeft /> Back to Coupons
                </button>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                    Create <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">New Coupon</span>
                </h1>
                <p className="text-slate-600 dark:text-slate-400">Launch a new marketing campaign with custom discount codes.</p>
            </motion.div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column: Main Details */}
                    <div className="md:col-span-2 space-y-6">
                        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                            <CardBody className="p-6 space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">General Information</h3>
                                    <Input
                                        label="Coupon Code"
                                        placeholder="e.g. SUMMER50"
                                        value={formData.code}
                                        onValueChange={(v) => setFormData({...formData, code: v.toUpperCase()})}
                                        variant="bordered"
                                        isRequired
                                        startContent={<Tag className="text-slate-400" />}
                                        classNames={{ input: "font-mono font-bold tracking-widest" }}
                                    />
                                    <Textarea
                                        label="Description"
                                        placeholder="Briefly describe what this coupon offers..."
                                        value={formData.description}
                                        onValueChange={(v) => setFormData({...formData, description: v})}
                                        variant="bordered"
                                    />
                                </div>

                                <Divider className="opacity-50" />

                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Discount Configuration</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Select 
                                            label="Discount Type"
                                            variant="bordered"
                                            selectedKeys={[formData.discountType]}
                                            onSelectionChange={(keys) => setFormData({...formData, discountType: Array.from(keys)[0]})}
                                        >
                                            <SelectItem key="percentage" startContent={<Percent />}>Percentage</SelectItem>
                                            <SelectItem key="fixed" startContent={<CurrencyInr />}>Fixed Amount</SelectItem>
                                        </Select>
                                        <Input
                                            label="Value"
                                            type="number"
                                            placeholder={formData.discountType === 'percentage' ? "e.g. 15" : "e.g. 500"}
                                            value={formData.discountAmount}
                                            onValueChange={(v) => setFormData({...formData, discountAmount: v})}
                                            variant="bordered"
                                            isRequired
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            label="Min. Purchase"
                                            type="number"
                                            placeholder="e.g. 1000"
                                            value={formData.minPurchase}
                                            onValueChange={(v) => setFormData({...formData, minPurchase: v})}
                                            variant="bordered"
                                        />
                                        <Input
                                            label="Max. Discount"
                                            type="number"
                                            placeholder="e.g. 2000"
                                            value={formData.maxDiscount}
                                            onValueChange={(v) => setFormData({...formData, maxDiscount: v})}
                                            variant="bordered"
                                            isDisabled={formData.discountType === 'fixed'}
                                        />
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Right Column: Settings */}
                    <div className="space-y-6">
                        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                            <CardBody className="p-6 space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Validity</h3>
                                    <Input
                                        label="Expiry Date"
                                        type="date"
                                        value={formData.expiryDate}
                                        onValueChange={(v) => setFormData({...formData, expiryDate: v})}
                                        variant="bordered"
                                        isRequired
                                        startContent={<Calendar className="text-slate-400" />}
                                    />
                                    <Input
                                        label="Usage Limit"
                                        type="number"
                                        placeholder="Total times usable"
                                        value={formData.usageLimit}
                                        onValueChange={(v) => setFormData({...formData, usageLimit: v})}
                                        variant="bordered"
                                    />
                                </div>

                                <Divider className="opacity-50" />

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold">Active Status</p>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-tight">Enable/Disable Coupon</p>
                                    </div>
                                    <Switch 
                                        isSelected={formData.isActive}
                                        onValueChange={(v) => setFormData({...formData, isActive: v})}
                                        color="success"
                                    />
                                </div>

                                <Button 
                                    type="submit"
                                    color="primary"
                                    className="w-full h-12 rounded-xl font-bold text-sm bg-indigo-600 shadow-lg shadow-indigo-500/20"
                                    isLoading={loading}
                                    startContent={!loading && <Ticket weight="bold" />}
                                >
                                    Launch Coupon
                                </Button>
                            </CardBody>
                        </Card>

                        {/* Tips Card */}
                        <div className="bg-indigo-50 dark:bg-indigo-500/10 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
                            <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-2 flex items-center gap-1">
                                <Info weight="bold" /> Campaign Tip
                            </h4>
                            <p className="text-[11px] text-indigo-500/80 leading-relaxed">
                                Percentage coupons generally perform better for low-ticket items, while fixed discounts work best for high-value rentals.
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
