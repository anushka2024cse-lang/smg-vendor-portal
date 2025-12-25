import { apiClient } from './config';

export const hsrpService = {
    getStats: async () => {
        try {
            const response = await apiClient.get('/hsrp/stats');
            return response.data;
        } catch (error) {
            console.error('Error fetching HSRP stats:', error);
            return { total: 0, pending: 0, dispatched: 0 };
        }
    },

    getAllRequests: async (params = {}) => {
        try {
            const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = params;
            const queryString = new URLSearchParams({ page, limit, sortBy, sortOrder }).toString();
            const response = await apiClient.get(`/hsrp?${queryString}`);

            if (response.data.data) {
                return {
                    data: response.data.data.map(req => ({
                        _id: req._id,
                        id: req.requestId,
                        vendor: req.vendorName || 'Unknown',
                        model: req.vehicleModel,
                        regNumber: req.regNumber,
                        chassis: req.chassisNumber,
                        engine: req.engineNumber,
                        date: new Date(req.createdAt).toISOString().split('T')[0],
                        status: req.status
                    })),
                    pagination: response.data.pagination
                };
            }

            return { data: response.data, pagination: {} };
        } catch (error) {
            console.error('Error fetching HSRP requests:', error);
            throw error;
        }
    },

    createRequest: async (data) => {
        try {
            const response = await apiClient.post('/hsrp', data);
            return response.data;
        } catch (error) {
            console.error('Error creating HSRP request:', error);
            throw error;
        }
    },

    updateRequest: async (id, data) => {
        try {
            const response = await apiClient.patch(`/hsrp/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating HSRP request:', error);
            throw error;
        }
    },

    deleteRequest: async (id) => {
        try {
            const response = await apiClient.delete(`/hsrp/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting HSRP request:', error);
            throw error;
        }
    }
};
