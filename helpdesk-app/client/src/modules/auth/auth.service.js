import api from '../../services/api';

const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.data && response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
    }
    return response.data;
};

const login = async (userData) => {
    const response = await api.post('/auth/login', userData);
    if (response.data.data && response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
    }
    return response.data; // Return full response to handle 2FA flag
};

const loginVerify2FA = async (userData) => {
    const response = await api.post('/auth/login-verify-2fa', userData);
    if (response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
    }
    return response.data;
};

const verifyEmail = async (data) => {
    const response = await api.post('/auth/verify-email', data);
    if (response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
    }
    return response.data;
};

const forgotPassword = async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
};

const resetPassword = async (data) => {
    const response = await api.post('/auth/reset-password', data);
    if (response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
    }
    return response.data;
};

const changePassword = async (passwords) => {
    const response = await api.put('/auth/change-password', passwords);
    return response.data;
};

const enable2FA = async () => {
    const response = await api.post('/auth/enable-2fa');
    return response.data;
};

const verify2FA = async (otp) => {
    const response = await api.post('/auth/verify-2fa', { otp });
    return response.data;
};

const logout = () => {
    localStorage.removeItem('token');
};

const getMe = async () => {
    const response = await api.get('/auth/me');
    return response.data.data;
}

const authService = {
    register,
    login,
    loginVerify2FA,
    forgotPassword,
    resetPassword,
    changePassword,
    enable2FA,
    verify2FA,
    logout,
    getMe,
    verifyEmail,
};

export default authService;
