import apiClient from './apiClient';
import { ENDPOINTS } from './endpoints';
import { mockProductionHistory } from '../mocks/productionData';

const USE_MOCK = true;

export const productionService = {
    getHistory: async () => {
        if (USE_MOCK) return Promise.resolve(mockProductionHistory);
        const response = await apiClient.get(ENDPOINTS.PRODUCTION.HISTORY);
        return response.data;
    },

    generateData: async (data) => {
        if (USE_MOCK) {
            console.log("Mock Generate Production Data:", data);
            return Promise.resolve({ success: true, message: "Production data generated" });
        }
        const response = await apiClient.post(ENDPOINTS.PRODUCTION.GENERATE, data);
        return response.data;
    }
};
