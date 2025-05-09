import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export const fetchBooks = async (page = 1, limit = 10, filters = {}) => {
    try {
        const params = { page, limit, ...filters };
        // Remove undefined or null filter values
        Object.keys(params).forEach(key => (params[key] === undefined || params[key] === null || params[key] === '') && delete params[key]);

        const response = await axios.get(`${API_BASE_URL}/books`, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching books:", error);
        throw error;
    }
};

export const fetchBookById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/books/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching book with id ${id}:`, error);
        throw error;
    }
};

export const fetchGenres = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/genres`);
        return response.data;
    } catch (error) {
        console.error("Error fetching genres:", error);
        throw error;
    }
};