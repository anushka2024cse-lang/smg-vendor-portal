import apiClient from './apiClient';
import { ENDPOINTS } from './endpoints';

export const authService = {
    login: async (email, password) => {
        try {
            const response = await apiClient.post(ENDPOINTS.AUTH.LOGIN, { email, password });
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user || {}));
                localStorage.setItem('role', response.data.user?.role || 'User'); // Fallback
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    register: async (userData) => {
        const response = await apiClient.post(ENDPOINTS.AUTH.REGISTER, userData); // Needs endpoint update if not present
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        // window.location.href = '/login'; // Handled by component usually
    },

    getCurrentUser: () => {
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr || userStr === 'undefined') return null;
            return JSON.parse(userStr);
        } catch (e) {
            console.error("Error parsing user data", e);
            return null; // Fallback to avoid crash
        }
    },

    updateProfile: async (userData) => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));

        try {
            const currentUser = authService.getCurrentUser() || {};
            const updatedUser = { ...currentUser, ...userData };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return updatedUser;
        } catch (e) {
            throw new Error("Failed to update profile locally");
        }
    },

    getToken: () => {
        return localStorage.getItem('token');
    }
};
