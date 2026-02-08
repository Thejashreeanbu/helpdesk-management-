import api from '../../services/api';

const API_URL = '/users';

// Get all users (Admin only)
const getUsers = async () => {
    const response = await api.get(API_URL);
    return response.data.data;
};

// Create user (Admin only)
const createUser = async (userData) => {
    const response = await api.post(API_URL, userData);
    return response.data.data;
};

// Update user (role, department)
const updateUser = async (id, userData) => {
    const response = await api.put(`${API_URL}/${id}`, userData);
    return response.data.data;
};

// Delete user
const deleteUser = async (id) => {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
};

const usersService = {
    getUsers,
    createUser,
    updateUser,
    deleteUser
};

export default usersService;
