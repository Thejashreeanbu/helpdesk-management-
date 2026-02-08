import api from '../../services/api';

const API_URL = '/notifications';

const getNotifications = async () => {
    const response = await api.get(API_URL);
    return response.data.data;
};

const markAsRead = async (id) => {
    const response = await api.put(`${API_URL}/${id}/read`);
    return response.data;
};

const notificationService = {
    getNotifications,
    markAsRead,
};

export default notificationService;
