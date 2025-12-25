import { apiClient } from './config';

export const rsaService = {
    getStats: async () => {
        try {
            const response = await apiClient.get('/rsa/stats');
            return response.data;
        } catch (error) {
            console.error('Error fetching RSA stats:', error);
            return { total: 0, active: 0, resolved: 0 };
        }
    },

    getAllRequests: async (params = {}) => {
        try {
            const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = params;
            const queryString = new URLSearchParams({ page, limit, sortBy, sortOrder }).toString();
            const response = await apiClient.get(`/rsa?${queryString}`);

            if (response.data.data) {
                return {
                    data: response.data.data.map(req => ({
                        _id: req._id,
                        id: req.requestId,
                        vendor: req.vendorName || 'Unknown',
                        vehicle: req.vehicleNumber,
                        contact: req.driverContact,
                        location: req.location,
                        issue: req.issueType,
                        date: new Date(req.createdAt).toISOString().split('T')[0],
                        status: req.status
                    })),
                    pagination: response.data.pagination
                };
            }

            return { data: response.data, pagination: {} };
        } catch (error) {
            console.error('Error fetching RSA requests:', error);
            throw error;
        }
    },

    createRequest: async (data) => {
        try {
            const response = await apiClient.post('/rsa', data);
            return response.data;
        } catch (error) {
            console.error('Error creating RSA request:', error);
            throw error;
        }
    },

    updateRequest: async (id, data) => {
        try {
            const response = await apiClient.patch(`/rsa/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating RSA request:', error);
            throw error;
        }
    },

    deleteRequest: async (id) => {
        try {
            const response = await apiClient.delete(`/rsa/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting RSA request:', error);
            throw error;
        }
    }
};
