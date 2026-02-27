"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Card,
    CardBody,
    Button,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Avatar,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
} from "@heroui/react";
import { Plus, ShoppingCart, MagnifyingGlass, DotsThreeVertical, PencilSimple, Trash, Eye } from "@phosphor-icons/react";

export default function AllProducts() {
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/products`);
            if (res.ok) {
                const data = await res.json();
                setProducts(Array.isArray(data.products) ? data.products : []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/products/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (res.ok) {
                alert("Product deleted successfully!");
                fetchProducts();
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
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Inventory <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Catalogue</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Manage all the products actively listed on your platform.</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                    <Button
                        color="primary"
                        variant="shadow"
                        className="shadow-indigo-500/30 font-medium"
                        startContent={<Plus className="w-5 h-5" />}
                        onPress={() => router.push("/dashboard/products/add")}
                    >
                        Add New Product
                    </Button>
                </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm w-full transition-colors duration-300">
                    <CardBody className="p-0">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
                            <div className="relative group w-72">
                                <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 w-full"
                                />
                            </div>
                        </div>

                        <Table
                            aria-label="Products Table"
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
                                <TableColumn>PRODUCT</TableColumn>
                                <TableColumn>CATEGORY</TableColumn>
                                <TableColumn>PRICE / MONTH</TableColumn>
                                <TableColumn>STOCK</TableColumn>
                                <TableColumn>STATUS</TableColumn>
                                <TableColumn align="center">ACTIONS</TableColumn>
                            </TableHeader>
                            <TableBody items={products} isLoading={loading} emptyContent={loading ? "Loading products..." : "No products found."}>
                                {(product) => (
                                    <TableRow key={product._id}>
                                        <TableCell>
                                            <div className="flex items-center gap-4">
                                                <Avatar src={product.images && product.images[0] ? product.images[0] : "https://ui-avatars.com/api/?name=" + product.name} size="md" radius="md" className="ring-1 ring-slate-200 dark:ring-slate-700 bg-white dark:bg-slate-800" />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-200 group-hover:text-indigo-500 transition-colors">{product.name}</span>
                                                    <span className="text-xs text-slate-500 font-mono">ID: {product._id.toString().slice(-6)}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Chip size="sm" variant="flat" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                                {product.category}
                                            </Chip>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm font-semibold text-slate-900 dark:text-slate-200">₹{product.rentalPrice}</span>
                                            <p className="text-xs text-slate-500">Deposit: ₹{product.securityDeposit}</p>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{product.stock} Units</span>
                                        </TableCell>
                                        <TableCell>
                                            {product.isActive ? (
                                                <Chip size="sm" color="success" variant="flat">Active</Chip>
                                            ) : (
                                                <Chip size="sm" color="default" variant="flat">Draft</Chip>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-center items-center gap-2">
                                                <Dropdown>
                                                    <DropdownTrigger>
                                                        <Button isIconOnly size="sm" variant="light" className="text-slate-500 hover:text-indigo-500">
                                                            <DotsThreeVertical weight="bold" />
                                                        </Button>
                                                    </DropdownTrigger>
                                                    <DropdownMenu aria-label="Product Actions">
                                                        <DropdownItem key="view" startContent={<Eye className="text-slate-400" />}>View Listing</DropdownItem>
                                                        <DropdownItem key="edit" startContent={<PencilSimple className="text-slate-400" />}>Edit Product</DropdownItem>
                                                        <DropdownItem key="delete" className="text-danger" color="danger" startContent={<Trash />} onClick={() => handleDelete(product._id)}>
                                                            Delete
                                                        </DropdownItem>
                                                    </DropdownMenu>
                                                </Dropdown>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardBody>
                </Card>
            </motion.div>
        </div>
    );
}
