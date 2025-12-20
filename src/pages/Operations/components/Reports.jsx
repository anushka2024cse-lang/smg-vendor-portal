import React from 'react';
import { FileBarChart, Download, FileCheck } from 'lucide-react';

const Reports = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center text-center h-[400px]">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <FileBarChart className="text-[#1B365D]" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-[#1B365D] mb-2">Operations Reports</h2>
            <p className="text-gray-500 max-w-md mb-8">
                Generate and download detailed reports for production schedules, inventory status, and green certificates.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
                <button className="flex items-center justify-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-[#1B365D] hover:bg-blue-50/50 transition-all group">
                    <FileCheck className="text-green-600" size={24} />
                    <div className="text-left">
                        <span className="block font-semibold text-gray-800 group-hover:text-[#1B365D]">Green Certificate</span>
                        <span className="block text-xs text-gray-500">Download PDF</span>
                    </div>
                </button>
                <button className="flex items-center justify-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-[#1B365D] hover:bg-blue-50/50 transition-all group">
                    <Download className="text-[#1B365D]" size={24} />
                    <div className="text-left">
                        <span className="block font-semibold text-gray-800 group-hover:text-[#1B365D]">Monthly Summary</span>
                        <span className="block text-xs text-gray-500">Export CSV</span>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default Reports;
