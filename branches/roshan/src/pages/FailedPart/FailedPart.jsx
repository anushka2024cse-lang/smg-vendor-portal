import React from 'react';
import { ArrowLeft, Save, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FailedPart = () => {
    const navigate = useNavigate();

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate('/requests')}
                    className="p-2 hover:bg-white rounded-full transition-colors text-gray-500 hover:text-[#1B365D]"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-[#1B365D]">Report Failed Part</h1>
                    <p className="text-gray-500">Log a defective part for analysis</p>
                </div>
            </div>

            <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex gap-3 text-red-800">
                <AlertTriangle size={20} className="shrink-0 mt-0.5" />
                <p className="text-sm">Please ensure the Failed Part Tag is securely attached to the physical part before submitting this form.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="font-semibold text-gray-800">Part Details</h2>
                </div>
                <div className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Failed Tag ID <span className="text-red-500">*</span></label>
                        <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B365D]/20 focus:border-[#1B365D]" placeholder="Enter Tag ID from the red tag" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Part Number</label>
                            <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B365D]/20 focus:border-[#1B365D]" placeholder="e.g. 89-001" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Quantity</label>
                            <input type="number" defaultValue="1" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B365D]/20 focus:border-[#1B365D]" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Vendor / Supplier</label>
                        <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B365D]/20 focus:border-[#1B365D]" placeholder="Vendor Name" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Reason for Failure</label>
                        <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B365D]/20 focus:border-[#1B365D] bg-white">
                            <option>Select Reason</option>
                            <option>Manufacturing Defect</option>
                            <option>Transit Damage</option>
                            <option>Installation Error</option>
                            <option>Wrong Material</option>
                            <option>Other</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Remarks</label>
                        <textarea rows="3" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B365D]/20 focus:border-[#1B365D]" placeholder="Additional notes..."></textarea>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <button
                    type="button"
                    onClick={() => navigate('/requests')}
                    className="px-6 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    className="px-6 py-2.5 rounded-lg bg-[#1B365D] text-white font-medium hover:bg-[#152a48] transition-colors flex items-center gap-2"
                >
                    <Save size={18} />
                    Submit Report
                </button>
            </div>
        </div>
    );
};

export default FailedPart;
