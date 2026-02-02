import axios from 'axios';

import { API_BASE_URL } from './apiConfig';

const API_URL = `${API_BASE_URL}/api/rentals`;

const getToken = () => {
    if (typeof window !== 'undefined') {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const parsed = JSON.parse(userInfo);
            return parsed.token;
        }
    }
    return null;
};

export const getMyOrders = async () => {
    const token = getToken();
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(`${API_URL}/myrentals`, config);
    return response.data;
};
