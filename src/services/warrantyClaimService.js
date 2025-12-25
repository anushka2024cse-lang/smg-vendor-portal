import { apiClient } from './config';

const warrantyClaimService = {
    // Get all warranty claims
    getAllClaims: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.page) params.append('page', filters.page);
        if (filters.limit) params.append('limit', filters.limit);

        return apiClient.get(`/v1/warranty?${params.toString()}`);
    },

    // Get single claim by ID
    getClaim: async (id) => {
        return apiClient.get(`/v1/warranty/${id}`);
    },

    // Create new warranty claim
    createClaim: async (claimData) => {
        return apiClient.post('/v1/warranty', claimData);
    },

    // Update warranty claim
    updateClaim: async (id, claimData) => {
        return apiClient.patch(`/v1/warranty/${id}`, claimData);
    },

    // Delete warranty claim
    deleteClaim: async (id) => {
        return apiClient.delete(`/v1/warranty/${id}`);
    },

    // Delete warranty claim
    deleteClaim: async (id) => {
        return apiClient.delete(`/v1/warranty/${id}`);
    },

    // Approve claim (admin)
    approveClaim: async (id) => {
        return apiClient.put(`/v1/warranty/${id}/approve`);
    },

    // Reject claim (admin)
    rejectClaim: async (id, reason) => {
        return apiClient.put(`/v1/warranty/${id}/reject`, { reason });
    },

    // Save as draft
    saveDraft: async (draftData) => {
        return apiClient.post('/v1/warranty/draft', draftData);
    },

    // Get all drafts
    getDrafts: async () => {
        return apiClient.get('/v1/warranty/drafts');
    },

    // Publish draft as claim
    publishDraft: async (id) => {
        return apiClient.put(`/v1/warranty/${id}/publish`);
    }
};

export default warrantyClaimService;
