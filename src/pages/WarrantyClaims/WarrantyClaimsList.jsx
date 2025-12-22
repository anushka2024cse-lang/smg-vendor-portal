import React, { useState } from 'react';
import { Search, Filter, Plus, Download, Eye, CheckCircle, Clock, AlertCircle, XCircle, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WarrantyClaimsList = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    // Mock data based on CRM warranty claims
    const [claims, setClaims] = useState([
        {
            id: 'WC-2024-001',
            claimDate: '2024-12-15',
            vehicleModel: 'E-Scooter X1',
            chassisNumber: 'CH12345678',
            componentName: 'Battery Pack',
            partNumber: 'BP-48V-30AH',
            customerName: 'Rajesh Kumar',
            dealerName: 'Delhi Motors',
            status: 'Pending',
            claimAmount: '₹25,000',
            failureType: 'Manufacturing Defect',
            submittedBy: 'Dealer',
            warrantyStatus: 'In Warranty',
            pickupScheduled: '2024-12-20'
        },
        {
            id: 'WC-2024-002',
            claimDate: '2024-12-18',
            vehicleModel: 'E-Scooter Pro',
            chassisNumber: 'CH87654321',
            componentName: 'Motor Controller',
            partNumber: 'MC-3000W',
            customerName: 'Priya Sharma',
            dealerName: 'Mumbai Auto Services',
            status: 'Approved',
            claimAmount: '₹18,500',
            failureType: 'Electrical Failure',
            submittedBy: 'Service Center',
            warrantyStatus: 'In Warranty',
            pickupScheduled: '2024-12-19'
        },
        {
            id: 'WC-2024-003',
            claimDate: '2024-12-20',
            vehicleModel: 'E-Scooter Lite',
            chassisNumber: 'CH11223344',
            componentName: 'Display Unit',
            partNumber: 'DU-LCD-7INCH',
            customerName: 'Amit Patel',
            dealerName: 'Bangalore E-Vehicles',
            status: 'Under Review',
            claimAmount: '₹8,000',
            failureType: 'Material Defect',
            submittedBy: 'Dealer',
            warrantyStatus: 'In Warranty',
            pickupScheduled: '2024-12-22'
        },
        {
            id: 'WC-2024-004',
            claimDate: '2024-12-10',
            vehicleModel: 'E-Scooter X1',
            chassisNumber: 'CH99887766',
            componentName: 'Brake Assembly',
            partNumber: 'BA-DISC-FR',
            customerName: 'Neha Gupta',
            dealerName: 'Chennai Auto Hub',
            status: 'Rejected',
            claimAmount: '₹5,500',
            failureType: 'Premature Wear',
            submittedBy: 'Service Center',
            warrantyStatus: 'Out of Warranty',
            pickupScheduled: null
        },
        {
            id: 'WC-2024-005',
            claimDate: '2024-12-22',
            vehicleModel: 'E-Scooter Pro',
            chassisNumber: 'CH55443322',
            componentName: 'Charger Unit',
            partNumber: 'CU-48V-5A',
            customerName: 'Vikram Singh',
            dealerName: 'Delhi Motors',
            status: 'Pending Pickup',
            claimAmount: '₹12,000',
            failureType: 'Corrosion',
            submittedBy: 'Dealer',
            warrantyStatus: 'In Warranty',
            pickupScheduled: '2024-12-23'
        }
    ]);

    const statusConfig = {
        'Pending': { color: 'amber', icon: Clock, label: 'Pending' },
        'Under Review': { color: 'blue', icon: Eye, label: 'Under Review' },
        'Approved': { color: 'emerald', icon: CheckCircle, label: 'Approved' },
        'Rejected': { color: 'red', icon: XCircle, label: 'Rejected' },
        'Pending Pickup': { color: 'purple', icon: AlertCircle, label: 'Pending Pickup' }
    };

    const filteredClaims = claims.filter(claim => {
        const matchesSearch =
            claim.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            claim.chassisNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            claim.componentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            claim.customerName.toLowerCase().includes(searchQuery.toLowerCase());

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
                            {filteredClaims.length === 0 ? (
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
                                                        onClick={() => navigate(`/warranty-claims/${claim.id}`)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                        title="View Details"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/warranty-claims/${claim.id}/edit`)}
                                                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                                                        title="Edit"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
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
        </div>
    );
};

export default WarrantyClaimsList;
