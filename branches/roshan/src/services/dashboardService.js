import apiClient from './apiClient';
import { ENDPOINTS } from './endpoints';
import { mockDashboardMetrics, mockInventoryChartData, mockStockDistributionData, mockLowStockItems } from '../mocks/dashboardData';

// Toggle to use mock data easily (Set to false when backend is ready)
import { USE_MOCK } from './config';

export const dashboardService = {
    getMetrics: async () => {
        if (USE_MOCK) return Promise.resolve(mockDashboardMetrics);
        const response = await apiClient.get(ENDPOINTS.DASHBOARD.METRICS);
        return response.data;
    },

    getInventoryChartData: async () => {
        if (USE_MOCK) return Promise.resolve(mockInventoryChartData);
        const response = await apiClient.get(ENDPOINTS.DASHBOARD.INVENTORY_CHART);
        return response.data;
    },

    getStockDistribution: async () => {
        if (USE_MOCK) return Promise.resolve(mockStockDistributionData);
        const response = await apiClient.get(ENDPOINTS.DASHBOARD.STOCK_CHART);
        return response.data;
    },

    getLowStockItems: async () => {
        if (USE_MOCK) return Promise.resolve(mockLowStockItems);
        // Assuming this might be part of metrics or a separate endpoint
        return response.data;
    }
};
