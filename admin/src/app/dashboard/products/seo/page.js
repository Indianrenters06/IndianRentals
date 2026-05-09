'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Card, CardBody, Button, Table, TableHeader, TableColumn,
    TableBody, TableRow, TableCell, Chip, Input, Spinner,
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
    useDisclosure, Textarea, Divider
} from "@heroui/react";
import { MagnifyingGlass, FloppyDisk, Tag, Browser, Globe, Info, CheckCircle, WarningCircle } from "@phosphor-icons/react";
import { toast } from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function SEOManagement() {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const [seoForm, setSeoForm] = useState({
        seoTitle: "",
        seoDescription: "",
        seoKeywords: "",
        slug: ""
    });

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API}/api/products`);
            if (res.ok) {
                const data = await res.json();
                setProducts(data.products || []);
            }
        } catch (err) {
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEditSEO = (product) => {
        setSelectedProduct(product);
        setSeoForm({
            seoTitle: product.seoTitle || "",
            seoDescription: product.seoDescription || "",
            seoKeywords: product.seoKeywords || "",
            slug: product.slug || product.name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]/g, "")
        });
        onOpen();
    };

    const handleSaveSEO = async () => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API}/api/admin/products/${selectedProduct._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(seoForm)
            });

            if (res.ok) {
                toast.success("SEO data updated!");
                fetchProducts();
                onClose();
            } else {
                const err = await res.json();
                toast.error(err.message || "Failed to update SEO");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        SEO <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Management</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Optimize meta tags and search visibility for your products.</p>
                </motion.div>
            </div>

            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <CardBody className="p-0">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                        <Input
                            placeholder="Search product to optimize..."
                            startContent={
                                <div className="flex items-center justify-center pointer-events-none">
                                    <MagnifyingGlass className="text-slate-400" size={18} />
                                </div>
                            }
                            className="max-w-md"
                            variant="bordered"
                            value={searchTerm}
                            onValueChange={setSearchTerm}
                        />
                    </div>
                    <Table
                        aria-label="SEO management table"
                        classNames={{
                            wrapper: "p-0 rounded-none shadow-none bg-transparent",
                            th: "bg-slate-50 dark:bg-slate-950/80 text-slate-500 font-bold uppercase text-xs h-12 pt-0",
                            td: "py-4 px-6 border-b border-slate-100 dark:border-slate-800/50"
                        }}
                    >
                        <TableHeader>
                            <TableColumn>PRODUCT</TableColumn>
                            <TableColumn>CATEGORY</TableColumn>
                            <TableColumn>SEO STATUS</TableColumn>
                            <TableColumn align="center">ACTIONS</TableColumn>
                        </TableHeader>
                        <TableBody items={filteredProducts} isLoading={loading} emptyContent={loading ? <Spinner /> : "No products found."}>
                            {(item) => (
                                <TableRow key={item._id}>
                                    <TableCell className="font-semibold text-slate-900 dark:text-slate-200">{item.name}</TableCell>
                                    <TableCell>
                                        <Chip size="sm" variant="flat" color="primary" className="font-bold">{item.category}</Chip>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {item.seoTitle ? (
                                                <>
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                    <span className="text-xs text-emerald-600 font-bold">Optimized</span>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                                                    <span className="text-xs text-slate-500">Pending Optimization</span>
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center gap-2">
                                            <Button
                                                onPress={() => handleEditSEO(item)}
                                                size="sm"
                                                variant="flat"
                                                color="primary"
                                                className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold rounded-lg"
                                                startContent={<Globe size={14} weight="bold" />}
                                            >
                                                Edit SEO
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                size="3xl"
                scrollBehavior="inside"
                classNames={{
                    backdrop: "bg-slate-900/50 backdrop-blur-sm",
                    base: "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl rounded-3xl",
                    header: "border-b border-slate-100 dark:border-slate-800/60"
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 py-6 px-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-500">
                                        <Globe size={24} weight="duotone" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">SEO <span className="text-indigo-500">Optimization</span></h2>
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">{selectedProduct?.name}</p>
                                    </div>
                                </div>
                            </ModalHeader>
                            <ModalBody className="py-8 px-8 space-y-8">
                                {/* Google Search Preview Card */}
                                <div className="space-y-3">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                        <Browser size={16} /> Google Search Preview
                                    </p>
                                    <Card className="bg-white border border-slate-200 shadow-sm p-5 rounded-2xl">
                                        <div className="space-y-1">
                                            <p className="text-[#1a0dab] text-xl font-medium hover:underline cursor-pointer truncate">
                                                {seoForm.seoTitle || selectedProduct?.name || "Product Title"}
                                            </p>
                                            <p className="text-[#006621] text-sm truncate flex items-center gap-1">
                                                indianrentals.com › products › <span className="font-semibold">{seoForm.slug || "product-slug"}</span>
                                            </p>
                                            <p className="text-[#4d5156] text-sm line-clamp-2 leading-relaxed">
                                                {seoForm.seoDescription || "Provide a meta description to help search engines understand what this product is about and attract more clicks."}
                                            </p>
                                        </div>
                                    </Card>
                                </div>

                                <Divider className="bg-slate-100 dark:bg-slate-800" />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <Input
                                            label="Meta Title"
                                            placeholder="Optimize title for search engines"
                                            variant="bordered"
                                            labelPlacement="inside"
                                            value={seoForm.seoTitle}
                                            onValueChange={v => setSeoForm(p => ({ ...p, seoTitle: v }))}
                                            classNames={{ label: "font-bold text-slate-700 dark:text-slate-300" }}
                                            description={`${seoForm.seoTitle.length}/60 characters recommended`}
                                        />
                                        <Input
                                            label="URL Slug"
                                            placeholder="product-name-slug"
                                            variant="bordered"
                                            labelPlacement="inside"
                                            value={seoForm.slug}
                                            onValueChange={v => setSeoForm(p => ({ ...p, slug: v }))}
                                            classNames={{ label: "font-bold text-slate-700 dark:text-slate-300" }}
                                            startContent={<span className="text-xs text-slate-400">/</span>}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <Textarea
                                            label="Meta Description"
                                            placeholder="Write a compelling summary..."
                                            variant="bordered"
                                            labelPlacement="inside"
                                            minRows={3}
                                            value={seoForm.seoDescription}
                                            onValueChange={v => setSeoForm(p => ({ ...p, seoDescription: v }))}
                                            classNames={{ label: "font-bold text-slate-700 dark:text-slate-300" }}
                                            description={`${seoForm.seoDescription.length}/160 characters recommended`}
                                        />
                                    </div>
                                </div>

                                <Input
                                    label="Keywords"
                                    placeholder="laptop rental, macbook on rent, delhi rentals"
                                    variant="bordered"
                                    labelPlacement="inside"
                                    value={seoForm.seoKeywords}
                                    onValueChange={v => setSeoForm(p => ({ ...p, seoKeywords: v }))}
                                    classNames={{ label: "font-bold text-slate-700 dark:text-slate-300" }}
                                    description="Separate keywords with commas"
                                    startContent={<Tag className="text-slate-400" />}
                                />

                                <div className="p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/20 flex gap-4">
                                    <Info size={24} className="text-indigo-500 shrink-0 mt-0.5" weight="fill" />
                                    <p className="text-sm text-indigo-700 dark:text-indigo-300 leading-relaxed font-medium">
                                        Good SEO helps your products rank higher on Google. Focus on relevant keywords that customers use when searching for rentals.
                                    </p>
                                </div>
                            </ModalBody>
                            <ModalFooter className="border-t border-slate-100 dark:border-slate-800/60 py-5 px-8">
                                <Button variant="light" onPress={onClose} className="font-semibold text-slate-600">
                                    Discard
                                </Button>
                                <Button
                                    color="primary"
                                    onPress={handleSaveSEO}
                                    isLoading={isSaving}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-10 rounded-2xl shadow-xl shadow-indigo-500/40 transition-all"
                                    startContent={!isSaving && <FloppyDisk size={18} weight="bold" />}
                                >
                                    Save SEO Data
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
