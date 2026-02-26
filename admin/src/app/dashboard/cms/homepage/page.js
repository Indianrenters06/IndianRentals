"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Card,
    CardBody,
    CardHeader,
    CardFooter,
    Input,
    Button,
    Switch,
    Select,
    SelectItem,
    Textarea,
} from "@heroui/react";
import {
    FiSave,
    FiImage,
    FiType,
    FiAlignLeft,
    FiList,
    FiLink,
    FiCamera,
    FiClock,
    FiEye,
    FiRotateCcw,
    FiSettings,
    FiBold,
    FiItalic,
    FiUnderline,
    FiHash,
} from "react-icons/fi";

export default function CMSHomepage() {
    const [heroEnabled, setHeroEnabled] = useState(true);
    const [heroTitle, setHeroTitle] = useState("");
    const [heroSubtitle, setHeroSubtitle] = useState("");
    const [heroImage, setHeroImage] = useState("");
    const [overlayColor, setOverlayColor] = useState("rgba(0,0,0,0.5)");
    const [pageContent, setPageContent] = useState("");
    const [publishStatus, setPublishStatus] = useState("draft");
    const [scheduledPublishTime, setScheduledPublishTime] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCMS = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/cms/homepage`);
                if (res.ok) {
                    const data = await res.json();
                    setHeroEnabled(data.heroEnabled !== false);
                    setHeroTitle(data.heroTitle || "");
                    setHeroSubtitle(data.heroSubtitle || "");
                    setHeroImage(data.heroImage || "");
                    setOverlayColor(data.overlayColor || "rgba(0,0,0,0.5)");
                    setPageContent(data.pageContent || "");
                    setPublishStatus(data.publishStatus || "draft");
                }
            } catch (err) {
                console.error("Failed to load CMS data", err);
            }
        };
        fetchCMS();
    }, []);

    const handleSave = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/cms/homepage`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    heroEnabled,
                    heroTitle,
                    heroSubtitle,
                    heroImage,
                    overlayColor,
                    pageContent,
                    publishStatus
                })
            });

            if (res.ok) {
                alert("CMS Homepage updated successfully!");
            } else {
                throw new Error("Failed to update CMS");
            }
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-[1200px] mx-auto w-full space-y-6 pb-12">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Homepage <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">CMS Controls</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Manage and publish the hero section and page content for your storefront.</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex items-center gap-3">
                    <Button color="default" variant="flat" startContent={<FiEye className="w-4 h-4" />}>
                        Preview
                    </Button>
                    <Button
                        color="primary"
                        variant="shadow"
                        className="shadow-indigo-500/30 font-medium"
                        startContent={<FiSave className="w-4 h-4" />}
                        isLoading={loading}
                        onPress={handleSave}
                    >
                        Save Changes
                    </Button>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column (Editor) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Hero Section Configuration */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>
                        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm w-full transition-colors duration-300">
                            <CardHeader className="flex justify-between items-center px-6 py-5 border-b border-slate-200 dark:border-slate-800/60">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg">
                                        <FiImage className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Hero Section</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Customize the main landing banner</p>
                                    </div>
                                </div>
                                <Switch
                                    isSelected={heroEnabled}
                                    onValueChange={setHeroEnabled}
                                    color="success"
                                    size="sm"
                                >
                                    <span className="text-xs font-medium text-slate-500">{heroEnabled ? "Enabled" : "Disabled"}</span>
                                </Switch>
                            </CardHeader>

                            <CardBody className={`p-6 space-y-6 ${!heroEnabled && "opacity-50 pointer-events-none transition-opacity"}`}>
                                <div className="grid grid-cols-1 gap-6">
                                    <Input
                                        label="Hero Title"
                                        placeholder="e.g. Rent the Best Tech Gear Today"
                                        variant="bordered"
                                        labelPlacement="outside"
                                        value={heroTitle}
                                        onValueChange={setHeroTitle}
                                        classNames={{
                                            label: "text-slate-700 dark:text-slate-300 font-medium",
                                            inputWrapper: "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition-colors"
                                        }}
                                    />
                                    <Textarea
                                        label="Hero Subtitle"
                                        placeholder="Provide a compelling secondary phrase here..."
                                        variant="bordered"
                                        labelPlacement="outside"
                                        minRows={2}
                                        value={heroSubtitle}
                                        onValueChange={setHeroSubtitle}
                                        classNames={{
                                            label: "text-slate-700 dark:text-slate-300 font-medium",
                                            inputWrapper: "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition-colors"
                                        }}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm text-slate-700 dark:text-slate-300 font-medium">Banner Image Upload</label>
                                            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors h-[120px]" onClick={() => {
                                                const url = prompt("Enter Cloudinary/Image URL for Hero Banner:");
                                                if (url) setHeroImage(url);
                                            }}>
                                                {heroImage ? (
                                                    <img src={heroImage} alt="Hero" className="h-full object-contain rounded" />
                                                ) : (
                                                    <>
                                                        <FiCamera className="w-6 h-6 text-slate-400 mb-2" />
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Click to enter image URL</p>
                                                        <p className="text-xs text-slate-500 mt-1">SVG, PNG, JPG</p>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <Input
                                                label="Overlay Color (Hex/RGBA)"
                                                placeholder="e.g. rgba(0,0,0,0.5)"
                                                variant="bordered"
                                                labelPlacement="outside"
                                                value={overlayColor}
                                                onValueChange={setOverlayColor}
                                                classNames={{
                                                    label: "text-slate-700 dark:text-slate-300 font-medium",
                                                    inputWrapper: "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700"
                                                }}
                                            />
                                            <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                                                <div className="w-6 h-6 rounded border border-slate-300 dark:border-slate-600 bg-black/50 overflow-hidden relative" style={{ backgroundColor: overlayColor }}>
                                                    {/* Color preview box */}
                                                </div>
                                                <span className="text-sm text-slate-600 dark:text-slate-400 font-mono">Current Preview</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </motion.div>

                    {/* Page Content & Rich Text Area */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
                        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm w-full transition-colors duration-300 overflow-visible">
                            <CardHeader className="flex justify-between items-center px-6 py-5 border-b border-slate-200 dark:border-slate-800/60">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                                        <FiType className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Page Content</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Design your page block structure safely.</p>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardBody className="p-0">
                                <div className="bg-slate-50 dark:bg-slate-800/30 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex flex-wrap gap-2 items-center sticky top-20 z-10 hidden sm:flex">
                                    <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md p-1">
                                        <Button isIconOnly size="sm" variant="light" className="text-slate-600 dark:text-slate-300 rounded"><FiHash className="w-4 h-4" /></Button>
                                        <Button isIconOnly size="sm" variant="light" className="text-slate-600 dark:text-slate-300 rounded"><FiBold className="w-4 h-4" /></Button>
                                        <Button isIconOnly size="sm" variant="light" className="text-slate-600 dark:text-slate-300 rounded"><FiItalic className="w-4 h-4" /></Button>
                                        <Button isIconOnly size="sm" variant="light" className="text-slate-600 dark:text-slate-300 rounded"><FiUnderline className="w-4 h-4" /></Button>
                                    </div>
                                    <Divider orientation="vertical" className="h-6 opacity-30 mx-1" />
                                    <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md p-1">
                                        <Button isIconOnly size="sm" variant="light" className="text-slate-600 dark:text-slate-300 rounded"><FiAlignLeft className="w-4 h-4" /></Button>
                                        <Button isIconOnly size="sm" variant="light" className="text-slate-600 dark:text-slate-300 rounded"><FiList className="w-4 h-4" /></Button>
                                    </div>
                                    <Divider orientation="vertical" className="h-6 opacity-30 mx-1" />
                                    <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md p-1">
                                        <Button isIconOnly size="sm" variant="light" className="text-slate-600 dark:text-slate-300 rounded"><FiLink className="w-4 h-4" /></Button>
                                        <Button isIconOnly size="sm" variant="light" className="text-slate-600 dark:text-slate-300 rounded"><FiImage className="w-4 h-4" /></Button>
                                        <Button startContent={<span className="font-serif">TBL</span>} size="sm" variant="light" className="text-slate-600 dark:text-slate-300 rounded px-2 min-w-0">Table</Button>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <Textarea
                                        placeholder="Start typing your rich page content here... Add headings (H1, H2, H3), lists, links, drop in images or embed tables."
                                        variant="flat"
                                        minRows={12}
                                        value={pageContent}
                                        onValueChange={setPageContent}
                                        classNames={{
                                            inputWrapper: "bg-transparent shadow-none hover:bg-transparent focus-within:bg-transparent border-0 outline-none pb-4",
                                            input: "text-slate-700 dark:text-slate-200 text-base leading-relaxed resize-y"
                                        }}
                                    />
                                </div>
                            </CardBody>
                        </Card>
                    </motion.div>
                </div>

                {/* Right Column (Controls) */}
                <div className="space-y-6">
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
                        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm w-full transition-colors duration-300">
                            <CardHeader className="flex justify-between items-center px-6 py-5 border-b border-slate-200 dark:border-slate-800/60">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                                        <FiSettings className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Publish Control</h3>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardBody className="p-6 space-y-6">

                                <div className="space-y-2">
                                    <label className="text-sm text-slate-700 dark:text-slate-300 font-medium">Publish Status</label>
                                    <Select
                                        selectedKeys={[publishStatus]}
                                        onSelectionChange={(keys) => setPublishStatus(Array.from(keys)[0])}
                                        variant="bordered"
                                        classNames={{
                                            trigger: "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700"
                                        }}
                                    >
                                        <SelectItem key="draft" value="draft" startContent={<span className="w-2 h-2 rounded-full bg-slate-400"></span>}>
                                            Saved as Draft
                                        </SelectItem>
                                        <SelectItem key="published" value="published" startContent={<span className="w-2 h-2 rounded-full bg-emerald-400"></span>}>
                                            Published Live
                                        </SelectItem>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-slate-700 dark:text-slate-300 font-medium">Schedule Publish</label>
                                    <Input
                                        type="datetime-local"
                                        variant="bordered"
                                        startContent={<FiClock className="text-slate-400 w-4 h-4 mr-2" />}
                                        classNames={{
                                            inputWrapper: "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700"
                                        }}
                                    />
                                    <p className="text-xs text-slate-500 mt-1">Leave blank to publish immediately upon saving.</p>
                                </div>

                                <Divider className="my-2 bg-slate-200 dark:bg-slate-800" />

                                <div className="space-y-2">
                                    <label className="text-sm text-slate-700 dark:text-slate-300 font-medium">Version History</label>
                                    <Button
                                        variant="flat"
                                        className="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium border border-slate-200 dark:border-slate-700"
                                        startContent={<FiRotateCcw className="w-4 h-4" />}
                                    >
                                        View Version History
                                    </Button>
                                    <p className="text-xs text-slate-500 text-center mt-2">Last edited: Just now</p>
                                </div>

                            </CardBody>
                            <CardFooter className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800/60 flex flex-col gap-3">
                                <Button color="primary" className="w-full font-medium" size="lg" startContent={<FiSave />} isLoading={loading} onPress={handleSave}>
                                    {publishStatus === "published" ? "Update Live Page" : "Save Draft"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
