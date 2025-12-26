import { apiClient } from './config';

export const diePlanService = {
    getStats: async () => {
        try {
            const response = await apiClient.get('/v1/die-plans/stats');
            return response.data;
        } catch (error) {
            console.error('Error fetching Die Plan stats:', error);
            return { total: 0, inDevelopment: 0, completed: 0, delayed: 0 };
        }
    },

    getAllPlans: async (params = {}) => {
        try {
            const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = params;
            const queryString = new URLSearchParams({ page, limit, sortBy, sortOrder }).toString();
            const response = await apiClient.get(`/v1/die-plans?${queryString}`);

            if (response.data.data) {
                return {
                    data: response.data.data.map(plan => ({
                        _id: plan._id,
                        id: plan.planId,
                        partName: plan.partName,
                        vendor: plan.vendorName || 'Unknown',
                        stage: plan.stage,
                        progress: plan.progress,
                        startDate: plan.startDate ? new Date(plan.startDate).toISOString().split('T')[0] : 'N/A',
                        targetDate: plan.targetDate ? new Date(plan.targetDate).toISOString().split('T')[0] : 'N/A',
                        status: plan.status
                    })),
                    pagination: response.data.pagination
                };
            }

            return { data: response.data, pagination: {} };
        } catch (error) {
            console.error('Error fetching Die Plans:', error);
            throw error;
        }
    },

    createPlan: async (data) => {
        try {
            const response = await apiClient.post('/v1/die-plans', data);
            return response.data;
        } catch (error) {
            console.error('Error creating die plan:', error);
            throw error;
        }
    },

    updatePlan: async (id, data) => {
        try {
            const response = await apiClient.patch(`/v1/die-plans/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating die plan:', error);
            throw error;
        }
    },

    deletePlan: async (id) => {
        try {
            const response = await apiClient.delete(`/v1/die-plans/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting die plan:', error);
            throw error;
        }
    },

    updateProgress: async (id, stage, progress) => {
        // Implementation for future
        return Promise.resolve(true);
    }
};
