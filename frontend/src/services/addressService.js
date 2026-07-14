import axios from 'axios';

import { API_BASE_URL } from './apiConfig';

const API_URL = `${API_BASE_URL}/api/users/addresses`;

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

const authConfig = () => ({
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
    }
});

// Backend stores addresses with a Mongo `_id`; the UI works with `id`.
const normalize = (addr) => ({ ...addr, id: addr._id });
const normalizeList = (list) => (Array.isArray(list) ? list.map(normalize) : []);

export const getAddresses = async () => {
    if (!getToken()) return [];
    try {
        const response = await axios.get(API_URL, authConfig());
        return normalizeList(response.data);
    } catch (err) {
        // A 401 means the stored session token is missing/expired — treat as no
        // saved addresses instead of surfacing an error on the checkout page.
        if (err?.response?.status === 401) return [];
        throw err;
    }
};

export const addAddress = async (data) => {
    const response = await axios.post(API_URL, data, authConfig());
    return normalizeList(response.data);
};

export const updateAddress = async (id, data) => {
    const response = await axios.put(`${API_URL}/${id}`, data, authConfig());
    return normalizeList(response.data);
};

export const deleteAddress = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, authConfig());
    return normalizeList(response.data);
};
