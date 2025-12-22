import React, { useState, useEffect } from 'react';
import { X, Upload, Plus, Trash2 } from 'lucide-react';
import { paymentService } from '../../services/paymentService';
import './CreatePaymentModal.css';

export default function CreatePaymentModal({ isOpen, onClose, onSuccess, vendors = [] }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        vendor: '',
        invoiceNumber: '',
        invoiceDate: '',
        invoiceAmount: '',
        paymentAmount: '',
        tdsAmount: '',
        otherDeductions: '',
        paymentType: 'against-invoice',
        dueDate: '',
        paymentMode: 'RTGS',
        bankDetails: {
            accountNumber: '',
            ifscCode: '',
            bankName: '',
            branch: ''
        },
        remarks: '',
        sendRequest: false // New field for sending payment request
    });

    useEffect(() => {
        // Auto-calculate TDS (2% of payment amount)
        if (formData.paymentAmount) {
            const tds = (parseFloat(formData.paymentAmount) * 0.02).toFixed(2);
            setFormData(prev => ({ ...prev, tdsAmount: tds }));
        }
    }, [formData.paymentAmount]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Handle nested bank details
        if (name.startsWith('bank.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                bankDetails: {
                    ...prev.bankDetails,
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const calculateNetPayable = () => {
        const payment = parseFloat(formData.paymentAmount) || 0;
        const tds = parseFloat(formData.tdsAmount) || 0;
        const deductions = parseFloat(formData.otherDeductions) || 0;
        return payment - tds - deductions;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            // Calculate net payable
            const netPayable = calculateNetPayable();

            // Prepare payment data
            const paymentData = {
                ...formData,
                invoiceAmount: parseFloat(formData.invoiceAmount),
                paymentAmount: parseFloat(formData.paymentAmount),
                tdsAmount: parseFloat(formData.tdsAmount) || 0,
                otherDeductions: parseFloat(formData.otherDeductions) || 0,
                netPayableAmount: netPayable // Add calculated net payable
            };

            console.log('Creating payment with data:', paymentData);

            // Create payment
            const response = await paymentService.createPayment(paymentData);

            // Send payment request if checkbox is checked
            if (formData.sendRequest && response.payment?._id) {
                await paymentService.sendPaymentRequest(response.payment._id);
            }

            onSuccess(response.payment);
            onClose();
            resetForm();
        } catch (error) {
            console.error('Payment creation error:', error);
            alert(`Failed to create payment: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            vendor: '',
            invoiceNumber: '',
            invoiceDate: '',
            invoiceAmount: '',
            paymentAmount: '',
            tdsAmount: '',
            otherDeductions: '',
            paymentType: 'against-invoice',
            dueDate: '',
            paymentMode: 'RTGS',
            bankDetails: {
                accountNumber: '',
                ifscCode: '',
                bankName: '',
                branch: ''
            },
            remarks: '',
            sendRequest: false
        });
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2>Create New Payment</h2>
                    <button onClick={onClose} className="close-btn">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="payment-form">
                    <div className="form-grid">
                        {/* Vendor Selection */}
                        <div className="form-group full-width">
                            <label>Vendor *</label>
                            <select
                                name="vendor"
                                value={formData.vendor}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Vendor</option>
                                {vendors.map(vendor => (
                                    <option key={vendor._id} value={vendor._id}>
                                        {vendor.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Invoice Details */}
                        <div className="form-group">
                            <label>Invoice Number *</label>
                            <input
                                type="text"
                                name="invoiceNumber"
                                value={formData.invoiceNumber}
                                onChange={handleChange}
                                placeholder="INV-2025-001"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Invoice Date *</label>
                            <input
                                type="date"
                                name="invoiceDate"
                                value={formData.invoiceDate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Amounts */}
                        <div className="form-group">
                            <label>Invoice Amount *</label>
                            <input
                                type="number"
                                name="invoiceAmount"
                                value={formData.invoiceAmount}
                                onChange={handleChange}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Payment Amount *</label>
                            <input
                                type="number"
                                name="paymentAmount"
                                value={formData.paymentAmount}
                                onChange={handleChange}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>TDS Amount (2%)</label>
                            <input
                                type="number"
                                name="tdsAmount"
                                value={formData.tdsAmount}
                                onChange={handleChange}
                                placeholder="Auto-calculated"
                                min="0"
                                step="0.01"
                                readOnly
                                disabled
                            />
                        </div>

                        <div className="form-group">
                            <label>Other Deductions</label>
                            <input
                                type="number"
                                name="otherDeductions"
                                value={formData.otherDeductions}
                                onChange={handleChange}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                            />
                        </div>

                        {/* Net Payable (Calculated) */}
                        <div className="form-group highlighted">
                            <label>Net Payable Amount</label>
                            <div className="calculated-value">
                                ₹{calculateNetPayable().toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </div>
                        </div>

                        {/* Payment Type */}
                        <div className="form-group">
                            <label>Payment Type *</label>
                            <select
                                name="paymentType"
                                value={formData.paymentType}
                                onChange={handleChange}
                                required
                            >
                                <option value="advance">Advance</option>
                                <option value="against-invoice">Against Invoice</option>
                                <option value="partial">Partial</option>
                                <option value="final-settlement">Final Settlement</option>
                            </select>
                        </div>

                        {/* Due Date */}
                        <div className="form-group">
                            <label>Due Date *</label>
                            <input
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Payment Mode</label>
                            <select
                                name="paymentMode"
                                value={formData.paymentMode}
                                onChange={handleChange}
                            >
                                <option value="RTGS">RTGS</option>
                                <option value="NEFT">NEFT</option>
                                <option value="UPI">UPI</option>
                                <option value="Cheque">Cheque</option>
                                <option value="Cash">Cash</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    {/* Bank Details Section */}
                    <div className="section-divider">Bank Details (Optional)</div>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Account Number</label>
                            <input
                                type="text"
                                name="bank.accountNumber"
                                value={formData.bankDetails.accountNumber}
                                onChange={handleChange}
                                placeholder="1234567890"
                            />
                        </div>

                        <div className="form-group">
                            <label>IFSC Code</label>
                            <input
                                type="text"
                                name="bank.ifscCode"
                                value={formData.bankDetails.ifscCode}
                                onChange={handleChange}
                                placeholder="SBIN0001234"
                            />
                        </div>

                        <div className="form-group">
                            <label>Bank Name</label>
                            <input
                                type="text"
                                name="bank.bankName"
                                value={formData.bankDetails.bankName}
                                onChange={handleChange}
                                placeholder="State Bank of India"
                            />
                        </div>

                        <div className="form-group">
                            <label>Branch</label>
                            <input
                                type="text"
                                name="bank.branch"
                                value={formData.bankDetails.branch}
                                onChange={handleChange}
                                placeholder="Main Branch"
                            />
                        </div>
                    </div>

                    {/* Remarks */}
                    <div className="form-group full-width">
                        <label>Remarks</label>
                        <textarea
                            name="remarks"
                            value={formData.remarks}
                            onChange={handleChange}
                            placeholder="Add any additional notes..."
                            rows="3"
                        />
                    </div>

                    {/* Send Payment Request Checkbox */}
                    <div className="form-group full-width checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="sendRequest"
                                checked={formData.sendRequest}
                                onChange={handleChange}
                            />
                            <span>📧 Send payment request notification to vendor after creation</span>
                        </label>
                    </div>

                    {/* Submit Buttons */}
                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create Payment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
