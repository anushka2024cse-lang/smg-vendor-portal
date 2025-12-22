import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import socketService from '../../services/socketService';
import './OrderHistory.css';

export default function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: '',
        paymentStatus: '',
        search: '',
        startDate: '',
        endDate: ''
    });
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
        fetchStats();

        // Listen for real-time order updates
        socketService.on('orderUpdated', handleOrderUpdate);

        return () => {
            socketService.off('orderUpdated', handleOrderUpdate);
        };
    }, [filters]);

    const handleOrderUpdate = (updatedOrder) => {
        setOrders(prevOrders =>
            prevOrders.map(order =>
                order._id === updatedOrder._id ? updatedOrder : order
            )
        );
    };

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await orderService.getOrders(filters);
            setOrders(data.orders);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const data = await orderService.getOrderStats();
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            status: '',
            paymentStatus: '',
            search: '',
            startDate: '',
            endDate: ''
        });
    };

    const getStatusBadgeClass = (status) => {
        const classes = {
            pending: 'badge-warning',
            confirmed: 'badge-info',
            'in-transit': 'badge-primary',
            delivered: 'badge-success',
            cancelled: 'badge-danger',
            returned: 'badge-secondary'
        };
        return classes[status] || 'badge-secondary';
    };

    const getPaymentBadgeClass = (paymentStatus) => {
        const classes = {
            unpaid: 'badge-danger',
            partial: 'badge-warning',
            paid: 'badge-success',
            overdue: 'badge-error'
        };
        return classes[paymentStatus] || 'badge-secondary';
    };

    return (
        <div className="order-history-page">
            <header className="page-header">
                <div className="header-content">
                    <h1>📦 Order History</h1>
                    <p>Track and manage all purchase orders</p>
                </div>
            </header>

            {/* Stats Cards */}
            {stats && (
                <div className="stats-grid">
                    {stats.orderStats?.map(stat => (
                        <div key={stat._id} className="stat-card">
                            <div className="stat-value">{stat.count}</div>
                            <div className="stat-label">{stat._id} Orders</div>
                            <div className="stat-amount">
                                ₹{stat.totalAmount.toLocaleString('en-IN')}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Filters */}
            <div className="filters-section">
                <div className="filter-row">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="🔍 Search by order number, tracking..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                    />

                    <select
                        className="filter-select"
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="in-transit">In Transit</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="returned">Returned</option>
                    </select>

                    <select
                        className="filter-select"
                        value={filters.paymentStatus}
                        onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
                    >
                        <option value="">All Payments</option>
                        <option value="unpaid">Unpaid</option>
                        <option value="partial">Partial</option>
                        <option value="paid">Paid</option>
                        <option value="overdue">Overdue</option>
                    </select>

                    <input
                        type="date"
                        className="date-input"
                        value={filters.startDate}
                        onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    />

                    <input
                        type="date"
                        className="date-input"
                        value={filters.endDate}
                        onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    />

                    <button className="btn-secondary" onClick={clearFilters}>
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Orders Table */}
            <div className="orders-section">
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading orders...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="empty-state">
                        <p>No orders found</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>Order Number</th>
                                    <th>Date</th>
                                    <th>Vendor</th>
                                    <th>Items</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Payment</th>
                                    <th>Tracking</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order._id} onClick={() => setSelectedOrder(order)}>
                                        <td className="order-number">{order.orderNumber}</td>
                                        <td>{new Date(order.orderDate).toLocaleDateString('en-IN')}</td>
                                        <td>
                                            <div className="vendor-info">
                                                <div className="vendor-name">{order.vendor?.name}</div>
                                                <div className="vendor-email">{order.vendor?.email}</div>
                                            </div>
                                        </td>
                                        <td>{order.items?.length || 0} items</td>
                                        <td className="amount">₹{order.totalAmount.toLocaleString('en-IN')}</td>
                                        <td>
                                            <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${getPaymentBadgeClass(order.paymentStatus)}`}>
                                                {order.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="tracking">
                                            {order.trackingNumber || '-'}
                                        </td>
                                        <td>
                                            <button
                                                className="btn-icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedOrder(order);
                                                }}
                                                title="View Details"
                                            >
                                                👁️
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onUpdate={fetchOrders}
                />
            )}
        </div>
    );
}

// Order Details Modal Component
function OrderDetailsModal({ order, onClose, onUpdate }) {
    const [updating, setUpdating] = useState(false);

    const handleStatusUpdate = async (newStatus) => {
        try {
            setUpdating(true);
            await orderService.updateOrderStatus(order._id, newStatus);
            onUpdate();
            onClose();
        } catch (error) {
            alert('Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Order Details: {order.orderNumber}</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    <div className="detail-section">
                        <h3>Order Information</h3>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <label>Order Date:</label>
                                <span>{new Date(order.orderDate).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="detail-item">
                                <label>Status:</label>
                                <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="detail-item">
                                <label>Payment Status:</label>
                                <span className={`badge ${getPaymentBadgeClass(order.paymentStatus)}`}>
                                    {order.paymentStatus}
                                </span>
                            </div>
                            <div className="detail-item">
                                <label>Tracking Number:</label>
                                <span>{order.trackingNumber || 'Not available'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="detail-section">
                        <h3>Vendor Information</h3>
                        <p><strong>Name:</strong> {order.vendor?.name}</p>
                        <p><strong>Email:</strong> {order.vendor?.email}</p>
                        <p><strong>Contact:</strong> {order.vendor?.contactPerson}</p>
                    </div>

                    <div className="detail-section">
                        <h3>Order Items</h3>
                        <table className="items-table">
                            <thead>
                                <tr>
                                    <th>Component</th>
                                    <th>Quantity</th>
                                    <th>Unit Price</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items?.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.component}</td>
                                        <td>{item.quantity}</td>
                                        <td>₹{item.unitPrice.toLocaleString('en-IN')}</td>
                                        <td>₹{item.totalPrice.toLocaleString('en-IN')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="total-amount">
                            <strong>Total: ₹{order.totalAmount.toLocaleString('en-IN')}</strong>
                        </div>
                    </div>

                    {order.notes && (
                        <div className="detail-section">
                            <h3>Notes</h3>
                            <p>{order.notes}</p>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <select
                        onChange={(e) => handleStatusUpdate(e.target.value)}
                        disabled={updating}
                        value={order.status}
                    >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="in-transit">In Transit</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <button className="btn-secondary" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

function getStatusBadgeClass(status) {
    const classes = {
        pending: 'badge-warning',
        confirmed: 'badge-info',
        'in-transit': 'badge-primary',
        delivered: 'badge-success',
        cancelled: 'badge-danger',
        returned: 'badge-secondary'
    };
    return classes[status] || 'badge-secondary';
}

function getPaymentBadgeClass(paymentStatus) {
    const classes = {
        unpaid: 'badge-danger',
        partial: 'badge-warning',
        paid: 'badge-success',
        overdue: 'badge-error'
    };
    return classes[paymentStatus] || 'badge-secondary';
}
