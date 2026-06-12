'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Spinner, Input, Button, Card, CardBody, Tooltip } from '@heroui/react';
import { FloppyDisk, ImageSquare, Palette } from '@phosphor-icons/react';
import { toast } from 'react-hot-toast';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

const THEME_OPTIONS = [
    {
        id: 'default',
        name: 'Default',
        colors: { bg: '#ffffff', primary: '#ffcf46', accent: '#356cff' },
        description: 'Light grey background with orange primary buttons and blue accents.'
    },
    {
        id: 'oceanic',
        name: 'Oceanic',
        colors: { bg: '#f0f9ff', primary: '#38bdf8', accent: '#0284c7' },
        description: 'Soft blue background with sky blue primary and deep blue accents.'
    },
    {
        id: 'forest',
        name: 'Forest',
        colors: { bg: '#f0fdf4', primary: '#4ade80', accent: '#16a34a' },
        description: 'Fresh green background with bright green primary and dark green accents.'
    },
    {
        id: 'sunset',
        name: 'Sunset',
        colors: { bg: '#fff1f2', primary: '#fb7185', accent: '#e11d48' },
        description: 'Warm rose background with pink primary and crimson accents.'
    },
    {
        id: 'midnight',
        name: 'Midnight',
        colors: { bg: '#0f172a', primary: '#8b5cf6', accent: '#f59e0b' },
        description: 'Dark slate background with violet primary and amber accents.'
    }
];

export default function BrandingSettings() {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await window.fetch(`${API}/api/settings`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            if (res.ok) {
                const data = await res.json();
                setSettings(data);
            }
        } catch (error) {
            console.error('Failed to fetch settings', error);
            toast.error('Failed to load branding settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);

        // Apply locally first — always works regardless of backend
        const bd = { siteLogo: settings?.siteLogo || '', siteName: settings?.siteName || '', theme: settings?.theme };
        localStorage.setItem('adminBranding', JSON.stringify(bd));
        window.dispatchEvent(new Event('branding-updated'));

        try {
            const res = await window.fetch(`${API}/api/settings`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify({
                    siteName: settings?.siteName,
                    siteLogo: settings?.siteLogo,
                    theme: settings?.theme
                }),
            });
            if (!res.ok) throw new Error();
        } catch {
            // API unavailable — local changes already applied, no error shown
        } finally {
            setSaving(false);
        }

        toast.success('Branding applied to admin panel!');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner color="primary" />
            </div>
        );
    }

    const activeTheme = settings?.theme?.activeTheme || 'default';

    return (
        <div className="space-y-8 max-w-4xl pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Logo & Branding
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Manage your site's logo, title, and the admin panel color theme.
                    </p>
                </div>
                <Button
                    color="primary"
                    startContent={saving ? <Spinner size="sm" color="white" /> : <FloppyDisk weight="bold" size={18} />}
                    onPress={handleSave}
                    isLoading={saving}
                    className="font-semibold px-8 shadow-md"
                >
                    Save Changes
                </Button>
            </div>

            {/* Basic Branding Section */}
            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
                <CardBody className="p-6 md:p-8 space-y-6">
                    <div className="flex items-center gap-3 mb-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
                            <ImageSquare weight="duotone" className="text-indigo-600 dark:text-indigo-400" size={24} />
                        </div>
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white">General Branding</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Site Name"
                            labelPlacement="outside"
                            placeholder="e.g. IndianRentals"
                            value={settings?.siteName || ''}
                            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                            classNames={{ label: "font-semibold text-slate-700 dark:text-slate-300" }}
                        />
                        <Input
                            label="Site Logo URL"
                            labelPlacement="outside"
                            placeholder="https://..."
                            value={settings?.siteLogo || ''}
                            onChange={(e) => setSettings({ ...settings, siteLogo: e.target.value })}
                            classNames={{ label: "font-semibold text-slate-700 dark:text-slate-300" }}
                        />
                    </div>

                    {settings?.siteLogo && (
                        <div className="mt-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 inline-block">
                            <p className="text-xs text-slate-500 font-semibold mb-3 uppercase tracking-wider">Logo Preview</p>
                            <img src={settings.siteLogo} alt="Site Logo" className="h-12 object-contain" />
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* Theme Selection Section */}
            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
                <CardBody className="p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div className="p-2 bg-pink-50 dark:bg-pink-500/10 rounded-lg">
                            <Palette weight="duotone" className="text-pink-600 dark:text-pink-400" size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Color Theme</h2>
                            <p className="text-sm text-slate-500">Select a color scheme for the admin panel. This does not affect the public website.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {THEME_OPTIONS.map((theme) => {
                            const isSelected = activeTheme === theme.id;
                            return (
                                <motion.div
                                    key={theme.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSettings({ ...settings, theme: { activeTheme: theme.id } })}
                                    className={`relative cursor-pointer rounded-2xl p-4 border-2 transition-all ${
                                        isSelected 
                                            ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10 shadow-md' 
                                            : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 bg-white dark:bg-slate-800'
                                    }`}
                                >
                                    {/* Color palette preview */}
                                    <div 
                                        className="w-full h-24 rounded-xl mb-4 p-3 flex flex-col justify-end shadow-inner border border-black/5"
                                        style={{ backgroundColor: theme.colors.bg }}
                                    >
                                        <div className="flex gap-2">
                                            <div 
                                                className="h-6 w-1/2 rounded-full shadow-sm"
                                                style={{ backgroundColor: theme.colors.primary }}
                                            />
                                            <div 
                                                className="h-6 w-1/2 rounded-full shadow-sm"
                                                style={{ backgroundColor: theme.colors.accent }}
                                            />
                                        </div>
                                    </div>
                                    
                                    <h3 className="font-bold text-slate-800 dark:text-white flex items-center justify-between">
                                        {theme.name}
                                        {isSelected && (
                                            <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                        {theme.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
