import apiClient from './apiClient';
import { ENDPOINTS } from './endpoints';
import { mockInventoryData } from '../mocks/inventoryData';

const USE_MOCK = true;

export const inventoryService = {
    getAllInventory: async () => {
        if (USE_MOCK) return Promise.resolve(mockInventoryData);
        const response = await apiClient.get(ENDPOINTS.INVENTORY.LIST);
        return response.data;
    }
};
