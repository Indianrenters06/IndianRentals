import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

const API_URL = `${API_BASE_URL}/api/settings`;

// Fetch site settings
export const getSettings = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching settings:', error);
        return null;
    }
};
