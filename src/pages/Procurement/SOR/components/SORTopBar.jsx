import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Share2, LayoutPanelLeft, ArrowLeft } from 'lucide-react';

const SORTopBar = ({ record, isEditMode, toggleEditMode, toggleAuditPanel }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white border-b border-slate-200 px-6 py-5 mb-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 max-w-7xl mx-auto">

                {/* Left: Title & Info */}
                <div>
                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/sor/list')}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-3 transition-colors text-sm font-medium"
                    >
                        <ArrowLeft size={16} />
                        Back to SOR List
                    </button>

                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            {record.title || "New SOR"}
                        </h1>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wide">
                            {record.status}
                        </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                        <span className="font-mono text-slate-600">{record.id}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span>Rev 2.1</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span>Last Edited: {record.date || "Just now"}</span>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium text-sm">
                        <LayoutPanelLeft size={16} />
                        Compare
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium text-sm">
                        <Share2 size={16} />
                        Export
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-all shadow-md hover:shadow-lg font-medium text-sm">
                        Submit to Vendor
                        <ChevronRight size={16} />
                    </button>
                </div>

            </div>

            {/* Progress Bar (Optional - kept subtle) */}
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-slate-100">
                <div
                    className="h-full bg-blue-600 transition-all duration-500"
                    style={{ width: `${record.progress || 0}%` }}
                ></div>
            </div>
        </div>
    );
};

export default SORTopBar;
