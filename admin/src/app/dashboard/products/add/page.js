"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Card,
    CardBody,
    Input,
    Textarea,
    Button,
    Select,
    SelectItem,
    Divider,
} from "@heroui/react";
import { FloppyDisk, ArrowLeft, Image, Tag, MapPin, Cube, CurrencyInr } from "@phosphor-icons/react";

export default function AddProduct() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        subcategory: "",
        brand: "",
        rentalPrice: "",
        securityDeposit: "",
        stock: "1",
        condition: "Good",
        city: "",
        state: "",
        image: "", // We'll take a single image URL for simplicity, pushed to images array
    });

    useEffect(() => {
        // Fetch categories
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/categories`);
                const data = await res.json();
                // Assuming API returns array of categories
                setCategories(Array.isArray(data) ? data : data.categories || []);
            } catch (err) {
                console.error("Failed to fetch categories", err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        // If a category is selected, find its subcategories
        if (formData.category) {
            const selectedCat = categories.find(c => c.name === formData.category || c._id === formData.category);
            if (selectedCat?._id) {
                const fetchSubcats = async () => {
                    try {
                        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/categories/${selectedCat._id}/subcategories`);
                        const data = await res.json();
                        setSubcategories(Array.isArray(data) ? data : data.subcategories || []);
                    } catch (err) {
                        console.error(err);
                    }
                };
                fetchSubcats();
            } else {
                setSubcategories([]);
            }
        } else {
            setSubcategories([]);
        }
    }, [formData.category, categories]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem("adminToken");

            // Determine category string
            const selectedCat = categories.find(c => c._id === formData.category);
            const categoryName = selectedCat ? selectedCat.name : formData.category;

            const payload = {
                name: formData.name,
                description: formData.description,
                category: categoryName,
                subcategory: formData.subcategory || null,
                brand: formData.brand,
                rentalPrice: Number(formData.rentalPrice),
                securityDeposit: Number(formData.securityDeposit),
                stock: Number(formData.stock),
                condition: formData.condition,
                city: formData.city,
                state: formData.state,
                images: formData.image ? [formData.image] : [],
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/products`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || "Failed to create product");
            }

            alert("Product successfully created!");
            router.push("/dashboard/products");
        } catch (err) {
            alert(err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                    <Button
                        variant="light"
                        className="mb-2 text-slate-500 dark:text-slate-400 p-0 hover:bg-transparent hover:text-indigo-500"
                        startContent={<ArrowLeft />}
                        onClick={() => router.push("/dashboard/products")}
                    >
                        Back to Products
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Add New <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Product</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">List a new item in your inventory catalogue.</p>
                </motion.div>
            </div>

            <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
            >
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm w-full transition-colors duration-300">
                    <CardBody className="p-8 space-y-8">

                        {/* Basic Information */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Tag className="text-indigo-500" /> Basic Information
                                </h3>
                                <Divider className="bg-slate-100 dark:bg-slate-800" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                        Product Name <span className="text-rose-500">*</span>
                                    </label>
                                    <Input
                                        isRequired
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter product title"
                                        variant="bordered"
                                        classNames={{
                                            inputWrapper: "h-12 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 transition-all shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20"
                                        }}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                        Brand Name
                                    </label>
                                    <Input
                                        name="brand"
                                        value={formData.brand}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Sony, Nikon"
                                        variant="bordered"
                                        classNames={{
                                            inputWrapper: "h-12 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 transition-all shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20"
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                    Product Description <span className="text-rose-500">*</span>
                                </label>
                                <Textarea
                                    isRequired
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Describe features, colors, condition etc."
                                    variant="bordered"
                                    minRows={4}
                                    classNames={{
                                        inputWrapper: "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 transition-all shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20"
                                    }}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                        Primary Category <span className="text-rose-500">*</span>
                                    </label>
                                    <Select
                                        isRequired
                                        placeholder="Select a category"
                                        variant="bordered"
                                        selectedKeys={formData.category ? [formData.category] : []}
                                        onSelectionChange={(keys) => handleSelectChange('category', Array.from(keys)[0])}
                                        classNames={{
                                            trigger: "h-12 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 transition-all shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20"
                                        }}
                                    >
                                        {categories.map((cat) => (
                                            <SelectItem key={cat._id} value={cat._id}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                        Sub-Category (Optional)
                                    </label>
                                    <Select
                                        placeholder="Choose sub-cat"
                                        variant="bordered"
                                        isDisabled={subcategories.length === 0}
                                        selectedKeys={formData.subcategory ? [formData.subcategory] : []}
                                        onSelectionChange={(keys) => handleSelectChange('subcategory', Array.from(keys)[0])}
                                        classNames={{
                                            trigger: "h-12 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 transition-all shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20"
                                        }}
                                    >
                                        {subcategories.map((subcat) => (
                                            <SelectItem key={subcat._id} value={subcat._id}>
                                                {subcat.name}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Pricing & Inventory */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    <CurrencyInr weight="bold" className="text-indigo-500" /> Pricing & Inventory
                                </h3>
                                <Divider className="bg-slate-100 dark:bg-slate-800" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                        Daily Rent (₹) <span className="text-rose-500">*</span>
                                    </label>
                                    <Input
                                        isRequired
                                        type="number"
                                        name="rentalPrice"
                                        value={formData.rentalPrice}
                                        onChange={handleInputChange}
                                        placeholder="0.00"
                                        variant="bordered"
                                        startContent={<span className="text-indigo-500 font-bold text-sm">₹</span>}
                                        classNames={{
                                            inputWrapper: "h-12 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 transition-all shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20"
                                        }}
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                        Security Deposit (₹) <span className="text-rose-500">*</span>
                                    </label>
                                    <Input
                                        isRequired
                                        type="number"
                                        name="securityDeposit"
                                        value={formData.securityDeposit}
                                        onChange={handleInputChange}
                                        placeholder="0.00"
                                        variant="bordered"
                                        startContent={<span className="text-indigo-500 font-bold text-sm">₹</span>}
                                        classNames={{
                                            inputWrapper: "h-12 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 transition-all shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20"
                                        }}
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                        Stock Quantity <span className="text-rose-500">*</span>
                                    </label>
                                    <Input
                                        isRequired
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleInputChange}
                                        placeholder="1"
                                        variant="bordered"
                                        startContent={<Cube className="text-indigo-500 text-sm" />}
                                        classNames={{
                                            inputWrapper: "h-12 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 transition-all shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20"
                                        }}
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                        Item Condition <span className="text-rose-500">*</span>
                                    </label>
                                    <Select
                                        isRequired
                                        variant="bordered"
                                        placeholder="Condition"
                                        selectedKeys={[formData.condition]}
                                        onSelectionChange={(keys) => handleSelectChange('condition', Array.from(keys)[0])}
                                        classNames={{
                                            trigger: "h-12 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 transition-all shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20"
                                        }}
                                    >
                                        <SelectItem key="New" value="New">New</SelectItem>
                                        <SelectItem key="Good" value="Good">Good</SelectItem>
                                        <SelectItem key="Fair" value="Fair">Fair</SelectItem>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Location & Media */}
                        {/* Location & Media */}
                        {/* Location & Media */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    <MapPin className="text-rose-500" /> Location & Media
                                </h3>
                                <Divider className="bg-slate-100 dark:bg-slate-800" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                        Pickup City <span className="text-rose-500">*</span>
                                    </label>
                                    <Input
                                        isRequired
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Bangalore"
                                        variant="bordered"
                                        classNames={{
                                            inputWrapper: "h-12 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 transition-all shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20"
                                        }}
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                        State <span className="text-rose-500">*</span>
                                    </label>
                                    <Input
                                        isRequired
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Karnataka"
                                        variant="bordered"
                                        classNames={{
                                            inputWrapper: "h-12 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 transition-all shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20"
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                    Product Images (Cloudinary URL)
                                </label>
                                <Input
                                    name="image"
                                    value={formData.image}
                                    onChange={handleInputChange}
                                    placeholder="https://res.cloudinary.com/..."
                                    variant="bordered"
                                    startContent={<Image className="text-indigo-500 text-sm" />}
                                    classNames={{
                                        inputWrapper: "h-12 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 transition-all shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20"
                                    }}
                                />

                                {formData.image && (
                                    <div className="mt-4 p-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-sm overflow-hidden bg-slate-50 dark:bg-slate-900/40">
                                        <p className="text-[10px] uppercase font-bold text-slate-400 mb-3 tracking-widest text-center">Visual Preview</p>
                                        <div className="h-48 flex items-center justify-center bg-white dark:bg-slate-950 rounded-2xl overflow-hidden shadow-inner border border-slate-100 dark:border-slate-800/50">
                                            <img src={formData.image} alt="Preview" className="max-w-full max-h-full object-contain p-2" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button
                                type="submit"
                                color="primary"
                                size="lg"
                                isLoading={loading}
                                startContent={!loading && <FloppyDisk />}
                                className="font-medium px-10 shadow-lg shadow-indigo-500/30"
                            >
                                Publish Product
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </motion.form>
        </div>
    );
}
