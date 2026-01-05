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
    Eye,
    Printer,
    Send
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

    // Print Functionality with Template Injection
    const handlePrint = (order) => {
        const printWindow = window.open('', '_blank');
        const rows = order.items?.map((item, i) => `
            <tr>
                <td class="center">${i + 1}</td>
                <td>
                    <div class="item-name">${item.componentName}</div>
                    <div class="item-desc">${item.componentCode || 'N/A'}</div>
                </td>
                <td class="center">${item.qty} ${item.unit || 'pcs'}</td>
                <td class="right">₹${Number(item.unitPrice).toLocaleString()}</td>
                <td class="center">18%</td>
                <td class="right">₹${Number(item.total).toLocaleString()}</td>
            </tr>
        `).join('') || '';

        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Purchase Order - ${order.poNumber}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: 'Segoe UI', sans-serif; font-size: 12px; padding: 20px; }
                    .invoice { max-width: 800px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 30px; }
                    .header { text-align: center; border-bottom: 3px solid #1e3a5f; padding-bottom: 20px; margin-bottom: 20px; }
                    .company-name { font-size: 24px; font-weight: bold; color: #1e3a5f; }
                    .company-details { font-size: 11px; color: #64748b; margin-top: 5px; }
                    .po-title { text-align: center; margin: 20px 0; }
                    .po-title h2 { font-size: 20px; color: #1e3a5f; text-transform: uppercase; letter-spacing: 2px; }
                    .po-meta { display: flex; justify-content: center; gap: 20px; margin-top: 10px; font-size: 12px; }
                    .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 20px 0; }
                    .party-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; }
                    .party-box h4 { font-size: 10px; text-transform: uppercase; color: #64748b; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; margin-bottom: 5px; }
                    .party-box .name { font-weight: bold; font-size: 13px; color: #1e293b; }
                    .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    .items-table th { background: #1e3a5f; color: white; padding: 8px; text-align: left; font-size: 10px; text-transform: uppercase; }
                    .items-table td { padding: 8px; border-bottom: 1px solid #e2e8f0; }
                    .items-table .right { text-align: right; }
                    .items-table .center { text-align: center; }
                    .totals { display: flex; justify-content: flex-end; margin: 20px 0; }
                    .totals-table { width: 250px; }
                    .totals-table td { padding: 5px 10px; text-align: right; }
                    .totals-table .label { color: #64748b; }
                    .totals-table .value { font-weight: bold; }
                    .totals-table .grand-total { background: #1e3a5f; color: white; font-size: 14px; }
                    .signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 50px; }
                    .signature-line { border-top: 1px solid #000; margin: 0 20px; padding-top: 5px; text-align: center; font-size: 11px; font-weight: bold; }
                    @media print { body { padding: 0; } .invoice { border: none; } .no-print { display: none; } }
                </style>
            </head>
            <body>
                <div class="no-print" style="text-align: right; margin-bottom: 10px;">
                    <button onclick="window.print()" style="padding: 10px 20px; background: #1e3a5f; color: white; border: none; cursor: pointer;">🖨️ Print</button>
                </div>
                <div class="invoice">
                    <div class="header">
                        <div class="company-name">SMG ELECTRIC SCOOTERS</div>
                        <div class="company-details">
                            Plot No 123, Industrial Area, Phase 1, New Delhi - 110020<br>
                            Phone: +91 98765 43210 | Email: accounts@smg.com | GSTIN: 07AAACS1234A1Z5
                        </div>
                    </div>
                    <div class="po-title">
                        <h2>Purchase Order</h2>
                        <div class="po-meta">
                            <div><strong>PO #:</strong> ${order.poNumber}</div>
                            <div><strong>Date:</strong> ${new Date(order.date).toLocaleDateString()}</div>
                            <div><strong>Status:</strong> ${order.status}</div>
                        </div>
                    </div>
                    <div class="parties">
                        <div class="party-box">
                            <h4>Bill To (Vendor)</h4>
                            <div class="name">${order.vendor}</div>
                            <p>${order.vendorAddress || 'Vendor Address Not Available'}</p>
                            <p>GSTIN: ${order.gstIn || 'N/A'}</p>
                        </div>
                        <div class="party-box">
                            <h4>Ship To</h4>
                            <div class="name">SMG Electric Scooters - Plant 1</div>
                            <p>Plot No 123, Industrial Area, Phase 1, New Delhi - 110020</p>
                        </div>
                    </div>
                    <table class="items-table">
                        <thead>
                            <tr>
                                <th class="center" width="40">#</th>
                                <th>Item Description</th>
                                <th class="center" width="60">Qty</th>
                                <th class="right" width="80">Rate</th>
                                <th class="center" width="60">GST</th>
                                <th class="right" width="100">Amount</th>
                            </tr>
                        </thead>
                        <tbody>${rows}</tbody>
                    </table>
                    <div class="totals">
                        <table class="totals-table">
                            <tr><td class="label">Subtotal:</td><td class="value">₹${Number(order.subtotal || 0).toLocaleString()}</td></tr>
                            <tr><td class="label">GST (18%):</td><td class="value">₹${Number(order.gst || 0).toLocaleString()}</td></tr>
                            <tr class="grand-total"><td class="label" style="color:white">Grand Total:</td><td class="value">₹${Number(order.totalAmount || 0).toLocaleString()}</td></tr>
                        </table>
                    </div>
                    <div class="signatures">
                        <div class="signature-box"><div class="signature-line">For ${order.vendor}</div></div>
                        <div class="signature-box"><div class="signature-line">For SMG Electric Scooters</div></div>
                    </div>
                </div>
            </body>
            </html>
        `;
        printWindow.document.open();
        printWindow.document.write(htmlContent);
        printWindow.document.close();
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
                                        ₹{Number(order.totalAmount || 0).toLocaleString()}
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
                                        <button onClick={() => handlePrint(order)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Print PO">
                                            <Printer size={18} />
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
                    <div className="bg-white rounded shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 flex flex-col">
                        {/* Modal Header */}
                        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t">
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-bold text-slate-800">PO Preview</h2>
                                <span className="px-2 py-0.5 rounded-full bg-slate-200 text-xs font-medium text-slate-600">{selectedPO.poNumber}</span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePrint(selectedPO)}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-900 text-white rounded hover:bg-blue-800 text-sm font-medium"
                                >
                                    <Printer size={16} /> Print / PDF
                                </button>
                                <button onClick={() => setSelectedPO(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body - Document Preview */}
                        <div className="p-8 bg-slate-100 overflow-y-auto flex-1">
                            <div className="max-w-[800px] mx-auto bg-white shadow-lg min-h-[1000px] p-8 border border-slate-200 text-sm text-slate-900" id="po-preview">

                                {/* Document Header */}
                                <div className="text-center border-b-2 border-blue-900 pb-6 mb-8">
                                    <div className="text-3xl font-bold text-blue-900 mb-2">SMG ELECTRIC SCOOTERS</div>
                                    <div className="text-slate-500 text-xs">
                                        Plot No 123, Industrial Area, Phase 1, New Delhi - 110020<br />
                                        GSTIN: 07AAACS1234A1Z5 | Phone: +91 98765 43210
                                    </div>
                                </div>

                                {/* Title & Meta */}
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Bill To (Vendor)</div>
                                        <div className="font-bold text-lg">{selectedPO.vendor}</div>
                                        <div className="text-slate-600 max-w-[200px] text-xs mt-1">
                                            {selectedPO.vendorAddress || 'Vendor Address Not Available'}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-blue-900 uppercase tracking-widest mb-2">Purchase Order</div>
                                        <div className="space-y-1 text-xs">
                                            <div className="flex justify-end gap-4"><span className="text-slate-500">PO #:</span> <span className="font-mono font-bold">{selectedPO.poNumber}</span></div>
                                            <div className="flex justify-end gap-4"><span className="text-slate-500">Date:</span> <span className="font-bold">{new Date(selectedPO.date).toLocaleDateString()}</span></div>
                                            <div className="flex justify-end gap-4"><span className="text-slate-500">Status:</span> <span className="font-bold">{selectedPO.status}</span></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Items Table */}
                                <table className="w-full mb-8">
                                    <thead>
                                        <tr className="bg-blue-900 text-white text-xs uppercase">
                                            <th className="p-2 text-center w-10">#</th>
                                            <th className="p-2 text-left">Item Description</th>
                                            <th className="p-2 text-center w-20">Qty</th>
                                            <th className="p-2 text-right w-24">Rate</th>
                                            <th className="p-2 text-center w-16">GST</th>
                                            <th className="p-2 text-right w-28">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {selectedPO.items?.map((item, i) => (
                                            <tr key={i} className="text-xs">
                                                <td className="p-3 text-center text-slate-500">{i + 1}</td>
                                                <td className="p-3">
                                                    <div className="font-bold text-slate-800">{item.componentName}</div>
                                                    <div className="text-[10px] text-slate-500">{item.componentCode}</div>
                                                </td>
                                                <td className="p-3 text-center">{item.qty} {item.unit}</td>
                                                <td className="p-3 text-right text-slate-600">₹{Number(item.unitPrice).toLocaleString()}</td>
                                                <td className="p-3 text-center text-slate-500">18%</td>
                                                <td className="p-3 text-right font-bold text-slate-800">₹{Number(item.total).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Totals */}
                                <div className="flex justify-end mb-12">
                                    <div className="w-64 space-y-2">
                                        <div className="flex justify-between text-xs text-slate-600">
                                            <span>Subtotal:</span>
                                            <span>₹{Number(selectedPO.subtotal || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-slate-600">
                                            <span>GST (18%):</span>
                                            <span>₹{Number(selectedPO.gst || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm font-bold text-blue-900 border-t border-slate-300 pt-2">
                                            <span>Grand Total:</span>
                                            <span>₹{Number(selectedPO.totalAmount || 0).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer / Signatures */}
                                <div className="grid grid-cols-2 gap-12 mt-auto pt-12">
                                    <div className="text-center">
                                        <div className="border-t border-slate-300 pt-2 text-xs font-bold text-slate-600">For {selectedPO.vendor}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="border-t border-slate-300 pt-2 text-xs font-bold text-slate-600">For SMG Electric Scooters</div>
                                        <div className="text-[10px] text-slate-400 mt-1">Authorized Signatory</div>
                                    </div>
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
