import axios from 'axios';

import { API_BASE_URL } from './apiConfig';

const API_URL = `${API_BASE_URL}/api/categories`;

export const getCategories = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};
