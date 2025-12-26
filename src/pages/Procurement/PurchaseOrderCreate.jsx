import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Trash2, Printer, Send, Save, FileText, X } from 'lucide-react';
import { purchaseOrderService } from '../../services/purchaseOrderService';
import componentService from '../../services/componentService';
import { vendorService } from '../../services/vendorService';
import AutocompleteInput from '../../components/common/AutocompleteInput';
import { printPurchaseOrder } from '../../utils/printPurchaseOrder';


// SMG Company Details
const SMG_COMPANY = {
    name: "SMG Electric Scooters Pvt Ltd",
    address: "Plot 45, Industrial Area Phase 2, Hoshiarpur, Punjab - 146001",
    contact: "+91 98765 00000",
    email: "procurement@smgscooters.com",
    gstin: "03AABCS1234K1Z8"
};

const PurchaseOrderCreate = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [availableComponents, setAvailableComponents] = useState([]);
    const [availableVendors, setAvailableVendors] = useState([]);
    const [selectedVendor, setSelectedVendor] = useState(null);

    // Fetch components and vendors on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch components
                const componentResponse = await componentService.getComponents();
                if (componentResponse.success) {
                    setAvailableComponents(componentResponse.data);
                }

                // Fetch vendors from database
                const vendorData = await vendorService.getAllVendors();
                setAvailableVendors(vendorData || []);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };
        fetchData();
    }, []);

    // Form Data State
    const [formData, setFormData] = useState({
        vendor: '',
        poNumber: `PO-${new Date().getFullYear()}${new Date().getMonth() + 1}-${Math.floor(Math.random() * 1000)}`,
        status: 'Draft',
        expectedDate: '',
        shippingMode: 'By Road',
        deliveryAddress: SMG_COMPANY.address,
        termsAndConditions: "1. Goods must be delivered within the stipulated time.\n2. Payment net 30 days from invoice.\n3. Warranty as per standard agreement.",
        // Vendor Details
        vendorName: '',
        vendorAddress: '',
        vendorContact: '',
        vendorEmail: '',
        vendorGSTIN: '',
        // Billing Details (SMG)
        billingName: SMG_COMPANY.name,
        billingAddress: SMG_COMPANY.address,
        billingContact: SMG_COMPANY.contact,
        billingEmail: SMG_COMPANY.email,
        billingGSTIN: SMG_COMPANY.gstin
    });

    // Items State
    const [items, setItems] = useState([
        { id: 1, name: '', desc: '', qty: 1, price: 0, tax: 18, isCustomTax: false, discount: 0 }
    ]);
    const [showPrice, setShowPrice] = useState(true);

    // Handlers
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // If vendor is changed, update selectedVendor and auto-populate fields
        if (field === 'vendor') {
            const vendor = availableVendors.find(v => (v.vendorId || v._id) === value);
            setSelectedVendor(vendor || null);

            if (vendor) {
                // Map vendor data to form fields
                const fullAddress = vendor.address
                    ? `${vendor.address.street}, ${vendor.address.state} - ${vendor.address.zip}`
                    : '';

                setFormData(prev => ({
                    ...prev,
                    vendor: value,
                    vendorName: vendor.name,
                    vendorAddress: fullAddress,
                    vendorContact: vendor.phone || '',
                    vendorEmail: vendor.email || '',
                    vendorGSTIN: vendor.tax?.gst || ''
                }));
            } else {
                // Clear vendor fields if no vendor selected
                setFormData(prev => ({
                    ...prev,
                    vendor: '',
                    vendorName: '',
                    vendorAddress: '',
                    vendorContact: '',
                    vendorEmail: '',
                    vendorGSTIN: ''
                }));
            }
        }
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

    // Handle Component Selection
    const handleComponentSelect = (id, selectedValue) => {
        // Parsing "Name - Code" format or just "Name"
        const component = availableComponents.find(c =>
            `${c.name} - ${c.code}` === selectedValue || c.name === selectedValue
        );

        if (component) {
            setItems(items.map(item =>
                item.id === id ? {
                    ...item,
                    name: component.name, // Set just the name
                    desc: `ID: ${component.code || 'N/A'}`,
                    price: component.unitPrice || 0,
                    tax: component.gstRate || 18
                } : item
            ));
        } else {
            // Fallback just update name
            updateItem(id, 'name', selectedValue);
        }
    };

    // Calculations
    const calculateTotals = () => {
        if (!showPrice) return { subtotal: 0, taxTotal: 0, grandTotal: 0 };

        let subtotal = 0;
        let taxTotal = 0;

        items.forEach(item => {
            const lineTotal = item.qty * item.price;
            // Discount logic removed as requested "never needed"
            // const discountAmt = showDiscount ? lineTotal * (item.discount / 100) : 0;
            const taxableAmt = lineTotal;
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
                    // If showPrice is false, we send 0 for price/total
                    const price = showPrice ? (item.price || 0) : 0;
                    const taxRate = showPrice ? (item.tax || 0) : 0;

                    const lineTotal = (item.qty || 0) * price;
                    const total = lineTotal * (1 + taxRate / 100);

                    // Try to find component code from description if possible or fallback
                    const codeMatch = item.desc && item.desc.match(/ID: ([A-Z0-9-]+)/);
                    const componentCode = codeMatch ? codeMatch[1] : 'N/A';

                    return {
                        componentName: item.name || 'Unknown Item',
                        componentCode: componentCode,
                        qty: item.qty || 0,
                        unit: 'pcs',
                        unitPrice: price,
                        discount: 0, // Discount removed
                        total: total
                    };
                }),
                subtotal: totals.subtotal,
                gst: totals.taxTotal,
                totalAmount: totals.grandTotal
            };

            // ... (rest of function same)
            // Need to include validation and api call here or rely on context if I replace less lines.
            // But I'm replacing a huge chunk.

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
        <div className="p-4 max-w-6xl mx-auto min-h-screen pb-20">

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
                    <input
                        type="text"
                        value={formData.poNumber}
                        onChange={(e) => handleInputChange('poNumber', e.target.value)}
                        className="text-slate-600 text-sm bg-transparent border-b border-dashed border-slate-300 focus:border-blue-500 outline-none px-1"
                    />
                </div>
            </div>

            {/* Invoice Paper Layout */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

                {/* Enhanced Vendor, Billing & Shipping Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 border-b border-slate-100 bg-slate-50/50 items-stretch">

                    {/* Vendor Details */}
                    <div className="flex flex-col">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Vendor Details</h3>
                        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex-1">
                            <select
                                value={formData.vendor}
                                onChange={(e) => handleInputChange('vendor', e.target.value)}
                                className="w-full bg-transparent outline-none font-medium text-slate-900 mb-3 cursor-pointer border-b border-slate-200 pb-2"
                            >
                                <option value="">Select Vendor...</option>
                                {availableVendors.map(vendor => (
                                    <option key={vendor.vendorId || vendor._id} value={vendor.vendorId || vendor._id}>{vendor.name}</option>
                                ))}
                            </select>

                            <div className="text-xs space-y-2 pt-3">
                                <div>
                                    <label className="text-slate-400 block mb-1">Address</label>
                                    <textarea
                                        value={formData.vendorAddress}
                                        onChange={(e) => handleInputChange('vendorAddress', e.target.value)}
                                        placeholder="Vendor address..."
                                        className="w-full text-slate-700 bg-slate-50 border border-slate-200 rounded p-2 resize-none outline-none focus:border-blue-400 min-h-[60px] overflow-hidden"
                                        style={{ height: 'auto' }}
                                        onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="text-slate-400 block mb-1">Contact</label>
                                    <input
                                        type="text"
                                        value={formData.vendorContact}
                                        onChange={(e) => handleInputChange('vendorContact', e.target.value)}
                                        placeholder="+91 XXXXX XXXXX"
                                        className="w-full text-slate-700 bg-slate-50 border border-slate-200 rounded p-2 outline-none focus:border-blue-400"
                                    />
                                </div>
                                <div>
                                    <label className="text-slate-400 block mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={formData.vendorEmail}
                                        onChange={(e) => handleInputChange('vendorEmail', e.target.value)}
                                        placeholder="vendor@example.com"
                                        className="w-full text-slate-700 bg-slate-50 border border-slate-200 rounded p-2 outline-none focus:border-blue-400"
                                    />
                                </div>
                                <div className="pt-2">
                                    <label className="text-slate-400 block mb-1">GSTIN</label>
                                    <input
                                        type="text"
                                        value={formData.vendorGSTIN}
                                        onChange={(e) => handleInputChange('vendorGSTIN', e.target.value)}
                                        placeholder="00AAAAA0000A0Z0"
                                        className="w-full text-blue-600 font-mono bg-slate-50 border border-slate-200 rounded p-2 outline-none focus:border-blue-400"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Billing Details (SMG) */}
                    <div className="flex flex-col">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Billing Details</h3>
                        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex-1">
                            <div className="flex justify-between items-start mb-3">
                                <input
                                    type="text"
                                    value={formData.billingName}
                                    onChange={(e) => handleInputChange('billingName', e.target.value)}
                                    className="flex-1 font-medium text-slate-900 bg-transparent border-b border-slate-200 pb-1 outline-none focus:border-blue-400"
                                />
                                <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded ml-2">Buyer</span>
                            </div>
                            <div className="text-xs space-y-2">
                                <div>
                                    <label className="text-slate-400 block mb-1">Address</label>
                                    <textarea
                                        value={formData.billingAddress}
                                        onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                                        className="w-full text-slate-700 bg-slate-50 border border-slate-200 rounded p-2 resize-none outline-none focus:border-blue-400 min-h-[60px] overflow-hidden"
                                        style={{ height: 'auto' }}
                                        onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="text-slate-400 block mb-1">Contact</label>
                                    <input
                                        type="text"
                                        value={formData.billingContact}
                                        onChange={(e) => handleInputChange('billingContact', e.target.value)}
                                        className="w-full text-slate-700 bg-slate-50 border border-slate-200 rounded p-2 outline-none focus:border-blue-400"
                                    />
                                </div>
                                <div>
                                    <label className="text-slate-400 block mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={formData.billingEmail}
                                        onChange={(e) => handleInputChange('billingEmail', e.target.value)}
                                        className="w-full text-slate-700 bg-slate-50 border border-slate-200 rounded p-2 outline-none focus:border-blue-400"
                                    />
                                </div>
                                <div className="pt-2">
                                    <label className="text-slate-400 block mb-1">GSTIN</label>
                                    <input
                                        type="text"
                                        value={formData.billingGSTIN}
                                        onChange={(e) => handleInputChange('billingGSTIN', e.target.value)}
                                        className="w-full text-blue-600 font-mono bg-slate-50 border border-slate-200 rounded p-2 outline-none focus:border-blue-400"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Details */}
                    <div className="flex flex-col">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Shipping Details</h3>
                        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex-1">
                            <div className="flex justify-between mb-2">
                                <p className="font-medium text-slate-900">SMG Electric Scooters</p>
                                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">Plant 1</span>
                            </div>
                            <div className="mb-3">
                                <label className="text-xs text-slate-400 block mb-1">Delivery Address</label>
                                <textarea
                                    value={formData.deliveryAddress}
                                    onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded p-2 resize-none"
                                    rows="2"
                                />
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1">Expected Delivery</label>
                                    <input
                                        type="date"
                                        value={formData.expectedDate}
                                        onChange={(e) => handleInputChange('expectedDate', e.target.value)}
                                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded p-2"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1">Shipping Mode</label>
                                    <select
                                        value={formData.shippingMode}
                                        onChange={(e) => handleInputChange('shippingMode', e.target.value)}
                                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded p-2"
                                    >
                                        <option value="By Road">By Road</option>
                                        <option value="Courier">Courier</option>
                                        <option value="By Air">By Air</option>
                                        <option value="By Rail">By Rail</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Line Items Grid */}
                <div className="p-6">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Item Details</h3>

                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                                <th className="py-2 w-10">#</th>
                                <th className="py-2">Item Name & ID</th>

                                {/* QTY when price is enabled - between Item Name and Unit Price */}
                                <th className={`transition-all duration-400 ease-out transform-gpu overflow-hidden whitespace-nowrap text-center ${showPrice ? 'w-32 py-2 opacity-100' : 'w-0 p-0 opacity-0 border-none'}`}>Qty</th>

                                {/* Animated Headers */}
                                <th className={`transition-all duration-400 ease-out transform-gpu overflow-hidden whitespace-nowrap ${showPrice ? 'w-32 py-2 opacity-100' : 'w-0 p-0 opacity-0 border-none'}`}>Unit Price</th>
                                <th className={`transition-all duration-400 ease-out transform-gpu overflow-hidden whitespace-nowrap ${showPrice ? 'w-24 py-2 opacity-100' : 'w-0 p-0 opacity-0 border-none'}`}>Tax %</th>
                                <th className={`transition-all duration-400 ease-out transform-gpu overflow-hidden whitespace-nowrap text-right ${showPrice ? 'w-32 py-2 opacity-100' : 'w-0 p-0 opacity-0 border-none'}`}>Total</th>

                                {/* QTY when price is disabled - at the far right */}
                                <th className={`transition-all duration-400 ease-out transform-gpu overflow-hidden whitespace-nowrap text-right ${showPrice ? 'w-0 p-0 opacity-0 border-none' : 'w-32 py-2 opacity-100'}`}>Qty</th>
                                <th className="py-2 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {items.map((item, index) => (
                                <tr key={item.id} className="group">
                                    <td className="py-4 text-slate-400 text-sm align-top pt-5">{index + 1}</td>
                                    <td className="py-4 align-top">
                                        <AutocompleteInput
                                            value={item.name}
                                            onChange={(value) => updateItem(item.id, 'name', value)}
                                            onSelect={(value) => handleComponentSelect(item.id, value)}
                                            options={availableComponents.map(c => `${c.name} - ${c.code}`)} // Show Name - ID
                                            placeholder="Item Name (e.g. Seat Assy)"
                                            className="mb-1"
                                        />
                                        <textarea
                                            placeholder="Component ID / Specs..."
                                            value={item.desc}
                                            onChange={(e) => updateItem(item.id, 'desc', e.target.value)}
                                            className="w-full text-sm text-slate-500 outline-none placeholder:text-slate-300 resize-none h-10"
                                        ></textarea>
                                    </td>

                                    {/* QTY when price is enabled - between Item Name and Unit Price */}
                                    <td className={`align-top text-center transition-all duration-400 ease-out transform-gpu overflow-hidden ${showPrice ? 'py-4 opacity-100' : 'p-0 w-0 opacity-0 border-none scale-0'}`}>
                                        <input
                                            type="number"
                                            className="w-20 p-2 border border-slate-200 rounded text-center"
                                            value={item.qty}
                                            onChange={(e) => updateItem(item.id, 'qty', parseInt(e.target.value) || 0)}
                                        />
                                    </td>

                                    {/* Animated Price Columns */}
                                    <td className={`align-top transition-all duration-400 ease-out transform-gpu overflow-hidden ${showPrice ? 'py-4 opacity-100' : 'p-0 w-0 opacity-0 border-none scale-0'}`}>
                                        <div className={`relative ${showPrice ? 'w-auto' : 'w-0'}`}>
                                            <span className="absolute left-2 top-2 text-slate-400 text-sm">₹</span>
                                            <input
                                                type="number"
                                                className="w-28 pl-6 p-2 border border-slate-200 rounded text-right"
                                                value={item.price}
                                                onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                                            />
                                        </div>
                                    </td>
                                    <td className={`align-top transition-all duration-400 ease-out transform-gpu overflow-hidden ${showPrice ? 'py-4 opacity-100' : 'p-0 w-0 opacity-0 border-none scale-0'}`}>
                                        <div className={showPrice ? 'w-auto' : 'w-0'}>
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
                                                            setItems(prevItems => prevItems.map(i => i.id === item.id ? { ...i, isCustomTax: true, tax: 0 } : i));
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
                                        </div>
                                    </td>
                                    <td className={`align-top text-right font-mono text-slate-700 pt-5 transition-all duration-400 ease-out transform-gpu overflow-hidden whitespace-nowrap ${showPrice ? 'py-4 opacity-100' : 'p-0 w-0 opacity-0 border-none scale-0'}`}>
                                        <div className={showPrice ? 'block' : 'hidden'}>
                                            ₹ {((item.qty * item.price) * (1 + item.tax / 100)).toFixed(2)}
                                        </div>
                                    </td>

                                    {/* QTY when price is disabled - at the far right */}
                                    <td className={`align-top text-right transition-all duration-400 ease-out transform-gpu overflow-hidden ${showPrice ? 'p-0 w-0 opacity-0 border-none scale-0' : 'py-4 opacity-100'}`}>
                                        <input
                                            type="number"
                                            className="w-20 p-2 border border-slate-200 rounded text-center"
                                            value={item.qty}
                                            onChange={(e) => updateItem(item.id, 'qty', parseInt(e.target.value) || 0)}
                                        />
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
                            <label className="text-xs text-slate-400 font-medium">Enable Price & Tax Columns</label>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={showPrice}
                                    onChange={() => setShowPrice(!showPrice)}
                                    className="sr-only peer"
                                />
                                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-400"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Footer Totals */}
                {/* Animated Footer */}
                <div className="bg-slate-50 p-6 border-t border-slate-200 flex flex-col md:flex-row justify-between items-end transition-all duration-400 ease-out transform-gpu">

                    {/* Terms & Conditions - Expands when totals hidden */}
                    <div className={`transition-all duration-400 ease-out transform-gpu ${showPrice ? 'w-full md:w-1/2' : 'w-full'}`}>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Terms & Conditions</label>
                        <textarea
                            value={formData.termsAndConditions}
                            onChange={(e) => handleInputChange('termsAndConditions', e.target.value)}
                            className="w-full h-24 p-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 outline-none resize-none transition-all duration-400 ease-out transform-gpu"
                        ></textarea>
                    </div>

                    {/* Totals - Slides/Fades in/out */}
                    <div className={`space-y-3 transition-all duration-400 ease-out transform-gpu overflow-hidden ${showPrice
                        ? 'w-full md:w-80 opacity-100 translate-x-0 pl-6'
                        : 'w-0 h-0 md:h-auto opacity-0 translate-x-10 pl-0 border-none'
                        }`}>
                        <div className="flex justify-between text-sm text-slate-600 whitespace-nowrap">
                            <span>Subtotal</span>
                            <span className="font-mono">₹ {totals.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-600 whitespace-nowrap">
                            <span>Tax (GST)</span>
                            <span className="font-mono">₹ {totals.taxTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-slate-900 border-t border-slate-300 pt-3 whitespace-nowrap">
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
                        <button
                            onClick={() => printPurchaseOrder(formData, items, showPrice)}
                            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                        >
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
