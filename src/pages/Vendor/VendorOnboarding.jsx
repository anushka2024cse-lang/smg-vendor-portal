import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Check, Upload, Building, CreditCard, FileCheck, Truck, Save } from 'lucide-react';

const VendorOnboarding = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);

    const steps = [
        { id: 1, label: 'Identity Details', icon: Building },
        { id: 2, label: 'Address & Contact', icon: Truck },
        { id: 3, label: 'Finance & Bank', icon: CreditCard },
        { id: 4, label: 'Compliance (Tax)', icon: FileCheck },
    ];

    const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 4));
    const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    return (
        <div className="p-8 max-w-5xl mx-auto min-h-screen">

            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => navigate('/vendor/list')}
                    className="flex items-center gap-1 text-sm text-slate-500 hover:text-blue-900 transition-colors mb-2"
                >
                    <ChevronLeft size={16} /> Back to Directory
                </button>
                <h1 className="text-3xl font-bold text-slate-900">New Vendor Registration</h1>
                <p className="text-slate-500 mt-1">Complete the onboarding wizard to register a new supplier.</p>
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
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 min-h-[400px]">

                {/* STEP 1: IDENTITY */}
                {currentStep === 1 && (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                        <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3">Company Identity</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Company Name *</label>
                                <input type="text" placeholder="e.g. Meenakshi Polymers" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Business Type *</label>
                                <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none">
                                    <option>Private Limited</option>
                                    <option>Public Limited</option>
                                    <option>Proprietorship</option>
                                    <option>Partnership</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Proprietor / MD Name</label>
                                <input type="text" placeholder="Full Name" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Staff Strength</label>
                                <input type="number" placeholder="e.g. 50" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none" />
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 2: ADDRESS */}
                {currentStep === 2 && (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                        <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3">Address & Logistics</h2>

                        {/* Registered Office */}
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2"><Building size={16} /> Registered Office</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <input type="text" placeholder="Street Address / Plot No" className="w-full p-2.5 bg-white border border-slate-200 rounded-lg outline-none" />
                                </div>
                                <input type="text" placeholder="City" className="w-full p-2.5 bg-white border border-slate-200 rounded-lg outline-none" />
                                <input type="text" placeholder="State" className="w-full p-2.5 bg-white border border-slate-200 rounded-lg outline-none" />
                                <input type="text" placeholder="Pincode" className="w-full p-2.5 bg-white border border-slate-200 rounded-lg outline-none" />
                                <input type="text" placeholder="Nearest Railway Station" className="w-full p-2.5 bg-white border border-slate-200 rounded-lg outline-none" />
                            </div>
                        </div>

                        {/* Dispatch Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Preferred Transport</label>
                                <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none">
                                    <option>By Road</option>
                                    <option>Courier</option>
                                    <option>Rail</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Product Range</label>
                                <input type="text" placeholder="e.g. Plastic Molded Parts" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none" />
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 3: FINANCE */}
                {currentStep === 3 && (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                        <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3">Financial Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Currency</label>
                                <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none">
                                    <option>INR (Indian Rupee)</option>
                                    <option>USD (US Dollar)</option>
                                    <option>EUR (Euro)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Payment Terms</label>
                                <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none">
                                    <option>Net 30 Days</option>
                                    <option>Net 45 Days</option>
                                    <option>Advance</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Bank Name</label>
                                <input type="text" placeholder="e.g. HDFC Bank" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Account Number</label>
                                <input type="text" placeholder="XXXXXXXXXXXXXXXX" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">IFSC Code</label>
                                <input type="text" placeholder="HDFC0001234" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none" />
                            </div>

                            {/* Upload Cancelled Cheque */}
                            <div className="md:col-span-2 border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-slate-500 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                                <Upload size={32} className="mb-2 text-slate-400" />
                                <span className="text-sm font-medium">Upload Cancelled Cheque</span>
                                <span className="text-xs text-slate-400 mt-1">PDF, JPG or PNG up to 5MB</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 4: COMPLIANCE */}
                {currentStep === 4 && (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                        <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3">Tax & Compliance</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">PAN Number *</label>
                                <input type="text" placeholder="ABCDE1234F" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">TAN Number</label>
                                <input type="text" placeholder="ABCD12345E" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">GST Registration Status</label>
                                <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none">
                                    <option>Registered</option>
                                    <option>Unregistered</option>
                                    <option>Composition Scheme</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">GST Number</label>
                                <input type="text" placeholder="07AABCT..." className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none" />
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-medium text-slate-700">MSME / Udyam Registration (Optional)</label>
                                <input type="text" placeholder="UDYAM-XX-..." className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none" />
                            </div>
                        </div>
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
                    <button className="px-6 py-2.5 text-slate-600 hover:text-slate-900 font-medium transition-colors">
                        Save as Draft
                    </button>
                    <button
                        onClick={currentStep === 4 ? () => { } : handleNext}
                        className="px-8 py-2.5 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                    >
                        {currentStep === 4 ? (
                            <>
                                <Save size={18} /> Submit Application
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

export default VendorOnboarding;
