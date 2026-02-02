import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/kyc`;

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
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL, config);
    return response.data;
};
