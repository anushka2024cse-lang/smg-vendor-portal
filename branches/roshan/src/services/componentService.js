import apiClient from './apiClient';
import { ENDPOINTS } from './endpoints';
import { mockComponentsData } from '../mocks/componentData';

const USE_MOCK = true;

export const componentService = {
    getAllComponents: async () => {
        if (USE_MOCK) return Promise.resolve(mockComponentsData);
        const response = await apiClient.get(ENDPOINTS.COMPONENTS.LIST);
        return response.data;
    }
};
