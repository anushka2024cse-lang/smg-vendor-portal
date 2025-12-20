import apiClient from './apiClient';
import { ENDPOINTS } from './endpoints';
import { mockMaterialReceipts, mockMaterialDispatches } from '../mocks/materialData';

import { USE_MOCK } from './config';

export const materialService = {
    // Receiving
    getReceiveHistory: async () => {
        if (USE_MOCK) return Promise.resolve(mockMaterialReceipts);
        const response = await apiClient.get(ENDPOINTS.MATERIALS.HISTORY_RECEIVE);
        return response.data;
    },

    createReceipt: async (receiptData) => {
        if (USE_MOCK) {
            console.log("Mock Create Receipt:", receiptData);
            return Promise.resolve({ ...receiptData, id: Math.random() });
        }
        const response = await apiClient.post(ENDPOINTS.MATERIALS.RECEIVE, receiptData);
        return response.data;
    },

    // Dispatching
    getDispatchHistory: async () => {
        if (USE_MOCK) return Promise.resolve(mockMaterialDispatches);
        const response = await apiClient.get(ENDPOINTS.MATERIALS.HISTORY_DISPATCH);
        return response.data;
    },

    createDispatch: async (dispatchData) => {
        if (USE_MOCK) {
            console.log("Mock Create Dispatch:", dispatchData);
            return Promise.resolve({ ...dispatchData, id: Math.random() });
        }
        const response = await apiClient.post(ENDPOINTS.MATERIALS.DISPATCH, dispatchData);
        return response.data;
    }
};
