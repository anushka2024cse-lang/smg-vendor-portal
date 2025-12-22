import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Trash2, Printer, Send, Save, ArrowLeft } from 'lucide-react';
import { purchaseOrderService } from '../../services/purchaseOrderService';

const PurchaseOrderCreateReplica = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Initial State matching Reference Form
    const [formData, setFormData] = useState({
        poNumber: `PO-${new Date().getFullYear()}${new Date().getMonth() + 1}-${Math.floor(Math.random() * 1000)}`, // Auto-gen suggestion
        vendor: '',
        status: 'Draft',
        date: new Date().toISOString().split('T')[0],
        expectedDeliveryDate: '',
        paymentTerms: '',
        deliveryAddress: '',
        termsAndConditions: '',
        remarks: ''
    });

    const [items, setItems] = useState([
        { id: 1, componentCode: '', componentName: '', qty: 1, unit: 'pcs', unitPrice: 0, total: 0 }
    ]);

    // Handlers
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const addItem = () => {
        setItems([...items, { id: Date.now(), componentCode: '', componentName: '', qty: 1, unit: 'pcs', unitPrice: 0, total: 0 }]);
    };

    const removeItem = (id) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    const updateItem = (id, field, value) => {
        setItems(items.map(item => {
            if (item.id === id) {
                const updatedItem = { ...item, [field]: value };
                // Auto calculate total
                if (field === 'qty' || field === 'unitPrice') {
                    updatedItem.total = (parseFloat(updatedItem.qty) || 0) * (parseFloat(updatedItem.unitPrice) || 0);
                }
                return updatedItem;
            }
            return item;
        }));
    };

    // Calculations
    const calculateTotals = () => {
        const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
        const gst = subtotal * 0.18; // Assuming 18% standard GST for now
        const grandTotal = subtotal + gst;
        return { subtotal, gst, grandTotal };
    };

    const totals = calculateTotals();

    // Submit Handler
    const handleCreatePO = async () => {
        try {
            setLoading(true);
            const payload = {
                ...formData,
                items: items,
                subtotal: totals.subtotal,
                gst: totals.gst,
                totalAmount: totals.grandTotal
            };

            await purchaseOrderService.createPurchaseOrder(payload);
            navigate('/po/list'); // Redirect to list on success
        } catch (error) {
            console.error("Failed to create PO", error);
            alert("Failed to create Purchase Order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            {/* Top Bar matched to header style */}
            <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    {/* Replaced ChevronLeft text button with icon button if desired, but text is clearer */}
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-bold text-slate-800">Create Purchase Order (Replica)</h1>
                        <p className="text-xs text-slate-500">Create a new purchase order</p>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/po/list')}
                    className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                    <ArrowLeft size={16} /> Back
                </button>
            </div>

            <div className="max-w-7xl mx-auto p-8 space-y-6">

                {/* Order Information Section */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                    <h2 className="text-sm font-bold text-slate-800 mb-6 border-b border-slate-100 pb-2">Order Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500">PO Number *</label>
                            <input
                                type="text"
                                value={formData.poNumber}
                                onChange={(e) => handleInputChange('poNumber', e.target.value)}
                                className="w-full p-2 border border-slate-200 rounded-md text-sm font-medium focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500">Vendor *</label>
                            <select
                                value={formData.vendor}
                                onChange={(e) => handleInputChange('vendor', e.target.value)}
                                className="w-full p-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-blue-500 bg-white"
                            >
                                <option value="">Select vendor</option>
                                <option value="ElectroParts India Pvt Ltd">ElectroParts India Pvt Ltd</option>
                                <option value="BatteryTech Solutions">BatteryTech Solutions</option>
                                <option value="AutoBody Works">AutoBody Works</option>
                                <option value="Meenakshi Polymers">Meenakshi Polymers</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => handleInputChange('status', e.target.value)}
                                className="w-full p-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-blue-500 bg-white"
                            >
                                <option value="Draft">Draft</option>
                                <option value="Issued">Issued</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500">PO Date *</label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => handleInputChange('date', e.target.value)}
                                className="w-full p-2 border border-slate-200 rounded-md text-sm text-slate-600 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500">Expected Delivery Date</label>
                            <input
                                type="date"
                                value={formData.expectedDeliveryDate}
                                onChange={(e) => handleInputChange('expectedDeliveryDate', e.target.value)}
                                className="w-full p-2 border border-slate-200 rounded-md text-sm text-slate-600 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500">Payment Terms</label>
                            <select
                                value={formData.paymentTerms}
                                onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                                className="w-full p-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-blue-500 bg-white"
                            >
                                <option value="">Select terms</option>
                                <option value="Net 30">Net 30</option>
                                <option value="Net 60">Net 60</option>
                                <option value="Immediate">Immediate</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Line Items Section */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-sm font-bold text-slate-800">Line Items</h2>
                        <button onClick={addItem} className="flex items-center gap-1 text-xs font-bold text-blue-600 border border-blue-200 px-3 py-1.5 rounded hover:bg-blue-50 transition-colors">
                            <Plus size={14} /> Add Item
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100 text-xs text-slate-500 uppercase">
                                    <th className="py-3 px-2 font-semibold w-48">Component Code</th>
                                    <th className="py-3 px-2 font-semibold w-64">Component Name</th>
                                    <th className="py-3 px-2 font-semibold w-24">Qty</th>
                                    <th className="py-3 px-2 font-semibold w-24">Unit</th>
                                    <th className="py-3 px-2 font-semibold w-32">Unit Price (₹)</th>
                                    <th className="py-3 px-2 font-semibold w-32">Total (₹)</th>
                                    <th className="py-3 px-2 w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {items.map((item) => (
                                    <tr key={item.id} className="group hover:bg-slate-50/30">
                                        <td className="p-2">
                                            {/* Mocking Dropdown for Code, can be free text too */}
                                            <input
                                                type="text"
                                                placeholder="Select component"
                                                value={item.componentCode}
                                                onChange={(e) => updateItem(item.id, 'componentCode', e.target.value)}
                                                className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm focus:outline-none focus:border-blue-500"
                                            />
                                        </td>
                                        <td className="p-2">
                                            <input
                                                type="text"
                                                placeholder="Component name"
                                                value={item.componentName}
                                                onChange={(e) => updateItem(item.id, 'componentName', e.target.value)}
                                                className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm focus:outline-none focus:border-blue-500"
                                            />
                                        </td>
                                        <td className="p-2">
                                            <input
                                                type="number"
                                                value={item.qty}
                                                onChange={(e) => updateItem(item.id, 'qty', e.target.value)}
                                                className="w-full p-2 bg-white border border-slate-200 rounded text-sm text-center focus:outline-none focus:border-blue-500"
                                            />
                                        </td>
                                        <td className="p-2">
                                            <input
                                                type="text"
                                                value={item.unit}
                                                onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                                                className="w-full p-2 bg-white border border-slate-200 rounded text-sm text-center focus:outline-none focus:border-blue-500"
                                            />
                                        </td>
                                        <td className="p-2">
                                            <input
                                                type="number"
                                                value={item.unitPrice}
                                                onChange={(e) => updateItem(item.id, 'unitPrice', e.target.value)}
                                                className="w-full p-2 bg-white border border-slate-200 rounded text-sm text-right focus:outline-none focus:border-blue-500"
                                            />
                                        </td>
                                        <td className="p-2">
                                            <div className="w-full p-2 bg-slate-50 text-slate-500 rounded text-sm text-right font-medium">
                                                {item.total.toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="p-2 text-center">
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-slate-300 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals Footer */}
                    <div className="flex flex-col items-end gap-2 mt-6 pt-4 border-t border-slate-100">
                        <div className="flex justify-between w-64 text-sm">
                            <span className="text-slate-500">Subtotal</span>
                            <span className="font-medium text-slate-800">₹{totals.subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between w-64 text-sm">
                            <span className="text-slate-500">GST (18%)</span>
                            <span className="font-medium text-slate-800">₹{totals.gst.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between w-64 text-base mt-2 pt-2 border-t border-slate-200">
                            <span className="font-bold text-slate-800">Total Amount</span>
                            <span className="font-bold text-slate-900">₹{totals.grandTotal.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Additional Information */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                    <h2 className="text-sm font-bold text-slate-800 mb-6 border-b border-slate-100 pb-2">Additional Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500">Delivery Address</label>
                            <textarea
                                value={formData.deliveryAddress}
                                onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                                placeholder="Enter delivery address"
                                className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 resize-none h-24"
                            ></textarea>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500">Terms & Conditions</label>
                            <textarea
                                value={formData.termsAndConditions}
                                onChange={(e) => handleInputChange('termsAndConditions', e.target.value)}
                                placeholder="Enter terms and conditions"
                                className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 resize-none h-24"
                            ></textarea>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500">Remarks</label>
                        <input
                            type="text"
                            value={formData.remarks}
                            onChange={(e) => handleInputChange('remarks', e.target.value)}
                            placeholder="Additional remarks"
                            className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>


                </div>

            </div>

            {/* Sticky Action Footer */}
            <div className="fixed bottom-0 right-0 left-0 lg:left-64 bg-white border-t border-slate-200 p-4 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="text-sm text-slate-500">
                        Last saved: <span className="font-medium text-slate-700">Just now</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/po/list')}
                            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors"
                        >
                            <span className="font-bold">Cancel</span>
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors">
                            <Printer size={16} />
                            <span>Print Preview</span>
                        </button>
                        <button
                            onClick={handleCreatePO}
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors"
                        >
                            <Send size={16} />
                            <span>{loading ? 'Sending...' : 'Send to Vendor'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseOrderCreateReplica;
