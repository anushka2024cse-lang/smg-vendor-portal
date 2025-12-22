import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    Filter,
    Plus,
    MoreVertical,
    Eye,
    Edit,
    Ban,
    FileText,
    X,
    Save,
    CheckCircle,
    Clock
} from 'lucide-react';

const VendorList = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [vendors, setVendors] = useState([]);

    // Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingVendor, setEditingVendor] = useState(null);

    // Initial Load
    React.useEffect(() => {
        loadVendors();
    }, []);

    const loadVendors = async () => {
        const data = await vendorService.getAllVendors();
        setVendors(data);
    };

    const handleVendorBlock = async (vendorId) => {
        const vendor = vendors.find(v => v.id === vendorId);
        if (vendor) {
            const newStatus = vendor.status === 'Blocked' ? 'Active' : 'Blocked';
            await vendorService.updateVendor({ ...vendor, status: newStatus });
            loadVendors(); // Refresh list
        }
    };

    const handleEditClick = (vendor) => {
        setEditingVendor({ ...vendor });
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = async () => {
        if (editingVendor) {
            await vendorService.updateVendor(editingVendor);
            setIsEditModalOpen(false);
            setEditingVendor(null);
            loadVendors(); // Refresh to show changes
        }
    };

    const filteredVendors = vendors.filter(vendor => {
        const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vendor.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || vendor.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-700 border-green-200';
            case 'Blocked': return 'bg-red-100 text-red-700 border-red-200';
            case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 relative">

            {/* Top Header Section */}
            <div className="space-y-4">
                {/* Breadcrumb Removed */}

                {/* Title & Actions Row */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Vendor Directory</h1>
                        <p className="text-slate-500 mt-1">Manage and monitor all your supplier relationships.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium">
                            <FileText size={18} />
                            Export CSV
                        </button>
                        <button
                            onClick={() => navigate('/vendor/onboarding')}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-all shadow-md hover:shadow-lg font-medium"
                        >
                            <Plus size={18} />
                            Add New Vendor
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Vendors</p>
                    <div className="flex items-end justify-between mt-2">
                        <h3 className="text-2xl font-bold text-slate-900">{vendors.length}</h3>
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <MoreVertical size={20} />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Active</p>
                    <div className="flex items-end justify-between mt-2">
                        <h3 className="text-2xl font-bold text-emerald-700">{vendors.filter(v => v.status === 'Active').length}</h3>
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                            <CheckCircle size={20} />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Pending</p>
                    <div className="flex items-end justify-between mt-2">
                        <h3 className="text-2xl font-bold text-amber-600">{vendors.filter(v => v.status === 'Pending').length}</h3>
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                            <Clock size={20} />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Blocked</p>
                    <div className="flex items-end justify-between mt-2">
                        <h3 className="text-2xl font-bold text-red-600">{vendors.filter(v => v.status === 'Blocked').length}</h3>
                        <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                            <Ban size={20} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters Toolbar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by vendor name or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all text-sm"
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600">
                        <Filter size={16} />
                        <span className="font-medium">Filter Status:</span>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-transparent border-none focus:ring-0 p-0 text-slate-900 font-semibold cursor-pointer"
                        >
                            <option value="All">All Statuses</option>
                            <option value="Active">Active</option>
                            <option value="Pending">Pending</option>
                            <option value="Blocked">Blocked</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Data Grid */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Vendor Code</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Company Name</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Business Type</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Primary Contact</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">City</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredVendors.map((vendor) => (
                            <tr
                                key={vendor.id}
                                onClick={() => navigate(`/vendor/details/${vendor.id}`)}
                                className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                            >
                                <td className="px-6 py-4">
                                    <span className="font-mono text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">{vendor.id}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-900">{vendor.name}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">{vendor.type}</td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                                            {vendor.contact.charAt(0)}
                                        </div>
                                        {vendor.contact}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">{vendor.city}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(vendor.status)}`}>
                                        {vendor.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/vendor/details/${vendor.id}`);
                                            }}
                                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="View Details"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditClick(vendor);
                                            }}
                                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors" title="Edit Vendor"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleVendorBlock(vendor.id);
                                            }}
                                            className={`p-1.5 rounded-md transition-colors ${vendor.status === 'Blocked' ? 'text-red-600 bg-red-50 hover:bg-red-100' : 'text-slate-400 hover:text-red-600 hover:bg-red-50'}`}
                                            title={vendor.status === 'Blocked' ? "Unblock Vendor" : "Block Vendor"}
                                        >
                                            <Ban size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredVendors.length === 0 && (
                    <div className="p-12 text-center text-slate-500">
                        <p className="text-lg font-medium">No vendors found</p>
                        <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {
                isEditModalOpen && editingVendor && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="flex items-center justify-between p-6 border-b border-slate-100">
                                <h2 className="text-xl font-bold text-slate-900">Edit Vendor Details</h2>
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Company Name</label>
                                    <input
                                        type="text"
                                        value={editingVendor.name}
                                        onChange={(e) => setEditingVendor({ ...editingVendor, name: e.target.value })}
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700">Business Type</label>
                                        <select
                                            value={editingVendor.type}
                                            onChange={(e) => setEditingVendor({ ...editingVendor, type: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                                        >
                                            <option value="Pvt Ltd">Pvt Ltd</option>
                                            <option value="Ltd">Ltd</option>
                                            <option value="Proprietorship">Proprietorship</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700">City</label>
                                        <input
                                            type="text"
                                            value={editingVendor.city}
                                            onChange={(e) => setEditingVendor({ ...editingVendor, city: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Primary Contact</label>
                                    <input
                                        type="text"
                                        value={editingVendor.contact}
                                        onChange={(e) => setEditingVendor({ ...editingVendor, contact: e.target.value })}
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Status</label>
                                    <select
                                        value={editingVendor.status}
                                        onChange={(e) => setEditingVendor({ ...editingVendor, status: e.target.value })}
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Blocked">Blocked</option>
                                        <option value="Pending">Pending</option>
                                    </select>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    className="px-4 py-2 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors flex items-center gap-2"
                                >
                                    <Save size={18} />
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

        </div >
    );
};



export default VendorList;
