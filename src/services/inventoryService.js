import apiClient from './apiClient';
import { ENDPOINTS } from './endpoints';

export const inventoryService = {
    getAllInventory: async () => {
        // ALWAYS Call API
        const response = await apiClient.get(ENDPOINTS.INVENTORY.LIST);
        return response.data;
    }
};
