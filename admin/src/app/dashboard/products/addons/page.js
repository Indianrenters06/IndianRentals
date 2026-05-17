'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Card, CardBody, Button, Table, TableHeader, TableColumn, 
    TableBody, TableRow, TableCell, Chip, Avatar,
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
    useDisclosure, Input, Textarea, Select, SelectItem,
    Switch, Spinner
} from "@heroui/react";
import { Plus, Package, Trash, PencilSimple, PlusCircle, Info, ShieldCheck } from "@phosphor-icons/react";
import { toast } from "react-hot-toast";

const ADDON_CATEGORIES = [
    { label: "Delivery", value: "Delivery" },
    { label: "Service", value: "Service" },
    { label: "Accessories", value: "Accessories" },
    { label: "Subscription", value: "Subscription" },
    { label: "Other", value: "Other" }
];

export default function AddonsManagement() {
    const [addons, setAddons] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [modalType, setModalType] = useState("add"); // "add" or "edit"
    const [selectedAddon, setSelectedAddon] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Delivery",
        stock: "Unlimited",
        isConditional: false,
        conditionRule: ""
    });

    const fetchAddons = async () => {
        setLoading(true);
        try {
            const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            const res = await fetch(`${API}/api/addons`);
            if (res.ok) {
                const data = await res.json();
                setAddons(data);
            }
        } catch (error) {
            toast.error("Failed to load addons");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddons();
    }, []);

    const handleOpenModal = (type, addon = null) => {
        setModalType(type);
        if (type === "edit" && addon) {
            setSelectedAddon(addon);
            setFormData({
                name: addon.name,
                description: addon.description,
                price: addon.price,
                category: addon.category,
                stock: addon.stock,
                isConditional: addon.isConditional || false,
                conditionRule: addon.conditionRule || ""
            });
        } else {
            setSelectedAddon(null);
            setFormData({
                name: "",
                description: "",
                price: "",
                category: "Delivery",
                stock: "Unlimited",
                isConditional: false,
                conditionRule: ""
            });
        }
        onOpen();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("adminToken");
            const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            const method = modalType === "add" ? "POST" : "PUT";
            const url = modalType === "add" ? `${API}/api/addons` : `${API}/api/addons/${selectedAddon._id}`;

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success(`Addon ${modalType === "add" ? "created" : "updated"} successfully`);
                fetchAddons();
                onOpenChange(false);
            } else {
                const err = await res.json();
                toast.error(err.message || "Something went wrong");
            }
        } catch (error) {
            toast.error("Network error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this addon?")) return;
        try {
            const token = localStorage.getItem("adminToken");
            const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            const res = await fetch(`${API}/api/addons/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.ok) {
                toast.success("Addon deleted");
                fetchAddons();
            } else {
                toast.error("Failed to delete addon");
            }
        } catch (error) {
            toast.error("Network error");
        }
    };

    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Product <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Add-ons</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Manage accessories, express delivery, and special services.</p>
                </motion.div>

                <Button 
                    color="primary" 
                    variant="shadow" 
                    className="h-12 px-8 rounded-xl !bg-indigo-600 hover:!bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 transition-all" 
                    startContent={<PlusCircle weight="bold" size={20} />}
                    onClick={() => handleOpenModal("add")}
                >
                    Add New Service
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Spinner label="Loading add-ons..." />
                </div>
            ) : (
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <CardBody className="p-0">
                        <Table
                            aria-label="Add-ons Table"
                            removeWrapper
                            classNames={{
                                thead: "bg-slate-50 dark:bg-slate-950/80",
                                th: "text-slate-500 font-bold uppercase text-xs py-4 px-6 h-12 pt-0",
                                td: "py-4 px-6 border-b border-slate-100 dark:border-slate-800/50",
                                tr: "hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                            }}
                        >
                            <TableHeader>
                                <TableColumn>SERVICE / ACCESSORY</TableColumn>
                                <TableColumn>CATEGORY</TableColumn>
                                <TableColumn>PRICE</TableColumn>
                                <TableColumn>STOCK</TableColumn>
                                <TableColumn align="center">ACTIONS</TableColumn>
                            </TableHeader>
                            <TableBody items={addons} emptyContent="No add-ons found. Click 'Add New Service' to get started.">
                                {(item) => (
                                    <TableRow key={item._id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar 
                                                    name={item.name.charAt(0)} 
                                                    size="sm" 
                                                    className="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400 shrink-0" 
                                                />
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-semibold">{item.name}</span>
                                                        {item.isConditional && (
                                                            <Chip size="sm" color="warning" variant="flat" className="h-4 text-[9px] px-1">Conditional</Chip>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-slate-500 line-clamp-1">{item.description}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Chip size="sm" variant="flat" color="secondary" className="font-medium">{item.category}</Chip>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm font-bold text-slate-900 dark:text-white">{item.price}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-slate-500">{item.stock}</span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-center gap-2">
                                                <Button isIconOnly size="sm" variant="light" onClick={() => handleOpenModal("edit", item)}>
                                                    <PencilSimple />
                                                </Button>
                                                <Button isIconOnly size="sm" variant="light" color="danger" onClick={() => handleDelete(item._id)}>
                                                    <Trash />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardBody>
                </Card>
            )}

            {/* Recommendations Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <Card className="bg-indigo-50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/20">
                    <CardBody className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center">
                                <ShieldCheck size={24} />
                            </div>
                            <h3 className="text-lg font-bold">Standard Add-ons</h3>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                            Make sure to include these standard services for your customers:
                        </p>
                        <ul className="space-y-2">
                            {["Delivery & Pickup", "Express Delivery", "Relocation Service"].map(s => (
                                <li key={s} className="flex items-center gap-2 text-sm font-medium">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> {s}
                                </li>
                            ))}
                        </ul>
                    </CardBody>
                </Card>

                <Card className="bg-amber-50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/20">
                    <CardBody className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                                <Info size={24} />
                            </div>
                            <h3 className="text-lg font-bold">Upgrade Logic</h3>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                            Implement the "Upgrade Option" for loyal customers:
                        </p>
                        <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/50">
                            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">Rule Recommendation:</p>
                            <p className="text-xs text-slate-500 mt-1 italic">
                                "Users can upgrade the product if they have rented for around 6 months or more."
                            </p>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Modal for Add/Edit */}
            <Modal 
                isOpen={isOpen} 
                onOpenChange={onOpenChange} 
                size="2xl"
                scrollBehavior="inside"
                classNames={{
                    backdrop: "bg-slate-900/50 backdrop-blur-sm",
                    base: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl",
                    header: "border-b border-slate-100 dark:border-slate-800/60",
                    footer: "border-t border-slate-100 dark:border-slate-800/60",
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <form onSubmit={handleSubmit}>
                            <ModalHeader className="flex flex-col gap-1 py-5 px-6">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                    {modalType === "add" ? "Create New Add-on" : "Edit Add-on"}
                                </h2>
                                <p className="text-sm text-slate-500 font-normal">
                                    {modalType === "add" ? "Add a new service, accessory, or delivery option." : "Update the details and rules for this add-on."}
                                </p>
                            </ModalHeader>
                            <ModalBody className="py-6 px-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <Input 
                                        label="Name" 
                                        placeholder="e.g. Express Delivery" 
                                        variant="bordered"
                                        isRequired
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                    />
                                    <Select 
                                        label="Category" 
                                        variant="bordered"
                                        isRequired
                                        selectedKeys={[formData.category]}
                                        onChange={e => setFormData({...formData, category: e.target.value})}
                                    >
                                        {ADDON_CATEGORIES.map(cat => (
                                            <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                                        ))}
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input 
                                        label="Price Display" 
                                        placeholder="e.g. ₹499/order or Varies" 
                                        variant="bordered"
                                        isRequired
                                        value={formData.price}
                                        onChange={e => setFormData({...formData, price: e.target.value})}
                                    />
                                    <Input 
                                        label="Stock Info" 
                                        placeholder="e.g. Unlimited" 
                                        variant="bordered"
                                        value={formData.stock}
                                        onChange={e => setFormData({...formData, stock: e.target.value})}
                                    />
                                </div>
                                <Textarea 
                                    label="Description" 
                                    placeholder="Briefly describe this service or accessory..." 
                                    variant="bordered"
                                    isRequired
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                />

                                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold">Conditional Add-on</span>
                                            <span className="text-xs text-slate-500">Enable if this option has special eligibility rules</span>
                                        </div>
                                        <Switch 
                                            isSelected={formData.isConditional}
                                            onValueChange={val => setFormData({...formData, isConditional: val})}
                                        />
                                    </div>
                                    <AnimatePresence>
                                        {formData.isConditional && (
                                            <motion.div 
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <Input 
                                                    label="Eligibility Rule" 
                                                    placeholder="e.g. After 6 months of rental" 
                                                    variant="bordered"
                                                    value={formData.conditionRule}
                                                    onChange={e => setFormData({...formData, conditionRule: e.target.value})}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </ModalBody>
                            <ModalFooter className="py-4 px-6">
                                <Button variant="light" onPress={onClose} className="font-semibold">Cancel</Button>
                                <Button 
                                    className="h-12 px-10 rounded-xl !bg-indigo-600 hover:!bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 transition-all" 
                                    type="submit" 
                                    isLoading={isSubmitting}
                                    variant="shadow"
                                >
                                    {modalType === "add" ? "Create Add-on" : "Save Changes"}
                                </Button>
                            </ModalFooter>
                        </form>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
