import apiClient from './apiClient';
import { ENDPOINTS } from './endpoints';
import { mockUsers, mockCurrentUser } from '../mocks/adminData';

const USE_MOCK = true;

export const adminService = {
    getAllUsers: async () => {
        if (USE_MOCK) return Promise.resolve(mockUsers);
        const response = await apiClient.get(ENDPOINTS.ADMIN.USERS);
        return response.data;
    },

    getCurrentUser: async () => {
        if (USE_MOCK) return Promise.resolve(mockCurrentUser);
        const response = await apiClient.get(ENDPOINTS.AUTH.ME);
        return response.data;
    },

    createUser: async (userData) => {
        if (USE_MOCK) {
            console.log("Mock Create User:", userData);
            const newUser = { ...userData, id: Math.random() };
            mockUsers.push(newUser);
            return Promise.resolve(newUser);
        }
        const response = await apiClient.post(ENDPOINTS.ADMIN.CREATE_USER, userData);
        return response.data;
    }
};
