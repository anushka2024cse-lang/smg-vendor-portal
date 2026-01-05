import React, { useState, useEffect } from 'react';
import {
    Plus, Search, Filter, Eye, Edit, Trash2,
    MoreHorizontal, Calendar, ArrowRight
} from 'lucide-react';
import { diePlanService } from '../../services/diePlanService';
import DiePlanSheet from './DiePlanSheet';

const DiePlan = () => {
    const [view, setView] = useState('list'); // 'list', 'create', 'view', 'edit'
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            setLoading(true);
            const response = await diePlanService.getAllPlans({ limit: 50 });
            setPlans(response.data || []);
        } catch (error) {
            console.error("Error fetching plans:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedPlan(null);
        setView('create');
    };

    const handleView = (plan) => {
        setSelectedPlan(plan);
        setView('view');
    };

    const handleEdit = (plan) => {
        setSelectedPlan(plan);
        setView('edit');
    };

    const handleBack = () => {
        setView('list');
        setSelectedPlan(null);
        fetchPlans(); // Refresh list on return
    };

    if (view !== 'list') {
        return (
            <DiePlanSheet
                mode={view}
                plan={selectedPlan}
                onBack={handleBack}
            />
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Die Plan Registry</h1>
                        <p className="text-slate-500 mt-1">Central repository for all Die Design Release Notes and Plans.</p>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 font-medium transition-colors shadow-sm"
                    >
                        <Plus size={18} />
                        <span>Create New Plan</span>
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center">
                    <div className="relative flex-1 min-w-[240px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search plans..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-all">
                        <Filter size={18} />
                        <span className="text-sm font-medium">Filters</span>
                    </button>
                </div>

                {/* List Table */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Plan ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Part Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Vendor</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Dates</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 text-right uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {plans.map((plan) => (
                                <tr key={plan.id} className="hover:bg-blue-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
                                            {plan.id}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-slate-900">{plan.partName}</div>
                                        <div className="text-xs text-slate-500">Mod: {plan.mod || '-'}</div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{plan.vendor || 'Unknown'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                                            ${plan.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-100' :
                                                plan.status === 'Design' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                    'bg-yellow-50 text-yellow-700 border-yellow-100'}`}>
                                            {plan.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <Calendar size={14} />
                                            <span>{plan.targetDate ? new Date(plan.targetDate).toLocaleDateString() : '-'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleView(plan)}
                                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(plan)}
                                                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {plans.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                        No plans found. Create one to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DiePlan;
