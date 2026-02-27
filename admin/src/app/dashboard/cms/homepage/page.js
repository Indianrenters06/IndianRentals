'use client';

import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import {
    Card, CardBody, Button, Divider, Input,
    Textarea, Tabs, Tab, Image, Switch, Spinner
} from "@heroui/react";
import {
    Layout, Image as PhosphorImage, FloppyDisk
} from "@phosphor-icons/react";

export default function CMSHomepage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [cmsData, setCmsData] = useState({
        heroEnabled: true,
        heroTitle: "",
        heroSubtitle: "",
        heroImage: "",
        publishStatus: "published"
    });

    const fetchCMS = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/cms/homepage`);
            if (res.ok) {
                const data = await res.json();
                setCmsData({
                    heroEnabled: data.heroEnabled ?? true,
                    heroTitle: data.heroTitle || "",
                    heroSubtitle: data.heroSubtitle || "",
                    heroImage: data.heroImage || "",
                    publishStatus: data.publishStatus || "published"
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCMS();
    }, []);

    const handleUpdate = async () => {
        try {
            setSaving(true);
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/cms/homepage`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(cmsData)
            });

            if (res.ok) {
                alert("Homepage updated successfully!");
            } else {
                const err = await res.json();
                throw new Error(err.message || "Failed to update");
            }
        } catch (err) {
            alert(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                <Spinner size="lg" color="primary" />
                <p className="text-slate-500 font-medium">Loading Homepage configuration...</p>
            </div>
        );
    }

    return (
        <div className="w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
                        Homepage <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Editor</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Manage hero sections, banners and featured categories on your landing page.</p>
                </motion.div>

                <Button
                    color="primary"
                    variant="shadow"
                    startContent={<FloppyDisk />}
                    isLoading={saving}
                    onPress={handleUpdate}
                    className="font-bold shadow-indigo-500/20 px-8 bg-indigo-600"
                >
                    Publish Changes
                </Button>
            </div>

            <Tabs aria-label="Homepage Sections" color="primary" variant="underlined" classNames={{ tabList: "gap-6", cursor: "w-full bg-indigo-500", tab: "max-w-fit px-0 h-12" }}>
                <Tab key="hero" title={
                    <div className="flex items-center gap-2">
                        <Layout size={16} />
                        <span>Hero Section</span>
                    </div>
                }>
                    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mt-4 overflow-hidden">
                        <CardBody className="p-8 space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h4 className="text-lg font-bold">Visibility</h4>
                                    <p className="text-sm text-slate-500">Toggle the main hero section on the homepage.</p>
                                </div>
                                <Switch
                                    isSelected={cmsData.heroEnabled}
                                    onValueChange={(val) => setCmsData(prev => ({ ...prev, heroEnabled: val }))}
                                    color="success"
                                />
                            </div>

                            <Divider />

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Main Headline</label>
                                        <Input
                                            value={cmsData.heroTitle}
                                            onValueChange={(val) => setCmsData(prev => ({ ...prev, heroTitle: val }))}
                                            placeholder="Rent Anything, Anywhere in India"
                                            variant="bordered"
                                            classNames={{ inputWrapper: "h-12" }}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Sub-headline</label>
                                        <Textarea
                                            value={cmsData.heroSubtitle}
                                            onValueChange={(val) => setCmsData(prev => ({ ...prev, heroSubtitle: val }))}
                                            placeholder="Premium rentals at your fingertips. Why buy when you can rent?"
                                            variant="bordered"
                                            minRows={3}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Hero Visual</label>
                                    <Input
                                        placeholder="Cloudinary or Image URL"
                                        variant="bordered"
                                        startContent={<PhosphorImage />}
                                        value={cmsData.heroImage}
                                        onValueChange={(val) => setCmsData(prev => ({ ...prev, heroImage: val }))}
                                        classNames={{ inputWrapper: "h-12" }}
                                    />
                                    <div className="aspect-video bg-slate-50 dark:bg-slate-950 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden group">
                                        {cmsData.heroImage ? (
                                            <Image
                                                src={cmsData.heroImage}
                                                className="absolute inset-0 w-full h-full object-cover opacity-60"
                                                alt="Hero Preview"
                                            />
                                        ) : (
                                            <div className="z-10 flex flex-col items-center gap-2 text-slate-400">
                                                <PhosphorImage size={32} />
                                                <span className="text-xs">Preview image will appear here</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Tab>
                <Tab key="banners" title="Promo Banners" />
                <Tab key="featured" title="Featured Categories" />
                <Tab key="testimonials" title="User Testimonials" />
            </Tabs>
        </div>
    );
}
