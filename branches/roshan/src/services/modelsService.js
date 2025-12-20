import apiClient from './apiClient';
import { ENDPOINTS } from './endpoints';
import { mockModelsData } from '../mocks/modelsData';

import { USE_MOCK } from './config';

export const modelsService = {
    getAllModels: async () => {
        if (USE_MOCK) return Promise.resolve(mockModelsData);
        const response = await apiClient.get(ENDPOINTS.MODELS.LIST);
        return response.data;
    }
};
