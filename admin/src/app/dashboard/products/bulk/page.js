'use client';

import { useState, useRef } from 'react';
import { motion } from "framer-motion";
import { Card, CardBody, Button, Divider, Progress } from "@heroui/react";
import { CloudArrowUp, FileText, DownloadSimple, CheckCircle, WarningCircle, Image as ImageIcon, Copy, Table } from "@phosphor-icons/react";
import Papa from 'papaparse';

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const getToken = () => typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

export default function BulkUpload() {
    const [activeTab, setActiveTab] = useState("products");

    // Product states
    const [uploadingProducts, setUploadingProducts] = useState(false);
    const [productProgress, setProductProgress] = useState(0);
    const [productLog, setProductLog] = useState([]);
    const csvFileRef = useRef(null);

    // Image states
    const [uploadingImages, setUploadingImages] = useState(false);
    const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
    const imageFileRef = useRef(null);

    // --- Bulk Product Functionality ---
    const handleProductCSVUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingProducts(true);
        setProductProgress(0);
        setProductLog([]);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async function (results) {
                const rows = results.data;
                const total = rows.length;
                if (total === 0) {
                    setProductLog(prev => [...prev, "CSV is empty or invalid format."]);
                    setUploadingProducts(false);
                    return;
                }

                let successCount = 0;
                let failCount = 0;

                for (let i = 0; i < total; i++) {
                    const row = rows[i];
                    try {
                        const body = {
                            name: row.name,
                            description: row.description,
                            category: row.category,
                            subcategory: row.subcategory || "",
                            brand: row.brand || "",
                            images: row.images ? row.images.split(',').map(s => s.trim()) : [],
                            rentalPrice: Number(row.rentalPrice),
                            securityDeposit: Number(row.securityDeposit),
                            stock: Number(row.stock),
                            condition: row.condition || "Good",
                            city: row.city,
                            state: row.state,
                            isActive: row.isActive ? row.isActive.toLowerCase() === 'true' : true
                        };

                        const res = await fetch(`${API}/api/products`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${getToken()}`
                            },
                            body: JSON.stringify(body)
                        });

                        if (res.ok) {
                            successCount++;
                            setProductLog(prev => [...prev, `[Success] Imported ${row.name}`]);
                        } else {
                            const err = await res.json();
                            failCount++;
                            setProductLog(prev => [...prev, `[Error] ${row.name}: ${err.message}`]);
                        }
                    } catch (err) {
                        failCount++;
                        setProductLog(prev => [...prev, `[Exception] ${row.name}: ${err.message}`]);
                    }

                    // Force progress to update per item
                    setProductProgress(Math.round(((i + 1) / total) * 100));
                }

                setProductLog(prev => [...prev, `--- Done! ${successCount} imported, ${failCount} failed. ---`]);
                setUploadingProducts(false);
                if (csvFileRef.current) csvFileRef.current.value = "";
            },
            error: function (err) {
                setProductLog(prev => [...prev, `File Parsing Error: ${err.message}`]);
                setUploadingProducts(false);
            }
        });
    };

    // --- Bulk Image Functionality ---
    const handleImageUpload = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploadingImages(true);
        const formData = new FormData();
        Array.from(files).forEach(file => formData.append("image", file));

        try {
            const res = await fetch(`${API}/api/upload`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${getToken()}`
                },
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                setUploadedImageUrls(prev => [...data.images, ...prev]);
            } else {
                const err = await res.json();
                alert(`Upload failed: ${err.message}`);
            }
        } catch (err) {
            alert(`Upload failed: ${err.message}`);
        } finally {
            setUploadingImages(false);
            if (imageFileRef.current) imageFileRef.current.value = "";
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    // --- CSV Template Download ---
    const handleDownloadTemplate = () => {
        const headers = ["name", "description", "category", "subcategory", "brand", "images", "rentalPrice", "securityDeposit", "stock", "condition", "city", "state", "isActive"];
        const dummyRow = ["MacBook Pro M3", "Latest Apple Silicone", "Apple", "", "Apple", "https://url1,https://url2", "4500", "15000", "5", "Good", "Mumbai", "Maharashtra", "true"];

        const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + dummyRow.join(",");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "product_import_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Bulk <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Upload</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Import products natively from CSV and optionally bulk upload images to get their URLs.</p>
                </motion.div>
            </div>

            {/* Tab Switches */}
            <div className="flex gap-2">
                <Button color={activeTab === 'products' ? "primary" : "default"} variant={activeTab === 'products' ? "solid" : "flat"} onPress={() => setActiveTab('products')} startContent={<Table weight="bold" />}>Products CSV</Button>
                <Button color={activeTab === 'images' ? "secondary" : "default"} variant={activeTab === 'images' ? "solid" : "flat"} onPress={() => setActiveTab('images')} startContent={<ImageIcon weight="bold" />}>Images Assets</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {activeTab === 'products' && (
                    <>
                        <Card className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <CardBody className="p-0">
                                <div className="p-10 flex flex-col items-center justify-center min-h-[400px]">
                                    <input type="file" ref={csvFileRef} accept=".csv" className="hidden" onChange={handleProductCSVUpload} />

                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        onClick={() => !uploadingProducts && csvFileRef.current.click()}
                                        className={`w-32 h-32 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-500 mb-6 cursor-pointer border-2 border-dashed border-indigo-200 dark:border-indigo-800 ${uploadingProducts ? 'opacity-50 pointer-events-none' : ''}`}
                                    >
                                        <CloudArrowUp size={48} weight="bold" />
                                    </motion.div>

                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Drop your Products CSV file here</h3>
                                    <p className="text-slate-500 text-center max-w-sm mb-8">Ensure your file follows the standard template format to avoid import errors. Do not upload more than 500 rows at a time.</p>

                                    <div className="flex gap-4">
                                        <Button
                                            className="h-12 px-10 rounded-xl font-bold !bg-indigo-600 hover:!bg-indigo-700 text-white shadow-lg shadow-indigo-500/30 transition-all"
                                            isLoading={uploadingProducts}
                                            onPress={() => csvFileRef.current.click()}
                                        >
                                            {uploadingProducts ? 'Processing...' : 'Browse CSV Files'}
                                        </Button>
                                    </div>

                                    {uploadingProducts && (
                                        <div className="w-full max-w-md mt-10 space-y-2">
                                            <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
                                                <span>Importing Rows...</span>
                                                <span>{productProgress}%</span>
                                            </div>
                                            <Progress value={productProgress} className="h-2" color="primary" classNames={{ indicator: "bg-indigo-500" }} />
                                        </div>
                                    )}

                                    {/* Logs Display */}
                                    {productLog.length > 0 && (
                                        <div className="w-full max-w-xl mt-6">
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Import Logs</p>
                                            <div className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 max-h-48 overflow-y-auto text-xs font-mono space-y-1">
                                                {productLog.map((log, i) => (
                                                    <div key={i} className={log.includes('[Error]') || log.includes('[Exception]') ? 'text-red-500' : log.includes('Done') ? 'text-emerald-500 font-bold' : 'text-slate-700 dark:text-slate-300'}>
                                                        {log}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardBody>
                        </Card>

                        <div className="space-y-6">
                            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                                <CardBody className="p-6 space-y-6">
                                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <FileText className="text-amber-500" weight="bold" />
                                        Requirements
                                    </h3>
                                    <Divider className="opacity-50" />
                                    <ul className="space-y-4">
                                        <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-400">
                                            <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" weight="bold" />
                                            <span>Download the latest template below.</span>
                                        </li>
                                        <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-400">
                                            <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" weight="bold" />
                                            <span>Separate multiple images with commas.</span>
                                        </li>
                                        <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-400">
                                            <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" weight="bold" />
                                            <span>Include city/state information.</span>
                                        </li>
                                        <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-400">
                                            <WarningCircle className="text-rose-500 shrink-0 mt-0.5" weight="bold" />
                                            <span>Maximum 500 rows per file.</span>
                                        </li>
                                    </ul>
                                    <Button 
                                        onPress={handleDownloadTemplate} 
                                        fullWidth 
                                        className="mt-4 h-11 rounded-xl font-bold !bg-indigo-50 dark:!bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:!bg-indigo-100 dark:hover:!bg-indigo-500/20 transition-all"
                                        startContent={<DownloadSimple weight="bold" size={18} />}
                                    >
                                        Download CSV Template
                                    </Button>
                                </CardBody>
                            </Card>

                            <Card className="bg-indigo-600 border border-indigo-500 shadow-lg shadow-indigo-500/20">
                                <CardBody className="p-6 text-white space-y-3">
                                    <h4 className="font-bold">Images First!</h4>
                                    <p className="text-white/80 text-sm leading-relaxed">
                                        Switch to the <strong>Images Assets</strong> tab first, upload your images, and copy the URLs generated. Then paste those URLs into your CSV file.
                                    </p>
                                </CardBody>
                            </Card>
                        </div>
                    </>
                )}

                {activeTab === 'images' && (
                    <Card className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <CardBody className="p-6 md:p-10 min-h-[400px]">
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="md:w-1/3 border-r border-slate-100 dark:border-slate-800 pr-0 md:pr-8">
                                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2"><ImageIcon className="text-indigo-500" /> Upload Images</h3>
                                    <p className="text-sm text-slate-500 mb-6">Drag and drop or select multiple image files to upload to Cloudinary. Once uploaded, click on any URL to copy it directly.</p>

                                    <input type="file" multiple accept="image/*" ref={imageFileRef} className="hidden" onChange={handleImageUpload} />
                                    <Button
                                        className="w-full h-12 rounded-xl font-bold !bg-purple-600 hover:!bg-purple-700 text-white shadow-lg shadow-purple-500/30 transition-all"
                                        isLoading={uploadingImages}
                                        onPress={() => imageFileRef.current.click()}
                                        startContent={<CloudArrowUp weight="bold" size={20} />}
                                    >
                                        {uploadingImages ? 'Uploading Assets...' : 'Choose Images'}
                                    </Button>
                                </div>
                                <div className="md:w-2/3">
                                    <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-4">Uploaded Assets Map</h4>
                                    {uploadedImageUrls.length === 0 ? (
                                        <div className="w-full h-32 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 text-sm">
                                            No recent images uploaded in this session.
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 gap-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                                            {uploadedImageUrls.map((url, idx) => (
                                                <div key={idx} className="flex items-center gap-4 bg-slate-50 dark:bg-slate-950 p-2 pr-4 rounded-xl border border-slate-200 dark:border-slate-800">
                                                    <img src={url} alt="Uploaded preview" className="w-12 h-12 rounded object-cover border border-slate-200 dark:border-slate-700" />
                                                    <div className="flex-1 truncate">
                                                        <p className="text-xs truncate font-mono text-slate-600 dark:text-slate-400">{url}</p>
                                                    </div>
                                                    <Button size="sm" isIconOnly variant="flat" color="primary" onPress={() => copyToClipboard(url)} title="Copy URL">
                                                        <Copy size={16} />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                )}
            </div>
        </div>
    );
}
