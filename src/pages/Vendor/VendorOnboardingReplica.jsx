import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Check, Upload, Building, CreditCard, FileCheck, Truck, Save, User } from 'lucide-react';
import apiClient from '../../services/apiClient';

const VendorOnboardingReplica = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Document Control
        documentCode: '',
        revisionDate: '',
        revisionStatus: '',

        // 1. Name of Supplier
        companyPrefix: 'Company',
        supplierName: '',

        // 2. Address
        houseNo: '',
        street: '',
        city: '',
        state: '',
        pinCode: '',
        nearestRailwayStation: '',
        nearestAirport: '',

        // 3. Currency
        currency: 'INR',

        // 4. Payment Terms
        paymentTerms: '',

        // 5-8. Contact Details
        contactPerson: '',
        designation: '',
        phoneWithCode: '',
        faxNo: '',
        mobileWithCountryCode: '',
        emailId: '',
        alternateEmailId: '',

        // 8A. GST Contact
        gstContactNo: '',
        gstEmailId: '',

        // 9. Bank Details
        bankName: '',
        ifscCode: '',
        accountNumber: '',
        cancelledCheque: null,

        // 10. Status of Vendor
        vendorStatus: [],

        // 11. Industrial Status
        industrialStatus: '',

        // 12. Staff
        staffInSales: '',
        staffInService: '',
        staffOthers: '',
        staffTotal: '',

        // 13. Dealer/Distributor
        dealerProducts: '',

        // 14. Product Range
        productRange: '',

        // 15. PAN
        panNumber: '',
        panDocument: null,

        // 16. GST
        gstNumber: '',
        gstDocument: null,

        // 17. GST Vendor Class
        gstVendorClass: '',

        // 18. TAN
        tanNumber: '',
        tanDocument: null,

        // 19. Registered with SMG
        registeredWithSMG: '',

        // 20. Mode of Material Supply
        materialSupplyMode: [],

        // 21. Mode of Transport
        modeOfTransport: '',

        // 22. Signature
        signatureDocument: null,
    });

    const [loading, setLoading] = useState(false);

    // Load draft from localStorage on component mount
    useEffect(() => {
        const draft = localStorage.getItem('vendorDraftReplica');
        if (draft) {
            try {
                const parsed = JSON.parse(draft);
                const { savedAt, currentStep: savedStep, ...draftData } = parsed;
                setFormData(prev => ({ ...prev, ...draftData }));
                setCurrentStep(savedStep || 1);

                const savedDate = new Date(savedAt).toLocaleString();
                console.log(`Draft loaded from ${savedDate}, Step ${savedStep}`);
            } catch (e) {
                console.error('Failed to load draft:', e);
            }
        }
    }, []);

    const steps = [
        { id: 1, label: 'Supplier & Address', icon: Building },
        { id: 2, label: 'Payment & Contact', icon: User },
        { id: 3, label: 'Bank & Status', icon: CreditCard },
        { id: 4, label: 'Products & Docs', icon: FileCheck },
        { id: 5, label: 'Compliance & Final', icon: Truck },
    ];

    const update = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleCheckboxArray = (key, value) => {
        setFormData(prev => {
            const current = prev[key] || [];
            if (current.includes(value)) {
                return { ...prev, [key]: current.filter(v => v !== value) };
            } else {
                return { ...prev, [key]: [...current, value] };
            }
        });
    };

    const handleFileChange = (key, file) => {
        update(key, file);
    };

    const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 5));
    const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    // Save draft to localStorage
    const saveDraft = () => {
        try {
            const { cancelledCheque, panDocument, gstDocument, tanDocument, signatureDocument, ...textData } = formData;

            localStorage.setItem('vendorDraftReplica', JSON.stringify({
                ...textData,
                currentStep,
                savedAt: new Date().toISOString()
            }));

            alert(`✅ Draft saved successfully! (Step ${currentStep}/5)\nYou can resume later.`);
        } catch (e) {
            console.error('Failed to save draft:', e);
            alert('❌ Failed to save draft');
        }
    };

    const handleSubmit = async () => {
        // Validate required fields
        if (!formData.supplierName || !formData.emailId || !formData.phoneWithCode) {
            alert('Please fill in all required fields (Supplier Name, Email, Phone)');
            return;
        }

        setLoading(true);

        try {
            // Create FormData for multipart upload
            const formDataToSend = new FormData();

            // Prepare complete vendor data object with all extended fields
            const vendorData = {
                name: formData.supplierName,
                type: formData.vendorStatus.join(', ') || 'N/A',
                contact: formData.contactPerson || 'N/A',
                email: formData.emailId,
                phone: formData.mobileWithCountryCode || formData.phoneWithCode,
                city: formData.city || '',
                companyPrefix: formData.companyPrefix,
                houseNo: formData.houseNo,
                address: {
                    street: formData.street,
                    state: formData.state,
                    zip: formData.pinCode,
                    country: 'India'
                },
                nearestRailwayStation: formData.nearestRailwayStation,
                nearestAirport: formData.nearestAirport,
                currency: formData.currency,
                paymentTerms: formData.paymentTerms,
                designation: formData.designation,
                faxNo: formData.faxNo,
                alternateEmailId: formData.alternateEmailId,
                gstContact: {
                    phone: formData.gstContactNo,
                    email: formData.gstEmailId
                },
                bank: {
                    name: formData.bankName,
                    account: formData.accountNumber,
                    ifsc: formData.ifscCode
                },
                vendorStatus: formData.vendorStatus,
                industrialStatus: formData.industrialStatus,
                staff: {
                    sales: formData.staffInSales,
                    service: formData.staffInService,
                    others: formData.staffOthers,
                    total: formData.staffTotal
                },
                dealerProducts: formData.dealerProducts,
                productRange: formData.productRange,
                tax: {
                    pan: formData.panNumber,
                    gst: formData.gstNumber,
                    tan: formData.tanNumber,
                    gstVendorClass: formData.gstVendorClass
                },
                registeredWithSMG: formData.registeredWithSMG,
                materialSupplyMode: formData.materialSupplyMode,
                modeOfTransport: formData.modeOfTransport,
                documentControl: {
                    code: formData.documentCode,
                    revisionDate: formData.revisionDate,
                    revisionStatus: formData.revisionStatus
                }
            };

            // Add vendor data as JSON string
            formDataToSend.append('vendorData', JSON.stringify(vendorData));

            // Add files if they exist
            if (formData.cancelledCheque) {
                formDataToSend.append('cancelledCheque', formData.cancelledCheque);
            }
            if (formData.panDocument) {
                formDataToSend.append('panDocument', formData.panDocument);
            }
            if (formData.gstDocument) {
                formDataToSend.append('gstDocument', formData.gstDocument);
            }
            if (formData.tanDocument) {
                formDataToSend.append('tanDocument', formData.tanDocument);
            }
            if (formData.signatureDocument) {
                formDataToSend.append('signatureDocument', formData.signatureDocument);
            }

            console.log('Submitting vendor with files...');

            // Send as multipart/form-data
            const response = await apiClient.post('/vendors', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data) {
                alert('Vendor registered successfully with all documents!');
                localStorage.removeItem('vendorDraftReplica'); // Clear draft on success
                navigate('/vendor/list');
            }
        } catch (error) {
            console.error('Error submitting vendor:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to register vendor';
            alert(`Failed to register vendor: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => navigate('/vendor/list')}
                    className="flex items-center gap-1 text-sm text-slate-500 hover:text-blue-900 transition-colors mb-2"
                >
                    <ChevronLeft size={16} /> Back to Vendor List
                </button>
                <h1 className="text-3xl font-bold text-slate-900">Vendor Onboarding (Multi-Step)</h1>
                <p className="text-slate-500 mt-1">Complete all steps to register a new vendor with comprehensive details.</p>
            </div>

            {/* Stepper */}
            <div className="mb-10">
                <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-10 rounded-full"></div>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-900 -z-10 rounded-full transition-all duration-500"
                        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}></div>

                    {steps.map((step) => {
                        const isCompleted = step.id < currentStep;
                        const isCurrent = step.id === currentStep;

                        return (
                            <div key={step.id} className="flex flex-col items-center gap-2 bg-background px-2">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                                    ${isCompleted ? 'bg-blue-900 border-blue-900 text-white' :
                                        isCurrent ? 'bg-white border-blue-900 text-blue-900 shadow-lg scale-110' :
                                            'bg-white border-slate-300 text-slate-300'}`}>
                                    {isCompleted ? <Check size={20} /> : <step.icon size={20} />}
                                </div>
                                <span className={`text-sm font-medium ${isCurrent ? 'text-blue-900' : 'text-slate-500'}`}>
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Form Content */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 min-h-[500px]">

                {/* STEP 1: SUPPLIER & ADDRESS */}
                {currentStep === 1 && (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                        <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3">Supplier Identity & Address</h2>

                        {/* Document Control */}
                        <Section title="Document Control">
                            <Grid cols={3}>
                                <Input label="Code" value={formData.documentCode} onChange={(e) => update('documentCode', e.target.value)} />
                                <Input type="date" label="Revision Date" value={formData.revisionDate} onChange={(e) => update('revisionDate', e.target.value)} />
                                <Input label="Revision Status" value={formData.revisionStatus} onChange={(e) => update('revisionStatus', e.target.value)} />
                            </Grid>
                        </Section>

                        {/* 1. Name of Supplier */}
                        <Section title="1. Name of Supplier">
                            <Grid cols={3}>
                                <Select
                                    label="Company / Mr / Ms"
                                    value={formData.companyPrefix}
                                    onChange={(e) => update('companyPrefix', e.target.value)}
                                    options={["Company", "Mr", "Ms"]}
                                />
                                <div className="md:col-span-2">
                                    <Input
                                        label="Supplier Name (CAPITAL LETTERS) *"
                                        value={formData.supplierName}
                                        onChange={(e) => update('supplierName', e.target.value.toUpperCase())}
                                        required
                                    />
                                </div>
                            </Grid>
                        </Section>

                        {/* 2. Address */}
                        <Section title="2. Address">
                            <Grid cols={3}>
                                <Input label="House No" value={formData.houseNo} onChange={(e) => update('houseNo', e.target.value)} />
                                <Input label="Street" value={formData.street} onChange={(e) => update('street', e.target.value)} />
                                <Input label="City" value={formData.city} onChange={(e) => update('city', e.target.value)} />
                                <Input label="State" value={formData.state} onChange={(e) => update('state', e.target.value)} />
                                <Input label="Pin Code" value={formData.pinCode} onChange={(e) => update('pinCode', e.target.value)} />
                                <Input label="Nearest Railway Station" value={formData.nearestRailwayStation} onChange={(e) => update('nearestRailwayStation', e.target.value)} />
                                <div className="md:col-span-3">
                                    <Input label="Nearest Airport" value={formData.nearestAirport} onChange={(e) => update('nearestAirport', e.target.value)} />
                                </div>
                            </Grid>
                        </Section>
                    </div>
                )}

                {/* STEP 2: PAYMENT & CONTACT */}
                {currentStep === 2 && (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                        <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3">Payment Terms & Contact Information</h2>

                        {/* 3. Currency */}
                        <Section title="3. Currency">
                            <div className="flex gap-8">
                                {["INR", "USD", "EURO"].map(c => (
                                    <label key={c} className="flex items-center gap-2 text-sm font-medium">
                                        <input
                                            type="radio"
                                            name="currency"
                                            checked={formData.currency === c}
                                            onChange={() => update('currency', c)}
                                            className="w-4 h-4 text-blue-900 focus:ring-blue-900"
                                        />
                                        {c}
                                    </label>
                                ))}
                            </div>
                        </Section>

                        {/* 4. Payment Terms */}
                        <Section title="4. Payment Terms (V001)">
                            <Input value={formData.paymentTerms} onChange={(e) => update('paymentTerms', e.target.value)} placeholder="e.g., Net 30 Days" />
                        </Section>

                        {/* 5-8. Contact Details */}
                        <Section title="5–8. Contact Details">
                            <Grid cols={3}>
                                <Input label="Contact Person" value={formData.contactPerson} onChange={(e) => update('contactPerson', e.target.value)} />
                                <Input label="Designation" value={formData.designation} onChange={(e) => update('designation', e.target.value)} />
                                <Input label="Phone (STD Code) *" value={formData.phoneWithCode} onChange={(e) => update('phoneWithCode', e.target.value)} required />
                                <Input label="Fax No" value={formData.faxNo} onChange={(e) => update('faxNo', e.target.value)} />
                                <Input label="Mobile (Country Code)" value={formData.mobileWithCountryCode} onChange={(e) => update('mobileWithCountryCode', e.target.value)} />
                                <Input label="Email ID *" type="email" value={formData.emailId} onChange={(e) => update('emailId', e.target.value)} required />
                                <Input label="Alternate Email ID" type="email" value={formData.alternateEmailId} onChange={(e) => update('alternateEmailId', e.target.value)} />
                            </Grid>
                        </Section>

                        {/* 8A. GST Contact */}
                        <Section title="8(A). Contact Details (Dedicated for GST)">
                            <Grid cols={2}>
                                <Input label="GST Contact No" value={formData.gstContactNo} onChange={(e) => update('gstContactNo', e.target.value)} />
                                <Input label="GST Email ID" type="email" value={formData.gstEmailId} onChange={(e) => update('gstEmailId', e.target.value)} />
                            </Grid>
                        </Section>
                    </div>
                )}

                {/* STEP 3: BANK & STATUS */}
                {currentStep === 3 && (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                        <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3">Banking & Business Status</h2>

                        {/* 9. Bank Details */}
                        <Section title="9. Bank Details">
                            <Grid cols={3}>
                                <Input label="Bank Name" value={formData.bankName} onChange={(e) => update('bankName', e.target.value)} />
                                <Input label="IFSC Code" value={formData.ifscCode} onChange={(e) => update('ifscCode', e.target.value)} />
                                <Input label="Account Number" value={formData.accountNumber} onChange={(e) => update('accountNumber', e.target.value)} />
                            </Grid>
                            <FileUploadBox
                                label="Cancelled Cheque (PDF)"
                                file={formData.cancelledCheque}
                                onChange={(file) => handleFileChange('cancelledCheque', file)}
                            />
                        </Section>

                        {/* 10. Status of Vendor */}
                        <Section title="10. Status of Vendor">
                            <Grid cols={4}>
                                {["Proprietor", "Ltd", "Co", "Partnership"].map(v => (
                                    <CheckboxItem
                                        key={v}
                                        label={v}
                                        checked={formData.vendorStatus.includes(v)}
                                        onChange={() => handleCheckboxArray('vendorStatus', v)}
                                    />
                                ))}
                            </Grid>
                        </Section>

                        {/* 11. Industrial Status */}
                        <Section title="11. Industrial Status">
                            <Grid cols={5}>
                                {["Micro", "Small", "Medium", "Large", "Not Applicable"].map(v => (
                                    <label key={v} className="flex items-center gap-2 text-sm">
                                        <input
                                            type="radio"
                                            name="industrialStatus"
                                            checked={formData.industrialStatus === v}
                                            onChange={() => update('industrialStatus', v)}
                                            className="w-4 h-4 text-blue-900 focus:ring-blue-900"
                                        />
                                        {v}
                                    </label>
                                ))}
                            </Grid>
                        </Section>

                        {/* 12. Staff */}
                        <Section title="12. No. of Staff">
                            <Grid cols={4}>
                                <Input label="In Sales" type="number" value={formData.staffInSales} onChange={(e) => update('staffInSales', e.target.value)} />
                                <Input label="In Service" type="number" value={formData.staffInService} onChange={(e) => update('staffInService', e.target.value)} />
                                <Input label="Others" type="number" value={formData.staffOthers} onChange={(e) => update('staffOthers', e.target.value)} />
                                <Input label="Total" type="number" value={formData.staffTotal} onChange={(e) => update('staffTotal', e.target.value)} />
                            </Grid>
                        </Section>
                    </div>
                )}

                {/* STEP 4: PRODUCTS & DOCUMENTS */}
                {currentStep === 4 && (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                        <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3">Products & Tax Documents</h2>

                        {/* 13. Dealer/Distributor */}
                        <Section title="13. Dealer / Distributor">
                            <Input label="Brand / Products / Items" value={formData.dealerProducts} onChange={(e) => update('dealerProducts', e.target.value)} />
                        </Section>

                        {/* 14. Product Range */}
                        <Section title="14. Product Range">
                            <Input label="Brand / Products / Items" value={formData.productRange} onChange={(e) => update('productRange', e.target.value)} />
                        </Section>

                        {/* 15. PAN */}
                        <Section title="15. PAN">
                            <Input label="PAN Number" value={formData.panNumber} onChange={(e) => update('panNumber', e.target.value.toUpperCase())} placeholder="ABCDE1234F" />
                            <FileUploadBox
                                label="PAN Photocopy (PDF)"
                                file={formData.panDocument}
                                onChange={(file) => handleFileChange('panDocument', file)}
                            />
                        </Section>

                        {/* 16. GST */}
                        <Section title="16. GST">
                            <Input label="GST Number" value={formData.gstNumber} onChange={(e) => update('gstNumber', e.target.value.toUpperCase())} placeholder="22AAAAA0000A1Z5" />
                            <FileUploadBox
                                label="GST Registration (PDF)"
                                file={formData.gstDocument}
                                onChange={(file) => handleFileChange('gstDocument', file)}
                            />
                        </Section>
                    </div>
                )}

                {/* STEP 5: COMPLIANCE & FINAL */}
                {currentStep === 5 && (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                        <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3">Compliance & Final Details</h2>

                        {/* 17. GST Vendor Class */}
                        <Section title="17. GST Vendor Class">
                            <Grid cols={4}>
                                {["Registered", "Not Registered", "Composition", "Govt Org"].map(v => (
                                    <label key={v} className="flex items-center gap-2 text-sm">
                                        <input
                                            type="radio"
                                            name="gstVendorClass"
                                            checked={formData.gstVendorClass === v}
                                            onChange={() => update('gstVendorClass', v)}
                                            className="w-4 h-4 text-blue-900 focus:ring-blue-900"
                                        />
                                        {v}
                                    </label>
                                ))}
                            </Grid>
                        </Section>

                        {/* 18. TAN */}
                        <Section title="18. TAN">
                            <Input label="TAN Number" value={formData.tanNumber} onChange={(e) => update('tanNumber', e.target.value.toUpperCase())} placeholder="ABCD12345E" />
                            <FileUploadBox
                                label="TAN Photocopy (PDF)"
                                file={formData.tanDocument}
                                onChange={(file) => handleFileChange('tanDocument', file)}
                            />
                        </Section>

                        {/* 19. Registered with SMG */}
                        <Section title="19. Registered with SMG Electric">
                            <Grid cols={2}>
                                {["Yes", "No"].map(v => (
                                    <label key={v} className="flex items-center gap-2 text-sm">
                                        <input
                                            type="radio"
                                            name="registeredWithSMG"
                                            checked={formData.registeredWithSMG === v}
                                            onChange={() => update('registeredWithSMG', v)}
                                            className="w-4 h-4 text-blue-900 focus:ring-blue-900"
                                        />
                                        {v}
                                    </label>
                                ))}
                            </Grid>
                        </Section>

                        {/* 20. Mode of Material Supply */}
                        <Section title="20. Mode of Material Supply">
                            <Grid cols={3}>
                                {["By Road", "Courier", "Other"].map(v => (
                                    <CheckboxItem
                                        key={v}
                                        label={v}
                                        checked={formData.materialSupplyMode.includes(v)}
                                        onChange={() => handleCheckboxArray('materialSupplyMode', v)}
                                    />
                                ))}
                            </Grid>
                        </Section>

                        {/* 21. Mode of Transport */}
                        <Section title="21. Mode of Transport">
                            <Input value={formData.modeOfTransport} onChange={(e) => update('modeOfTransport', e.target.value)} placeholder="Specify transport mode" />
                        </Section>

                        {/* 22. Signature */}
                        <Section title="22. Signature of Vendor with Stamp">
                            <FileUploadBox
                                label="Signature (PDF)"
                                file={formData.signatureDocument}
                                onChange={(file) => handleFileChange('signatureDocument', file)}
                            />
                        </Section>
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div className="mt-6 flex items-center justify-between">
                <button
                    onClick={handlePrev}
                    disabled={currentStep === 1}
                    className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${currentStep === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100 bg-white border border-slate-200'}`}
                >
                    Previous Step
                </button>

                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={saveDraft}
                        className="px-6 py-2.5 text-slate-700 bg-white border-2 border-slate-300 rounded-lg font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2"
                    >
                        💾 Save as Draft
                    </button>
                    <button
                        onClick={currentStep === 5 ? handleSubmit : handleNext}
                        disabled={loading}
                        className="px-8 py-2.5 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {currentStep === 5 ? (
                            <>
                                <Save size={18} /> {loading ? 'Submitting...' : 'Submit Application'}
                            </>
                        ) : (
                            'Next Step'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VendorOnboardingReplica;

/* ------------------ REUSABLE COMPONENTS ------------------ */

const Section = ({ title, children }) => (
    <div className="border border-slate-200 rounded-lg p-6 bg-slate-50">
        <h3 className="font-semibold text-slate-800 mb-4 text-base">{title}</h3>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

const Grid = ({ cols = 3, children }) => (
    <div className={`grid grid-cols-1 md:grid-cols-${cols} gap-4`}>
        {children}
    </div>
);

const Input = ({ label, type = "text", value, onChange, placeholder, required }) => (
    <div>
        {label && (
            <label className="block text-sm font-medium text-slate-700 mb-1">
                {label}
            </label>
        )}
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all"
        />
    </div>
);

const Select = ({ label, options, value, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <select
            value={value}
            onChange={onChange}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all"
        >
            <option value="">Select</option>
            {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
    </div>
);

const CheckboxItem = ({ label, checked, onChange }) => (
    <label className="flex items-center gap-2 text-sm">
        <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="w-4 h-4 text-blue-900 bg-white border-slate-300 rounded focus:ring-2 focus:ring-blue-900"
        />
        <span className="text-slate-700">{label}</span>
    </label>
);

const FileUploadBox = ({ label, file, onChange }) => {
    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            onChange(selectedFile);
        }
    };

    return (
        <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 bg-white hover:bg-slate-50 transition-colors">
                <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    className="hidden"
                    id={`file-${label}`}
                />
                <label
                    htmlFor={`file-${label}`}
                    className="flex flex-col items-center justify-center cursor-pointer"
                >
                    <Upload size={32} className="text-slate-400 mb-2" />
                    {file ? (
                        <span className="text-sm font-medium text-blue-900">{file.name}</span>
                    ) : (
                        <>
                            <span className="text-sm font-medium text-slate-600">Click to upload</span>
                            <span className="text-xs text-slate-400 mt-1">PDF, JPG or PNG (Max 5MB)</span>
                        </>
                    )}
                </label>
            </div>
        </div>
    );
};
