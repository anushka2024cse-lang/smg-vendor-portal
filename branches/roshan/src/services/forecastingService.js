import apiClient from './apiClient';
import { ENDPOINTS } from './endpoints';
import { mockForecastResult } from '../mocks/forecastingData';

const USE_MOCK = true;

export const forecastingService = {
    generateForecast: async (params) => {
        if (USE_MOCK) {
            console.log("Mock Generate Forecast:", params);
            // Return mock result with slight delay to simulate processing
            return new Promise(resolve => setTimeout(() => resolve(mockForecastResult), 1000));
        }
        const response = await apiClient.post(ENDPOINTS.FORECASTING.GENERATE, params);
        return response.data;
    }
};
