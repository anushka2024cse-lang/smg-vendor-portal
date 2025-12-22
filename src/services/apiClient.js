import axios from 'axios';

// Create an Axios instance
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1', // Default to local backend
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 60000, // 60 seconds to handle Render cold starts
});

// Request interceptor for Auth Token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for generic error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle specific status codes (e.g., 401 Unauthorized)
        if (error.response && error.response.status === 401) {
            // Logic to redirect to login or refresh token
            console.warn('Unauthorized access. Redirecting to login...');
            // window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);

export default apiClient;
