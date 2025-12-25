import { apiClient } from './config';

export const sparePartService = {
    getStats: async () => {
        try {
            const response = await apiClient.get('/spare-parts/stats');
            return response.data;
        } catch (error) {
            console.error('Error fetching spare part stats:', error);
            return { total: 0, pending: 0, approved: 0, rejected: 0 };
        }
    },

    getAllRequests: async (params = {}) => {
        try {
            const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = params;
            const queryString = new URLSearchParams({ page, limit, sortBy, sortOrder }).toString();
            const response = await apiClient.get(`/spare-parts?${queryString}`);

            // Handle paginated response
            if (response.data.data) {
                return {
                    data: response.data.data.map(req => ({
                        _id: req._id,
                        id: req.requestId,
                        vendor: req.vendorName || 'Unknown',
                        component: req.component,
                        quantity: req.quantity,
                        date: new Date(req.createdAt).toISOString().split('T')[0],
                        priority: req.priority,
                        status: req.status
                    })),
                    pagination: response.data.pagination
                };
            }

            // Fallback for non-paginated (shouldn't happen but safe)
            return { data: response.data, pagination: {} };
        } catch (error) {
            console.error('Error fetching spare part requests:', error);
            throw error;
        }
    },

    createRequest: async (data) => {
        try {
            const response = await apiClient.post('/spare-parts', data);
            return response.data;
        } catch (error) {
            console.error('Error creating spare part request:', error);
            throw error;
        }
    },

    updateRequest: async (id, data) => {
        try {
            const response = await apiClient.patch(`/spare-parts/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating spare part request:', error);
            throw error;
        }
    },

    deleteRequest: async (id) => {
        try {
            const response = await apiClient.delete(`/spare-parts/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting spare part request:', error);
            throw error;
        }
    }
};
