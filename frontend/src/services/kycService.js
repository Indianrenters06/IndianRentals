import axios from 'axios';

import { API_BASE_URL } from './apiConfig';

const API_URL = `${API_BASE_URL}/api/kyc`;

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

export const saveKYCData = async (data) => {
    const token = getToken();
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.post(API_URL, data, config);
    return response.data;
};

export const uploadKYCFiles = async (formData) => {
    const token = getToken();
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.post(`${API_URL}/upload`, formData, config);
    return response.data;
};

export const getKYCStatus = async () => {
    const token = getToken();
    if (!token) {
        return { status: 'Not Submitted' };
    }

    const config = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    try {
        const response = await axios.get(API_URL, config);
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // If token is invalid or expired, treat as not submitted
            return { status: 'Not Submitted' };
        }
        console.error("KYC status fetch error:", error);
        return { status: 'Not Submitted' };
    }
};

// Admin: Get all KYC requests
export const getAllKYC = async () => {
    const token = getToken();
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
    const response = await axios.get(`${API_URL}/admin/all`, config);
    return response.data;
};

// Admin: Update KYC status
export const updateKYCStatus = async (id, statusData) => {
    const token = getToken();
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };
    const response = await axios.put(`${API_URL}/admin/${id}`, statusData, config);
    return response.data;
};
