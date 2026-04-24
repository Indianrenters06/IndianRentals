import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

const API_URL = `${API_BASE_URL}/api/settings`;

// Fetch site settings
export const getSettings = async () => {
    try {
        const ts = Date.now();
        const response = await fetch(`${API_URL}?t=${ts}`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.warn('[settings] Backend unreachable, using defaults:', error?.message);
        return null;
    }
};
