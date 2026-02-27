"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Card,
    CardBody,
    Button,
    Input,
    Textarea,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Avatar,
} from "@heroui/react";
import { Plus, Folder, FolderPlus, Image, Gear, Trash, PencilSimple } from "@phosphor-icons/react";

export default function CategoriesCMS() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        image: "",
    });

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/categories`);
            if (res.ok) {
                const data = await res.json();
                setCategories(Array.isArray(data) ? data : data.categories || []);
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateCategory = async (onClose) => {
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/categories`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || "Failed to create category");
            }

            alert("Category created successfully!");
            setFormData({ name: "", description: "", image: "" });
            onClose();
            fetchCategories();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this category?")) return;
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/categories/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (res.ok) {
                alert("Category deleted successfully!");
                fetchCategories();
            } else {
                const errData = await res.json();
                throw new Error(errData.message || "Failed to delete");
            }
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="w-full space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Category <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Management</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Organize your inventory with root categories and subcategories.</p>
                </motion.div>

                <div className="flex items-center gap-3">
                    <Button
                        color="primary"
                        variant="shadow"
                        className="shadow-indigo-500/20 font-bold bg-indigo-600"
                        startContent={<FolderPlus className="w-5 h-5" />}
                        onPress={onOpen}
                    >
                        Add New Category
                    </Button>
                </div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm w-full transition-colors duration-300">
                    <CardBody className="p-0">
                        <Table
                            aria-label="Categories Table"
                            classNames={{
                                wrapper: "p-0 rounded-none shadow-none bg-transparent m-0",
                                table: "w-full min-w-full",
                                thead: "bg-slate-50 dark:bg-slate-950/80",
                                th: "text-slate-500 dark:text-slate-400 font-semibold uppercase text-xs tracking-wider py-4 border-b border-slate-200 dark:border-slate-800",
                                td: "py-4 border-b border-slate-100 dark:border-slate-800/50",
                                tr: "hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group"
                            }}
                        >
                            <TableHeader>
                                <TableColumn>CATEGORY</TableColumn>
                                <TableColumn>DESCRIPTION</TableColumn>
                                <TableColumn>STATUS</TableColumn>
                                <TableColumn align="center">ACTIONS</TableColumn>
                            </TableHeader>
                            <TableBody items={categories} isLoading={loading} emptyContent={loading ? "Loading categories..." : "No categories found."}>
                                {(cat) => (
                                    <TableRow key={cat._id}>
                                        <TableCell>
                                            <div className="flex items-center gap-4">
                                                <Avatar src={cat.image || "https://ui-avatars.com/api/?name=" + cat.name} size="sm" isBordered className="ring-slate-200 dark:ring-slate-700" />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-200 group-hover:text-indigo-500 transition-colors">{cat.name}</span>
                                                    <span className="text-xs text-slate-500 font-mono">/{cat.slug}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">{cat.description || "No description provided."}</span>
                                        </TableCell>
                                        <TableCell>
                                            {cat.isActive ? (
                                                <Chip size="sm" color="success" variant="flat">Active</Chip>
                                            ) : (
                                                <Chip size="sm" color="default" variant="flat">Disabled</Chip>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-center items-center gap-3">
                                                <Button isIconOnly size="sm" variant="light" className="text-slate-500 hover:text-indigo-500">
                                                    <PencilSimple />
                                                </Button>
                                                <Button isIconOnly size="sm" variant="light" className="text-slate-500 hover:text-red-500" onClick={() => handleDelete(cat._id)}>
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
            </motion.div>

            {/* Modal for creating category */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center" classNames={{ base: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" }}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-slate-900 dark:text-white">
                                <div className="flex items-center gap-2">
                                    <Folder className="text-indigo-500" /> Add Root Category
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                <Input
                                    autoFocus
                                    isRequired
                                    label="Category Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Photography"
                                    variant="bordered"
                                    labelPlacement="outside"
                                    classNames={{ label: "text-slate-700 dark:text-slate-300 font-medium" }}
                                />
                                <Textarea
                                    label="Description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Short description of this category..."
                                    variant="bordered"
                                    labelPlacement="outside"
                                    classNames={{ label: "text-slate-700 dark:text-slate-300 font-medium" }}
                                />
                                <Input
                                    label="Cover Image (Cloudinary URL)"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleInputChange}
                                    placeholder="https://res.cloudinary.com/..."
                                    variant="bordered"
                                    labelPlacement="outside"
                                    startContent={<Image className="text-slate-400" />}
                                    classNames={{ label: "text-slate-700 dark:text-slate-300 font-medium" }}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="flat" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button color="primary" className="bg-indigo-600" onPress={() => handleCreateCategory(onClose)}>
                                    Create Category
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

        </div >
    );
}
