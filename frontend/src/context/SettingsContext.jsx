'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSettings } from '../services/settingsService';

const SettingsContext = createContext(null);

const THEMES = {
    default: {
        '--theme-bg': '#ffffff',
        '--theme-text': '#333333',
        '--theme-primary': '#ffcf46',
        '--theme-primary-hover': '#ffb91b',
        '--theme-primary-active': '#f08c00',
        '--theme-primary-focus': '#e26e00',
        '--theme-primary-disabled': '#fffaeb',
        '--theme-accent': '#356cff',
        '--theme-accent-hover': '#5b96ff',
        '--theme-accent-active': '#133fff',
        '--theme-accent-disabled': '#d6ecff',
    },
    oceanic: {
        '--theme-bg': '#f0f9ff',
        '--theme-text': '#0f172a',
        '--theme-primary': '#38bdf8',
        '--theme-primary-hover': '#7dd3fc',
        '--theme-primary-active': '#0284c7',
        '--theme-primary-focus': '#0369a1',
        '--theme-primary-disabled': '#e0f2fe',
        '--theme-accent': '#0284c7',
        '--theme-accent-hover': '#0369a1',
        '--theme-accent-active': '#0c4a6e',
        '--theme-accent-disabled': '#e0f2fe',
    },
    forest: {
        '--theme-bg': '#f0fdf4',
        '--theme-text': '#14532d',
        '--theme-primary': '#4ade80',
        '--theme-primary-hover': '#86efac',
        '--theme-primary-active': '#22c55e',
        '--theme-primary-focus': '#16a34a',
        '--theme-primary-disabled': '#dcfce7',
        '--theme-accent': '#16a34a',
        '--theme-accent-hover': '#15803d',
        '--theme-accent-active': '#14532d',
        '--theme-accent-disabled': '#dcfce7',
    },
    sunset: {
        '--theme-bg': '#fff1f2',
        '--theme-text': '#881337',
        '--theme-primary': '#fb7185',
        '--theme-primary-hover': '#fda4af',
        '--theme-primary-active': '#f43f5e',
        '--theme-primary-focus': '#e11d48',
        '--theme-primary-disabled': '#ffe4e6',
        '--theme-accent': '#e11d48',
        '--theme-accent-hover': '#be123c',
        '--theme-accent-active': '#881337',
        '--theme-accent-disabled': '#ffe4e6',
    },
    midnight: {
        '--theme-bg': '#0f172a',
        '--theme-text': '#f8fafc',
        '--theme-primary': '#8b5cf6',
        '--theme-primary-hover': '#a78bfa',
        '--theme-primary-active': '#7c3aed',
        '--theme-primary-focus': '#6d28d9',
        '--theme-primary-disabled': '#ede9fe',
        '--theme-accent': '#f59e0b',
        '--theme-accent-hover': '#fbbf24',
        '--theme-accent-active': '#d97706',
        '--theme-accent-disabled': '#fef3c7',
    },
};

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            const data = await getSettings();
            if (data) {
                setSettings(data);
                // The website always uses its fixed default brand colors.
                // The admin "Logo & Branding" theme switch is intentionally NOT
                // applied here — it only themes the admin panel, never the public site.
                const themeVars = THEMES.default;

                Object.entries(themeVars).forEach(([key, value]) => {
                    document.documentElement.style.setProperty(key, value);
                });
            }
            setLoading(false);
        };
        fetchSettings();
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, loading }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
