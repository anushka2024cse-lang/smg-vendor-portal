import React, { useState, useEffect } from 'react';
import { Calendar, Upload, Package, AlertCircle, CheckCircle, Clock, FileText, Camera, MapPin, User, Phone, Mail, ArrowLeft, Save, ArrowRight, Wrench } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import warrantyClaimService from '../../services/warrantyClaimService';

// --- Helper Components for Technical Details ---

const TechnicalInput = ({ label, value, onChange, type = "text", className = "" }) => (
    <div className={className}>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">{label}</label>
        <input
            type={type}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
        />
    </div>
);

const TechnicalSection = ({ title, icon, children }) => (
    <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg shadow-slate-200/50 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-600 rounded-lg">
                {icon || <span className="text-white text-xl">#</span>}
            </div>
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        </div>
        {children}
    </div>
);

// --- Main Component ---

const WarrantyClaimForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const isEditMode = Boolean(id);
    const [currentStep, setCurrentStep] = useState(1);

    const [formData, setFormData] = useState({
        claimType: 'Component Failure',
        claimDate: new Date().toISOString().split('T')[0],
        // Product Info
        vehicleModel: '', chassisNumber: '', motorNumber: '', batteryNumber: '', registrationNumber: '',
        manufacturingDate: '', purchaseDate: '', currentMileage: '',
        // Component Info
        componentName: '', componentPartNumber: '', componentSerialNumber: '',
        failureDate: '', failureDescription: '', failureType: 'Manufacturing Defect',
        // Customer Info
        customerName: '', customerPhone: '', customerEmail: '', customerAddress: '',
        // Dealer Info
        dealerName: '', dealerCode: '', dealerLocation: '', serviceAdvisorName: '', serviceAdvisorPhone: '',
        // Pickup
        pickupRequired: true, pickupAddress: '', preferredPickupDate: '', pickupInstructions: '',
        // Additional
        workOrderNumber: '', defectCode: '', laborHours: '', laborCost: '', partsCost: '', totalClaimAmount: '', remarks: '',
        // Technical
        technicalDetails: {}
    });

    const [attachments, setAttachments] = useState({
        failedPartPhotos: [], warrantyCard: null, purchaseInvoice: null, failureReport: null, diagnosticReport: null
    });

    // --- Configuration for Technical Fields ---
    const technicalConfigs = {
        chargerLithium: [
            { key: 'chargerNo', label: 'Charger No' },
            { key: 'batteryVoltage', label: 'Battery Voltage @Vehicle Charging Port', type: 'number' },
            { key: 'greenLedStatus', label: 'Status of Green LED (Phylin)' },
            { key: 'redLedPhylinStatus', label: 'Status of Red LED (Phylin)' },
            { key: 'mainsOnLedStatus', label: 'Status of MAINS ON LED' },
            { key: 'opOnLedStatus', label: 'Status OF O/P ON LED (Sonalta)' },
            { key: 'batteryChargingLedStatus', label: 'Battery Charging Status LED (Sonalta)' },
            { key: 'fanStatus', label: 'Fan Status' },
            { key: 'chargingTime', label: 'Charging Time' },
        ],
        chargerLeadAcid: [
            { key: 'chargerNo', label: 'Charger No' },
            { key: 'batteryVoltage', label: 'Battery Voltage @Vehicle Charging Port', type: 'number' },
            { key: 'greenLedStatus', label: 'GREEN LED Status' },
            { key: 'redLedStatus', label: 'RED LED Status' },
            { key: 'blueLedStatus', label: 'BLUE LED Status' },
            { key: 'fanStatus', label: 'Fan Status' },
            { key: 'chargingTime', label: 'Charging Time' },
        ],
        batteryLithium: [
            { key: 'batteryNo', label: 'Battery No' },
            { key: 'vehicleCurrent', label: 'Vehicle Current' },
            { key: 'voltageFullCharge', label: 'Voltage @Full Charge (V)', type: 'number' },
            { key: 'voltageAfterLowBattery', label: 'Voltage After Low Battery (V)', type: 'number' },
            { key: 'batteryCapacityAfterDischarge', label: 'Capacity After 15A Discharge (AH)', type: 'number', className: 'md:col-span-2' },
        ],
        controller: [
            { key: 'controllerNo', label: 'Controller No' },
            { key: 'vehicleCurrent', label: 'Vehicle Current' },
        ],
        converter: [
            { key: 'converterNo', label: 'Converter No' },
            { key: 'otherReason', label: 'Other Reason' },
            { key: 'inputVoltage', label: 'Input Voltage', type: 'number' },
            { key: 'outputVoltage', label: 'Output Voltage', type: 'number' },
        ]
    };

    useEffect(() => {
        if (isEditMode) loadClaimData();
    }, [id]);

    const loadClaimData = async () => {
        setLoadingData(true);
        try {
            const response = await warrantyClaimService.getClaim(id);
            const claim = response.data.data;
            setFormData(prev => ({
                ...prev,
                ...claim,
                technicalDetails: claim.technicalDetails || {}
            }));
        } catch (error) {
            toast.error('Failed to load warranty claim data');
        }
        setLoadingData(false);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Technical Details Handlers
    const handleTechnicalChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            technicalDetails: {
                ...prev.technicalDetails,
                [section]: {
                    ...prev.technicalDetails?.[section],
                    [field]: value
                }
            }
        }));
    };

    const handleNestedChange = (section, parent, child, value) => {
        setFormData(prev => ({
            ...prev,
            technicalDetails: {
                ...prev.technicalDetails,
                [section]: {
                    ...prev.technicalDetails?.[section],
                    [parent]: {
                        ...prev.technicalDetails?.[section]?.[parent],
                        [child]: value
                    }
                }
            }
        }));
    };

    const getValue = (section, field) => formData.technicalDetails?.[section]?.[field] || '';
    const getNestedValue = (section, parent, child) => formData.technicalDetails?.[section]?.[parent]?.[child] || '';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const submitData = {
                ...formData,
                technicalDetails: formData.technicalDetails
            };

            if (isEditMode) {
                await warrantyClaimService.updateClaim(id, submitData);
                toast.success('Warranty claim updated successfully!');
            } else {
                await warrantyClaimService.createClaim(submitData);
                toast.success('Warranty claim submitted successfully!');
            }
            navigate('/warranty-claims');
        } catch (error) {
            toast.error(error.message || 'Failed to submit claim');
        }
        setLoading(false);
    };

    const handleSaveDraft = async () => {
        setLoading(true);
        try {
            await warrantyClaimService.saveDraft({
                ...formData,
                technicalDetails: formData.technicalDetails
            });
            toast.success('Draft saved successfully!');
            navigate('/warranty-claims');
        } catch (error) {
            toast.error('Failed to save draft');
        }
        setLoading(false);
    };

    if (loadingData) return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Loading warranty claim data...</p>
            </div>
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">{isEditMode ? 'Edit' : 'New'} Warranty Claim</h1>
                    <p className="text-slate-600 mt-1">{isEditMode ? 'Update warranty claim information' : 'File a warranty claim for defective components'}</p>
                </div>
                <button onClick={() => navigate('/warranty-claims')} className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                    <ArrowLeft size={18} /> Back to Claims
                </button>
            </div>

            {/* Stepper */}
            <div className="bg-white rounded-xl border-2 border-slate-200 shadow-md mb-6 p-4">
                <div className="flex items-center justify-between max-w-md mx-auto">
                    <div className="flex flex-col items-center flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep === 1 ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'}`}>
                            {currentStep === 1 ? '1' : '✓'}
                        </div>
                        <span className="text-xs font-semibold mt-2 text-center">Basic Information</span>
                    </div>
                    <div className={`flex-1 h-1 mx-4 ${currentStep === 2 ? 'bg-blue-600' : 'bg-slate-300'}`}></div>
                    <div className="flex flex-col items-center flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep === 2 ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-600'}`}>
                            2
                        </div>
                        <span className="text-xs font-semibold mt-2 text-center">Technical Details</span>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {currentStep === 1 && (
                    <>
                        {/* STEP 1: Basic Information - TODO: Insert your original Step 1 content here */}
                        <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg shadow-slate-200/50 p-6 mb-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-600 rounded-lg">
                                    <FileText size={20} className="text-white" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-900">Basic Warranty Information</h2>
                            </div>
                            <p className="text-slate-500 text-center py-8">
                                ⚠️ <strong>TODO:</strong> Insert your original Step 1 fields here (Claim Info, Vehicle Info, Component Info, Customer Info, Dealer Info, etc.)
                                <br />This is a placeholder - you need to copy the Step 1 content from your original file.
                            </p>
                        </div>

                        <div className="flex justify-end gap-4">
                            <button type="button" onClick={() => navigate('/warranty-claims')} className="px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-xl transition-all">Cancel</button>
                            <button type="button" onClick={() => {
                                if (!formData.componentName || !formData.failureDescription) {
                                    toast.error('Please fill in Component Name and Failure Description');
                                    return;
                                }
                                setCurrentStep(2);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }} className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all text-sm font-bold shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300">
                                Next: Technical Details <ArrowRight size={18} />
                            </button>
                        </div>
                    </>
                )}

                {currentStep === 2 && (
                    <>
                        {/* STEP 2: Technical Details - Clean Refactored Version */}
                        <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg shadow-slate-200/50 p-6 mb-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-green-600 rounded-lg">
                                    <Wrench size={20} className="text-white" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-900">Component Technical Details</h2>
                            </div>

                            <p className="text-sm text-slate-600 mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                Fill in the relevant technical details for the failed component. You can skip sections that don't apply.
                            </p>

                            {/* Charger Lithium */}
                            <TechnicalSection title="Charger Complaint (Lithium)" icon={<Wrench size={20} className="text-white" />}>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                    {technicalConfigs.chargerLithium.map(field => (
                                        <TechnicalInput
                                            key={field.key}
                                            {...field}
                                            value={getValue('chargerLithium', field.key)}
                                            onChange={(val) => handleTechnicalChange('chargerLithium', field.key, val)}
                                        />
                                    ))}
                                </div>
                            </TechnicalSection>

                            {/* Charger Lead Acid */}
                            <TechnicalSection title="Charger Complaint (Lead Acid)" icon={<Wrench size={20} className="text-white" />}>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                    {technicalConfigs.chargerLeadAcid.map(field => (
                                        <TechnicalInput
                                            key={field.key}
                                            {...field}
                                            value={getValue('chargerLeadAcid', field.key)}
                                            onChange={(val) => handleTechnicalChange('chargerLeadAcid', field.key, val)}
                                        />
                                    ))}
                                </div>
                            </TechnicalSection>

                            {/* Battery Lithium */}
                            <TechnicalSection title="Battery Complaint (Lithium)" icon={<Wrench size={20} className="text-white" />}>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                    {technicalConfigs.batteryLithium.map(field => (
                                        <TechnicalInput
                                            key={field.key}
                                            {...field}
                                            value={getValue('batteryLithium', field.key)}
                                            onChange={(val) => handleTechnicalChange('batteryLithium', field.key, val)}
                                        />
                                    ))}
                                </div>
                            </TechnicalSection>

                            {/* Motor - Custom Layout for Nested Fields */}
                            <TechnicalSection title="Motor Complaint" icon={<Wrench size={20} className="text-white" />}>
                                <div className="space-y-4 mt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <TechnicalInput
                                            label="Motor No"
                                            value={getValue('motor', 'motorNo')}
                                            onChange={(val) => handleTechnicalChange('motor', 'motorNo', val)}
                                        />
                                        <TechnicalInput
                                            label="Vehicle Current"
                                            value={getValue('motor', 'vehicleCurrent')}
                                            onChange={(val) => handleTechnicalChange('motor', 'vehicleCurrent', val)}
                                        />
                                    </div>

                                    {/* Diode Test */}
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-700 mb-2">Diode Test</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {['redBlack', 'redGreen', 'redBlue', 'redYellow'].map(key => (
                                                <div key={key}>
                                                    <label className="block text-xs text-slate-600 mb-1">
                                                        {key.replace(/([A-Z])/g, '+$1').replace(/^./, str => str.toUpperCase())}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={getNestedValue('motor', 'diodeTest', key)}
                                                        onChange={(e) => handleNestedChange('motor', 'diodeTest', key, e.target.value)}
                                                        className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Voltage Test */}
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-700 mb-2">Voltage Test</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {['redBlack', 'greenBlack', 'blueBlack', 'yellowBlack'].map(key => (
                                                <div key={key}>
                                                    <label className="block text-xs text-slate-600 mb-1">
                                                        {key.replace(/([A-Z])/g, '+$1').replace(/^./, str => str.toUpperCase())}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={getNestedValue('motor', 'voltageTest', key)}
                                                        onChange={(e) => handleNestedChange('motor', 'voltageTest', key, e.target.value)}
                                                        className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </TechnicalSection>

                            {/* Controller */}
                            <TechnicalSection title="Controller Complaint" icon={<Wrench size={20} className="text-white" />}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    {technicalConfigs.controller.map(field => (
                                        <TechnicalInput
                                            key={field.key}
                                            {...field}
                                            value={getValue('controller', field.key)}
                                            onChange={(val) => handleTechnicalChange('controller', field.key, val)}
                                        />
                                    ))}
                                </div>
                            </TechnicalSection>

                            {/* Converter */}
                            <TechnicalSection title="Converter Complaint" icon={<Wrench size={20} className="text-white" />}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    {technicalConfigs.converter.map(field => (
                                        <TechnicalInput
                                            key={field.key}
                                            {...field}
                                            value={getValue('converter', field.key)}
                                            onChange={(val) => handleTechnicalChange('converter', field.key, val)}
                                        />
                                    ))}
                                </div>
                            </TechnicalSection>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between gap-4 pt-6">
                            <button
                                type="button"
                                onClick={() => {
                                    setCurrentStep(1);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="flex items-center gap-2 px-6 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all text-sm font-semibold border-2 border-slate-300"
                            >
                                <ArrowLeft size={18} /> Back to Basic Info
                            </button>
                            <div className="flex gap-4">
                                {!isEditMode && (
                                    <button
                                        type="button"
                                        onClick={handleSaveDraft}
                                        disabled={loading}
                                        className="flex items-center gap-2 px-6 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all text-sm font-semibold border-2 border-slate-300"
                                    >
                                        <Save size={18} /> Save as Draft
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all text-sm font-bold shadow-md shadow-red-200 hover:shadow-lg hover:shadow-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <CheckCircle size={18} />
                                    {loading ? 'Submitting Claim...' : 'Submit Warranty Claim'}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
};

export default WarrantyClaimForm;
