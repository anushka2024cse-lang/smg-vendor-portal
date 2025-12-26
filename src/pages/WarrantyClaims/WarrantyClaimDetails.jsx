import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Package, User, Building2, MapPin, Phone, Mail, FileText, AlertCircle, CheckCircle, Clock, XCircle, Download, Edit } from 'lucide-react';
import warrantyClaimService from '../../services/warrantyClaimService';
import { useToast } from '../../contexts/ToastContext';

const WarrantyClaimDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [claim, setClaim] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadClaimData();
    }, [id]);

    const loadClaimData = async () => {
        try {
            const response = await warrantyClaimService.getClaim(id);
            setClaim(response.data.data);
        } catch (error) {
            console.error('Error loading claim:', error);
            toast.error('Failed to load warranty claim details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 max-w-7xl mx-auto flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-slate-600">Loading warranty claim details...</p>
                </div>
            </div>
        );
    }

    if (!claim) {
        return (
            <div className="p-8 max-w-7xl mx-auto">
                <div className="text-center">
                    <p className="text-slate-600">Warranty claim not found.</p>
                    <button onClick={() => navigate('/warranty-claims')} className="mt-4 text-blue-600 hover:text-blue-700">
                        Back to Claims
                    </button>
                </div>
            </div>
        );
    }

    const statusConfig = {
        'Pending': { color: 'amber', icon: Clock, label: 'Pending Review' },
        'Under Review': { color: 'blue', icon: AlertCircle, label: 'Under Review' },
        'Approved': { color: 'emerald', icon: CheckCircle, label: 'Approved' },
        'Rejected': { color: 'red', icon: XCircle, label: 'Rejected' },
        'Pending Pickup': { color: 'purple', icon: AlertCircle, label: 'Pending Pickup' }
    };

    const StatusIcon = statusConfig[claim.status]?.icon || Clock;
    const statusColor = statusConfig[claim.status]?.color || 'slate';

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

                    {/* Technical Details */}
                    {claim.technicalDetails && Object.keys(claim.technicalDetails).length > 0 && (
                        <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg shadow-slate-200/50 p-6">
                            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <span className="text-green-600 text-xl">⚙</span>
                                Component Technical Details
                            </h2>
                            <div className="space-y-4">
                                {/* Charger Lithium */}
                                {claim.technicalDetails.chargerLithium && Object.values(claim.technicalDetails.chargerLithium).some(v => v) && (
                                    <div className="border-l-4 border-green-600 pl-4">
                                        <h3 className="text-sm font-bold text-slate-900 mb-3">
                                            Charger Complaint (Lithium)
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {claim.technicalDetails.chargerLithium.chargerNo && (
                                                <div>
                                                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">Charger No</p>
                                                    <p className="text-sm text-slate-900">{claim.technicalDetails.chargerLithium.chargerNo}</p>
                                                </div>
                                            )}
                                            {claim.technicalDetails.chargerLithium.batteryVoltage && (
                                                <div>
                                                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">Battery Voltage</p>
                                                    <p className="text-sm text-slate-900">{claim.technicalDetails.chargerLithium.batteryVoltage}V</p>
                                                </div>
                                            )}
                                            {claim.technicalDetails.chargerLithium.greenLedStatus && (
                                                <div>
                                                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">Green LED Status</p>
                                                    <p className="text-sm text-slate-900">{claim.technicalDetails.chargerLithium.greenLedStatus}</p>
                                                </div>
                                            )}
                                            {claim.technicalDetails.chargerLithium.fanStatus && (
                                                <div>
                                                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">Fan Status</p>
                                                    <p className="text-sm text-slate-900">{claim.technicalDetails.chargerLithium.fanStatus}</p>
                                                </div>
                                            )}
                                            {claim.technicalDetails.chargerLithium.chargingTime && (
                                                <div>
                                                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">Charging Time</p>
                                                    <p className="text-sm text-slate-900">{claim.technicalDetails.chargerLithium.chargingTime}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Battery Lithium */}
                                {claim.technicalDetails.batteryLithium && Object.values(claim.technicalDetails.batteryLithium).some(v => v) && (
                                    <div className="border-l-4 border-green-600 pl-4">
                                        <h3 className="text-sm font-bold text-slate-900 mb-3">
                                            Battery Complaint (Lithium)
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {claim.technicalDetails.batteryLithium.batteryNo && (
                                                <div>
                                                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">Battery No</p>
                                                    <p className="text-sm text-slate-900">{claim.technicalDetails.batteryLithium.batteryNo}</p>
                                                </div>
                                            )}
                                            {claim.technicalDetails.batteryLithium.voltageFullCharge && (
                                                <div>
                                                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">Voltage @Full Charge</p>
                                                    <p className="text-sm text-slate-900">{claim.technicalDetails.batteryLithium.voltageFullCharge}V</p>
                                                </div>
                                            )}
                                            {claim.technicalDetails.batteryLithium.vehicleCurrent && (
                                                <div>
                                                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">Vehicle Current</p>
                                                    <p className="text-sm text-slate-900">{claim.technicalDetails.batteryLithium.vehicleCurrent}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Motor */}
                                {claim.technicalDetails.motor && Object.values(claim.technicalDetails.motor).some(v => v) && (
                                    <div className="border-l-4 border-green-600 pl-4">
                                        <h3 className="text-sm font-bold text-slate-900 mb-3">
                                            Motor Complaint
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {claim.technicalDetails.motor.motorNo && (
                                                <div>
                                                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">Motor No</p>
                                                    <p className="text-sm text-slate-900">{claim.technicalDetails.motor.motorNo}</p>
                                                </div>
                                            )}
                                            {claim.technicalDetails.motor.vehicleCurrent && (
                                                <div>
                                                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">Vehicle Current</p>
                                                    <p className="text-sm text-slate-900">{claim.technicalDetails.motor.vehicleCurrent}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Controller */}
                                {claim.technicalDetails.controller && Object.values(claim.technicalDetails.controller).some(v => v) && (
                                    <div className="border-l-4 border-green-600 pl-4">
                                        <h3 className="text-sm font-bold text-slate-900 mb-3">
                                            Controller Complaint
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {claim.technicalDetails.controller.controllerNo && (
                                                <div>
                                                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">Controller No</p>
                                                    <p className="text-sm text-slate-900">{claim.technicalDetails.controller.controllerNo}</p>
                                                </div>
                                            )}
                                            {claim.technicalDetails.controller.vehicleCurrent && (
                                                <div>
                                                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">Vehicle Current</p>
                                                    <p className="text-sm text-slate-900">{claim.technicalDetails.controller.vehicleCurrent}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Converter */}
                                {claim.technicalDetails.converter && Object.values(claim.technicalDetails.converter).some(v => v) && (
                                    <div className="border-l-4 border-green-600 pl-4">
                                        <h3 className="text-sm font-bold text-slate-900 mb-3">
                                            Converter Complaint
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {claim.technicalDetails.converter.converterNo && (
                                                <div>
                                                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">Converter No</p>
                                                    <p className="text-sm text-slate-900">{claim.technicalDetails.converter.converterNo}</p>
                                                </div>
                                            )}
                                            {claim.technicalDetails.converter.inputVoltage && (
                                                <div>
                                                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">Input Voltage</p>
                                                    <p className="text-sm text-slate-900">{claim.technicalDetails.converter.inputVoltage}V</p>
                                                </div>
                                            )}
                                            {claim.technicalDetails.converter.outputVoltage && (
                                                <div>
                                                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">Output Voltage</p>
                                                    <p className="text-sm text-slate-900">{claim.technicalDetails.converter.outputVoltage}V</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

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
