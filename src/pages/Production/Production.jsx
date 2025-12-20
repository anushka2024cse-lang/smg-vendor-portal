import React, { useState } from 'react';
import { AreaChart, Save, Trash2, MoreHorizontal, History as HistoryIcon } from 'lucide-react';

const Production = () => {
    const [modelInput, setModelInput] = useState('');
    const [history, setHistory] = useState([
        { id: 1, model: 'Honda Activa 6G', savedAt: 'Nov 12, 2025, 1:48:50 AM' },
        { id: 2, model: 'SMG ELECTRIC SCOOTER', savedAt: 'Nov 10, 2025, 9:12:30 PM' },
        { id: 3, model: 'TESLA 3', savedAt: 'Nov 9, 2025, 10:30:32 PM' },
        { id: 4, model: 'SMG ELECTRIC SCOOTER', savedAt: 'Nov 9, 2025, 9:59:35 PM' },
    ]);

    const handleGenerate = () => {
        if (!modelInput.trim()) return;

        const newEntry = {
            id: Date.now(),
            model: modelInput,
            savedAt: new Date().toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: true
            })
        };

        setHistory([newEntry, ...history]);
        setModelInput('');
    };

    const handleClearHistory = () => {
        setHistory([]);
    };

    return (
        <div className="p-6 text-muted-foreground w-full">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <AreaChart size={32} className="text-white" />
                <div>
                    <p className="text-sm text-slate-400 font-medium">Material Management Portal</p>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Production Assistant</h1>
                </div>
            </div>

            {/* Generate Production Data Section */}
            <div className="bg-[#1f2533] p-6 rounded-xl border border-slate-800 mb-8">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-white mb-2">Generate Production Data</h2>
                    <p className="text-sm text-slate-400">Enter a vehicle model (e.g., "Tesla Model Y" or "Honda Activa 6G") to generate its bill of materials, production process, and material specifications.</p>
                </div>

                <div className="flex gap-4 max-w-3xl">
                    <input
                        type="text"
                        value={modelInput}
                        onChange={(e) => setModelInput(e.target.value)}
                        placeholder="Enter a vehicle model here..."
                        className="flex-1 bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-slate-500 text-sm transition-all"
                    />
                    <button
                        onClick={handleGenerate}
                        className="flex items-center gap-2 bg-slate-200 text-slate-900 px-6 py-3 rounded-lg text-sm font-bold hover:bg-white transition-colors"
                    >
                        <Save size={18} />
                        <span>Generate & Save</span>
                    </button>
                </div>
            </div>

            {/* Production History Section */}
            <div className="bg-[#1f2533] rounded-xl border border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <HistoryIcon className="text-slate-400" size={20} />
                            <h2 className="text-lg font-semibold text-white">Production History</h2>
                        </div>
                        <p className="text-sm text-slate-400">Previously generated and saved production data.</p>
                    </div>

                    <button
                        onClick={handleClearHistory}
                        className="flex items-center gap-2 text-slate-400 hover:text-white border border-slate-700 rounded-lg px-4 py-2 text-xs font-medium hover:bg-white/5 transition-colors"
                    >
                        <Trash2 size={14} />
                        <span>Clear History</span>
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-800">
                            <tr>
                                <th className="px-6 py-4 font-semibold tracking-wider opacity-90">Model</th>
                                <th className="px-6 py-4 font-semibold tracking-wider opacity-90">Saved At</th>
                                <th className="px-6 py-4 font-semibold text-right tracking-wider opacity-90">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {history.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-10 text-center text-slate-500">
                                        No history found.
                                    </td>
                                </tr>
                            ) : (
                                history.map((item) => (
                                    <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-white group-hover:text-white transition-colors">{item.model}</td>
                                        <td className="px-6 py-4 text-slate-400">{item.savedAt}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-500 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors">
                                                <MoreHorizontal size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Production;
