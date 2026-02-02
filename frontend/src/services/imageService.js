import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/upload`;

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

export const uploadImage = async (file) => {
    const token = getToken();

    if (!token) {
        throw new Error('Not authorized, no token');
    }

    const formData = new FormData();
    formData.append('image', file);

    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
        }
    };

    try {
        const { data } = await axios.post(API_URL, formData, config);
        return data.image; // Returns the secure_url from Cloudinary
    } catch (error) {
        throw new Error(error.response && error.response.data.message
            ? error.response.data.message
            : error.message);
    }
};
