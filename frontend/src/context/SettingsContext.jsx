'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSettings } from '../services/settingsService';

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            const data = await getSettings();
            if (data) {
                setSettings(data);
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
