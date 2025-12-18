import React, { useState } from 'react';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WarrantyClaim = () => {
    const navigate = useNavigate();

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate('/requests')}
                    className="p-2 hover:bg-white rounded-full transition-colors text-gray-500 hover:text-[#1B365D]"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-[#1B365D]">New Warranty Claim</h1>
                    <p className="text-gray-500">Submit a claim for a defective vehicle part</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="font-semibold text-gray-800">Vehicle Information</h2>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Vehicle Registration No.</label>
                        <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B365D]/20 focus:border-[#1B365D]" placeholder="e.g. MH-02-AB-1234" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Vehicle Model</label>
                        <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B365D]/20 focus:border-[#1B365D] bg-white">
                            <option>Select Model</option>
                            <option>Maruti Swift</option>
                            <option>Toyota Glanza</option>
                            <option>Hyundai Creta</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Chassis Number</label>
                        <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B365D]/20 focus:border-[#1B365D]" placeholder="Enter Chassis No." />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Odometer Reading (km)</label>
                        <input type="number" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B365D]/20 focus:border-[#1B365D]" placeholder="e.g. 15000" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="font-semibold text-gray-800">Claim Details</h2>
                </div>
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Part Name / Number</label>
                            <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B365D]/20 focus:border-[#1B365D]" placeholder="e.g. Alternator / ALT-232" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Failure Date</label>
                            <input type="date" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B365D]/20 focus:border-[#1B365D]" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Problem Description</label>
                        <textarea rows="4" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B365D]/20 focus:border-[#1B365D]" placeholder="Describe the issue in detail..."></textarea>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Upload Photos</label>
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-[#1B365D] hover:bg-[#1B365D]/5 transition-colors cursor-pointer group">
                            <div className="p-3 bg-gray-50 rounded-full group-hover:bg-white transition-colors mb-3">
                                <Upload size={24} className="text-gray-400 group-hover:text-[#1B365D]" />
                            </div>
                            <p className="text-sm text-gray-900 font-medium">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                        </div>
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
                    Submit Claim
                </button>
            </div>
        </div>
    );
};

export default WarrantyClaim;
