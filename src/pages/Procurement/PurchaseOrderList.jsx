import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    Plus,
    Search,
    FileText,
    CheckCircle,
    Clock,
    AlertCircle,
    Download,
    X,
    Eye
} from 'lucide-react';
import { purchaseOrderService } from '../../services/purchaseOrderService';

const PurchaseOrderList = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const initialStatus = searchParams.get('status');
    const [activeTab, setActiveTab] = useState(initialStatus || 'All');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [selectedPO, setSelectedPO] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    // Sync state with URL param if it changes
    useEffect(() => {
        const status = searchParams.get('status');
        if (status) {
            setActiveTab(status);
        }
    }, [searchParams]);

    const fetchOrders = async () => {
        try {
            const data = await purchaseOrderService.getAllPurchaseOrders();
            setOrders(data);
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Issued': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
            case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'In Progress': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const tabs = ['All', 'Draft', 'Issued', 'Completed'];

    const filteredOrders = activeTab === 'All'
        ? orders
        : orders.filter(order => order.status === activeTab);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">

            {/* Breadcrumb & Title */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>

                    <h1 className="text-2xl font-bold text-slate-900">Purchase Orders</h1>
                    <p className="text-slate-500">Manage your procurement orders.</p>
                </div>
                <button
                    onClick={() => navigate('/po/create')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-all shadow-md hover:shadow-lg font-medium"
                >
                    <Plus size={18} />
                    Create New PO
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-xs font-medium uppercase">Pending</p>
                        <p className="text-2xl font-bold text-slate-900">
                            {orders.filter(o => o.status === 'Draft' || o.status === 'Pending').length}
                        </p>
                    </div>
                    <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg"><Clock size={20} /></div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-xs font-medium uppercase">Issued / Active</p>
                        <p className="text-2xl font-bold text-slate-900">
                            {orders.filter(o => o.status === 'Issued' || o.status === 'In Progress').length}
                        </p>
                    </div>
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><FileText size={20} /></div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-xs font-medium uppercase">Completed</p>
                        <p className="text-2xl font-bold text-green-700">
                            {orders.filter(o => o.status === 'Completed').length}
                        </p>
                    </div>
                    <div className="p-3 bg-green-100 text-green-600 rounded-lg"><CheckCircle size={20} /></div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-xs font-medium uppercase">Cancelled</p>
                        <p className="text-2xl font-bold text-red-600">
                            {orders.filter(o => o.status === 'Cancelled').length}
                        </p>
                    </div>
                    <div className="p-3 bg-red-100 text-red-600 rounded-lg"><AlertCircle size={20} /></div>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden min-h-[400px]">

                {/* Toolbar */}
                <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
                    {/* Tabs */}
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === tab
                                    ? 'bg-white text-blue-900 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search PO Number..."
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-sm"
                        />
                    </div>
                </div>

                {/* Table */}
                {loading ? (
                    <div className="p-8 text-center text-slate-500">Loading orders...</div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">PO Number</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Vendor</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Items</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => setSelectedPO(order)}
                                            className="font-mono text-xs font-bold text-blue-700 hover:underline"
                                        >
                                            {order.poNumber}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-900">{order.vendor}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{new Date(order.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 font-mono text-sm font-medium text-slate-800">
                                        ₹{(order.totalAmount || 0).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{order.items?.length || 0}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => setSelectedPO(order)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="View Details">
                                            <Eye size={18} />
                                        </button>
                                        <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Download PDF">
                                            <Download size={18} />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-8 text-slate-500 text-sm">
                                        No purchase orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* View Details Modal */}
            {selectedPO && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-100 flex justify-between items-start">
                            <h2 className="text-xl font-bold text-slate-800">Purchase Order Details</h2>
                            <button onClick={() => setSelectedPO(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 space-y-8">

                            {/* Key Details Row */}
                            <div className="grid grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">PO Number</p>
                                    <p className="text-lg font-bold text-slate-800">{selectedPO.poNumber}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Vendor</p>
                                    <p className="text-sm font-bold text-slate-800 leading-tight">{selectedPO.vendor}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">PO Date</p>
                                    <p className="text-sm font-bold text-slate-800">{new Date(selectedPO.date).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Status</p>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(selectedPO.status)}`}>
                                        {selectedPO.status}
                                    </span>
                                </div>
                            </div>

                            {/* Line Items */}
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 mb-4 text-blue-900">Line Items</h3>
                                <div className="border border-slate-200 rounded-lg overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50 border-b border-slate-200">
                                            <tr>
                                                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Component</th>
                                                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-center">Qty</th>
                                                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Unit Price</th>
                                                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {selectedPO.items?.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td className="px-4 py-3">
                                                        <p className="font-bold text-slate-800 text-sm">{item.componentName}</p>
                                                        <p className="text-xs text-slate-400 font-mono">{item.componentCode}</p>
                                                    </td>
                                                    <td className="px-4 py-3 text-center text-sm font-medium text-slate-700">
                                                        {item.qty} {item.unit}
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-sm text-slate-600">
                                                        ₹{item.unitPrice.toLocaleString()}
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-sm font-bold text-slate-800">
                                                        ₹{item.total.toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="bg-slate-50/50">
                                            <tr>
                                                <td colSpan="3" className="px-4 py-2 text-right text-xs font-medium text-slate-500">Subtotal</td>
                                                <td className="px-4 py-2 text-right text-sm font-medium text-slate-700">₹{(selectedPO.subtotal || 0).toLocaleString()}</td>
                                            </tr>
                                            <tr>
                                                <td colSpan="3" className="px-4 py-2 text-right text-xs font-medium text-slate-500">GST (18%)</td>
                                                <td className="px-4 py-2 text-right text-sm font-medium text-slate-700">₹{(selectedPO.gst || 0).toLocaleString()}</td>
                                            </tr>
                                            <tr>
                                                <td colSpan="3" className="px-4 py-3 text-right text-sm font-bold text-slate-900">Total</td>
                                                <td className="px-4 py-3 text-right text-lg font-bold text-blue-900">₹{(selectedPO.totalAmount || 0).toLocaleString()}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default PurchaseOrderList;
