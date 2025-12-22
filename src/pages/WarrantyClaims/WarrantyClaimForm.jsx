import React, { useState } from 'react';
import { Calendar, Upload, Package, AlertCircle, CheckCircle, Clock, FileText, Camera, MapPin, User, Phone, Mail, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';

const WarrantyClaimForm = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        // Claim Information
        claimType: 'Component Failure',
        claimDate: new Date().toISOString().split('T')[0],

        // Product Information
        vehicleModel: '',
        chassisNumber: '',
        engineNumber: '',
        registrationNumber: '',
        manufacturingDate: '',
        purchaseDate: '',
        currentMileage: '',

        // Failed Component Details
        componentName: '',
        componentPartNumber: '',
        componentSerialNumber: '',
        failureDate: '',
        failureDescription: '',
        failureType: 'Manufacturing Defect',

        // Customer Information
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        customerAddress: '',

        // Dealer/Service Center Information
        dealerName: '',
        dealerCode: '',
        dealerLocation: '',
        serviceAdvisorName: '',
        serviceAdvisorPhone: '',

        // Pickup Details
        pickupRequired: true,
        pickupAddress: '',
        preferredPickupDate: '',
        pickupInstructions: '',

        // Additional Details
        workOrderNumber: '',
        defectCode: '',
        laborHours: '',
        laborCost: '',
        partsCost: '',
        totalClaimAmount: '',
        remarks: ''
    });

    const [attachments, setAttachments] = useState({
        failedPartPhotos: [],
        warrantyCard: null,
        purchaseInvoice: null,
        failureReport: null,
        diagnosticReport: null
    });

    const claimTypes = [
        'Component Failure',
        'Manufacturing Defect',
        'Premature Wear',
        'Performance Issue',
        'Safety Concern',
        'Other'
    ];

    const failureTypes = [
        'Manufacturing Defect',
        'Material Defect',
        'Assembly Issue',
        'Design Flaw',
        'Premature Wear',
        'Corrosion',
        'Electrical Failure',
        'Mechanical Failure',
        'Other'
    ];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileUpload = (category, files) => {
        setAttachments(prev => ({
            ...prev,
            [category]: category === 'failedPartPhotos' ? [...prev[category], ...Array.from(files)] : files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.componentName || !formData.failureDescription) {
            toast.error('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            // TODO: Integrate with backend API
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call

            toast.success('Warranty claim submitted successfully!');
            navigate('/warranty-claims');
        } catch (error) {
            toast.error('Failed to submit warranty claim');
            console.error(error);
        }
        setLoading(false);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">New Warranty Claim</h1>
                    <p className="text-slate-600 mt-1">File a warranty claim for defective components</p>
                </div>
                <button
                    onClick={() => navigate('/warranty-claims')}
                    className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
                >
                    <ArrowLeft size={18} />
                    Back to Claims
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Claim Information */}
                <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg shadow-slate-200/50 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-red-600 rounded-lg">
                            <FileText size={20} className="text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Claim Information</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                                Claim Type *
                            </label>
                            <select
                                name="claimType"
                                value={formData.claimType}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
                            >
                                {claimTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                                Claim Date *
                            </label>
                            <input
                                type="date"
                                name="claimDate"
                                value={formData.claimDate}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                                Work Order Number
                            </label>
                            <input
                                type="text"
                                name="workOrderNumber"
                                value={formData.workOrderNumber}
                                onChange={handleInputChange}
                                placeholder="WO-2024-XXX"
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                                Defect Code
                            </label>
                            <input
                                type="text"
                                name="defectCode"
                                value={formData.defectCode}
                                onChange={handleInputChange}
                                placeholder="DEF-XXX"
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Vehicle/Product Information */}
                <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg shadow-slate-200/50 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-600 rounded-lg">
                            <Package size={20} className="text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Vehicle/Product Information</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                                Vehicle Model *
                            </label>
                            <input
                                type="text"
                                name="vehicleModel"
                                value={formData.vehicleModel}
                                onChange={handleInputChange}
                                placeholder="e.g., E-Scooter X1"
                                required
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                                Chassis Number *
                            </label>
                            <input
                                type="text"
                                name="chassisNumber"
                                value={formData.chassisNumber}
                                onChange={handleInputChange}
                                placeholder="CH12345678"
                                required
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                                Engine Number
                            </label>
                            <input
                                type="text"
                                name="engineNumber"
                                value={formData.engineNumber}
                                onChange={handleInputChange}
                                placeholder="EN12345678"
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                                Registration Number
                            </label>
                            <input
                                type="text"
                                name="registrationNumber"
                                value={formData.registrationNumber}
                                onChange={handleInputChange}
                                placeholder="XX00XX0000"
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                                Manufacturing Date *
                            </label>
                            <input
                                type="date"
                                name="manufacturingDate"
                                value={formData.manufacturingDate}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                                Purchase/Sale Date *
                            </label>
                            <input
                                type="date"
                                name="purchaseDate"
                                value={formData.purchaseDate}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                            />
                        </div>

                        <div className="md:col-span-2 lg:col-span-1">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                                Current Mileage/Usage (km)
                            </label>
                            <input
                                type="number"
                                name="currentMileage"
                                value={formData.currentMileage}
                                onChange={handleInputChange}
                                placeholder="e.g., 5000"
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Failed Component Details */}
                <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg shadow-slate-200/50 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-amber-600 rounded-lg">
                            <AlertCircle size={20} className="text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Failed Component Details</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                                Component Name *
                            </label>
                            <input
                                type="text"
                                name="componentName"
                                value={formData.componentName}
                                onChange={handleInputChange}
                                placeholder="e.g., Battery Pack, Motor Controller"
                                required
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                                Part Number *
                            </label>
                            <input
                                type="text"
                                name="componentPartNumber"
                                value={formData.componentPartNumber}
                                onChange={handleInputChange}
                                placeholder="PN-XXXXX"
                                required
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                                Serial Number
                            </label>
                            <input
                                type="text"
                                name="componentSerialNumber"
                                value={formData.componentSerialNumber}
                                onChange={handleInputChange}
                                placeholder="SN-XXXXX"
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                                Failure Date *
                            </label>
                            <input
                                type="date"
                                name="failureDate"
                                value={formData.failureDate}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                                Failure Type *
                            </label>
                            <select
                                name="failureType"
                                value={formData.failureType}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none"
                            >
                                {failureTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                                Failure Description *
                            </label>
                            <textarea
                                name="failureDescription"
                                value={formData.failureDescription}
                                onChange={handleInputChange}
                                placeholder="Provide detailed description of the failure, symptoms, and any relevant observations..."
                                required
                                rows={4}
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Customer Information */}
                <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg shadow-slate-200/50 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-600 rounded-lg">
                            <User size={20} className="text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Customer Information</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                                Customer Name *
                            </label>
                            <input
                                type="text"
                                name="customerName"
                                value={formData.customerName}
                                onChange={handleInputChange}
                                placeholder="Full Name"
                                required
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                name="customerPhone"
                                value={formData.customerPhone}
                                onChange={handleInputChange}
                                placeholder="+91 XXXXX XXXXX"
                                required
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="customerEmail"
                                value={formData.customerEmail}
                                onChange={handleInputChange}
                                placeholder="customer@example.com"
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                                Address
                            </label>
                            <input
                                type="text"
                                name="customerAddress"
                                value={formData.customerAddress}
                                onChange={handleInputChange}
                                placeholder="Complete address"
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Dealer/Service Center (truncated for length - continues in next message) */}
                {/* ... Rest of the form continues ... */}

                {/* Submit Button */}
                <div className="flex items-center justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/warranty-claims')}
                        className="px-6 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all font-semibold"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all text-sm font-bold shadow-md shadow-red-200 hover:shadow-lg hover:shadow-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <CheckCircle size={18} />
                        {loading ? 'Submitting Claim...' : 'Submit Warranty Claim'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default WarrantyClaimForm;
