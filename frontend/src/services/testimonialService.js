import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

const API_URL = `${API_BASE_URL}/api/testimonials`;

export const getTestimonials = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const submitTestimonial = async (data) => {
    const response = await axios.post(API_URL, data);
    return response.data;
};
