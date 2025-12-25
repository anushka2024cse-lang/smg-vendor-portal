import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Download, Eye, CheckCircle, Clock, AlertCircle, XCircle, Edit, Trash2, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import warrantyClaimService from '../../services/warrantyClaimService';

const WarrantyClaimsList = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [selectedClaim, setSelectedClaim] = useState(null);
    const [rejectReason, setRejectReason] = useState('');

    useEffect(() => {
        loadClaims();
    }, []);

    const loadClaims = async () => {
        setLoading(true);
        try {
            const response = await warrantyClaimService.getAllClaims();
            const claimsData = response.data.data.map(claim => ({
                id: claim.claimNumber || claim._id,
                _id: claim._id,
                claimDate: claim.createdAt || claim.submittedDate,
                vehicleModel: claim.vehicleModel,
                chassisNumber: claim.chassisNumber,
                componentName: claim.componentName,
                partNumber: claim.partNumber,
                customerName: claim.customerName,
                dealerName: claim.dealerName,
                status: claim.status,
                claimAmount: claim.totalClaimAmount ? `₹${claim.totalClaimAmount.toLocaleString()}` : '-',
                failureType: claim.failureType,
                warrantyStatus: claim.warrantyStatus,
                pickupScheduled: claim.pickupScheduled,
                workOrderNumber: claim.workOrderNumber,
                defectCode: claim.defectCode
            }));
            setClaims(claimsData);
        } catch (error) {
            console.error('Failed to load warranty claims:', error);
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this draft?')) {
            try {
                await warrantyClaimService.deleteClaim(id);
                loadClaims(); // Refresh list
            } catch (error) {
                console.error('Failed to delete draft:', error);
                alert('Failed to delete draft');
            }
        }
    };

    const handleReject = async () => {
        if (!rejectReason.trim()) {
            alert('Please provide a rejection reason');
            return;
        }
        try {
            await warrantyClaimService.rejectClaim(selectedClaim._id, rejectReason);
            setRejectModalOpen(false);
            setRejectReason('');
            setSelectedClaim(null);
            loadClaims(); // Refresh list
        } catch (error) {
            console.error('Failed to reject claim:', error);
            alert('Failed to reject claim');
        }
    };

    const statusConfig = {
        'Draft': { color: 'slate', icon: FileText, label: 'Draft' },
        'Pending': { color: 'amber', icon: Clock, label: 'Pending' },
        'Under Review': { color: 'blue', icon: Eye, label: 'Under Review' },
        'Approved': { color: 'emerald', icon: CheckCircle, label: 'Approved' },
        'Rejected': { color: 'red', icon: XCircle, label: 'Rejected' },
        'Pending Pickup': { color: 'purple', icon: AlertCircle, label: 'Pending Pickup' }
    };

    const filteredClaims = claims.filter(claim => {
        const matchesSearch =
            claim.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (claim.chassisNumber && claim.chassisNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (claim.componentName && claim.componentName.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (claim.customerName && claim.customerName.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesStatus = statusFilter === 'All' || claim.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: claims.length,
        pending: claims.filter(c => c.status === 'Pending').length,
        approved: claims.filter(c => c.status === 'Approved').length,
        rejected: claims.filter(c => c.status === 'Rejected').length
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Warranty Claims</h1>
                <p className="text-slate-600">Manage and track all warranty claims</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border-2 border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Total Claims</p>
                            <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
                        </div>
                        <div className="p-3 bg-slate-200 rounded-xl">
                            <AlertCircle size={24} className="text-slate-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 border-2 border-amber-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-1">Pending</p>
                            <p className="text-3xl font-bold text-amber-900">{stats.pending}</p>
                        </div>
                        <div className="p-3 bg-amber-200 rounded-xl">
                            <Clock size={24} className="text-amber-700" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border-2 border-emerald-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-1">Approved</p>
                            <p className="text-3xl font-bold text-emerald-900">{stats.approved}</p>
                        </div>
                        <div className="p-3 bg-emerald-200 rounded-xl">
                            <CheckCircle size={24} className="text-emerald-700" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border-2 border-red-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-red-700 uppercase tracking-wide mb-1">Rejected</p>
                            <p className="text-3xl font-bold text-red-900">{stats.rejected}</p>
                        </div>
                        <div className="p-3 bg-red-200 rounded-xl">
                            <XCircle size={24} className="text-red-700" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Actions */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg shadow-slate-200/50 p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    {/* Search */}
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by claim ID, chassis number, component, customer..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                    >
                        <option value="All">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Pending Pickup">Pending Pickup</option>
                    </select>

                    {/* Create Button */}
                    <button
                        onClick={() => navigate('/warranty-claims/create')}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-bold shadow-md shadow-red-200 hover:shadow-lg hover:shadow-red-300"
                    >
                        <Plus size={18} />
                        New Claim
                    </button>
                </div>
            </div>

            {/* Claims Table */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg shadow-slate-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b-2 border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xxs font-bold text-slate-700 uppercase tracking-wider">Claim ID</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Vehicle</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Component</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Dealer</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="9" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                            <p className="text-slate-500">Loading warranty claims...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredClaims.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="px-6 py-12 text-center text-slate-500">
                                        No warranty claims found
                                    </td>
                                </tr>
                            ) : (
                                filteredClaims.map((claim) => {
                                    const StatusIcon = statusConfig[claim.status].icon;
                                    const statusColor = statusConfig[claim.status].color;

                                    return (
                                        <tr key={claim.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-slate-900 text-sm">{claim.id}</span>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-slate-600">
                                                {new Date(claim.claimDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="text-xs font-semibold text-slate-900">{claim.vehicleModel}</p>
                                                    <p className="text-xxs text-slate-500">{claim.chassisNumber}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="text-xs font-semibold text-slate-900">{claim.componentName}</p>
                                                    <p className="text-xxs text-slate-500">{claim.partNumber}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-slate-600">
                                                {claim.customerName}
                                            </td>
                                            <td className="px-6 py-4 text-xs text-slate-600">
                                                {claim.dealerName}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-slate-900 text-sm">{claim.claimAmount}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-${statusColor}-100 text-${statusColor}-700`}>
                                                    <StatusIcon size={14} />
                                                    {claim.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => navigate(`/warranty-claims/${claim._id}`)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                        title="View Details"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/warranty-claims/${claim._id}/edit`)}
                                                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                                                        title="Edit"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    {claim.status === 'Draft' ? (
                                                        <button
                                                            onClick={() => handleDelete(claim._id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                            title="Delete Draft"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => {
                                                                setSelectedClaim(claim);
                                                                setRejectModalOpen(true);
                                                            }}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                            title="Reject Claim"
                                                        >
                                                            <XCircle size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Reject Modal */}
            {rejectModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Reject Warranty Claim</h3>
                        <p className="text-sm text-slate-600 mb-4">
                            Claim: <span className="font-semibold">{selectedClaim?.id}</span>
                        </p>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Rejection Reason *
                        </label>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Provide reason for rejection..."
                            className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none resize-none"
                            rows="4"
                        ></textarea>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setRejectModalOpen(false);
                                    setRejectReason('');
                                    setSelectedClaim(null);
                                }}
                                className="flex-1 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-semibold"
                            >
                                Reject Claim
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WarrantyClaimsList;
