import apiClient from './apiClient';

const ENDPOINT = '/tickets';

export const ticketService = {
    getAll: async () => {
        const response = await apiClient.get(ENDPOINT);
        return response.data;
    },

    create: async (data) => {
        const response = await apiClient.post(ENDPOINT, data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await apiClient.put(`${ENDPOINT}/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await apiClient.delete(`${ENDPOINT}/${id}`);
        return response.data;
    }
};

export default ticketService;
