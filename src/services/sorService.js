import apiClient from './apiClient';

const SOR_ENDPOINT = '/sor';

const sorService = {
    // Get all SORs with optional filters and pagination
    getAll: async (params = {}) => {
        try {
            const response = await apiClient.get(SOR_ENDPOINT, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching SORs:', error);
            throw error;
        }
    },

    // Get single SOR by ID
    getById: async (id) => {
        try {
            const response = await apiClient.get(`${SOR_ENDPOINT}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching SOR:', error);
            throw error;
        }
    },

    // Create new SOR
    create: async (sorData) => {
        try {
            const response = await apiClient.post(SOR_ENDPOINT, sorData);
            return response.data;
        } catch (error) {
            console.error('Error creating SOR:', error);
            throw error;
        }
    },

    // Update existing SOR
    update: async (id, sorData) => {
        try {
            const response = await apiClient.put(`${SOR_ENDPOINT}/${id}`, sorData);
            return response.data;
        } catch (error) {
            console.error('Error updating SOR:', error);
            throw error;
        }
    },

    // Delete SOR (soft delete)
    delete: async (id) => {
        try {
            const response = await apiClient.delete(`${SOR_ENDPOINT}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting SOR:', error);
            throw error;
        }
    },

    // Submit SOR for review
    submit: async (id) => {
        try {
            const response = await apiClient.post(`${SOR_ENDPOINT}/${id}/submit`);
            return response.data;
        } catch (error) {
            console.error('Error submitting SOR:', error);
            throw error;
        }
    },

    // Approve SOR (admin only)
    approve: async (id) => {
        try {
            const response = await apiClient.post(`${SOR_ENDPOINT}/${id}/approve`);
            return response.data;
        } catch (error) {
            console.error('Error approving SOR:', error);
            throw error;
        }
    },

    // Get SOR history
    getHistory: async (id) => {
        try {
            const response = await apiClient.get(`${SOR_ENDPOINT}/${id}/history`);
            return response.data;
        } catch (error) {
            console.error('Error fetching SOR history:', error);
            throw error;
        }
    }
};

export default sorService;
