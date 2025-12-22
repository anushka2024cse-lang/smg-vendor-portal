import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Trash2, Printer, Send, Save, FileText, X } from 'lucide-react';
import { purchaseOrderService } from '../../services/purchaseOrderService';

const PurchaseOrderCreate = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Form Data State
    const [formData, setFormData] = useState({
        vendor: '',
        poNumber: `PO-${new Date().getFullYear()}${new Date().getMonth() + 1}-${Math.floor(Math.random() * 1000)}`,
        status: 'Draft',
        expectedDate: '',
        shippingMode: 'By Road',
        deliveryAddress: 'Plot 45, Industrial Area Phase 2, Hoshiarpur, Punjab - 146001',
        termsAndConditions: "1. Goods must be delivered within the stipulated time.\n2. Payment net 30 days from invoice.\n3. Warranty as per standard agreement."
    });

    // Items State
    const [items, setItems] = useState([
        { id: 1, name: '', desc: '', qty: 1, price: 0, tax: 18, isCustomTax: false, discount: 0 }
    ]);
    const [showDiscount, setShowDiscount] = useState(false);

    // Handlers
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const addItem = () => {
        setItems([...items, { id: Date.now(), name: '', desc: '', qty: 1, price: 0, tax: 18, isCustomTax: false, discount: 0 }]);
    };

    const removeItem = (id) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    const updateItem = (id, field, value) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    // Calculations
    const calculateTotals = () => {
        let subtotal = 0;
        let taxTotal = 0;

        items.forEach(item => {
            const lineTotal = item.qty * item.price;
            const discountAmt = showDiscount ? lineTotal * (item.discount / 100) : 0;
            const taxableAmt = lineTotal - discountAmt;
            const lineTax = taxableAmt * (item.tax / 100);

            subtotal += taxableAmt;
            taxTotal += lineTax;
        });

        return { subtotal, taxTotal, grandTotal: subtotal + taxTotal };
    };

    const totals = calculateTotals();

    // Create PO Handler
    const handleCreatePO = async (status) => {
        try {
            setLoading(true);
            const payload = {
                poNumber: formData.poNumber,
                vendor: formData.vendor,
                status: status,
                date: new Date().toISOString(),
                expectedDeliveryDate: formData.expectedDate ? new Date(formData.expectedDate).toISOString() : null,
                deliveryAddress: formData.deliveryAddress,
                termsAndConditions: formData.termsAndConditions,
                items: items.map(item => {
                    const lineTotal = (item.qty || 0) * (item.price || 0);
                    const discountAmt = showDiscount ? lineTotal * (item.discount / 100) : 0;
                    const taxableAmt = lineTotal - discountAmt;
                    const total = taxableAmt * (1 + (item.tax || 0) / 100);

                    return {
                        componentName: item.name || 'Unknown Item',
                        componentCode: 'N/A',
                        qty: item.qty || 0,
                        unit: 'pcs',
                        unitPrice: item.price || 0,
                        discount: showDiscount ? item.discount || 0 : 0,
                        total: total
                    };
                }),
                subtotal: totals.subtotal,
                gst: totals.taxTotal,
                totalAmount: totals.grandTotal
            };

            // Basic Validation
            if (!formData.vendor) {
                alert("Please select a vendor");
                setLoading(false);
                return;
            }

            console.log("Sending Payload:", payload);

            await purchaseOrderService.createPurchaseOrder(payload);

            if (status === 'Draft') {
                alert("Draft Saved Successfully!");
                navigate('/po/list');
            } else {
                alert("Purchase Order Sent to Vendor!");
                navigate('/po/list');
            }

        } catch (error) {
            console.error("Failed to create PO", error);
            alert("Failed to save PO. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto min-h-screen pb-20">

            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <button
                        onClick={() => navigate('/po/list')}
                        className="flex items-center gap-1 text-sm text-slate-500 hover:text-blue-900 transition-colors mb-2"
                    >
                        <ChevronLeft size={16} /> Back to List
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/po/list?status=Draft')}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm hover:bg-slate-50 transition-colors mr-2"
                    >
                        <FileText size={14} /> View Drafts
                    </button>
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium border border-slate-200">
                        {formData.status} Mode
                    </span>
                    <span className="text-slate-400 text-sm">#{formData.poNumber}</span>
                </div>
            </div>

            {/* Invoice Paper Layout */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

                {/* Vendor & Shipping Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 border-b border-slate-100 bg-slate-50/50">
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vendor Details</h3>
                        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm cursor-pointer hover:border-blue-300 transition-colors">
                            <select
                                value={formData.vendor}
                                onChange={(e) => handleInputChange('vendor', e.target.value)}
                                className="w-full bg-transparent outline-none font-medium text-slate-900 mb-1"
                            >
                                <option value="">Select Vendor...</option>
                                <option value="Meenakshi Polymers Pvt Ltd">Meenakshi Polymers Pvt Ltd</option>
                                <option value="NeoSky India Ltd">NeoSky India Ltd</option>
                                <option value="ElectroParts India Pvt Ltd">ElectroParts India Pvt Ltd</option>
                            </select>
                            <p className="text-sm text-slate-500">Please select a vendor to auto-fill details.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Shipping Details</h3>
                        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                            <div className="flex justify-between mb-2">
                                <p className="font-medium text-slate-900">SMG Electric Scooters (Plant 1)</p>
                                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">Primary</span>
                            </div>
                            <p className="text-sm text-slate-500">{formData.deliveryAddress}</p>
                            <div className="mt-3 grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1">Expected Date</label>
                                    <input
                                        type="date"
                                        value={formData.expectedDate}
                                        onChange={(e) => handleInputChange('expectedDate', e.target.value)}
                                        className="w-full text-sm bg-slate-50 border border-slate-200 rounded p-1"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1">Shipping Mode</label>
                                    <select
                                        value={formData.shippingMode}
                                        onChange={(e) => handleInputChange('shippingMode', e.target.value)}
                                        className="w-full text-sm bg-slate-50 border border-slate-200 rounded p-1"
                                    >
                                        <option value="By Road">By Road</option>
                                        <option value="Courier">Courier</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Line Items Grid */}
                <div className="p-8">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Item Details</h3>

                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                                <th className="py-2 w-10">#</th>
                                <th className="py-2 w-1/3">Item Name & Desc</th>
                                <th className="py-2 w-24">Qty</th>
                                <th className="py-2 w-32">Unit Price</th>
                                {showDiscount && <th className="py-2 w-24">Disc %</th>}
                                <th className="py-2 w-24">Tax %</th>
                                <th className="py-2 w-32 text-right">Total</th>
                                <th className="py-2 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {items.map((item, index) => (
                                <tr key={item.id} className="group">
                                    <td className="py-4 text-slate-400 text-sm align-top pt-5">{index + 1}</td>
                                    <td className="py-4 align-top">
                                        <input
                                            type="text"
                                            placeholder="Item Name (e.g. Seat Assy)"
                                            value={item.name}
                                            onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                                            className="w-full font-medium text-slate-900 outline-none placeholder:text-slate-300 mb-1"
                                        />
                                        <textarea
                                            placeholder="Description / Specs..."
                                            value={item.desc}
                                            onChange={(e) => updateItem(item.id, 'desc', e.target.value)}
                                            className="w-full text-sm text-slate-500 outline-none placeholder:text-slate-300 resize-none h-10"
                                        ></textarea>
                                    </td>
                                    <td className="py-4 align-top">
                                        <input
                                            type="number"
                                            className="w-20 p-2 border border-slate-200 rounded text-center"
                                            value={item.qty}
                                            onChange={(e) => updateItem(item.id, 'qty', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                    <td className="py-4 align-top">
                                        <div className="relative">
                                            <span className="absolute left-2 top-2 text-slate-400 text-sm">₹</span>
                                            <input
                                                type="number"
                                                className="w-28 pl-6 p-2 border border-slate-200 rounded text-right"
                                                value={item.price}
                                                onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                                            />
                                        </div>
                                    </td>
                                    {showDiscount && (
                                        <td className="py-4 align-top">
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    className="w-20 p-2 border border-slate-200 rounded text-center"
                                                    value={item.discount}
                                                    onChange={(e) => updateItem(item.id, 'discount', Math.max(0, parseFloat(e.target.value) || 0))}
                                                />
                                                <span className="absolute right-2 top-2 text-xs text-slate-400">%</span>
                                            </div>
                                        </td>
                                    )}
                                    <td className="py-4 align-top">
                                        {item.isCustomTax ? (
                                            <div className="flex items-center gap-1">
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        className="w-20 p-2 border border-blue-400 rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                        value={item.tax}
                                                        autoFocus
                                                        placeholder="%"
                                                        onChange={(e) => updateItem(item.id, 'tax', Math.max(0, parseFloat(e.target.value) || 0))}
                                                    />
                                                    <span className="absolute right-2 top-2 text-xs text-slate-400">%</span>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        updateItem(item.id, 'isCustomTax', false);
                                                        updateItem(item.id, 'tax', 18);
                                                    }}
                                                    className="p-1 text-slate-400 hover:text-red-500 rounded-full hover:bg-slate-100"
                                                    title="Revert to list"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ) : (
                                            <select
                                                className="w-20 p-2 border border-slate-200 rounded bg-white"
                                                value={item.tax}
                                                onChange={(e) => {
                                                    if (e.target.value === 'custom') {
                                                        // Atomic update to prevent closure race condition
                                                        setItems(prevItems => prevItems.map(i =>
                                                            i.id === item.id ? { ...i, isCustomTax: true, tax: 0 } : i
                                                        ));
                                                    } else {
                                                        updateItem(item.id, 'tax', parseFloat(e.target.value));
                                                    }
                                                }}
                                            >
                                                <option value={0}>0%</option>
                                                <option value={5}>5%</option>
                                                <option value={12}>12%</option>
                                                <option value={18}>18%</option>
                                                <option value={28}>28%</option>
                                                <option value="custom" className="font-bold text-blue-600">Custom...</option>
                                            </select>
                                        )}
                                    </td>
                                    <td className="py-4 align-top text-right font-mono text-slate-700 pt-5">
                                        ₹ {((item.qty * item.price) * (1 - (showDiscount ? item.discount : 0) / 100) * (1 + item.tax / 100)).toFixed(2)}
                                    </td>
                                    <td className="py-4 align-top pt-4">
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="p-1.5 text-slate-300 hover:text-red-500 rounded transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex items-center justify-between mt-4">
                        <button
                            onClick={addItem}
                            className="flex items-center gap-2 text-sm text-blue-600 font-medium hover:text-blue-800 transition-colors"
                        >
                            <Plus size={16} /> Add Another Item
                        </button>

                        <div className="flex items-center gap-2">
                            <label className="text-xs text-slate-400 font-medium">Enable Discount Column</label>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={showDiscount}
                                    onChange={() => setShowDiscount(!showDiscount)}
                                    className="sr-only peer"
                                />
                                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-400"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Footer Totals */}
                <div className="bg-slate-50 p-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-end gap-6">
                    <div className="w-full md:w-1/2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Terms & Conditions</label>
                        <textarea
                            value={formData.termsAndConditions}
                            onChange={(e) => handleInputChange('termsAndConditions', e.target.value)}
                            className="w-full h-24 p-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 outline-none resize-none"
                        ></textarea>
                    </div>

                    <div className="w-full md:w-80 space-y-3">
                        <div className="flex justify-between text-sm text-slate-600">
                            <span>Subtotal</span>
                            <span className="font-mono">₹ {totals.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-600">
                            <span>Tax (GST)</span>
                            <span className="font-mono">₹ {totals.taxTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-slate-900 border-t border-slate-300 pt-3">
                            <span>Grand Total</span>
                            <span className="font-mono">₹ {totals.grandTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Sticky Action Footer */}
            <div className="fixed bottom-0 right-0 left-0 lg:left-72 bg-white border-t border-slate-200 p-4 z-30">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <p className="text-sm text-slate-500">Last saved: Just now</p>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => handleCreatePO('Draft')}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                        >
                            <Save size={18} /> {loading ? 'Saving...' : 'Save Draft'}
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">
                            <Printer size={18} /> Print Preview
                        </button>
                        <button
                            onClick={() => handleCreatePO('Issued')}
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 shadow-md font-medium transition-all"
                        >
                            <Send size={18} /> {loading ? 'Sending...' : 'Send to Vendor'}
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default PurchaseOrderCreate;
