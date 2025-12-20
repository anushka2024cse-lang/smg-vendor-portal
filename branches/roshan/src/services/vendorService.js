import apiClient from './apiClient';
import { ENDPOINTS } from './endpoints';
import { mockVendors, mockVendorHistory } from '../mocks/vendorData';

const USE_MOCK = true;

export const vendorService = {
    getAllVendors: async () => {
        if (USE_MOCK) return Promise.resolve(mockVendors);
        const response = await apiClient.get(ENDPOINTS.VENDORS.LIST);
        return response.data;
    },

    createVendor: async (vendorData) => {
        if (USE_MOCK) {
            console.log("Mock Create Vendor:", vendorData);
            return Promise.resolve({ ...vendorData, id: Math.random() });
        }
        const response = await apiClient.post(ENDPOINTS.VENDORS.CREATE, vendorData);
        return response.data;
    },

    getVendorHistory: async (vendorId) => {
        if (USE_MOCK) return Promise.resolve(mockVendorHistory);
        const response = await apiClient.get(ENDPOINTS.VENDORS.TRANSACTIONS(vendorId));
        return response.data;
    }
};
