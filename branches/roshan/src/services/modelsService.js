import apiClient from './apiClient';
import { ENDPOINTS } from './endpoints';
import { mockModelsData } from '../mocks/modelsData';

const USE_MOCK = true;

export const modelsService = {
    getAllModels: async () => {
        if (USE_MOCK) return Promise.resolve(mockModelsData);
        const response = await apiClient.get(ENDPOINTS.MODELS.LIST);
        return response.data;
    }
};
