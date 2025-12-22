import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Package, User, Building2, MapPin, Phone, Mail, FileText, AlertCircle, CheckCircle, Clock, XCircle, Download, Edit } from 'lucide-react';

const WarrantyClaimDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock data - would be fetched from API
    const claim = {
        id: id || 'WC-2024-001',
        claimDate: '2024-12-15',
        claimType: 'Component Failure',
        workOrderNumber: 'WO-2024-1234',
        defectCode: 'DEF-BAT-001',

        // Vehicle Information
        vehicleModel: 'E-Scooter X1',
        chassisNumber: 'CH12345678',
        engineNumber: 'EN87654321',
        registrationNumber: 'DL01AB1234',
        manufacturingDate: '2024-01-15',
        purchaseDate: '2024-02-10',
        currentMileage: '5420',

        // Component Details
        componentName: 'Battery Pack',
        partNumber: 'BP-48V-30AH',
        serialNumber: 'SN-BAT-9876543',
        failureDate: '2024-12-10',
        failureType: 'Manufacturing Defect',
        failureDescription: 'Battery pack showing sudden voltage drop after 5000km usage. Customer reported complete shutdown during regular use. Diagnostics reveal cell imbalance and premature degradation of battery cells, likely due to manufacturing defect in cell quality control.',

        // Customer Information
        customerName: 'Rajesh Kumar',
        customerPhone: '+91 98765 43210',
        customerEmail: 'rajesh.kumar@example.com',
        customerAddress: '123, Green Park, New Delhi - 110016',

        // Dealer Information
        dealerName: 'Delhi Motors',
        dealerCode: 'DLR-DL-001',
        dealerLocation: 'Delhi, India',
        serviceAdvisorName: 'Amit Sharma',
        serviceAdvisorPhone: '+91 98123 45678',

        // Cost Details
        laborHours: '2.5',
        laborCost: '₹1,500',
        partsCost: '₹23,500',
        totalClaimAmount: '₹25,000',

        // Status & Dates
        status: 'Pending',
        submittedDate: '2024-12-15',
        reviewedDate: null,
        approvedDate: null,
        pickupScheduled: '2024-12-20',
        warrantyStatus: 'In Warranty',

        // Additional
        remarks: 'Customer has maintained regular service records. Vehicle usage is within normal parameters.',
        attachments: [
            { name: 'Failed Part Photo 1.jpg', size: '2.4 MB' },
            { name: 'Failed Part Photo 2.jpg', size: '1.8 MB' },
            { name: 'Warranty Card.pdf', size: '456 KB' },
            { name: 'Diagnostic Report.pdf', size: '890 KB' }
        ]
    };

    const statusConfig = {
        'Pending': { color: 'amber', icon: Clock, label: 'Pending Review' },
        'Under Review': { color: 'blue', icon: AlertCircle, label: 'Under Review' },
        'Approved': { color: 'emerald', icon: CheckCircle, label: 'Approved' },
        'Rejected': { color: 'red', icon: XCircle, label: 'Rejected' },
        'Pending Pickup': { color: 'purple', icon: AlertCircle, label: 'Pending Pickup' }
    };

    const StatusIcon = statusConfig[claim.status].icon;
    const statusColor = statusConfig[claim.status].color;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <button
                        onClick={() => navigate('/warranty-claims')}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-all"
                    >
                        <ArrowLeft size={18} />
                        Back to Claims
                    </button>
                    <h1 className="text-3xl font-bold text-slate-900">Warranty Claim Details</h1>
                    <p className="text-slate-600 mt-1">Claim ID: {claim.id}</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(`/warranty-claims/${id}/edit`)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg transition-all font-semibold"
                    >
                        <Edit size={16} />
                        Edit Claim
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-all font-semibold">
                        <Download size={16} />
                        Download PDF
                    </button>
                </div>
            </div>

            {/* Status Badge */}
            <div className="mb-6">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-${statusColor}-100 text-${statusColor}-700`}>
                    <StatusIcon size={18} />
                    {statusConfig[claim.status].label}
                </span>
                <span className="ml-4 text-sm text-slate-600">
                    Submitted on {new Date(claim.submittedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Claim Information */}
                    <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg shadow-slate-200/50 p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <FileText size={20} className="text-red-600" />
                            Claim Information
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Claim Type</p>
                                <p className="text-sm text-slate-900">{claim.claimType}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Claim Date</p>
                                <p className="text-sm text-slate-900">{new Date(claim.claimDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Work Order #</p>
                                <p className="text-sm text-slate-900">{claim.workOrderNumber}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Defect Code</p>
                                <p className="text-sm text-slate-900">{claim.defectCode}</p>
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Information */}
                    <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg shadow-slate-200/50 p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Package size={20} className="text-blue-600" />
                            Vehicle Information
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Vehicle Model</p>
                                <p className="text-sm text-slate-900">{claim.vehicleModel}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Chassis Number</p>
                                <p className="text-sm text-slate-900">{claim.chassisNumber}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Engine Number</p>
                                <p className="text-sm text-slate-900">{claim.engineNumber}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Registration</p>
                                <p className="text-sm text-slate-900">{claim.registrationNumber}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Manufacturing Date</p>
                                <p className="text-sm text-slate-900">{new Date(claim.manufacturingDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Purchase Date</p>
                                <p className="text-sm text-slate-900">{new Date(claim.purchaseDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Current Mileage</p>
                                <p className="text-sm text-slate-900">{claim.currentMileage} km</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Warranty Status</p>
                                <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                                    {claim.warrantyStatus}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Failed Component Details */}
                    <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg shadow-slate-200/50 p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <AlertCircle size={20} className="text-amber-600" />
                            Failed Component Details
                        </h2>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Component Name</p>
                                <p className="text-sm text-slate-900 font-semibold">{claim.componentName}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Part Number</p>
                                <p className="text-sm text-slate-900">{claim.partNumber}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Serial Number</p>
                                <p className="text-sm text-slate-900">{claim.serialNumber}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Failure Date</p>
                                <p className="text-sm text-slate-900">{new Date(claim.failureDate).toLocaleDateString()}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Failure Type</p>
                                <p className="text-sm text-slate-900">{claim.failureType}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase mb-2">Failure Description</p>
                            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg">
                                {claim.failureDescription}
                            </p>
                        </div>
                    </div>

                    {/* Attachments */}
                    <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg shadow-slate-200/50 p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Attachments</h2>
                        <div className="space-y-2">
                            {claim.attachments.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all">
                                    <div className="flex items-center gap-3">
                                        <FileText size={20} className="text-blue-600" />
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">{file.name}</p>
                                            <p className="text-xs text-slate-500">{file.size}</p>
                                        </div>
                                    </div>
                                    <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
                                        Download
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Cost Summary */}
                    <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg shadow-slate-200/50 p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Cost Summary</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-slate-600">Labor ({claim.laborHours} hours)</span>
                                <span className="text-sm font-semibold text-slate-900">{claim.laborCost}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-slate-600">Parts Cost</span>
                                <span className="text-sm font-semibold text-slate-900">{claim.partsCost}</span>
                            </div>
                            <div className="border-t-2 border-slate-200 pt-3 mt-3">
                                <div className="flex justify-between">
                                    <span className="text-base font-bold text-slate-900">Total Claim Amount</span>
                                    <span className="text-lg font-bold text-blue-600">{claim.totalClaimAmount}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Customer Information */}
                    <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg shadow-slate-200/50 p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <User size={20} className="text-purple-600" />
                            Customer
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Name</p>
                                <p className="text-sm text-slate-900">{claim.customerName}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Phone</p>
                                <p className="text-sm text-slate-900 flex items-center gap-2">
                                    <Phone size={14} />
                                    {claim.customerPhone}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Email</p>
                                <p className="text-sm text-slate-900 flex items-center gap-2">
                                    <Mail size={14} />
                                    {claim.customerEmail}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Address</p>
                                <p className="text-sm text-slate-900 flex items-start gap-2">
                                    <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                                    {claim.customerAddress}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Dealer Information */}
                    <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg shadow-slate-200/50 p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Building2 size={20} className="text-indigo-600" />
                            Dealer/Service Center
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Dealer Name</p>
                                <p className="text-sm text-slate-900">{claim.dealerName}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Dealer Code</p>
                                <p className="text-sm text-slate-900">{claim.dealerCode}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Location</p>
                                <p className="text-sm text-slate-900">{claim.dealerLocation}</p>
                            </div>
                            <div className="border-t border-slate-200 pt-3 mt-3">
                                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Service Advisor</p>
                                <p className="text-sm text-slate-900">{claim.serviceAdvisorName}</p>
                                <p className="text-sm text-slate-600 mt-1">{claim.serviceAdvisorPhone}</p>
                            </div>
                        </div>
                    </div>

                    {/* Pickup Details */}
                    {claim.pickupScheduled && (
                        <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg shadow-slate-200/50 p-6">
                            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Calendar size={20} className="text-green-600" />
                                Pickup Scheduled
                            </h2>
                            <p className="text-sm text-slate-900 font-semibold">
                                {new Date(claim.pickupScheduled).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                    )}

                    {/* Remarks */}
                    {claim.remarks && (
                        <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg shadow-slate-200/50 p-6">
                            <h2 className="text-lg font-bold text-slate-900 mb-3">Remarks</h2>
                            <p className="text-sm text-slate-700 leading-relaxed">{claim.remarks}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WarrantyClaimDetails;
