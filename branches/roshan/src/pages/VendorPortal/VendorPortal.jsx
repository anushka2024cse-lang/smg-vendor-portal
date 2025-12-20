import React, { useState } from 'react';
import { Search } from 'lucide-react';

const VendorPortal = () => {
    return (
        <div className="p-6 text-slate-300">
            <div className="flex items-center gap-2 mb-6">
                <p className="text-xl">📄</p>
                <h1 className="text-2xl font-bold text-white">Vendor Portal</h1>
            </div>

            {/* View Transaction History */}
            <div className="bg-[#0F172A] p-8 rounded-xl border border-slate-700/50 mb-8 min-h-[400px]">
                <h2 className="text-xl font-semibold text-white mb-2">View Transaction History</h2>
                <p className="text-sm text-slate-400 mb-8">Enter your vendor code to view your receiving and dispatch history.</p>

                <div className="max-w-xl">
                    <label className="block text-sm font-medium mb-2 text-slate-300">Vendor Code</label>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Enter your unique vendor code"
                            className="flex-1 bg-[#1E293B] border border-slate-700/50 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                        <button className="flex items-center gap-2 bg-slate-200 text-slate-900 px-6 py-2.5 rounded-lg font-medium hover:bg-white transition-colors">
                            <Search size={18} />
                            View History
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorPortal;
