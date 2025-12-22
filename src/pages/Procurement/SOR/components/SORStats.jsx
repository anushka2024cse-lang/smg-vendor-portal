import React from 'react';
import { Activity, ShieldCheck, Database, FileText } from 'lucide-react';

const SORStats = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {/* KPI Card 3: Requirements Count */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase">Requirements</span>
                    <Database size={16} className="text-purple-500" />
                </div>
                <div className="mt-2">
                    <span className="text-2xl font-bold text-slate-800 tracking-tight">42</span>
                    <span className="text-[10px] text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded ml-2 font-medium">Total</span>
                </div>
            </div>

            {/* KPI Card 4: Current Phase */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase">Current Phase</span>
                    <FileText size={16} className="text-amber-500" />
                </div>
                <div className="mt-2">
                    <span className="text-2xl font-bold text-slate-800 tracking-tight">Tech Review</span>
                    <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded ml-2 font-medium">In Progress</span>
                </div>
            </div>

            {/* KPI Card 1: Audit */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase">Last Audit</span>
                    <Activity size={16} className="text-emerald-500" />
                </div>
                <div className="mt-2">
                    <span className="text-2xl font-bold text-slate-800 tracking-tight">{stats.lastAudit}</span>
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded ml-2 font-medium">Passed</span>
                </div>
            </div>

            {/* KPI Card 2: Integrity */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase">Data Integrity</span>
                    <ShieldCheck size={16} className="text-blue-500" />
                </div>
                <div className="mt-2">
                    <span className="text-2xl font-bold text-slate-800 tracking-tight">{stats.dataIntegrity}%</span>
                    <span className="text-xs text-slate-400 ml-1">Verified</span>
                </div>
            </div>

        </div>
    );
};

export default SORStats;
