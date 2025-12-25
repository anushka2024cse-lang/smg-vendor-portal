import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    FileText,
    Clock,
    Truck,
    MoreVertical,
    X,
    Save
} from 'lucide-react';
import { hsrpService } from '../../services/hsrpService';
import Pagination from '../../components/Pagination';

const HSRPRequests = () => {
    const [stats, setStats] = useState({ total: 0, pending: 0, dispatched: 0 });
    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [pagination, setPagination] = useState({});

    const [formData, setFormData] = useState({
        vendor: '',
        model: '',
        regNumber: '',
        chassis: '',
        engine: '',
        priority: 'Normal'
    });

    useEffect(() => {
        loadData();
    }, [currentPage, itemsPerPage]);

    useEffect(() => {
        filterData();
    }, [searchTerm, statusFilter, requests]);

    useEffect(() => {
        const handleClickOutside = () => {
            if (selectedRequest) setSelectedRequest(null);
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [selectedRequest]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [statsData, response] = await Promise.all([
                hsrpService.getStats(),
                hsrpService.getAllRequests({ page: currentPage, limit: itemsPerPage })
            ]);
            setStats(statsData);
            setRequests(response.data || []);
            setPagination(response.pagination || {});
        } catch (error) {
            console.error('Failed to load HSRP requests:', error);
            setRequests([]);
        } finally {
            setLoading(false);
        }
    };

    const filterData = () => {
        if (!requests || requests.length === 0) {
            setFilteredRequests([]);
            return;
        }

        let result = requests;
        if (statusFilter !== 'All') {
            result = result.filter(r => r && r.status === statusFilter);
        }
        if (searchTerm) {
            result = result.filter(r =>
                r && (
                    (r.id && r.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (r.vendor && r.vendor.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (r.model && r.model.toLowerCase().includes(searchTerm.toLowerCase()))
                )
            );
        }
        setFilteredRequests(result);
    };

    const handleCreateSubmit = async () => {
        try {
            await hsrpService.createRequest(formData);
            setIsCreateModalOpen(false);
            setFormData({ vendor: '', model: '', regNumber: '', chassis: '', engine: '', priority: 'Normal' });
            loadData();
        } catch (error) {
            alert('Failed to create HSRP request');
        }
    };

    const handleEditSubmit = async () => {
        try {
            // Map frontend field names to backend schema
            const updateData = {
                vendorName: formData.vendor,
                vehicleModel: formData.model,
                regNumber: formData.regNumber,
                chassisNumber: formData.chassis,
                engineNumber: formData.engine
            };
            await hsrpService.updateRequest(selectedRequest._id, updateData);
            setIsEditModalOpen(false);
            setFormData({ vendor: '', model: '', regNumber: '', chassis: '', engine: '', priority: 'Normal' });
            setSelectedRequest(null);
            loadData();
        } catch (error) {
            alert('Failed to update HSRP request');
        }
    };

    const handleDelete = async (request) => {
        if (window.confirm(`Are you sure you want to delete HSRP request ${request.id}?`)) {
            try {
                await hsrpService.deleteRequest(request._id);
                loadData();
            } catch (error) {
                alert('Failed to delete request');
            }
        }
    };

    const openEditModal = (request) => {
        setSelectedRequest(request);
        setFormData({
            vendor: request.vendor,
            model: request.model,
            regNumber: request.regNumber,
            chassis: request.chassis || '',
            engine: request.engine || '',
            priority: request.priority || 'Normal'
        });
        setIsEditModalOpen(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Dispatched': return 'bg-green-100 text-green-700 border-green-200';
            case 'Pending': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">HSRP Requests</h1>
                    <p className="text-slate-500 mt-1">Manage High Security Registration Plate requests</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-all shadow-md font-medium"
                >
                    <Plus size={18} />
                    New Request
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex justify-between items-center">
                    <div>
                        <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide">Total Requests</p>
                        <h3 className="text-3xl font-bold text-slate-900 mt-2">{stats.total}</h3>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                        <FileText size={24} />
                    </div>
                </div>
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-6 flex justify-between items-center">
                    <div>
                        <p className="text-orange-600 font-semibold text-sm uppercase tracking-wide">Pending Approval</p>
                        <h3 className="text-3xl font-bold text-slate-900 mt-2">{stats.pending}</h3>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                        <Clock size={24} />
                    </div>
                </div>
                <div className="bg-green-50 border border-green-100 rounded-xl p-6 flex justify-between items-center">
                    <div>
                        <p className="text-green-600 font-semibold text-sm uppercase tracking-wide">Dispatched</p>
                        <h3 className="text-3xl font-bold text-slate-900 mt-2">{stats.dispatched}</h3>
                    </div>
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                        <Truck size={24} />
                    </div>
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by request #, vendor, batch..."
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
                        <option value="Pending">Pending</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Request ID</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Vendor</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Vehicle Reg #</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Model</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredRequests.length > 0 ? (
                            filteredRequests.map((req) => (
                                <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs font-medium text-blue-600">{req.id}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{req.vendor}</td>
                                    <td className="px-6 py-4 text-sm font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded w-fit">{req.regNumber}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{req.model}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{req.date}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(req.status)}`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right relative">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedRequest(selectedRequest?._id === req._id ? null : req);
                                            }}
                                            className="text-slate-400 hover:text-blue-600 transition-colors p-1 rounded hover:bg-blue-50"
                                        >
                                            <MoreVertical size={18} />
                                        </button>
                                        {selectedRequest?._id === req._id && (
                                            <div className="absolute right-0 top-12 w-32 bg-white border border-slate-200 shadow-lg rounded-lg z-10 p-1">
                                                <button onClick={() => { setIsDetailsModalOpen(true); }} className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-md">
                                                    View Details
                                                </button>
                                                <button onClick={() => { openEditModal(req); setSelectedRequest(null); }} className="w-full text-left px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-md">
                                                    Edit
                                                </button>
                                                <button onClick={(e) => { e.stopPropagation(); handleDelete(req); setSelectedRequest(null); }} className="w-full text-left px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md">
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                                    No HSRP requests found
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
                            <h2 className="text-xl font-bold text-slate-900">New HSRP Request</h2>
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
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Vehicle Model</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                                        placeholder="e.g. Hero Splendor"
                                        value={formData.model}
                                        onChange={e => setFormData({ ...formData, model: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Reg. Number</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                                        placeholder="DL 01 AB 1234"
                                        value={formData.regNumber}
                                        onChange={e => setFormData({ ...formData, regNumber: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Chassis No.</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                                        value={formData.chassis}
                                        onChange={e => setFormData({ ...formData, chassis: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Engine No.</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                                        value={formData.engine}
                                        onChange={e => setFormData({ ...formData, engine: e.target.value })}
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
                                Create Request
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
                            <h2 className="text-xl font-bold text-slate-900">Edit HSRP Request</h2>
                            <button onClick={() => { setIsEditModalOpen(false); setFormData({ vendor: '', model: '', regNumber: '', chassis: '', engine: '', priority: 'Normal' }); }} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Vendor</label>
                                <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm" value={formData.vendor} onChange={e => setFormData({ ...formData, vendor: e.target.value })}>
                                    <option value="">Select Vendor</option>
                                    <option value="Meenakshi Polymers">Meenakshi Polymers</option>
                                    <option value="NeoSky India">NeoSky India</option>
                                    <option value="Alpha Tech">Alpha Tech</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Vehicle Model</label>
                                    <input type="text" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm" placeholder="e.g. Hero Splendor" value={formData.model} onChange={e => setFormData({ ...formData, model: e.target.value })} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Reg. Number</label>
                                    <input type="text" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm" placeholder="DL 01 AB 1234" value={formData.regNumber} onChange={e => setFormData({ ...formData, regNumber: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Chassis No.</label>
                                    <input type="text" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm" value={formData.chassis} onChange={e => setFormData({ ...formData, chassis: e.target.value })} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Engine No.</label>
                                    <input type="text" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm" value={formData.engine} onChange={e => setFormData({ ...formData, engine: e.target.value })} />
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                            <button onClick={() => { setIsEditModalOpen(false); setFormData({ vendor: '', model: '', regNumber: '', chassis: '', engine: '', priority: 'Normal' }); }} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
                            <button onClick={handleEditSubmit} className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"><Save size={18} />Update Request</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Details Modal */}
            {isDetailsModalOpen && selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-slate-900">HSRP Request Details</h2>
                            <button onClick={() => setIsDetailsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div><p className="text-xs text-slate-500 uppercase">Request ID</p><p className="text-sm font-medium">{selectedRequest.id}</p></div>
                                <div><p className="text-xs text-slate-500 uppercase">Status</p><p className="text-sm font-medium">{selectedRequest.status}</p></div>
                                <div><p className="text-xs text-slate-500 uppercase">Vendor</p><p className="text-sm font-medium">{selectedRequest.vendor}</p></div>
                                <div><p className="text-xs text-slate-500 uppercase">Vehicle Model</p><p className="text-sm font-medium">{selectedRequest.model}</p></div>
                                <div><p className="text-xs text-slate-500 uppercase">Reg. Number</p><p className="text-sm font-medium">{selectedRequest.regNumber}</p></div>
                            </div>
                        </div>
                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                            <button onClick={() => setIsDetailsModalOpen(false)} className="px-4 py-2 bg-blue-800 text-white rounded-lg">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HSRPRequests;
