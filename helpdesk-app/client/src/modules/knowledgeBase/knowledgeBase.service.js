import api from '../../services/api';

const API_URL = '/knowledge-base';

// Categories
const getCategories = async () => {
    const response = await api.get(`${API_URL}/categories`);
    return response.data.data;
};

const createCategory = async (categoryData) => {
    const response = await api.post(`${API_URL}/categories`, categoryData);
    return response.data.data;
};

const updateCategory = async (id, categoryData) => {
    const response = await api.put(`${API_URL}/categories/${id}`, categoryData);
    return response.data.data;
};

const deleteCategory = async (id) => {
    const response = await api.delete(`${API_URL}/categories/${id}`);
    return response.data.data;
};

// Articles
const getArticles = async (params) => {
    const response = await api.get(`${API_URL}/articles`, { params });
    return response.data.data;
};

const getArticle = async (id) => {
    const response = await api.get(`${API_URL}/articles/${id}`);
    return response.data.data;
};

const createArticle = async (articleData) => {
    const response = await api.post(`${API_URL}/articles`, articleData);
    return response.data.data;
};

const updateArticle = async (id, articleData) => {
    const response = await api.put(`${API_URL}/articles/${id}`, articleData);
    return response.data.data;
};

const deleteArticle = async (id) => {
    const response = await api.delete(`${API_URL}/articles/${id}`);
    return response.data.data;
};

const knowledgeBaseService = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getArticles,
    getArticle,
    createArticle,
    updateArticle,
    deleteArticle
};

export default knowledgeBaseService;
