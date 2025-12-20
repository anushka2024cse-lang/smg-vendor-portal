// Master switch for using mock data
// This reads from the environment variable VITE_USE_MOCK
// If the variable is 'true', mock data is enabled.
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
