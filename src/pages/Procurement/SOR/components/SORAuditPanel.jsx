import React from 'react';
import { X, Clock, User, CheckCircle, AlertCircle } from 'lucide-react';

const SORAuditPanel = ({ isOpen, onClose }) => {
    // Mock Audit Log
    const logs = [
        { id: 1, user: "System", action: "Auto-Validation Check passed", time: "10 mins ago", type: "system" },
        { id: 2, user: "Alex Chen", action: "Updated Target Price to $145.50", time: "2 hours ago", type: "user" },
        { id: 3, user: "Sarah Jones", action: "Approved Compliance Docs", time: "Yesterday, 4:30 PM", type: "user" },
        { id: 4, user: "System", action: "Record Created via API", time: "Dec 15, 09:00 AM", type: "system" },
    ];

    if (!isOpen) return null;

    return (
        <div className="w-80 border-l border-slate-200 bg-white h-full shadow-xl flex flex-col animate-in slide-in-from-right duration-300 absolute right-0 top-0 bottom-0 z-30">
            {/* Header */}
            <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6 bg-slate-50/50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Clock size={16} /> Audit Trail
                </h3>
                <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
                    <X size={16} className="text-slate-500" />
                </button>
            </div>

            {/* Timeline */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="relative border-l-2 border-slate-100 ml-3 space-y-8">
                    {logs.map((log) => (
                        <div key={log.id} className="relative pl-6">
                            {/* Dot */}
                            <div className={`absolute -left-[5px] top-1 w-3 h-3 rounded-full border-2 border-white shadow-sm ${log.type === 'system' ? 'bg-blue-400' : 'bg-slate-400'}`}></div>

                            <div className="flex flex-col gap-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-700">{log.user}</span>
                                    <span className="text-[10px] text-slate-400 font-mono">{log.time}</span>
                                </div>
                                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                                    {log.action}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Status */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 text-center">
                <p className="text-xs text-slate-400">Log retention: 90 Days</p>
            </div>
        </div>
    );
};

export default SORAuditPanel;
