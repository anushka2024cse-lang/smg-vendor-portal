import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Layers,
    Clock,
    CheckCircle,
    AlertTriangle,
    MoreVertical,
    X,
    Save,
    Calendar
} from 'lucide-react';
import { diePlanService } from '../../services/diePlanService';
import Pagination from '../../components/Pagination';

const DiePlan = () => {
    const [stats, setStats] = useState({ total: 0, inDevelopment: 0, completed: 0, delayed: 0 });
    const [plans, setPlans] = useState([]);
    const [filteredPlans, setFilteredPlans] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [pagination, setPagination] = useState({});

    const [formData, setFormData] = useState({
        partName: '',
        vendor: '',
        stage: 'Design',
        startDate: '',
        targetDate: ''
    });

    const stages = ['Design', 'Raw Material', 'Machining', 'Assembly', 'Trials T0', 'Trials T1', 'PPAP', 'Production'];

    useEffect(() => {
        loadData();
    }, [currentPage, itemsPerPage]);

    useEffect(() => {
        filterData();
    }, [searchTerm, statusFilter, plans]);

    useEffect(() => {
        const handleClickOutside = () => {
            if (selectedPlan && !isEditModalOpen && !isDetailsModalOpen) setSelectedPlan(null);
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [selectedPlan, isEditModalOpen, isDetailsModalOpen]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [statsData, response] = await Promise.all([
                diePlanService.getStats(),
                diePlanService.getAllPlans({ page: currentPage, limit: itemsPerPage })
            ]);
            setStats(statsData);
            setPlans(response.data || []);
            setPagination(response.pagination || {});
        } catch (error) {
            console.error('Failed to load die plans:', error);
            setPlans([]);
        } finally {
            setLoading(false);
        }
    };

    const filterData = () => {
        if (!plans || plans.length === 0) {
            setFilteredPlans([]);
            return;
        }

        let result = plans;
        if (statusFilter !== 'All') {
            result = result.filter(p => p && p.status === statusFilter);
        }
        if (searchTerm) {
            result = result.filter(p =>
                p && (
                    (p.id && p.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (p.partName && p.partName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (p.vendor && p.vendor.toLowerCase().includes(searchTerm.toLowerCase()))
                )
            );
        }
        setFilteredPlans(result);
    };

    const handleCreateSubmit = async () => {
        try {
            await diePlanService.createPlan(formData);
            setIsCreateModalOpen(false);
            setFormData({ vendor: '', partName: '', stage: 'Design', startDate: '', targetDate: '' });
            loadData();
        } catch (error) {
            alert('Failed to create die plan');
        }
    };

    const handleEditSubmit = async () => {
        try {
            // Map frontend field names to backend schema
            const updateData = {
                vendorName: formData.vendor,
                partName: formData.partName,
                stage: formData.stage,
                startDate: formData.startDate,
                targetDate: formData.targetDate
            };
            await diePlanService.updatePlan(selectedPlan._id, updateData);
            setIsEditModalOpen(false);
            setFormData({ vendor: '', partName: '', stage: 'Design', startDate: '', targetDate: '' });
            setSelectedPlan(null);
            loadData();
        } catch (error) {
            alert('Failed to update die plan');
        }
    };

    const handleDelete = async (plan) => {
        if (window.confirm(`Are you sure you want to delete die plan ${plan.id}?`)) {
            try {
                await diePlanService.deletePlan(plan._id);
                loadData();
            } catch (error) {
                alert('Failed to delete plan');
            }
        }
    };

    const openEditModal = (plan) => {
        setSelectedPlan(plan);
        setFormData({
            vendor: plan.vendor,
            partName: plan.partName,
            stage: plan.stage,
            startDate: plan.startDate || '',
            targetDate: plan.targetDate || ''
        });
        setIsEditModalOpen(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
            case 'On Track': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Delayed': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Die Development Plan</h1>
                    <p className="text-slate-500 mt-1">Track and manage tool & die development status</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-all shadow-md font-medium"
                >
                    <Plus size={18} />
                    New Die Plan
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white border border-slate-200 rounded-xl p-6 flex justify-between items-center shadow-sm">
                    <div>
                        <p className="text-slate-500 font-semibold text-xs uppercase tracking-wide">Total Dies</p>
                        <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</h3>
                    </div>
                    <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center">
                        <Layers size={20} />
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-6 flex justify-between items-center shadow-sm">
                    <div>
                        <p className="text-blue-600 font-semibold text-xs uppercase tracking-wide">In Development</p>
                        <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.inDevelopment}</h3>
                    </div>
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                        <Clock size={20} />
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-6 flex justify-between items-center shadow-sm">
                    <div>
                        <p className="text-green-600 font-semibold text-xs uppercase tracking-wide">Completed</p>
                        <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.completed}</h3>
                    </div>
                    <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                        <CheckCircle size={20} />
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-6 flex justify-between items-center shadow-sm">
                    <div>
                        <p className="text-red-600 font-semibold text-xs uppercase tracking-wide">Delayed</p>
                        <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.delayed}</h3>
                    </div>
                    <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center">
                        <AlertTriangle size={20} />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by part name, die #, vendor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all text-sm"
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none cursor-pointer"
                    >
                        <option value="All">All Status</option>
                        <option value="On Track">On Track</option>
                        <option value="Delayed">Delayed</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Part Name / Die ID</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Vendor</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-1/4">Stage & Progress</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Target Date</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredPlans.length > 0 ? (
                            filteredPlans.map((plan) => (
                                <tr key={plan.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-slate-900">{plan.partName}</span>
                                            <span className="text-xs text-blue-600 font-mono">{plan.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{plan.vendor}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="font-semibold text-slate-700">{plan.stage}</span>
                                                <span className="text-slate-500">{plan.progress}%</span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-500 ${plan.status === 'Delayed' ? 'bg-red-500' : 'bg-blue-600'
                                                        }`}
                                                    style={{ width: `${plan.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500 flex items-center gap-1.5 pt-6">
                                        <Calendar size={14} /> {plan.targetDate}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(plan.status)}`}>
                                            {plan.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right relative">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedPlan(selectedPlan?._id === plan._id ? null : plan);
                                            }}
                                            className="text-slate-400 hover:text-blue-600 transition-colors p-1 rounded hover:bg-blue-50"
                                        >
                                            <MoreVertical size={18} />
                                        </button>
                                        {selectedPlan?._id === plan._id && (
                                            <div className="absolute right-0 top-12 w-32 bg-white border border-slate-200 shadow-lg rounded-lg z-10 p-1">
                                                <button onClick={() => { setIsDetailsModalOpen(true); }} className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-md">
                                                    View Details
                                                </button>
                                                <button onClick={() => { openEditModal(plan); setSelectedPlan(null); }} className="w-full text-left px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-md">
                                                    Edit
                                                </button>
                                                <button onClick={(e) => { e.stopPropagation(); handleDelete(plan); setSelectedPlan(null); }} className="w-full text-left px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md">
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                    No Die Plans found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                {pagination.totalItems > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={pagination.totalPages || 1}
                        onPageChange={(page) => setCurrentPage(page)}
                        itemsPerPage={itemsPerPage}
                        onItemsPerPageChange={(limit) => {
                            setItemsPerPage(limit);
                            setCurrentPage(1);
                        }}
                        totalItems={pagination.totalItems || 0}
                    />
                )}
            </div>

            {/* Create Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-slate-900">New Die Development Plan</h2>
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Vendor</label>
                                <select
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                                    value={formData.vendor}
                                    onChange={e => setFormData({ ...formData, vendor: e.target.value })}
                                >
                                    <option value="">Select Vendor</option>
                                    <option value="Meenakshi Polymers">Meenakshi Polymers</option>
                                    <option value="NeoSky India">NeoSky India</option>
                                    <option value="Alpha Tech">Alpha Tech</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Part Name</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                                    placeholder="e.g. Rear Fender Casing"
                                    value={formData.partName}
                                    onChange={e => setFormData({ ...formData, partName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Initial Stage</label>
                                <select
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                                    value={formData.stage}
                                    onChange={e => setFormData({ ...formData, stage: e.target.value })}
                                >
                                    {stages.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Start Date</label>
                                    <input
                                        type="date"
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                                        value={formData.startDate}
                                        onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Target Date</label>
                                    <input
                                        type="date"
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                                        value={formData.targetDate}
                                        onChange={e => setFormData({ ...formData, targetDate: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateSubmit}
                                className="px-4 py-2 bg-blue-800 text-white font-medium rounded-lg hover:bg-blue-900 transition-colors flex items-center gap-2"
                            >
                                <Save size={18} />
                                Create Plan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-slate-900">Edit Die Development Plan</h2>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Vendor</label>
                                <select
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                                    value={formData.vendor}
                                    onChange={e => setFormData({ ...formData, vendor: e.target.value })}
                                >
                                    <option value="">Select Vendor</option>
                                    <option value="Meenakshi Polymers">Meenakshi Polymers</option>
                                    <option value="NeoSky India">NeoSky India</option>
                                    <option value="Alpha Tech">Alpha Tech</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Part Name</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                                    placeholder="e.g. Rear Fender Casing"
                                    value={formData.partName}
                                    onChange={e => setFormData({ ...formData, partName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Current Stage</label>
                                <select
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                                    value={formData.stage}
                                    onChange={e => setFormData({ ...formData, stage: e.target.value })}
                                >
                                    {stages.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Start Date</label>
                                    <input
                                        type="date"
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                                        value={formData.startDate}
                                        onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Target Date</label>
                                    <input type="date" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm" value={formData.targetDate} onChange={e => setFormData({ ...formData, targetDate: e.target.value })} />
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                            <button onClick={() => { setIsEditModalOpen(false); setFormData({ vendor: '', partName: '', stage: 'Design', startDate: '', targetDate: '' }); }} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
                            <button onClick={handleEditSubmit} className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"><Save size={18} />Update Plan</button>
                        </div>
                    </div>
                </div >
            )}

            {/* Details Modal */}
            {
                isDetailsModalOpen && selectedPlan && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="flex items-center justify-between p-6 border-b border-slate-100">
                                <h2 className="text-xl font-bold text-slate-900">Die Plan Details</h2>
                                <button onClick={() => setIsDetailsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div><p className="text-xs text-slate-500 uppercase">Plan ID</p><p className="text-sm font-medium">{selectedPlan.id}</p></div>
                                    <div><p className="text-xs text-slate-500 uppercase">Status</p><p className="text-sm font-medium">{selectedPlan.status}</p></div>
                                    <div><p className="text-xs text-slate-500 uppercase">Vendor</p><p className="text-sm font-medium">{selectedPlan.vendor}</p></div>
                                    <div><p className="text-xs text-slate-500 uppercase">Part Name</p><p className="text-sm font-medium">{selectedPlan.partName}</p></div>
                                    <div><p className="text-xs text-slate-500 uppercase">Current Stage</p><p className="text-sm font-medium">{selectedPlan.stage}</p></div>
                                    <div><p className="text-xs text-slate-500 uppercase">Progress</p><p className="text-sm font-medium">{selectedPlan.progress}%</p></div>
                                    <div><p className="text-xs text-slate-500 uppercase">Start Date</p><p className="text-sm font-medium">{selectedPlan.startDate}</p></div>
                                    <div><p className="text-xs text-slate-500 uppercase">Target Date</p><p className="text-sm font-medium">{selectedPlan.targetDate}</p></div>
                                </div>
                            </div>
                            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                                <button onClick={() => { setIsEditModalOpen(false); setFormData({ vendor: '', partName: '', stage: 'Design', startDate: '', targetDate: '' }); }} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
                                <button onClick={handleEditSubmit} className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"><Save size={18} />Update Plan</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default DiePlan;
