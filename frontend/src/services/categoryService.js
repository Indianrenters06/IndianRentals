import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/categories`;

export const getCategories = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};
