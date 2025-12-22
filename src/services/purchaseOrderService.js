import apiClient from './apiClient';

const BASE_URL = '/purchase-orders';

export const purchaseOrderService = {
    // Get all POs
    getAllPurchaseOrders: async () => {
        const response = await apiClient.get(BASE_URL);
        return response.data;
    },

    // Get PO by ID
    getPurchaseOrderById: async (id) => {
        const response = await apiClient.get(`${BASE_URL}/${id}`);
        return response.data;
    },

    // Create new PO
    createPurchaseOrder: async (poData) => {
        const response = await apiClient.post(BASE_URL, poData);
        return response.data;
    },

    // Update PO
    updatePurchaseOrder: async (id, poData) => {
        const response = await apiClient.put(`${BASE_URL}/${id}`, poData);
        return response.data;
    },

    // Delete PO
    deletePurchaseOrder: async (id) => {
        const response = await apiClient.delete(`${BASE_URL}/${id}`);
        return response.data;
    }
};
