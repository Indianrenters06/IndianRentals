'use client';

import { useState } from 'react';
import { motion } from "framer-motion";
import { Card, CardBody, Button, Divider, Progress } from "@heroui/react";
import { CloudArrowUp, FileText, DownloadSimple, CheckCircle, WarningCircle } from "@phosphor-icons/react";

export default function BulkUpload() {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleUploadSim = () => {
        setUploading(true);
        let p = 0;
        const interval = setInterval(() => {
            p += 10;
            setProgress(p);
            if (p >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    setUploading(false);
                    setProgress(0);
                    alert("Mock upload complete! (UI Only)");
                }, 500);
            }
        }, 300);
    };

    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Bulk <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Upload</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Import hundreds of products at once using CSV or Excel templates.</p>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <CardBody className="p-0">
                        <div className="p-10 flex flex-col items-center justify-center min-h-[400px]">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="w-32 h-32 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-500 mb-6 cursor-pointer border-2 border-dashed border-indigo-200 dark:border-indigo-800"
                            >
                                <CloudArrowUp size={48} weight="bold" />
                            </motion.div>

                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Drop your CSV files here</h3>
                            <p className="text-slate-500 text-center max-w-sm mb-8">Ensure your file follows the standard template format to avoid import errors.</p>

                            <div className="flex gap-4">
                                <Button
                                    color="primary"
                                    className="px-10 font-bold bg-indigo-600 shadow-lg shadow-indigo-500/20"
                                    isLoading={uploading}
                                    onPress={handleUploadSim}
                                >
                                    {uploading ? 'Processing...' : 'Browse Files'}
                                </Button>
                                <Button variant="flat" className="px-10 font-bold">Standard Import</Button>
                            </div>

                            {uploading && (
                                <div className="w-full max-w-md mt-10 space-y-2">
                                    <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
                                        <span>Reading Rows</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <Progress
                                        aria-label="Upload progress"
                                        value={progress}
                                        className="h-2"
                                        color="primary"
                                        classNames={{ indicator: "bg-indigo-500" }}
                                    />
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
                                    <span>Download the latest template.</span>
                                </li>
                                <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-400">
                                    <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" weight="bold" />
                                    <span>Categories must exist beforehand.</span>
                                </li>
                                <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-400">
                                    <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" weight="bold" />
                                    <span>Image URLs should be public.</span>
                                </li>
                                <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-400">
                                    <WarningCircle className="text-rose-500 shrink-0 mt-0.5" weight="bold" />
                                    <span>Maximum 500 rows per file.</span>
                                </li>
                            </ul>
                            <Button fullWidth variant="flat" color="secondary" startContent={<DownloadSimple weight="bold" />} className="mt-4 font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                Download CSV Template
                            </Button>
                        </CardBody>
                    </Card>

                    <Card className="bg-indigo-600 border border-indigo-500 shadow-lg shadow-indigo-500/20">
                        <CardBody className="p-6 text-white space-y-3">
                            <h4 className="font-bold">Pro Tip</h4>
                            <p className="text-white/80 text-sm leading-relaxed">
                                You can use Cloudinary URLs in the 'Images' column to automatically link media to your products.
                            </p>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}
