import apiClient from './apiClient';

export const paymentService = {
    /**
     * Get all payments with optional filters
     * @param {Object} filters - Filter options
     * @returns {Promise<Object>} - Payments data
     */
    getPayments: async (filters = {}) => {
        try {
            const params = new URLSearchParams();
            Object.keys(filters).forEach(key => {
                if (filters[key]) params.append(key, filters[key]);
            });

            const response = await apiClient.get(`/payments?${params.toString()}`);
            console.log('✅ Payments fetched:', response.data.count);
            return response.data;
        } catch (error) {
            console.error('❌ Error fetching payments:', error);
            throw new Error(error.response?.data?.error || 'Failed to fetch payments');
        }
    },

    /**
     * Get single payment by ID
     * @param {string} id - Payment ID
     * @returns {Promise<Object>} - Payment data
     */
    getPaymentById: async (id) => {
        try {
            const response = await apiClient.get(`/payments/${id}`);
            return response.data;
        } catch (error) {
            console.error(`❌ Error fetching payment ${id}:`, error);
            throw new Error(error.response?.data?.error || 'Failed to fetch payment');
        }
    },

    /**
     * Create a new payment
     * @param {Object} paymentData - Payment details
     * @returns {Promise<Object>} - Created payment
     */
    createPayment: async (paymentData) => {
        try {
            const response = await apiClient.post('/payments', paymentData);
            console.log('✅ Payment created:', response.data.payment.paymentNumber);
            return response.data;
        } catch (error) {
            console.error('❌ Error creating payment:', error);
            throw new Error(error.response?.data?.error || 'Failed to create payment');
        }
    },

    /**
     * Approve payment
     * @param {string} id - Payment ID
     * @param {string} comments - Approval comments
     * @returns {Promise<Object>} - Updated payment
     */
    approvePayment: async (id, comments = '') => {
        try {
            const response = await apiClient.put(`/payments/${id}/approve`, { comments });
            console.log(`✅ Payment ${id} approved`);
            return response.data;
        } catch (error) {
            console.error('❌ Error approving payment:', error);
            throw new Error(error.response?.data?.error || 'Failed to approve payment');
        }
    },

    /**
     * Reject payment
     * @param {string} id - Payment ID
     * @param {string} reason - Rejection reason
     * @returns {Promise<Object>} - Updated payment
     */
    rejectPayment: async (id, reason = '') => {
        try {
            const response = await apiClient.put(`/payments/${id}/reject`, { reason });
            console.log(`✅ Payment ${id} rejected`);
            return response.data;
        } catch (error) {
            console.error('❌ Error rejecting payment:', error);
            throw new Error(error.response?.data?.error || 'Failed to reject payment');
        }
    },

    /**
     * Mark payment as processing
     * @param {string} id - Payment ID
     * @returns {Promise<Object>} - Updated payment
     */
    processPayment: async (id) => {
        try {
            const response = await apiClient.put(`/payments/${id}/process`);
            console.log(`✅ Payment ${id} marked as processing`);
            return response.data;
        } catch (error) {
            console.error('❌ Error processing payment:', error);
            throw new Error(error.response?.data?.error || 'Failed to process payment');
        }
    },

    /**
     * Complete payment (mark as paid)
     * @param {string} id - Payment ID
     * @param {Object} paymentDetails - Transaction details
     * @returns {Promise<Object>} - Updated payment
     */
    completePayment: async (id, paymentDetails = {}) => {
        try {
            const response = await apiClient.put(`/payments/${id}/complete`, paymentDetails);
            console.log(`✅ Payment ${id} completed`);
            return response.data;
        } catch (error) {
            console.error('❌ Error completing payment:', error);
            throw new Error(error.response?.data?.error || 'Failed to complete payment');
        }
    },

    /**
     * Update payment status (general)
     * @param {string} id - Payment ID
     * @param {string} status - New status
     * @returns {Promise<Object>} - Updated payment
     */
    updatePaymentStatus: async (id, status) => {
        try {
            // Map status to appropriate endpoint
            switch (status) {
                case 'Approved':
                    return await paymentService.approvePayment(id);
                case 'Processing':
                    return await paymentService.processPayment(id);
                case 'Paid':
                    return await paymentService.completePayment(id);
                case 'Rejected':
                    return await paymentService.rejectPayment(id);
                default:
                    throw new Error('Invalid status update');
            }
        } catch (error) {
            console.error('❌ Error updating payment status:', error);
            throw error;
        }
    },

    /**
     * Delete a payment
     * @param {string} id - Payment ID
     * @returns {Promise<Object>} - Deletion confirmation
     */
    deletePayment: async (id) => {
        try {
            const response = await apiClient.delete(`/payments/${id}`);
            console.log(`✅ Payment ${id} deleted`);
            return response.data;
        } catch (error) {
            console.error('❌ Error deleting payment:', error);
            throw new Error(error.response?.data?.error || 'Failed to delete payment');
        }
    },

    /**
     * Get payment statistics
     * @returns {Promise<Object>} - Payment stats
     */
    getPaymentStats: async () => {
        try {
            const response = await apiClient.get('/payments/stats');
            return response.data;
        } catch (error) {
            console.error('❌ Error fetching payment stats:', error);
            throw new Error(error.response?.data?.error || 'Failed to fetch stats');
        }
    },

    /**
     * Export payments to CSV
     * @param {Object} filters - Export filters
     * @returns {Promise<Blob>} - CSV file blob
     */
    exportPayments: async (filters = {}) => {
        try {
            const params = new URLSearchParams();
            Object.keys(filters).forEach(key => {
                if (filters[key]) params.append(key, filters[key]);
            });

            const response = await apiClient.get(`/payments/export?${params.toString()}`, {
                responseType: 'blob'
            });

            console.log('✅ Payments exported');
            return response.data;
        } catch (error) {
            console.error('❌ Error exporting payments:', error);
            throw new Error(error.response?.data?.error || 'Failed to export payments');
        }
    },

    /**
     * Download CSV export
     * @param {Blob} blob - CSV data
     * @param {string} filename - File name
     */
    downloadCSV: (blob, filename = 'payments-export.csv') => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    },

    /**
     * Send payment request to vendor/client
     * @param {string} id - Payment ID
     * @returns {Promise<Object>} - Response
     */
    sendPaymentRequest: async (id) => {
        try {
            const response = await apiClient.post(`/payments/${id}/send-request`);
            console.log(`✅ Payment request sent for payment ${id}`);
            return response.data;
        } catch (error) {
            console.error('❌ Error sending payment request:', error);
            throw new Error(error.response?.data?.error || 'Failed to send payment request');
        }
    }
};
