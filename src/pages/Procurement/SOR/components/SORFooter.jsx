import React from 'react';
import { AlertTriangle, Check, X } from 'lucide-react';

const SORFooter = () => {
    return (
        <div className="h-16 bg-white border-t border-amber-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] flex items-center justify-between px-8 animate-in slide-in-from-bottom duration-300 z-30 relative">

            <div className="flex items-center gap-3">
                <AlertTriangle size={20} className="text-amber-500" />
                <span className="text-sm font-semibold text-slate-700">
                    Unsaved Changes Detected...
                </span>
                <span className="text-xs text-slate-400 hidden md:inline ml-2">
                    Last draft saved 2 mins ago
                </span>
            </div>

            <div className="flex items-center gap-4">
                <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2">
                    <X size={16} /> Discard
                </button>
                <button className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                    <Check size={16} /> Commit Changes
                </button>
            </div>

        </div>
    );
};

export default SORFooter;
