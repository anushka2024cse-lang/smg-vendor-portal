import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Package,
    AlertCircle,
    Clock,
    CheckCircle2,
    XCircle,
    MoreVertical,
    X,
    Save,
    Printer
} from 'lucide-react';
import { sparePartService } from '../../services/sparePartService';
import { printSparePartRequest } from '../../utils/printSparePartRequest';
import Pagination from '../../components/Pagination';

const SparePartRequests = () => {
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0 });
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

    // Form State
    const [formData, setFormData] = useState({
        vendor: '',
        component: '',
        quantity: '',
        priority: 'Medium',
        reason: '',
        dueDate: ''
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
                sparePartService.getStats(),
                sparePartService.getAllRequests({ page: currentPage, limit: itemsPerPage })
            ]);
            setStats(statsData);
            setRequests(response.data || []);
            setPagination(response.pagination || {});
        } catch (error) {
            console.error('Failed to load spare part requests:', error);
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
                    (r.component && r.component.toLowerCase().includes(searchTerm.toLowerCase()))
                )
            );
        }
        setFilteredRequests(result);
    };

    const handleCreateSubmit = async () => {
        try {
            await sparePartService.createRequest(formData);
            setIsCreateModalOpen(false);
            setFormData({ vendor: '', component: '', quantity: '', priority: 'Medium', reason: '', dueDate: '' });
            loadData();
        } catch (error) {
            alert('Failed to create request');
        }
    };

    const handleEditSubmit = async () => {
        try {
            await sparePartService.updateRequest(selectedRequest._id, formData);
            setIsEditModalOpen(false);
            setFormData({ vendor: '', component: '', quantity: '', priority: 'Medium', reason: '', dueDate: '' });
            setSelectedRequest(null);
            loadData();
        } catch (error) {
            alert('Failed to update request');
        }
    };

    const handleDelete = async (request) => {
        if (window.confirm(`Are you sure you want to delete request ${request.id}?`)) {
            try {
                await sparePartService.deleteRequest(request._id);
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
            component: request.component,
            quantity: request.quantity,
            priority: request.priority,
            reason: request.reason || '',
            dueDate: request.dueDate || '',
            status: request.status
        });
        setIsEditModalOpen(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-700 border-green-200';
            case 'Pending': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Spare Part Requests</h1>
                    <p className="text-slate-500 mt-1">Manage spare part requests from vendors</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-all shadow-md font-medium"
                >
                    <Plus size={18} />
                    New Request
                </button>
            </div>

            {/* Stats Cards - PO Style */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-xs font-medium uppercase">Total Requests</p>
                        <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                    </div>
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Package size={20} /></div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-xs font-medium uppercase">Pending Review</p>
                        <p className="text-2xl font-bold text-slate-900">{stats.pending}</p>
                    </div>
                    <div className="p-3 bg-orange-100 text-orange-600 rounded-lg"><Clock size={20} /></div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-xs font-medium uppercase">Approved</p>
                        <p className="text-2xl font-bold text-green-700">{stats.approved}</p>
                    </div>
                    <div className="p-3 bg-green-100 text-green-600 rounded-lg"><CheckCircle2 size={20} /></div>
                </div>
            </div>

            {/* Main Content Card - PO Style */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden min-h-[400px]">

                {/* Toolbar */}
                <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
                    {/* Tabs */}
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        {['All', 'Pending', 'Approved', 'Rejected'].map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${statusFilter === status
                                    ? 'bg-white text-blue-900 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search requests..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-sm"
                        />
                    </div>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Request ID</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Vendor</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Component</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Quantity</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</th>
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
                                    <td className="px-6 py-4 text-sm text-slate-600">{req.component}</td>
                                    <td className="px-6 py-4 text-sm text-slate-900 font-bold">{req.quantity}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{req.date}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${req.priority === 'High' ? 'bg-red-50 text-red-600' :
                                            req.priority === 'Medium' ? 'bg-yellow-50 text-yellow-600' :
                                                'bg-slate-100 text-slate-600'
                                            }`}>
                                            {req.priority}
                                        </span>
                                    </td>
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
                                                <button onClick={() => { printSparePartRequest(req); setSelectedRequest(null); }} className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-md">
                                                    Print
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
                                    No requests found
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

            {/* Create Modal - Document Style */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-900 rounded-lg text-white">
                                    <Package size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">New Spare Part Requisition</h2>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-0.5">FORM-SPR-2024</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-200 rounded-full"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body - Scrollable Form */}
                        <div className="p-8 overflow-y-auto bg-slate-50/50">
                            <div className="max-w-2xl mx-auto bg-white border border-slate-200 shadow-sm rounded-xl p-8">

                                {/* Form Section Title */}
                                <div className="mb-6 border-b border-slate-100 pb-4">
                                    <h3 className="text-sm font-bold text-blue-900 uppercase tracking-widest">Requisition Details</h3>
                                    <p className="text-xs text-slate-500 mt-1">Please fill in the required component and vendor information.</p>
                                </div>

                                <div className="space-y-6">
                                    {/* Primary Info Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase">Vendor Selection</label>
                                            <select
                                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium transition-all"
                                                value={formData.vendor}
                                                onChange={e => setFormData({ ...formData, vendor: e.target.value })}
                                            >
                                                <option value="">Select Vendor...</option>
                                                <option value="Meenakshi Polymers">Meenakshi Polymers</option>
                                                <option value="NeoSky India">NeoSky India</option>
                                                <option value="Alpha Tech">Alpha Tech</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase">Required By (Date)</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                                    <Clock size={16} />
                                                </div>
                                                <input
                                                    type="date"
                                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium transition-all"
                                                    value={formData.dueDate}
                                                    onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Component Details */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Component Description</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium transition-all"
                                            placeholder="Enter component name, ID, or specification..."
                                            value={formData.component}
                                            onChange={e => setFormData({ ...formData, component: e.target.value })}
                                        />
                                    </div>

                                    {/* Qty & Priority */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase">Quantity Required</label>
                                            <input
                                                type="number"
                                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium transition-all"
                                                placeholder="0"
                                                value={formData.quantity}
                                                onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase">Priority Level</label>
                                            <div className="flex gap-2">
                                                {['Low', 'Medium', 'High'].map((p) => (
                                                    <button
                                                        key={p}
                                                        onClick={() => setFormData({ ...formData, priority: p })}
                                                        className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${formData.priority === p
                                                            ? 'bg-blue-50 border-blue-200 text-blue-700 ring-1 ring-blue-500/20'
                                                            : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                                                            }`}
                                                    >
                                                        {p}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Reason */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Reason / Remarks (Optional)</label>
                                        <textarea
                                            rows="3"
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium transition-all resize-none"
                                            placeholder="Why is this spare part needed?"
                                            value={formData.reason}
                                            onChange={e => setFormData({ ...formData, reason: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Form Footer */}
                                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                                    <p>SMG-SPR-V1.0</p>
                                    <p>Authorized Signature Required upon Approval</p>
                                </div>

                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 bg-white border-t border-slate-200 flex justify-end gap-3 z-10">
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-lg transition-colors text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateSubmit}
                                className="px-6 py-2.5 bg-blue-900 text-white font-bold rounded-lg hover:bg-blue-800 transition-all shadow-lg hover:shadow-xl text-sm flex items-center gap-2 transform active:scale-95 duration-150"
                            >
                                <Save size={18} />
                                Submit Requisition
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal - Document Style */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-900 rounded-lg text-white">
                                    <Package size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">Edit Requisition</h2>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-0.5">UPDATE REQUEST DETAILS</p>
                                </div>
                            </div>
                            <button
                                onClick={() => { setIsEditModalOpen(false); setFormData({ vendor: '', component: '', quantity: '', priority: 'Medium', reason: '', dueDate: '', status: 'Pending' }); }}
                                className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-200 rounded-full"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto bg-slate-50/50">
                            <div className="max-w-2xl mx-auto bg-white border border-slate-200 shadow-sm rounded-xl p-8">
                                <div className="space-y-6">
                                    {/* Admin Status Section */}
                                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                        <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Current Status</label>
                                        <div className="flex gap-2">
                                            {['Pending', 'Approved', 'Rejected'].map((s) => (
                                                <button
                                                    key={s}
                                                    onClick={() => setFormData({ ...formData, status: s })}
                                                    className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${formData.status === s
                                                            ? s === 'Approved' ? 'bg-green-50 border-green-200 text-green-700 ring-1 ring-green-500/20'
                                                                : s === 'Rejected' ? 'bg-red-50 border-red-200 text-red-700 ring-1 ring-red-500/20'
                                                                    : 'bg-orange-50 border-orange-200 text-orange-700 ring-1 ring-orange-500/20'
                                                            : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                                                        }`}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Primary Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase">Vendor Selection</label>
                                            <select
                                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium transition-all"
                                                value={formData.vendor}
                                                onChange={e => setFormData({ ...formData, vendor: e.target.value })}
                                            >
                                                <option value="">Select Vendor...</option>
                                                <option value="Meenakshi Polymers">Meenakshi Polymers</option>
                                                <option value="NeoSky India">NeoSky India</option>
                                                <option value="Alpha Tech">Alpha Tech</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase">Required By (Date)</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                                    <Clock size={16} />
                                                </div>
                                                <input
                                                    type="date"
                                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium transition-all"
                                                    value={formData.dueDate}
                                                    onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Component */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Component Description</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium transition-all"
                                            value={formData.component}
                                            onChange={e => setFormData({ ...formData, component: e.target.value })}
                                        />
                                    </div>

                                    {/* Qty & Priority */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase">Quantity Required</label>
                                            <input
                                                type="number"
                                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium transition-all"
                                                value={formData.quantity}
                                                onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase">Priority Level</label>
                                            <select
                                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium transition-all"
                                                value={formData.priority}
                                                onChange={e => setFormData({ ...formData, priority: e.target.value })}
                                            >
                                                <option value="Low">Low</option>
                                                <option value="Medium">Medium</option>
                                                <option value="High">High</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Reason */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Reason / Remarks (Optional)</label>
                                        <textarea
                                            rows="3"
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium transition-all resize-none"
                                            value={formData.reason}
                                            onChange={e => setFormData({ ...formData, reason: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-white border-t border-slate-200 flex justify-end gap-3 z-10">
                            <button
                                onClick={() => { setIsEditModalOpen(false); setFormData({ vendor: '', component: '', quantity: '', priority: 'Medium', reason: '', dueDate: '' }); }}
                                className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-lg transition-colors text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditSubmit}
                                className="px-6 py-2.5 bg-blue-900 text-white font-bold rounded-lg hover:bg-blue-800 transition-all shadow-lg hover:shadow-xl text-sm flex items-center gap-2 transform active:scale-95 duration-150"
                            >
                                <Save size={18} />
                                Update Request
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Details Modal */}
            {isDetailsModalOpen && selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Request Details</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="font-mono text-sm text-slate-500">{selectedRequest.id}</span>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedRequest.status)}`}>
                                        {selectedRequest.status}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {selectedRequest.status === 'Pending' && (
                                    <>
                                        <button
                                            onClick={async () => {
                                                await sparePartService.updateRequest(selectedRequest._id, { ...selectedRequest, status: 'Approved' });
                                                loadData();
                                                setIsDetailsModalOpen(false);
                                            }}
                                            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm font-bold text-sm flex items-center gap-2"
                                        >
                                            <CheckCircle2 size={16} />
                                            Approve
                                        </button>
                                        <button
                                            onClick={async () => {
                                                await sparePartService.updateRequest(selectedRequest._id, { ...selectedRequest, status: 'Rejected' });
                                                loadData();
                                                setIsDetailsModalOpen(false);
                                            }}
                                            className="px-3 py-2 bg-red-100 text-red-700 border border-red-200 rounded-lg hover:bg-red-200 transition-colors font-bold text-sm flex items-center gap-2"
                                        >
                                            <XCircle size={16} />
                                            Reject
                                        </button>
                                        <div className="w-px h-8 bg-slate-200 mx-1"></div>
                                    </>
                                )}
                                <button
                                    onClick={() => printSparePartRequest(selectedRequest)}
                                    className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium text-sm"
                                >
                                    <Printer size={16} />
                                </button>
                                <button
                                    onClick={() => setIsDetailsModalOpen(false)}
                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8 overflow-y-auto bg-white">
                            {/* Parties Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">From Vendor</h4>
                                    <div className="text-lg font-bold text-slate-900">{selectedRequest.vendor}</div>
                                    <div className="text-sm text-slate-600 mt-1">Vendor ID: {selectedRequest.vendorId || 'N/A'}</div>
                                </div>
                                <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">To Company</h4>
                                    <div className="text-lg font-bold text-slate-900">SMG Electric Scooters</div>
                                    <div className="text-sm text-slate-600 mt-1">Noida Plant 1</div>
                                </div>
                            </div>

                            {/* Item Table */}
                            <div className="border border-slate-200 rounded-xl overflow-hidden mb-8">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-800 text-white">
                                        <tr>
                                            <th className="px-6 py-3 font-medium cursor-default">Component Name</th>
                                            <th className="px-6 py-3 font-medium cursor-default text-center">Quantity</th>
                                            <th className="px-6 py-3 font-medium cursor-default">Priority</th>
                                            <th className="px-6 py-3 font-medium cursor-default">Due Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-slate-100">
                                        <tr>
                                            <td className="px-6 py-4 font-medium text-slate-900">{selectedRequest.component}</td>
                                            <td className="px-6 py-4 text-center font-bold text-slate-900">{selectedRequest.quantity}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${selectedRequest.priority === 'High' ? 'bg-red-50 text-red-700' :
                                                    selectedRequest.priority === 'Medium' ? 'bg-orange-50 text-orange-700' :
                                                        'bg-blue-50 text-blue-700'
                                                    }`}>
                                                    {selectedRequest.priority}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500">{selectedRequest.dueDate || 'N/A'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Additional Info */}
                            {selectedRequest.reason && (
                                <div>
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Reason / Remarks</h4>
                                    <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-100">
                                        {selectedRequest.reason}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                            <button onClick={() => setIsDetailsModalOpen(false)} className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm">
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SparePartRequests;
