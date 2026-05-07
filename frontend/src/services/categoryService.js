import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

const API_URL = `${API_BASE_URL}/api/categories`;

// Fetch all top-level categories (each includes subcategories array)
// GET /api/categories — returns [{...parent, subcategories: [...]}]
export const getCategories = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

// Fetch the full category tree (all parents + children)
// Tries /tree first, falls back to base / endpoint which also embeds subcategories
export const getCategoryTree = async () => {
    try {
        const response = await axios.get(`${API_URL}/tree`);
        return response.data;
    } catch {
        // Fallback: base endpoint already returns subcategories embedded
        const response = await axios.get(API_URL);
        return response.data;
    }
};

// Fetch subcategories for a specific parent category ID
export const getSubcategoriesByParentId = async (parentId) => {
    const response = await axios.get(`${API_URL}/${parentId}/subcategories`);
    return response.data;
};

// Fetch subcategories by parent category name
// Uses the base /api/categories endpoint (already embeds subcategories per our controller)
// so this works on any environment without needing /tree
export const getSubcategoriesByParentName = async (parentName) => {
    const categories = await getCategories();
    const parent = categories.find(
        (c) => c.name.toLowerCase().includes(parentName.toLowerCase()) || 
               parentName.toLowerCase().includes(c.name.toLowerCase())
    );
    return parent ? (parent.subcategories || []) : [];
};
