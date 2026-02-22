import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

const API_URL = `${API_BASE_URL}/api/products`;

// Fetch all products with optional filters
export const getProducts = async (params = {}) => {
    const response = await axios.get(API_URL, { params });
    return response.data;
};

// Fetch a single product by ID
export const getProductById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

// Fetch products filtered by top-level category name
export const getProductsByCategory = async (categoryName, params = {}) => {
    const response = await axios.get(API_URL, {
        params: { category: categoryName, ...params }
    });
    return response.data;
};

// Fetch products filtered by subcategory ObjectId
export const getProductsBySubcategory = async (subcategoryId, params = {}) => {
    const response = await axios.get(API_URL, {
        params: { subcategory: subcategoryId, ...params }
    });
    return response.data;
};
