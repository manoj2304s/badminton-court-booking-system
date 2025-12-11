import api from './api';

const authService = {
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            if (response.data.user !== undefined && response.data.user !== null) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            } else {
                localStorage.removeItem('user');
            }
        }
        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            if (response.data.user !== undefined && response.data.user !== null) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            } else {
                localStorage.removeItem('user');
            }
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;
        // Guard against non-JSON values like the string "undefined" or malformed JSON
        try {
            return JSON.parse(userStr);
        } catch (err) {
            // Corrupt value in localStorage — remove it to avoid repeated errors
            localStorage.removeItem('user');
            return null;
        }
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    isAdmin: () => {
        const user = authService.getCurrentUser();
        return user?.role === 'admin';
    },
};

export default authService;