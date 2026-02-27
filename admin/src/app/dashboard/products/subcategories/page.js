'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Card, CardBody, Button, Table, TableHeader, TableColumn,
    TableBody, TableRow, TableCell, Chip, Select, SelectItem,
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
    useDisclosure, Input, Textarea, Avatar
} from "@heroui/react";
import { Plus, SquaresFour, Trash, PencilSimple, Folder, Image } from "@phosphor-icons/react";

export default function SubcategoriesManagement() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedParent, setSelectedParent] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        image: "",
        parentCategory: ""
    });

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/categories`);
            if (res.ok) {
                const data = await res.json();
                const cats = Array.isArray(data) ? data : data.categories || [];
                setCategories(cats);
                if (cats.length > 0 && !selectedParent) {
                    setSelectedParent(cats[0]._id);
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchSubcategories = async (parentId) => {
        if (!parentId) return;
        try {
            setLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/categories/${parentId}/subcategories`);
            if (res.ok) {
                const data = await res.json();
                setSubcategories(Array.isArray(data) ? data : data.subcategories || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (selectedParent) {
            fetchSubcategories(selectedParent);
        }
    }, [selectedParent]);

    const handleCreateSubcategory = async (onClose) => {
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/categories/${formData.parentCategory}/subcategories`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    image: formData.image
                })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || "Failed to create subcategory");
            }

            alert("Subcategory created successfully!");
            setFormData({ name: "", description: "", image: "", parentCategory: "" });
            onClose();
            if (formData.parentCategory === selectedParent) {
                fetchSubcategories(selectedParent);
            } else {
                setSelectedParent(formData.parentCategory);
            }
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDelete = async (subId) => {
        if (!confirm("Are you sure? This backend might not support direct subcategory deletion yet (check API).")) return;
        // The API route doesn't show a direct DELETE for subcategories in categoryRoutes.js
        // Usually handled by updating the parent or a general subcategory route.
        alert("Delete functionality needs specific backend endpoint for subcategories.");
    };

    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Subcategory <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Management</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Drill down your catalogue into specific sub-groups.</p>
                </motion.div>

                <Button
                    color="primary"
                    variant="shadow"
                    className="bg-indigo-600 shadow-indigo-500/30 font-bold"
                    startContent={<Plus weight="bold" />}
                    onPress={() => {
                        setFormData(prev => ({ ...prev, parentCategory: selectedParent }));
                        onOpen();
                    }}
                >
                    Add Subcategory
                </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Filter by Parent:</span>
                <Select
                    placeholder="Select parent category"
                    className="max-w-xs"
                    selectedKeys={selectedParent ? [selectedParent] : []}
                    onSelectionChange={(keys) => setSelectedParent(Array.from(keys)[0])}
                    variant="bordered"
                >
                    {categories.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>
                            {cat.name}
                        </SelectItem>
                    ))}
                </Select>
            </div>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <CardBody className="p-0">
                    <Table
                        aria-label="Subcategories Table"
                        classNames={{
                            wrapper: "p-0 rounded-none shadow-none bg-transparent",
                            thead: "bg-slate-50 dark:bg-slate-950/80",
                            th: "text-slate-500 font-semibold uppercase text-xs py-4 px-6 border-b border-slate-200 dark:border-slate-800",
                            td: "py-4 px-6 border-b border-slate-100 dark:border-slate-800/50",
                            tr: "hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                        }}
                    >
                        <TableHeader>
                            <TableColumn>SUBCATEGORY</TableColumn>
                            <TableColumn>DESCRIPTION</TableColumn>
                            <TableColumn align="center">ACTIONS</TableColumn>
                        </TableHeader>
                        <TableBody items={subcategories} isLoading={loading} emptyContent={loading ? "Loading subcategories..." : "No subcategories found for this category."}>
                            {(sub) => (
                                <TableRow key={sub._id || sub.name}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar src={sub.image || "https://ui-avatars.com/api/?name=" + sub.name} size="sm" />
                                            <span className="text-sm font-semibold">{sub.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm text-slate-500 line-clamp-1">{sub.description || "—"}</span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center gap-2">
                                            <Button isIconOnly size="sm" variant="light"><PencilSimple /></Button>
                                            <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => handleDelete(sub._id)}><Trash /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} classNames={{ base: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" }}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Add Subcategory</ModalHeader>
                            <ModalBody className="space-y-4">
                                <Select
                                    label="Parent Category"
                                    isRequired
                                    selectedKeys={formData.parentCategory ? [formData.parentCategory] : []}
                                    onSelectionChange={(keys) => setFormData(prev => ({ ...prev, parentCategory: Array.from(keys)[0] }))}
                                    variant="bordered"
                                >
                                    {categories.map((cat) => (
                                        <SelectItem key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </Select>
                                <Input
                                    label="Subcategory Name"
                                    placeholder="e.g. DSLR Cameras"
                                    variant="bordered"
                                    value={formData.name}
                                    onValueChange={(val) => setFormData(prev => ({ ...prev, name: val }))}
                                />
                                <Textarea
                                    label="Description"
                                    placeholder="Brief description..."
                                    variant="bordered"
                                    value={formData.description}
                                    onValueChange={(val) => setFormData(prev => ({ ...prev, description: val }))}
                                />
                                <Input
                                    label="Image URL"
                                    placeholder="Cloudinary URL"
                                    variant="bordered"
                                    startContent={<Image />}
                                    value={formData.image}
                                    onValueChange={(val) => setFormData(prev => ({ ...prev, image: val }))}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="flat" onPress={onClose}>Cancel</Button>
                                <Button color="primary" className="bg-indigo-600 font-bold" onPress={() => handleCreateSubcategory(onClose)}>Create</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
