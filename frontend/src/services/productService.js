import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/products`;

export const getProducts = async (params = {}) => {
    const response = await axios.get(API_URL, { params });
    return response.data;
};

export const getProductById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};
