import apiClient from './apiClient';

const NOTIFICATION_ENDPOINT = '/notifications';

const notificationService = {
    // Get all notifications with optional filters
    getAll: async (params = {}) => {
        try {
            const response = await apiClient.get(NOTIFICATION_ENDPOINT, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching notifications:', error);
            throw error;
        }
    },

    // Get unread notifications count
    getUnreadCount: async () => {
        try {
            const response = await apiClient.get(NOTIFICATION_ENDPOINT, {
                params: { unreadOnly: true, limit: 1 }
            });
            return response.data.unreadCount || 0;
        } catch (error) {
            console.error('Error fetching unread count:', error);
            return 0;
        }
    },

    // Create new notification
    create: async (notificationData) => {
        try {
            const response = await apiClient.post(NOTIFICATION_ENDPOINT, notificationData);
            return response.data;
        } catch (error) {
            console.error('Error creating notification:', error);
            throw error;
        }
    },

    // Mark single notification as read
    markAsRead: async (id) => {
        try {
            const response = await apiClient.put(`${NOTIFICATION_ENDPOINT}/${id}/read`);
            return response.data;
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw error;
        }
    },

    // Mark all notifications as read
    markAllAsRead: async () => {
        try {
            const response = await apiClient.put(`${NOTIFICATION_ENDPOINT}/read-all`);
            return response.data;
        } catch (error) {
            console.error('Error marking all as read:', error);
            throw error;
        }
    },

    // Delete single notification
    delete: async (id) => {
        try {
            const response = await apiClient.delete(`${NOTIFICATION_ENDPOINT}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting notification:', error);
            throw error;
        }
    },

    // Clear all read notifications
    clearRead: async () => {
        try {
            const response = await apiClient.delete(`${NOTIFICATION_ENDPOINT}/clear-read`);
            return response.data;
        } catch (error) {
            console.error('Error clearing read notifications:', error);
            throw error;
        }
    }
};

export default notificationService;
