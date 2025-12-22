import apiClient from './apiClient';
import { ENDPOINTS } from './endpoints';

export const authService = {
    login: async (email, password) => {
        try {
            const response = await apiClient.post(ENDPOINTS.AUTH.LOGIN, { email, password });
            console.log('📥 Login response:', response.data);

            // Backend returns flat structure: { _id, name, email, role, token }
            const { token, _id, name, email: userEmail, role } = response.data;

            if (token) {
                // Store token
                localStorage.setItem('token', token);
                localStorage.setItem('authToken', token);

                // Build user object from flat response
                const userData = {
                    _id,
                    name,
                    email: userEmail,
                    role
                };

                localStorage.setItem('user', JSON.stringify(userData));
                localStorage.setItem('role', role);
                console.log('✅ User data stored:', userData);
            }

            return response.data;
        } catch (error) {
            console.error('❌ Login error:', error.response?.data || error.message);
            throw error;
        }
    },

    register: async (userData) => {
        const response = await apiClient.post(ENDPOINTS.AUTH.REGISTER, userData);
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
    },

    getCurrentUser: () => {
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr || userStr === 'undefined') return null;
            return JSON.parse(userStr);
        } catch (e) {
            console.error("Error parsing user data", e);
            return null;
        }
    },

    updateProfile: async (userData) => {
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
        return localStorage.getItem('token') || localStorage.getItem('authToken');
    }
};
