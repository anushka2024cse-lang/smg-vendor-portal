import apiClient from './apiClient';

export const orderService = {
    /**
     * Get all orders with optional filters
     * @param {Object} filters - Filter options (status, vendor, paymentStatus, startDate, endDate, search)
     * @returns {Promise<Object>} - Orders data
     */
    getOrders: async (filters = {}) => {
        try {
            const params = new URLSearchParams();
            Object.keys(filters).forEach(key => {
                if (filters[key]) params.append(key, filters[key]);
            });

            const response = await apiClient.get(`/orders?${params.toString()}`);
            return response.data;
        } catch (error) {
            console.error('❌ Error fetching orders:', error);
            throw error;
        }
    },

    /**
     * Get single order by ID
     * @param {string} id - Order ID
     * @returns {Promise<Object>} - Order data
     */
    getOrderById: async (id) => {
        try {
            const response = await apiClient.get(`/orders/${id}`);
            return response.data;
        } catch (error) {
            console.error(`❌ Error fetching order ${id}:`, error);
            throw error;
        }
    },

    /**
     * Create a new order
     * @param {Object} orderData - Order details
     * @returns {Promise<Object>} - Created order
     */
    createOrder: async (orderData) => {
        try {
            const response = await apiClient.post('/orders', orderData);
            console.log('✅ Order created:', response.data.order.orderNumber);
            return response.data;
        } catch (error) {
            console.error('❌ Error creating order:', error);
            throw error;
        }
    },

    /**
     * Update order status
     * @param {string} id - Order ID
     * @param {string} status - New status
     * @param {Object} additionalData - Optional tracking number, delivery date
     * @returns {Promise<Object>} - Updated order
     */
    updateOrderStatus: async (id, status, additionalData = {}) => {
        try {
            const response = await apiClient.put(`/orders/${id}/status`, {
                status,
                ...additionalData
            });
            console.log(`✅ Order ${id} status updated to ${status}`);
            return response.data;
        } catch (error) {
            console.error('❌ Error updating order status:', error);
            throw error;
        }
    },

    /**
     * Update payment status
     * @param {string} id - Order ID
     * @param {string} paymentStatus - New payment status
     * @returns {Promise<Object>} - Updated order
     */
    updatePaymentStatus: async (id, paymentStatus) => {
        try {
            const response = await apiClient.put(`/orders/${id}/payment`, {
                paymentStatus
            });
            console.log(`✅ Order ${id} payment status updated to ${paymentStatus}`);
            return response.data;
        } catch (error) {
            console.error('❌ Error updating payment status:', error);
            throw error;
        }
    },

    /**
     * Delete an order
     * @param {string} id - Order ID
     * @returns {Promise<Object>} - Deletion confirmation
     */
    deleteOrder: async (id) => {
        try {
            const response = await apiClient.delete(`/orders/${id}`);
            console.log(`✅ Order ${id} deleted`);
            return response.data;
        } catch (error) {
            console.error('❌ Error deleting order:', error);
            throw error;
        }
    },

    /**
     * Get order statistics
     * @returns {Promise<Object>} - Order stats by status and payment status
     */
    getOrderStats: async () => {
        try {
            const response = await apiClient.get('/orders/stats');
            return response.data;
        } catch (error) {
            console.error('❌ Error fetching order stats:', error);
            throw error;
        }
    }
};
