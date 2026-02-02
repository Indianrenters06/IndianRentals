import axios from 'axios';

import { API_BASE_URL } from './apiConfig';

const API_URL = `${API_BASE_URL}/api/products`;

export const getProducts = async (params = {}) => {
    const response = await axios.get(API_URL, { params });
    return response.data;
};

export const getProductById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};
